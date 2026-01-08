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
  {
    id: "PY_YAML_LOAD",
    name: "Unsafe YAML Deserialization",
    severity: "High",
    pattern: /\byaml\.load\s*\(/,
    message: "yaml.load() without SafeLoader can lead to code execution."
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
    pattern: /\b(open|os\.remove|os\.unlink|os\.rmdir|os\.rename)\s*\(.*\+/,
    message: "Concatenating paths can lead to path traversal vulnerabilities."
  },
  {
    id: "PY_TEMPFILE_INSECURE",
    name: "Insecure Temporary File Usage",
    severity: "Medium",
    pattern: /\btempfile\.mktemp\s*\(/,
    message: "mktemp() is insecure and vulnerable to race conditions."
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
    pattern: /(api[_-]?key|secret[_-]?key|token)\s*=\s*["'][^"']+["']/i,
    message: "Hardcoded API keys or secrets detected."
  },
  {
    id: "PY_PRIVATE_KEY",
    name: "Private Key Embedded in Code",
    severity: "High",
    pattern: /-----BEGIN (RSA|EC|DSA) PRIVATE KEY-----/,
    message: "Private keys should never be embedded in source code."
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
    pattern: /\brandom\.(random|randint|choice)\s*\(/,
    message: "random module is not secure for cryptographic use."
  },
  {
    id: "PY_STATIC_IV",
    name: "Static or Hardcoded IV",
    severity: "High",
    pattern: /\b(iv|initialization_vector)\s*=\s*["'][^"']+["']/i,
    message: "Hardcoded IVs weaken encryption security."
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
  {
    id: "PY_FLASK_DEBUG",
    name: "Flask Debug Mode Enabled",
    severity: "High",
    pattern: /\bapp\.run\s*\(.*debug\s*=\s*True/i,
    message: "Flask debug mode exposes interactive debugger in production."
  },

  // =========================
  // AUTH / AUTHZ
  // =========================
  {
    id: "PY_JWT_VERIFY_DISABLED",
    name: "JWT Signature Verification Disabled",
    severity: "High",
    pattern: /\bjwt\.decode\s*\(.*verify\s*=\s*False/i,
    message: "Disabling JWT verification allows token forgery."
  },
  {
    id: "PY_EMPTY_PASSWORD_CHECK",
    name: "Missing Password Validation",
    severity: "Medium",
    pattern: /\bif\s+password\s*==\s*["']{0,2}/i,
    message: "Password validation appears weak or missing."
  },

  // =========================
  // ERROR HANDLING
  // =========================
  {
    id: "PY_BARE_EXCEPT",
    name: "Bare Except Clause",
    severity: "Low",
    pattern: /\bexcept\s*:/,
    message: "Bare except blocks can hide critical errors."
  },
  {
    id: "PY_PRINT_STACKTRACE",
    name: "Stack Trace Disclosure",
    severity: "Medium",
    pattern: /\b(traceback\.print_exc|print\(e\))/,
    message: "Printing stack traces may leak sensitive information."
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
  {
    id: "PY_TODO_SECURITY",
    name: "Security TODO in Code",
    severity: "Low",
    pattern: /TODO:.*(security|auth|sanitize|validate)/i,
    message: "Security-related TODO found in code."
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
  },

    // =========================
  // SQL / DATABASE MISUSE
  // =========================
  {
    id: "PY_SQL_STRING_CONCAT",
    name: "SQL Query Built via String Concatenation",
    severity: "High",
    pattern: /\b(SELECT|INSERT|UPDATE|DELETE)\b.*\+.*\b(cursor\.execute|execute)\b/i,
    message: "Building SQL queries using string concatenation can lead to SQL injection."
  },
  {
    id: "PY_SQL_FORMAT",
    name: "SQL Query Built Using format()",
    severity: "High",
    pattern: /\.execute\s*\(.*\.format\s*\(/i,
    message: "Using format() to build SQL queries may lead to SQL injection."
  },

  // =========================
  // INPUT HANDLING / VALIDATION
  // =========================
  {
    id: "PY_RAW_INPUT_USAGE",
    name: "Unvalidated User Input",
    severity: "Medium",
    pattern: /\b(input|sys\.argv)\b/,
    message: "User input is used without validation or sanitization."
  },
  {
    id: "PY_NO_INPUT_STRIP",
    name: "User Input Without Sanitization",
    severity: "Low",
    pattern: /\binput\s*\(\s*\)\s*(?!\.strip)/,
    message: "User input is not sanitized (e.g., missing strip())."
  },

  // =========================
  // AUTHENTICATION / AUTHORIZATION
  // =========================
  {
    id: "PY_PLAINTEXT_PASSWORD_COMPARE",
    name: "Plaintext Password Comparison",
    severity: "High",
    pattern: /\bif\s+password\s*==\s*\w+/i,
    message: "Comparing plaintext passwords instead of hashed values is insecure."
  },
  {
    id: "PY_HARDCODED_ADMIN_CHECK",
    name: "Hardcoded Admin Authorization",
    severity: "High",
    pattern: /\bif\s+user\s*==\s*["']admin["']/i,
    message: "Hardcoded role or admin checks can be bypassed."
  },

  // =========================
  // FILE UPLOAD / FILE HANDLING
  // =========================
  {
    id: "PY_UNRESTRICTED_FILE_UPLOAD",
    name: "Unrestricted File Upload",
    severity: "High",
    pattern: /\.save\s*\(\s*.*filename\s*\)/i,
    message: "Saving uploaded files without validation may allow malicious uploads."
  },
  {
    id: "PY_UNSAFE_FILENAME",
    name: "Unsafe Filename Usage",
    severity: "Medium",
    pattern: /\bopen\s*\(.*filename/i,
    message: "Using user-controlled filenames may lead to path traversal."
  },

  // =========================
  // OBJECT / REFLECTION MISUSE
  // =========================
  {
    id: "PY_GETATTR_DYNAMIC",
    name: "Dynamic Attribute Access",
    severity: "Medium",
    pattern: /\bgetattr\s*\(/,
    message: "Dynamic attribute access may allow unauthorized method execution."
  },
  {
    id: "PY_SETATTR_DYNAMIC",
    name: "Dynamic Attribute Assignment",
    severity: "Medium",
    pattern: /\bsetattr\s*\(/,
    message: "Dynamic attribute assignment can lead to object manipulation vulnerabilities."
  },

  // =========================
  // ENVIRONMENT / CONFIG LEAKS
  // =========================
  {
    id: "PY_PRINT_ENV",
    name: "Environment Variable Disclosure",
    severity: "Medium",
    pattern: /\bprint\s*\(\s*os\.environ/i,
    message: "Printing environment variables may leak sensitive secrets."
  },
  {
    id: "PY_ENV_SECRET_ACCESS",
    name: "Sensitive Environment Variable Usage",
    severity: "Low",
    pattern: /\bos\.environ\[\s*["'].*(SECRET|TOKEN|KEY).*["']\s*\]/i,
    message: "Sensitive environment variables accessed directly in code."
  },

  // =========================
  // LOGGING / INFORMATION LEAKAGE
  // =========================
  {
    id: "PY_LOG_SENSITIVE_DATA",
    name: "Sensitive Data Logged",
    severity: "Medium",
    pattern: /\b(logging|logger)\.(info|debug|error)\s*\(.*(password|token|secret)/i,
    message: "Logging sensitive data may expose credentials."
  },
  {
    id: "PY_PRINT_SENSITIVE",
    name: "Sensitive Data Printed",
    severity: "Medium",
    pattern: /\bprint\s*\(.*(password|token|secret)/i,
    message: "Printing sensitive data can leak secrets."
  },

  // =========================
  // CONCURRENCY / RACE CONDITIONS
  // =========================
  {
    id: "PY_TIME_SLEEP_SECURITY",
    name: "Time-Based Security Logic",
    severity: "Low",
    pattern: /\btime\.sleep\s*\(/,
    message: "Using sleep for security logic can be bypassed or abused."
  },

  // =========================
  // DANGEROUS DEFAULTS
  // =========================
  {
    id: "PY_DEFAULT_MUTABLE_ARG",
    name: "Mutable Default Argument",
    severity: "Medium",
    pattern: /\bdef\s+\w+\(.*=\s*\[\s*\]\)/,
    message: "Mutable default arguments can lead to unexpected shared state."
  },

  // =========================
  // UNSAFE SYSTEM INTERACTION
  // =========================
  {
    id: "PY_SHUTIL_RMTREE",
    name: "Recursive File Deletion",
    severity: "High",
    pattern: /\bshutil\.rmtree\s*\(/,
    message: "Recursive deletion can cause irreversible data loss if misused."
  },
  {
    id: "PY_OS_CHMOD",
    name: "Permission Modification",
    severity: "Medium",
    pattern: /\bos\.chmod\s*\(/,
    message: "Changing file permissions improperly can expose sensitive files."
  }

];
