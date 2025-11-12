/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones', price: 129.99, category: 'electronics', stock: 40, imageUrl: '' },
    { name: 'Smart Watch', description: 'Fitness tracking with heart rate monitor', price: 89.99, category: 'electronics', stock: 55, imageUrl: '' },
    { name: 'Running Shoes', description: 'Lightweight and comfortable', price: 59.99, category: 'fashion', stock: 70, imageUrl: '' },
    { name: 'Backpack', description: 'Durable travel backpack 30L', price: 39.99, category: 'accessories', stock: 100, imageUrl: '' },
    { name: 'Coffee Maker', description: '12-cup drip coffee machine', price: 49.99, category: 'home', stock: 35, imageUrl: '' },
    { name: 'LED Desk Lamp', description: 'Adjustable brightness and color temperature', price: 24.99, category: 'home', stock: 80, imageUrl: '' },
    { name: 'Yoga Mat', description: 'Non-slip, 6mm thick', price: 19.99, category: 'fitness', stock: 120, imageUrl: '' },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker', price: 34.99, category: 'electronics', stock: 65, imageUrl: '' },
    { name: 'Sunglasses', description: 'UV400 polarized lenses', price: 14.99, category: 'fashion', stock: 150, imageUrl: '' },
    { name: 'Gaming Mouse', description: 'RGB, 6 programmable buttons', price: 29.99, category: 'electronics', stock: 60, imageUrl: '' },
  ];

  await prisma.product.createMany({ data: products, skipDuplicates: true });
  console.log('Seeded products:', products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


