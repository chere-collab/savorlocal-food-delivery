import React from 'react';
import { ShoppingBag, Bell, Compass, Award, Navigation, Database } from 'lucide-react';
import { LoyaltyProfile, Order, CartItem } from '../types/foodDelivery';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  activeTab: 'explore' | 'tracking' | 'loyalty' | 'architecture';
  setActiveTab: (tab: 'explore' | 'tracking' | 'loyalty' | 'architecture') => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  activeOrder: Order | null;
  loyaltyProfile: LoyaltyProfile;
  unreadNotificationsCount: number;
  setIsNotificationOpen: (open: boolean) => void;
  onOpenApkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  setIsCartOpen,
  activeOrder,
  loyaltyProfile,
  unreadNotificationsCount,
  setIsNotificationOpen,
  onOpenApkModal,
}) => {
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0d10]/95 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark in display face */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            aria-label="SavorLocal Home"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold text-lg shadow-sm">
              S
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              SavorLocal
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'explore'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 py-4 -mb-[2px]'
                : 'text-zinc-400 hover:text-white py-4'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Curated Eateries</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer relative ${
              activeTab === 'tracking'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 py-4 -mb-[2px]'
                : 'text-zinc-400 hover:text-white py-4'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Live Tracking</span>
            {activeOrder && activeOrder.status !== 'delivered' && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'loyalty'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 py-4 -mb-[2px]'
                : 'text-zinc-400 hover:text-white py-4'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>SavorClub Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400 py-4 -mb-[2px]'
                : 'text-zinc-400 hover:text-white py-4'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>DB Blueprint</span>
          </button>
        </nav>

        {/* Zone 3: Primary interactive controls & cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Toggle */}
          <ThemeSwitcher />

          {/* PWA / APK Install Button */}
          <PWAInstallButton onOpenApkModal={onOpenApkModal} />

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            aria-label="View notifications"
            className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* SavorClub Tier Indicator */}
          <button
            onClick={() => setActiveTab('loyalty')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:border-amber-500/40 hover:text-white transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{loyaltyProfile.tier}</span>
            <span className="text-zinc-500">·</span>
            <span className="tabular-nums-custom text-amber-400 font-semibold">{loyaltyProfile.points} pts</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-semibold text-xs tracking-tight transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-black/15 px-1.5 py-0.5 rounded text-[11px] tabular-nums-custom font-bold">
              {totalCartCount}
            </span>
            {cartSubtotal > 0 && (
              <span className="tabular-nums-custom hidden sm:inline text-black/90">
                ${cartSubtotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/[0.06] bg-[#090a0d] px-2 py-2">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 px-2 rounded ${
            activeTab === 'explore' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Eateries</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 px-2 rounded relative ${
            activeTab === 'tracking' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Tracking</span>
          {activeOrder && activeOrder.status !== 'delivered' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0.5 right-3" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 px-2 rounded ${
            activeTab === 'loyalty' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rewards</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 px-2 rounded ${
            activeTab === 'architecture' ? 'text-amber-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>DB Blueprint</span>
        </button>
      </div>
    </header>
  );
};
