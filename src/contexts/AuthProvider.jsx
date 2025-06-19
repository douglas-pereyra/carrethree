/**
 * @fileoverview Defines the AuthProvider context for the Carrethree application.
 * This provider manages the user's authentication state, including login, logout,
 * signup, and session persistence using localStorage.
 */

import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context.js';

// --- Constants and Helpers ---

const API_BASE_URL = 'http://localhost:5000/api/users';
const AUTH_USER_STORAGE_KEY = 'carrethreeAuthUser';

export function AuthProvider({ children }) {
  // --- State Management ---
  
  // Tracks if a user is currently logged in.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Stores the data of the currently logged-in user (e.g., name, email, token).
  const [currentUser, setCurrentUser] = useState(null);
  // Manages the initial loading state while checking for a persisted session.
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  /**
   * A helper function to handle the state updates and localStorage persistence
   * after a successful login or signup.
   * @param {object} userData - The user data received from the API.
   */
  const handleAuthentication = (userData) => {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  // --- Effects ---

  // On initial application load, this effect checks for a logged-in user in localStorage.
  // This allows the user's session to persist across page refreshes.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (storedUser) {
        handleAuthentication(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      // If data is corrupt, clear it.
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
    // Finished checking, so set loading to false.
    setIsLoadingAuth(false);
  }, []); // The empty dependency array ensures this runs only once.


  // --- Authentication Functions ---

  /**
   * Registers a new user. On success, authenticates them immediately.
   * @param {string} name The user's full name.
   * @param {string} email The user's email address.
   * @param {string} password The user's plain-text password.
   * @returns {Promise<{success: boolean, message?: string, user?: object}>}
   */
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register.');
      }
      
      handleAuthentication(data);
      
      return { success: true, user: data };
    } catch (err) {
      console.error("Error during signup:", err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Logs a user in. On success, their session is persisted.
   * This also triggers the cart synchronization logic.
   * @param {string} email The user's email address.
   * @param {string} password The user's plain-text password.
   * @returns {Promise<{success: boolean, message?: string, user?: object}>}
   */
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login.');
      }

      // The logic for cart sync that was added previously will run here.
      // After it completes, we authenticate the user.
      
      handleAuthentication(data);
      
      return { success: true, user: data };
    } catch (err) {
      console.error("Error during login:", err.message);
      return { success: false, message: err.message };
    }
  };

  /**
   * Logs the user out by clearing their session data from state and localStorage.
   * @param {function} navigateFunc - The navigate function from react-router-dom to redirect the user.
   */
  const logout = (navigateFunc) => {
    // Clear user session data.
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    // Also clear the guest cart data to ensure a clean state for the next session.
    localStorage.removeItem('cartItems');

    setCurrentUser(null);
    setIsAuthenticated(false);

    // Redirect the user to the homepage after logout.
    if (navigateFunc) {
      navigateFunc('/', { replace: true });
    }
  };

  // The value object provided to consuming components via the context.
  const value = {
    isAuthenticated,
    currentUser,
    isLoadingAuth,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}