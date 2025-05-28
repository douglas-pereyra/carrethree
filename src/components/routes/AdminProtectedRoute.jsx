// src/components/routes/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AdminProtectedRoute() {
  const { isAuthenticated, currentUser, isLoadingAuth, navigatingAfterLogout } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando autenticação...</div>;
  }

  if (!isAuthenticated) {
    if (navigatingAfterLogout) {
      console.log('[AdminProtectedRoute] Logout em progresso (navigatingAfterLogout=true), não redirecionando para /login daqui.');
      return null; // Permite que a navegação do logout (para '/') aconteça
    }
    console.log('[AdminProtectedRoute] Não autenticado (e não em logout intencional), redirecionando para /login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser?.isAdmin) {
    console.log('[AdminProtectedRoute] Autenticado mas não é admin, redirecionando para /.');
    return <Navigate to="/" replace />; // Usuário comum tentando acessar rota de admin
  }

  return <Outlet />;
}

export default AdminProtectedRoute;