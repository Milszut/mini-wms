const express = require('express');
const { pool } = require('../db');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM `condition` ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Błąd podczas pobierania stanów:', err);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu stanów' });
  }
});

module.exports = router;