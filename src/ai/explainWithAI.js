import { callLLM } from "./providers";
import { buildPrompt } from "./prompts";

/**
 * Extract smart context around the vulnerable line
 * Includes variable definitions, function context, and relevant imports
 */
function extractSmartContext(lines, issueLineNumber) {
  const contextLines = [];
  const issueIndex = issueLineNumber - 1;
  const issueLine = lines[issueIndex];

  // Find variables used in the vulnerable line
  const variablesInLine = issueLine.match(/\b[a-zA-Z_]\w*\b/g) || [];
  const variableDefinitions = new Set();

  // Look for variable definitions in earlier lines
  for (let i = 0; i < issueIndex; i++) {
    const line = lines[i];

    // Check for variable assignments
    const assignMatch = line.match(/^(\w+)\s*=/);
    if (assignMatch) {
      const varName = assignMatch[1];
      if (variablesInLine.includes(varName)) {
        variableDefinitions.add(i);
      }
    }

    // Check for imports that might be relevant
    if (line.trim().startsWith("import ") || line.trim().startsWith("from ")) {
      // Include imports if they're related to the vulnerability
      const importMatch = line.match(/import\s+(\w+)|from\s+(\w+)/);
      if (importMatch) {
        const module = importMatch[1] || importMatch[2];
        if (issueLine.includes(module)) {
          variableDefinitions.add(i);
        }
      }
    }
  }

  // Find function context (if the vulnerable line is inside a function)
  let functionStartLine = -1;
  let indentLevel = 0;

  for (let i = issueIndex; i >= 0; i--) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("def ")) {
      functionStartLine = i;
      break;
    }

    // Stop if we hit a class or another top-level construct
    if (trimmed.startsWith("class ") && i < issueIndex - 1) {
      break;
    }
  }

  // Build context window
  const baseStart = Math.max(issueIndex - 3, 0);
  const baseEnd = Math.min(issueIndex + 3, lines.length);

  // Include function definition if found
  if (functionStartLine >= 0 && functionStartLine < baseStart) {
    contextLines.push(lines[functionStartLine]);
    contextLines.push("    # ... (function body)");
  }

  // Include relevant variable definitions
  const sortedDefs = Array.from(variableDefinitions).sort((a, b) => a - b);
  sortedDefs.forEach(lineIdx => {
    if (lineIdx < baseStart) {
      contextLines.push(lines[lineIdx]);
    }
  });

  // Add separator if we included earlier context
  if (contextLines.length > 0) {
    contextLines.push("# ...");
  }

  // Add the main context window
  for (let i = baseStart; i < baseEnd; i++) {
    contextLines.push(lines[i]);
  }

  return contextLines.join("\n");
}

export async function explainIssueWithAI({
  provider = "gemini",
  apiKey,
  issue,
  fullCode,
  type,
}) {
  const lines = fullCode.split("\n");

  // Use smart context extraction
  const codeContext = extractSmartContext(lines, issue.line);

  const prompt = buildPrompt(type, issue, codeContext);

  return await callLLM({
    provider,
    apiKey,
    prompt,
  });
}

