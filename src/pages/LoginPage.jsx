// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Os estilos de login (.login-page-container, .main-login-container, etc.)
// devem estar no seu arquivo CSS global (ex: styles.css) e devidamente escopados.

function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Usado para feedback do cadastro

  const auth = useAuth();
  const navigate = useNavigate();

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!loginEmail || !loginPassword) {
      setError('Por favor, preencha e-mail e senha.');
      return;
    }
    try {
      const result = await auth.login(loginEmail, loginPassword);
      if (result.success) {
        if (result.user && result.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError('Ocorreu um erro ao tentar fazer login.');
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Por favor, preencha todos os campos do cadastro.');
      return;
    }
    if (signupPassword.length < 6) { // Exemplo de validação de senha
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    try {
      const result = await auth.signup(signupName, signupEmail, signupPassword);
      if (result.success) {
        console.log('Cadastro e login automático OK para:', result.user?.name);
        // Não precisa mais de mensagem de sucesso aqui, pois o usuário será redirecionado
        // setSuccessMessage(result.message || 'Cadastro e login realizados com sucesso!');
        
        // Limpa campos do formulário de cadastro (opcional, pois vai navegar)
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        
        // Redireciona para a página inicial do cliente, pois o signup já loga
        navigate('/');
      } else {
        setError(result.message || 'Falha ao realizar o cadastro.');
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError('Ocorreu um erro durante o cadastro. Tente novamente.');
    }
  };

  return (
    <div className="login-page-container">
      <Link to="/" className="back-to-products-link">
        &larr; Voltar à tela de produtos
      </Link>
      
      <div className="main-login-container">
        <input
          type="checkbox"
          id="check"
          aria-hidden="true"
          checked={!isLoginView}
          onChange={handleToggleView}
        />
        <div className="signup">
          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="check" aria-hidden="true">Sign up</label>
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              autoComplete="name"
              required
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Senha (mín. 6 caracteres)"
              autoComplete="new-password"
              required
              minLength={6}
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button type="submit">Sign up</button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="check" aria-hidden="true">Login</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              autoComplete="current-password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
        {error && <p className="auth-error-message">{error}</p>}
        {successMessage && <p className="auth-success-message">{successMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;