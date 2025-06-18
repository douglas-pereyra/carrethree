// backend/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Rota de Registo (já existente)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já foi cadastrado.' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos.' });
    }
  } catch (error) {
    console.error(`Erro ao registrar usuário: ${error.message}`);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// --- NOVA ROTA DE LOGIN ---
// @desc    Autentica o utilizador e obtém o token
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Verifica se o utilizador existe E se a senha corresponde
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      // Mensagem genérica por segurança
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error(`Erro no login: ${error.message}`);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});


export default router;