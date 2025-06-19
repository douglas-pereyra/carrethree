/**
 * @fileoverview Defines the MyAccountPage component, which serves as the user's
 * personal dashboard.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- Style Objects ---
// Moved outside the component to prevent re-creation on every render.
const styles = {
  accountContainer: {
    padding: '30px 40px',
    maxWidth: '800px',
    margin: '40px auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
    fontSize: '0.95em',
    transition: 'background-color 0.2s ease',
  },
  welcomeSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
  },
  ordersSection: {
    marginTop: '30px',
    padding: '20px',
    borderTop: '1px solid #e9ecef',
  },
  sectionTitle: {
    fontSize: '1.3em',
    marginBottom: '20px',
    color: '#343a40',
    borderBottom: '1px dashed #ced4da',
    paddingBottom: '10px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  infoItem: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '1em',
  },
  actionLink: {
    display: 'inline-block',
    marginTop: '15px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px 12px',
    border: '1px solid #007bff',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  pageMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
  }
};

/**
 * Renders the user's account page.
 * It displays user information, provides a logout button, and will eventually
 * show order history. Access is protected by the ProtectedRoute component.
 */
function MyAccountPage() {
  const { currentUser, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  // Calls the logout function from the AuthContext.
  const handleLogout = () => {
    // The logout function already handles clearing state and localStorage.
    // The callback navigates the user back to the homepage.
    logout(() => navigate('/', { replace: true }));
  };

  // --- Render Guards ---
  
  if (isLoadingAuth) {
    return <div style={styles.pageMessage}>Carregando dados da sua conta...</div>;
  }

  // Fallback check in case ProtectedRoute fails or currentUser is null.
  if (!currentUser) {
    return (
      <div style={styles.pageMessage}>
        Não foi possível carregar os dados. Por favor, tente fazer login novamente.
      </div>
    );
  }

  return (
    <div style={styles.accountContainer}>
      {/* Page Header */}
      <header style={styles.header}>
        <h1>Minha Conta</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </header>

      {/* Welcome Message */}
      <section style={styles.welcomeSection}>
        <p>Olá, <strong>{currentUser.name}!</strong></p>
        <p>Bem-vindo(a) ao seu espaço pessoal. Aqui você pode gerenciar seus dados e pedidos.</p>
      </section>

      {/* Account Information */}
      <section style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Informações da Conta</h2>
        <div style={styles.infoGrid}>
            <div style={styles.infoItem}><strong>Nome:</strong> {currentUser.name}</div>
            <div style={styles.infoItem}><strong>Email:</strong> {currentUser.email}</div>
        </div>
      </section>

      {/* Order History Section */}
      <section style={styles.ordersSection}>
        <h2 style={styles.sectionTitle}>Meus Pedidos</h2>
        <p>Você ainda não tem pedidos registrados.</p>
        <p>(Funcionalidade de histórico de pedidos em breve)</p>
        <Link to="/" style={styles.actionLink}>Comece a Comprar</Link>
      </section>
    </div>
  );
}

export default MyAccountPage;