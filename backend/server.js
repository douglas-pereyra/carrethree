// backend/server.js
// 1. Importação dos Módulos
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';      // Framework para criar o servidor
import dotenv from 'dotenv';        // Para gerenciar variáveis de ambiente (do arquivo .env)
import cors from 'cors';            // Para permitir requisições de outros "endereços" (frontend)
import connectDB from './config/db.js'; // Nossa função de conexão com o MongoDB
import productRoutes from './routes/productRoutes.js'; // Nosso arquivo de rotas para produtos
import userRoutes from './routes/userRoutes.js'; // <-- Importa as rotas de usuário
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Mercado Online está funcionando!');
});

// "Monta" as rotas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // <-- Diz ao Express para usar as rotas de usuário
app.use('/api/cart', cartRoutes);

// Upload de imagens
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));

// 5. Inicialização do Servidor
const PORT = process.env.PORT || 5000; // Usa a porta definida no .env ou a porta 5000 como padrão


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});