/**
 * @fileoverview Defines the main Navbar component for the Carrethree application.
 * The Navbar is dynamic and changes its content based on the user's authentication status and role.
 * It uses React.forwardRef to allow the parent component to measure its height.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import logoCarrethree from '../../assets/images/logopreta.png';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';

const Navbar = React.forwardRef(({ onSearch }, ref) => {
  // --- Hooks ---
  const { getCartTotalItems } = useCart();
  const auth = useAuth();
  const cartItemCount = getCartTotalItems();
  
  // --- Dynamic Content Logic ---
  // Determine the correct links and text based on the user's auth state.
  
  const isAuth = auth.isAuthenticated;
  const isAdmin = auth.currentUser?.isAdmin;

  let logoLinkTo = "/";
  let userAccountLinkPath = "/login";
  let userAccountLinkText = (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '4px' }}>
        <circle cx="12" cy="8" r="4" strokeWidth="2"/>
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
      </svg>
      Entre ou Cadastre-se
    </>
  );

  if (isAuth) {
    if (isAdmin) {
      logoLinkTo = "/admin/dashboard";
      userAccountLinkPath = "/admin/panel";
      userAccountLinkText = "Painel Admin";
    } else {
      userAccountLinkPath = "/minha-conta";
      userAccountLinkText = "Minha Conta";
    }
  }

  // The cart link should be shown to guests and regular customers, but not to admins.
  const showCartLink = !isAdmin;

  /**
   * Handles the submission of the search form.
   * It calls the onSearch prop function passed down from the parent component.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.elements.search?.value;
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  // --- Render Logic ---

  // Render a simplified, skeleton version of the Navbar while auth state is loading.
  if (auth.isLoadingAuth) {
    return (
      <nav className="navbar" ref={ref} style={{ minHeight: '60px' }}>
        <div className="navbar-logo">
          <Link to="/"><img src={logoCarrethree} alt="Logo Supermercado Carrethree" /></Link>
        </div>
        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit}>
            <input type="text" name="search" placeholder="Buscar produtos..." />
            <button type="submit" className="search-btn"></button>
          </form>
        </div>
        <div className="navbar-icons">
          <div className="login-placeholder" style={{ color: '#777', fontSize: '0.9em', marginRight: '15px' }}>Carregando...</div>
          <Link to="/carrinho" className="cart nav-link" style={{ pointerEvents: 'none', opacity: 0.7 }}>
            <div className="cart-icon-wrapper">
              {/* Cart SVG Icon can be placed here */}
              Carrinho
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  // Render the full, dynamic Navbar for guests, customers, and admins.
  return (
    <nav className="navbar" ref={ref}>
      <div className="navbar-logo">
        <Link to={logoLinkTo}>
          <img src={logoCarrethree} alt="Logo Supermercado Carrethree" />
        </Link>
      </div>
      
      <div className="navbar-search">
        <form onSubmit={handleSearchSubmit}>
          <input type="text" name="search" placeholder="Buscar produtos..." />
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
          {userAccountLinkText}
        </Link>

        {/* Conditionally render the Cart link */}
        {showCartLink && (
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

// Set a displayName for easier debugging in React DevTools.
Navbar.displayName = 'Navbar';

export default Navbar;