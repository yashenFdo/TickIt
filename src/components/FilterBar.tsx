import React from 'react';
import { Filter, SlidersHorizontal, MapPin, Calendar, ArrowUpDown, RefreshCw } from 'lucide-react';

export interface FilterState {
  city: string;
  dateRange: 'all' | 'tonight' | 'weekend' | 'month';
  maxPrice: number;
  sortBy: 'match' | 'price-asc' | 'price-desc' | 'date';
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updated: FilterState) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  const cities = ['All Locations', 'Monte Carlo, Monaco', 'London, UK', 'Cannes, France', 'New York, NY', 'Vienna, Austria', 'Aspen, Colorado'];

  return (
    <div className="bg-[#161616] p-4 rounded-md border border-[#C5A059]/20 space-y-4 shadow-xl text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2 text-white font-bold font-serif">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
          <span className="text-sm">Refine VIP Event Selection</span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-[#A0A0A0] hover:text-[#C5A059] transition-colors text-[11px] font-semibold"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div className="space-y-1.5">
          <label className="text-[#A0A0A0] flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            Location / Resort
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
            className="w-full bg-[#0B0B0B] text-white py-2 px-3 rounded-md border border-white/10 focus:border-[#C5A059] focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="space-y-1.5">
          <label className="text-[#A0A0A0] flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as any })}
            className="w-full bg-[#0B0B0B] text-white py-2 px-3 rounded-md border border-white/10 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="all">Anytime</option>
            <option value="tonight">Live Tonight</option>
            <option value="weekend">This Weekend</option>
            <option value="month">Next 30 Days</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[#A0A0A0] font-medium">
            <label className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
              Max Package Price:
            </label>
            <span className="text-[#C5A059] font-bold font-serif">${filters.maxPrice * 50}</span>
          </div>
          <input
            type="range"
            min={50}
            max={600}
            step={25}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-[#C5A059] cursor-pointer h-1.5 bg-[#0B0B0B] rounded-lg"
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label className="text-[#A0A0A0] flex items-center gap-1 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
            Sort Order
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="w-full bg-[#0B0B0B] text-white py-2 px-3 rounded-md border border-white/10 focus:border-[#C5A059] focus:outline-none"
          >
            <option value="match">Highest VIP Match %</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="date">Date: Soonest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
