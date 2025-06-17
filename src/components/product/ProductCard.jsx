// src/components/product/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart'; // Hook para adicionar ao carrinho

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addItem } = useCart(); // Pegamos também os cartItems para verificar o estoque

  // Se não houver dados do produto, não renderiza nada
  if (!product) {
    return null;
  }

  // --- NOVA LÓGICA DE ESTOQUE ---
  // Encontra este produto específico no carrinho para saber a quantidade atual
  const cartItem = cartItems.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Verifica as condições de estoque
  const isOutOfStock = product.countInStock === 0;
  const isLimitReached = quantityInCart >= product.countInStock;

  // Determina o texto e o estado do botão com base no estoque
  let buttonText = 'Adicionar ao Carrinho';
  let isButtonDisabled = false;

  if (isOutOfStock) {
    buttonText = 'Produto Esgotado';
    isButtonDisabled = true;
  } else if (isLimitReached) {
    buttonText = 'Limite em Estoque';
    isButtonDisabled = true;
  }
  // --- FIM DA NOVA LÓGICA ---

  const handleIncrement = () => {
    // Não permite aumentar a quantidade do seletor além do estoque disponível
    if (quantityInCart + quantity < product.countInStock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    // Limita a quantidade digitada ao estoque disponível
    if (!isNaN(newQuantity) && newQuantity > 0) {
      const availableStock = product.countInStock - quantityInCart;
      setQuantity(Math.min(newQuantity, availableStock));
    }
  };
  
  const handleAddToCart = () => {
    // Dupla verificação para garantir que não adiciona além do estoque
    if (product && !isButtonDisabled) {
      const availableStock = product.countInStock - quantityInCart;
      const quantityToAdd = Math.min(quantity, availableStock);

      if (quantityToAdd > 0) {
        addItem(product, quantityToAdd);
      }
    }
  };

  return (
    <div className="produto">
      {/* Imagem e Título do produto (sem alterações) */}
      <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={product.image || '/images/placeholder-image.png'}
          alt={product.name}
          style={{ width: '100%', height: '150px', objectFit: 'contain', cursor: 'pointer', marginBottom: '10px' }}
        />
      </Link>
      <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 style={{ cursor: 'pointer', minHeight: '44px', fontSize: '1rem', fontWeight: '600', margin: '0 0 5px 0', color: '#333' }}>
          {product.name}
        </h3>
      </Link>

      {/* Exibição do estoque (opcional, mas útil para o usuário) */}
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
            onChange={handleQuantityChange}
            min="1"
            aria-label="Quantidade"
            disabled={isButtonDisabled}
          />
          <button className="mais" aria-label="Aumentar quantidade" onClick={handleIncrement} disabled={isButtonDisabled}>+</button>
        </div>
        {/* Botão de adicionar ao carrinho agora é dinâmico */}
        <button className="adicionar-carrinho" onClick={handleAddToCart} disabled={isButtonDisabled}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;