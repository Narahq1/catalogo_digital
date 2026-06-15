const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');

// ── POST /api/auth/register ───────────────────────────────────
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  // Aceitar apenas 'admin' (empresa) ou 'user' (cliente); default = 'user'
  const safeRole = role === 'admin' ? 'admin' : 'user';

  try {
    // Verificar e-mail duplicado
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.toLowerCase(), password_hash, safeRole]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Erro ao criar conta.' });
  }
}

// ── POST /api/auth/login ──────────────────────────────────────
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;

    return res.json({ user: safeUser, token });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Erro ao realizar login.' });
  }
}

// ── Helper ────────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { register, login };
