# UnoPim Best Security Practices

Follow these guidelines to enhance the security of your UnoPim instance and protect it from potential threats.

---

## **1. Software Updates**

- **Use HTTPS**: Encrypt communication with HTTPS, a Google ranking factor.
- **Keep Software Updated**: Regularly update all server software (e.g., UnoPim, database, Adminer/phpMyAdmin, Apache, Redis).
- **Secure Protocols**: Manage files via SSH, SFTP, or HTTPS; disable FTP.
- **Protect System Files**: Use `.htaccess` to protect sensitive files.
- **Disable Unused Ports**: Stop unnecessary services and disable unused ports.
- **Admin Panel Access**: Restrict access to specific IPs and enforce two-factor authentication.
- **Strong Passwords**: Use strong, unique passwords for all accounts.
- **Firewall Configuration**: Update firewall rules to secure connections.

---

## **2. Limiting Error Messages**

- Edit Apache configuration:
  - Set `ServerSignature Off`.
  - Add `ServerTokens Prod` to hide server details.
- These settings help prevent exposure of sensitive information.

---

## **3. Limiting Admin Access**

- Restrict admin access by adding this to `.htaccess`:

  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_URI} .*/admin
  RewriteCond %{REMOTE_ADDR} !=<IP address>
  RewriteCond %{REMOTE_ADDR} !=<IP address>
  RewriteRule ^(.*)$ - [R=403,L]
  ```

- Remove development leftovers (e.g., log files, `.git` directories, database dumps).

---

## **4. Restricting Unnecessary Files**

- Add this to `.htaccess` to deny access to specific file types:

  ```apache
  <FilesMatch "\.(git|zip|tar|sql)$">
      Require all denied
  </FilesMatch>
  ```

- Use a Web Application Firewall (WAF) to analyze traffic and detect suspicious activity.

---

## **5. Restricting PHP Execution Inside Storage**

- Modify Apache configuration to prevent PHP execution in the storage directory:

  ```apache
  <Directory "~/www/unopim/public/storage/">
      <FilesMatch "\.php$">
          Require all denied
      </FilesMatch>
      php_flag engine off
  </Directory>
  ```

- Restart Apache after making these changes.

---

## **6. Server Hardening**

- Use **`mod_security`** to detect and prevent intrusions.
- Implement **`mod_passive`** to mitigate brute force attacks.
- Restrict login to specific users.
- Disable login for accounts with empty passwords.
- Configure **iptables** rules to prevent unauthorized access.
- Regularly back up files and store them in a secure location.

---

## **7. Strong Passwords**

- Enforce strong, unique passwords and periodic changes.
- Limit admin panel access to whitelisted IP addresses.

---

## **8. HTTP Security Headers**

### HTTP Strict Transport Security (HSTS)
- Enforce HTTPS-only access:
  ```text
  Strict-Transport-Security: max-age=<expire-time>
  ```

### Cross-Site Scripting Protection (X-XSS-Protection)
- Enable XSS protection:
  ```text
  X-XSS-Protection: 1; mode=block
  ```

### X-Frame-Options
- Prevent clickjacking:
  ```text
  X-Frame-Options: deny
  ```

### X-Content-Type-Options
- Disable MIME sniffing:
  ```text
  X-Content-Type-Options: nosniff
  ```

### Content Security Policy (CSP)
- Control resources in user browsers:
  ```text
  Content-Security-Policy: <policy-directives>
  ```

---

## **9. Continuous Logging and Monitoring**

- Monitor network access and data activities.

---

## **10. API Security Improvements (v2.0.0)**

UnoPim v2.0.0 includes significant API security hardening:

- **Full ACL enforcement on all API routes**: All 48 API routes now have proper ACL authorization checks. 15 previously unprotected routes have been fixed to require appropriate permissions.
- **ACL authorization on AI Agent tools**: All 32 AI Agent tools enforce permission checks via the `ChecksPermission` trait, ensuring that AI-driven operations respect the same role-based access controls as manual actions.
- **Rate limiting on AI Agent chat endpoints**: AI Agent chat endpoints are rate-limited to prevent abuse and excessive token consumption.
- **Input validation for locale and channel codes**: All API endpoints that accept locale or channel codes now validate these inputs against the configured values, preventing injection attacks and invalid data access.
- **LIKE Wildcard Injection Prevention**: AI Agent search queries are now sanitized to escape `%` and `_` wildcards before being passed to database LIKE clauses, preventing unintended pattern matching from user or LLM-provided input.
- **Session Lock Release**: Streaming AI responses release the PHP session lock (`session()->save()`) before LLM calls to prevent blocking concurrent admin requests for 30-120 seconds.

---

## **11. Security Enhancements (v2.1.0)**

UnoPim v2.1.0 adds further hardening on top of the v2.0.0 API improvements:

### IP-based debug filtering

When `APP_DEBUG` is enabled, detailed error pages and the debug toolbar can leak sensitive information. v2.1.0 adds the `APP_DEBUG_ALLOWED_IPS` environment variable (backed by the `debug_allowed_ips` setting in `config/app.php`) to restrict debug output to specific IP addresses:

```ini
APP_DEBUG=true
APP_DEBUG_ALLOWED_IPS=127.0.0.1,203.0.113.10
```

Visitors outside the allowed list see a generic error page. If the variable is empty or omitted, behaviour is unchanged. A matching `maintenance_allowed_ips` configuration lets whitelisted IPs reach the site while it is in maintenance mode.

### Security middleware

- **`NoCacheMiddleware`** — prevents browsers and proxies from caching admin pages, reducing the risk of sensitive data being served from a shared cache.
- **Enhanced `SecureHeaders` middleware** — now also sends the `Permissions-Policy` and `X-Permitted-Cross-Domain-Policies` response headers, in addition to the headers described in section 8.

### Admin authentication hardening

- **Rate limiting on admin login** — named rate limiters (`admin-login` and `admin-forgot-password`) throttle repeated attempts against the admin login and password-reset endpoints, mitigating brute-force attacks.
- **Server-side password validation** — admin passwords are validated server-side with a `min:6` rule, so weak passwords cannot be set by bypassing the client.
- **User-enumeration protection** — the forgot-password flow returns a generic message regardless of whether the email exists, preventing attackers from discovering valid accounts.
- **Open-redirect protection** — redirects derived from the `Referer` header are validated with `parse_url()` host checks, blocking open-redirect attacks.
- **Privilege-escalation guards** — the user edit endpoint now enforces the missing ACL entries and adds controller-level checks to prevent users from escalating their own privileges.

### Sanitizing user-generated content

Use the `clean_content()` helper (added in v2.1.0) to sanitize rich-text or HTML input from users before storing or rendering it. See [Helpers → Security Helpers](helpers#security-helpers) for details.

---

By adhering to these best practices, you can significantly enhance the security of your UnoPim setup and safeguard it against potential vulnerabilities.