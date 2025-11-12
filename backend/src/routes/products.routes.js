const router = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', requireAuth, requireAdmin, createProduct);
router.post('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

module.exports = router;


