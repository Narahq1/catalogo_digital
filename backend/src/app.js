const express        = require('express');
const cors           = require('cors');
const session        = require('express-session');
const passport       = require('./config/passport');

const authRoutes     = require('./routes/auth.routes');
const googleRoutes   = require('./routes/google.routes');
const productRoutes  = require('./routes/product.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ── Middlewares globais ───────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Session — necessária para o Passport OAuth
app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev_secret',
  resave:            false,
  saveUninitialized: false,
  cookie:            { secure: false, maxAge: 5 * 60 * 1000 }, // 5 min — só para o callback
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Rotas ─────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/auth',      googleRoutes);   // /api/auth/google e /api/auth/google/callback
app.use('/api/products',  productRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Rota não encontrada ───────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// ── Erro global ───────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;
