// src/components/layout/CategoryBar.jsx
import React from 'react';

// Estilos (movidos para dentro para manter o componente autocontido)
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


// O componente agora recebe 'products' como uma prop
function CategoryBar({ products = [], onSelectCategory, activeCategory }) {

  // --- LÓGICA NOVA ---
  // 1. Mapeia a lista de produtos para pegar apenas a string da categoria de cada um.
  // 2. Usa 'new Set()' para pegar apenas os valores únicos, eliminando as repetições.
  // 3. Usa o operador 'spread' (...) para transformar o Set de volta em um array.
  // 4. Adiciona a categoria "Todos" no início da lista.
  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  // --- FIM DA LÓGICA NOVA ---


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
          style={
            activeCategory === category
              ? { ...categoryItemBaseStyle, ...activeCategoryStyle }
              : categoryItemBaseStyle
          }
          onClick={() => handleClickCategory(category)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClickCategory(category);}}
        >
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
          <span>{category}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryBar;