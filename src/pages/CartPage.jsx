// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para o link de "Continuar comprando" e "Ir para pagamento"
import { useCart } from '../hooks/useCart';

function CartPage() {
  const {
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalPrice,  
  } = useCart();

  console.log('CartPage - cartItems:', cartItems);

  const totalPrice = getCartTotalPrice();
  const shippingCost = cartItems.length > 0 ? 10.00 : 0; // Exemplo de frete, só se tiver itens
  const grandTotal = totalPrice + shippingCost;

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeItem(productId); // Ou updateQuantity(productId, 0) que também remove
    }
  };

  // Para o input de quantidade direto (opcional, mas útil)
  const handleDirectQuantityInput = (productId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else if (event.target.value === '' || newQuantity <= 0) {
      // Se o campo estiver vazio ou inválido, podemos remover ou setar para 1.
      // Por consistência com o botão '-', vamos remover se for <=0
      // Poderia também resetar para a quantidade anterior ou 1.
      // Para simplificar, vamos deixar o usuário usar os botões ou digitar um número válido.
      // Se deixar o campo vazio e sair, não faz nada até uma ação explícita.
      // Ou, para uma melhor UX, podemos remover o item se a quantidade digitada for <= 0.
      if (!isNaN(newQuantity) && newQuantity <=0) {
        removeItem(productId);
      }
    }
  };


  if (cartItems.length === 0) {
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
        {cartItems.map(item => (
          <div className="produto-item" key={item.id}>
            <div className="produto-info">
              <img src={item.image} alt={item.name} />
              <div className="produto-texto">
                <h4>{item.name}</h4>
                <p className="preco-unitario-item">R$ {item.price.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <div className="quantidade">
              <button className="menos" onClick={() => handleQuantityChange(item.id, item.quantity, -1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleDirectQuantityInput(item.id, e)}
                min="1"
              />
              <button className="mais" onClick={() => handleQuantityChange(item.id, item.quantity, 1)}>+</button>
            </div>

            <div className="preco">
              <p className="preco-total-item">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </p>
            </div>

            <button className="remover" onClick={() => removeItem(item.id)}>
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

      <div className="valor-total"> {/* Resumo do pedido */}
        <h2>Resumo do Pedido</h2>
        <p><strong>Subtotal:</strong> R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
        <p><strong>Frete:</strong> R$ {shippingCost.toFixed(2).replace('.', ',')}</p>
        <p className="total-line"><strong>Total:</strong> R$ {grandTotal.toFixed(2).replace('.', ',')}</p>
        <Link to="/checkout" className="btn-pagamento"> {/* Rota para futura página de checkout */}
          Ir para pagamento
        </Link>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="btn-limpar-carrinho">
            Limpar Carrinho
          </button>
        )}
      </div>
    </div>
  );
}

export default CartPage;