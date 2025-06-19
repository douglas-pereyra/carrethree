/**
 * @fileoverview This is the root component file for the React application.
 * It sets up the main router and layout structure.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';

// Import all page components
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import MyAccountPage from './pages/MyAccountPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import AdminAddProductPage from './pages/admin/AdminAddProductPage';
import AdminEditProductPage from './pages/admin/AdminEditProductPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';

// Import layout and route guard components
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';

/**
 * Manages the main layout of the application.
 * It conditionally renders the Navbar and CategoryBar based on the current route,
 * and handles the dynamic padding to prevent content from being hidden by the fixed navbar.
 */
function MainLayout() {
  // --- Hooks ---
  const location = useLocation();
  const auth = useAuth();
  const { allProducts, searchProducts, filterByCategory } = useProducts();
  const navbarRef = useRef(null);

  // --- State ---
  const [selectedCustomerCategory, setSelectedCustomerCategory] = useState('Todos');
  const [navbarHeight, setNavbarHeight] = useState(0);

  // --- Conditional Rendering Logic ---
  const pathsWithoutNavbar = ['/login'];
  const showNavbarAndCategoryBar = !pathsWithoutNavbar.includes(location.pathname);
  
  // --- Event Handlers ---
  const handleSearch = (keyword) => {
    searchProducts(keyword);
  };
  const handleCustomerCategorySelect = (category) => {
    setSelectedCustomerCategory(category);
    filterByCategory(category);
  };

  // --- Navbar Height Logic for Dynamic Padding ---
  // This logic ensures that the main content of the page is not obscured
  // by the fixed-position Navbar.
  
  // A memoized function to measure the navbar's height.
  const measureNavbarHeight = useCallback(() => {
    if (showNavbarAndCategoryBar && navbarRef.current && !auth.isLoadingAuth) {
      const currentNavbarHeight = navbarRef.current.offsetHeight;
      if (currentNavbarHeight > 0 && currentNavbarHeight !== navbarHeight) {
        setNavbarHeight(currentNavbarHeight);
      }
    } else if (!showNavbarAndCategoryBar && navbarHeight !== 0) {
      setNavbarHeight(0);
    }
  }, [showNavbarAndCategoryBar, auth.isLoadingAuth, navbarRef, navbarHeight]);

  // Effects to trigger the height measurement when the layout might change.
  useEffect(() => {
    measureNavbarHeight();
  }, [measureNavbarHeight, showNavbarAndCategoryBar, auth.isLoadingAuth, location.pathname]);
  
  useEffect(() => {
    if (showNavbarAndCategoryBar) {
      const handleResize = () => measureNavbarHeight();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [showNavbarAndCategoryBar, measureNavbarHeight]);

  // Calculate the padding-top value based on the measured navbar height.
  const calculatedPaddingTop = showNavbarAndCategoryBar ? `${navbarHeight}px` : '0';

  // --- Render ---
  return (
    <>
      {/* Conditionally render the Navbar and pass the ref to it. */}
      {showNavbarAndCategoryBar && <Navbar ref={navbarRef} onSearch={handleSearch} />}
      
      <div style={{ paddingTop: calculatedPaddingTop }}>
        {/* Conditionally render the CategoryBar, only on the homepage. */}
        {showNavbarAndCategoryBar && location.pathname === '/' && (
          <CategoryBar
            products={allProducts}
            onSelectCategory={handleCustomerCategorySelect}
            activeCategory={selectedCustomerCategory}
          />
        )}
        <main>
          {/* Defines all the application's routes. */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:productId" element={<ProductDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            
            {/* Protected Routes for authenticated regular users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/minha-conta" element={<MyAccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            </Route>

            {/* Protected Routes for admin users only */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/panel" element={<AdminPanelPage />} />
              <Route path="/admin/produtos/novo" element={<AdminAddProductPage />} />
              <Route path="/admin/produtos/editar/:productId" element={<AdminEditProductPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

/**
 * The root App component.
 * Its main responsibility is to set up the Router that enables navigation.
 */
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;