import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Dummy user credentials (in a real app, verify against database)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

// Secret keys for JWT (use different secrets for access and refresh tokens)
const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'my_refresh_secret';

// Access token expiration (e.g., 15 minutes) and refresh token expiration (e.g., 7 days)
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * POST /auth/login
 * Authenticate user with username & password and return JWT access and refresh tokens.
 */
export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, data: null, message: 'Username and password are required' });
  }
  // Validate credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
  }
  // Credentials valid – generate JWT tokens
  const userPayload = { id: 1, username: ADMIN_USERNAME };  // sample payload
  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(userPayload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  return res.json({
    success: true,
    data: { token, refreshToken },
    message: 'Logged in successfully'
  });
};

/**
 * POST /auth/refresh
 * Verify refresh token and issue a new access token.
 */
export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, data: null, message: 'Refresh token is required' });
  }
  try {
    // Verify the refresh token using the refresh secret
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    // If valid, issue a new access token (we can reuse the payload's user info)
    const userInfo = { id: payload.id, username: payload.username };
    const newAccessToken = jwt.sign(userInfo, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return res.json({
      success: true,
      data: { token: newAccessToken },
      message: 'Token refreshed successfully'
    });
  } catch (err) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid or expired refresh token' });
  }
};
