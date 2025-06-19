/**
 * @fileoverview Defines the AdminAddProductPage, which provides a form
 * for administrators to create and add a new product to the store.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';

/**
 * Renders a form for adding a new product.
 * It handles form input state, image preview, validation, and submission
 * via the ProductContext.
 */
function AdminAddProductPage() {
  // --- Hooks ---
  const { addProduct, allProducts, isLoadingProducts } = useProducts();
  const navigate = useNavigate();

  // --- State Management ---

  // A single state object to hold all form field data.
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    countInStock: 0,
  });
  
  // Separate states for handling the image file, its preview, and UI feedback.
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Derived Data ---

  // Dynamically create a sorted list of unique categories for the dropdown selector.
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();

  // --- Event Handlers ---

  /**
   * Updates the formData state object when a user types in a form field.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the selection of an image file.
   * It updates the image file state and creates a temporary URL for previewing the image.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Stores the actual file object.
      setImagePreview(URL.createObjectURL(file)); // Creates a temporary URL for the <img> tag.
    }
  };

  /**
   * Handles the form submission.
   * It validates the form data, creates a FormData object for submission (to include the image),
   * and calls the addProduct function from the context.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // --- Form Validation ---
    if (!formData.name || !formData.price || !formData.category || !imageFile || formData.countInStock === '') {
      setError('Por favor, preencha todos os campos obrigatórios (incluindo a imagem).');
      return;
    }
    const priceNumber = parseFloat(formData.price);
    const stockNumber = parseInt(formData.countInStock, 10);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Por favor, insira um preço válido.');
      return;
    }
    if (isNaN(stockNumber) || stockNumber < 0) {
      setError('Por favor, insira um valor de estoque válido.');
      return;
    }

    setIsSubmitting(true);

    // --- Data Preparation & Submission ---
    
    // Create a FormData object to handle the multipart/form-data request,
    // which is necessary for file uploads.
    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('price', priceNumber);
    productFormData.append('category', formData.category);
    productFormData.append('description', formData.description);
    productFormData.append('countInStock', stockNumber);
    productFormData.append('image', imageFile);

    try {
      const result = await addProduct(productFormData);
      if (result.success) {
        alert('Produto adicionado com sucesso!');
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Falha ao adicionar produto.');
      }
    } catch (err) {
      setError('Falha ao adicionar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Adicionar Novo Produto</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

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
          <select name="category" value={formData.category} onChange={handleChange} required disabled={isLoadingProducts} style={{ width: '100%', padding: '8px', marginTop: '5px', height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}>
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
          <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Imagem do Produto:</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        {imagePreview && (
          <div style={{ marginBottom: '15px', textAlign: 'center' }}>
            <p>Preview:</p>
            <img src={imagePreview} alt="Preview do produto" style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Descrição:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', height: '100px', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
      </form>
    </div>
  );
}

export default AdminAddProductPage;