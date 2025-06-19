/**
 * @fileoverview Defines the CheckoutPage component, which handles the final step
 * of the purchasing process, including address and payment information.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

// --- Helper Functions ---

/**
 * Validates a credit card number using the Luhn algorithm.
 * @param {string} cardNumber - The credit card number to validate.
 * @returns {boolean} True if the card number is valid, otherwise false.
 */
const isValidCreditCard = (cardNumber) => {
  const cleanedCardNumber = cardNumber.replace(/\D/g, '');
  if (!/^\d+$/.test(cleanedCardNumber)) {
    return false;
  }
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanedCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedCardNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

function CheckoutPage() {
  // --- Hooks ---
  const { cartItems, getCartTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // --- State ---
  const [formData, setFormData] = useState({
    firstName: currentUser?.name.split(' ')[0] || '',
    lastName: currentUser?.name.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: '', address: '', addressNumber: '', addressComplement: '',
    neighborhood: '', city: '', state: '', zipCode: '',
    paymentMethod: 'pix', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  // --- Effects ---

  // Redirects to the homepage if the user navigates to checkout with an empty cart.
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      navigate('/');
    }
  }, [cartItems, navigate, isSubmitting]);
  
  // Fetches address details from the ViaCEP API whenever the zip code changes.
  useEffect(() => {
    const fetchAddressByZipCode = async (zipCode) => {
      const cleanedZipCode = zipCode.replace(/\D/g, '');
      if (cleanedZipCode.length !== 8) return;

      setIsFetchingAddress(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedZipCode}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
            addressComplement: data.complemento || ''
          }));
        }
      } catch (error) {
        // Silently fail on API error, user can still input manually.
      } finally {
        setIsFetchingAddress(false);
      }
    };
    
    fetchAddressByZipCode(formData.zipCode);
  }, [formData.zipCode]);

  // --- Event Handlers ---
  
  /**
   * Handles changes for all form inputs.
   * It updates the form state and applies input masking for specific fields.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    let formattedValue = value;
    if (name === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
    } else if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    } else if (name === 'cardExpiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (name === 'cardCvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };
  
  /**
   * Validates the entire form before submission.
   * @returns {boolean} True if the form is valid, otherwise false.
   */
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'addressNumber', 'neighborhood', 'city', 'state', 'zipCode'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    if (formData.zipCode.replace(/\D/g, '').length !== 8) {
      newErrors.zipCode = 'CEP inválido';
    }
    
    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório';
      else if (!isValidCreditCard(formData.cardNumber)) newErrors.cardNumber = 'Número de cartão inválido';
      if (!formData.cardName.trim()) newErrors.cardName = 'Nome no cartão é obrigatório';
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Validade é obrigatória';
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Formato inválido (use MM/AA)';
      } else {
        const [month, year] = formData.cardExpiry.split('/');
        const expiryDate = new Date(`20${year}`, month, 1);
        if (expiryDate < new Date()) {
          newErrors.cardExpiry = 'Cartão expirado';
        }
      }
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV é obrigatório';
      else if (!/^[0-9]{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the form submission to finalize the order.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // In a real application, you would send the order data to the backend here.
      // For this project, we clear the cart and simulate success.
      clearCart();
      navigate('/checkout/success', { replace: true });
    } catch (error) {
      console.error('Checkout submission error:', error);
      setIsSubmitting(false);
    }
  };

  // --- Totals Calculation ---
  const shippingCost = 10.00;
  const subtotal = getCartTotalPrice();
  const total = subtotal + shippingCost;

  // --- Render ---
  return (
    <div className="checkout-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <h1>Finalizar Compra</h1>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Left column: Form */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Personal Info Section */}
            <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Informações Pessoais</h2>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nome*</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.firstName ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                  {errors.firstName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.firstName}</p>}
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sobrenome*</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.lastName ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                  {errors.lastName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.lastName}</p>}
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email*</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.email ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                {errors.email && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.email}</p>}
              </div>
              <div style={{ marginTop: '15px' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Telefone*</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" style={{ width: '100%', padding: '10px', border: `1px solid ${errors.phone ? 'red' : '#ddd'}`, borderRadius: '4px' }}/>
                {errors.phone && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.phone}</p>}
              </div>
            </section>
            
            {/* Shipping Address Section */}
            <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Endereço de Entrega</h2>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="zipCode" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>CEP*</label>
                <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="00000-000" style={{ width: '100%', padding: '10px', border: `1px solid ${errors.zipCode ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                {errors.zipCode && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.zipCode}</p>}
                {isFetchingAddress && <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '5px' }}>Buscando endereço...</p>}
              </div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <div style={{ flex: '2 1 300px' }}>
                  <label htmlFor="address" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Endereço*</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.address ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                  {errors.address && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.address}</p>}
                </div>
                <div style={{ flex: '1 1 100px' }}>
                  <label htmlFor="addressNumber" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Número*</label>
                  <input type="text" id="addressNumber" name="addressNumber" value={formData.addressNumber} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.addressNumber ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                  {errors.addressNumber && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.addressNumber}</p>}
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="addressComplement" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Complemento</label>
                <input type="text" id="addressComplement" name="addressComplement" value={formData.addressComplement} onChange={handleChange} placeholder="Apartamento, bloco, etc." style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="neighborhood" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bairro*</label>
                <input type="text" id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.neighborhood ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                {errors.neighborhood && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.neighborhood}</p>}
              </div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label htmlFor="city" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cidade*</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.city ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                  {errors.city && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.city}</p>}
                </div>
                <div style={{ flex: '1 1 100px' }}>
                  <label htmlFor="state" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Estado*</label>
                  <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px', border: `1px solid ${errors.state ? 'red' : '#ddd'}`, borderRadius: '4px' }} />
                  {errors.state && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.state}</p>}
                </div>
              </div>
            </section>

            {/* Payment Method Section */}
            <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Método de Pagamento</h2>
              <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="radio" name="paymentMethod" value="credit" checked={formData.paymentMethod === 'credit'} onChange={handleChange}/>
                    Cartão de Crédito
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <input type="radio" name="paymentMethod" value="pix" checked={formData.paymentMethod === 'pix'} onChange={handleChange}/>
                    PIX
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <input type="radio" name="paymentMethod" value="boleto" checked={formData.paymentMethod === 'boleto'} onChange={handleChange}/>
                    Boleto Bancário
                  </label>
              </div>
              
              {formData.paymentMethod === 'credit' && (
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <div style={{ marginBottom: '15px' }}>
                      <label htmlFor="cardNumber" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Número do Cartão*</label>
                      <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: '10px', border: `1px solid ${errors.cardNumber ? 'red' : '#ddd'}`, borderRadius: '4px' }}/>
                      {errors.cardNumber && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.cardNumber}</p>}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                      <label htmlFor="cardName" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nome no Cartão*</label>
                      <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Nome como impresso no cartão" style={{ width: '100%', padding: '10px', border: `1px solid ${errors.cardName ? 'red' : '#ddd'}`, borderRadius: '4px' }}/>
                      {errors.cardName && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.cardName}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 120px' }}>
                      <label htmlFor="cardExpiry" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Validade (MM/AA)*</label>
                      <input type="text" id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} placeholder="MM/AA" style={{ width: '100%', padding: '10px', border: `1px solid ${errors.cardExpiry ? 'red' : '#ddd'}`, borderRadius: '4px' }}/>
                      {errors.cardExpiry && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.cardExpiry}</p>}
                      </div>
                      <div style={{ flex: '1 1 120px' }}>
                      <label htmlFor="cardCvv" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>CVV*</label>
                      <input type="text" id="cardCvv" name="cardCvv" value={formData.cardCvv} onChange={handleChange} placeholder="123" style={{ width: '100%', padding: '10px', border: `1px solid ${errors.cardCvv ? 'red' : '#ddd'}`, borderRadius: '4px' }}/>
                      {errors.cardCvv && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.cardCvv}</p>}
                      </div>
                  </div>
                  </div>
              )}
              {formData.paymentMethod === 'pix' && (<div style={{ borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}><p>Você será redirecionado para gerar o QR Code PIX após confirmar o pedido.</p></div>)}
              {formData.paymentMethod === 'boleto' && (<div style={{ borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}><p>O boleto será gerado após a confirmação do pedido e enviado para seu email.</p></div>)}
            </section>

            <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#149c68', color: 'white', border: 'none', padding: '15px', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}>
              {isSubmitting ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </form>
        </div>
        
        {/* Right column: Order Summary */}
        <div style={{ flex: '0 0 350px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Resumo do Pedido</h2>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              {cartItems.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span>{item.name} &times; {item.quantity}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Frete</span>
                <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <div style={{ paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.1rem' }}>
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Política de Entrega</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Nossas entregas são realizadas de Segunda a Sábado em São Carlos - SP, com uma taxa de entrega fixa de R$ 10,00. Pedidos com pagamento aprovado são despachados e entregues em horário comercial no próximo dia útil. É indispensável a presença de um responsável maior de 18 anos para receber as compras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;