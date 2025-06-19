/**
 * @fileoverview Defines the CategoryBar component.
 * This is a reusable UI component that displays a filter bar of product categories.
 */

import React from 'react';

// --- Style Objects ---
// Moved outside the component function to prevent re-creation on every render.
const activeCategoryStyle = {
  color: '#149c68',
  fontWeight: 'bold',
  borderBottom: '2px solid #149c68',
};

const categoryItemBaseStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  cursor: 'pointer',
  textDecoration: 'none',
  color: '#444',
  whiteSpace: 'nowrap',
};

/**
 * Renders a dynamic category filter bar.
 * It automatically generates a list of unique categories from a given list of products
 * and allows the user to select one, triggering a callback function.
 *
 * @param {object[]} products - An array of product objects to derive the categories from.
 * @param {function} onSelectCategory - The callback function to call when a category is clicked. It receives the category name as an argument.
 * @param {string} activeCategory - The name of the currently active category, used for styling.
 */
function CategoryBar({ products = [], onSelectCategory, activeCategory }) {
  // --- Dynamic Category Generation ---
  // 1. `products.map(p => p.category)`: Creates an array of all category names (with duplicates).
  // 2. `new Set(...)`: Creates a Set from the array, which automatically removes all duplicate values.
  // 3. `[...new Set(...)]`: Converts the Set back into an array of unique category names.
  // 4. `['Todos', ... ]`: Adds the "Todos" option at the beginning of the list.
  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  /**
   * Handles the click event on a category item.
   * @param {string} categoryName - The name of the category that was clicked.
   */
  const handleClickCategory = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  return (
    <div className="categoria-barra">
      {categories.map((category) => (
        <div
          key={category}
          // Apply active styles conditionally if this category is the selected one.
          style={
            activeCategory === category
              ? { ...categoryItemBaseStyle, ...activeCategoryStyle }
              : categoryItemBaseStyle
          }
          onClick={() => handleClickCategory(category)}
          // Accessibility: Make the div behave like a button for screen readers and keyboard navigation.
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClickCategory(category);
          }}
        >
          {/* Conditionally render the "hamburger" menu icon only for the "Todos" category. */}
          {category === 'Todos' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
            </svg>
          )}
          {/* The category name is displayed here (e.g., "Hortifruti", "Padaria"). It remains in Portuguese for the user. */}
          <span>{category}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryBar;