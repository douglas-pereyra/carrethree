// backend/controllers/cartController.js
import User from '../models/User.js';

// @desc    Obtém o carrinho do usuário
// @route   GET /api/cart
// @access  Privado
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (user) {
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(`Erro ao criar carrinho: ${error.message}`);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Adiciona um item ao carrinho
// @route   POST /api/cart/add
// @access  Privado
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Item já existe, atualiza a quantidade
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Novo item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    // Após salvar, fazemos o populate para retornar os detalhes do produto
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

// @desc    Remove um item do carrinho
// @route   DELETE /api/cart/remove/:productId
// @access  Privado
const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(updatedUser.cart);

  } catch (error) {
     res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};


// @desc    Atualiza a quantidade de um item
// @route   PUT /api/cart/update
// @access  Privado
const updateItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                user.cart[itemIndex].quantity = quantity;
            } else {
                // Remove o item se a quantidade for 0 ou menor
                user.cart.splice(itemIndex, 1);
            }
        } else {
            return res.status(404).json({ message: 'Item não encontrado no carrinho' });
        }
        
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.status(200).json(updatedUser.cart);

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor: ' + error.message });
    }
};

// @desc    Funde o carrinho local com o carrinho do DB após o login
// @route   POST /api/cart/merge
// @access  Privado
const mergeCart = async (req, res) => {
  const localCartItems = req.body.cartItems; // Recebe os itens do localStorage

  if (!Array.isArray(localCartItems)) {
    return res.status(400).json({ message: 'Formato de carrinho inválido.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Lógica de fusão
    localCartItems.forEach(localItem => {
      const existingItemIndex = user.cart.findIndex(
        dbItem => dbItem.product.toString() === localItem._id
      );

      if (existingItemIndex > -1) {
        // Se o item já existe no DB, podemos somar as quantidades ou manter a maior
        // Somar é geralmente o mais esperado.
        user.cart[existingItemIndex].quantity += localItem.quantity;
      } else {
        // Se não existe, adiciona o item do carrinho local ao carrinho do DB
        user.cart.push({ product: localItem._id, quantity: localItem.quantity });
      }
    });

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(updatedUser.cart);

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao fundir carrinhos: ' + error.message });
  }
};

// @desc    Limpa todos os itens do carrinho do usuário
// @route   DELETE /api/cart/clear
// @access  Privado
const clearUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.cart = []; // Esvazia o array do carrinho
    await user.save();

    res.status(200).json([]); // Retorna um array vazio
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
};

export { getCart, addItemToCart, removeItemFromCart, updateItemQuantity, mergeCart, clearUserCart };