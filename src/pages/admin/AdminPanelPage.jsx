// src/pages/admin/AdminPanelPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AdminPanelPage() {
  const { currentUser, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => navigate('/', { replace: true }));
  };

  if (isLoadingAuth) {
    return <div style={styles.pageMessage}>Carregando...</div>;
  }

  if (!currentUser?.isAdmin) {
    // Segurança extra, AdminProtectedRoute deve lidar com isso
    return <div style={styles.pageMessage}>Acesso não autorizado.</div>;
  }

  return (
    <div style={styles.panelContainer}>
      <header style={styles.header}>
        <h1>Painel do Administrador</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </header>

      <section style={styles.welcomeSection}>
        <p>Olá, <strong>{currentUser.name}!</strong></p>
        <p>Bem-vindo(a) ao seu painel de controle administrativo.</p>
      </section>

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
          {/* Adicione mais links conforme necessário */}
          <li style={styles.navItem}>
            <Link to="/admin/configuracoes" style={styles.navLinkDisabled}>
              Configurações da Conta (Em breve)
            </Link>
          </li>
        </ul>
      </nav>

      <section style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Informações da Conta</h2>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Tipo de Conta:</strong> Administrador</p>
      </section>
    </div>
  );
}

// Estilos para o Painel Admin
const styles = {
  panelContainer: {
    padding: '30px 40px',
    maxWidth: '800px',
    margin: '40px auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
    fontFamily: 'Arial, sans-serif', // Exemplo de fonte diferente se desejar
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
    backgroundColor: '#e74c3c', // Vermelho um pouco diferente
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9em',
    transition: 'background-color 0.2s ease',
  },
  // logoutButton:hover { background-color: #c0392b; }
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
  // navLink:hover { background-color: #e2e6ea; color: #0056b3; }
  navLinkDisabled: {
    textDecoration: 'none',
    color: '#6c757d',
    fontSize: '1.1em',
    padding: '10px 15px',
    display: 'block',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    cursor: 'not-allowed',
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

export default AdminPanelPage;