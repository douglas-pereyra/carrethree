// src/components/product/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { cartItems, addItem } = useCart();

  if (!product) {
    return null;
  }

  // Lógica de estoque
  const cartItem = cartItems.find(item => item.product._id === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.countInStock === 0;
  const isLimitReached = quantityInCart >= product.countInStock;
  
  let buttonText = 'Adicionar ao Carrinho';
  let isButtonDisabled = false;

  if (isOutOfStock) {
    buttonText = 'Produto Esgotado';
    isButtonDisabled = true;
  } else if (isLimitReached) {
    buttonText = 'Limite em Estoque';
    isButtonDisabled = true;
  }

  const handleIncrement = () => {
    if (quantityInCart + quantity < product.countInStock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  
  const handleAddToCart = () => {
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
      {/* CORREÇÃO APLICADA AQUI, no link da imagem e do título */}
      <Link to={`/produto/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={product.image || '/images/placeholder-image.png'}
          alt={product.name}
          style={{ width: '100%', height: '150px', objectFit: 'contain', cursor: 'pointer', marginBottom: '10px' }}
        />
      </Link>
      
      <Link to={`/produto/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3
          title={product.name}
          style={{ minHeight: '44px', fontSize: '1rem', fontWeight: '600', margin: '0 0 5px 0', color: '#333' }}
        >
          {product.name}
        </h3>
      </Link>
      
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
