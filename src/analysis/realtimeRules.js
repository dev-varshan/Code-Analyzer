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
    pattern: /\bpassword\s*=\s*["'][^"']{3,}["']/i,
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
    pattern: /["']http:\/\/[^"']+["']/i,
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
    name: "Use of assert for Security Validation",
    severity: "Low",
    // Only flag when assert is used alongside auth/security keywords,
    // not every assert (which would be noisy in test code).
    pattern: /\bassert\s+.*(auth|permission|admin|login|token|password|role|access)/i,
    message: "assert statements are removed with -O optimizations and should not be used for security checks."
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
    pattern: /\binput\s*\(/,
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
  },

  // =========================
  // ADDITIONAL DESERIALIZATION
  // =========================
  {
    id: "PY_MARSHAL_LOADS",
    name: "Unsafe marshal Deserialization",
    severity: "High",
    pattern: /\bmarshal\.loads?\s*\(/,
    message: "marshal.loads() can execute arbitrary code when deserializing untrusted data."
  },
  {
    id: "PY_SHELVE_OPEN",
    name: "Unsafe shelve Usage",
    severity: "Medium",
    pattern: /\bshelve\.open\s*\(/,
    message: "shelve is backed by pickle internally and is unsafe with untrusted data sources."
  },

  // =========================
  // DYNAMIC IMPORT / REFLECTION
  // =========================
  {
    id: "PY_DYNAMIC_IMPORT",
    name: "Dynamic Module Import",
    severity: "High",
    pattern: /\b__import__\s*\(/,
    message: "__import__() with user-controlled input can load and execute arbitrary modules."
  },

  // =========================
  // DJANGO ORM RAW SQL
  // =========================
  {
    id: "PY_DJANGO_RAW_SQL",
    name: "Django Raw SQL Execution",
    severity: "High",
    pattern: /\.(?:raw|extra)\s*\(/,
    message: "Django's .raw() and .extra() bypass ORM protections and can lead to SQL injection."
  },

  // =========================
  // TEMPLATE ENGINE MISCONFIG
  // =========================
  {
    id: "PY_JINJA2_AUTOESCAPE_OFF",
    name: "Jinja2 Autoescaping Disabled",
    severity: "High",
    pattern: /autoescape\s*=\s*False/,
    message: "Disabling Jinja2 autoescaping allows Cross-Site Scripting (XSS) in rendered templates."
  },

  // =========================
  // INSECURE PROTOCOL
  // =========================
  {
    id: "PY_XMLRPC",
    name: "XML-RPC Usage",
    severity: "Medium",
    pattern: /\b(xmlrpc|SimpleXMLRPCServer|MultiPathXMLRPCServer)\b/,
    message: "XML-RPC can be vulnerable to XML injection and lacks modern security controls."
  },

  // =========================
  // WEAK KEY SIZE
  // =========================
  {
    id: "PY_WEAK_RSA_KEY",
    name: "Weak RSA Key Size",
    severity: "High",
    pattern: /RSA\.generate\s*\(\s*(512|1024)\b/,
    message: "RSA keys smaller than 2048 bits are considered cryptographically weak."
  },

  // =========================
  // SUBPROCESS VARIANTS
  // =========================
  {
    id: "PY_SUBPROCESS_GETOUTPUT",
    name: "subprocess.getoutput() Usage",
    severity: "High",
    pattern: /\bsubprocess\.(getoutput|getstatusoutput)\s*\(/,
    message: "subprocess.getoutput() and getstatusoutput() invoke a shell by default and are vulnerable to command injection."
  },
  {
    id: "PY_SUBPROCESS_CHECK_OUTPUT_SHELL",
    name: "subprocess.check_output with shell=True",
    severity: "High",
    pattern: /\bsubprocess\.check_output\s*\(.*shell\s*=\s*True/i,
    message: "subprocess.check_output() with shell=True enables command injection via user-controlled input."
  },

  // =========================
  // HASHLIB WEAK HASHING
  // =========================
  {
    id: "PY_HASHLIB_MD5",
    name: "Weak Hash: hashlib.md5()",
    severity: "Medium",
    pattern: /\bhashlib\.md5\s*\(/,
    message: "MD5 is cryptographically broken. Use hashlib.sha256() or stronger for security-sensitive hashing."
  },
  {
    id: "PY_HASHLIB_SHA1",
    name: "Weak Hash: hashlib.sha1()",
    severity: "Medium",
    pattern: /\bhashlib\.sha1\s*\(/,
    message: "SHA-1 is cryptographically weak. Use hashlib.sha256() or stronger."
  },

  // =========================
  // SSL / TLS MISCONFIGURATION
  // =========================
  {
    id: "PY_SSL_CERT_NONE",
    name: "SSL Certificate Verification Disabled",
    severity: "High",
    pattern: /ssl\.CERT_NONE/,
    message: "Setting ssl.CERT_NONE disables certificate verification, making connections vulnerable to MITM attacks."
  },
  {
    id: "PY_SSL_WRAP_SOCKET_NO_CERT",
    name: "ssl.wrap_socket Without Certificate Verification",
    severity: "High",
    pattern: /\bssl\.wrap_socket\s*\((?!.*cert_reqs)/,
    message: "ssl.wrap_socket() without cert_reqs=ssl.CERT_REQUIRED does not verify server identity."
  },

  // =========================
  // HARDCODED SECRETS / KEYS
  // =========================
  {
    id: "PY_DJANGO_SECRET_KEY",
    name: "Hardcoded Django SECRET_KEY",
    severity: "High",
    pattern: /SECRET_KEY\s*=\s*["'][^"']{8,}["']/,
    message: "Hardcoded Django SECRET_KEY in source code. Use environment variables instead."
  },
  {
    id: "PY_FLASK_SECRET_KEY",
    name: "Hardcoded Flask secret_key",
    severity: "High",
    pattern: /\bapp\.secret_key\s*=\s*["'][^"']+["']/,
    message: "Hardcoded Flask app.secret_key is insecure. Load from environment variables."
  },

  // =========================
  // EXEC FILE PATTERN
  // =========================
  {
    id: "PY_EXEC_OPEN",
    name: "exec() of Opened File",
    severity: "High",
    pattern: /\bexec\s*\(\s*open\s*\(/,
    message: "exec(open(...).read()) executes file contents as code. This is dangerous with unvalidated file paths."
  },

  // =========================
  // SSH / PARAMIKO
  // =========================
  {
    id: "PY_PARAMIKO_AUTO_ADD",
    name: "Paramiko AutoAddPolicy (SSH MITM Risk)",
    severity: "High",
    pattern: /AutoAddPolicy\s*\(/,
    message: "AutoAddPolicy automatically accepts unknown SSH host keys, leaving connections vulnerable to MITM attacks."
  },

  // =========================
  // SQL PERCENT FORMATTING
  // =========================
  {
    id: "PY_SQL_PERCENT_FORMAT",
    name: "SQL Query Built with % Formatting",
    severity: "High",
    pattern: /\.execute\s*\(.*%[^,)]/,
    message: "Building SQL queries with % string formatting allows SQL injection. Use parameterized queries."
  },

  // =========================
  // NETWORK EXPOSURE
  // =========================
  {
    id: "PY_BIND_ALL_INTERFACES",
    name: "Service Bound to All Interfaces",
    severity: "Medium",
    pattern: /host\s*=\s*["']0\.0\.0\.0["']/,
    message: "Binding to 0.0.0.0 exposes the service on all network interfaces including public ones."
  },

  // =========================
  // XML EXTERNAL ENTITY (XXE)
  // =========================
  {
    id: "PY_LXML_PARSE",
    name: "lxml XML Parsing (XXE Risk)",
    severity: "High",
    pattern: /\blxml\.etree\.(parse|fromstring|XML)\s*\(/,
    message: "lxml.etree parsing may be vulnerable to XXE attacks. Use defusedxml or disable external entity loading."
  },

  // =========================
  // CORS MISCONFIGURATION
  // =========================
  {
    id: "PY_CORS_WILDCARD",
    name: "CORS Wildcard Origin Allowed",
    severity: "Medium",
    pattern: /origins\s*=\s*["']\*["']/,
    message: "Allowing all CORS origins (*) exposes the API to cross-origin requests from any website."
  },

  // =========================
  // WEAK BCRYPT ROUNDS
  // =========================
  {
    id: "PY_WEAK_BCRYPT_ROUNDS",
    name: "Weak bcrypt Work Factor",
    severity: "Medium",
    pattern: /gensalt\s*\(\s*rounds\s*=\s*([1-9]|10)\b/,
    message: "bcrypt work factor (rounds) below 12 is too weak for production use. Use rounds=12 or higher."
  }

];
