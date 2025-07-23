# Security Overview

## Authentication

This application uses **opaque token-based authentication** for client-server communication. Tokens are sent explicitly in the `Authorization` header as `Bearer <token>` and are **not stored in cookies**.

Each token is a 64-character hexadecimal string generated using cryptographically secure random bytes, ensuring uniqueness, unpredictability, and resistance to brute-force attacks.

## Considerations

- **Refresh Tokens** are not yet implemented. This means:
  - Clients must re-authenticate when access tokens expire.
  - Long-lived sessions may require future implementation of refresh tokens or token rotation to improve UX and security.
- **Access Tokens** should be:
  - Short-lived to limit the impact if compromised.
  - Stored securely on the client side (e.g., in memory or secure storage).
- **CORS Policies** should be properly configured to only allow trusted origins to interact with the API.  
  - Trusted origins are defined via the `CORS_ORIGINS` environment variable on the server.

## Password Requirements

The application enforces **strong password requirements** by default to help protect user accounts from brute-force attacks and credential stuffing. Passwords must meet the following criteria:

- At least 8 characters in length  
- Contain at least one uppercase letter  
- Contain at least one lowercase letter  
- Include at least one number  
- Include at least one symbol (e.g., !@#$%^&*)

## Two-Factor Authentication (2FA)

The application supports **Two-Factor Authentication (2FA)** using TOTP (Time-Based One-Time Password). Users can enable 2FA for an extra layer of security to protect their accounts against unauthorized access.

Currently, disabling 2FA **does not require an additional 2FA confirmation**, as a successful login with 2FA enabled already confirms ownership of the account. This is an intentional design decision aimed at balancing security and user experience. However, this approach is **still under review** and may change in the future — for example, by requiring re-authentication or 2FA confirmation before disabling, if it's deemed to significantly improve security without degrading usability.

## Session Management

Users have the ability to **view active sessions** associated with their account, including details like device and IP address. They can **revoke any active session** at any time to maintain control over their account access and improve security.

## Media Processing Isolation (FFmpeg)

For media processing tasks, **FFmpeg** is executed in a separate, isolated container. This design ensures that potentially risky or resource-intensive operations are sandboxed away from the main application server, reducing the attack surface and improving overall system stability. The main server communicates with the FFmpeg container exclusively via **HTTP requests**, ensuring a clear separation of concerns and minimizing the risk of privilege escalation or container breakout attacks.

## CSRF Protection

**CSRF protection is not required**, as the application does **not use cookie-based authentication**. All authenticated requests must include an `Authorization` header, which cannot be forged by third-party sites due to browser CORS policies.

## XSS and Frontend Security

The frontend is built using **React**, which provides built-in protection against **Cross-Site Scripting (XSS)** by automatically escaping user-generated content in JSX. This helps prevent injection of malicious HTML or JavaScript when rendering dynamic data.

We **do not use** `dangerouslySetInnerHTML`, which is a React escape hatch for injecting raw HTML into the DOM. Avoiding this feature significantly reduces the risk of XSS vulnerabilities.

## Content Security Policy (CSP)

**For production deployments**, it is strongly recommended to serve the application with appropriate **Content Security Policy (CSP)** headers. These headers help mitigate XSS and other injection attacks by restricting the sources from which scripts, styles, and other resources can be loaded.

> ⚠️ **Note:** CSP headers are **not yet implemented** for serving `index.html` in the production SPA deployment. This should be addressed before going live in a high-security environment.

## Backend Server (Fastify) and Production Deployment

The backend server is built using **Fastify**, a high-performance Node.js web framework. For security and reliability, the Fastify server should **never be exposed directly to the internet** in production environments. Instead, it must be deployed **behind a reverse proxy** such as **NGINX** or a similar solution.

Reverse proxies provide several critical security and operational benefits:
- **TLS Termination:** Offload HTTPS/SSL handling to the proxy, keeping private keys out of the application container.
- **Request Filtering:** Block malicious or malformed requests before they reach the backend.
- **Rate Limiting & DDoS Protection:** Mitigate abuse and denial-of-service attacks.
- **Header Management:** Add, remove, or modify HTTP headers for security (e.g., CSP, HSTS, X-Frame-Options).
- **Static Asset Serving:** Efficiently serve static files, reducing load on the backend.

> ⚠️ **Note:** Exposing the Fastify server directly to the internet increases the risk of attacks and bypasses important security controls. Always use a properly configured reverse proxy in production deployments.

## Vite and Production Deployment

Do **not use the Vite dev server for production deployments**, even if proxied behind NGINX or another reverse proxy.

The Vite dev server — such as the one exposed on **port 3001** when running the development Docker container — is intended for **development use only**. It lacks necessary production-grade security and performance optimizations, and should **never be exposed to the internet** in a live environment.