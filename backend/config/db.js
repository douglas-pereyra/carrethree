/**
 * @fileoverview This file contains the function to connect to the MongoDB database.
 * It uses the Mongoose library and environment variables for the connection string.
 */

import mongoose from 'mongoose';

/**
 * Asynchronously connects to the MongoDB database using the connection string
 * from the environment variables.
 * If the connection fails, it logs the error and exits the application process.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log the host it connected to for confirmation.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during connection, log the specific error message.
    console.error(`Error connecting to MongoDB: ${error.message}`);
    
    // Exit the Node.js process with a "failure" code (1).
    // This is crucial because the application cannot run without a database connection.
    process.exit(1);
  }
};

export default connectDB;