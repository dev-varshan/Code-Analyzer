// dataFlow.js

export function extractTaintedVariables(codeLines) {
  const taintedVars = new Set();

  codeLines.forEach((line) => {
    // Detect direct user input
    if (line.includes("input(")) {
      const variable = line.split("=")[0]?.trim();
      if (variable) {
        taintedVars.add(variable);
      }
    }

    // Detect propagation: tainted variable assigned to another variable
    const assignmentMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignmentMatch) {
      const [, leftVar, rightSide] = assignmentMatch;

      taintedVars.forEach((tainted) => {
        if (rightSide.includes(tainted)) {
          taintedVars.add(leftVar);
        }
      });
    }
  });

  return Array.from(taintedVars);
}

export function findSinkUsage(codeLines, sinks) {
  const hits = [];

  codeLines.forEach((line, index) => {
    sinks.forEach((sink) => {
      if (line.includes(sink)) {
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
