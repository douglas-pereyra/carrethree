// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function CartPage() {
  const {
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalPrice,  
  } = useCart();

  const totalPrice = getCartTotalPrice();
  const shippingCost = cartItems.some(item => item && item.product) ? 10.00 : 0;
  const grandTotal = totalPrice + shippingCost;

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(productId, newQuantity);
  };

  const handleDirectQuantityInput = (productId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Filtra itens inválidos antes de verificar o tamanho
  const validCartItems = cartItems.filter(item => item && item.product);

  if (validCartItems.length === 0) {
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

  return (
    <div className="carrinho">
      <div className="produtos-carrinho">
        <h2>Seu Carrinho</h2>
        {validCartItems.map(item => (
            <div className="produto-item" key={item.product._id}>
              <div className="produto-info">
                <img src={item.product.image} alt={item.product.name} />
                <div className="produto-texto">
                  <h4>{item.product.name}</h4>
                  <p className="preco-unitario-item">R$ {item.product.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <div className="quantidade">
                <button className="menos" onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}>-</button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleDirectQuantityInput(item.product._id, e)}
                  min="1"
                />
                <button className="mais" onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}>+</button>
              </div>

              <div className="preco">
                <p className="preco-total-item">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button className="remover" onClick={() => removeItem(item.product._id)}>
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