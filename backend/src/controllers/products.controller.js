const { prisma } = require('../config/db');
const { getPagination, getSorting, getProductFilters } = require('../utils/query');

async function listProducts(req, res) {
  const { skip, limit } = getPagination(req);
  const orderBy = getSorting(req);
  const where = getProductFilters(req);
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
  ]);
  return res.json({ items, total, page: Math.floor(skip / limit) + 1, pageSize: limit });
}

async function getProduct(req, res) {
  const id = parseInt(req.params.id, 10);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  return res.json(product);
}

async function createProduct(req, res) {
  try {
    const data = req.body;
    // Set sellerId to the authenticated user (seller or admin)
    const productData = {
      ...data,
      sellerId: req.user.id,
    };
    const product = await prisma.product.create({ data: productData });
    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

async function updateProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    // Check if product exists and user has permission
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Sellers can only update their own products, admins can update any
    if (req.user.role !== 'ADMIN' && existing.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    const product = await prisma.product.update({ where: { id }, data });
    return res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: {
          select: { id: true },
          take: 1, // Just check if any exist
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Sellers can only delete their own products, admins can delete any
    if (req.user.role !== 'ADMIN' && product.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    // Check if product has associated order items
    if (product.orderItems.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete product that has associated orders. Please remove orders first.',
      });
    }

    // Delete the product
    await prisma.product.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);

    // Handle foreign key constraint errors
    if (error.code === 'P2003' || error.message.includes('Foreign key constraint')) {
      return res.status(400).json({
        error: 'Cannot delete product that has associated orders. Please remove orders first.',
      });
    }

    return res.status(500).json({
      error: 'Failed to delete product',
      details: error.message,
    });
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };


