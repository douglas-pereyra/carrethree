/**
 * @fileoverview Defines the API routes for product-related operations (CRUD).
 * It handles fetching, creating, updating, and deleting products.
 */

import express from 'express';
import Product from '../models/Product.js';
import upload from '../config/upload.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


// --- Controller Functions ---

/**
 * Fetches all products. Can be filtered by a 'keyword' in the query string
 * for search functionality.
 */
const getProducts = async (req, res) => {
  try {
    // Create a filter object based on the keyword query parameter.
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } } // 'i' for case-insensitive search
      : {}; // If no keyword, the filter is empty and all products are returned.

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Fetches a single product by its ID.
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error fetching product by ID: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Creates a new product. This is a protected route for admins only.
 * It also handles the image upload.
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, countInStock } = req.body;
    
    // The 'upload' middleware processes the image and makes it available as `req.file`.
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required.' });
    }

    // Construct the full public URL for the newly uploaded image.
    const imageUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      price,
      image: imageUrl, // Save the full URL to the database.
      category,
      description,
      countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Updates an existing product. This is a protected route for admins only.
 */
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update fields with new values, or keep the old ones if no new value is provided.
      product.name = name || product.name;
      product.price = price || product.price;
      product.category = category || product.category;
      product.description = description === undefined ? product.description : description;
      product.countInStock = countInStock === undefined ? product.countInStock : countInStock;
      
      // If a new image file was uploaded, update the image URL.
      if (req.file) {
        product.image = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Deletes a product by its ID. This is a protected route for admins only.
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- Route Definitions ---

// @desc    Fetch all products or search by keyword
// @route   GET /api/products
// @access  Public
router.get('/', getProducts);

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', getProductById);

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), createProduct);

// @desc    Update a product by ID
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

export default router;