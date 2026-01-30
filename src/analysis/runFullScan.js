// runFullScan.js

import { scanRules } from "./scanRules";
import { extractTaintedVariables, findSinkUsage } from "./dataFlow";

/**
 * Severity order for sorting (High > Medium > Low)
 */
const severityOrder = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/**
 * Run full data-flow scan
 * This ONLY returns data-flow findings (taint tracking)
 * Does NOT include realtime pattern-matching findings to avoid confusion
 */
export function runFullScan(code) {
  const results = [];
  const lines = code.split("\n");
  const seen = new Set(); // Deduplication: "ruleId-line"

  // Extract tainted variables (user input sources)
  const taintedVariables = extractTaintedVariables(lines);

  // Deep scan: Check if tainted data reaches dangerous sinks
  scanRules.forEach((rule) => {
    const sinkHits = findSinkUsage(lines, rule.sinks);

    sinkHits.forEach((hit) => {
      taintedVariables.forEach((taintedVar) => {
        // Check if the tainted variable is used in this sink
        if (hit.code.includes(taintedVar)) {
          const dedupeKey = `${rule.id}-${hit.line}`;

          // Skip duplicates
          if (seen.has(dedupeKey)) {
            return;
          }

          seen.add(dedupeKey);
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

  // Sort by severity (High → Medium → Low)
  results.sort((a, b) => {
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  return results;
}