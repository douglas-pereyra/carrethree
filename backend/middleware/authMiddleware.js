// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do cabeçalho 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verifica e descodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Encontra o utilizador pelo ID no token e anexa-o ao pedido
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continua para a próxima etapa (a rota)
    } catch (error) {
      console.error('Erro de autenticação:', error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Se o utilizador anexado for admin, continua
  } else {
    res.status(403).json({ message: 'Não autorizado como administrador' });
  }
};

export { protect, admin };