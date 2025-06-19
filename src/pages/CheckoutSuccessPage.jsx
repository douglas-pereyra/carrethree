// src/pages/CheckoutSuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useEffect } from 'react';




function CheckoutSuccessPage() {
    const { clearCart } = useCart();
    
    useEffect(() => {// Executa apenas uma vez na montagem
        clearCart(); // Limpa o carrinho assim que a página é carregada 
    }, []);


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
                
                {/* <Link 
                    to="/minha-conta/pedidos" 
                    style={{ 
                    textDecoration: 'none',
                    backgroundColor: 'white',
                    color: '#149c68',
                    padding: '12px 25px',
                    borderRadius: '5px',
                    border: '1px solid #149c68',
                    fontWeight: '500'
                    }}
                >
                    Meus Pedidos
                </Link> */}
                </div>
            </div>
        </div>
    );
}

export default CheckoutSuccessPage;