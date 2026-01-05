const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  return next();
}

function requireSeller(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Seller access required' });
  }
  return next();
}

function requireSellerOrAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Seller or Admin access required' });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin, requireSeller, requireSellerOrAdmin };


