// src/pages/admin/AdminAddProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
// Você pode querer importar a lista de categorias para um dropdown no futuro
// import { categories as availableCategories } from '../../data/mockProducts';

function AdminAddProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(''); // Começa como input de texto, pode virar select
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // Espera-se uma URL/caminho para a imagem
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !price || !category || !image) {
      setError('Por favor, preencha todos os campos obrigatórios (Nome, Preço, Categoria, URL da Imagem).');
      setIsLoading(false);
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Por favor, insira um preço válido.');
      setIsLoading(false);
      return;
    }

    try {
      await addProduct({
        name,
        price: priceNumber,
        category,
        description,
        image,
      });
      alert('Produto adicionado com sucesso!');
      navigate('/admin/dashboard'); // Volta para a lista de produtos
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      setError('Falha ao adicionar produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos inline simples para o formulário (você pode mover para seu CSS)
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  const inputGroupStyle = {
    marginBottom: '15px',
  };
  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block',
  };
  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };
  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    opacity: isLoading ? 0.7 : 1,
  };
  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Adicionar Novo Produto</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={errorStyle}>{error}</p>}
        <div style={inputGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Nome do Produto:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="price" style={labelStyle}>Preço (R$):</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
            step="0.01"
            min="0.01"
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="category" style={labelStyle}>Categoria:</label>
          {/* Poderia ser um <select> com as categorias de mockProducts.js */}
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="image" style={labelStyle}>URL da Imagem:</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={inputStyle}
            placeholder="Ex: /images/meu-produto.jpg ou http://..."
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Descrição:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
          />
        </div>
        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
        <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            style={{ ...buttonStyle, backgroundColor: '#6c757d', marginTop: '10px' }}
            disabled={isLoading}
        >
            Cancelar
        </button>
      </form>
    </div>
  );
}

export default AdminAddProductPage;