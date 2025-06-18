// backend/utils/seeder.js
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // <-- Importamos o bcrypt aqui
import users from '../data/users.js';
import productsData from '../data/mockProducts.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Limpa as coleções antigas
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Dados antigos destruídos...');

    // --- CORREÇÃO APLICADA AQUI ---
    // Criptografa as senhas dos utilizadores admin ANTES de os inserir
    const createdUsers = users.map(user => {
        return {
            ...user,
            password: bcrypt.hashSync(user.password, 10)
        }
    });

    await User.insertMany(createdUsers); // Insere os utilizadores já com a senha criptografada
    console.log('✅ Utilizadores Admin Importados!');

    // Insere os produtos
    await Product.insertMany(productsData);
    console.log('✅ Produtos Importados com Sucesso!');

    process.exit();
  } catch (error) {
    console.error(`❌ Erro ao importar dados: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('✅ Dados Destruídos com Sucesso!');
    process.exit();
  } catch (error) {
    console.error(`❌ Erro ao destruir dados: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}