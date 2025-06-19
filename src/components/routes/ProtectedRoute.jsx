/**
 * @fileoverview This file defines the ProtectedRoute component.
 * It's a wrapper for routes that should only be accessible to authenticated users.
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * A route guard component for React Router.
 * It checks if a user is authenticated before allowing access to a child route.
 * - If the user is authenticated, it renders the requested page (via the <Outlet />).
 * - If not, it redirects the user to the /login page.
 * - It displays a loading message while verifying the authentication status.
 */
function ProtectedRoute() {
  // Get authentication state from the AuthContext.
  const { isAuthenticated, isLoadingAuth } = useAuth(); //
  // Get the current location to redirect the user back after a successful login.
  const location = useLocation(); //

  // While the app is still checking for a persisted session, show a loading indicator.
  // This prevents a brief "flash" of the login page for already authenticated users.
  if (isLoadingAuth) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Verifying authentication...</div>; //
  }

  // If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    // The `Maps` component handles the redirection.
    // We pass the original location in the `state` so the login page can
    // redirect the user back to the page they were trying to access.
    return <Navigate to="/login" state={{ from: location }} replace />; //
  }

  // If the user is authenticated, render the child route component.
  // <Outlet /> is a placeholder from react-router-dom for the actual page component.
  return <Outlet />; //
}

export default ProtectedRoute;