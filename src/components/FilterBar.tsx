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
  const cities = ['All Locations', 'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Las Vegas, NV', 'Austin, TX', 'Miami, FL'];

  return (
    <div className="bg-netflix-dark-grey p-4 rounded-md border border-white/5 space-y-4 shadow-lg text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2 text-netflix-white font-bold">
          <SlidersHorizontal className="w-4 h-4 text-netflix-red" />
          <span className="text-sm">Filter & Search Events</span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-netflix-light-grey hover:text-netflix-red transition-colors text-[11px] font-semibold"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div className="space-y-1.5">
          <label className="text-netflix-light-grey flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-netflix-red" />
            Location / City
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
            className="w-full bg-netflix-black text-netflix-white py-2 px-3 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
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
          <label className="text-netflix-light-grey flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-netflix-red" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as any })}
            className="w-full bg-netflix-black text-netflix-white py-2 px-3 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
          >
            <option value="all">Anytime</option>
            <option value="tonight">Live Tonight</option>
            <option value="weekend">This Weekend</option>
            <option value="month">Next 30 Days</option>
          </select>
        </div>

        {/* Price Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-netflix-light-grey font-medium">
            <label className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-netflix-red" />
              Max Price:
            </label>
            <span className="text-netflix-white font-bold">${filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min={50}
            max={600}
            step={25}
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-netflix-red cursor-pointer h-1.5 bg-netflix-black rounded-lg"
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label className="text-netflix-light-grey flex items-center gap-1 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-netflix-red" />
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="w-full bg-netflix-black text-netflix-white py-2 px-3 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
          >
            <option value="match">Highest Match %</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="date">Date: Soonest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
