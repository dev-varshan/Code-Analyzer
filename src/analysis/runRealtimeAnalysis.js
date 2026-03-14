import { realtimeRules } from "./realtimeRules";

/**
 * Strip the inline comment portion of a line (text after an unquoted #).
 * e.g.  x = 1  # eval() is bad   →  x = 1
 * This prevents pattern matches firing on comment text.
 */
function stripInlineComment(line) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    // Unquoted # → everything from here is a comment
    if (char === "#" && !inSingleQuote && !inDoubleQuote) {
      return line.substring(0, i).trimEnd();
    }
  }

  return line;
}

/**
 * Helper function to detect if a line is a comment or inside a string literal.
 * This reduces false positives from pattern matching.
 */
function isCommentOrStringContext(line) {
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) return true;

  // Skip full-line comment
  if (trimmed.startsWith("#")) return true;

  // Skip docstrings (triple quotes)
  if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) return true;

  return false;
}

/**
 * Check if a pattern match is inside a string literal.
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

    if (char === "\\") {
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

export function runRealtimeAnalysis(code) {
  const findings = [];
  const lines = code.split("\n");
  const seen = new Set(); // For deduplication: "ruleId-lineNumber"

  // Track multi-line docstrings
  let inDocstring = false;
  let docstringDelimiter = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for docstring start/end
    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      const delimiter = trimmed.substring(0, 3);

      if (!inDocstring) {
        // Starting a docstring
        inDocstring = true;
        docstringDelimiter = delimiter;

        // Check if docstring ends on same line
        const restOfLine = trimmed.substring(3);
        if (restOfLine.includes(delimiter)) {
          inDocstring = false;
          docstringDelimiter = null;
        }
        return; // Skip this line
      } else if (delimiter === docstringDelimiter) {
        // Ending a docstring
        inDocstring = false;
        docstringDelimiter = null;
        return; // Skip this line
      }
    }

    // Skip if inside docstring
    if (inDocstring) {
      return;
    }

    // Skip full-line comments and empty lines
    if (isCommentOrStringContext(line)) {
      return;
    }

    // Strip inline comment before pattern matching to avoid false positives
    // e.g. `x = 1  # eval() is dangerous` should NOT trigger PY_EVAL
    const lineForMatching = stripInlineComment(line);

    realtimeRules.forEach((rule) => {
      const match = rule.pattern.exec(lineForMatching);

      if (match) {
        const lineNumber = index + 1;
        const dedupeKey = `${rule.id}-${lineNumber}`;

        // Skip if already found
        if (seen.has(dedupeKey)) {
          return;
        }

        // Check if match is inside a string literal
        const matchIndex = match.index;
        if (isInsideString(lineForMatching, matchIndex)) {
          return;
        }

        // Add to findings
        seen.add(dedupeKey);
        findings.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          message: rule.message,
          line: lineNumber,
          code: line.trim(), // show original line (with comment) to user
        });
      }
    });
  });

  return findings;
}
