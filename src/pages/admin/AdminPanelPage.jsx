/**
 * @fileoverview Defines the AdminPanelPage component, which acts as a central
 * navigation hub for authenticated administrators.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// --- Style Objects ---
// Moved outside the component to prevent re-creation on every render.
const styles = {
  panelContainer: {
    padding: '30px 40px',
    maxWidth: '800px',
    margin: '40px auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px',
    marginBottom: '30px',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9em',
    transition: 'background-color 0.2s ease',
  },
  welcomeSection: {
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
    textAlign: 'center',
  },
  navSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.4em',
    marginBottom: '15px',
    color: '#343a40',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    marginBottom: '12px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '1.1em',
    padding: '10px 15px',
    display: 'block',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  infoSection: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '2px solid #f0f0f0',
  },
  pageMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
  }
};

/**
 * Renders the admin panel page.
 * This page serves as a welcome screen and a navigation menu for administrators,
 * providing quick links to key management areas like the product dashboard.
 */
function AdminPanelPage() {
  const { currentUser, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  // Calls the logout function from the AuthContext to sign the user out.
  const handleLogout = () => {
    logout(() => navigate('/', { replace: true }));
  };

  // --- Render Guards ---

  if (isLoadingAuth) {
    return <div style={styles.pageMessage}>Carregando...</div>;
  }

  // Fallback guard, though AdminProtectedRoute should prevent non-admins from reaching this page.
  if (!currentUser?.isAdmin) {
    return <div style={styles.pageMessage}>Acesso não autorizado.</div>;
  }

  return (
    <div style={styles.panelContainer}>
      {/* Page Header with title and logout button */}
      <header style={styles.header}>
        <h1>Painel do Administrador</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </header>

      {/* Welcome message for the logged-in admin */}
      <section style={styles.welcomeSection}>
        <p>Olá, <strong>{currentUser.name}!</strong></p>
        <p>Bem-vindo(a) ao seu painel de controle administrativo.</p>
      </section>

      {/* Quick Actions Navigation */}
      <nav style={styles.navSection}>
        <h2 style={styles.sectionTitle}>Ações Rápidas</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/admin/dashboard" style={styles.navLink}>
              Visualizar & Gerenciar Produtos
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin/produtos/novo" style={styles.navLink}>
              Adicionar Novo Produto
            </Link>
          </li>
        </ul>
      </nav>

      {/* Basic Account Information */}
      <section style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Informações da Conta</h2>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Tipo de Conta:</strong> Administrador</p>
      </section>
    </div>
  );
}

export default AdminPanelPage;