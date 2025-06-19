/**
 * @fileoverview Defines the API routes for user-related actions,
 * such as registration and authentication (login).
 */

import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
router.post('/register', async (req, res) => {
  // Destructure user details from the request body
  const { name, email, password } = req.body;

  try {
    // Check if a user with the given email already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If the email is already taken, return a 400 Bad Request error.
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create a new user document in the database.
    // The password will be automatically hashed by the 'pre-save' hook in the User model.
    const user = await User.create({ name, email, password });

    if (user) {
      // If user creation is successful, respond with user data and a new JWT.
      // This allows the user to be automatically logged in after registering.
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    console.error(`Error during user registration: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @desc    Authenticate a user & get a token
 * @route   POST /api/users/login
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email address.
    const user = await User.findOne({ email });

    // Check if the user exists AND if the entered password matches the stored hashed password.
    // `matchPassword` is a custom method defined in the User model for secure comparison.
    if (user && (await user.matchPassword(password))) {
      // If authentication is successful, respond with user data and a new JWT.
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      // If authentication fails, return a 401 Unauthorized error.
      // The error message is generic for security reasons (it doesn't reveal if the email exists).
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;