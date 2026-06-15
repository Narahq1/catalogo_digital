const { validationResult } = require('express-validator');
const crypto = require('crypto');
const db = require('../config/db');

// ── GET /api/products ─────────────────────────────────────────
async function listProducts(req, res) {
  const { search = '', category = '' } = req.query;

  try {
    let query  = `SELECT id, user_id, name, description, price, image_url, category, created_at
                  FROM products WHERE 1=1`;
    const params = [];
    let   idx    = 1;

    if (search) {
      query += ` AND (LOWER(name) LIKE $${idx} OR LOWER(description) LIKE $${idx})`;
      params.push(`%${search.toLowerCase()}%`);
      idx++;
    }

    if (category) {
      query += ` AND LOWER(category) = $${idx}`;
      params.push(category.toLowerCase());
      idx++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return res.json({ products: result.rows });
  } catch (err) {
    console.error('listProducts error:', err);
    return res.status(500).json({ error: 'Erro ao listar produtos.' });
  }
}

// ── POST /api/products ────────────────────────────────────────
async function createProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, description, price, image_url, category } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO products (user_id, name, description, price, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, name.trim(), description || '', price, image_url || '', category || '']
    );

    return res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ error: 'Erro ao criar produto.' });
  }
}

// ── PUT /api/products/:id ─────────────────────────────────────
async function updateProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, description, price, image_url, category } = req.body;

  try {
    // Verificar propriedade
    const owner = await db.query(
      'SELECT id FROM products WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (owner.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado ou sem permissão.' });
    }

    const result = await db.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, image_url=$4, category=$5, updated_at=NOW()
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [name.trim(), description || '', price, image_url || '', category || '', id, req.user.id]
    );

    return res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
}

// ── DELETE /api/products/:id ──────────────────────────────────
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM products WHERE id=$1 AND user_id=$2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado ou sem permissão.' });
    }

    return res.json({ message: 'Produto removido com sucesso.' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ error: 'Erro ao remover produto.' });
  }
}

// ── POST /api/products/:id/view ───────────────────────────────
async function registerView(req, res) {
  const { id } = req.params;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  // Hash do IP para preservar privacidade (LGPD)
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

  try {
    // Verificar se produto existe
    const product = await db.query('SELECT id FROM products WHERE id=$1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    await db.query(
      'INSERT INTO analytics (product_id, visitor_ip_hash) VALUES ($1, $2)',
      [id, ipHash]
    );

    return res.status(201).json({ message: 'Visualização registrada.' });
  } catch (err) {
    console.error('registerView error:', err);
    return res.status(500).json({ error: 'Erro ao registrar visualização.' });
  }
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct, registerView };
