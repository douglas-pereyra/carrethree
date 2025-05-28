// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, isLoadingAuth, navigatingAfterLogout } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando autenticação...</div>;
  }

  if (!isAuthenticated) {
    if (navigatingAfterLogout) {
      // Se estamos deslogando intencionalmente, a navegação para a página de destino do logout (ex: '/')
      // está sendo tratada pela função logout() no AuthProvider.
      // Retornar null aqui permite que essa navegação principal ocorra sem que esta rota
      // force um redirecionamento para /login. O componente protegido será desmontado de qualquer forma.
      console.log('[ProtectedRoute] Logout em progresso (navigatingAfterLogout=true), não redirecionando para /login daqui.');
      return null;
    }
    console.log('[ProtectedRoute] Não autenticado (e não em logout intencional), redirecionando para /login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;