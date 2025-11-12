const router = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { analytics, autoDeleteOutOfStock } = require('../controllers/admin.controller');

router.use(requireAuth, requireAdmin);
router.get('/analytics', analytics);
router.post('/cleanup/out-of-stock', autoDeleteOutOfStock);

module.exports = router;


