import React, { useState } from 'react';
import { X, Star, ThumbsUp, Sparkles, CheckCircle2, MessageSquare, Utensils } from 'lucide-react';
import { Restaurant, RestaurantReview } from '../types/foodDelivery';
import { soundManager } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  onSubmitReview: (review: RestaurantReview, bonusPoints: number) => void;
}

const COMPLIMENT_TAGS = [
  'Steaming Hot on Arrival',
  'Pristine Freshness',
  'Eco-Friendly Packaging',
  'Generous Portions',
  'Accurate Special Notes',
  'Masterful Flavor Balance'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [foodRating, setFoodRating] = useState(5);
  const [speedRating, setSpeedRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [dishRecommended, setDishRecommended] = useState(restaurant.menu[0]?.name || '');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('Alex M.');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Pristine Freshness', 'Eco-Friendly Packaging']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReview: RestaurantReview = {
      id: `rev-${Date.now()}`,
      restaurantId: restaurant.id,
      author: authorName.trim() || 'Verified Diner',
      authorLocation: 'Downtown',
      rating,
      date: 'Just now',
      dishRecommended,
      comment: comment.trim() || 'Exceptional craftsmanship. The flavors were fresh and authentic.',
      tags: selectedTags,
      helpfulCount: 1,
      verifiedOrder: true
    };

    setTimeout(() => {
      setIsSubmitting(false);
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }

      onSubmitReview(newReview, 50); // 50 bonus loyalty points
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-[#11131a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Review {restaurant.name}
              </h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Customer Review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Bonus Points Callout */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">
              Earn <strong>+50 SavorClub loyalty points</strong> for submitting your genuine feedback and helping local artisans.
            </p>
          </div>

          {/* Primary Star Rating */}
          <div className="text-center space-y-2 py-2">
            <label className="block text-xs font-semibold text-zinc-300">
              Overall Experience Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-zinc-700 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-amber-400 font-semibold font-mono">
              {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Very Good (4/5)' : rating === 3 ? 'Average (3/5)' : 'Needs Improvement'}
            </span>
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <div className="text-center">
              <span className="text-zinc-400 block text-[11px] mb-1">Food Taste</span>
              <div className="flex justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setFoodRating(s)}
                    className="cursor-pointer"
                  >
                    <Star className={`w-3 h-3 ${foodRating >= s ? 'fill-amber-400' : 'text-zinc-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-zinc-400 block text-[11px] mb-1">Packaging</span>
              <div className="flex justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setPackagingRating(s)}
                    className="cursor-pointer"
                  >
                    <Star className={`w-3 h-3 ${packagingRating >= s ? 'fill-amber-400' : 'text-zinc-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-zinc-400 block text-[11px] mb-1">Delivery Speed</span>
              <div className="flex justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSpeedRating(s)}
                    className="cursor-pointer"
                  >
                    <Star className={`w-3 h-3 ${speedRating >= s ? 'fill-amber-400' : 'text-zinc-700'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Dish */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Dish to Fellow Diners</span>
            </label>
            <select
              value={dishRecommended}
              onChange={(e) => setDishRecommended(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {restaurant.menu.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Compliments Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Select What Stood Out
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMPLIMENT_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the flavors, presentation, packaging temperature..."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <span>Publish Review & Claim +50 Savor Points</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
