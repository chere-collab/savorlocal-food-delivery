import React, { useState } from 'react';
import { 
  Award, Sparkles, Gift, CheckCircle2, ChevronRight, Zap, 
  Crown, ArrowRight, Clock, ShieldCheck, Tag, Flame
} from 'lucide-react';
import { LoyaltyProfile, Voucher, LoyaltyTier } from '../types/foodDelivery';
import { INITIAL_LOYALTY_VOUCHERS } from '../data/mockData';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface LoyaltyProgramViewProps {
  loyaltyProfile: LoyaltyProfile;
  onRedeemVoucher: (voucher: Voucher) => void;
  onApplyVoucherToCart: (voucher: Voucher) => void;
  activeVouchers: Voucher[];
}

export const LoyaltyProgramView: React.FC<LoyaltyProgramViewProps> = ({
  loyaltyProfile,
  onRedeemVoucher,
  onApplyVoucherToCart,
  activeVouchers,
}) => {
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const tierRequirements: Record<LoyaltyTier, { min: number; max: number; multiplier: string }> = {
    Bronze: { min: 0, max: 500, multiplier: '1.0x' },
    Silver: { min: 500, max: 1500, multiplier: '1.25x' },
    Gold: { min: 1500, max: 3000, multiplier: '1.5x' },
    Platinum: { min: 3000, max: 10000, multiplier: '2.0x' },
  };

  const currentTierInfo = tierRequirements[loyaltyProfile.tier];
  const progressPercent = Math.min(
    100,
    Math.round(((loyaltyProfile.points - currentTierInfo.min) / (currentTierInfo.max - currentTierInfo.min)) * 100)
  );

  const handleRedeem = (voucher: Voucher) => {
    if (loyaltyProfile.points < voucher.pointsCost) return;

    setRedeemingId(voucher.id);
    setTimeout(() => {
      onRedeemVoucher(voucher);
      setRedeemingId(null);
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Tier Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {loyaltyProfile.tier} Member
              </span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-400">{currentTierInfo.multiplier} Points on All Orders</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              SavorClub Rewards
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed">
              Earn 10 points for every dollar spent supporting independent local kitchens. Redeem for instant meal discounts and free chef appetizers.
            </p>
          </div>

          {/* Points Vault Display */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-md min-w-[220px] text-center md:text-right">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Available Balance
            </span>
            <div className="font-display text-4xl sm:text-5xl font-bold text-amber-400 tabular-nums-custom my-1">
              {loyaltyProfile.points}
            </div>
            <span className="text-xs text-zinc-500">
              Worth ${(loyaltyProfile.points / 50).toFixed(2)} in instant cart deductions
            </span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-2">
          <div className="flex justify-between text-xs text-zinc-300 font-medium">
            <span>Current: {loyaltyProfile.tier}</span>
            <span>
              {loyaltyProfile.points} / {currentTierInfo.max} pts to next tier
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Claimed Vouchers Drawer/Tray */}
      {activeVouchers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Tag className="w-4 h-4" />
            <span>Your Claimed Vouchers Ready to Apply ({activeVouchers.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeVouchers.map((v) => (
              <div 
                key={v.id} 
                className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400">{v.code}</span>
                  <h4 className="text-xs font-semibold text-white mt-0.5">{v.title}</h4>
                  <p className="text-[11px] text-zinc-400">Min order ${v.minOrder.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onApplyVoucherToCart(v)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  Apply in Bag
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">Redeemable Rewards Catalog</h2>
            <p className="text-xs text-zinc-400">Exchange your earned SavorClub points for promo vouchers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {INITIAL_LOYALTY_VOUCHERS.map((voucher) => {
            const canAfford = loyaltyProfile.points >= voucher.pointsCost;
            const isRedeeming = redeemingId === voucher.id;

            return (
              <div
                key={voucher.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between gap-4 hover:border-amber-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-xs font-bold">
                      {voucher.pointsCost} pts
                    </span>
                    <Gift className="w-4 h-4 text-zinc-500" />
                  </div>

                  <h3 className="font-display font-semibold text-sm text-zinc-100">
                    {voucher.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {voucher.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => handleRedeem(voucher)}
                    disabled={!canAfford || isRedeeming}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming ? 'Redeeming...' : canAfford ? 'Redeem Voucher' : `Need ${voucher.pointsCost - loyaltyProfile.points} more pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Perks Breakdown Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h3 className="font-display text-base font-bold text-white">
          SavorClub Tier Perks Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">Tier</th>
                <th className="pb-3 font-semibold">Points Multiplier</th>
                <th className="pb-3 font-semibold">Free Delivery Perk</th>
                <th className="pb-3 font-semibold">Kitchen Priority</th>
                <th className="pb-3 font-semibold">VIP Drops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-normal">
              <tr>
                <td className="py-3 font-bold text-amber-600">Bronze (0-499 pts)</td>
                <td className="py-3">1.0x (10 pts/$1)</td>
                <td className="py-3 text-zinc-500">Standard rates</td>
                <td className="py-3 text-zinc-500">Standard</td>
                <td className="py-3 text-zinc-500">Newsletter</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-zinc-300">Silver (500-1499 pts)</td>
                <td className="py-3 font-semibold text-amber-400">1.25x (12.5 pts/$1)</td>
                <td className="py-3">Free on orders &gt; $30</td>
                <td className="py-3 text-zinc-400">Priority prep queue</td>
                <td className="py-3">Member flash drops</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-amber-400">Gold (1500-2999 pts)</td>
                <td className="py-3 font-semibold text-amber-400">1.5x (15 pts/$1)</td>
                <td className="py-3">Free on orders &gt; $20</td>
                <td className="py-3 text-emerald-400">Express kitchen queue</td>
                <td className="py-3">Monthly chef dessert</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-purple-400">Platinum (3000+ pts)</td>
                <td className="py-3 font-semibold text-amber-400">2.0x (20 pts/$1)</td>
                <td className="py-3 text-emerald-400">Always $0 Delivery</td>
                <td className="py-3 text-emerald-400">VIP Top Priority</td>
                <td className="py-3">Private chef tastings</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Points History Ledger */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h3 className="font-display text-base font-bold text-white">Points History Ledger</h3>
        <div className="space-y-2">
          {loyaltyProfile.history.map((hist) => (
            <div
              key={hist.id}
              className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-medium text-white">{hist.description}</p>
                <span className="text-[11px] text-zinc-500">{hist.date}</span>
              </div>
              <span
                className={`tabular-nums-custom font-bold font-mono text-sm ${
                  hist.pointsChange > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {hist.pointsChange > 0 ? `+${hist.pointsChange}` : hist.pointsChange} pts
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
