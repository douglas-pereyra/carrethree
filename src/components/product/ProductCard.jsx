/**
 * @fileoverview Defines the ProductCard component, which displays a single
 * product in a grid, including its details and actions.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

// --- Style Objects ---
// Consolidating inline styles here for better readability and performance.
const styles = {
  link: { textDecoration: 'none', color: 'inherit' },
  image: { width: '100%', height: '150px', objectFit: 'contain', cursor: 'pointer', marginBottom: '10px' },
  name: { minHeight: '44px', fontSize: '1rem', fontWeight: '600', margin: '0 0 5px 0', color: '#333' },
};


/**
 * Renders a card for a single product.
 * It displays product information and allows the user to manage the quantity
 * and add the product to the shopping cart.
 *
 * @param {{product: object}} props - The component props.
 * @param {object} props.product - The product object to display.
 */
function ProductCard({ product }) {
  // Local state to manage the quantity selector for this specific card.
  const [quantity, setQuantity] = useState(1);
  // Get cart state and actions from the CartContext.
  const { cartItems, addItem } = useCart();

  // If for some reason the product prop is not provided, render nothing.
  if (!product) {
    return null;
  }

  // --- Stock Availability Logic ---

  // Find this product in the global cart to see how many are already there.
  const cartItem = cartItems.find(item => item._id === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  
  // Determine the product's stock status.
  const isOutOfStock = product.countInStock === 0;
  const isLimitReached = quantityInCart >= product.countInStock;
  
  // Set the text and disabled state of the "Add to Cart" button based on stock.
  let buttonText = 'Adicionar ao Carrinho';
  let isButtonDisabled = false;

  if (isOutOfStock) {
    buttonText = 'Produto Esgotado';
    isButtonDisabled = true;
  } else if (isLimitReached) {
    buttonText = 'Limite em Estoque';
    isButtonDisabled = true;
  }

  // --- Event Handlers ---

  const handleIncrement = () => {
    // Prevents the user from selecting a quantity higher than the available stock.
    if (quantityInCart + quantity < product.countInStock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    // The quantity cannot go below 1.
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  
  const handleAddToCart = () => {
    if (isButtonDisabled) return; // Do nothing if button is disabled.

    // Ensure the quantity to add doesn't exceed the available stock.
    const availableStock = product.countInStock - quantityInCart;
    const quantityToAdd = Math.min(quantity, availableStock);
    
    if (quantityToAdd > 0) {
      addItem(product, quantityToAdd);
      // Reset local quantity selector to 1 after adding to cart.
      setQuantity(1);
    }
  };

  return (
    <div className="produto">
      {/* Both the image and title are links to the product's detail page. */}
      <Link to={`/produto/${product._id}`} style={styles.link}>
        <img
          src={product.image || '/images/placeholder-image.png'}
          alt={product.name}
          style={styles.image}
        />
      </Link>
      
      <Link to={`/produto/${product._id}`} style={styles.link}>
        <h3 title={product.name} style={styles.name}>
          {product.name}
        </h3>
      </Link>
      
      {/* Display stock status to the user. */}
      <p style={{ fontSize: '0.8em', color: isOutOfStock ? 'red' : '#6c757d' }}>
        {isOutOfStock ? 'Sem estoque' : `Estoque: ${product.countInStock}`}
      </p>

      <div className="preco-e-controle">
        <p className="preco">
          R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : 'N/A'}
        </p>
        
        <div className="controle">
          <button className="menos" aria-label="Diminuir quantidade" onClick={handleDecrement} disabled={isButtonDisabled}>-</button>
          <input
            type="number"
            value={quantity}
            // Reading from state, so onChange is mainly for direct input (optional).
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
            aria-label="Quantidade"
            disabled={isButtonDisabled}
          />
          <button className="mais" aria-label="Aumentar quantidade" onClick={handleIncrement} disabled={isButtonDisabled}>+</button>
        </div>
        
        <button className="adicionar-carrinho" onClick={handleAddToCart} disabled={isButtonDisabled}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;