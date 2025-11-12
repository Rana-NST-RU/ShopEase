const router = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { listOrders, getOrder, createOrder, updateOrderStatus, confirmOrder } = require('../controllers/orders.controller');

router.get('/', requireAuth, listOrders);
router.get('/:id', requireAuth, getOrder);
router.post('/', requireAuth, createOrder);
router.post('/:id/confirm', requireAuth, confirmOrder);
router.put('/:id', requireAuth, requireAdmin, updateOrderStatus);

module.exports = router;


