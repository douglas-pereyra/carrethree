// src/components/routes/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AdminProtectedRoute() {
  const { isAuthenticated, currentUser, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>A verificar autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificação extra para saber se é um administrador.
  if (!currentUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;