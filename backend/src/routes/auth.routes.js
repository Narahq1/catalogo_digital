const { Router } = require('express');
const { body }   = require('express-validator');
const { register, login } = require('../controllers/auth.controller');

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
    body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('A senha deve ter no mínimo 6 caracteres.'),
  ],
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('password').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  login
);

module.exports = router;
