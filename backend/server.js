// backend/server.js

// 1. Importação dos Módulos
import express from 'express';      // Framework para criar o servidor
import dotenv from 'dotenv';        // Para gerenciar variáveis de ambiente (do arquivo .env)
import cors from 'cors';            // Para permitir requisições de outros "endereços" (frontend)
import connectDB from './config/db.js'; // Nossa função de conexão com o MongoDB
import productRoutes from './routes/productRoutes.js'; // Nosso arquivo de rotas para produtos

// 2. Configuração Inicial
dotenv.config(); // Carrega as variáveis do arquivo .env para process.env
connectDB();     // Executa a função para conectar ao banco de dados

const app = express(); // Inicializa o aplicativo Express

// 3. Middlewares (Funções de Suporte)
// Middleware para habilitar o CORS, resolvendo o erro de acesso
app.use(cors());

// Middleware para permitir que o servidor aceite e entenda dados em formato JSON no corpo das requisições
app.use(express.json());

// 4. Definição das Rotas
// Rota de teste para verificar se a API está no ar
app.get('/', (req, res) => {
  res.send('API do Mercado Online está funcionando!');
});

// "Monta" as rotas de produtos. Qualquer requisição que comece com /api/products
// será gerenciada pelo nosso arquivo productRoutes.js
app.use('/api/products', productRoutes);

// 5. Inicialização do Servidor
const PORT = process.env.PORT || 5000; // Usa a porta definida no .env ou a porta 5000 como padrão

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});