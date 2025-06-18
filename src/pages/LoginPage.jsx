// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoginPage useEffect: Verificando auth.isAuthenticated =', auth.isAuthenticated);
    if (auth.isAuthenticated) {
      console.log('LoginPage useEffect: Autenticado! Redirecionando...');
      const destination = auth.currentUser?.isAdmin ? '/admin/dashboard' : '/';
      navigate(destination, { replace: true });
    }
  }, [auth.isAuthenticated, auth.currentUser, navigate]);
  
  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Por favor, preencha e-mail e senha.');
      return;
    }
    const result = await auth.login(loginEmail, loginPassword);
    if (!result.success) {
      setError(result.message || 'Falha no login.');
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const result = await auth.signup(signupName, signupEmail, signupPassword);
    if (!result.success) {
      setError(result.message || 'Falha ao realizar o cadastro.');
    }
  };

  if (auth.isLoadingAuth) {
    return <div style={{textAlign: 'center', padding: '20px'}}>A verificar autenticação...</div>;
  }

  return (
    <div className="login-page-container">
      <div className="main-login-container">
        <input type="checkbox" id="check" aria-hidden="true" checked={!isLoginView} onChange={handleToggleView} />
        <div className="signup">
          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="check" aria-hidden="true">Sign up</label>
            <input type="text" name="name" placeholder="Nome Completo" required value={signupName} onChange={(e) => setSignupName(e.target.value)} />
            <input type="email" name="email" placeholder="Email" required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
            <input type="password" name="password" placeholder="Senha" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
            <button type="submit">Sign up</button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="check" aria-hidden="true">Login</label>
            <input type="email" name="email" placeholder="Email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            <input type="password" name="password" placeholder="Senha" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
        </div>
        {error && <p className="auth-error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;