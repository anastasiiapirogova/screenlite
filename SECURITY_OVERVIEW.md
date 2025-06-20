# Security Overview

## Authentication

This application uses **opaque token-based authentication** for client-server communication. Tokens are sent explicitly in the `Authorization` header as `Bearer <token>` and are **not stored in cookies**.

### CSRF Protection

**CSRF protection is not required**, as the application does **not use cookie-based authentication**. All authenticated requests must include an `Authorization` header, which cannot be forged by third-party sites due to browser CORS policies.

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

Currently, disabling 2FA **does not require an additional 2FA confirmation**, as a successful login with 2FA enabled already confirms ownership of the account. This is an intentional design decision aimed at balancing security and user experience. However, this approach is **still under review** and may change in the future — for example, by requiring re-authentication or 2FA confirmation before disabling, if it’s deemed to significantly improve security without degrading usability.

## Session Management

Users have the ability to **view active sessions** associated with their account, including details like device and IP address. They can **revoke any active session** at any time to maintain control over their account access and improve security.
