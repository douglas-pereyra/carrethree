// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';

// Páginas
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

// Layout e Componentes de Rota
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';

function MainLayout() {
  const location = useLocation();
  const auth = useAuth();
  // Pega tudo que precisamos do nosso provider
  const { allProducts, searchProducts, filterByCategory } = useProducts();

  const pathsWithoutNavbar = ['/login'];
  const showNavbarAndCategoryBar = !pathsWithoutNavbar.includes(location.pathname);

  const [selectedCustomerCategory, setSelectedCustomerCategory] = useState('Todos');
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  const handleSearch = (keyword) => {
    searchProducts(keyword);
  };

  const handleCustomerCategorySelect = (category) => {
    setSelectedCustomerCategory(category);
    filterByCategory(category); // Chama a função do provider para filtrar a lista
  };

  // Lógica para altura da Navbar (sem alterações)
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

  useEffect(() => {
    measureNavbarHeight();
  }, [measureNavbarHeight, showNavbarAndCategoryBar, auth.isLoadingAuth, location.pathname]);

  useEffect(() => {
    if (showNavbarAndCategoryBar) {
      const handleResize = () => measureNavbarHeight();
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [showNavbarAndCategoryBar, measureNavbarHeight]);

  const calculatedPaddingTop = showNavbarAndCategoryBar ? `${navbarHeight}px` : '0';

  return (
    <>
      {showNavbarAndCategoryBar && <Navbar ref={navbarRef} onSearch={handleSearch} />}
      <div style={{ paddingTop: calculatedPaddingTop }}>
        {showNavbarAndCategoryBar && location.pathname === '/' && (
          <CategoryBar
            products={allProducts} // A barra de categorias sempre usa a lista completa
            onSelectCategory={handleCustomerCategorySelect}
            activeCategory={selectedCustomerCategory}
          />
        )}
        <main>
          <Routes>
            {/* HomePage não precisa mais de props de filtro/busca */}
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:productId" element={<ProductDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/minha-conta" element={<MyAccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            </Route>
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

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
