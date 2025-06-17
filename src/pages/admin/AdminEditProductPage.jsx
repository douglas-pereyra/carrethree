// src/pages/admin/AdminEditProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

function AdminEditProductPage() {
  const { productId } = useParams(); // Pega o ID da URL
  const { updateProduct } = useProducts(); // Pega a função de update do nosso provider
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');

  // Estados de controle da página
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect para buscar os dados do produto quando a página carrega
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Produto não encontrado');
        }
        const data = await response.json();
        
        // Preenche o formulário com os dados do produto
        setName(data.name);
        setPrice(data.price);
        setCategory(data.category);
        setDescription(data.description);
        setImage(data.image);
        setCountInStock(data.countInStock);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Roda sempre que o ID do produto na URL mudar

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const updatedData = { name, price, category, description, image, countInStock };

    const result = await updateProduct(productId, updatedData);

    if (result.success) {
      alert('Produto atualizado com sucesso!');
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Falha ao atualizar produto.');
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Carregando dados do produto...</p>;
  if (error) return <p>Erro: {error}</p>;

  // O JSX do formulário continua o mesmo, mas agora está conectado aos estados
  return (
    <div style={{ padding: '20px' }}>
      <h2>Editar Produto</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
        {/* Campo Nome */}
        <div style={{ marginBottom: '15px' }}>
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {/* Campo Preço */}
        <div style={{ marginBottom: '15px' }}>
          <label>Preço:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%' }} />
        </div>
        {/* Campo Categoria */}
        <div style={{ marginBottom: '15px' }}>
          <label>Categoria:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%' }}/>
        </div>
        {/* Campo Estoque */}
        <div style={{ marginBottom: '15px' }}>
          <label>Estoque:</label>
          <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required style={{ width: '100%' }}/>
        </div>
        {/* Campo Imagem */}
        <div style={{ marginBottom: '15px' }}>
          <label>URL da Imagem:</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required style={{ width: '100%' }}/>
        </div>
        {/* Campo Descrição */}
        <div style={{ marginBottom: '15px' }}>
          <label>Descrição:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', height: '100px' }}/>
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}

export default AdminEditProductPage;