/**
 * @fileoverview A script to populate (seed) or clear the database.
 * This is a development tool used to quickly set up a database with sample data
 * or to reset it to a clean state. It is not part of the main application runtime.
 */

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import users from '../data/users.js';
import productsData from '../data/mockProducts.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

// Load environment variables and connect to the database.
dotenv.config();
connectDB();

/**
 * Wipes all existing data and imports fresh sample data into the database.
 */
const importData = async () => {
  try {
    // 1. Clear existing data from the collections to prevent duplicates.
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Old data destroyed...');

    // 2. Prepare user data by hashing their passwords.
    // It's crucial to hash passwords even for sample users.
    const createdUsers = users.map(user => {
        return {
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        }
    });

    // 3. Insert the prepared user and product data into the database.
    await User.insertMany(createdUsers);
    console.log('✅ Admin Users Imported!');

    await Product.insertMany(productsData);
    console.log('✅ Products Imported Successfully!');

    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error}`);
    process.exit(1);
  }
};

/**
 * Wipes all user and product data from the database.
 */
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error}`);
    process.exit(1);
  }
};

/**
 * Script execution logic.
 * Checks for a command-line argument to decide which function to run.
 * To run: `node backend/utils/seeder.js` (imports data)
 * To run: `node backend/utils/seeder.js -d` (destroys data)
 */
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}