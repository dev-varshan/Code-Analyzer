// dataFlow.js

/**
 * Helper function to detect if a line is a comment or should be skipped
 */
function isCommentOrStringContext(line) {
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) return true;

  // Skip comment lines
  if (trimmed.startsWith("#")) return true;

  // Skip docstrings (triple quotes)
  if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) return true;

  return false;
}

/**
 * Check if a pattern match is inside a string literal
 * This prevents false positives like: msg = "Use eval() carefully"
 */
function isInsideString(line, matchIndex) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let i = 0; i < matchIndex; i++) {
    const char = line[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    }
  }

  return inSingleQuote || inDoubleQuote;
}

/**
 * Extract all variables that are tainted (contain user input)
 * Supports multi-hop propagation and various Python constructs
 */
export function extractTaintedVariables(codeLines) {
  const taintedVars = new Set();
  const maxIterations = 5; // Multi-hop propagation limit

  // Track multi-line docstrings
  let inDocstring = false;
  let docstringDelimiter = null;

  // Multiple passes to catch multi-hop taint propagation
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let foundNew = false;

    // Reset docstring tracking for each iteration
    inDocstring = false;
    docstringDelimiter = null;

    codeLines.forEach((line) => {
      const trimmed = line.trim();

      // Check for docstring start/end
      if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        const delimiter = trimmed.substring(0, 3);

        if (!inDocstring) {
          inDocstring = true;
          docstringDelimiter = delimiter;

          // Check if docstring ends on same line
          const restOfLine = trimmed.substring(3);
          if (restOfLine.includes(delimiter)) {
            inDocstring = false;
            docstringDelimiter = null;
          }
          return;
        } else if (delimiter === docstringDelimiter) {
          inDocstring = false;
          docstringDelimiter = null;
          return;
        }
      }

      // Skip if inside docstring
      if (inDocstring) {
        return;
      }

      // Skip comments and empty lines
      if (isCommentOrStringContext(line)) {
        return;
      }

      // 1. Detect direct user input sources
      if (line.includes("input(") || line.includes("sys.argv")) {
        const variable = line.split("=")[0]?.trim();
        if (variable && !taintedVars.has(variable)) {
          taintedVars.add(variable);
          foundNew = true;
        }
      }

      // 2. Detect variable assignments
      const assignmentMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignmentMatch) {
        const [, leftVar, rightSide] = assignmentMatch;

        // Skip if already tainted
        if (taintedVars.has(leftVar)) return;

        // Check if right side contains any tainted variable
        let isTainted = false;

        taintedVars.forEach((tainted) => {
          // Direct usage: x = user_input
          if (rightSide.includes(tainted)) {
            isTainted = true;
          }
        });

        if (isTainted) {
          taintedVars.add(leftVar);
          foundNew = true;
        }

        // 3. String formatting operations
        // Format: msg = "Hello {}".format(user_input)
        if (rightSide.includes(".format(")) {
          const formatArgs = rightSide.match(/\.format\(([^)]+)\)/);
          if (formatArgs) {
            const args = formatArgs[1].split(",").map(a => a.trim());
            args.forEach(arg => {
              if (taintedVars.has(arg)) {
                taintedVars.add(leftVar);
                foundNew = true;
              }
            });
          }
        }

        // 4. F-strings: msg = f"Hello {user_input}"
        if (rightSide.includes("f\"") || rightSide.includes("f'")) {
          taintedVars.forEach((tainted) => {
            if (rightSide.includes(`{${tainted}}`)) {
              taintedVars.add(leftVar);
              foundNew = true;
            }
          });
        }

        // 5. String concatenation: msg = "Hello " + user_input
        if (rightSide.includes("+")) {
          const parts = rightSide.split("+").map(p => p.trim());
          parts.forEach(part => {
            // Remove quotes to get variable name
            const cleaned = part.replace(/['"]/g, "");
            if (taintedVars.has(cleaned)) {
              taintedVars.add(leftVar);
              foundNew = true;
            }
          });
        }
      }

      // 6. Function calls with tainted arguments
      // Example: process(user_input)
      const funcCallMatch = line.match(/(\w+)\s*\(([^)]+)\)/);
      if (funcCallMatch) {
        const [, funcName, args] = funcCallMatch;
        const argList = args.split(",").map(a => a.trim());

        argList.forEach(arg => {
          if (taintedVars.has(arg)) {
            // Mark the function result as tainted if assigned
            const resultMatch = line.match(/^(\w+)\s*=/);
            if (resultMatch) {
              taintedVars.add(resultMatch[1]);
              foundNew = true;
            }
          }
        });
      }

      // 7. List/Dict operations
      // append: items.append(user_input)
      if (line.includes(".append(") || line.includes(".extend(")) {
        const listOpMatch = line.match(/(\w+)\.(append|extend)\(([^)]+)\)/);
        if (listOpMatch) {
          const [, listVar, , arg] = listOpMatch;
          if (taintedVars.has(arg.trim())) {
            taintedVars.add(listVar);
            foundNew = true;
          }
        }
      }

      // List indexing: items[0] = user_input
      const indexAssignMatch = line.match(/(\w+)\[.+\]\s*=\s*(.+)/);
      if (indexAssignMatch) {
        const [, listVar, value] = indexAssignMatch;
        if (taintedVars.has(value.trim())) {
          taintedVars.add(listVar);
          foundNew = true;
        }
      }
    });

    // Stop if no new tainted variables found
    if (!foundNew) break;
  }

  return Array.from(taintedVars);
}

/**
 * Find all locations where dangerous sinks are used
 */
export function findSinkUsage(codeLines, sinks) {
  const hits = [];

  // Track multi-line docstrings
  let inDocstring = false;
  let docstringDelimiter = null;

  codeLines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for docstring start/end
    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      const delimiter = trimmed.substring(0, 3);

      if (!inDocstring) {
        inDocstring = true;
        docstringDelimiter = delimiter;

        // Check if docstring ends on same line
        const restOfLine = trimmed.substring(3);
        if (restOfLine.includes(delimiter)) {
          inDocstring = false;
          docstringDelimiter = null;
        }
        return;
      } else if (delimiter === docstringDelimiter) {
        inDocstring = false;
        docstringDelimiter = null;
        return;
      }
    }

    // Skip if inside docstring
    if (inDocstring) {
      return;
    }

    // Skip comments and empty lines
    if (isCommentOrStringContext(line)) {
      return;
    }

    sinks.forEach((sink) => {
      // More precise sink detection
      // Check for the sink as a function call or method
      const sinkPattern = new RegExp(`\\b${sink.replace('.', '\\.')}\\s*\\(`);
      const match = sinkPattern.exec(line);

      if (match) {
        // Check if match is inside a string literal
        const matchIndex = match.index;
        if (isInsideString(line, matchIndex)) {
          return; // Skip if inside string
        }

        hits.push({
          sink,
          line: index + 1,
          code: line.trim(),
        });
      }
    });
  });

  return hits;
}

