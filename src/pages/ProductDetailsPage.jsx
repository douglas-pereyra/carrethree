// src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate }
from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

function ProductDetailsPage() {
  const { productId } = useParams(); // Pega o ID da URL
  const { getProductById, isLoadingProducts } = useProducts();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isLoadingProducts) { // Só busca se os produtos já foram carregados no contexto
      console.log(`[ProductDetailsPage] Procurando produto com ID: ${productId}`);
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setNotFound(false);
        console.log('[ProductDetailsPage] Produto encontrado:', foundProduct);
      } else {
        setNotFound(true);
        console.warn(`[ProductDetailsPage] Produto com ID ${productId} não encontrado.`);
      }
    }
  }, [productId, getProductById, isLoadingProducts]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleDirectQuantityInput = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (event.target.value === '') {
      setQuantity(1); // Ou mantenha o valor atual, ou trate como 1
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      alert(`${quantity}x "${product.name}" adicionado(s) ao carrinho!`);
      // Opcional: Redirecionar para o carrinho ou continuar comprando
      // navigate('/carrinho');
    }
  };

  if (isLoadingProducts) {
    return <div style={styles.pageMessage}>Carregando informações do produto...</div>;
  }

  if (notFound) {
    return (
      <div style={styles.pageMessage}>
        <h2>Produto não encontrado</h2>
        <p>O produto que você está procurando não existe ou não está mais disponível.</p>
        <Link to="/" style={styles.buttonLink}>Voltar para Home</Link>
      </div>
    );
  }

  if (!product) {
    // Pode acontecer brevemente antes do useEffect definir o produto ou se algo der muito errado
    return <div style={styles.pageMessage}>Carregando...</div>;
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
          <p style={styles.productPrice}>R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : 'N/A'}</p>
          <p style={styles.productDescription}>{product.description || 'Sem descrição disponível.'}</p>

          <div style={styles.actionsContainer}>
            <div style={styles.quantityControl}>
              <button onClick={() => handleQuantityChange(-1)} style={styles.quantityButton}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={handleDirectQuantityInput}
                min="1"
                style={styles.quantityInput}
                aria-label="Quantidade"
              />
              <button onClick={() => handleQuantityChange(1)} style={styles.quantityButton}>+</button>
            </div>
            <button onClick={handleAddToCart} style={styles.addToCartButton}>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilos (mova para um arquivo CSS se preferir)
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
    flexWrap: 'wrap', // Para responsividade
  },
  imageContainer: {
    flex: '1 1 300px', // Permite encolher e crescer, base de 300px
    maxWidth: '400px', // Limita o tamanho máximo da imagem
  },
  productImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  detailsContainer: {
    flex: '2 1 400px', // Permite crescer mais, base de 400px
  },
  productName: {
    fontSize: '2em',
    marginBottom: '10px',
    color: '#333',
  },
  productCategory: {
    fontSize: '0.9em',
    color: '#6c757d',
    marginBottom: '15px',
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
    backgroundColor: '#149c68', // Sua cor primária (do add ao carrinho na home)
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  // addToCartButton:hover { backgroundColor: '#108a54' } // Adicionar ao CSS
  pageMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
  },
  buttonLink: { // Para o link de "Voltar para Home"
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