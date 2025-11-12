const { prisma } = require('../config/db');
const { getPagination } = require('../utils/query');
const { createCheckoutSession, retrieveSession } = require('../services/paymentService');

async function listOrders(req, res) {
  const { skip, limit } = getPagination(req);
  const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
  const [items, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit, include: { items: true } }),
    prisma.order.count({ where }),
  ]);
  return res.json({ items, total });
}

async function getOrder(req, res) {
  const id = parseInt(req.params.id, 10);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  return res.json(order);
}

async function createOrder(req, res) {
  const { items } = req.body; // [{ productId, quantity }]
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  const productIds = items.map(i => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map(p => [p.id, p]));

  let total = 0;
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) return res.status(400).json({ error: `Invalid product ${item.productId}` });
    if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    total += Number(product.price) * item.quantity;
  }

  const session = createCheckoutSession({
    items,
    amount: Math.round(total * 100),
    currency: 'usd',
  });

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      status: 'PENDING',
      total,
      paymentId: session.id,
      items: {
        create: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: productMap.get(i.productId).price,
        })),
      },
    },
    include: { items: true },
  });

  return res.status(201).json({ order, checkoutUrl: session.url });
}

async function confirmOrder(req, res) {
  const id = parseInt(req.params.id, 10);
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const session = retrieveSession(order.paymentId);
  if (session.payment_status !== 'paid') return res.status(400).json({ error: 'Payment not completed' });

  // Decrement stock and increase product popularity
  const updated = await prisma.$transaction(async (tx) => {
    const items = await tx.orderItem.findMany({ where: { orderId: id } });
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          popularity: { increment: item.quantity },
        },
      });
    }
    return tx.order.update({ where: { id }, data: { status: 'PAID' } });
  });
  return res.json(updated);
}

async function updateOrderStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  
  const updated = await prisma.order.update({ where: { id }, data: { status } });
  return res.json(updated);
}

module.exports = { listOrders, getOrder, createOrder, confirmOrder, updateOrderStatus };


