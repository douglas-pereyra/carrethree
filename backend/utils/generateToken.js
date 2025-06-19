/**
 * @fileoverview Utility file for generating JSON Web Tokens (JWTs).
 * This function is used to create a secure token for a user after they log in or register.
 */

import jwt from 'jsonwebtoken';

/**
 * Creates and signs a new JSON Web Token (JWT) for a given user ID.
 * This token can be sent to the client and used to authenticate future API requests.
 *
 * @param {string} id The user's unique ID from the MongoDB document.
 * @returns {string} The newly generated, signed JWT string.
 */
const generateToken = (id) => {
  // The jwt.sign() method creates the token.
  return jwt.sign(
    // 1. The payload: Data to store inside the token. Here, we only store the user's ID.
    { id },

    // 2. The secret key: A private key stored in environment variables.
    // This key is used to sign the token, ensuring it cannot be tampered with.
    process.env.JWT_SECRET,

    // 3. Options: Additional configuration for the token.
    {
      // Sets an expiration date for the token. After 30 days, the user will need to log in again.
      // This is an important security measure.
      expiresIn: '30d',
    }
  );
};

export default generateToken;