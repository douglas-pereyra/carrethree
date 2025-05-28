// src/pages/MyAccountPage.jsx
import React from 'react'; // Removido useState e useEffect se não forem mais usados diretamente aqui para logout
import { useNavigate, Link } from 'react-router-dom'; // Adicionado Link se precisar de links internos
import { useAuth } from '../hooks/useAuth';

function MyAccountPage() {
  const { currentUser, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // A função logout do AuthContext já lida com a navegação para '/'
    // conforme nossa última correção para o AuthProvider.
    logout(() => navigate('/', { replace: true }));
  };

  if (isLoadingAuth) {
    return <div style={styles.pageMessage}>Carregando dados da sua conta...</div>;
  }

  // ProtectedRoute já deve garantir que o usuário está autenticado.
  // Esta é uma verificação adicional para o caso de currentUser ser null por algum motivo.
  if (!currentUser) {
    // Idealmente, o ProtectedRoute já teria redirecionado para /login.
    // Esta mensagem é um fallback.
    return <div style={styles.pageMessage}>Não foi possível carregar os dados da sua conta. Por favor, tente fazer login novamente.</div>;
  }

  return (
    <div style={styles.accountContainer}>
      <header style={styles.header}>
        <h1>Minha Conta</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </header>

      <section style={styles.welcomeSection}>
        <p>Olá, <strong>{currentUser.name}!</strong></p>
        <p>Bem-vindo(a) ao seu espaço pessoal. Aqui você pode gerenciar seus dados e pedidos.</p>
      </section>

      <section style={styles.infoSection}>
        <h2 style={styles.sectionTitle}>Informações da Conta</h2>
        <div style={styles.infoGrid}>
            <div style={styles.infoItem}><strong>Nome:</strong> {currentUser.name}</div>
            <div style={styles.infoItem}><strong>Email:</strong> {currentUser.email}</div>
        </div>
        {/* Link para uma futura página de edição de perfil */}
        <Link to="/minha-conta/editar-perfil" style={styles.actionLink}>Editar Perfil (Em breve)</Link>
      </section>

      <section style={styles.ordersSection}>
        <h2 style={styles.sectionTitle}>Meus Pedidos</h2>
        {/* Aqui você listaria os pedidos. Por enquanto, um placeholder. */}
        <p>Você ainda não tem pedidos registrados.</p>
        <p>(Funcionalidade de histórico de pedidos em breve)</p>
        <Link to="/" style={styles.actionLink}>Comece a Comprar</Link>
      </section>

      {/* Você pode adicionar mais seções aqui, como:
      <section style={styles.settingsSection}>
        <h2 style={styles.sectionTitle}>Configurações</h2>
        <Link to="/minha-conta/alterar-senha" style={styles.navLink}>Alterar Senha (Em breve)</Link>
      </section>
      */}
    </div>
  );
}

// Estilos para a Página Minha Conta (inspirados no AdminPanelPage)
// Mova para seu arquivo CSS global ou CSS Modules se preferir
const styles = {
  accountContainer: {
    padding: '30px 40px',
    maxWidth: '800px',
    margin: '40px auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Exemplo de fonte
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
    backgroundColor: '#e74c3c', // Vermelho (consistente com o AdminPanel)
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95em',
    transition: 'background-color 0.2s ease',
  },
  // logoutButton:hover { background-color: #c0392b; } // Adicionar ao CSS para hover
  welcomeSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa', // Um cinza bem claro
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
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
  },
  settingsSection: { // Estilo para uma seção de configurações opcional
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e0e0e0',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsivo
    gap: '15px',
    marginBottom: '20px',
  },
  infoItem: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '1em',
  },
  actionLink: { // Para links como "Editar Perfil" ou "Comece a Comprar"
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
  // actionLink:hover { background-color: #007bff; color: white; } // Adicionar ao CSS
  pageMessage: { // Para mensagens de carregando/erro
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
  }
};

export default MyAccountPage;