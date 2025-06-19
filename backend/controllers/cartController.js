/**
 * @fileoverview This file contains the controller functions for handling all
 * shopping cart operations for authenticated users.
 */

import User from '../models/User.js';

/**
 * Retrieves the shopping cart for the currently logged-in user.
 * The cart items are populated with full product details.
 * @param {object} req - The Express request object, containing the user from the 'protect' middleware.
 * @param {object} res - The Express response object.
 */
export const getCart = async (req, res) => {
  try {
    // Find the user and populate the 'product' field in the cart with all product details.
    const user = await User.findById(req.user._id).populate('cart.product');
    
    if (user) {
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(`Error fetching cart: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Adds an item to the user's cart. If the item already exists,
 * it increases its quantity. Otherwise, it adds the new item.
 * @param {object} req - The Express request object. Expects { productId, quantity } in the body.
 * @param {object} res - The Express response object.
 */
export const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // If item already exists, add to its quantity.
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // If it's a new item, push it to the cart array.
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    // After saving, populate the cart to return full product details.
    await user.populate('cart.product');
    res.status(200).json(user.cart);

  } catch (error) {
    console.error(`Error adding item to cart: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Removes an item completely from the user's cart based on the product ID.
 * @param {object} req - The Express request object. Expects :productId in the URL params.
 * @param {object} res - The Express response object.
 */
export const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the item to be removed.
    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    await user.save();

    await user.populate('cart.product');
    res.status(200).json(user.cart);

  } catch (error) {
     console.error(`Error removing item from cart: ${error.message}`);
     res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity is 0 or less, the item is removed.
 * @param {object} req - The Express request object. Expects { productId, quantity } in the body.
 * @param {object} res - The Express response object.
 */
export const updateItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                // Set the item to the new quantity.
                user.cart[itemIndex].quantity = quantity;
            } else {
                // If quantity is 0 or less, remove the item from the cart.
                user.cart.splice(itemIndex, 1);
            }
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        
        await user.save();

        await user.populate('cart.product');
        res.status(200).json(user.cart);

    } catch (error) {
        console.error(`Error updating item quantity: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * Merges a guest's local cart (from localStorage) with the user's database cart
 * after they log in.
 * @param {object} req - The Express request object. Expects { cartItems } in the body.
 * @param {object} res - The Express response object.
 */
export const mergeCart = async (req, res) => {
  const { cartItems } = req.body;

  if (!Array.isArray(cartItems)) {
    return res.status(400).json({ message: 'Invalid cart format.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Merge logic
    cartItems.forEach(localItem => {
      const existingItemIndex = user.cart.findIndex(
        dbItem => dbItem.product.toString() === localItem._id
      );

      if (existingItemIndex > -1) {
        // If item already exists, add quantities.
        user.cart[existingItemIndex].quantity += localItem.quantity;
      } else {
        // If not, add the local item to the user's database cart.
        user.cart.push({ product: localItem._id, quantity: localItem.quantity });
      }
    });

    await user.save();
    
    await user.populate('cart.product');
    res.status(200).json(user.cart);

  } catch (error) {
    console.error(`Error merging carts: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Clears all items from the logged-in user's shopping cart.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
export const clearUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Empty the cart array.
    user.cart = [];
    await user.save();

    res.status(200).json(user.cart); // Returns an empty array.
  } catch (error) {
    console.error(`Error clearing cart: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};