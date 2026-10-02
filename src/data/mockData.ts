import { Restaurant, Voucher, LoyaltyProfile, Order } from '../types/foodDelivery';
import pizzaImg from '../assets/images/restaurant_woodfire_pizza_1790869014640.jpg';
import sushiImg from '../assets/images/restaurant_japanese_sushi_1790869027238.jpg';
import veganImg from '../assets/images/restaurant_farm_greens_1790869037574.jpg';
import heroImg from '../assets/images/hero_food_delivery_1790868999655.jpg';

export { heroImg };

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Trattoria Forno Vivo',
    tagline: 'Authentic 90-second Neapolitan wood-fired sourdough pies & handmade pasta',
    cuisine: 'Italian',
    rating: 4.9,
    reviewsCount: 382,
    deliveryTimeMin: 25,
    deliveryFee: 1.99,
    minOrder: 15,
    distanceKm: 1.8,
    priceLevel: '$$',
    image: pizzaImg,
    address: '414 Stone Street, Historic District',
    dietaryFeatures: ['vegetarian', 'halal', 'dairy-free'],
    story: 'Founded by Master Pizzaiolo Marco Bernardi. Every pie is fermented for 72 hours using ancient non-GMO grains, baked in a 900°F volcanic stone oven shipped directly from Naples.',
    chefName: 'Marco Bernardi',
    categories: ['Artisan Pizzas', 'Handcrafted Pasta', 'Antipasti & Greens', 'Dolci & Drinks'],
    menu: [
      {
        id: 'item-101',
        restaurantId: 'rest-1',
        name: 'Regina Margherita D.O.P.',
        description: 'San Marzano tomatoes, buffalo mozzarella from Campania, fresh Genovese basil, cold-pressed Sicilian olive oil on blistered crust.',
        price: 18.50,
        category: 'Artisan Pizzas',
        dietaryTags: ['vegetarian', 'halal'],
        spiceLevel: 0,
        popular: true,
        prepTimeMin: 14,
        calories: 780,
        customOptions: [
          {
            name: 'Crust Preference',
            choices: [
              { label: 'Classic 72-Hour Sourdough', priceDelta: 0 },
              { label: 'Gluten-Free Cauliflower & Rice Crust', priceDelta: 3.50 }
            ]
          },
          {
            name: 'Artisan Cheese',
            choices: [
              { label: 'Buffalo Mozzarella D.O.P.', priceDelta: 0 },
              { label: 'House Cashew Mozzarella (Dairy-Free)', priceDelta: 2.00 },
              { label: 'Extra Stracciatella Cream Center', priceDelta: 3.00 }
            ]
          }
        ]
      },
      {
        id: 'item-102',
        restaurantId: 'rest-1',
        name: 'Tartufo & Wild Forest Porcini',
        description: 'Black summer truffle carpaccio, sautéed porcini mushrooms, Fior di Latte, thyme, and organic white truffle blossom drizzle.',
        price: 22.00,
        category: 'Artisan Pizzas',
        dietaryTags: ['vegetarian'],
        spiceLevel: 0,
        popular: true,
        prepTimeMin: 16,
        calories: 890
      },
      {
        id: 'item-103',
        restaurantId: 'rest-1',
        name: 'Cacio e Pepe Al Tartufo',
        description: 'Hand-extruded tonnarelli, 24-month aged Pecorino Romano, crushed Tellicherry black peppercorns, infused with black truffle butter.',
        price: 19.50,
        category: 'Handcrafted Pasta',
        dietaryTags: ['vegetarian'],
        spiceLevel: 1,
        popular: false,
        prepTimeMin: 15,
        calories: 710
      },
      {
        id: 'item-104',
        restaurantId: 'rest-1',
        name: 'Burrata Pugliese con Fichi',
        description: 'Creamy fresh burrata bulb, black mission figs, wild baby arugula, aged balsamic reduction, grilled sourdough crostini.',
        price: 15.00,
        category: 'Antipasti & Greens',
        dietaryTags: ['vegetarian', 'gluten-free'],
        spiceLevel: 0,
        popular: false,
        prepTimeMin: 8,
        calories: 490
      },
      {
        id: 'item-105',
        restaurantId: 'rest-1',
        name: 'Tiramisu Tradizionale',
        description: 'Espresso-soaked savoiardi ladyfingers layered with velvety zabaglione mascarpone and Valrhona cocoa dust.',
        price: 9.00,
        category: 'Dolci & Drinks',
        dietaryTags: ['vegetarian'],
        spiceLevel: 0,
        popular: true,
        prepTimeMin: 5,
        calories: 420
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        restaurantId: 'rest-1',
        author: 'Elena Vance',
        authorLocation: 'Downtown',
        rating: 5,
        date: 'Yesterday',
        dishRecommended: 'Regina Margherita D.O.P.',
        comment: 'Without exaggeration, the best crust in the city. Arrived steaming hot in ventilated compostable boxes, the crust still had that signature wood-fired blister and crunch.',
        tags: ['Crispy Crust', 'Hot On Arrival', 'Eco Packaging'],
        helpfulCount: 24,
        verifiedOrder: true
      },
      {
        id: 'rev-2',
        restaurantId: 'rest-1',
        author: 'Liam Chen',
        authorLocation: 'Riverside',
        rating: 5,
        date: '3 days ago',
        dishRecommended: 'Tartufo & Wild Forest Porcini',
        comment: 'The truffle aroma filled the room immediately. Truly authentic Italian craftsmanship, well worth the price.',
        tags: ['Gourmet', 'Aromatic', 'Fast Delivery'],
        helpfulCount: 16,
        verifiedOrder: true
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Kuroshio Omakase & Raw Bar',
    tagline: 'Sustainable wild-caught Tokyo sashimi & pressed warm-rice nigiri',
    cuisine: 'Japanese',
    rating: 4.95,
    reviewsCount: 512,
    deliveryTimeMin: 30,
    deliveryFee: 2.49,
    minOrder: 25,
    distanceKm: 2.4,
    priceLevel: '$$$',
    image: sushiImg,
    address: '88 Waterfront Esplanade',
    dietaryFeatures: ['gluten-free', 'dairy-free', 'keto', 'halal'],
    story: 'Chef Kenji Sato sources certified line-caught tuna and wild salmon flown directly from Hokkaido. We season our Akasu red vinegar rice to body temperature for supreme umami.',
    chefName: 'Kenji Sato',
    categories: ['Omakase Flights', 'Signature Rolls', 'Robata & Warm Bites', 'Matcha Desserts'],
    menu: [
      {
        id: 'item-201',
        restaurantId: 'rest-2',
        name: 'Kuroshio Master Sashimi Flight (12 pcs)',
        description: 'Bluefin Otoro, Ora King Salmon, Yellowtail Hamachi, and Shima Aji. Served with freshly grated Shizuoka wasabi and tamari soy.',
        price: 36.00,
        category: 'Omakase Flights',
        dietaryTags: ['gluten-free', 'dairy-free', 'keto', 'halal'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 18,
        calories: 460,
        customOptions: [
          {
            name: 'Soy Sauce',
            choices: [
              { label: 'House Brewed Smoked Tamari (Gluten-Free)', priceDelta: 0 },
              { label: 'Low Sodium Soy', priceDelta: 0 },
              { label: 'Coconut Aminos (Soy-Free)', priceDelta: 1.00 }
            ]
          }
        ]
      },
      {
        id: 'item-202',
        restaurantId: 'rest-2',
        name: 'Truffle Salmon Aburi Roll',
        description: 'Torched king salmon, avocado, cucumber, unagi reduction, micro shiso, and light white truffle oil crunch.',
        price: 21.00,
        category: 'Signature Rolls',
        dietaryTags: ['dairy-free'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 15,
        calories: 520
      },
      {
        id: 'item-203',
        restaurantId: 'rest-2',
        name: 'Miso Black Cod with Ginger Glaze',
        description: 'Sustainably caught Alaskan black cod marinated for 48 hours in Saikyo sweet white miso, charred over binchotan charcoal.',
        price: 28.50,
        category: 'Robata & Warm Bites',
        dietaryTags: ['gluten-free', 'dairy-free', 'halal'],
        spiceLevel: 0,
        popular: true,
        prepTimeMin: 20,
        calories: 590
      },
      {
        id: 'item-204',
        restaurantId: 'rest-2',
        name: 'Edamame with Smoked Sea Salt',
        description: 'Steamed organic non-GMO soy pods tossed in Okinawa smoked sea salt and toasted sesame oil.',
        price: 7.50,
        category: 'Robata & Warm Bites',
        dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher'],
        spiceLevel: 0,
        popular: false,
        prepTimeMin: 6,
        calories: 180
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        restaurantId: 'rest-2',
        author: 'Julian Thorne',
        authorLocation: 'South Bay',
        rating: 5,
        date: '2 days ago',
        dishRecommended: 'Kuroshio Master Sashimi Flight',
        comment: 'Freshness on par with high-end Ginza counters. They pack the cold items in thermal insulated packs with dry-gel pads so the fish stays chilled and rice stays soft.',
        tags: ['Pristine Freshness', 'Thermal Packaging', 'Five Star'],
        helpfulCount: 31,
        verifiedOrder: true
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Botanica Green Kitchen',
    tagline: '100% Plant-forward organic bowls, warm roasted grains & elixir tonics',
    cuisine: 'Plant-Forward',
    rating: 4.88,
    reviewsCount: 290,
    deliveryTimeMin: 20,
    deliveryFee: 1.49,
    minOrder: 12,
    distanceKm: 1.2,
    priceLevel: '$',
    image: veganImg,
    address: '15 Pine & Willow Lane',
    dietaryFeatures: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'organic', 'halal', 'kosher'],
    story: 'We partner directly with 9 local organic farms within a 40-mile radius. Zero refined sugar, zero seed oils, and 100% compostable fiber containers.',
    chefName: 'Camilla Rios',
    categories: ['Nourish Bowls', 'Warm Broths & Soups', 'Raw Treats & Elixirs'],
    menu: [
      {
        id: 'item-301',
        restaurantId: 'rest-3',
        name: 'Golden Harvest Buddha Bowl',
        description: 'Hass avocado, roasted maple sweet potato wedges, turmeric-spiced chickpeas, massaged lacinato kale, red quinoa, and citrus tahini drizzle.',
        price: 16.50,
        category: 'Nourish Bowls',
        dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher'],
        spiceLevel: 0,
        popular: true,
        prepTimeMin: 12,
        calories: 540,
        customOptions: [
          {
            name: 'Protein Boost',
            choices: [
              { label: 'Organic Crispy Tofu', priceDelta: 0 },
              { label: 'Hemp Seed & Pumpkin Seed Crunch', priceDelta: 1.50 },
              { label: 'Double Avocado Scoop', priceDelta: 2.50 }
            ]
          },
          {
            name: 'Dressing',
            choices: [
              { label: 'Lemon Garlic Tahini', priceDelta: 0 },
              { label: 'Spicy Ginger Miso', priceDelta: 0 },
              { label: 'Green Goddess Herb', priceDelta: 0 }
            ]
          }
        ]
      },
      {
        id: 'item-302',
        restaurantId: 'rest-3',
        name: 'Green Goddess Sprouted Falafel Bowl',
        description: 'Herbed sprouted chickpea falafel balls, pickled sumac onions, Persian cucumbers, heirloom cherry tomatoes, wild mint, and warm zaatar pita.',
        price: 15.50,
        category: 'Nourish Bowls',
        dietaryTags: ['vegan', 'vegetarian', 'dairy-free', 'halal', 'kosher'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 11,
        calories: 510
      },
      {
        id: 'item-303',
        restaurantId: 'rest-3',
        name: 'Roasted Butternut Squash & Ginger Soup',
        description: 'Velvety roasted squash slow-simmered with organic coconut cream, lemongrass, ginger, and roasted pumpkin seed oil.',
        price: 10.00,
        category: 'Warm Broths & Soups',
        dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'keto'],
        spiceLevel: 0,
        popular: false,
        prepTimeMin: 8,
        calories: 320
      },
      {
        id: 'item-304',
        restaurantId: 'rest-3',
        name: 'Cold-Pressed Golden Turmeric Elixir (12oz)',
        description: 'Fresh pressed ginger root, Peruvian turmeric, Valencia orange, Meyer lemon, and a touch of black pepper for bioavailability.',
        price: 7.00,
        category: 'Raw Treats & Elixirs',
        dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'halal', 'kosher'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 4,
        calories: 90
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        restaurantId: 'rest-3',
        author: 'Maya S.',
        authorLocation: 'Midtown',
        rating: 5,
        date: '4 days ago',
        dishRecommended: 'Golden Harvest Buddha Bowl',
        comment: 'As someone with strict celiac and dairy intolerance, Botanica is my holy grail. The food leaves you feeling energized, clean, and satisfied.',
        tags: ['100% Celiac Safe', 'Clean Energy', 'Generous Portions'],
        helpfulCount: 19,
        verifiedOrder: true
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Mezcal & Masa Taqueria',
    tagline: 'Oaxacan heirloom blue corn tacos, slow-braised meats & handmade salsas',
    cuisine: 'Mexican',
    rating: 4.82,
    reviewsCount: 340,
    deliveryTimeMin: 22,
    deliveryFee: 1.99,
    minOrder: 15,
    distanceKm: 2.1,
    priceLevel: '$$',
    image: heroImg, // Rich spread
    address: '220 Mission Boulevard',
    dietaryFeatures: ['gluten-free', 'halal', 'dairy-free', 'keto'],
    story: 'All tortillas are pressed fresh to order using heirloom Oaxacan corn nixtamalized in-house every morning. Our birria is slow-simmered for 14 hours with cinnamon and guajillo chilies.',
    chefName: 'Mateo Morales',
    categories: ['Tacos & Platillos', 'Sides & Dips', 'Bebidas'],
    menu: [
      {
        id: 'item-401',
        restaurantId: 'rest-4',
        name: 'Birria de Res Tacos con Consomé (Trio)',
        description: 'Three crisp-grilled corn tortillas dipped in chili oil, filled with tender shredded beef brisket, melted queso Oaxaca, cilantro, and rich dipping consomé.',
        price: 17.00,
        category: 'Tacos & Platillos',
        dietaryTags: ['gluten-free', 'halal'],
        spiceLevel: 2,
        popular: true,
        prepTimeMin: 14,
        calories: 720
      },
      {
        id: 'item-402',
        restaurantId: 'rest-4',
        name: 'Charred Poblano & Mushroom Al Pastor',
        description: 'Achiote-marinated portobello mushrooms, grilled sweet pineapple, white onion, cilantro, and avocado crema on warm blue corn tortillas.',
        price: 15.00,
        category: 'Tacos & Platillos',
        dietaryTags: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'halal'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 12,
        calories: 480
      },
      {
        id: 'item-403',
        restaurantId: 'rest-4',
        name: 'Molcajete Guacamole & Blue Corn Chips',
        description: 'Crushed ripe avocados, charred serrano peppers, lime juice, sea salt, cotija crumbles, and warm hand-cut tortilla chips.',
        price: 11.50,
        category: 'Sides & Dips',
        dietaryTags: ['vegetarian', 'gluten-free', 'halal'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 6,
        calories: 450
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        restaurantId: 'rest-4',
        author: 'Carlos G.',
        authorLocation: 'Eastside',
        rating: 5,
        date: '5 days ago',
        dishRecommended: 'Birria de Res Tacos con Consomé',
        comment: 'The consomé was still steaming hot and the tacos stayed crisp in their foil insulation! Best authentic birria in town.',
        tags: ['Crispy & Juicy', 'Authentic Flavors', 'Hot Delivery'],
        helpfulCount: 22,
        verifiedOrder: true
      }
    ]
  },
  {
    id: 'rest-5',
    name: 'Silk Road Tandoor & Curries',
    tagline: 'Clay-oven specialties, fragrant slow-simmered gravies & warm naan',
    cuisine: 'Indian',
    rating: 4.87,
    reviewsCount: 420,
    deliveryTimeMin: 28,
    deliveryFee: 2.29,
    minOrder: 18,
    distanceKm: 3.1,
    priceLevel: '$$',
    image: heroImg,
    address: '77 Spice Quarter Road',
    dietaryFeatures: ['halal', 'vegetarian', 'vegan', 'gluten-free', 'nut-free'],
    story: 'Recipes handed down over three generations from Old Delhi. We grind our garam masalas daily and use 100% Halal certified poultry and dairy from grass-fed cows.',
    chefName: 'Priya Sharma',
    categories: ['Tandoor Specialties', 'Royal Curries', 'Fresh Breads & Rice'],
    menu: [
      {
        id: 'item-501',
        restaurantId: 'rest-5',
        name: 'Murgh Makhani (Butter Chicken)',
        description: 'Tandoor-charred chicken breast steeped in a velvety tomato, fenugreek, and cultured butter reduction. Served with basmati pilaf.',
        price: 19.00,
        category: 'Royal Curries',
        dietaryTags: ['halal', 'gluten-free'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 16,
        calories: 760
      },
      {
        id: 'item-502',
        restaurantId: 'rest-5',
        name: 'Palak Paneer (Grass-Fed Cottage Cheese)',
        description: 'Fresh house-made paneer cubes gently simmered in spiced creamed spinach, ginger, garlic, and freshly toasted cumin seeds.',
        price: 17.50,
        category: 'Royal Curries',
        dietaryTags: ['vegetarian', 'halal', 'gluten-free'],
        spiceLevel: 1,
        popular: true,
        prepTimeMin: 15,
        calories: 620
      },
      {
        id: 'item-503',
        restaurantId: 'rest-5',
        name: 'Garlic & Coriander Tandoori Naan',
        description: 'Fluffy clay-oven leavened bread brushed with garlic-infused ghee and garden coriander.',
        price: 4.50,
        category: 'Fresh Breads & Rice',
        dietaryTags: ['vegetarian', 'halal'],
        spiceLevel: 0,
        popular: true,
        prepTimeMin: 6,
        calories: 280
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        restaurantId: 'rest-5',
        author: 'Amina K.',
        authorLocation: 'North Park',
        rating: 5,
        date: '1 week ago',
        dishRecommended: 'Murgh Makhani (Butter Chicken)',
        comment: 'Certified Halal and exceptionally rich flavor. Naan arrived warm and pillowy. Highly recommended.',
        tags: ['Halal Certified', 'Warm Bread', 'Generous Portions'],
        helpfulCount: 14,
        verifiedOrder: true
      }
    ]
  }
];

export const INITIAL_LOYALTY_VOUCHERS: Voucher[] = [
  {
    id: 'vouch-1',
    code: 'SAVOR5OFF',
    title: '$5 Off Any Order',
    description: 'Valid on any order of $20 or more across all local eateries.',
    discountAmount: 5.00,
    minOrder: 20.00,
    pointsCost: 250,
    expiresAt: 'In 30 days',
    redeemed: false
  },
  {
    id: 'vouch-2',
    code: 'FREESHIP26',
    title: 'Free Delivery Pass ($0 Delivery Fee)',
    description: 'Waives delivery fee completely on your next order.',
    discountAmount: 3.50,
    minOrder: 15.00,
    pointsCost: 350,
    expiresAt: 'In 45 days',
    redeemed: false
  },
  {
    id: 'vouch-3',
    code: 'CHEF15',
    title: '$15 Gourmet Tasting Credit',
    description: 'Exclusive credit for orders over $45. Treat yourself to chef specials.',
    discountAmount: 15.00,
    minOrder: 45.00,
    pointsCost: 700,
    expiresAt: 'In 60 days',
    redeemed: false
  },
  {
    id: 'vouch-4',
    code: 'APPETIZER25',
    title: 'Free Signature Appetizer',
    description: 'Enjoy complimentary burrata, edamame, or chips & guac on orders over $30.',
    discountAmount: 10.00,
    minOrder: 30.00,
    pointsCost: 450,
    expiresAt: 'In 30 days',
    redeemed: false
  }
];

export const INITIAL_LOYALTY_PROFILE: LoyaltyProfile = {
  points: 620,
  lifetimePoints: 1480,
  tier: 'Silver',
  nextTierPoints: 1500, // For Gold
  activeVouchers: [
    {
      id: 'vouch-welcome',
      code: 'WELCOME5',
      title: '$5 Welcome Gift',
      description: 'Your bonus perk for joining SavorClub.',
      discountAmount: 5.00,
      minOrder: 20.00,
      pointsCost: 0,
      expiresAt: 'In 14 days',
      redeemed: false
    }
  ],
  history: [
    {
      id: 'hist-1',
      description: 'Welcome Bonus: Joined SavorClub',
      pointsChange: +200,
      date: 'Sep 15, 2026'
    },
    {
      id: 'hist-2',
      description: 'Order #SL-8842: Trattoria Forno Vivo',
      pointsChange: +380,
      date: 'Sep 22, 2026',
      orderId: 'SL-8842'
    },
    {
      id: 'hist-3',
      description: 'Verified Review Bonus: +40 pts',
      pointsChange: +40,
      date: 'Sep 23, 2026'
    }
  ]
};

export const INITIAL_ACTIVE_ORDER: Order = {
  id: 'order-live-101',
  orderNumber: 'SL-9402',
  items: [
    {
      id: 'cart-init-1',
      menuItem: INITIAL_RESTAURANTS[0].menu[0], // Regina Margherita
      restaurantId: 'rest-1',
      restaurantName: 'Trattoria Forno Vivo',
      quantity: 1,
      selectedOptions: {
        'Crust Preference': 'Classic 72-Hour Sourdough',
        'Artisan Cheese': 'Buffalo Mozzarella D.O.P.'
      },
      specialInstructions: 'Extra crispy blistered crust please!',
      itemTotal: 18.50
    },
    {
      id: 'cart-init-2',
      menuItem: INITIAL_RESTAURANTS[0].menu[3], // Burrata Pugliese
      restaurantId: 'rest-1',
      restaurantName: 'Trattoria Forno Vivo',
      quantity: 1,
      selectedOptions: {},
      specialInstructions: '',
      itemTotal: 15.00
    }
  ],
  restaurant: INITIAL_RESTAURANTS[0],
  subtotal: 33.50,
  deliveryFee: 1.99,
  serviceFee: 2.50,
  tip: 5.00,
  discount: 5.00,
  voucherCode: 'WELCOME5',
  total: 37.99,
  status: 'on_the_way',
  createdAt: '18 minutes ago',
  estimatedDeliveryMinutes: 7,
  deliveryAddress: '742 Evergreen Terrace, Apt 4B',
  driver: {
    name: 'Alex Rivera',
    phone: '+1 (555) 234-9821',
    vehicle: 'Eco Electric E-Bike (Midnight Black)',
    plate: 'NY-882E',
    rating: 4.96,
    deliveriesCount: 1420,
    avatar: 'AR'
  },
  paymentMethod: 'apple_pay',
  paymentDetails: {
    method: 'apple_pay',
    cardLast4: '4242',
    is3DSecureVerified: true
  },
  notes: 'Leave at front door and ring doorbell once',
  courierLocationPercent: 68
};
