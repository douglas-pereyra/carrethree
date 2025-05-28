// src/components/layout/CategoryBar.jsx
import React from 'react';
import { categories } from '../../data/mockProducts'; // Suas categorias

// Estilo para o item ativo (pode ser movido para CSS se preferir)
const activeCategoryStyle = {
  color: '#149c68', // Sua cor primária da loja
  fontWeight: 'bold',
  borderBottom: '2px solid #149c68',
};

const categoryItemBaseStyle = {
  display: 'flex', // Para alinhar ícone e texto dentro de cada item
  alignItems: 'center', // Alinha verticalmente o conteúdo do item
  gap: '8px', // Espaço entre o ícone e o texto (para o item "Todos")
  padding: '8px 12px', // Padding interno para cada item de categoria
  cursor: 'pointer',
  textDecoration: 'none',
  color: '#444', // Cor padrão do texto da categoria
  whiteSpace: 'nowrap', // Evita que o nome da categoria quebre linha facilmente
};

function CategoryBar({ onSelectCategory, activeCategory }) {
  const handleClickCategory = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  return (
    // A classe .categoria-barra será estilizada no CSS global
    <div className="categoria-barra">
      {categories.map((category) => (
        <div
          key={category}
          // Aplicamos o estilo base a todos os itens
          // E o estilo ativo condicionalmente
          style={
            activeCategory === category
              ? { ...categoryItemBaseStyle, ...activeCategoryStyle }
              : categoryItemBaseStyle
          }
          onClick={() => handleClickCategory(category)}
          role="button" // Melhor para acessibilidade
          tabIndex={0}  // Para ser focável
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClickCategory(category);}} // Para acessibilidade
        >
          {category === 'Todos' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="menu-icon" // Use sua classe existente para o ícone
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              // Estilos para o ícone podem ser definidos na classe .menu-icon
              // ou inline se necessário (ex: width, height)
              // style={{ width: '20px', height: '20px' }}
            >
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
            </svg>
          )}
          {/* O texto da categoria não precisa mais ser um <a> se a div inteira é clicável */}
          <span>{category}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryBar;