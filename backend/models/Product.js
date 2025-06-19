/**
 * @fileoverview Defines the Mongoose schema and model for a Product.
 * This file is responsible for structuring the product data in the MongoDB database.
 */

import mongoose from 'mongoose';

// Defines the structure for a product document in the database.
const productSchema = new mongoose.Schema(
  {
    // The name of the product. It is a required field.
    name: { 
      type: String, 
      required: true 
    },
    // The price of the product. It is a required field.
    price: { 
      type: Number, 
      required: true 
    },
    // The URL path to the product's image. It is a required field.
    image: { 
      type: String, 
      required: true 
    },
    // The category the product belongs to (e.g., "Laticinios", "Limpeza"). Required field.
    category: { 
      type: String, 
      required: true 
    },
    // A detailed description of the product. This field is optional.
    description: { 
      type: String 
    },
    // The number of items available in stock. Required, with a default value of 0.
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // Mongoose option to automatically add `createdAt` and `updatedAt` fields.
    // This helps track when a document was created and last modified.
    timestamps: true,
  }
);

// Creates the 'Product' model from the schema.
// A model is a class that allows us to interact with the 'products' collection in the database.
const Product = mongoose.model('Product', productSchema);

export default Product;