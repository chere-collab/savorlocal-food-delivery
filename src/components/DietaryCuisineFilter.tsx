import React from 'react';
import { Search, SlidersHorizontal, Sparkles, Clock, Check, X } from 'lucide-react';
import { DietaryPreference, CuisineType } from '../types/foodDelivery';

interface DietaryCuisineFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDietary: DietaryPreference;
  setSelectedDietary: (diet: DietaryPreference) => void;
  selectedCuisine: CuisineType;
  setSelectedCuisine: (cuisine: CuisineType) => void;
  sortBy: 'recommended' | 'rating' | 'speed' | 'fee';
  setSortBy: (sort: 'recommended' | 'rating' | 'speed' | 'fee') => void;
  maxDeliveryTime: number | null;
  setMaxDeliveryTime: (time: number | null) => void;
  selectedPriceLevel: string | null;
  setSelectedPriceLevel: (level: string | null) => void;
}

const DIETARY_OPTIONS: { id: DietaryPreference; label: string; description: string }[] = [
  { id: 'all', label: 'All Preferences', description: 'Show all handcrafted eateries' },
  { id: 'vegan', label: '100% Vegan', description: 'Zero animal ingredients' },
  { id: 'vegetarian', label: 'Vegetarian', description: 'Meat-free dishes' },
  { id: 'gluten-free', label: 'Gluten-Free', description: 'Celiac safe & wheat-free' },
  { id: 'halal', label: 'Halal Certified', description: 'Certified halal poultry & beef' },
  { id: 'kosher', label: 'Kosher', description: 'Kosher prepared & supervised' },
  { id: 'dairy-free', label: 'Dairy-Free', description: 'Plant milk & lactose-free' },
  { id: 'nut-free', label: 'Nut-Free', description: 'Tree nut & peanut safe' },
  { id: 'keto', label: 'Keto / Low-Carb', description: 'High healthy fat & protein' },
];

const CUISINE_OPTIONS: CuisineType[] = [
  'All Cuisines',
  'Italian',
  'Japanese',
  'Plant-Forward',
  'Mexican',
  'Indian',
];

export const DietaryCuisineFilter: React.FC<DietaryCuisineFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDietary,
  setSelectedDietary,
  selectedCuisine,
  setSelectedCuisine,
  sortBy,
  setSortBy,
  maxDeliveryTime,
  setMaxDeliveryTime,
  selectedPriceLevel,
  setSelectedPriceLevel,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  const activeFiltersCount = 
    (selectedDietary !== 'all' ? 1 : 0) +
    (selectedCuisine !== 'All Cuisines' ? 1 : 0) +
    (maxDeliveryTime ? 1 : 0) +
    (selectedPriceLevel ? 1 : 0) +
    (sortBy !== 'recommended' ? 1 : 0);

  const resetFilters = () => {
    setSelectedDietary('all');
    setSelectedCuisine('All Cuisines');
    setMaxDeliveryTime(null);
    setSelectedPriceLevel(null);
    setSortBy('recommended');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input and Filter Trigger */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sourdough pizza, bluefin tuna, vegan bowls, birria tacos..."
            className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Drawer Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
            showAdvancedFilters || activeFiltersCount > 0
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Dietary Preferences Filter Row (Horizontal Scrolling Interactive Segmented Control) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-400">Dietary Preferences</span>
          {selectedDietary !== 'all' && (
            <button
              onClick={() => setSelectedDietary('all')}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              Clear dietary
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = selectedDietary === diet.id;
            return (
              <button
                key={diet.id}
                onClick={() => setSelectedDietary(diet.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-black font-semibold shadow-sm'
                    : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
                title={diet.description}
              >
                {diet.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuisine Quick Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CUISINE_OPTIONS.map((cuisine) => {
          const isSelected = selectedCuisine === cuisine;
          return (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-zinc-200 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              {cuisine}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Collapse Panel */}
      {showAdvancedFilters && (
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Sort by */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Sort Restaurants By</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'rating', label: 'Highest Rated' },
                  { id: 'speed', label: 'Fastest ETA' },
                  { id: 'fee', label: 'Lowest Fee' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSortBy(item.id as typeof sortBy)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      sortBy === item.id
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 font-medium'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Delivery Time */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Delivery Speed</label>
              <div className="flex gap-1.5">
                {[
                  { value: null, label: 'Any' },
                  { value: 25, label: '< 25m' },
                  { value: 35, label: '< 35m' },
                  { value: 45, label: '< 45m' },
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setMaxDeliveryTime(t.value)}
                    className={`flex-1 px-2 py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      maxDeliveryTime === t.value
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 font-medium'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1.5">Price Level</label>
              <div className="flex gap-1.5">
                {[
                  { value: null, label: 'All' },
                  { value: '$', label: '$' },
                  { value: '$$', label: '$$' },
                  { value: '$$$', label: '$$$' },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSelectedPriceLevel(p.value)}
                    className={`flex-1 px-2 py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedPriceLevel === p.value
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 font-medium'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Reset Action */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Reset all filters ({activeFiltersCount} applied)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
