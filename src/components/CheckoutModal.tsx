import React, { useState } from 'react';
import { 
  X, CreditCard, Smartphone, Wallet, Banknote, ShieldCheck, 
  Lock, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles 
} from 'lucide-react';
import { CartItem, PaymentMethodType, Voucher, Order, Restaurant, LoyaltyProfile } from '../types/foodDelivery';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedVoucher: Voucher | null;
  loyaltyProfile: LoyaltyProfile;
  onOrderPlaced: (order: Order) => void;
  onDeductPoints: (points: number, reason: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedVoucher,
  loyaltyProfile,
  onOrderPlaced,
  onDeductPoints,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Apt 4B, Historic District');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave outside Apt 4B door and ring bell once.');
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [customTip, setCustomTip] = useState<string>('');
  
  // Card Form Fields
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Alex Morgan');

  // Wallet points payment
  const [useWalletPoints, setUseWalletPoints] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [is3DSecureActive, setIs3DSecureActive] = useState(false);
  const [otpCode, setOtpCode] = useState('884-219');
  const [inputOtp, setInputOtp] = useState('');

  if (!isOpen || cartItems.length === 0) return null;

  // Calculate costs
  const subtotal = cartItems.reduce((s, i) => s + i.itemTotal, 0);
  const deliveryFee = 1.99;
  const serviceFee = 2.50;
  const voucherDiscount = appliedVoucher ? Math.min(appliedVoucher.discountAmount, subtotal) : 0;
  
  // Tip calculation
  const calculatedTip = tipPercent >= 0 ? (subtotal * tipPercent) / 100 : parseFloat(customTip) || 0;
  
  // Points calculation ($1 = 50 points)
  const maxPointsDiscount = Math.min(subtotal, (loyaltyProfile.points / 50));
  const pointsDiscount = useWalletPoints ? maxPointsDiscount : 0;
  const pointsUsed = useWalletPoints ? Math.round(pointsDiscount * 50) : 0;

  const total = Math.max(0, subtotal + deliveryFee + serviceFee + calculatedTip - voucherDiscount - pointsDiscount);

  // Group restaurant (using the primary restaurant from the cart)
  const primaryRestaurantId = cartItems[0]?.restaurantId;
  const restaurantName = cartItems[0]?.restaurantName;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleStartPayment = () => {
    setIsProcessing(true);

    if (paymentMethod === 'credit_card') {
      // Trigger realistic 3D-Secure 2.0 PSD2 bank step
      setTimeout(() => {
        setIsProcessing(false);
        setIs3DSecureActive(true);
      }, 900);
      return;
    }

    // Apple Pay / Google Pay / Wallet / Cash instant completion
    setTimeout(() => {
      finishOrder();
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIs3DSecureActive(false);
      finishOrder();
    }, 1000);
  };

  const finishOrder = () => {
    setIsProcessing(false);

    // If points used, deduct from user profile
    if (pointsUsed > 0) {
      onDeductPoints(pointsUsed, `Redeemed for order discount (-$${pointsDiscount.toFixed(2)})`);
    }

    // Create the simulated order
    const orderNumber = `SL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: [...cartItems],
      restaurant: {
        id: primaryRestaurantId,
        name: restaurantName,
        tagline: 'Artisan Culinary Kitchen',
        cuisine: 'Italian',
        rating: 4.9,
        reviewsCount: 382,
        deliveryTimeMin: 25,
        deliveryFee,
        minOrder: 15,
        distanceKm: 2.0,
        priceLevel: '$$',
        image: cartItems[0].menuItem.image || '',
        address: '414 Stone Street, Historic District',
        dietaryFeatures: ['vegetarian', 'halal', 'dairy-free'],
        story: 'Handcrafted with local pride',
        chefName: 'Marco Bernardi',
        menu: [],
        categories: [],
        reviews: []
      },
      subtotal,
      deliveryFee,
      serviceFee,
      tip: calculatedTip,
      discount: voucherDiscount + pointsDiscount,
      voucherCode: appliedVoucher?.code,
      total,
      status: 'placed',
      createdAt: 'Just now',
      estimatedDeliveryMinutes: 24,
      deliveryAddress,
      driver: {
        name: 'Jordan Cole',
        phone: '+1 (555) 789-2244',
        vehicle: 'Zero-Emission Cargo E-Bike',
        plate: 'ECO-948',
        rating: 4.98,
        deliveriesCount: 890,
        avatar: 'JC'
      },
      paymentMethod,
      paymentDetails: {
        method: paymentMethod,
        cardLast4: paymentMethod === 'credit_card' ? cardNumber.slice(-4) : '4242',
        walletPointsUsed: pointsUsed,
        is3DSecureVerified: true
      },
      notes: deliveryNotes,
      courierLocationPercent: 0
    };

    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    onOrderPlaced(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full max-w-2xl bg-[#0e1015] border border-zinc-800 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-screen sm:max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white">
                Secure Integrated Checkout
              </h2>
              <p className="text-[11px] text-zinc-400">256-bit TLS Encrypted · Tokenized PCI-DSS Tier 1</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Section 1: Delivery Address & Instructions */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
              01. Delivery Destination
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              placeholder="Full street address and apartment number"
            />
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              placeholder="Dropoff note for courier (e.g., Gate code 4821, leave on porch)"
            />
          </div>

          {/* Section 2: Courier Tip Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                02. Courier Gratitude (100% to Driver)
              </label>
              <span className="text-xs tabular-nums-custom font-semibold text-zinc-200">
                +${calculatedTip.toFixed(2)}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { percent: 15, label: '15%' },
                { percent: 20, label: '20% (Good)' },
                { percent: 25, label: '25% (Great)' },
                { percent: -1, label: 'Custom' },
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => setTipPercent(t.percent)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    tipPercent === t.percent
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tipPercent === -1 && (
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                <input
                  type="number"
                  placeholder="Enter custom tip amount"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Section 3: Loyalty Points Split Option */}
          {loyaltyProfile.points >= 100 && (
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Apply SavorClub Points Balance
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Use {pointsUsed || Math.min(loyaltyProfile.points, Math.round(subtotal * 50))} pts to save ${maxPointsDiscount.toFixed(2)} on this order
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUseWalletPoints(!useWalletPoints)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  useWalletPoints
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {useWalletPoints ? 'Applied' : 'Redeem'}
              </button>
            </div>
          )}

          {/* Section 4: Integrated Payment Methods */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
              03. Payment Method
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'apple_pay', label: 'Apple Pay', icon: Smartphone },
                { id: 'google_pay', label: 'Google Pay', icon: Smartphone },
                { id: 'cash_on_delivery', label: 'Door Hand-off', icon: Banknote },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = paymentMethod === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as PaymentMethodType)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3 animate-in fade-in duration-100">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">CVC / CVV</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Apple / Google Pay notice */}
            {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Biometric Express Checkout Ready</p>
                  <p className="text-[11px]">Instant authorization with your device's biometric key. No card entry needed.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Order Breakdown Review */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="tabular-nums-custom text-zinc-200">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Eco Courier Delivery</span>
              <span className="tabular-nums-custom text-zinc-200">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span className="tabular-nums-custom text-zinc-200">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Courier Tip</span>
              <span className="tabular-nums-custom text-zinc-200">${calculatedTip.toFixed(2)}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Voucher ({appliedVoucher?.code})</span>
                <span className="tabular-nums-custom">-${voucherDiscount.toFixed(2)}</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-amber-400 font-medium">
                <span>Savor Points Redemption ({pointsUsed} pts)</span>
                <span className="tabular-nums-custom">-${pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Final Authorization Amount</span>
              <span className="tabular-nums-custom text-amber-400 font-display text-base">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#090a0d] shrink-0">
          <button
            onClick={handleStartPayment}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay & Place Order · ${total.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D-Secure 2.0 PSD2 Bank OTP Challenge Simulation Modal */}
      {is3DSecureActive && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#151720] border border-zinc-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-xs text-white uppercase tracking-wider">
                  Bank 3D Secure
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">EMVCo Certified</span>
            </div>

            <p className="text-xs text-zinc-300">
              A temporary verification code was simulated for your authorization of <strong className="text-white">${total.toFixed(2)}</strong>.
            </p>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center font-mono text-sm tracking-widest text-amber-400 font-bold">
              {otpCode}
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Enter One-Time Passcode
              </label>
              <input
                type="text"
                placeholder={otpCode}
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white text-center font-mono tracking-widest focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIs3DSecureActive(false)}
                className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition-colors"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
