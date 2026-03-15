export const scanRules = [
  // =====================================================
  // EXISTING RULES — unchanged
  // =====================================================
  {
    id: "PY_SQL_INJECTION",
    name: "SQL Injection",
    severity: "High",
    owasp: "A03: Injection",
    sinks: ["execute", "executemany", "cursor.callproc"],
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
    sinks: ["os.system", "subprocess.call", "subprocess.run", "subprocess.Popen", "subprocess.getoutput", "subprocess.getstatusoutput", "subprocess.check_output"],
    message:
      "User input is passed to system command execution functions.",
    recommendation:
      "Avoid shell execution or strictly validate and sanitize input.",
  },
  {
    id: "PY_UNSAFE_DESERIALIZATION",
    name: "Unsafe Deserialization (pickle)",
    severity: "High",
    owasp: "A08: Software and Data Integrity Failures",
    sinks: ["pickle.loads", "pickle.load"],
    message:
      "Deserializing untrusted data can lead to arbitrary code execution.",
    recommendation:
      "Avoid pickle for untrusted data; use safe serialization formats like JSON.",
  },

  // =====================================================
  // NEW RULES — added without touching the above
  // =====================================================

  {
    id: "PY_CODE_EXECUTION",
    name: "Dynamic Code Execution",
    severity: "High",
    owasp: "A03: Injection",
    sinks: ["eval", "exec", "compile"],
    message:
      "Tainted user input flows into a dynamic code execution function.",
    recommendation:
      "Never pass user-controlled data to eval(), exec(), or compile(). Use safe alternatives.",
  },
  {
    id: "PY_YAML_INJECTION",
    name: "Unsafe YAML Deserialization",
    severity: "High",
    owasp: "A08: Software and Data Integrity Failures",
    sinks: ["yaml.load"],
    message:
      "Tainted data passed to yaml.load() can lead to arbitrary code execution.",
    recommendation:
      "Use yaml.safe_load() instead of yaml.load() to prevent code execution.",
  },
  {
    id: "PY_PATH_TRAVERSAL_TAINT",
    name: "Path Traversal via Tainted Input",
    severity: "High",
    owasp: "A01: Broken Access Control",
    sinks: ["open", "os.remove", "os.unlink", "os.rename", "os.rmdir", "shutil.rmtree"],
    message:
      "User-controlled input is used in a file operation, enabling path traversal.",
    recommendation:
      "Validate and sanitize file paths. Use os.path.basename() and restrict to safe directories.",
  },
  {
    id: "PY_SSRF",
    name: "Server-Side Request Forgery (SSRF)",
    severity: "High",
    owasp: "A10: Server-Side Request Forgery",
    sinks: [
      "requests.get",
      "requests.post",
      "requests.put",
      "requests.delete",
      "requests.request",
      "urllib.request.urlopen",
      "urllib.urlopen",
      "httpx.get",
      "httpx.post",
    ],
    message:
      "Tainted user input is used to construct a URL for an outgoing HTTP request, enabling SSRF.",
    recommendation:
      "Validate and whitelist URLs. Never use unvalidated user input as a request URL.",
  },
  {
    id: "PY_TEMPLATE_INJECTION",
    name: "Server-Side Template Injection (SSTI)",
    severity: "High",
    owasp: "A03: Injection",
    sinks: ["render_template_string", "Template", "Markup", "jinja2.Template"],
    message:
      "Tainted input passed into a template engine can allow server-side template injection.",
    recommendation:
      "Never render user-controlled input as a template. Use render_template() with static templates.",
  },
  {
    id: "PY_LDAP_INJECTION",
    name: "LDAP Injection",
    severity: "High",
    owasp: "A03: Injection",
    sinks: ["ldap.search", "connection.search", "ldap3.Connection"],
    message:
      "User-controlled input reaches an LDAP search or connection call without sanitization.",
    recommendation:
      "Escape LDAP special characters in all user-supplied filter strings.",
  },
  {
    id: "PY_LOG_INJECTION",
    name: "Log Injection",
    severity: "Medium",
    owasp: "A09: Security Logging and Monitoring Failures",
    sinks: ["logging.info", "logging.debug", "logging.warning", "logging.error", "logging.critical", "logger.info", "logger.debug", "logger.warning", "logger.error"],
    message:
      "Tainted user input written to logs can allow log injection or log forging.",
    recommendation:
      "Sanitize user input before logging. Avoid logging raw user-controlled strings.",
  },
];
