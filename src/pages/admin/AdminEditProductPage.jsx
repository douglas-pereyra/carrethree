// src/pages/admin/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

function AdminEditProductPage() {
  const { productId } = useParams();
  const { updateProduct, allProducts, isLoadingProducts } = useProducts();
  const navigate = useNavigate();

  // Estados dos campos do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');

  // Estados de controle da página
  const [isFetchingDetails, setIsFetchingDetails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Gera a lista de categorias únicas para o dropdown
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();

  useEffect(() => {
    // Só executa se o ID do produto existir e a lista de produtos já tiver carregado
    if (productId && !isLoadingProducts) {
      const fetchProductDetails = async () => {
        setIsFetchingDetails(true);
        try {
          const response = await fetch(`http://localhost:5000/api/products/${productId}`);
          if (!response.ok) {
            throw new Error('Produto não encontrado');
          }
          const data = await response.json();

          setName(data.name);
          setPrice(data.price);
          setCategory(data.category);
          setDescription(data.description || '');
          setImage(data.image);
          setCountInStock(data.countInStock);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsFetchingDetails(false);
        }
      };

      fetchProductDetails();
    }
  }, [productId, isLoadingProducts]); // Depende do carregamento dos produtos

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const updatedData = {
        name,
        price: parseFloat(price),
        category,
        description,
        image,
        countInStock: parseInt(countInStock, 10)
      };
      const result = await updateProduct(productId, updatedData);

      if (result.success) {
        alert('Produto atualizado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        throw new Error(result.message || 'Falha ao atualizar produto.');
      }
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setError(err.message || 'Ocorreu um erro ao salvar as alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Condição de carregamento geral: mostra enquanto a lista de produtos ou os detalhes do produto estiverem carregando.
  if (isLoadingProducts || isFetchingDetails) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados do produto...</p>;
  }

  if (error && !isSubmitting) { // Só mostra o erro se não estivermos a submeter
    return <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Erro: {error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Produto</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

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
            style={{ width: '100%', padding: '8px', marginTop: '5px', height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="" disabled>Selecione uma categoria</option>
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

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}

export default AdminEditProductPage;