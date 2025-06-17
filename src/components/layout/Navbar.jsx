// src/components/layout/Navbar.jsx
import React from 'react'; // Importe React para usar forwardRef

import { Link } from 'react-router-dom';
import logoCarrethree from '../../assets/images/logopreta.png'; // Ajuste o caminho se o seu logo estiver em outro local
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';

// Envolva o componente com React.forwardRef
const Navbar = React.forwardRef(({ onSearch, searchedName = ''}, ref) => { // props são as props normais, ref é a ref encaminhada
  const { getCartTotalItems } = useCart();
  const cartItemCount = getCartTotalItems();
  const auth = useAuth();

  // Define o link do logo dinamicamente
  const logoLinkTo = auth.isAuthenticated && auth.currentUser?.isAdmin ? "/admin/dashboard" : "/";

  // Determina o link e o texto para a seção de conta/login do usuário
  let userAccountLinkPath = "/login";
  let userAccountLinkTextContent = (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '4px' }}>
        <circle cx="12" cy="8" r="4" strokeWidth="2"/>
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
      </svg>
      Entre ou cadastre-se
    </>
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.search?.value;
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  if (auth.isAuthenticated) {
    if (auth.currentUser?.isAdmin) {
      userAccountLinkPath = "/admin/panel"; // Admin vai para o painel de conta/configurações
      userAccountLinkTextContent = "Painel Admin";
    } else {
      userAccountLinkPath = "/minha-conta"; // Usuário comum vai para sua página de conta
      userAccountLinkTextContent = "Minha Conta";
    }
  }

  // Navbar simplificada durante o carregamento do estado de autenticação
  if (auth.isLoadingAuth) {
    return (
      // Passe a ref para o elemento <nav> principal
      <nav className="navbar" ref={ref} style={{ minHeight: '60px' /* Garante uma altura mínima mesmo no loading */ }}>
        <div className="navbar-logo">
          <Link to="/"><img src={logoCarrethree} alt="Logo Supermercado Carrethree" /></Link>
        </div>
        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text"
              name="search"
              placeholder="Buscar produtos..."
              defaultValue={searchedName} // Use defaultValue instead of value
            />
            <button type="submit" className="search-btn">
              {/* Search icon */}
            </button>
            {searchedName && (
              <button 
                type="button"
                className="clear-search-btn"
                onClick={() => onSearch('')}
              >
                ×
              </button>
            )}
          </form>
        </div>
        <div className="navbar-icons">
          <div className="login-placeholder" style={{ color: '#777', fontSize: '0.9em', marginRight: '15px' }}>Carregando...</div>
          <Link to="/carrinho" className="cart nav-link" style={{ pointerEvents: 'none', opacity: 0.7 }}>
            <div className="cart-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '4px' }}>
                <path d="M6 6h15l-1.5 9h-13z" strokeWidth="2" />
                <path d="M6 6L5 2H2" strokeWidth="2" />
                <circle cx="9" cy="20" r="1" strokeWidth="2"/>
                <circle cx="18" cy="20" r="1" strokeWidth="2"/>
              </svg>
              Carrinho
              {cartItemCount > 0 && ( // Mostra a contagem mesmo no loading, se disponível
                <span className="cart-count">{cartItemCount}</span>
              )}
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    // Passe a ref para o elemento <nav> principal
    <nav className="navbar" ref={ref}>
      <div className="navbar-logo">
        <Link to={logoLinkTo}>
          <img src={logoCarrethree} alt="Logo Supermercado Carrethree" />
        </Link>
      </div>
      <div className="navbar-search">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            name="search"
            placeholder="Buscar produtos..." 
            defaultValue={searchedName}
          />
          <button type="submit" className="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <line x1="23" y1="23" x2="16.65" y2="16.65" strokeWidth="2"/>
            </svg>
          </button>
        </form>
      </div>
      <div className="navbar-icons">
        <Link to={userAccountLinkPath} className="login nav-link" style={{ marginRight: '15px' }}>
          {userAccountLinkTextContent}
        </Link>
        {(!auth.isAuthenticated || (auth.isAuthenticated && !auth.currentUser?.isAdmin)) && (
          <Link to="/carrinho" className="cart nav-link">
            <div className="cart-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '4px' }}>
                <path d="M6 6h15l-1.5 9h-13z" strokeWidth="2" />
                <path d="M6 6L5 2H2" strokeWidth="2" />
                <circle cx="9" cy="20" r="1" strokeWidth="2"/>
                <circle cx="18" cy="20" r="1" strokeWidth="2"/>
              </svg>
              Carrinho
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
});

// Adicionar displayName para melhor depuração no React DevTools
Navbar.displayName = 'Navbar';

export default Navbar;
