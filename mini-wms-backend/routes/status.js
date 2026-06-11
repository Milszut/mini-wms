const express = require('express');
const { pool } = require('../db');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM status ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Błąd podczas pobierania statusów:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu statusów' });
  }
});

module.exports = router;