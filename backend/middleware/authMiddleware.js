/**
 * @fileoverview This file provides custom middleware for authentication and authorization.
 * It includes a 'protect' middleware to verify JWTs and an 'admin' middleware
 * to check for administrator privileges.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * An Express middleware to protect routes by verifying the user's JSON Web Token (JWT).
 * It checks for a token in the 'Authorization' header, validates it, and if successful,
 * attaches the authenticated user's data to the request object.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (format: "Bearer <token>").
      token = req.headers.authorization.split(' ')[1];

      // Verify the token's signature using the secret key.
      // This will throw an error if the token is invalid or expired.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID stored in the token's payload.
      // Exclude the password field from the returned user document for security.
      req.user = await User.findById(decoded.id).select('-password');

      // If everything is successful, proceed to the next middleware or route handler.
      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the header, deny access.
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * An Express middleware to check if the authenticated user is an administrator.
 * This middleware should always be used *after* the 'protect' middleware,
 * as it relies on `req.user` being set.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
export const admin = (req, res, next) => {
  // Check if the user object exists on the request and if its 'isAdmin' flag is true.
  if (req.user && req.user.isAdmin) {
    // If the user is an admin, allow the request to proceed.
    next();
  } else {
    // If not an admin, return a 403 Forbidden error.
    res.status(403).json({ message: 'Not authorized as an administrator' });
  }
};