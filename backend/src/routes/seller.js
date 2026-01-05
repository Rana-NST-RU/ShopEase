const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireSellerOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get seller's dashboard analytics
router.get('/dashboard', requireAuth, requireSellerOrAdmin, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const isAdmin = req.user.role === 'ADMIN';

        // Get products count
        const productsCount = await prisma.product.count({
            where: isAdmin ? {} : { sellerId },
        });

        // Get total revenue from orders containing seller's products
        const orders = await prisma.orderItem.findMany({
            where: {
                product: isAdmin ? {} : { sellerId },
                order: { status: 'PAID' },
            },
            include: {
                product: true,
            },
        });

        const totalRevenue = orders.reduce((sum, item) => {
            return sum + Number(item.price) * item.quantity;
        }, 0);

        // Get orders count
        const ordersCount = await prisma.order.count({
            where: {
                items: {
                    some: {
                        product: isAdmin ? {} : { sellerId },
                    },
                },
            },
        });

        res.json({
            productsCount,
            totalRevenue,
            ordersCount,
        });
    } catch (error) {
        console.error('Seller dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Get seller's products
router.get('/products', requireAuth, requireSellerOrAdmin, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const isAdmin = req.user.role === 'ADMIN';
        const { page = 1, limit = 100 } = req.query;

        const products = await prisma.product.findMany({
            where: isAdmin ? {} : { sellerId },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const total = await prisma.product.count({
            where: isAdmin ? {} : { sellerId },
        });

        res.json({ items: products, total });
    } catch (error) {
        console.error('Seller products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get orders containing seller's products
router.get('/orders', requireAuth, requireSellerOrAdmin, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const isAdmin = req.user.role === 'ADMIN';

        const orders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        product: isAdmin ? {} : { sellerId },
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Filter items to only show seller's products (for non-admin)
        const filteredOrders = isAdmin
            ? orders
            : orders.map((order) => ({
                ...order,
                items: order.items.filter((item) => item.product.sellerId === sellerId),
            }));

        res.json(filteredOrders);
    } catch (error) {
        console.error('Seller orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
