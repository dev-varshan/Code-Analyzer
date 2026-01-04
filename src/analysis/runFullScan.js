// runFullScan.js

import { scanRules } from "./scanRules";
import { runRealtimeAnalysis } from "./runRealtimeAnalysis";
import { extractTaintedVariables, findSinkUsage } from "./dataFlow";

export function runFullScan(code) {
  const results = [];
  const lines = code.split("\n");


  // 2️⃣ Deep scan rules
  const taintedVariables = extractTaintedVariables(lines);

  scanRules.forEach((rule) => {
    const sinkHits = findSinkUsage(lines, rule.sinks);

    sinkHits.forEach((hit) => {
      taintedVariables.forEach((taintedVar) => {
        if (hit.code.includes(taintedVar)) {
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
