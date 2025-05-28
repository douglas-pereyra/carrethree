// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/styles.css'; // Seu CSS global
import { CartProvider } from './contexts/CartProvider.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { ProductProvider } from './contexts/ProductProvider.jsx'; // Verifique se está importado

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider> {/* ProductProvider está aqui */}
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);