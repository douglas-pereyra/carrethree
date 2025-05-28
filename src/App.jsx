// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Adicione useCallback
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

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

// Layout e Componentes de Rota
import Navbar from './components/layout/Navbar';
import CategoryBar from './components/layout/CategoryBar';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminProtectedRoute from './components/routes/AdminProtectedRoute';

function MainLayout() {
  const location = useLocation();
  const auth = useAuth();

  const pathsWithoutNavbar = ['/login'];
  const showNavbarAndCategoryBar = !pathsWithoutNavbar.includes(location.pathname);

  const [selectedCustomerCategory, setSelectedCustomerCategory] = useState('Todos');
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  // Função para medir e definir a altura da Navbar
  // Envolvida em useCallback para estabilizar sua referência se usada em outros useEffects ou como prop
  const measureNavbarHeight = useCallback(() => {
    if (showNavbarAndCategoryBar && navbarRef.current) {
      if (!auth.isLoadingAuth) {
        const currentNavbarHeight = navbarRef.current.offsetHeight;
        console.log('[MainLayout measureNavbarHeight] Altura medida da Navbar:', currentNavbarHeight);
        if (currentNavbarHeight > 0 && currentNavbarHeight !== navbarHeight) {
          setNavbarHeight(currentNavbarHeight);
        } else if (currentNavbarHeight === 0) {
          console.warn('[MainLayout measureNavbarHeight] Altura da Navbar medida como 0. Verifique CSS/conteúdo.');
        }
      }
    } else if (!showNavbarAndCategoryBar) {
      if (navbarHeight !== 0) {
        setNavbarHeight(0);
      }
    }
  }, [showNavbarAndCategoryBar, auth.isLoadingAuth, navbarRef, navbarHeight]); // Adicionado navbarHeight para evitar loop se a altura for 0 e tentar setar para 0

  // Efeito para medir a altura da Navbar na carga inicial e quando dependências mudam
  useEffect(() => {
    console.log(`[MainLayout useEffect - Carga/Auth] Disparado. showNav: ${showNavbarAndCategoryBar}, isLoadingAuth: ${auth.isLoadingAuth}, path: ${location.pathname}`);
    measureNavbarHeight();
  }, [measureNavbarHeight, showNavbarAndCategoryBar, auth.isLoadingAuth, location.pathname]); // measureNavbarHeight é agora uma dependência

  // Efeito para lidar com o redimensionamento da janela
  useEffect(() => {
    // Só adiciona o listener se a navbar estiver sendo mostrada
    if (showNavbarAndCategoryBar) {
      const handleResize = () => {
        console.log('[MainLayout handleResize] Janela redimensionada, recalculando altura da Navbar.');
        measureNavbarHeight();
      };

      window.addEventListener('resize', handleResize);
      // Chama uma vez na montagem deste efeito também, para garantir que a altura está correta
      // após a navbar de loading ter potencialmente mudado para a navbar final.
      handleResize();

      // Função de limpeza para remover o event listener quando o componente desmontar
      // ou quando showNavbarAndCategoryBar mudar para false
      return () => {
        console.log('[MainLayout handleResize] Removendo event listener de resize.');
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showNavbarAndCategoryBar, measureNavbarHeight]); // Depende de showNavbarAndCategoryBar e da função de medição

  const handleCustomerCategorySelect = (category) => {
    setSelectedCustomerCategory(category);
  };

  console.log('[MainLayout Render] Estado navbarHeight ATUAL:', navbarHeight);
  const calculatedPaddingTop = showNavbarAndCategoryBar ? `${navbarHeight}px` : '0';
  console.log('[MainLayout Render] paddingTop a ser aplicado:', calculatedPaddingTop);

  return (
    <>
      {showNavbarAndCategoryBar && <Navbar ref={navbarRef} />}

      <div style={{ paddingTop: calculatedPaddingTop }}>
        {showNavbarAndCategoryBar && location.pathname === '/' && (
          <CategoryBar
            onSelectCategory={handleCustomerCategorySelect}
            activeCategory={selectedCustomerCategory}
          />
        )}
        <main>
          <Routes>
            <Route path="/" element={<HomePage selectedCategory={selectedCustomerCategory} />} />
            <Route path="/produto/:productId" element={<ProductDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/minha-conta" element={<MyAccountPage />} />
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
