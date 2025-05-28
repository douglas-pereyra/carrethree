// src/components/product/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importe Link para navegação
import { useCart } from '../../hooks/useCart'; // Hook para adicionar ao carrinho

function ProductCard({ product }) {
  // Estado local para controlar a quantidade selecionada para este card
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart(); // Função para adicionar itens ao carrinho do CartContext

  // Se não houver dados do produto, não renderiza nada (ou poderia renderizar um placeholder)
  if (!product) {
    return null;
  }

  // Funções para manipular a quantidade
  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Não permite quantidade menor que 1
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    } else if (event.target.value === '') {
      // Se o campo for limpo, pode-se definir a quantidade para 1 ou o valor anterior.
      // Aqui, definimos para 1 para simplicidade.
      setQuantity(1);
    }
  };

  // Função para adicionar o produto ao carrinho
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity); // Adiciona o produto e a quantidade selecionada ao carrinho
      //alert(`${quantity}x "${product.name}" adicionado(s) ao carrinho!`);
      // Você pode querer resetar a quantidade para 1 após adicionar, se desejar
      // setQuantity(1);
    }
  };

  return (
    <div className="produto"> {/* Classe principal do card, vinda do seu styles.css */}
      {/* Imagem do produto como um link para a página de detalhes do produto */}
      <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={product.image || '/images/placeholder-image.png'} // Usa um placeholder se a imagem não estiver definida
          alt={product.name}
          style={{
            width: '100%', // Faz a imagem ocupar a largura do contêiner do card
            height: '150px', // Altura fixa para a imagem
            objectFit: 'contain', // Garante que a imagem caiba sem distorcer, pode ser 'cover'
            cursor: 'pointer',    // Indica que a imagem é clicável
            marginBottom: '10px', // Espaço abaixo da imagem
          }}
        />
      </Link>

      {/* Nome do produto como um link para a página de detalhes do produto */}
      <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3
          style={{
            cursor: 'pointer',
            minHeight: '44px', // Ajuda a alinhar títulos de diferentes tamanhos em múltiplas linhas
            fontSize: '1rem',  // Tamanho da fonte do título
            fontWeight: '600', // Peso da fonte
            margin: '0 0 5px 0', // Margens
            color: '#333',      // Cor do texto
          }}
        >
          {product.name}
        </h3>
      </Link>

      <div className="preco-e-controle"> {/* Contêiner para preço e controles */}
        <p className="preco">
          R$ {typeof product.price === 'number' ? product.price.toFixed(2).replace('.', ',') : 'N/A'}
        </p>
        <div className="controle"> {/* Controles de quantidade */}
          <button className="menos" aria-label="Diminuir quantidade" onClick={handleDecrement}>-</button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            aria-label="Quantidade"
          />
          <button className="mais" aria-label="Aumentar quantidade" onClick={handleIncrement}>+</button>
        </div>
        <button className="adicionar-carrinho" onClick={handleAddToCart}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}

export default ProductCard;