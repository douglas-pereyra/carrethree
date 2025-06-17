// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Busca todos os produtos
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(`Erro ao buscar produtos: ${error.message}`);
    res.status(500).json({ message: 'Erro no Servidor' });
  }
});

// --- ROTA 1: BUSCAR PRODUTO ÚNICO ---
// @desc    Busca um único produto pelo ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      console.error(`Erro ao buscar produto por ID: ${error.message}`);
      res.status(500).json({ message: 'Erro no Servidor' });
    }
  });

// @desc    Cria um novo produto
// @route   POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, price, image, category, description, countInStock } = req.body;
    const product = new Product({ name, price, image, category, description, countInStock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(`Erro ao criar produto: ${error.message}`);
    res.status(500).json({ message: 'Erro no Servidor' });
  }
});

// --- ROTA 2: ATUALIZAR UM PRODUTO ---
// @desc    Atualiza um produto existente
// @route   PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
      const { name, price, image, category, description, countInStock } = req.body;
      const product = await Product.findById(req.params.id);
  
      if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.image = image || product.image;
        product.category = category || product.category;
        product.description = description || product.description;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
  
        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      console.error(`Erro ao atualizar produto: ${error.message}`);
      res.status(500).json({ message: 'Erro no Servidor' });
    }
  });

// @desc    Deleta um produto
// @route   DELETE /api/products/:id
// @access  Privado/Admin (vamos proteger mais tarde)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // Novo método para remover o documento
      res.json({ message: 'Produto removido com sucesso' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error(`Erro ao deletar produto: ${error.message}`);
    res.status(500).json({ message: 'Erro no Servidor' });
  }
});

export default router;