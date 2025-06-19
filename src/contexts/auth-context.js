/**
 * @fileoverview Creates the authentication context for the application.
 * This file defines the "shape" of the authentication data and provides
 * a default value for when components are used outside of the AuthProvider.
 */

import { createContext } from 'react';

// This object defines the default structure and values for the AuthContext.
export const defaultAuthContextValue = {
  // A flag to check if the context is still the default one, used for safety in the custom hook.
  _isDefault: true,
  // Default authentication state.
  isAuthenticated: false,
  currentUser: null,
  isLoadingAuth: true,
  
  // These are placeholder functions. If a component tries to call `login` without
  // being wrapped in an AuthProvider, this function will run and log a warning,
  // helping developers catch bugs early.
  login: async () => {
    console.warn('Login function called outside of an AuthProvider');
    return { success: false, message: 'AuthProvider not found' };
  },
  logout: () => {
    console.warn('Logout function called outside of an AuthProvider');
  },
  signup: async () => {
    console.warn('Signup function called outside of an AuthProvider');
    return { success: false, message: 'AuthProvider not found' };
  },
};

// Creates the actual context object that components will subscribe to.
export const AuthContext = createContext(defaultAuthContextValue);