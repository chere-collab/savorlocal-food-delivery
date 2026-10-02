import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldAlert } from 'lucide-react';
import { CartItem, Voucher, LoyaltyProfile } from '../types/foodDelivery';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedVoucher: Voucher | null;
  onApplyVoucher: (voucher: Voucher | null) => void;
  loyaltyProfile: LoyaltyProfile;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedVoucher,
  onApplyVoucher,
  loyaltyProfile,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = cartItems.length > 0 ? 1.99 : 0;
  const serviceFee = cartItems.length > 0 ? 2.50 : 0;
  const discount = appliedVoucher ? Math.min(appliedVoucher.discountAmount, subtotal) : 0;
  const total = Math.max(0, subtotal + deliveryFee + serviceFee - discount);

  const handleApplyPromoCode = () => {
    setPromoError(null);
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    // Check user's active vouchers or built-in test vouchers
    const matched = loyaltyProfile.activeVouchers.find(v => v.code.toUpperCase() === code);
    if (matched) {
      if (subtotal < matched.minOrder) {
        setPromoError(`Requires minimum order of $${matched.minOrder.toFixed(2)}`);
        return;
      }
      onApplyVoucher(matched);
      setPromoCodeInput('');
      return;
    }

    if (code === 'WELCOME5' || code === 'SAVOR5OFF') {
      if (subtotal < 20) {
        setPromoError('Requires minimum order of $20.00');
        return;
      }
      onApplyVoucher({
        id: 'promo-code-apply',
        code,
        title: '$5.00 Off',
        description: 'Promo code discount',
        discountAmount: 5.0,
        minOrder: 20,
        pointsCost: 0,
        expiresAt: 'In 30 days'
      });
      setPromoCodeInput('');
      return;
    }

    setPromoError('Invalid or expired voucher code');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#0e1015] border-l border-zinc-800 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-base font-bold text-white">Your Order Bag</h2>
            <span className="text-xs text-zinc-500 tabular-nums-custom">
              ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-zinc-400 hover:text-red-400 transition-colors p-1"
                title="Clear entire bag"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <ShoppingBag className="w-12 h-12 text-zinc-700 mb-3" />
              <p className="font-display font-semibold text-zinc-300 text-sm">Your bag is empty</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Explore hand-crafted cuisines from local artisan kitchens to add dishes.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-zinc-200">{item.menuItem.name}</h4>
                    <p className="text-[11px] text-zinc-500">{item.restaurantName}</p>
                    
                    {/* Selected Options preview */}
                    {Object.entries(item.selectedOptions).length > 0 && (
                      <div className="mt-1 text-[11px] text-zinc-400">
                        {Object.entries(item.selectedOptions).map(([key, val]) => (
                          <div key={key}>
                            <span className="text-zinc-500">{key}:</span> {val}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="mt-1 text-[11px] text-amber-400/80 italic">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}
                  </div>

                  <span className="tabular-nums-custom font-bold text-xs text-amber-400">
                    ${item.itemTotal.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[11px] text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>

                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-md px-1 py-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs tabular-nums-custom font-bold text-white px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 text-zinc-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher & Pricing Summary Section */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-[#090a0d] space-y-3 shrink-0">
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Voucher or Promo Code"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleApplyPromoCode}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> {promoError}
                </p>
              )}

              {appliedVoucher && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-semibold">{appliedVoucher.code}</span>
                    <span className="text-[11px] text-emerald-300">(-${appliedVoucher.discountAmount.toFixed(2)})</span>
                  </div>
                  <button
                    onClick={() => onApplyVoucher(null)}
                    className="text-[11px] text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown with Tabular Numbers */}
            <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums-custom text-zinc-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Eco Courier Delivery Fee</span>
                <span className="tabular-nums-custom text-zinc-200">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kitchen Service Fee</span>
                <span className="tabular-nums-custom text-zinc-200">${serviceFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Loyalty Voucher Discount</span>
                  <span className="tabular-nums-custom">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span className="tabular-nums-custom text-amber-400 font-display">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-bold text-sm tracking-tight transition-all flex items-center justify-between shadow-lg cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1">
                <span className="tabular-nums-custom">${total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
