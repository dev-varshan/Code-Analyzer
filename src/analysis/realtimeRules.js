export const realtimeRules = [
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
  {
    id: "PY_OS_SYSTEM",
    name: "Use of os.system()",
    severity: "High",
    pattern: /\bos\.system\s*\(/,
    message: "os.system() can allow command injection."
  },
  {
    id: "PY_HARDCODED_PASSWORD",
    name: "Hardcoded Password",
    severity: "Medium",
    pattern: /password\s*=\s*["'][^"']+["']/i,
    message: "Hardcoded passwords are insecure."
  },
  {
    id: "PY_WEAK_CRYPTO",
    name: "Weak Cryptography",
    severity: "Medium",
    pattern: /\b(md5|sha1)\b/i,
    message: "Weak cryptographic hash detected."
  }
];
