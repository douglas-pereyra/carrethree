/**
 * @fileoverview Defines the AdminProtectedRoute component.
 * This is a route guard that restricts access to admin-only pages.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * A specialized route guard for admin-only routes.
 * It performs a two-level check:
 * 1. Is the user authenticated? If not, redirect to /login.
 * 2. Is the authenticated user an administrator? If not, redirect to the homepage (/).
 * Only if both checks pass, it renders the requested admin page.
 */
function AdminProtectedRoute() {
  // Get the full user object to check the 'isAdmin' flag.
  const { isAuthenticated, currentUser, isLoadingAuth } = useAuth();
  const location = useLocation();

  // Show a loading message while authentication status is being verified.
  if (isLoadingAuth) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Verifying authentication...</div>;
  }

  // First check: Is the user logged in at all?
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Second check: Is the logged-in user an admin?
  // The optional chaining (?.) safely accesses 'isAdmin' in case 'currentUser' is null.
  if (!currentUser?.isAdmin) {
    // If the user is logged in but not an admin, redirect them to the homepage.
    return <Navigate to="/" replace />;
  }

  // If both checks pass, render the protected admin component (e.g., AdminDashboardPage).
  return <Outlet />;
}

export default AdminProtectedRoute;