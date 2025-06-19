// backend/routes/cartRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getCart, 
  addItemToCart, 
  removeItemFromCart,
  updateItemQuantity,
  mergeCart,
  clearUserCart
} from '../controllers/cartController.js';

const router = express.Router();

// Todas as rotas aqui são protegidas, exigem login
router.route('/')
  .get(protect, getCart);

router.route('/add')
  .post(protect, addItemToCart);

router.route('/update')
  .put(protect, updateItemQuantity)

router.route('/remove/:productId')
  .delete(protect, removeItemFromCart);

router.route('/merge')
  .post(protect, mergeCart);

router.route('/clear')
  .delete(protect, clearUserCart);

export default router;