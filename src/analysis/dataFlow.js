export function extractSources(codeLines) {
  const sources = [];

  codeLines.forEach((line, index) => {
    if (line.includes("input(")) {
      const variable = line.split("=")[0]?.trim();
      if (variable) {
        sources.push({
          variable,
          line: index + 1,
        });
      }
    }
  });

  return sources;
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
