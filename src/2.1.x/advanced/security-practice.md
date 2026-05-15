# UnoPIM Best Security Practices

Follow these guidelines to enhance the security of your UnoPIM instance and protect it from potential threats.

---

## **1. Software Updates**

- **Use HTTPS**: Encrypt communication with HTTPS, a Google ranking factor.
- **Keep Software Updated**: Regularly update all server software (e.g., UnoPIM, database, Adminer/phpMyAdmin, Apache, Redis).
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

By adhering to these best practices, you can significantly enhance the security of your UnoPIM setup and safeguard it against potential vulnerabilities.