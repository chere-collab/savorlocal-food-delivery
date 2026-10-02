import React, { useState } from 'react';
import { 
  X, Star, Clock, MapPin, ChefHat, Plus, Minus, Check, MessageSquare, 
  Flame, Leaf, ShieldCheck, Heart 
} from 'lucide-react';
import { Restaurant, MenuItem, CartItem, RestaurantReview } from '../types/foodDelivery';
import { soundManager } from '../utils/soundEffects';

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onOpenReviewModal: (restaurant: Restaurant) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onAddToCart,
  onOpenReviewModal,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'story' | 'reviews'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>(restaurant.categories[0] || 'All');
  
  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { label: string; priceDelta: number }>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const openCustomizeModal = (item: MenuItem) => {
    setCustomizingItem(item);
    setQuantity(1);
    setSpecialInstructions('');
    
    // Default initial options
    const defaults: Record<string, { label: string; priceDelta: number }> = {};
    if (item.customOptions) {
      item.customOptions.forEach(group => {
        if (group.choices.length > 0) {
          defaults[group.name] = group.choices[0];
        }
      });
    }
    setSelectedOptions(defaults);
  };

  const handleOptionSelect = (groupName: string, choice: { label: string; priceDelta: number }) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupName]: choice
    }));
  };

  const calculateCustomizedItemTotal = (): number => {
    if (!customizingItem) return 0;
    let base = customizingItem.price;
    Object.values(selectedOptions).forEach(opt => {
      base += opt.priceDelta;
    });
    return base * quantity;
  };

  const handleConfirmAddToCart = () => {
    if (!customizingItem) return;

    const chosenOptionsRecord: Record<string, string> = {};
    Object.entries(selectedOptions).forEach(([group, choice]) => {
      chosenOptionsRecord[group] = choice.label;
    });

    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem: customizingItem,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity,
      selectedOptions: chosenOptionsRecord,
      specialInstructions,
      itemTotal: calculateCustomizedItemTotal()
    };

    onAddToCart(cartItem);
    soundManager.playCartAdd();
    setCustomizingItem(null);
  };

  const filteredMenuItems = restaurant.menu.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div 
        className="relative w-full max-w-4xl bg-[#0e1015] border border-zinc-800 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-zinc-950 shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/40 to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close restaurant details"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Restaurant Title Info on Banner */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                <ChefHat className="w-4 h-4" />
                <span>Chef {restaurant.chefName}</span>
                <span className="text-zinc-500">·</span>
                <span>{restaurant.cuisine}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                {restaurant.tagline}
              </p>
            </div>

            {/* Rating & ETA Stats */}
            <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="tabular-nums-custom text-white text-sm">{restaurant.rating.toFixed(1)}</span>
                <span className="text-zinc-500 text-[11px]">({restaurant.reviewsCount})</span>
              </div>
              <span className="text-zinc-700">|</span>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tabular-nums-custom">{restaurant.deliveryTimeMin} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Nav Bar (Menu / Story / Reviews) */}
        <div className="flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'menu'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Artisan Menu ({restaurant.menu.length})
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'story'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Origin & Sourcing
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Verified Reviews ({restaurant.reviews.length})
            </button>
          </div>

          <button
            onClick={() => onOpenReviewModal(restaurant)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-medium transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review (+50 pts)</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Category Segmented Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === 'All'
                      ? 'bg-white text-black font-semibold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  All Items
                </button>
                {restaurant.categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openCustomizeModal(item)}
                    className="group p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-semibold text-sm sm:text-base text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h4>
                        <span className="tabular-nums-custom font-semibold text-sm text-amber-400 shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      {/* Dietary text tags with zero-pill separators */}
                      <div className="flex items-center gap-1.5 text-zinc-500 capitalize text-[11px]">
                        {item.dietaryTags.slice(0, 3).map((tag, idx) => (
                          <React.Fragment key={tag}>
                            {idx > 0 && <span className="text-zinc-700">·</span>}
                            <span>{tag}</span>
                          </React.Fragment>
                        ))}
                        {item.calories && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span className="tabular-nums-custom">{item.calories} kcal</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomizeModal(item);
                        }}
                        className="px-3 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-6 max-w-2xl text-zinc-300 text-sm leading-relaxed">
              <div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Our Culinary Heritage</h3>
                <p className="text-zinc-400">{restaurant.story}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-amber-400">
                  Kitchen Standards & Traceability
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Non-GMO, seasonal ingredients</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>100% Compostable packaging</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Avg prep time: {restaurant.deliveryTimeMin - 10} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="font-display text-base font-bold text-white">Customer Experiences</h3>
                  <p className="text-xs text-zinc-400">All reviews are verified after actual delivered orders</p>
                </div>
                <button
                  onClick={() => onOpenReviewModal(restaurant)}
                  className="sm:hidden px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 text-xs font-medium cursor-pointer"
                >
                  Write Review
                </button>
              </div>

              <div className="space-y-3">
                {restaurant.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{rev.author}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-500">{rev.authorLocation}</span>
                        {rev.verifiedOrder && (
                          <>
                            <span className="text-zinc-600">·</span>
                            <span className="text-emerald-400 text-[11px] flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Verified Order
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-zinc-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {rev.dishRecommended && (
                      <div className="text-[11px] text-zinc-400">
                        <span className="text-zinc-500">Recommended dish:</span>{' '}
                        <span className="text-amber-400/90 font-medium">{rev.dishRecommended}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Customization Modal Sub-Drawer */}
      {customizingItem && (
        <div 
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
          onClick={() => setCustomizingItem(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#12141a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  {customizingItem.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {customizingItem.description}
                </p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Options (e.g. Crust, Cheese, Protein, Sauces) */}
            {customizingItem.customOptions && customizingItem.customOptions.length > 0 && (
              <div className="space-y-4">
                {customizingItem.customOptions.map(group => (
                  <div key={group.name} className="space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300">
                      {group.name}
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {group.choices.map(choice => {
                        const isChosen = selectedOptions[group.name]?.label === choice.label;
                        return (
                          <button
                            key={choice.label}
                            onClick={() => handleOptionSelect(group.name, choice)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                              isChosen
                                ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-medium'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <span>{choice.label}</span>
                            <span className="tabular-nums-custom text-zinc-400">
                              {choice.priceDelta > 0 ? `+$${choice.priceDelta.toFixed(2)}` : 'Included'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions Note */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Special Kitchen Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., dressing on the side, extra crispy, no onions..."
                rows={2}
                className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quantity Stepper & Add Action */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold tabular-nums-custom text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-bold text-xs tracking-tight transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Add to Bag</span>
                <span className="tabular-nums-custom">
                  ${calculateCustomizedItemTotal().toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
