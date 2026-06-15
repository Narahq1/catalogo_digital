const { Router } = require('express');
const { body }   = require('express-validator');
const { authMiddleware } = require('../middlewares/auth.middleware');
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  registerView,
} = require('../controllers/product.controller');

const router = Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Nome do produto é obrigatório.'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo.'),
];

// GET  /api/products          — Público
router.get('/', listProducts);

// POST /api/products          — Protegido
router.post('/', authMiddleware, productValidation, createProduct);

// PUT  /api/products/:id      — Protegido
router.put('/:id', authMiddleware, productValidation, updateProduct);

// DELETE /api/products/:id    — Protegido
router.delete('/:id', authMiddleware, deleteProduct);

// POST /api/products/:id/view — Público
router.post('/:id/view', registerView);

module.exports = router;
