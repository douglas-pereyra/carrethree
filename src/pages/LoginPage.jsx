/**
 * @fileoverview Defines the LoginPage component, which handles both user login
 * and registration (signup).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  // --- Hooks ---
  const auth = useAuth();
  const navigate = useNavigate();

  // --- State Management ---

  // A single state to toggle between the Login and Signup views.
  const [isLoginView, setIsLoginView] = useState(true);

  // State for the login form fields, grouped into one object.
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // State for the signup form fields, also grouped.
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  // State to hold and display any authentication error messages.
  const [error, setError] = useState('');

  // --- Effects ---

  // This effect runs when the component mounts or when the auth state changes.
  // If the user is already authenticated, it redirects them away from the login page.
  useEffect(() => {
    if (auth.isAuthenticated) {
      // Admins are redirected to their dashboard, customers to the homepage.
      const destination = auth.currentUser?.isAdmin ? '/admin/dashboard' : '/';
      navigate(destination, { replace: true });
    }
  }, [auth.isAuthenticated, auth.currentUser, navigate]);

  // --- Event Handlers ---

  /**
   * Toggles the view between the login and signup forms and clears any previous errors.
   */
  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
  };

  /**
   * Generic input handler to update state for both forms.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   * @param {'login' | 'signup'} formType - The form being updated.
   */
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    const setter = formType === 'login' ? setLoginData : setSignupData;
    setter(prevData => ({ ...prevData, [name]: value }));
  };

  /**
   * Handles the submission of the login form.
   */
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('Por favor, preencha e-mail e senha.');
      return;
    }
    // Call the login function from the AuthContext.
    const result = await auth.login(loginData.email, loginData.password);
    if (!result.success) {
      setError(result.message || 'Falha no login.');
    }
  };

  /**
   * Handles the submission of the signup form.
   */
  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!signupData.name || !signupData.email || !signupData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    // Call the signup function from the AuthContext.
    const result = await auth.signup(signupData.name, signupData.email, signupData.password);
    if (!result.success) {
      setError(result.message || 'Falha ao realizar o cadastro.');
    }
  };

  // --- Render Logic ---

  // Display a loading message while checking for a persisted session.
  if (auth.isLoadingAuth) {
    return <div style={{textAlign: 'center', padding: '20px'}}>Verificando autenticação...</div>;
  }

  return (
    <div className="login-page-container">
      <Link to="/" className="back-to-products-link">
        &larr; Voltar à tela de produtos
      </Link>
      
      {/* This container uses a CSS trick with a hidden checkbox to create the slide animation */}
      {/* between the login and signup forms without using JavaScript for the animation itself. */}
      <div className="main-login-container">
        <input type="checkbox" id="check" aria-hidden="true" checked={!isLoginView} onChange={handleToggleView} />
        
        <div className="signup">
          <form onSubmit={handleSignupSubmit}>
            <label htmlFor="check" aria-hidden="true">Cadastre-se</label>
            <input type="text" name="name" placeholder="Nome Completo" required value={signupData.name} onChange={(e) => handleInputChange(e, 'signup')} />
            <input type="email" name="email" placeholder="Email" required value={signupData.email} onChange={(e) => handleInputChange(e, 'signup')} />
            <input type="password" name="password" placeholder="Senha" required value={signupData.password} onChange={(e) => handleInputChange(e, 'signup')} />
            <button type="submit">Cadastrar</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="check" aria-hidden="true">Login</label>
            <input type="email" name="email" placeholder="Email" required value={loginData.email} onChange={(e) => handleInputChange(e, 'login')} />
            <input type="password" name="password" placeholder="Senha" required value={loginData.password} onChange={(e) => handleInputChange(e, 'login')} />
            <button type="submit">Login</button>
          </form>
        </div>

        {/* Display an error message if any authentication error occurs. */}
        {error && <p className="auth-error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;