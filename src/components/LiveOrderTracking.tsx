import React, { useState, useEffect } from 'react';
import { 
  Navigation, Clock, Phone, MessageSquare, ChefHat, CheckCircle2, 
  MapPin, Bike, ShieldCheck, Star, Play, RotateCcw, FastForward,
  ChevronRight, ArrowRight, Download, Send, X
} from 'lucide-react';
import { Order, OrderStatus } from '../types/foodDelivery';
import { soundManager } from '../utils/soundEffects';

interface LiveOrderTrackingProps {
  order: Order | null;
  onUpdateOrderStatus: (status: OrderStatus, progressPercent: number) => void;
  onOpenReviewModal: () => void;
  onResetOrder: () => void;
  onSendNotification: (title: string, message: string, type: 'order' | 'loyalty') => void;
}

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({
  order,
  onUpdateOrderStatus,
  onOpenReviewModal,
  onResetOrder,
  onSendNotification,
}) => {
  const [courierPercent, setCourierPercent] = useState<number>(order ? order.courierLocationPercent : 68);
  const [isSimulatingSpeed, setIsSimulatingSpeed] = useState<boolean>(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: "Hi! I just picked up your fresh order from the kitchen. Heading your way now on the eco-bike!", time: '2m ago' }
  ]);
  const [replyInput, setReplyInput] = useState('');
  const [etaSeconds, setEtaSeconds] = useState(order ? order.estimatedDeliveryMinutes * 60 : 420);

  // Sync state if order changes
  useEffect(() => {
    if (order) {
      setCourierPercent(order.courierLocationPercent);
      setEtaSeconds(order.estimatedDeliveryMinutes * 60);
    }
  }, [order?.id]);

  // Live timer countdown
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const timer = setInterval(() => {
      setEtaSeconds(prev => Math.max(0, prev - 1));
    }, isSimulatingSpeed ? 400 : 1000);

    return () => clearInterval(timer);
  }, [order?.status, isSimulatingSpeed]);

  // Courier progress animation on map
  useEffect(() => {
    if (!order || order.status !== 'on_the_way') return;

    const interval = setInterval(() => {
      setCourierPercent(prev => {
        const next = Math.min(100, prev + (isSimulatingSpeed ? 2 : 0.4));
        if (next >= 100 && order.status === 'on_the_way') {
          // Trigger delivery milestone
          onUpdateOrderStatus('delivered', 100);
          soundManager.playSuccess();
          onSendNotification(
            'Order Delivered! 🍕',
            `Your order from ${order.restaurant.name} has arrived at ${order.deliveryAddress}. Enjoy!`,
            'order'
          );
        }
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [order?.status, isSimulatingSpeed]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <Navigation className="w-8 h-8" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">No Active Delivery in Progress</h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
          Place an order from any of our curated artisan kitchens or start a demo simulation to explore live GPS route tracking.
        </p>
        <button
          onClick={onResetOrder}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors cursor-pointer"
        >
          Load Live Demo Order Simulation
        </button>
      </div>
    );
  }

  // Milestone Stages
  const stages: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'placed',
      label: 'Order Confirmed',
      desc: 'Order received and sent to kitchen printer',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      key: 'preparing',
      label: 'In the Kitchen',
      desc: `Chef ${order.restaurant.chefName} is handcrafting your dishes`,
      icon: <ChefHat className="w-4 h-4" />
    },
    {
      key: 'on_the_way',
      label: 'Courier En Route',
      desc: `${order.driver.name} is navigating on ${order.driver.vehicle}`,
      icon: <Bike className="w-4 h-4" />
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: `Completed delivery at ${order.deliveryAddress}`,
      icon: <MapPin className="w-4 h-4" />
    }
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.status);

  const handleAdvanceStatus = () => {
    if (order.status === 'placed') {
      onUpdateOrderStatus('preparing', 25);
      soundManager.playNotification();
      onSendNotification('Order Preparing 🔥', `${order.restaurant.name} has begun handcrafting your meal.`, 'order');
    } else if (order.status === 'preparing') {
      onUpdateOrderStatus('on_the_way', 45);
      setCourierPercent(45);
      soundManager.playNotification();
      onSendNotification('Courier Picked Up 🚴', `${order.driver.name} is on the way with your order!`, 'order');
    } else if (order.status === 'on_the_way') {
      onUpdateOrderStatus('delivered', 100);
      setCourierPercent(100);
      soundManager.playSuccess();
      onSendNotification('Delivered! 🍽️', 'Your delivery is complete. Tap to review and claim +50 pts.', 'order');
    }
  };

  const handleSendMessage = () => {
    if (!replyInput.trim()) return;
    const msg = replyInput.trim();
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: msg, time: 'Just now' }
    ]);
    setReplyInput('');

    // Simulated driver automated reply
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'driver', 
          text: "Got it! Thanks for the note, will do exactly that.", 
          time: 'Just now' 
        }
      ]);
      soundManager.playNotification();
    }, 1200);
  };

  // Coordinates on simulated SVG map
  // Start (Restaurant): x=80, y=280
  // Waypoint 1: x=180, y=140
  // Waypoint 2: x=340, y=160
  // Waypoint 3: x=460, y=90
  // End (Customer): x=620, y=180
  const getMapPosition = (p: number) => {
    const fraction = p / 100;
    // Piecewise linear interpolation across 4 segments
    const pts = [
      { x: 80, y: 280 },
      { x: 190, y: 150 },
      { x: 330, y: 180 },
      { x: 470, y: 90 },
      { x: 630, y: 180 }
    ];

    const totalSegs = pts.length - 1;
    const scaled = fraction * totalSegs;
    const segIdx = Math.min(Math.floor(scaled), totalSegs - 1);
    const segFraction = scaled - segIdx;

    const p1 = pts[segIdx];
    const p2 = pts[segIdx + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segFraction,
      y: p1.y + (p2.y - p1.y) * segFraction
    };
  };

  const courierPos = getMapPosition(courierPercent);

  const etaMinutes = Math.floor(etaSeconds / 60);
  const etaSecRemainder = etaSeconds % 60;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Order Header & Live Simulator Tools */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>Order</span>
            <span className="font-mono font-bold text-amber-400">{order.orderNumber}</span>
            <span>·</span>
            <span>{order.restaurant.name}</span>
            <span>·</span>
            <span className="capitalize">{order.status.replace('_', ' ')}</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {order.status === 'delivered' ? (
              <span className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Delivered Safely!
              </span>
            ) : (
              <>
                <span>Estimated Arrival:</span>
                <span className="text-amber-400 font-mono tabular-nums-custom">
                  {etaMinutes}:{etaSecRemainder < 10 ? `0${etaSecRemainder}` : etaSecRemainder}
                </span>
                <span className="text-xs font-normal text-zinc-400">mins</span>
              </>
            )}
          </h2>
        </div>

        {/* Real-Time Simulator Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {order.status !== 'delivered' && (
            <button
              onClick={handleAdvanceStatus}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Manually advance to next milestone"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Advance Status</span>
            </button>
          )}

          <button
            onClick={() => setIsSimulatingSpeed(!isSimulatingSpeed)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isSimulatingSpeed
                ? 'bg-zinc-800 border-amber-500/50 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {isSimulatingSpeed ? 'Speed: 5x Fast' : 'Speed: Real-Time'}
          </button>

          <button
            onClick={onResetOrder}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to fresh demo order"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Vector GPS Map (Left) + Driver / Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Vector Map Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-[#08090c] border border-zinc-800 overflow-hidden shadow-inner">
            
            {/* Ambient Map Grid Lines */}
            <svg 
              viewBox="0 0 700 350" 
              className="w-full h-full select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <radialGradient id="courierGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background grid */}
              <rect width="700" height="350" fill="url(#grid)" />

              {/* Simulated City Blocks */}
              <rect x="110" y="40" width="120" height="70" rx="6" fill="#13151b" />
              <rect x="250" y="40" width="160" height="70" rx="6" fill="#13151b" />
              <rect x="430" y="30" width="180" height="40" rx="6" fill="#13151b" />

              <rect x="100" y="180" width="100" height="120" rx="6" fill="#13151b" />
              <rect x="230" y="210" width="140" height="100" rx="6" fill="#13151b" />
              <rect x="400" y="140" width="110" height="140" rx="6" fill="#13151b" />
              <rect x="540" y="210" width="120" height="100" rx="6" fill="#13151b" />

              {/* Park & Waterway */}
              <path d="M 20 20 Q 80 50 120 20 L 140 0 L 0 0 Z" fill="#0f291e" fillOpacity="0.3" />
              <text x="30" y="25" fill="#10b981" fillOpacity="0.4" fontSize="9" fontWeight="600">RIVERSIDE GREEN</text>
              <text x="260" y="75" fill="#64748b" fillOpacity="0.4" fontSize="9">HISTORIC PLAZA</text>
              <text x="440" y="210" fill="#64748b" fillOpacity="0.4" fontSize="9">AVENUE DISTRICT</text>

              {/* Delivery Path (Road network) */}
              <path
                d="M 80 280 L 190 150 L 330 180 L 470 90 L 630 180"
                fill="none"
                stroke="#2a2e3d"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 80 280 L 190 150 L 330 180 L 470 90 L 630 180"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 4"
              />

              {/* Restaurant Marker (Origin) */}
              <g transform="translate(80, 280)">
                <circle r="18" fill="#f59e0b" fillOpacity="0.15" />
                <circle r="10" fill="#f59e0b" />
                <ChefHat className="text-black" x="-6" y="-6" width="12" height="12" />
                <text x="16" y="4" fill="#f59e0b" fontSize="10" fontWeight="bold">
                  {order.restaurant.name.slice(0, 15)}...
                </text>
              </g>

              {/* Customer Destination Marker (Destination) */}
              <g transform="translate(630, 180)">
                <circle r="18" fill="#10b981" fillOpacity="0.15" />
                <circle r="10" fill="#10b981" />
                <MapPin className="text-black" x="-6" y="-6" width="12" height="12" />
                <text x="-90" y="-14" fill="#10b981" fontSize="10" fontWeight="bold">
                  Your Address
                </text>
              </g>

              {/* Animated Courier Marker */}
              {order.status !== 'delivered' && (
                <g transform={`translate(${courierPos.x}, ${courierPos.y})`}>
                  <circle r="24" fill="url(#courierGlow)" className="animate-pulse" />
                  <circle r="13" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                  <Bike className="text-black" x="-7" y="-7" width="14" height="14" />
                </g>
              )}
            </svg>

            {/* Live Telemetry Overlay in Map Corner */}
            <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>GPS Live Signal</span>
              </div>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300 tabular-nums-custom font-mono">
                {order.status === 'delivered' ? 'Completed' : `${Math.round(courierPercent)}% along route`}
              </span>
            </div>

            {/* Map Action Quick Note */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="p-2 rounded-lg bg-black/70 backdrop-blur-md text-[11px] text-zinc-300 border border-white/10">
                Route: <span className="text-white font-medium">{order.restaurant.name}</span> → <span className="text-white font-medium">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Delivery Milestone Timeline Tracker */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Live Order Progression
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
              {stages.map((st, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-500/10'
                        : isPassed
                        ? 'border-emerald-500/40 bg-zinc-900/90 text-zinc-300'
                        : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`p-1 rounded-md ${
                        isCurrent 
                          ? 'bg-amber-500 text-black' 
                          : isPassed 
                          ? 'bg-emerald-500 text-black' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {st.icon}
                      </span>
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : isPassed ? 'text-white' : 'text-zinc-500'}`}>
                        {st.label}
                      </h4>
                    </div>
                    <p className="text-[11px] line-clamp-2 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Post-Delivery Trigger */}
            {order.status === 'delivered' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
                <div>
                  <h4 className="font-display font-bold text-white text-sm">
                    How was your culinary experience?
                  </h4>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Leave a verified review for {order.restaurant.name} and instantly earn <strong className="text-amber-400">+50 SavorClub Points</strong>!
                  </p>
                </div>
                <button
                  onClick={onOpenReviewModal}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-tight transition-all cursor-pointer whitespace-nowrap shadow-md"
                >
                  Write Verified Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Driver Profile Card & Order Item Receipt */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Driver Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Your Eco Courier
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Driver</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-black text-sm shadow-md">
                {order.driver.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white">{order.driver.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums-custom font-semibold text-white">{order.driver.rating.toFixed(2)}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="tabular-nums-custom">{order.driver.deliveriesCount} trips</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">{order.driver.vehicle}</p>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Chat ({chatMessages.length})</span>
              </button>

              <a
                href={`tel:${order.driver.phone}`}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Courier</span>
              </a>
            </div>
          </div>

          {/* Itemized Order Receipt */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Receipt Summary
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {order.items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs">
                  <div className="text-zinc-300">
                    <span className="font-bold text-white tabular-nums-custom mr-1">{it.quantity}x</span>
                    <span>{it.menuItem.name}</span>
                  </div>
                  <span className="tabular-nums-custom text-zinc-400 font-medium">
                    ${it.itemTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums-custom text-zinc-200">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Service</span>
                <span className="tabular-nums-custom text-zinc-200">
                  ${(order.deliveryFee + order.serviceFee).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Driver Tip</span>
                <span className="tabular-nums-custom text-zinc-200">${order.tip.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Loyalty Discount</span>
                  <span className="tabular-nums-custom">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-white text-sm">
                <span>Paid Total</span>
                <span className="tabular-nums-custom text-amber-400 font-display">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Driver In-App Direct Chat Dialog */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md bg-[#12141a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-black font-bold flex items-center justify-center text-xs">
                  {order.driver.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{order.driver.name}</h4>
                  <p className="text-[11px] text-emerald-400">Active Courier · En Route</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-amber-500 text-black font-medium rounded-br-xs'
                        : 'bg-zinc-800 text-zinc-200 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                'Leave at front door please',
                'Gate code is #4821',
                'Call when outside'
              ].map((qr) => (
                <button
                  key={qr}
                  onClick={() => {
                    setChatMessages(prev => [
                      ...prev,
                      { sender: 'user', text: qr, time: 'Just now' }
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white whitespace-nowrap cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-zinc-800 bg-[#0d0f14] flex items-center gap-2">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message to your courier..."
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
