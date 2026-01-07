export function buildPrompt(type, issue, codeContext) {
  switch (type) {
    case "WHY_INSECURE":
      return `
Given this Python code:

${codeContext}

Explain why this specific code is insecure.
Focus only on this vulnerability.
Keep it concise and clear.
`;

    case "ATTACK_SCENARIO":
      return `
Given this vulnerable Python code:

${codeContext}

Explain how a real attacker could exploit this.
List realistic attack scenarios and impacts.
Avoid theory. Be practical.
`;

    case "OWASP_EXPLANATION":
      return `
This issue maps to ${issue.owasp}.

Given this code:

${codeContext}

Explain:
1. What this OWASP category means
2. Why this code falls under it
Use simple language.
`;

    case "PRODUCTION_IMPACT":
      return `
If the following Python code is deployed in production:

${codeContext}

Explain the real-world security, business, and compliance risks.
`;

    case "SECURE_FIX":
      return `
Given this insecure Python code:

${codeContext}

Suggest a secure alternative and explain why it is safer.
`;

    default:
      return "";
  }
}
