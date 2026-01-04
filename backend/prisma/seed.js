/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    // Electronics (12 products)
    { name: 'Wireless Headphones', description: 'Premium noise-cancelling over-ear headphones with 30-hour battery life', price: 129.99, category: 'Electronics', stock: 40, imageUrl: 'https://picsum.photos/seed/headphones/500/500' },
    { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor and GPS', price: 89.99, category: 'Electronics', stock: 55, imageUrl: 'https://picsum.photos/seed/smartwatch/500/500' },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with 360° sound', price: 34.99, category: 'Electronics', stock: 65, imageUrl: 'https://picsum.photos/seed/speaker/500/500' },
    { name: 'Gaming Mouse', description: 'RGB gaming mouse with 6 programmable buttons', price: 29.99, category: 'Electronics', stock: 60, imageUrl: 'https://picsum.photos/seed/gamingmouse/500/500' },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with blue switches', price: 79.99, category: 'Electronics', stock: 45, imageUrl: 'https://picsum.photos/seed/keyboard/500/500' },
    { name: 'Wireless Earbuds', description: 'True wireless earbuds with charging case', price: 59.99, category: 'Electronics', stock: 80, imageUrl: 'https://picsum.photos/seed/earbuds/500/500' },
    { name: 'Phone Stand', description: 'Adjustable aluminum phone stand for desk', price: 19.99, category: 'Electronics', stock: 100, imageUrl: 'https://picsum.photos/seed/phonestand/500/500' },
    { name: 'Power Bank 20000mAh', description: 'Fast charging power bank with dual USB ports', price: 34.99, category: 'Electronics', stock: 75, imageUrl: 'https://picsum.photos/seed/powerbank/500/500' },
    { name: 'Laptop Stand', description: 'Ergonomic aluminum laptop stand with cooling', price: 44.99, category: 'Electronics', stock: 55, imageUrl: 'https://picsum.photos/seed/laptopstand/500/500' },
    { name: 'Webcam HD', description: '1080p webcam with auto-focus and noise reduction', price: 49.99, category: 'Electronics', stock: 50, imageUrl: 'https://picsum.photos/seed/webcam/500/500' },
    { name: 'Wireless Charger', description: 'Fast wireless charging pad for smartphones', price: 24.99, category: 'Electronics', stock: 90, imageUrl: 'https://picsum.photos/seed/charger/500/500' },
    { name: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI and SD card reader', price: 39.99, category: 'Electronics', stock: 70, imageUrl: 'https://picsum.photos/seed/usbhub/500/500' },

    // Fashion (12 products)
    { name: 'Running Shoes', description: 'Lightweight breathable running shoes', price: 59.99, category: 'Fashion', stock: 70, imageUrl: 'https://picsum.photos/seed/runningshoes/500/500' },
    { name: 'Sunglasses', description: 'UV400 polarized aviator sunglasses', price: 14.99, category: 'Fashion', stock: 150, imageUrl: 'https://picsum.photos/seed/sunglasses/500/500' },
    { name: 'Leather Wallet', description: 'Genuine leather bifold wallet with RFID blocking', price: 29.99, category: 'Fashion', stock: 85, imageUrl: 'https://picsum.photos/seed/wallet/500/500' },
    { name: 'Denim Jacket', description: 'Classic blue denim jacket unisex', price: 49.99, category: 'Fashion', stock: 60, imageUrl: 'https://picsum.photos/seed/denimjacket/500/500' },
    { name: 'Sneakers White', description: 'Classic white leather sneakers', price: 69.99, category: 'Fashion', stock: 75, imageUrl: 'https://picsum.photos/seed/whitesneakers/500/500' },
    { name: 'Baseball Cap', description: 'Adjustable cotton baseball cap', price: 19.99, category: 'Fashion', stock: 100, imageUrl: 'https://picsum.photos/seed/baseballcap/500/500' },
    { name: 'Wrist Watch', description: 'Minimalist analog wrist watch', price: 89.99, category: 'Fashion', stock: 50, imageUrl: 'https://picsum.photos/seed/wristwatch/500/500' },
    { name: 'Leather Belt', description: 'Genuine leather belt with silver buckle', price: 24.99, category: 'Fashion', stock: 90, imageUrl: 'https://picsum.photos/seed/leatherbelt/500/500' },
    { name: 'Hoodie', description: 'Comfortable cotton blend hoodie', price: 39.99, category: 'Fashion', stock: 80, imageUrl: 'https://picsum.photos/seed/hoodie/500/500' },
    { name: 'Backpack', description: 'Durable travel backpack 30L', price: 49.99, category: 'Fashion', stock: 65, imageUrl: 'https://picsum.photos/seed/backpack/500/500' },
    { name: 'Crossbody Bag', description: 'Small leather crossbody bag', price: 44.99, category: 'Fashion', stock: 55, imageUrl: 'https://picsum.photos/seed/crossbodybag/500/500' },
    { name: 'Winter Scarf', description: 'Soft cashmere blend winter scarf', price: 29.99, category: 'Fashion', stock: 70, imageUrl: 'https://picsum.photos/seed/winterscarf/500/500' },

    // Home & Living (12 products)
    { name: 'Coffee Maker', description: '12-cup programmable drip coffee machine', price: 49.99, category: 'Home', stock: 35, imageUrl: 'https://picsum.photos/seed/coffeemaker/500/500' },
    { name: 'LED Desk Lamp', description: 'Adjustable brightness desk lamp with USB port', price: 24.99, category: 'Home', stock: 80, imageUrl: 'https://picsum.photos/seed/desklamp/500/500' },
    { name: 'Throw Pillow', description: 'Decorative velvet throw pillow 18x18', price: 19.99, category: 'Home', stock: 100, imageUrl: 'https://picsum.photos/seed/throwpillow/500/500' },
    { name: 'Wall Clock', description: 'Modern minimalist wall clock 12 inch', price: 29.99, category: 'Home', stock: 65, imageUrl: 'https://picsum.photos/seed/wallclock/500/500' },
    { name: 'Candle Set', description: 'Scented soy candles 3-pack', price: 24.99, category: 'Home', stock: 90, imageUrl: 'https://picsum.photos/seed/candleset/500/500' },
    { name: 'Picture Frame', description: 'Wooden picture frame 8x10', price: 14.99, category: 'Home', stock: 110, imageUrl: 'https://picsum.photos/seed/pictureframe/500/500' },
    { name: 'Plant Pot', description: 'Ceramic plant pot with drainage', price: 16.99, category: 'Home', stock: 95, imageUrl: 'https://picsum.photos/seed/plantpot/500/500' },
    { name: 'Storage Basket', description: 'Woven storage basket with handles', price: 19.99, category: 'Home', stock: 85, imageUrl: 'https://picsum.photos/seed/storagebasket/500/500' },
    { name: 'Blanket', description: 'Soft fleece throw blanket', price: 29.99, category: 'Home', stock: 75, imageUrl: 'https://picsum.photos/seed/blanket/500/500' },
    { name: 'Desk Organizer', description: 'Bamboo desk organizer with drawers', price: 34.99, category: 'Home', stock: 60, imageUrl: 'https://picsum.photos/seed/deskorganizer/500/500' },
    { name: 'Cutting Board', description: 'Bamboo cutting board with juice groove', price: 24.99, category: 'Home', stock: 80, imageUrl: 'https://picsum.photos/seed/cuttingboard/500/500' },
    { name: 'Towel Set', description: 'Bath towels 6-piece set', price: 34.99, category: 'Home', stock: 70, imageUrl: 'https://picsum.photos/seed/towelset/500/500' },

    // Fitness & Sports (12 products)
    { name: 'Yoga Mat', description: 'Non-slip yoga mat 6mm thick', price: 19.99, category: 'Fitness', stock: 120, imageUrl: 'https://picsum.photos/seed/yogamat/500/500' },
    { name: 'Dumbbells Set', description: 'Adjustable dumbbells 5-25 lbs', price: 79.99, category: 'Fitness', stock: 45, imageUrl: 'https://picsum.photos/seed/dumbbells/500/500' },
    { name: 'Resistance Bands', description: 'Exercise resistance bands set of 5', price: 14.99, category: 'Fitness', stock: 100, imageUrl: 'https://picsum.photos/seed/resistancebands/500/500' },
    { name: 'Jump Rope', description: 'Speed jump rope with counter', price: 12.99, category: 'Fitness', stock: 110, imageUrl: 'https://picsum.photos/seed/jumprope/500/500' },
    { name: 'Foam Roller', description: 'High-density foam roller for muscle recovery', price: 24.99, category: 'Fitness', stock: 75, imageUrl: 'https://picsum.photos/seed/foamroller/500/500' },
    { name: 'Water Bottle', description: 'Insulated stainless steel water bottle 32oz', price: 19.99, category: 'Fitness', stock: 130, imageUrl: 'https://picsum.photos/seed/waterbottle/500/500' },
    { name: 'Gym Bag', description: 'Duffel gym bag with shoe compartment', price: 34.99, category: 'Fitness', stock: 65, imageUrl: 'https://picsum.photos/seed/gymbag/500/500' },
    { name: 'Yoga Block', description: 'EVA foam yoga block set of 2', price: 16.99, category: 'Fitness', stock: 85, imageUrl: 'https://picsum.photos/seed/yogablock/500/500' },
    { name: 'Exercise Ball', description: 'Anti-burst exercise ball 65cm', price: 22.99, category: 'Fitness', stock: 70, imageUrl: 'https://picsum.photos/seed/exerciseball/500/500' },
    { name: 'Kettlebell', description: 'Cast iron kettlebell 20 lbs', price: 34.99, category: 'Fitness', stock: 55, imageUrl: 'https://picsum.photos/seed/kettlebell/500/500' },
    { name: 'Push Up Bars', description: 'Push up bars with non-slip grip', price: 19.99, category: 'Fitness', stock: 90, imageUrl: 'https://picsum.photos/seed/pushupbars/500/500' },
    { name: 'Workout Gloves', description: 'Breathable gym gloves with wrist support', price: 16.99, category: 'Fitness', stock: 85, imageUrl: 'https://picsum.photos/seed/workoutgloves/500/500' },
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


