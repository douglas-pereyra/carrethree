// src/pages/admin/AdminEditProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';

function AdminEditProductPage() {
  const { productId } = useParams();
  const { getProductById, updateProduct, isLoadingProducts: isLoadingContextProducts } = useProducts();
  const { currentUser, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [productNotFound, setProductNotFound] = useState(false);
  const [initialProductLoaded, setInitialProductLoaded] = useState(false);

  const loadProductData = useCallback(() => {
    if (!productId || isLoadingContextProducts || isLoadingAuth) return;

    const productToEdit = getProductById(productId);
    if (productToEdit) {
      setName(productToEdit.name || '');
      setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : '');
      setCategory(productToEdit.category || '');
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image || '');
      setProductNotFound(false);
      setInitialProductLoaded(true);
    } else {
      setProductNotFound(true);
      setError(`Produto com ID ${productId} não encontrado.`);
      setInitialProductLoaded(true);
    }
  }, [productId, getProductById, isLoadingContextProducts, isLoadingAuth]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoadingForm(true);

    if (!name || !price || !category || !image) {
      setError('Por favor, preencha todos os campos obrigatórios (Nome, Preço, Categoria, URL da Imagem).');
      setIsLoadingForm(false);
      return;
    }
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Por favor, insira um preço válido.');
      setIsLoadingForm(false);
      return;
    }

    try {
      await updateProduct(productId, { name, price: priceNumber, category, description, image });
      alert('Produto atualizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setError('Falha ao atualizar produto. Tente novamente.');
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Estilos consistentes com AdminAddProductPage.jsx
  const formStyle = {
    display: 'flex',
    flexDirection: 'column', // Garante que os elementos do formulário empilhem
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  const inputGroupStyle = { marginBottom: '15px' };
  const labelStyle = { marginBottom: '5px', fontWeight: 'bold', display: 'block' };
  const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' };
  const primaryButtonStyle = { // Estilo para o botão de ação principal (Salvar Alterações)
    padding: '10px 15px',
    backgroundColor: '#007bff', // Azul para "Salvar" (diferente do verde de "Adicionar")
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    opacity: isLoadingForm ? 0.7 : 1,
    // width: '100%', // Se quiser que o botão ocupe toda a largura
    // boxSizing: 'border-box', // Se adicionar padding/border e width 100%
  };
  const secondaryButtonStyle = { // Estilo para o botão de ação secundária (Cancelar)
    padding: '10px 15px',
    backgroundColor: '#6c757d', // Cinza para "Cancelar"
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    marginTop: '10px', // <<< IMPORTANTE: Espaço para empilhar abaixo do botão primário
    opacity: isLoadingForm ? 0.7 : 1,
    // width: '100%',
    // boxSizing: 'border-box',
  };
  const errorStyle = { color: 'red', marginBottom: '10px', textAlign: 'center' };
  const pageMessageStyle = { padding: '20px', textAlign: 'center', fontSize: '1.2em' };

  if (isLoadingAuth || isLoadingContextProducts || (!initialProductLoaded && !productNotFound)) {
    return <div style={pageMessageStyle}>Carregando dados do produto...</div>;
  }

  if (productNotFound) {
    return (
      <div style={pageMessageStyle}>
        <h2>Produto não Encontrado</h2>
        <p>{error || `Não foi possível encontrar o produto com ID ${productId}.`}</p>
        <Link to="/admin/dashboard" style={{ ...primaryButtonStyle, backgroundColor: '#6c757d', textDecoration:'none', display: 'inline-block' }}>
            Voltar para Produtos
        </Link>
      </div>
    );
  }

  if (!currentUser?.isAdmin) {
    return <div style={pageMessageStyle}>Acesso não autorizado.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Editar Produto (ID: {productId?.substring(0,8)}...)</h2> {/* Mostrar ID de forma mais curta */}
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={errorStyle}>{error}</p>}
        
        <div style={inputGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Nome do Produto:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        </div>
        {/* Repita inputGroupStyle para outros campos: price, category, image, description */}
        <div style={inputGroupStyle}>
          <label htmlFor="price" style={labelStyle}>Preço (R$):</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} step="0.01" min="0.01" required />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="category" style={labelStyle}>Categoria:</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} required />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="image" style={labelStyle}>URL da Imagem:</label>
          <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} placeholder="Ex: /images/meu-produto.jpg" required />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Descrição:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
        </div>
        
        {/* Botões empilhados */}
        <button type="submit" style={primaryButtonStyle} disabled={isLoadingForm}>
          {isLoadingForm ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            style={secondaryButtonStyle}
            disabled={isLoadingForm}
        >
            Cancelar
        </button>
      </form>
    </div>
  );
}

export default AdminEditProductPage;