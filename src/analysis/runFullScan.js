import { scanRules } from "./scanRules";
import { runRealtimeAnalysis } from "./runRealtimeAnalysis";
import { extractSources, findSinkUsage } from "./dataFlow";

export function runFullScan(code) {
  const results = [];
  const lines = code.split("\n");

  // 1️⃣ Re-run realtime rules
  const realtimeFindings = runRealtimeAnalysis(code);

  realtimeFindings.forEach((f) =>
    results.push({
      ...f,
      scanType: "realtime",
    })
  );

  // 2️⃣ Deep scan rules
  const sources = extractSources(lines);

  scanRules.forEach((rule) => {
    const sinkHits = findSinkUsage(lines, rule.sinks);

    sinkHits.forEach((hit) => {
      sources.forEach((source) => {
        if (lines[hit.line - 1].includes(source.variable)) {
          results.push({
            ruleId: rule.id,
            name: rule.name,
            severity: rule.severity,
            owasp: rule.owasp,
            message: rule.message,
            recommendation: rule.recommendation,
            line: hit.line,
            code: hit.code,
            scanType: "full",
          });
        }
      });
    });
  });

  return results;
}
