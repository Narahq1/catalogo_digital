const { Router } = require('express');
const passport   = require('../config/passport');
const jwt        = require('jsonwebtoken');

const router = Router();

// Redireciona para a tela de login do Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: true })
);

// Google redireciona de volta aqui após o login
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: true,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`,
  }),
  (req, res) => {
    const user  = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Redireciona para o frontend com token e dados do usuário na query string
    // O frontend lê, salva no localStorage e redireciona para a tela certa
    const encoded = encodeURIComponent(JSON.stringify({ token, user }));
    const dest    = user.role === 'admin' ? '/dashboard' : '/catalogo';
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?data=${encoded}&dest=${dest}`
    );
  }
);

module.exports = router;
