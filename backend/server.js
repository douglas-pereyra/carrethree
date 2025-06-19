/**
 * @fileoverview The main entry point for the Carrethree backend server.
 * This file initializes the Express application, connects to the database,
 * configures middleware, mounts API routes, and starts the server.
 */

// --- 1. Module Imports ---
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// --- 2. Initializations ---

// Load environment variables from the .env file into process.env
dotenv.config();

// Establish the connection to the MongoDB database
connectDB();

// Initialize the Express application
const app = express();


// --- 3. Middleware Configuration ---

// Enable Cross-Origin Resource Sharing (CORS) to allow requests from the frontend client.
app.use(cors());

// Enable the application to parse incoming requests with JSON payloads.
app.use(express.json());


// --- 4. API Routes ---

// A simple root route to confirm that the API is running.
app.get('/', (req, res) => {
  res.send('Carrethree API is running...');
});

// Mount the routers for different parts of the API.
// All routes defined in productRoutes will be prefixed with /api/products.
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);


// --- 5. Static Asset Handling ---

// In ES Modules, __dirname is not available by default. This logic re-creates it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure a static folder for serving uploaded images.
// A request to '/uploads/image.jpg' will serve the file from 'backend/public/uploads/image.jpg'.
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));


// --- 6. Server Startup ---

// Define the port for the server, using the value from the .env file or defaulting to 5000.
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming connections on the specified port.
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});