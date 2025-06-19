/**
 * @fileoverview Defines the AdminDashboardPage component.
 * This is the main interface for administrators to view, filter, and manage products.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';
import AdminProductCard from '../../components/admin/AdminProductCard';
import CategoryBar from '../../components/layout/CategoryBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// --- Style Objects ---
// Moved outside the component to prevent re-creation on every render.
const styles = {
  pageContainer: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  headerText: {
    flexGrow: 1,
  },
  addFabButton: {
    backgroundColor: '#28a745',
    color: 'white',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '1.8rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease-in-out',
    cursor: 'pointer',
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 1000,
  },
  productListGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  pageMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
  }
};


/**
 * Renders the main admin dashboard for product management.
 * It fetches all products and displays them in a grid.
 * Provides functionality to filter products by category and to delete products.
 */
function AdminDashboardPage() {
  // --- Hooks & State ---
  const { products, isLoadingProducts, deleteProduct } = useProducts();
  const { currentUser, isLoadingAuth } = useAuth();
  // Local state to manage the selected category for filtering.
  const [adminSelectedCategory, setAdminSelectedCategory] = useState('Todos');

  // --- Event Handlers ---

  /**
   * Handles the request to delete a product.
   * Shows a confirmation dialog before proceeding.
   * @param {string} productId - The ID of the product to delete.
   * @param {string} productName - The name of the product, used in the confirmation dialog.
   */
  const handleDeleteProductRequest = async (productId, productName) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        alert(`Produto "${productName}" excluído com sucesso!`);
      } catch (error) {
        // In a real app, you might use a more sophisticated notification system.
        alert('Falha ao excluir produto.');
      }
    }
  };

  /**
   * Updates the state with the currently selected category from the CategoryBar.
   * @param {string} category - The selected category name.
   */
  const handleAdminCategorySelect = (category) => {
    setAdminSelectedCategory(category);
  };

  // --- Render Guards ---

  // Show a loading message while either products or auth state are being loaded.
  if (isLoadingProducts || isLoadingAuth) {
    return <div style={styles.pageMessage}>Carregando...</div>;
  }

  // A fallback guard, although AdminProtectedRoute should handle this.
  if (!currentUser?.isAdmin) {
    return <div style={styles.pageMessage}>Acesso não autorizado.</div>;
  }

  // --- Data Filtering ---
  // This filtering is done on the client-side based on the selected category.
  const filteredAdminProducts = adminSelectedCategory !== 'Todos'
    ? products.filter(product => product.category === adminSelectedCategory)
    : products;

  // --- Main Render ---
  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.headerText}>
          <h2>Gerenciamento de Produtos</h2>
          <p>Bem-vindo(a), {currentUser.name}!</p>
        </div>
      </header>
      
      {/* The CategoryBar is used here to provide filtering controls for the admin. */}
      <CategoryBar
        products={products} // Note: It receives the full product list to generate all categories.
        onSelectCategory={handleAdminCategorySelect}
        activeCategory={adminSelectedCategory}
      />

      {/* Floating Action Button (FAB) to add a new product. */}
      <Link to="/admin/produtos/novo" style={styles.addFabButton} title="Adicionar Novo Produto">
        <FontAwesomeIcon icon={faPlus} />
      </Link>

      {/* Conditionally render the product grid or a "no products" message. */}
      {filteredAdminProducts.length === 0 ? (
        <p style={styles.pageMessage}>
          Nenhum produto cadastrado{adminSelectedCategory !== 'Todos' ? ` para a categoria "${adminSelectedCategory}"` : ''}.
          Adicione um clicando no botão '+'.
        </p>
      ) : (
        <div style={styles.productListGrid}>
          {filteredAdminProducts.map(product => (
            <AdminProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteProductRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;