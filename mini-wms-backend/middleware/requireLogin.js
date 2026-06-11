const sessions = require('../sessions');

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'sid';

module.exports = function requireLogin(req, res, next) {
  const sid = req.cookies[SESSION_COOKIE];
  const sess = sid && sessions.get(sid);
  if (!sess) return res.status(401).json({ error: 'Unauthorized' });
  if (sess.expiresAt && sess.expiresAt < Date.now()) {
    sessions.delete(sid);
    return res.status(401).json({ error: "Session expired" });
  }
  req.sid = sid;
  req.session = sess;
  next();
};