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

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-3 py-4 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-netflix-white flex items-center gap-2">
          <span className="w-1 h-5 bg-netflix-red rounded-full inline-block" />
          {title}
        </h2>
        <span className="text-xs text-netflix-light-grey hover:text-netflix-red transition-colors cursor-pointer font-medium">
          See All &rarr;
        </span>
      </div>

      {/* Row Carousel Container */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Scroll Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-netflix-black/80 hover:bg-netflix-red text-netflix-white p-2 rounded-r-md opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus:outline-none backdrop-blur-sm"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Events Row */}
        <div
          ref={rowRef}
          className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-3 scroll-smooth"
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isBookmarked={bookmarkedIds.has(event.id)}
              onSelect={onSelectEvent}
              onBuyTickets={onBuyTickets}
              onToggleBookmark={onToggleBookmark}
              onWatchTrailer={onWatchTrailer}
            />
          ))}
        </div>

        {/* Scroll Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-netflix-black/80 hover:bg-netflix-red text-netflix-white p-2 rounded-l-md opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus:outline-none backdrop-blur-sm"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
