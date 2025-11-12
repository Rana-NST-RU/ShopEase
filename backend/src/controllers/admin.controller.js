const { prisma } = require('../config/db');

async function analytics(req, res) {
  const [users, products, orders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: 'PAID' } }),
  ]);
  return res.json({ users, products, orders, revenue: revenue._sum.total || 0 });
}

async function autoDeleteOutOfStock(req, res) {
  try {
    // First, find all products with stock <= 0
    const outOfStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 0 } },
      include: {
        orderItems: {
          select: { id: true },
        },
      },
    });

    console.log(`Found ${outOfStockProducts.length} products with stock <= 0`);

    if (outOfStockProducts.length === 0) {
      return res.json({ deleted: 0, message: 'No out-of-stock products found' });
    }

    // Separate products with and without order items
    const productsWithoutOrders = outOfStockProducts.filter((p) => p.orderItems.length === 0);
    const productsWithOrders = outOfStockProducts.filter((p) => p.orderItems.length > 0);

    console.log(`Products without orders: ${productsWithoutOrders.length}`);
    console.log(`Products with orders: ${productsWithOrders.length}`);

    let deletedCount = 0;

    // Delete products that don't have order items
    if (productsWithoutOrders.length > 0) {
      const idsToDelete = productsWithoutOrders.map((p) => p.id);
      console.log(`Attempting to delete product IDs: ${idsToDelete.join(', ')}`);
      
      // Try to delete each product individually to get better error messages
      for (const id of idsToDelete) {
        try {
          await prisma.product.delete({
            where: { id },
          });
          deletedCount++;
          console.log(`Successfully deleted product ID: ${id}`);
        } catch (deleteError) {
          console.error(`Failed to delete product ID ${id}:`, deleteError);
          // If it fails, it might have order items we didn't catch
        }
      }
    }

    return res.json({
      deleted: deletedCount,
      skipped: productsWithOrders.length,
      totalFound: outOfStockProducts.length,
      message: deletedCount > 0
        ? `Successfully deleted ${deletedCount} out-of-stock product(s). ${productsWithOrders.length} product(s) could not be deleted because they have associated orders.`
        : `No products were deleted. ${productsWithOrders.length} product(s) have associated orders and cannot be deleted.`,
      productsWithOrders: productsWithOrders.map((p) => ({ id: p.id, name: p.name })),
    });
  } catch (error) {
    console.error('Error deleting out-of-stock products:', error);
    return res.status(500).json({
      error: 'Failed to delete out-of-stock products',
      details: error.message,
    });
  }
}

module.exports = { analytics, autoDeleteOutOfStock };


