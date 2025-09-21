import type { ArtisanProfile, MonthlySales, EngagementData, Product, PortfolioItem } from './types';

export const ARTISAN_PROFILE: ArtisanProfile = {
  id: 'user1',
  name: 'Elena Vance',
  specialty: 'Handcrafted Pottery',
  avatarUrl: 'https://picsum.photos/seed/elena/100/100',
  location: 'Willow Creek',
  experience: '10+ Years',
  availability: 'Accepting Commissions',
  workplace: 'Willow Creek Pottery Studio',
  phone: '555-123-4567',
  instagram: '@elenavanceramics',
  portfolio: [
    { id: 'p1', title: 'Raku-Fired Vase', imageUrl: 'https://picsum.photos/seed/raku/600/400', description: 'A decorative vase fired using a traditional Japanese Raku technique, resulting in a unique, crackled glaze.' },
    { id: 'p2', title: 'Crystalline Glaze Bowl', imageUrl: 'https://picsum.photos/seed/crystal/600/400', description: 'A large centerpiece bowl featuring a complex crystalline glaze that grows zinc crystals in the kiln.' },
    { id: 'p3', title: 'Sculptural Teapot', imageUrl: 'https://picsum.photos/seed/teapot/600/400', description: 'An avant-garde, non-functional teapot sculpture exploring form and texture in clay.' },
  ]
};

export const SALES_DATA: MonthlySales[] = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

export const PROFIT_DATA = [
    { name: 'Jan', profit: 2400 },
    { name: 'Feb', profit: 1398 },
    { name: 'Mar', profit: 7800 },
    { name: 'Apr', profit: 3908 },
    { name: 'May', profit: 4800 },
    { name: 'Jun', profit: 3800 },
];

export const ENGAGEMENT_DATA: EngagementData[] = [
    { name: 'Week 1', views: 1200, likes: 240, follows: 20 },
    { name: 'Week 2', views: 1800, likes: 350, follows: 35 },
    { name: 'Week 3', views: 1500, likes: 300, follows: 28 },
    { name: 'Week 4', views: 2200, likes: 480, follows: 50 },
];

export const PRODUCTS_DATA: Product[] = [
    {
      id: 'prod1',
      name: 'Cerulean Splash Mug',
      category: 'Pottery',
      price: 35.00,
      stock: 15,
      imageUrl: 'https://picsum.photos/seed/mug/400/300',
      shortDescription: 'Handcrafted mug with a unique cerulean blue glaze.',
      description: 'A beautiful, handcrafted mug with a unique cerulean blue glaze. Perfect for your morning coffee or tea. Holds 12oz. Made from durable stoneware, it is both microwave and dishwasher safe. The ergonomic handle ensures a comfortable grip, making it your go-to mug for daily use.',
      artisanName: 'Elena Vance'
    },
    {
      id: 'prod2',
      name: 'Terracotta Planter Set',
      category: 'Pottery',
      price: 75.00,
      stock: 8,
      imageUrl: 'https://picsum.photos/seed/planter/400/300',
      shortDescription: 'Set of three matching terracotta planters for succulents.',
      description: 'A set of three matching terracotta planters, ideal for succulents or small houseplants. Includes small, medium, and large pots. Each pot features a drainage hole to prevent overwatering and promote healthy root growth. The classic, earthy design complements any home decor.',
      artisanName: 'Elena Vance'
    },
    {
      id: 'prod3',
      name: 'Earthenware Serving Bowl',
      category: 'Pottery',
      price: 60.00,
      stock: 12,
      imageUrl: 'https://picsum.photos/seed/bowl/400/300',
      shortDescription: 'Large, rustic bowl perfect for salads or as a centerpiece.',
      description: 'A large, rustic earthenware bowl, perfect for serving salads, pasta, or as a decorative centerpiece. Dishwasher safe. Its substantial weight and organic shape make it a stunning and functional piece for your dining table.',
      artisanName: 'Elena Vance'
    },
    {
        id: 'prod9',
        name: 'Midnight Glaze Vase',
        category: 'Pottery',
        price: 90.00,
        stock: 5,
        imageUrl: 'https://picsum.photos/seed/vase/400/300',
        shortDescription: 'A tall, elegant vase with a deep midnight blue glaze.',
        description: 'This tall, elegant vase is a statement piece for any room. Hand-thrown on the potter\'s wheel, it features a stunning deep midnight blue glaze with subtle crystalline patterns that catch the light. Perfect for long-stemmed flowers or as a standalone decorative object.',
        artisanName: 'Elena Vance'
    },
    {
        id: 'prod10',
        name: 'Ceramic Ring Dishes (Set of 2)',
        category: 'Pottery',
        price: 28.00,
        stock: 20,
        imageUrl: 'https://picsum.photos/seed/dishes/400/300',
        shortDescription: 'Two small, speckled dishes for rings or trinkets.',
        description: 'Keep your small treasures safe with this charming set of two ceramic ring dishes. Each dish is hand-formed and features a rustic, speckled white glaze. They are perfect for holding rings, earrings, or other small trinkets on your bedside table or vanity.',
        artisanName: 'Elena Vance'
    },
    {
        id: 'prod4',
        name: 'Hand-carved Wooden Spoon',
        category: 'Woodwork',
        price: 25.00,
        stock: 30,
        imageUrl: 'https://picsum.photos/seed/spoon/400/300',
        shortDescription: 'Smooth, hand-carved spoon from cherry wood.',
        description: 'A beautifully smooth, hand-carved wooden spoon made from sustainably sourced cherry wood. Ideal for cooking or serving. Finished with a food-safe oil, its natural grain and warm color will add a touch of nature to your kitchen.',
        artisanName: 'Samuel Birch'
    },
    {
        id: 'prod5',
        name: 'Linen Tea Towel Set',
        category: 'Textiles',
        price: 40.00,
        stock: 25,
        imageUrl: 'https://picsum.photos/seed/towel/400/300',
        shortDescription: 'Two absorbent linen towels with a botanical pattern.',
        description: 'Set of two highly absorbent linen tea towels, block-printed by hand with a delicate botanical pattern. These towels become softer and more absorbent with every wash, making them as practical as they are beautiful.',
        artisanName: 'Clara Weave'
    },
    {
        id: 'prod6',
        name: 'Silver Mountain Ring',
        category: 'Jewelry',
        price: 120.00,
        stock: 10,
        imageUrl: 'https://picsum.photos/seed/ring/400/300',
        shortDescription: 'Sterling silver ring with a minimalist mountain design.',
        description: 'A sterling silver ring featuring a minimalist mountain range design. Hand-forged and polished to a high shine. A perfect piece for nature lovers and adventurers, it serves as a subtle reminder of the great outdoors.',
        artisanName: 'Aria Sterling'
    },
    {
        id: 'prod7',
        name: 'Oak Cutting Board',
        category: 'Woodwork',
        price: 85.00,
        stock: 5,
        imageUrl: 'https://picsum.photos/seed/board/400/300',
        shortDescription: 'Durable and stylish end-grain oak cutting board.',
        description: 'A durable and stylish end-grain cutting board made from solid oak. Finished with food-safe mineral oil. Its robust construction is gentle on knives and makes it a reliable companion for all your culinary tasks.',
        artisanName: 'Samuel Birch'
    },
    {
        id: 'prod8',
        name: 'Turquoise Drop Earrings',
        category: 'Jewelry',
        price: 95.00,
        stock: 18,
        imageUrl: 'https://picsum.photos/seed/earrings/400/300',
        shortDescription: 'Elegant drop earrings with genuine turquoise stones.',
        description: 'Elegant drop earrings featuring genuine turquoise stones set in sterling silver. Lightweight and perfect for any occasion. The vibrant blue of the turquoise adds a pop of color to any outfit.',
        artisanName: 'Aria Sterling'
    }
];

export const OTHER_ARTISANS_DATA: ArtisanProfile[] = [
    { id: 'user2', name: 'Samuel Birch', specialty: 'Woodwork', avatarUrl: 'https://picsum.photos/seed/samuel/100/100', location: 'Oakhaven', experience: '15 Years', availability: 'Booked', workplace: 'The Birchwood Workshop', phone: '555-234-5678', instagram: '@samuelbirchwood', portfolio: [{ id: 'sb1', title: 'Live-Edge Coffee Table', imageUrl: 'https://picsum.photos/seed/table/600/400', description: 'A unique coffee table crafted from a single slab of maple, preserving the natural edge of the wood.' }] },
    { id: 'user3', name: 'Clara Weave', specialty: 'Textiles', avatarUrl: 'https://picsum.photos/seed/clara/100/100', location: 'Cottonwood Valley', experience: '8 Years', availability: 'By Request', workplace: 'Loom & Spindle', phone: '555-345-6789', instagram: '@claraweaves', portfolio: [] },
    { id: 'user4', name: 'Aria Sterling', specialty: 'Jewelry', avatarUrl: 'https://picsum.photos/seed/aria/100/100', location: 'Silveridge', experience: '12 Years', availability: 'Accepting Commissions', workplace: 'Sterling & Stone', phone: '555-456-7890', instagram: '@ariasterling', portfolio: [{ id: 'as1', title: 'Opal Pendant Necklace', imageUrl: 'https://picsum.photos/seed/opal/600/400', description: 'A handcrafted sterling silver necklace featuring a brilliant, ethically sourced Ethiopian opal.' }] },
    { id: 'user5', name: 'Leo Glass', specialty: 'Glassblowing', avatarUrl: 'https://picsum.photos/seed/leo/100/100', location: 'Crystal Cove', experience: '20 Years', availability: 'Gallery Only', workplace: 'Radiant Glassworks', phone: '555-567-8901', instagram: '@leoglassart', portfolio: [{ id: 'lg1', title: 'Sunset Murrine Vase', imageUrl: 'https://picsum.photos/seed/murrine/600/400', description: 'Hand-blown glass vase created using the complex Italian murrine technique to depict a sunset.' }] },
];

export const FOLLOWERS_DATA = ['user3', 'user5'];
export const FOLLOWING_DATA = ['user2', 'user3', 'user4'];