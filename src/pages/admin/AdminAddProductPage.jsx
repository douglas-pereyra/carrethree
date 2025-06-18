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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Guarda o arquivo da imagem
      setPreview(URL.createObjectURL(file)); // Cria uma URL temporária para o preview
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !price || !category || !image || countInStock === '') {
      setError('Por favor, preencha todos os campos obrigatórios (incluindo a imagem).');
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

    // Cria um objeto FormData para enviar os dados do produto, incluindo a imagem
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', priceNumber);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('countInStock', stockNumber);
    formData.append('image', image); // Adiciona o arquivo da imagem

    try {
      const result = await addProduct(formData);

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
          <label>Imagem do Produto:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
          />
        </div>

        {preview && (
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <p>Preview:</p>
            <img src={preview} alt="Preview do produto" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        )}

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