import { realtimeRules } from "./realtimeRules";

export function runRealtimeAnalysis(code) {
  const findings = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    realtimeRules.forEach((rule) => {
      if (rule.pattern.test(line)) {
        findings.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          message: rule.message,
          line: index + 1,
          code: line.trim()
        });
      }
    });
  });

  return findings;
}
