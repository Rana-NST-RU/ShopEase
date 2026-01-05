const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart,
} = require('../controllers/cart.controller');

// All cart routes require authentication
router.use(requireAuth);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Sync guest cart with user cart (on login)
router.post('/sync', syncCart);

// Update cart item quantity
router.put('/:itemId', updateCartItem);

// Remove item from cart
router.delete('/:itemId', removeFromCart);

// Clear entire cart
router.delete('/', clearCart);

module.exports = router;
