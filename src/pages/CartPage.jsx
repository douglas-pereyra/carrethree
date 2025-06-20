/**
 * @fileoverview Defines the CartPage component, which displays the items
 * in the user's shopping cart and allows for modifications.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

/**
 * Renders the main shopping cart page.
 * It displays a list of items in the cart, allows users to update quantities
 * or remove items, and shows the total price before proceeding to checkout.
 */
function CartPage() {
  // Get all cart data and action functions from the CartContext.
  const {
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalPrice,
  } = useCart();

  // Calculate totals for the order summary.
  const totalPrice = getCartTotalPrice();
  // A simple shipping cost logic: applies a flat fee if there are items in the cart.
  const shippingCost = cartItems.length > 0 ? 10.00 : 0;
  const grandTotal = totalPrice + shippingCost;

  /**
   * A helper to handle clicks on the '+' and '-' buttons for quantity.
   * @param {string} productId The ID of the product to update.
   * @param {number} currentQuantity The current quantity of the item.
   * @param {number} change The amount to change by (+1 or -1).
   */
  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(productId, newQuantity); // The provider handles the logic for quantity <= 0
  };

  /**
   * A helper to handle direct input into the quantity number field.
   * @param {string} productId The ID of the product to update.
   * @param {React.ChangeEvent<HTMLInputElement>} event The input change event.
   */
  const handleDirectQuantityInput = (productId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    // Update only if the input is a valid number.
    if (!isNaN(newQuantity)) {
      updateQuantity(productId, newQuantity);
    }
  };

  // --- Conditional Rendering ---

  // If the cart is empty, display a message and a link to continue shopping.
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="carrinho-vazio" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Seu carrinho está vazio.</h2>
        <p>Adicione produtos para vê-los aqui.</p>
        <Link to="/" className="btn-continuar-comprando" style={{ textDecoration: 'none', backgroundColor: '#149c68', color: 'white', padding: '10px 20px', borderRadius: '5px', marginTop: '20px', display: 'inline-block' }}>
          Continuar Comprando
        </Link>
      </div>
    );
  }

  // --- Main Render ---
  
  return (
    <div className="carrinho">
      {/* Left side: List of products in the cart */}
      <div className="produtos-carrinho">
        <h2>Seu Carrinho</h2>
        {cartItems.map(item => (
            // **FIX**: The key and all data now come directly from the `item` object.
            <div className="produto-item" key={item._id}>
              <div className="produto-info">
                <img src={item.image} alt={item.name} />
                <div className="produto-texto">
                  <h4>{item.name}</h4>
                  <p className="preco-unitario-item">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <div className="quantidade">
                <button className="menos" onClick={() => handleQuantityChange(item._id, item.quantity, -1)}>-</button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleDirectQuantityInput(item._id, e)}
                  min="1"
                />
                <button className="mais" onClick={() => handleQuantityChange(item._id, item.quantity, 1)}>+</button>
              </div>

              <div className="preco">
                <p className="preco-total-item">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button className="remover" onClick={() => removeItem(item._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7 6v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 11v4" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 11v4" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="10" y1="3" x2="14" y2="3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
      </div>

      {/* Right side: Order Summary */}
      <div className="valor-total">
        <h2>Resumo do Pedido</h2>
        <p><strong>Subtotal:</strong> R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
        <p><strong>Frete:</strong> R$ {shippingCost.toFixed(2).replace('.', ',')}</p>
        <p className="total-line"><strong>Total:</strong> R$ {grandTotal.toFixed(2).replace('.', ',')}</p>
        <Link to="/checkout" className="btn-pagamento">
          Ir para pagamento
        </Link>
        <button onClick={clearCart} className="btn-limpar-carrinho">
          Limpar Carrinho
        </button>
      </div>
    </div>
  );
}

export default CartPage;