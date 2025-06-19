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

  // Estados para o upload de imagem
  const [imageFile, setImageFile] = useState(null); // Armazena o ARQUIVO da nova imagem
  const [imagePreview, setImagePreview] = useState(''); // Armazena a URL da imagem atual ou do preview da nova

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

  // Função para lidar com a mudança de imagem
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Guarda o arquivo
      setImagePreview(URL.createObjectURL(file)); // Cria uma URL temporária para o preview
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('countInStock', countInStock);
    
    // Anexa a nova imagem APENAS se uma foi selecionada
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const result = await updateProduct(productId, formData);

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

        {/* CAMPO DE IMAGEM */}
        <div style={{ marginBottom: '15px' }}>
          <label>Imagem do Produto (opcional, para alterar):</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
          />
        </div>

        {/* PREVIEW DA IMAGEM */}
        {imagePreview && (
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <p>Imagem Atual:</p>
            <img src={imagePreview} alt="Preview do produto" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        )}

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