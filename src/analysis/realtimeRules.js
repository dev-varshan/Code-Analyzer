export const realtimeRules = [
  // =========================
  // CODE EXECUTION / INJECTION
  // =========================
  {
    id: "PY_EVAL",
    name: "Use of eval()",
    severity: "High",
    pattern: /\beval\s*\(/,
    message: "Use of eval() can lead to code injection."
  },
  {
    id: "PY_EXEC",
    name: "Use of exec()",
    severity: "High",
    pattern: /\bexec\s*\(/,
    message: "exec() executes arbitrary code and is dangerous."
  },

  // =========================
  // COMMAND EXECUTION
  // =========================
  {
    id: "PY_OS_SYSTEM",
    name: "Use of os.system()",
    severity: "High",
    pattern: /\bos\.system\s*\(/,
    message: "os.system() can allow command injection."
  },
  {
    id: "PY_SUBPROCESS_SHELL_TRUE",
    name: "subprocess with shell=True",
    severity: "High",
    pattern: /\bsubprocess\.(call|run|Popen)\s*\(.*shell\s*=\s*True/i,
    message: "Using shell=True with subprocess can lead to command injection."
  },

  // =========================
  // DESERIALIZATION
  // =========================
  {
    id: "PY_PICKLE_LOADS",
    name: "Unsafe Deserialization",
    severity: "High",
    pattern: /\bpickle\.loads\s*\(/,
    message: "Deserializing untrusted data with pickle can lead to RCE."
  },

  // =========================
  // FILE / PATH ISSUES
  // =========================
  {
    id: "PY_OPEN_WRITE",
    name: "File Write Without Validation",
    severity: "Medium",
    pattern: /\bopen\s*\(.*['"]w['"]/,
    message: "Writing files without validation may allow file overwrite attacks."
  },
  {
    id: "PY_PATH_TRAVERSAL",
    name: "Possible Path Traversal",
    severity: "High",
    pattern: /\b(open|os\.remove|os\.unlink|os\.rmdir)\s*\(.*\+/,
    message: "Concatenating paths can lead to path traversal vulnerabilities."
  },

  // =========================
  // SECRETS / CREDENTIALS
  // =========================
  {
    id: "PY_HARDCODED_PASSWORD",
    name: "Hardcoded Password",
    severity: "Medium",
    pattern: /password\s*=\s*["'][^"']+["']/i,
    message: "Hardcoded passwords are insecure."
  },
  {
    id: "PY_API_KEY",
    name: "Hardcoded API Key",
    severity: "Medium",
    pattern: /(api[_-]?key|secret[_-]?key)\s*=\s*["'][^"']+["']/i,
    message: "Hardcoded API keys or secrets detected."
  },

  // =========================
  // CRYPTOGRAPHY
  // =========================
  {
    id: "PY_WEAK_CRYPTO",
    name: "Weak Cryptography",
    severity: "Medium",
    pattern: /\b(md5|sha1)\b/i,
    message: "Weak cryptographic hash detected."
  },
  {
    id: "PY_RANDOM",
    name: "Insecure Random Generator",
    severity: "Medium",
    pattern: /\brandom\.random\s*\(|\brandom\.randint\s*\(/,
    message: "Use of random module is not secure for cryptographic purposes."
  },

  // =========================
  // NETWORK / WEB
  // =========================
  {
    id: "PY_REQUESTS_VERIFY_FALSE",
    name: "TLS Certificate Validation Disabled",
    severity: "High",
    pattern: /\brequests\.(get|post|put|delete)\s*\(.*verify\s*=\s*False/i,
    message: "Disabling TLS certificate validation allows MITM attacks."
  },
  {
    id: "PY_HTTP_URL",
    name: "Insecure HTTP Usage",
    severity: "Medium",
    pattern: /http:\/\//i,
    message: "Using HTTP instead of HTTPS exposes data in transit."
  },

  // =========================
  // DEBUG / MISCONFIGURATION
  // =========================
  {
    id: "PY_DEBUG_TRUE",
    name: "Debug Mode Enabled",
    severity: "Medium",
    pattern: /\bdebug\s*=\s*True\b/,
    message: "Debug mode should not be enabled in production."
  },

  // =========================
  // ASSERT MISUSE
  // =========================
  {
    id: "PY_ASSERT",
    name: "Use of assert for Validation",
    severity: "Low",
    pattern: /\bassert\s+/,
    message: "assert statements can be removed with optimizations and should not be used for security checks."
  }
];
