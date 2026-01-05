const router = require('express').Router();
const { requireAuth, requireAdmin, requireSellerOrAdmin } = require('../middleware/auth');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', requireAuth, requireSellerOrAdmin, createProduct);
router.post('/:id', requireAuth, requireSellerOrAdmin, updateProduct);
router.delete('/:id', requireAuth, requireSellerOrAdmin, deleteProduct);

module.exports = router;


