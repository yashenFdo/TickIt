import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventItem } from '../data/events';
import { EventCard } from './EventCard';

interface EventRowProps {
  title: string;
  events: EventItem[];
  bookmarkedIds?: Set<string>;
  onSelectEvent: (event: EventItem) => void;
  onBuyTickets: (event: EventItem) => void;
  onToggleBookmark?: (event: EventItem) => void;
  onWatchTrailer?: (event: EventItem) => void;
}

export const EventRow: React.FC<EventRowProps> = ({
  title,
  events,
  bookmarkedIds = new Set(),
  onSelectEvent,
  onBuyTickets,
  onToggleBookmark,
  onWatchTrailer,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-2 py-2 group/row">
      {/* Row header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-netflix-red rounded-full shrink-0 inline-block" />
          {title}
        </h2>
        <button className="text-xs text-netflix-light-grey hover:text-netflix-red transition-colors font-medium whitespace-nowrap">
          See All →
        </button>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/80 hover:bg-netflix-red text-white p-2 rounded-r
            opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus:outline-none backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable row */}
        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {events.map((event) => (
            <div key={event.id} className="flex-none w-[180px] xs:w-[210px] sm:w-[240px] md:w-[260px] lg:w-[280px]">
              <EventCard
                event={event}
                isBookmarked={bookmarkedIds.has(event.id)}
                onSelect={onSelectEvent}
                onBuyTickets={onBuyTickets}
                onToggleBookmark={onToggleBookmark}
                onWatchTrailer={onWatchTrailer}
              />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/80 hover:bg-netflix-red text-white p-2 rounded-l
            opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus:outline-none backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};
