// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function ProductDetailsPage() {
  const { productId } = useParams(); // Pega o ID da URL
  const { addItem, cartItems } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Este useEffect agora busca os dados diretamente da nossa API.
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Produto não encontrado');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Roda sempre que o ID na URL mudar.

  // Lógica de Estoque (reaplicada aqui)
  const cartItem = product ? cartItems.find(item => item.product._id === product._id) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product && product.countInStock === 0;
  const isLimitReached = product && quantityInCart >= product.countInStock;

  let buttonText = 'Adicionar ao Carrinho';
  let isButtonDisabled = false;

  if (isOutOfStock) {
    buttonText = 'Produto Esgotado';
    isButtonDisabled = true;
  } else if (isLimitReached) {
    buttonText = 'Limite em Estoque';
    isButtonDisabled = true;
  }
  
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const availableStock = product.countInStock - quantityInCart;
    if (newQuantity > 0 && newQuantity <= availableStock) {
        setQuantity(newQuantity);
    }
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

  if (isLoading) {
    return <div style={styles.pageMessage}>Carregando informações do produto...</div>;
  }

  if (error) {
    return (
      <div style={styles.pageMessage}>
        <h2>Produto não encontrado</h2>
        <p>O produto que você está procurando não existe ou não está mais disponível.</p>
        <Link to="/" style={styles.buttonLink}>Voltar para Home</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>&larr; Voltar</button>
      <div style={styles.productDetailLayout}>
        <div style={styles.imageContainer}>
          <img src={product.image || '/images/placeholder-image.png'} alt={product.name} style={styles.productImage} />
        </div>
        <div style={styles.detailsContainer}>
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.productCategory}>Categoria: {product.category}</p>
          <p style={{ fontSize: '0.9em', color: isOutOfStock ? 'red' : '#6c757d', marginBottom: '15px' }}>
            {isOutOfStock ? 'Sem estoque' : `Estoque disponível: ${product.countInStock}`}
          </p>
          <p style={styles.productPrice}>R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : 'N/A'}</p>
          <p style={styles.productDescription}>{product.description || 'Sem descrição disponível.'}</p>

          <div style={styles.actionsContainer}>
            <div style={styles.quantityControl}>
              <button onClick={() => handleQuantityChange(-1)} style={styles.quantityButton} disabled={isButtonDisabled}>-</button>
              <input
                type="number"
                value={quantity}
                readOnly
                style={styles.quantityInput}
                aria-label="Quantidade"
              />
              <button onClick={() => handleQuantityChange(1)} style={styles.quantityButton} disabled={isButtonDisabled}>+</button>
            </div>
            <button onClick={handleAddToCart} style={styles.addToCartButton} disabled={isButtonDisabled}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ... (seus estilos continuam aqui)
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  backButton: {
    marginBottom: '20px',
    padding: '8px 15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  productDetailLayout: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  imageContainer: {
    flex: '1 1 300px',
    maxWidth: '400px',
  },
  productImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  detailsContainer: {
    flex: '2 1 400px',
  },
  productName: {
    fontSize: '2em',
    marginBottom: '10px',
    color: '#333',
  },
  productCategory: {
    fontSize: '0.9em',
    color: '#6c757d',
    marginBottom: '5px',
    textTransform: 'uppercase',
  },
  productPrice: {
    fontSize: '1.8em',
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  productDescription: {
    fontSize: '1em',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '20px',
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
  },
  quantityInput: {
    width: '50px',
    textAlign: 'center',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    margin: '0 5px',
    fontSize: '1em',
  },
  quantityButton: {
    padding: '8px 12px',
    fontSize: '1em',
    cursor: 'pointer',
    backgroundColor: '#e9ecef',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  addToCartButton: {
    padding: '12px 25px',
    backgroundColor: '#149c68',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  pageMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
  },
  buttonLink: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  }
};

export default ProductDetailsPage;

