/**
 * @fileoverview Defines the API routes for all shopping cart operations.
 * All routes defined here are protected and require user authentication.
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

// Import controller functions that contain the logic for each route.
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  mergeCart,
  clearUserCart,
} from '../controllers/cartController.js';

const router = express.Router();

// --- Route Definitions ---

// @desc    Get the logged-in user's shopping cart
// @route   GET /api/cart
// @access  Private
router.route('/').get(protect, getCart);

// @desc    Add a single item to the user's cart
// @route   POST /api/cart/add
// @access  Private
router.route('/add').post(protect, addItemToCart);

// @desc    Update the quantity of an item already in the cart
// @route   PUT /api/cart/update
// @access  Private
router.route('/update').put(protect, updateItemQuantity);

// @desc    Remove a single item from the cart using its product ID
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.route('/remove/:productId').delete(protect, removeItemFromCart);

// @desc    Merge a guest's local cart with the user's database cart upon login
// @route   POST /api/cart/merge
// @access  Private
router.route('/merge').post(protect, mergeCart);

// @desc    Clear all items from the user's cart
// @route   DELETE /api/cart/clear
// @access  Private
router.route('/clear').delete(protect, clearUserCart);

export default router;