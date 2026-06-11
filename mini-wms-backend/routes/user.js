const express = require('express');
const {pool} = require('../db.js');
const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

router.get('/', requireLogin, async (req,res) =>{
  const [rows] = await pool.query(
    `SELECT id, username
     FROM users
     WHERE id=?`,
     [req.session.userId]
  );
  if(!rows.length) return res.status(404).json({ error: 'User not found'});
  res.json({ user: rows[0]});
});

module.exports = router;