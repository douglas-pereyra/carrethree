// backend/utils/seeder.js
import dotenv from 'dotenv';
import productsData from '../mockProducts.js'; // Importa os produtos da cópia que está na pasta backend
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Conecta ao banco de dados
connectDB();

const importData = async () => {
  try {
    // Apaga todos os produtos existentes para não criar duplicatas
    await Product.deleteMany();
    console.log('Dados antigos destruídos...');

    // Insere os novos produtos do seu arquivo
    await Product.insertMany(productsData);
    console.log('✅ Dados Importados com Sucesso!');
    process.exit();
  } catch (error) {
    console.error(`❌ Erro ao importar dados: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('✅ Dados Destruídos com Sucesso!');
    process.exit();
  } catch (error) {
    console.error(`❌ Erro ao destruir dados: ${error}`);
    process.exit(1);
  }
};

// Verifica se o comando foi executado com o argumento -d (para destruir)
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}