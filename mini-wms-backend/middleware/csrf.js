const CSRF_COOKIE = process.env.CSRF_COOKIE_NAME;

module.exports = function csrf(req, res, next) {
  if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
    const header = req.get('X-CSRF-Token');
    const cookieToken = req.cookies[CSRF_COOKIE];
    if (!header || !cookieToken || header !== cookieToken) {
      return res.status(403).json({ error: 'Invalid Token' });
    }
  }
  next();
};