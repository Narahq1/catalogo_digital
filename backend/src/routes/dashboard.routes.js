const { Router } = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { getMetrics } = require('../controllers/dashboard.controller');

const router = Router();

// GET /api/dashboard/metrics — Protegido
router.get('/metrics', authMiddleware, getMetrics);

module.exports = router;
