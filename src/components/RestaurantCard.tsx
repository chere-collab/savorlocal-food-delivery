import React, { useState } from 'react';
import { Star, Clock, UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import { Restaurant } from '../types/foodDelivery';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => onSelect(restaurant)}
      className="group relative flex flex-col rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-sm"
    >
      {/* 65-70% Height Image Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        {!imageError ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600">
            <UtensilsCrossed className="w-8 h-8 mb-2 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-400">{restaurant.name}</span>
          </div>
        )}

        {/* Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Subtle Price Level & Delivery Tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white tabular-nums-custom border border-white/10">
            {restaurant.priceLevel}
          </span>
        </div>

        {/* Bottom Floating Kicker */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums-custom">{restaurant.deliveryTimeMin} min</span>
            <span className="text-white/60">·</span>
            <span className="tabular-nums-custom">${restaurant.deliveryFee.toFixed(2)} delivery</span>
          </div>
          <span className="text-[11px] text-zinc-300 tabular-nums-custom">
            {restaurant.distanceKm} km away
          </span>
        </div>
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Header Row: Title & Arrow */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base text-zinc-100 group-hover:text-amber-400 transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
            {restaurant.tagline}
          </p>
        </div>

        {/* Unboxed Metadata with Typographic Separators */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums-custom text-zinc-200">{restaurant.rating.toFixed(1)}</span>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="tabular-nums-custom text-zinc-400">({restaurant.reviewsCount})</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium">{restaurant.cuisine}</span>
          </div>

          {/* Quiet dietary tag preview */}
          <div className="text-[11px] text-zinc-500 capitalize hidden sm:block">
            {restaurant.dietaryFeatures.slice(0, 2).join(' · ')}
          </div>
        </div>
      </div>
    </article>
  );
};
