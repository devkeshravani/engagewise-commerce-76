
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  featured: boolean;
  rating: number;
  reviews: Review[];
  colors: string[];
  sizes: string[];
  tags: string[];
};

export type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
};

export type Category = {
  id: string;
  name: string;
  subcategories: string[];
  image: string;
};

export const categories: Category[] = [
  {
    id: 'blouses',
    name: 'Blouses',
    subcategories: ['Silk', 'Casual', 'Dressy', 'Sleeveless'],
    image: 'https://images.unsplash.com/photo-1624623278313-a930126a11c3?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'casual-bottoms',
    name: 'Casual Bottoms',
    subcategories: ['Joggers', 'Sweatpants', 'Leggings'],
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'chemises',
    name: 'Chemises',
    subcategories: ['Slip', 'Lace', 'Satin'],
    image: 'https://images.unsplash.com/photo-1616350326303-27e8bad156d7?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'dresses',
    name: 'Dresses',
    subcategories: ['Casual', 'Evening', 'Summer', 'Cocktail'],
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'fine-gauge',
    name: 'Fine Gauge',
    subcategories: ['Cardigans', 'Turtlenecks', 'Pullovers'],
    image: 'https://images.unsplash.com/photo-1616142578289-1a94b19d2241?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'intimates',
    name: 'Intimates',
    subcategories: ['Bras', 'Panties', 'Shapewear'],
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    subcategories: ['Blazers', 'Leather', 'Denim'],
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'jeans',
    name: 'Jeans',
    subcategories: ['Skinny', 'Bootcut', 'Straight', 'High-Rise'],
    image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'knits',
    name: 'Knits',
    subcategories: ['Sweaters', 'Pullovers', 'Cardigans'],
    image: 'https://images.unsplash.com/photo-1624623278212-588ccfd478e0?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'layering',
    name: 'Layering',
    subcategories: ['Cardigans', 'Vests', 'Ponchos'],
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'legwear',
    name: 'Legwear',
    subcategories: ['Tights', 'Stockings', 'Socks'],
    image: 'https://images.unsplash.com/photo-1515664069236-68a74c369d97?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'lounge',
    name: 'Lounge',
    subcategories: ['Cozy', 'Casual', 'Sets'],
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    subcategories: ['Coats', 'Jackets', 'Vests'],
    image: 'https://images.unsplash.com/photo-1601593532815-932fa0e2cb67?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'pants',
    name: 'Pants',
    subcategories: ['Casual', 'Dress', 'Wide-Leg'],
    image: 'https://images.unsplash.com/photo-1592878849122-5c6ed5a89776?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'shorts',
    name: 'Shorts',
    subcategories: ['Casual', 'Athletic', 'Denim'],
    image: 'https://images.unsplash.com/photo-1617886322168-72b886573d73?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'skirts',
    name: 'Skirts',
    subcategories: ['Mini', 'Midi', 'Maxi', 'Pencil'],
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'sleep',
    name: 'Sleep',
    subcategories: ['Pajamas', 'Nightgowns', 'Robes'],
    image: 'https://images.unsplash.com/photo-1616156498188-01f8afe5c56a?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'sweaters',
    name: 'Sweaters',
    subcategories: ['Pullovers', 'Cardigans', 'Turtlenecks'],
    image: 'https://images.unsplash.com/photo-1608648322835-0851ccc52cc3?q=80&w=387&auto=format&fit=crop'
  },
  {
    id: 'swim',
    name: 'Swim',
    subcategories: ['One-Piece', 'Bikinis', 'Cover-Ups'],
    image: 'https://images.unsplash.com/photo-1570976447640-ac859a223c13?q=80&w=387&auto=format&fit=crop'
  }
];

// Predefined high-quality images for specific categories
const categoryImages = {
  'Blouses': [
    'https://images.unsplash.com/photo-1552160793-cbae2e9441c3?q=80&w=2187&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582220107109-40be22b9939c?q=80&w=2187&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559583109-3e7968136c99?q=80&w=3087&auto=format&fit=crop'
  ],
  'Casual Bottoms': [
    'https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=2970&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2926&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=3087&auto=format&fit=crop'
  ],
  'Chemises': [
    'https://images.unsplash.com/photo-1622260614153-03223fb73af9?q=80&w=3270&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602241628512-459cdd3234fe?q=80&w=3056&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616350326303-27e8bad156d7?q=80&w=2970&auto=format&fit=crop'
  ],
  'Dresses': [
    'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=2187&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=2187&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606406054219-619c4c2e2100?q=80&w=2271&auto=format&fit=crop'
  ],
  'Fine Gauge': [
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=3011&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2928&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616142578289-1a94b19d2241?q=80&w=3087&auto=format&fit=crop'
  ],
  'Intimates': [
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2970&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582142407894-ec85a1440cf8?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2970&auto=format&fit=crop'
  ],
  'Jackets': [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=3036&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623113562225-08abec08da21?q=80&w=3087&auto=format&fit=crop'
  ],
  'Jeans': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=2942&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=3087&auto=format&fit=crop'
  ],
  'Knits': [
    'https://images.unsplash.com/photo-1624623278212-588ccfd478e0?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608648322835-0851ccc52cc3?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=3087&auto=format&fit=crop'
  ],
  'Layering': [
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=3011&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593311640936-dada12015c96?q=80&w=2865&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527628173875-3c7bfd28ad78?q=80&w=3087&auto=format&fit=crop'
  ],
  'Legwear': [
    'https://images.unsplash.com/photo-1515664069236-68a74c369d97?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586106417424-5749d2552864?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578858671951-bfe870ddb78d?q=80&w=3087&auto=format&fit=crop'
  ],
  'Lounge': [
    'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613461920867-9ea115fee900?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618355776464-8666794d3f5c?q=80&w=3087&auto=format&fit=crop'
  ],
  'Outerwear': [
    'https://images.unsplash.com/photo-1601593532815-932fa0e2cb67?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=3074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566958769312-82cef41d19ef?q=80&w=3099&auto=format&fit=crop'
  ],
  'Pants': [
    'https://images.unsplash.com/photo-1592878849122-5c6ed5a89776?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574087093605-23f997e876db?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=3087&auto=format&fit=crop'
  ],
  'Shorts': [
    'https://images.unsplash.com/photo-1617886322168-72b886573d73?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591195853866-860b28d28055?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=3087&auto=format&fit=crop'
  ],
  'Skirts': [
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=2942&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=3087&auto=format&fit=crop'
  ],
  'Sleep': [
    'https://images.unsplash.com/photo-1616156498188-01f8afe5c56a?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612964727616-e6b351c93561?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570292185515-43abbcaf32fa?q=80&w=3087&auto=format&fit=crop'
  ],
  'Sweaters': [
    'https://images.unsplash.com/photo-1608648322835-0851ccc52cc3?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605763339941-e620120366ab?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611911813383-67769b37a149?q=80&w=3087&auto=format&fit=crop'
  ],
  'Swim': [
    'https://images.unsplash.com/photo-1570976447640-ac859a223c13?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560956841-2eb9b8d6b948?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605374868293-90e83334a021?q=80&w=3087&auto=format&fit=crop'
  ]
};

// Additional subcategory-specific images
const subcategoryImages = {
  'Silk': [
    'https://images.unsplash.com/photo-1622260614153-03223fb73af9?q=80&w=3270&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582220107109-40be22b9939c?q=80&w=2187&auto=format&fit=crop'
  ],
  'Lace': [
    'https://images.unsplash.com/photo-1616350326303-27e8bad156d7?q=80&w=2970&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602241628512-459cdd3234fe?q=80&w=3056&auto=format&fit=crop'
  ],
  'Satin': [
    'https://images.unsplash.com/photo-1582142407894-ec85a1440cf8?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2970&auto=format&fit=crop'
  ],
  'Casual': [
    'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=2187&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552160793-cbae2e9441c3?q=80&w=2187&auto=format&fit=crop'
  ],
  'Sleeveless': [
    'https://images.unsplash.com/photo-1559583109-3e7968136c99?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618355776464-8666794d3f5c?q=80&w=3087&auto=format&fit=crop'
  ],
  'Joggers': [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=2970&auto=format&fit=crop'
  ],
  'Denim': [
    'https://images.unsplash.com/photo-1623113562225-08abec08da21?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=3087&auto=format&fit=crop'
  ],
  'Skinny': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=2942&auto=format&fit=crop'
  ],
  'High-Rise': [
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=3087&auto=format&fit=crop'
  ],
  'Sweaters': [
    'https://images.unsplash.com/photo-1608648322835-0851ccc52cc3?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=3087&auto=format&fit=crop'
  ],
  'Cardigans': [
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=3011&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593311640936-dada12015c96?q=80&w=2865&auto=format&fit=crop'
  ],
  'Vests': [
    'https://images.unsplash.com/photo-1601593532815-932fa0e2cb67?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=3074&auto=format&fit=crop'
  ],
  'Dress': [
    'https://images.unsplash.com/photo-1574087093605-23f997e876db?q=80&w=3087&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=3087&auto=format&fit=crop'
  ],
  'Panties': [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2970&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2970&auto=format&fit=crop'
  ]
};

// Generate 40 products across different categories
export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const reviewTemplates: Omit<Review, 'id'>[] = [
    {
      user: 'Sarah M.',
      rating: 5,
      comment: "Absolutely love this piece! The quality is exceptional, and it fits perfectly. Can't wait to order more.",
      date: '2023-08-15',
      helpful: 12
    },
    {
      user: 'James T.',
      rating: 4,
      comment: "Great product overall. Material is high quality, though sizing runs a bit large. Would recommend sizing down.",
      date: '2023-09-22',
      helpful: 8
    },
    {
      user: 'Emma L.',
      rating: 5,
      comment: "The color is even more beautiful in person. Very comfortable and well-made. Shipping was fast too!",
      date: '2023-10-05',
      helpful: 15
    },
    {
      user: 'Michael K.',
      rating: 3,
      comment: "Decent product but not as pictured. The color is slightly different, and the material isn't as soft as expected.",
      date: '2023-07-30',
      helpful: 4
    },
    {
      user: 'Rebecca W.',
      rating: 5,
      comment: "This is my third purchase from this brand, and they never disappoint. Excellent craftsmanship and attention to detail.",
      date: '2023-11-12',
      helpful: 9
    },
    {
      user: 'David P.',
      rating: 2,
      comment: "Disappointed with this purchase. The stitching came loose after just two wears. Not worth the price.",
      date: '2023-06-18',
      helpful: 11
    },
    {
      user: 'Jennifer A.',
      rating: 4,
      comment: "Versatile piece that can be dressed up or down. Good value for the price, though shipping took longer than expected.",
      date: '2023-09-01',
      helpful: 6
    }
  ];

  const descriptions = [
    "This premium piece features a tailored fit with exceptional attention to detail. Crafted from high-quality materials, it offers both comfort and style for everyday wear. The versatile design transitions seamlessly from day to evening, making it a must-have addition to your wardrobe.",
    "Elevate your wardrobe with this meticulously crafted piece. The luxurious fabric drapes beautifully and features subtle detailing that sets it apart. Perfect for both casual outings and more formal occasions, this timeless design prioritizes both form and function.",
    "Designed with the modern individual in mind, this piece combines contemporary styling with timeless appeal. The innovative fabric technology offers comfort in any weather, while the thoughtful design ensures a flattering fit for all body types.",
    "This statement piece showcases exceptional craftsmanship and attention to detail. The premium materials ensure durability and comfort throughout the day. With its versatile styling options, it easily complements existing pieces in your collection.",
    "Embrace elegance with this carefully designed wardrobe essential. The premium construction and thoughtful detailing elevate it beyond the ordinary, while the comfortable fit ensures you'll reach for it again and again. It's sustainability crafted to reduce environmental impact.",
    "This sophisticated piece offers the perfect blend of comfort and style. The premium fabric has a luxurious feel against the skin, while the expert tailoring ensures a flattering silhouette. Versatile enough for multiple styling options."
  ];

  const tags = [
    "bestseller", "new arrival", "limited edition", "sustainable",
    "organic", "hand-crafted", "exclusive", "premium", "eco-friendly",
    "fair trade", "vegan", "luxury", "designer", "classic", "trending"
  ];

  // Function to get product images based on category and subcategory
  const getProductImages = (category: string, subcategory: string): string[] => {
    const images: string[] = [];
    
    // Try to get subcategory-specific images first
    if (subcategoryImages[subcategory] && subcategoryImages[subcategory].length > 0) {
      images.push(...subcategoryImages[subcategory]);
    }
    
    // Then try category images
    if (images.length < 3 && categoryImages[category] && categoryImages[category].length > 0) {
      const remainingNeeded = Math.min(3 - images.length, categoryImages[category].length);
      images.push(...categoryImages[category].slice(0, remainingNeeded));
    }
    
    // If still not enough, use backup images
    if (images.length === 0) {
      const backupImages = [
        'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=3087&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=3005&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=3870&auto=format&fit=crop'
      ];
      images.push(...backupImages);
    }
    
    return images;
  };

  // Ensure at least one product for each subcategory
  const subcategories = new Set<string>();
  categories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      subcategories.add(`${category.name}-${subcategory}`);
    });
  });

  // Generate a set number of products for each category
  categories.forEach((category) => {
    // Ensure at least one product per subcategory
    category.subcategories.forEach((subcategory) => {
      const productNumber = products.length + 1;
      
      // Generate product details
      const isFeatured = true; // Make these featured to ensure visibility
      const rating = 4 + Math.random(); // Higher rating for these key products
      const price = 29.99 + Math.floor(Math.random() * 100);
      const hasDiscount = Math.random() > 0.7;
      const oldPrice = hasDiscount ? price + 10 + Math.floor(Math.random() * 30) : undefined;
      
      // Get images for this product
      const images = getProductImages(category.name, subcategory);
      
      // Generate 2-3 random reviews
      const reviewCount = 2 + Math.floor(Math.random() * 2);
      const reviews: Review[] = [];
      
      for (let k = 0; k < reviewCount; k++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        reviews.push({
          id: `review-${products.length}-${k}`,
          ...template
        });
      }
      
      // Generate 2-4 random colors
      const colorOptions = ["Black", "White", "Navy", "Gray", "Beige", "Blue", "Red", "Green", "Purple", "Pink"];
      const colorCount = 2 + Math.floor(Math.random() * 3);
      const colors: string[] = [];
      
      for (let l = 0; l < colorCount; l++) {
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        if (!colors.includes(randomColor)) {
          colors.push(randomColor);
        }
      }
      
      // Generate sizes
      const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
      const sizeCount = 3 + Math.floor(Math.random() * 3); // 3-5 sizes
      const sizes: string[] = [];
      
      for (let m = 0; m < sizeCount; m++) {
        sizes.push(sizeOptions[m]);
      }
      
      // Generate 2-4 random tags, always include "new arrival" for subcategory products
      const productTags: string[] = ["new arrival"];
      const tagCount = 1 + Math.floor(Math.random() * 3);
      
      for (let n = 0; n < tagCount; n++) {
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        if (!productTags.includes(randomTag)) {
          productTags.push(randomTag);
        }
      }
      
      // Create the product with a more specific name
      products.push({
        id: `product-${productNumber}`,
        name: `${category.name} ${subcategory} ${productNumber}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        price: parseFloat(price.toFixed(2)),
        oldPrice: oldPrice ? parseFloat(oldPrice.toFixed(2)) : undefined,
        images,
        category: category.name,
        subcategory,
        featured: isFeatured,
        rating: parseFloat(rating.toFixed(1)),
        reviews,
        colors,
        sizes,
        tags: productTags
      });
      
      // Remove this subcategory from the set
      subcategories.delete(`${category.name}-${subcategory}`);
    });
    
    // Fill in the remaining products up to the quota
    const productsPerCategory = Math.ceil(40 / categories.length) - category.subcategories.length;
    
    for (let i = 0; i < productsPerCategory; i++) {
      if (products.length >= 40 + categories.length * category.subcategories.length) break;
      
      const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
      const productNumber = products.length + 1;
      
      // Generate random product details
      const isFeatured = Math.random() > 0.5; // 50% chance to be featured
      const rating = 3 + Math.random() * 2;
      const price = 29.99 + Math.floor(Math.random() * 100);
      const hasDiscount = Math.random() > 0.7;
      const oldPrice = hasDiscount ? price + 10 + Math.floor(Math.random() * 30) : undefined;
      
      // Get images for this product
      const images = getProductImages(category.name, subcategory);
      
      // Generate 1-4 random reviews
      const reviewCount = 1 + Math.floor(Math.random() * 3);
      const reviews: Review[] = [];
      
      for (let k = 0; k < reviewCount; k++) {
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        reviews.push({
          id: `review-${products.length}-${k}`,
          ...template
        });
      }
      
      // Generate 2-4 random colors
      const colorOptions = ["Black", "White", "Navy", "Gray", "Beige", "Blue", "Red", "Green", "Purple", "Pink"];
      const colorCount = 2 + Math.floor(Math.random() * 3);
      const colors: string[] = [];
      
      for (let l = 0; l < colorCount; l++) {
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        if (!colors.includes(randomColor)) {
          colors.push(randomColor);
        }
      }
      
      // Generate sizes
      const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
      const sizeCount = 3 + Math.floor(Math.random() * 3); // 3-5 sizes
      const sizes: string[] = [];
      
      for (let m = 0; m < sizeCount; m++) {
        sizes.push(sizeOptions[m]);
      }
      
      // Generate 2-4 random tags
      const tagCount = 2 + Math.floor(Math.random() * 3);
      const productTags: string[] = [];
      
      for (let n = 0; n < tagCount; n++) {
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        if (!productTags.includes(randomTag)) {
          productTags.push(randomTag);
        }
      }
      
      // Create the product with a more descriptive name
      const productTypes = ["Classic", "Modern", "Deluxe", "Premium", "Signature", "Essential"];
      const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
      
      products.push({
        id: `product-${productNumber}`,
        name: `${productType} ${subcategory} ${category.name}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        price: parseFloat(price.toFixed(2)),
        oldPrice: oldPrice ? parseFloat(oldPrice.toFixed(2)) : undefined,
        images,
        category: category.name,
        subcategory,
        featured: isFeatured,
        rating: parseFloat(rating.toFixed(1)),
        reviews,
        colors,
        sizes,
        tags: productTags
      });
    }
  });
  
  return products;
};

export const products = generateProducts();

// Cart functionality
export type CartItem = {
  product: Product;
  quantity: number;
  color: string;
  size: string;
};

// Function to get random featured products
export const getFeaturedProducts = (count: number): Product[] => {
  const featured = products.filter(p => p.featured);
  
  // If we don't have enough featured products, add some non-featured ones
  if (featured.length < count) {
    const nonFeatured = products.filter(p => !p.featured);
    const additional = nonFeatured.slice(0, count - featured.length);
    return [...featured, ...additional];
  }
  
  // Shuffle and return requested count
  return [...featured].sort(() => 0.5 - Math.random()).slice(0, count);
};

// User credentials for static authentication
export const userCredentials = {
  email: 'user@example.com',
  password: 'password123'
};

