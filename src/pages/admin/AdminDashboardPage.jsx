// src/pages/admin/AdminDashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts'; // <-- MUDANÇA: Importa o useProducts
import { useAuth } from '../../hooks/useAuth';
import AdminProductCard from '../../components/admin/AdminProductCard';
import CategoryBar from '../../components/layout/CategoryBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function AdminDashboardPage() {
  const { products, isLoadingProducts, deleteProduct } = useProducts(); // <-- MUDANÇA: Pega a lista de produtos
  const { currentUser, isLoadingAuth } = useAuth();
  const [adminSelectedCategory, setAdminSelectedCategory] = useState('Todos');

  const handleDeleteProductRequest = async (productId, productName) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        alert(`Produto "${productName}" excluído com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert('Falha ao excluir produto.');
      }
    }
  };

  const handleAdminCategorySelect = (category) => {
    setAdminSelectedCategory(category);
  };

  // Unimos os dois 'loadings' em uma única verificação
  if (isLoadingProducts || isLoadingAuth) {
    return <div style={styles.pageMessage}>Carregando...</div>;
  }

  if (!currentUser?.isAdmin) {
    return <div style={styles.pageMessage}>Acesso não autorizado.</div>;
  }

  const filteredAdminProducts = adminSelectedCategory && adminSelectedCategory !== 'Todos'
    ? products.filter(product => product.category === adminSelectedCategory)
    : products;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <div style={styles.headerText}>
          <h2>Gerenciamento de Produtos</h2>
          <p>Bem-vindo(a), {currentUser.name}!</p>
        </div>
      </div>

      {/* --- A CategoryBar VOLTOU PARA CÁ --- */}
      {/* Agora ela recebe a lista de produtos dinâmica */}
      <CategoryBar
        products={products}
        onSelectCategory={handleAdminCategorySelect}
        activeCategory={adminSelectedCategory}
      />

      <Link to="/admin/produtos/novo" style={styles.addFabButton} title="Adicionar Novo Produto">
        <FontAwesomeIcon icon={faPlus} />
      </Link>

      {filteredAdminProducts.length === 0 ? (
        <p style={styles.pageMessage}>
          Nenhum produto cadastrado{adminSelectedCategory !== 'Todos' ? `para a categoria "${adminSelectedCategory}"` : ''}.
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

// Os estilos continuam os mesmos
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

export default AdminDashboardPage;