import React from 'react';
import { Calendar, MapPin, Ticket, Sparkles, Star, Heart, Play } from 'lucide-react';
import type { EventItem } from '../data/events';

interface EventCardProps {
  event: EventItem;
  isBookmarked?: boolean;
  onSelect: (event: EventItem) => void;
  onBuyTickets: (event: EventItem) => void;
  onToggleBookmark?: (event: EventItem) => void;
  onWatchTrailer?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isBookmarked = false,
  onSelect,
  onBuyTickets,
  onToggleBookmark,
  onWatchTrailer,
}) => {
  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative w-full bg-netflix-dark-grey rounded-md overflow-hidden cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-[1.03] hover:z-30 border border-white/0 hover:border-netflix-red/20 shadow-sm hover:shadow-xl"
    >
      {/* Poster Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-transparent to-black/30" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          {event.isLive ? (
            <span className="bg-netflix-red text-netflix-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </span>
          ) : event.matchPercentage >= 95 ? (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 fill-white" />
              {event.matchPercentage}%
            </span>
          ) : null}
        </div>

        {/* Bookmark + Rating */}
        <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(event); }}
              className={`p-1.5 rounded-md backdrop-blur-md transition-all ${
                isBookmarked
                  ? 'bg-netflix-red text-netflix-white'
                  : 'bg-netflix-black/70 text-netflix-light-grey hover:text-white'
              }`}
              title={isBookmarked ? 'Remove from My List' : 'Add to My List'}
            >
              <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          )}
          <div className="bg-netflix-black/80 backdrop-blur-sm text-netflix-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{event.rating.replace(' ★', '')}</span>
          </div>
        </div>

        {/* Hover Play */}
        {onWatchTrailer && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onWatchTrailer(event); }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          >
            <div className="w-10 h-10 bg-netflix-red/90 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-3.5 space-y-2 bg-netflix-dark-grey">
        <div className="flex items-center justify-between text-[11px] text-netflix-light-grey font-medium">
          <span className="text-netflix-red font-semibold uppercase tracking-wider text-[10px] truncate max-w-[60%]">
            {event.category}
          </span>
          <span className="flex items-center gap-1 text-netflix-light-grey shrink-0">
            <Calendar className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{event.date}</span>
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold tracking-tight text-netflix-white line-clamp-1 group-hover:text-netflix-red transition-colors duration-200">
          {event.title}
        </h3>

        <div className="flex items-center space-x-1 text-xs text-netflix-light-grey line-clamp-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{event.venue}, {event.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-netflix-light-grey">From</span>
            <span className="text-xs sm:text-sm font-bold text-netflix-white">{event.price}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBuyTickets(event); }}
            className="flex items-center space-x-1 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-md transition-all active:scale-95 cursor-pointer"
          >
            <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
};
