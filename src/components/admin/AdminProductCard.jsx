// src/components/admin/AdminProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function AdminProductCard({ product, onDelete }) {
  if (!product) {
    return null;
  }

  const handleDelete = () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(product.id, product.name); // Passa ID e nome para a função de deletar
    }
  };

  return (
    <div style={styles.productCard}>
      <div style={styles.iconsContainer}>
        <Link to={`/admin/produtos/editar/${product.id}`} style={styles.iconLink} title="Editar Produto">
          <FontAwesomeIcon icon={faPencilAlt} />
        </Link>
        <button onClick={handleDelete} style={styles.iconButton} title="Deletar Produto">
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
      <img src={product.image || '/images/placeholder-image.png'} alt={product.name} style={styles.productImage} />
      <h3 style={styles.productName}>{product.name}</h3>
      <p style={styles.productPrice}>R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : 'N/A'}</p>
      <p style={styles.productCategory}>Categoria: {product.category || 'N/A'}</p>
      {/* Você pode adicionar mais detalhes do produto aqui se desejar, como descrição curta */}
      {/* <p style={styles.productDescription}>{product.description?.substring(0, 50) || ''}...</p> */}
    </div>
  );
}

// Estilos básicos para o card. Você pode mover para um arquivo CSS.
const styles = {
  productCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative', // Para posicionamento absoluto dos ícones
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // Para que os cards tenham a mesma altura no grid
  },
  iconsContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    gap: '10px',
    zIndex: 1, // Para garantir que os ícones fiquem sobre a imagem
  },
  iconLink: {
    color: '#007bff',
    fontSize: '1.1rem',
    textDecoration: 'none',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: 0,
  },
  productImage: {
    width: '90%', // Para não encostar nas bordas
    maxHeight: '150px',
    objectFit: 'contain',
    marginBottom: '10px',
    alignSelf: 'center',
  },
  productName: {
    fontSize: '1.1em',
    fontWeight: '600',
    margin: '10px 0 5px 0',
    color: '#333',
  },
  productPrice: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: '1.2em',
    margin: '5px 0',
  },
  productCategory: {
    fontSize: '0.9em',
    color: '#6c757d',
    marginBottom: '10px',
  },
  // productDescription: { // Estilo opcional para descrição
  //   fontSize: '0.85em',
  //   color: '#555',
  //   flexGrow: 1, // Para ocupar espaço restante
  // },
};

export default AdminProductCard;