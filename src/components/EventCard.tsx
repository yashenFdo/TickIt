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
      className="group relative w-full bg-netflix-dark-grey rounded overflow-hidden cursor-pointer select-none
        transition-all duration-300 ease-out hover:scale-[1.04] hover:z-30 hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Poster */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        <img
          src={event.posterUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-transparent to-black/20" />

        {/* Top-left badge */}
        <div className="absolute top-2 left-2 z-10">
          {event.isLive ? (
            <span className="bg-netflix-red text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />LIVE
            </span>
          ) : event.matchPercentage >= 95 ? (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 fill-white" />{event.matchPercentage}%
            </span>
          ) : null}
        </div>

        {/* Top-right: bookmark + rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleBookmark(event); }}
              className={`p-1.5 rounded backdrop-blur-md transition-all ${
                isBookmarked ? 'bg-netflix-red text-white' : 'bg-black/70 text-netflix-light-grey hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          )}
          <div className="bg-black/75 backdrop-blur-sm text-white text-[11px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {event.rating.replace(' ★', '')}
          </div>
        </div>

        {/* Hover play button */}
        {onWatchTrailer && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onWatchTrailer(event); }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          >
            <div className="w-11 h-11 bg-netflix-red/90 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-netflix-red font-semibold uppercase tracking-wider text-[10px] truncate max-w-[55%]">
            {event.category}
          </span>
          <span className="flex items-center gap-1 text-netflix-light-grey text-[10px] shrink-0">
            <Calendar className="w-3 h-3" />
            <span className="truncate max-w-[90px]">{event.date}</span>
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-netflix-red transition-colors duration-200">
          {event.title}
        </h3>

        <div className="flex items-center gap-1 text-[11px] text-netflix-light-grey">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{event.venue}, {event.location}</span>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-netflix-light-grey">From</div>
            <div className="text-sm font-bold text-white">{event.price}</div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onBuyTickets(event); }}
            className="flex items-center gap-1 bg-netflix-red hover:bg-red-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded transition-all active:scale-95 cursor-pointer"
          >
            <Ticket className="w-3 h-3" />
            Tickets
          </button>
        </div>
      </div>
    </div>
  );
};
