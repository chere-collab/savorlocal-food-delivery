export type DietaryPreference = 
  | 'all'
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'halal'
  | 'kosher'
  | 'dairy-free'
  | 'nut-free'
  | 'keto'
  | 'organic';

export type CuisineType = 
  | 'All Cuisines'
  | 'Italian'
  | 'Japanese'
  | 'Plant-Forward'
  | 'Mexican'
  | 'Indian'
  | 'Artisan Bakery'
  | 'Mediterranean';

export interface CustomOption {
  name: string;
  choices: { label: string; priceDelta: number }[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  dietaryTags: DietaryPreference[];
  spiceLevel: 0 | 1 | 2 | 3;
  popular?: boolean;
  prepTimeMin: number;
  customOptions?: CustomOption[];
  calories?: number;
}

export interface RestaurantReview {
  id: string;
  restaurantId: string;
  author: string;
  authorLocation: string;
  rating: number;
  date: string;
  dishRecommended: string;
  comment: string;
  tags: string[];
  helpfulCount: number;
  verifiedOrder: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: CuisineType;
  rating: number;
  reviewsCount: number;
  deliveryTimeMin: number;
  deliveryFee: number;
  minOrder: number;
  distanceKm: number;
  priceLevel: '$' | '$$' | '$$$';
  image: string;
  address: string;
  dietaryFeatures: DietaryPreference[];
  story: string;
  chefName: string;
  menu: MenuItem[];
  categories: string[];
  reviews: RestaurantReview[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  specialInstructions: string;
  itemTotal: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';

export interface DriverInfo {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  deliveriesCount: number;
  avatar: string;
}

export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'google_pay' | 'savor_wallet' | 'cash_on_delivery';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardLast4?: string;
  walletPointsUsed?: number;
  is3DSecureVerified?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  restaurant: Restaurant;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  discount: number;
  voucherCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  deliveryAddress: string;
  driver: DriverInfo;
  paymentMethod: PaymentMethodType;
  paymentDetails: PaymentDetails;
  notes?: string;
  courierLocationPercent: number; // 0 to 100 for tracking animation
  deliveredAt?: string;
}

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountAmount: number;
  minOrder: number;
  pointsCost: number;
  expiresAt: string;
  redeemed?: boolean;
}

export interface PointsHistoryItem {
  id: string;
  description: string;
  pointsChange: number;
  date: string;
  orderId?: string;
}

export interface LoyaltyProfile {
  points: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  nextTierPoints: number;
  activeVouchers: Voucher[];
  history: PointsHistoryItem[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'loyalty' | 'promotion' | 'review_prompt';
  timestamp: string;
  read: boolean;
  orderId?: string;
}
