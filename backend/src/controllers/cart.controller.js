const { prisma } = require('../config/db');

// Get user's cart
async function getCart(req, res) {
    try {
        const userId = req.user.id;

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Create cart if it doesn't exist
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }

        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to get cart' });
    }
}

// Add item to cart
async function addToCart(req, res) {
    try {
        console.log('=== Add to Cart Request ===');
        console.log('User:', req.user);
        console.log('Body:', req.body);

        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            console.log('Error: Product ID missing');
            return res.status(400).json({ error: 'Product ID is required' });
        }

        console.log('Finding/creating cart for user:', userId);
        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            console.log('Cart not found, creating new cart');
            cart = await prisma.cart.create({
                data: { userId },
            });
            console.log('Created cart:', cart);
        } else {
            console.log('Found existing cart:', cart);
        }

        console.log('Checking for existing cart item:', { cartId: cart.id, productId: parseInt(productId) });
        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                },
            },
        });
        console.log('Existing item:', existingItem);

        let cartItem;
        if (existingItem) {
            console.log('Updating existing item quantity');
            // Update quantity
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true },
            });
        } else {
            console.log('Creating new cart item');
            // Create new cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                    quantity,
                },
                include: { product: true },
            });
        }

        console.log('Cart item result:', cartItem);
        res.json(cartItem);
    } catch (error) {
        console.error('Add to cart error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
    }
}

// Update cart item quantity
async function updateCartItem(req, res) {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Valid quantity is required' });
        }

        // Verify the cart item belongs to the user
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(itemId) },
            include: { cart: true },
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: parseInt(itemId) },
            data: { quantity },
            include: { product: true },
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
}

// Remove item from cart
async function removeFromCart(req, res) {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        // Verify the cart item belongs to the user
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(itemId) },
            include: { cart: true },
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(itemId) },
        });

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
}

// Clear cart
async function clearCart(req, res) {
    try {
        const userId = req.user.id;

        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
}

// Sync guest cart with user cart (merge on login)
async function syncCart(req, res) {
    try {
        const userId = req.user.id;
        const { items } = req.body; // Array of { productId, quantity }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items array is required' });
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        // Merge items
        for (const item of items) {
            const existingItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: parseInt(item.productId),
                    },
                },
            });

            if (existingItem) {
                // Add quantities together
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity },
                });
            } else {
                // Create new item
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: parseInt(item.productId),
                        quantity: item.quantity,
                    },
                });
            }
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.json(updatedCart);
    } catch (error) {
        console.error('Sync cart error:', error);
        res.status(500).json({ error: 'Failed to sync cart' });
    }
}

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart,
};
