// src/pages/admin/AdminAddProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

function AdminAddProductPage() {
  const { addProduct, allProducts, isLoadingProducts } = useProducts();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !price || !category || !image || countInStock === '') {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const priceNumber = parseFloat(price);
    const stockNumber = parseInt(countInStock, 10);

    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Por favor, insira um preço válido.');
      return;
    }

    if (isNaN(stockNumber) || stockNumber < 0) {
      setError('Por favor, insira um valor de estoque válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = { name, price: priceNumber, category, description, image, countInStock: stockNumber };
      const result = await addProduct(productData);

      if (result.success) {
        alert('Produto adicionado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Falha ao adicionar produto.');
      }
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      setError('Falha ao adicionar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Adicionar Novo Produto</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div style={{ marginBottom: '15px' }}>
          <label>Nome do Produto (máx. 60 caracteres):</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength="60" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Preço:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Categoria:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={isLoadingProducts}
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="" disabled>
              {isLoadingProducts ? "Carregando categorias..." : "Selecione uma categoria"}
            </option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Estoque:</label>
          <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>URL da Imagem:</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Descrição:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', height: '100px', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
      </form>
    </div>
  );
}

export default AdminAddProductPage;