/**
 * @fileoverview A custom React hook for accessing the authentication context.
 * This hook simplifies the process of consuming auth state and functions in components.
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context.js';

/**
 * A custom hook that provides easy access to the AuthContext.
 * It returns the context's value, which includes authentication state and methods.
 * It also includes a safety check to ensure it is used within an <AuthProvider>.
 *
 * @returns {object} The authentication context value, containing:
 * - isAuthenticated (boolean)
 * - currentUser (object | null)
 * - isLoadingAuth (boolean)
 * - login (function)
 * - logout (function)
 * - signup (function)
 */
export function useAuth() {
  // Access the context value provided by the nearest AuthProvider.
  const context = useContext(AuthContext);

  // This is a safety check. If the hook is used outside of a component
  // wrapped by AuthProvider, the context will be undefined or its default value.
  // In that case, we throw an error to alert the developer immediately.
  if (context === undefined || context._isDefault) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return the full context value to the component.
  return context;
}