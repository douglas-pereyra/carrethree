/**
 * @fileoverview Defines the AdminEditProductPage, which provides a form for
 * administrators to update an existing product.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

// Base URL for the products API endpoint.
const API_BASE_URL = 'http://localhost:5000/api/products';

/**
 * Renders a form pre-populated with an existing product's data,
 * allowing an administrator to edit and save the changes.
 */
function AdminEditProductPage() {
  // --- Hooks ---
  const { productId } = useParams(); // Get the product ID from the URL.
  const { updateProduct, allProducts, isLoadingProducts } = useProducts();
  const navigate = useNavigate();

  // --- State Management ---

  // A single state object to hold all form field data.
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    countInStock: '',
  });

  // Separate states for handling the optional new image file and its preview.
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // States for managing UI feedback (loading and error messages).
  const [isFetchingDetails, setIsFetchingDetails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Derived Data ---
  // Create a sorted list of unique categories for the dropdown selector.
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();


  // --- Effects ---

  // This effect fetches the details of the product being edited when the page loads.
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsFetchingDetails(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${productId}`);
        if (!response.ok) {
          throw new Error('Produto não encontrado');
        }
        const data = await response.json();

        // Populate the form state with the fetched product data.
        setFormData({
          name: data.name,
          price: data.price,
          category: data.category,
          description: data.description || '',
          countInStock: data.countInStock,
        });
        // Set the initial image preview to the product's current image.
        setImagePreview(data.image);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetchingDetails(false);
      }
    };
    
    // We only fetch if we have the productId and the main product list has loaded (for categories).
    if (productId && !isLoadingProducts) {
      fetchProductDetails();
    }
  }, [productId, isLoadingProducts]);

  // --- Event Handlers ---

  /**
   * Updates the formData state object when a user types in a form field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the selection of a new image file to upload.
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handles the form submission to update the product.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Create a FormData object to handle the multipart/form-data request.
    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('price', formData.price);
    productFormData.append('category', formData.category);
    productFormData.append('description', formData.description);
    productFormData.append('countInStock', formData.countInStock);
    
    // IMPORTANT: Only append the image if a new one was selected.
    // If not, the backend will keep the existing image.
    if (imageFile) {
      productFormData.append('image', imageFile);
    }

    try {
      const result = await updateProduct(productId, productFormData);
      if (result.success) {
        alert('Produto atualizado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        throw new Error(result.message || 'Falha ao atualizar produto.');
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao salvar as alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Guards ---
  if (isLoadingProducts || isFetchingDetails) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados do produto...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Erro: {error}</p>;
  }

  // --- Main Render ---
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Editar Produto</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

        {/* The `name` attribute on each input is crucial for the generic `handleChange` to work. */}
        <div style={{ marginBottom: '15px' }}>
          <label>Nome do Produto:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength="60" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Preço:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Categoria:</label>
          <select name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px', height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="" disabled>Selecione uma categoria</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Estoque:</label>
          <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Alterar Imagem (opcional):</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        {imagePreview && (
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <p>Imagem Atual:</p>
            <img src={imagePreview} alt="Preview do produto" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Descrição:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', height: '100px', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}

export default AdminEditProductPage;