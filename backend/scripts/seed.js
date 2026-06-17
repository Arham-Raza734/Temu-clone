import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
connectDB();

const products = [
  {
    name: 'USB Powered Lint Shaver & Fabric Fuzz Remover',
    description: '1pc Portable USB Powered Lint Remover, Automatic Fabric Shaver for Clothes, Bedding, Carpets, Sofas - Effective Ball & Fuzz Removal, Household Cleaning Tool, Plastic, 36V Max Voltage, No Battery Required.',
    price: 1995,
    marketPrice: 7935,
    salesCount: '31k+ sold',
    ratingStars: 4.5,
    ratingCount: 3478,
    image: '/image (1).jpg',
  },
  {
    name: 'Heavy Duty Magnetic Knife Holder for Kitchen Wall',
    description: 'Stainless steel magnetic knife strip. Powerful double-sided magnet bar for kitchen utensil holder, tool organizer, space-saving kitchen storage, easy to mount on wall.',
    price: 1450,
    marketPrice: 4500,
    salesCount: '12k+ sold',
    ratingStars: 4.8,
    ratingCount: 1205,
    image: '/image (2).jpg',
  },
  {
    name: 'Portable Electric Personal Juicer & Smoothie Blender',
    description: 'USB rechargeable personal mini blender for shakes and smoothies. 400ml bpa-free bottle with 6 powerful blades, 4000mAh battery for travel, gym, and office.',
    price: 2990,
    marketPrice: 9990,
    salesCount: '25k+ sold',
    ratingStars: 4.6,
    ratingCount: 5890,
    image: '/image (3).jpg',
  },
  {
    name: 'Ergonomic Wireless Vertical Mouse for Carpal Tunnel Relief',
    description: 'Optical mouse with 3 adjustable DPI levels (800/1200/1600), 6 buttons, silent clicking, and comfortable ergonomic design to reduce wrist strain and forearm twisting.',
    price: 3200,
    marketPrice: 8000,
    salesCount: '8k+ sold',
    ratingStars: 4.4,
    ratingCount: 742,
    image: '/image (4).jpg',
  },
  {
    name: 'Multi-tier Rotating Spice Rack Organizer for Pantry',
    description: '360-degree lazy susan spinning storage turntable for kitchen, pantry, cabinet, dining table. Durable plastic rack organizer for spices, condiments, and cans.',
    price: 1850,
    marketPrice: 5000,
    salesCount: '15k+ sold',
    ratingStars: 4.7,
    ratingCount: 2011,
    image: '/image (5).jpg',
  },
  {
    name: 'Reusable Silicone Food Storage Bags - Leakproof & Eco-friendly',
    description: 'Set of 6 reusable preservation slider bags. Microwave, dishwasher, and freezer safe. Airtight ziplock closure keeps fruits, veggies, and meat fresh.',
    price: 990,
    marketPrice: 2990,
    salesCount: '40k+ sold',
    ratingStars: 4.9,
    ratingCount: 9481,
    image: '/image (6).jpg',
  },
  {
    name: 'Adjustable Laptop Stand - Aluminum Cooling Riser for Desk',
    description: 'Ergonomic laptop riser stand compatible with MacBook, Air, Pro, Dell, HP, Lenovo. Multi-angle adjustable folding design with anti-slip silicone pads.',
    price: 2450,
    marketPrice: 6500,
    salesCount: '20k+ sold',
    ratingStars: 4.7,
    ratingCount: 4192,
    image: '/image (7).jpg',
  },
  {
    name: 'Premium Memory Foam Lumbar Support Pillow for Office Chair',
    description: 'Orthopedic backrest cushion with breathable mesh cover. Provides lumbar alignment and relief for lower back pain during long hours of sitting or driving.',
    price: 2150,
    marketPrice: 5500,
    salesCount: '9k+ sold',
    ratingStars: 4.5,
    ratingCount: 1308,
    image: '/image (8).jpg',
  },
  {
    name: 'High-Speed USB-C Hub Adapter with 4K HDMI & SD Card Reader',
    description: '7-in-1 multi-port dongle with USB-C Power Delivery, 4K HDMI output, 3 USB 3.0 ports, and SD/MicroSD slots. Sleek aluminum case for iPad, MacBook Pro/Air.',
    price: 3890,
    marketPrice: 11900,
    salesCount: '18k+ sold',
    ratingStars: 4.6,
    ratingCount: 3105,
    image: '/image (9).jpg',
  },
  {
    name: 'LED Motion Sensor Night Lights for Closets and Hallways',
    description: '3-pack wireless stick-on under-cabinet lighting. Rechargeable magnetic wardrobe bar lights, auto on/off, soft white light for stairs, drawers, and hallways.',
    price: 1190,
    marketPrice: 3990,
    salesCount: '50k+ sold',
    ratingStars: 4.8,
    ratingCount: 11403,
    image: '/image (10).jpg',
  },
  {
    name: 'Stainless Steel Self-Squeezing Flat Mop & Bucket Set',
    description: 'Hands-free floor cleaning mop with 2 reusable micro-fiber pads. Dry/wet dual-use flat mop system with splash-proof water separation chamber.',
    price: 3490,
    marketPrice: 8990,
    salesCount: '11k+ sold',
    ratingStars: 4.5,
    ratingCount: 2210,
    image: '/image (11).jpg',
  },
  {
    name: 'Collapsible Silicone Water Bottle for Travel and Gym',
    description: 'Leak-proof sports bottle with carabiner. Lightweight, flexible, BPA-free roll-up beverage container for camping, hiking, and outdoor fitness activities.',
    price: 1290,
    marketPrice: 3200,
    salesCount: '6k+ sold',
    ratingStars: 4.3,
    ratingCount: 651,
    image: '/image (12).jpg',
  },
  {
    name: 'Professional Hair Clipper & Trimmer Set with LCD Display',
    description: 'Cordless electric barber grooming kit. Precision self-sharpening steel blades, guide combs, rechargeable high-capacity battery, ideal for hair cutting.',
    price: 4250,
    marketPrice: 12500,
    salesCount: '14k+ sold',
    ratingStars: 4.7,
    ratingCount: 2984,
    image: '/image (13).jpg',
  },
  {
    name: 'Portable Car Trash Can with Lid and Storage Pockets',
    description: 'Waterproof car garbage bin, hanging auto trash bag. Premium leakproof interior lining, side mesh organizer pockets, keeps vehicle interior clean and tidy.',
    price: 790,
    marketPrice: 2400,
    salesCount: '35k+ sold',
    ratingStars: 4.6,
    ratingCount: 7851,
    image: '/image (14).jpg',
  },
  {
    name: 'Ultra-Quiet Ultrasonic Cool Mist Humidifier for Bedroom',
    description: '2.5L top-fill air humidifier with auto shut-off, night light, adjustable mist level output. Ideal for baby nursery, plants, office, and dry skin relief.',
    price: 2750,
    marketPrice: 7000,
    salesCount: '22k+ sold',
    ratingStars: 4.5,
    ratingCount: 4529,
    image: '/image (15).jpg',
  },
];

const seedDB = async () => {
  try {
    try {
      await Product.collection.drop();
      console.log('Dropped products collection and indexes.');
    } catch (err) {
      // Collection might not exist yet, clear documents as backup
      await Product.deleteMany({});
      console.log('Cleared existing products.');
    }

    await Product.insertMany(products);
    console.log('Database seeded successfully with 15 unique products!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
