const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const { pool } = require('../db');
const sessions = require('../sessions');

const router = express.Router();

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'sid';
const CSRF_COOKIE = process.env.CSRF_COOKIE_NAME || 'csrf';
const isProd = process.env.NODE_ENV === 'production';

router.post('/login', async (req, res) => {
 const { username, password } = req.body || {};
  if (!username || !password) { return res.status(400).json({ error: 'username & password required' });}

  const [rows] = await pool.query(
    'SELECT id, password, username FROM users WHERE username=?',
    [username]
  );
  if (!rows.length) return res.status(401).json({ error: 'Your login details are incorrect' });

  const ok = await bcrypt.compare(password, rows[0].password);
  if (!ok) return res.status(401).json({ error: 'Your login details are incorrect' });

  const sid = uuid();
  const csrfToken = uuid();
  sessions.set(sid, { 
    userId: rows[0].id, 
    username, 
    csrfToken,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
  });

  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.cookie(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.status(204).end();
});

router.post('/logout', (req, res) => {
  const sid = req.cookies[SESSION_COOKIE];
  if (sid) sessions.delete(sid);

  res.clearCookie(SESSION_COOKIE, {
    path: '/',
    sameSite: 'lax',
  });

  res.clearCookie(CSRF_COOKIE, {
    path: '/',
    sameSite: 'lax',
  });

  res.status(204).end();
});

module.exports = router;