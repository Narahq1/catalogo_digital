const db = require('../config/db');

// ── GET /api/dashboard/metrics ────────────────────────────────
async function getMetrics(req, res) {
  const userId = req.user.id;

  try {
    // Total de produtos do usuário
    const productsResult = await db.query(
      'SELECT COUNT(*) AS total FROM products WHERE user_id = $1',
      [userId]
    );

    // Total de visualizações nos produtos do usuário
    const viewsResult = await db.query(
      `SELECT COUNT(a.id) AS total
       FROM analytics a
       INNER JOIN products p ON p.id = a.product_id
       WHERE p.user_id = $1`,
      [userId]
    );

    // Visualizações por dia (últimos 7 dias) — para gráfico de linha
    const dailyViewsResult = await db.query(
      `SELECT DATE(a.viewed_at) AS date, COUNT(a.id) AS views
       FROM analytics a
       INNER JOIN products p ON p.id = a.product_id
       WHERE p.user_id = $1
         AND a.viewed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(a.viewed_at)
       ORDER BY date ASC`,
      [userId]
    );

    // Visualizações por categoria — para gráfico de pizza
    const categoryViewsResult = await db.query(
      `SELECT p.category, COUNT(a.id) AS views
       FROM analytics a
       INNER JOIN products p ON p.id = a.product_id
       WHERE p.user_id = $1
       GROUP BY p.category
       ORDER BY views DESC`,
      [userId]
    );

    return res.json({
      totalProducts:  parseInt(productsResult.rows[0].total),
      totalViews:     parseInt(viewsResult.rows[0].total),
      dailyViews:     dailyViewsResult.rows,
      categoryViews:  categoryViewsResult.rows,
    });
  } catch (err) {
    console.error('getMetrics error:', err);
    return res.status(500).json({ error: 'Erro ao buscar métricas.' });
  }
}

module.exports = { getMetrics };
