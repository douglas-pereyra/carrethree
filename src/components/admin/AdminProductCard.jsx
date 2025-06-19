/**
 * @fileoverview Defines the AdminProductCard component.
 * This component is used in the admin dashboard to display a summary of each product
 * along with controls for editing and deleting it.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// --- Style Objects ---
// Moved outside the component to prevent re-creation on every render.
const styles = {
  productCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  iconsContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    gap: '10px',
    zIndex: 1,
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
    width: '90%',
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
};

/**
 * Renders a product card for the admin dashboard with Edit and Delete controls.
 * @param {object} props - The component props.
 * @param {object} props.product - The product object to display.
 * @param {function} props.onDelete - The callback function to execute when the delete button is clicked.
 */
function AdminProductCard({ product, onDelete }) {
  // A safeguard to prevent rendering if no product data is passed.
  if (!product) {
    return null;
  }

  /**
   * A wrapper function for the delete action.
   * It calls the onDelete prop with the product's ID and name.
   */
  const handleDelete = () => {
    // Ensure the onDelete prop is a valid function before calling it.
    if (onDelete && typeof onDelete === 'function') {
      onDelete(product._id, product.name);
    }
  };

  return (
    <div style={styles.productCard}>
      {/* Container for the Edit and Delete action icons */}
      <div style={styles.iconsContainer}>
        {/* The Edit icon is a Link that navigates to the product's edit page. */}
        <Link to={`/admin/produtos/editar/${product._id}`} style={styles.iconLink} title="Editar Produto">
          <FontAwesomeIcon icon={faPencilAlt} />
        </Link>
        {/* The Delete icon is a button that triggers the handleDelete function. */}
        <button onClick={handleDelete} style={styles.iconButton} title="Deletar Produto">
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>

      {/* Product Information Display */}
      <img src={product.image || '/images/placeholder-image.png'} alt={product.name} style={styles.productImage} />
      <h3 style={styles.productName}>{product.name}</h3>
      <p style={styles.productPrice}>R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : 'N/A'}</p>
      <p style={styles.productCategory}>Categoria: {product.category || 'N/A'}</p>
    </div>
  );
}

export default AdminProductCard;