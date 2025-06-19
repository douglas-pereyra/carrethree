/**
 * @fileoverview Defines the CheckoutSuccessPage component, which is shown to
 * the user after a successful order placement.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

/**
 * Renders a confirmation page after a successful checkout.
 * Its main responsibility is to inform the user that their order was successful
 * and to automatically clear the shopping cart.
 */
function CheckoutSuccessPage() {
    // Get the clearCart function from the CartContext.
    const { clearCart } = useCart();
    
    // This effect runs once when the component mounts.
    useEffect(() => {
        // Automatically clear the shopping cart as soon as the user sees this page.
        // This prevents them from having the same items in the cart if they shop again.
        clearCart();
    }, [clearCart]); // Dependency array includes clearCart to follow hook best practices.

    return (
        <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            padding: '40px 20px',
            textAlign: 'center'
        }}>
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '40px', 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                {/* Checkmark Icon */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="80" 
                    height="80" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#149c68" 
                    strokeWidth="2" 
                    style={{ marginBottom: '20px' }}
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                
                <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Pedido Confirmado!</h1>
                <p style={{ fontSize: '1.1rem', marginBottom: '25px', color: '#555' }}>
                    Obrigado por sua compra. Seu pedido foi recebido e está sendo processado.
                    Você receberá um email com os detalhes em breve.
                </p>
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    {/* Link to go back to the homepage */}
                    <Link 
                        to="/" 
                        style={{ 
                            textDecoration: 'none',
                            backgroundColor: '#149c68',
                            color: 'white',
                            padding: '12px 25px',
                            borderRadius: '5px',
                            fontWeight: '500'
                        }}
                    >
                        Voltar à Loja
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CheckoutSuccessPage;