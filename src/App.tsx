/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Heart, Clock, Utensils, 
  Compass, Navigation, Award, Database, Search, ArrowRight 
} from 'lucide-react';
import { 
  Restaurant, MenuItem, CartItem, Order, OrderStatus, 
  DietaryPreference, CuisineType, Voucher, LoyaltyProfile, 
  RestaurantReview, AppNotification 
} from './types/foodDelivery';
import { 
  INITIAL_RESTAURANTS, INITIAL_ACTIVE_ORDER, 
  INITIAL_LOYALTY_PROFILE, heroImg 
} from './data/mockData';
import { Header } from './components/Header';
import { DietaryCuisineFilter } from './components/DietaryCuisineFilter';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTracking } from './components/LiveOrderTracking';
import { LoyaltyProgramView } from './components/LoyaltyProgramView';
import { NotificationCenter } from './components/NotificationCenter';
import { ReviewModal } from './components/ReviewModal';
import { DatabaseRecommendationModal } from './components/DatabaseRecommendationModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { soundManager } from './utils/soundEffects';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'explore' | 'tracking' | 'loyalty' | 'architecture'>('explore');

  // Restaurant Catalog & Filtering State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>('All Cuisines');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'speed' | 'fee'>('recommended');
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number | null>(null);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<string | null>(null);

  // Cart & Checkout
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Live Order State (Defaults to rich active order demo)
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ACTIVE_ORDER);

  // Loyalty Rewards
  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile>(INITIAL_LOYALTY_PROFILE);
  const [activeVouchers, setActiveVouchers] = useState<Voucher[]>(INITIAL_LOYALTY_PROFILE.activeVouchers);

  // Reviews Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetRestaurant, setReviewTargetRestaurant] = useState<Restaurant | null>(null);

  // Architecture modal
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  // APK Download & Install modal
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Push Notifications
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Courier on the Move 🚴',
      message: 'Alex Rivera is 7 minutes away from 742 Evergreen Terrace with your Trattoria order.',
      type: 'order',
      timestamp: '2m ago',
      read: false,
      orderId: 'order-live-101'
    },
    {
      id: 'notif-2',
      title: 'SavorClub Silver Perk 🎁',
      message: 'You have unlocked 1.25x points multiplier on all weekend orders!',
      type: 'loyalty',
      timestamp: '1h ago',
      read: true
    }
  ]);

  const sendNotification = (title: string, message: string, type: 'order' | 'loyalty', orderId?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      orderId
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Send native system browser push if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } catch {
        // Ignore
      }
    }
  };

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => 
        i.menuItem.id === item.menuItem.id && 
        JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
      );
      if (existing) {
        return prev.map(i => 
          i.id === existing.id 
            ? { ...i, quantity: i.quantity + item.quantity, itemTotal: (i.quantity + item.quantity) * (i.itemTotal / i.quantity) }
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        const unitPrice = item.itemTotal / item.quantity;
        return {
          ...item,
          quantity: newQty,
          itemTotal: newQty * unitPrice
        };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedVoucher(null);
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCartItems([]);
    setAppliedVoucher(null);
    setActiveTab('tracking');

    // Add points for order: 10 pts per $1 spent
    const earnedPoints = Math.round(newOrder.subtotal * 10);
    setLoyaltyProfile(prev => ({
      ...prev,
      points: prev.points + earnedPoints,
      lifetimePoints: prev.lifetimePoints + earnedPoints,
      history: [
        {
          id: `hist-${Date.now()}`,
          description: `Order #${newOrder.orderNumber}: ${newOrder.restaurant.name}`,
          pointsChange: +earnedPoints,
          date: 'Just now',
          orderId: newOrder.orderNumber
        },
        ...prev.history
      ]
    }));

    sendNotification(
      'Order Confirmed 🎉',
      `Your order #${newOrder.orderNumber} has been received by ${newOrder.restaurant.name}. You earned +${earnedPoints} SavorClub points!`,
      'order',
      newOrder.id
    );
  };

  // Update order status from tracking simulation
  const handleUpdateOrderStatus = (status: OrderStatus, progressPercent: number) => {
    if (!activeOrder) return;
    setActiveOrder({
      ...activeOrder,
      status,
      courierLocationPercent: progressPercent
    });
  };

  // Reset live order
  const handleResetOrder = () => {
    setActiveOrder(INITIAL_ACTIVE_ORDER);
    soundManager.playNotification();
  };

  // Loyalty: Redeem voucher
  const handleRedeemVoucher = (voucher: Voucher) => {
    setLoyaltyProfile(prev => ({
      ...prev,
      points: prev.points - voucher.pointsCost,
      history: [
        {
          id: `hist-redeem-${Date.now()}`,
          description: `Redeemed Voucher: ${voucher.title}`,
          pointsChange: -voucher.pointsCost,
          date: 'Just now'
        },
        ...prev.history
      ]
    }));

    const claimedVoucher: Voucher = {
      ...voucher,
      id: `claimed-${Date.now()}`
    };

    setActiveVouchers(prev => [claimedVoucher, ...prev]);

    sendNotification(
      'Voucher Unlocked 🎁',
      `You redeemed ${voucher.pointsCost} points for ${voucher.title}. Code: ${voucher.code}`,
      'loyalty'
    );
  };

  const handleApplyVoucherToCart = (voucher: Voucher) => {
    setAppliedVoucher(voucher);
    setIsCartOpen(true);
    soundManager.playCartAdd();
  };

  const handleDeductPoints = (points: number, reason: string) => {
    setLoyaltyProfile(prev => ({
      ...prev,
      points: Math.max(0, prev.points - points),
      history: [
        {
          id: `hist-deduct-${Date.now()}`,
          description: reason,
          pointsChange: -points,
          date: 'Just now'
        },
        ...prev.history
      ]
    }));
  };

  // Reviews submission
  const handleSubmitReview = (review: RestaurantReview, bonusPoints: number) => {
    // Update restaurant rating and reviews list
    setRestaurants(prev => prev.map(r => {
      if (r.id === review.restaurantId) {
        const updatedReviews = [review, ...r.reviews];
        const newAvg = updatedReviews.reduce((s, rev) => s + rev.rating, 0) / updatedReviews.length;
        return {
          ...r,
          rating: parseFloat(newAvg.toFixed(2)),
          reviewsCount: r.reviewsCount + 1,
          reviews: updatedReviews
        };
      }
      return r;
    }));

    // Credit loyalty points
    setLoyaltyProfile(prev => ({
      ...prev,
      points: prev.points + bonusPoints,
      lifetimePoints: prev.lifetimePoints + bonusPoints,
      history: [
        {
          id: `hist-rev-${Date.now()}`,
          description: `Review Bonus: Verified Diner Feedback (+${bonusPoints} pts)`,
          pointsChange: +bonusPoints,
          date: 'Just now'
        },
        ...prev.history
      ]
    }));

    sendNotification(
      'Review Published (+50 pts) 🌟',
      `Thank you for reviewing! Your feedback has been verified and +50 points added to your balance.`,
      'loyalty'
    );
  };

  // Filter restaurants by dietary, cuisine, search query, max time, price
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      // Dietary filter
      if (selectedDietary !== 'all') {
        const matchesDietary = restaurant.dietaryFeatures.includes(selectedDietary) ||
          restaurant.menu.some(item => item.dietaryTags.includes(selectedDietary));
        if (!matchesDietary) return false;
      }

      // Cuisine filter
      if (selectedCuisine !== 'All Cuisines') {
        if (restaurant.cuisine !== selectedCuisine) return false;
      }

      // Max Delivery Time
      if (maxDeliveryTime !== null) {
        if (restaurant.deliveryTimeMin > maxDeliveryTime) return false;
      }

      // Price Level
      if (selectedPriceLevel !== null) {
        if (restaurant.priceLevel !== selectedPriceLevel) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesTagline = restaurant.tagline.toLowerCase().includes(query);
        const matchesCuisine = restaurant.cuisine.toLowerCase().includes(query);
        const matchesDish = restaurant.menu.some(m => 
          m.name.toLowerCase().includes(query) || 
          m.description.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesTagline && !matchesCuisine && !matchesDish) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'speed') return a.deliveryTimeMin - b.deliveryTimeMin;
      if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee;
      return 0; // recommended order
    });
  }, [restaurants, selectedDietary, selectedCuisine, searchQuery, maxDeliveryTime, selectedPriceLevel, sortBy]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#ededf0] flex flex-col antialiased">
      
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        activeOrder={activeOrder}
        loyaltyProfile={loyaltyProfile}
        unreadNotificationsCount={unreadNotificationsCount}
        setIsNotificationOpen={setIsNotificationOpen}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 1: Explore & Curated Eateries */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            
            {/* Storefront Hero with 16:9 Image Backdrop */}
            <section className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl min-h-[300px] sm:min-h-[340px] flex items-end p-6 sm:p-10">
              <img
                src={heroImg}
                alt="Artisanal food delivery"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-40 brightness-75 scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/70 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artisan Neighborhood Kitchens</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400">Zero Ghost Franchises</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                  Masterful Local Flavors, Tracked to Your Door.
                </h1>

                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                  Connect directly with independent culinary masters. Real-time GPS courier telemetry, transparent dietary verification, and rewarding your loyalty with every bite.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('search-filters');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-tight transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>Browse Dietary Menus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsArchModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>Database Architecture Guide</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Dietary Preferences & Search Filter Hub */}
            <section id="search-filters" className="space-y-4">
              <DietaryCuisineFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDietary={selectedDietary}
                setSelectedDietary={setSelectedDietary}
                selectedCuisine={selectedCuisine}
                setSelectedCuisine={setSelectedCuisine}
                sortBy={sortBy}
                setSortBy={setSortBy}
                maxDeliveryTime={maxDeliveryTime}
                setMaxDeliveryTime={setMaxDeliveryTime}
                selectedPriceLevel={selectedPriceLevel}
                setSelectedPriceLevel={setSelectedPriceLevel}
              />
            </section>

            {/* Restaurant Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-white">
                    Featured Artisan Kitchens
                  </h2>
                  <span className="text-xs text-zinc-500 tabular-nums-custom">
                    ({filteredRestaurants.length} available)
                  </span>
                </div>
                
                {selectedDietary !== 'all' && (
                  <span className="text-xs text-amber-400 font-medium capitalize">
                    Filtering: {selectedDietary} safe
                  </span>
                )}
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Utensils className="w-12 h-12 text-zinc-700 mx-auto" />
                  <h3 className="font-display text-base font-bold text-zinc-300">
                    No kitchens match your exact filter combination
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Try switching dietary preferences or removing delivery speed limits to explore more neighborhood eateries.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDietary('all');
                      setSelectedCuisine('All Cuisines');
                      setSearchQuery('');
                      setMaxDeliveryTime(null);
                      setSelectedPriceLevel(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onSelect={(rest) => setSelectedRestaurant(rest)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Trust & Craftsmanship Proof Banner */}
            <section className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Real-Time Telemetry</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Zero guesswork. Watch your eco-courier navigate live on vector GPS city maps with precision countdowns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Verified Dietary Traceability</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Clear ingredient sourcing for Vegan, Halal, Celiac Gluten-Free, Kosher, and Allergen-sensitive dining.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">SavorClub Rewards</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Earn 10–20 pts per $1 spent. Redeem for instant meal discounts, free artisan appetizers, and $0 delivery.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: Real-Time Order Tracking */}
        {activeTab === 'tracking' && (
          <LiveOrderTracking
            order={activeOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenReviewModal={() => {
              if (activeOrder) {
                setReviewTargetRestaurant(activeOrder.restaurant);
                setIsReviewModalOpen(true);
              }
            }}
            onResetOrder={handleResetOrder}
            onSendNotification={sendNotification}
          />
        )}

        {/* VIEW 3: SavorClub Loyalty Program */}
        {activeTab === 'loyalty' && (
          <LoyaltyProgramView
            loyaltyProfile={loyaltyProfile}
            onRedeemVoucher={handleRedeemVoucher}
            onApplyVoucherToCart={handleApplyVoucherToCart}
            activeVouchers={activeVouchers}
          />
        )}

        {/* VIEW 4: Database Architecture Blueprint */}
        {activeTab === 'architecture' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    Database Architecture & Technology Recommendations
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Comprehensive technical blueprint addressing real-time GPS telemetry, ACID order integrity, and loyalty ledgers.
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                You asked: <em>"Are there any specific database technologies you recommend for this project?"</em>
                <br /><br />
                Yes. For a production food delivery platform with live order tracking, secure payment processing, push notifications, and loyalty points, the industry best practice is a <strong>Hybrid Dual-Engine Architecture</strong>:
              </p>

              <button
                onClick={() => setIsArchModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
              >
                Open Interactive Architecture & Schema Blueprint
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Active Delivery Status Bar (If user is browsing restaurants while an order is active) */}
      {activeOrder && activeOrder.status !== 'delivered' && activeTab !== 'tracking' && (
        <aside 
          aria-label="Active delivery tracker"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 p-3.5 rounded-2xl bg-[#12141c]/95 border border-amber-500/50 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#12141c]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                <span>{activeOrder.restaurant.name}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-amber-400 font-mono">{activeOrder.estimatedDeliveryMinutes}m ETA</span>
              </div>
              <p className="text-[11px] text-zinc-400 capitalize">
                {activeOrder.status.replace('_', ' ')} · {activeOrder.driver.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tracking')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Track
          </button>
        </aside>
      )}

      {/* Modals & Slide-overs */}
      
      {/* 1. Restaurant Detail Modal */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onAddToCart={handleAddToCart}
          onOpenReviewModal={(rest) => {
            setReviewTargetRestaurant(rest);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedVoucher={appliedVoucher}
        onApplyVoucher={setAppliedVoucher}
        loyaltyProfile={loyaltyProfile}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedVoucher={appliedVoucher}
        loyaltyProfile={loyaltyProfile}
        onOrderPlaced={handleOrderPlaced}
        onDeductPoints={handleDeductPoints}
      />

      {/* 4. Review & Ratings Modal */}
      {isReviewModalOpen && reviewTargetRestaurant && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          restaurant={reviewTargetRestaurant}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* 5. Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectNotificationOrder={() => setActiveTab('tracking')}
      />

      {/* 6. Database Recommendation Modal */}
      <DatabaseRecommendationModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* 7. APK Download & Install Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#090a0d] py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SavorLocal. Handcrafted neighborhood culinary delivery.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <ThemeSwitcher showLabel={true} />
            <span>·</span>
            <button onClick={() => setIsApkModalOpen(true)} className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium">
              📱 Download APK / Install
            </button>
            <span>·</span>
            <button onClick={() => setIsArchModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Database Specs
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('loyalty')} className="hover:text-white transition-colors cursor-pointer">
              SavorClub Perks
            </button>
            <span>·</span>
            <span className="text-zinc-600">PCI-DSS Tier 1 Encrypted</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
