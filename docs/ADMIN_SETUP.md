# Admin Access Setup

This document explains how to set up and access the admin area of the application.

## Environment Configuration

Add the following to your `.env` file:

```
ADMIN_SECRET_KEY=your-secure-secret-key
```

Replace `your-secure-secret-key` with a strong, secure key that will be used to authorize admin access.

## Accessing Admin Area

1. Navigate to `/auth/admin` in your browser or click the small "Admin" link in the bottom right of the navigation bar.

2. Enter your regular user credentials (email and password).

3. Enter the admin key you configured in your `.env` file.

4. If all credentials are valid, you will be logged in and granted admin privileges.

## Admin Privileges

Admin users have access to:

- The admin dashboard at `/admin`
- Ability to manage all vendor tools and applications
- Access to site-wide settings
- User management capabilities

## Security Notes

- Keep your admin key secure and never share it publicly
- Consider rotating the admin key periodically
- The admin key is required even for users who are already registered with the system 