/**
 * @fileoverview The main entry point for the Carrethree React application.
 * This file renders the root App component and wraps it with all the necessary
 * context providers to manage the application's global state.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/styles.css';
import { CartProvider } from './contexts/CartProvider.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { ProductProvider } from './contexts/ProductProvider.jsx';

// Renders the root component of the application into the DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* A tool for highlighting potential problems in an application. */}
    <AuthProvider>      {/* Manages user session, must be outermost as other contexts depend on it. */}
      <ProductProvider> {/* Manages product data, may need auth state for admin actions. */}
        <CartProvider>  {/* Manages cart data, depends on auth state for its hybrid logic. */}
          <App />       {/* The App component and all its children can now access all three contexts. */}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);