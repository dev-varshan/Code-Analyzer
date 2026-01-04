export const scanRules = [
  {
    id: "PY_SQL_INJECTION",
    name: "SQL Injection",
    severity: "High",
    owasp: "A03: Injection",
    sinks: ["execute", "executemany"],
    message:
      "Untrusted input reaches a SQL execution function without sanitization.",
    recommendation:
      "Use parameterized queries instead of string concatenation.",
  },
  {
    id: "PY_COMMAND_INJECTION",
    name: "Command Injection",
    severity: "High",
    owasp: "A03: Injection",
    sinks: ["os.system", "subprocess.call"],
    message:
      "User input is passed to system command execution functions.",
    recommendation:
      "Avoid shell execution or strictly validate input.",
  },
  {
    id: "PY_UNSAFE_DESERIALIZATION",
    name: "Unsafe Deserialization",
    severity: "High",
    owasp: "A08: Software and Data Integrity Failures",
    sinks: ["pickle.loads"],
    message:
      "Deserializing untrusted data can lead to arbitrary code execution.",
    recommendation:
      "Avoid pickle for untrusted data; use safe serialization formats.",
  },
];
