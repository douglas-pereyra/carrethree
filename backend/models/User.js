/**
 * @fileoverview Defines the Mongoose schema and model for a User.
 * This file structures the data for users, including their personal details,
 * role (customer or admin), and their persistent shopping cart.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Defines the structure for a user document in the database.
const userSchema = mongoose.Schema(
  {
    // The user's name.
    name: {
      type: String,
      required: true,
    },
    // The user's unique email, which is used for login.
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users can register with the same email.
    },
    // The user's password. This will be hashed automatically before saving.
    password: {
      type: String,
      required: true,
    },
    // A flag to determine if the user is an administrator.
    // `false` for a regular customer, `true` for a Carrethree admin.
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // The user's persistent shopping cart, stored in the database.
    // This allows the cart to be accessed across different devices.
    cart: [
      {
        // A reference to a product document in the 'products' collection.
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        // The quantity of that specific product in the cart.
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

/**
 * Mongoose middleware that runs automatically before a 'save' operation.
 * Its purpose is to hash the user's password for security.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new).
  // This prevents re-hashing the password every time the user's profile is updated.
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a "salt" for hashing, which adds a layer of security.
  const salt = await bcrypt.genSalt(10);
  // Replace the plain-text password with the hashed version.
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * A helper method attached to each user document.
 * It securely compares a plain-text password (from a login form) with the
 * hashed password stored in the database.
 * @param {string} enteredPassword The plain-text password to compare.
 * @returns {Promise<boolean>} A promise that resolves to true if passwords match, otherwise false.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Creates the 'User' model from the schema to interact with the 'users' collection.
const User = mongoose.model('User', userSchema);

export default User;