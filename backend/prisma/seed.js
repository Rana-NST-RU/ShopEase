/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create users first
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopease.com' },
    update: {},
    create: {
      email: 'admin@shopease.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create seller users
  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@shopease.com' },
    update: {},
    create: {
      email: 'seller1@shopease.com',
      password: hashedPassword,
      name: 'TechGear Store',
      role: 'SELLER',
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@shopease.com' },
    update: {},
    create: {
      email: 'seller2@shopease.com',
      password: hashedPassword,
      name: 'Fashion Hub',
      role: 'SELLER',
    },
  });

  const seller3 = await prisma.user.upsert({
    where: { email: 'seller3@shopease.com' },
    update: {},
    create: {
      email: 'seller3@shopease.com',
      password: hashedPassword,
      name: 'Home Essentials',
      role: 'SELLER',
    },
  });

  const seller4 = await prisma.user.upsert({
    where: { email: 'seller4@shopease.com' },
    update: {},
    create: {
      email: 'seller4@shopease.com',
      password: hashedPassword,
      name: 'FitLife Sports',
      role: 'SELLER',
    },
  });

  console.log('Created users:', { admin: admin.email, seller1: seller1.email, seller2: seller2.email, seller3: seller3.email, seller4: seller4.email });

  // Delete existing products to avoid duplicates
  await prisma.product.deleteMany({});

  // Create products with seller assignments
  const products = [
    // Electronics (12 products) - Assigned to seller1 (TechGear Store)
    { name: 'Wireless Headphones', description: 'Premium noise-cancelling over-ear headphones with 30-hour battery life', price: 129.99, category: 'Electronics', stock: 40, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor and GPS', price: 89.99, category: 'Electronics', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360° sound', price: 34.99, category: 'Electronics', stock: 65, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Gaming Mouse', description: 'RGB gaming mouse with 6 programmable buttons', price: 29.99, category: 'Electronics', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with blue switches', price: 79.99, category: 'Electronics', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Wireless Earbuds', description: 'True wireless earbuds with charging case', price: 59.99, category: 'Electronics', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Phone Stand', description: 'Adjustable aluminum phone stand for desk', price: 19.99, category: 'Electronics', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Power Bank 20000mAh', description: 'Fast charging power bank with dual USB ports', price: 34.99, category: 'Electronics', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Laptop Stand', description: 'Ergonomic aluminum laptop stand with cooling', price: 44.99, category: 'Electronics', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Webcam HD', description: '1080p webcam with auto-focus and noise reduction', price: 49.99, category: 'Electronics', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'Wireless Charger', description: 'Fast wireless charging pad for smartphones', price: 24.99, category: 'Electronics', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1591290619762-d2c3e26e7e7e?w=500&h=500&fit=crop', sellerId: seller1.id },
    { name: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI and SD card reader', price: 39.99, category: 'Electronics', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop', sellerId: seller1.id },

    // Fashion (12 products) - Assigned to seller2 (Fashion Hub)
    { name: 'Running Shoes', description: 'Lightweight breathable running shoes', price: 59.99, category: 'Fashion', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Sunglasses', description: 'UV400 polarized aviator sunglasses', price: 14.99, category: 'Fashion', stock: 150, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Leather Wallet', description: 'Genuine leather bifold wallet with RFID blocking', price: 29.99, category: 'Fashion', stock: 85, imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Denim Jacket', description: 'Classic blue denim jacket unisex', price: 49.99, category: 'Fashion', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Sneakers White', description: 'Classic white leather sneakers', price: 69.99, category: 'Fashion', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Baseball Cap', description: 'Adjustable cotton baseball cap', price: 19.99, category: 'Fashion', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Wrist Watch', description: 'Minimalist analog wrist watch', price: 89.99, category: 'Fashion', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Leather Belt', description: 'Genuine leather belt with silver buckle', price: 24.99, category: 'Fashion', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Hoodie', description: 'Comfortable cotton blend hoodie', price: 39.99, category: 'Fashion', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Backpack', description: 'Durable travel backpack 30L', price: 49.99, category: 'Fashion', stock: 65, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Crossbody Bag', description: 'Small leather crossbody bag', price: 44.99, category: 'Fashion', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', sellerId: seller2.id },
    { name: 'Winter Scarf', description: 'Soft cashmere blend winter scarf', price: 29.99, category: 'Fashion', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=500&fit=crop', sellerId: seller2.id },

    // Home & Living (12 products) - Assigned to seller3 (Home Essentials)
    { name: 'Coffee Maker', description: '12-cup programmable drip coffee machine', price: 49.99, category: 'Home', stock: 35, imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'LED Desk Lamp', description: 'Adjustable brightness desk lamp with USB port', price: 24.99, category: 'Home', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Throw Pillow', description: 'Decorative velvet throw pillow 18x18', price: 19.99, category: 'Home', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Wall Clock', description: 'Modern minimalist wall clock 12 inch', price: 29.99, category: 'Home', stock: 65, imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Candle Set', description: 'Scented soy candles 3-pack', price: 24.99, category: 'Home', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1602874801006-e24b2a31c3b9?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Picture Frame', description: 'Wooden picture frame 8x10', price: 14.99, category: 'Home', stock: 110, imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Plant Pot', description: 'Ceramic plant pot with drainage', price: 16.99, category: 'Home', stock: 95, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Storage Basket', description: 'Woven storage basket with handles', price: 19.99, category: 'Home', stock: 85, imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Blanket', description: 'Soft fleece throw blanket', price: 29.99, category: 'Home', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Desk Organizer', description: 'Bamboo desk organizer with drawers', price: 34.99, category: 'Home', stock: 60, imageUrl: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Cutting Board', description: 'Bamboo cutting board with juice groove', price: 24.99, category: 'Home', stock: 80, imageUrl: 'https://images.unsplash.com/photo-1594135656040-2be5a6d49f7c?w=500&h=500&fit=crop', sellerId: seller3.id },
    { name: 'Towel Set', description: 'Bath towels 6-piece set', price: 34.99, category: 'Home', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&h=500&fit=crop', sellerId: seller3.id },

    // Fitness & Sports (12 products) - Assigned to seller4 (FitLife Sports)
    { name: 'Yoga Mat', description: 'Non-slip yoga mat 6mm thick', price: 19.99, category: 'Fitness', stock: 120, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Dumbbells Set', description: 'Adjustable dumbbells 5-25 lbs', price: 79.99, category: 'Fitness', stock: 45, imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Resistance Bands', description: 'Exercise resistance bands set of 5', price: 14.99, category: 'Fitness', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Jump Rope', description: 'Speed jump rope with counter', price: 12.99, category: 'Fitness', stock: 110, imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Foam Roller', description: 'High-density foam roller for muscle recovery', price: 24.99, category: 'Fitness', stock: 75, imageUrl: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Water Bottle', description: 'Insulated stainless steel water bottle 32oz', price: 19.99, category: 'Fitness', stock: 130, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Gym Bag', description: 'Duffel gym bag with shoe compartment', price: 34.99, category: 'Fitness', stock: 65, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Yoga Block', description: 'EVA foam yoga block set of 2', price: 16.99, category: 'Fitness', stock: 85, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Exercise Ball', description: 'Anti-burst exercise ball 65cm', price: 22.99, category: 'Fitness', stock: 70, imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Kettlebell', description: 'Cast iron kettlebell 20 lbs', price: 34.99, category: 'Fitness', stock: 55, imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Push Up Bars', description: 'Push up bars with non-slip grip', price: 19.99, category: 'Fitness', stock: 90, imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&h=500&fit=crop', sellerId: seller4.id },
    { name: 'Workout Gloves', description: 'Breathable gym gloves with wrist support', price: 16.99, category: 'Fitness', stock: 85, imageUrl: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=500&h=500&fit=crop', sellerId: seller4.id },
  ];

  await prisma.product.createMany({ data: products });
  console.log('Seeded products:', products.length);
  console.log('\n📝 Login Credentials:');
  console.log('Admin: admin@shopease.com / password123');
  console.log('Seller 1 (TechGear): seller1@shopease.com / password123');
  console.log('Seller 2 (Fashion Hub): seller2@shopease.com / password123');
  console.log('Seller 3 (Home Essentials): seller3@shopease.com / password123');
  console.log('Seller 4 (FitLife Sports): seller4@shopease.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

