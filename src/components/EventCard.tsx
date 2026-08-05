import React from 'react';
import { Calendar, MapPin, Crown, Sparkles, Star, Heart, Play } from 'lucide-react';
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
      className="group relative flex-none w-64 sm:w-72 bg-[#161616] rounded-md overflow-hidden cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-105 hover:z-30 border border-white/5 hover:border-[#C5A059]/40 shadow-xl"
    >
      {/* Event Poster Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark subtle gradient overlay at bottom of poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/40" />

        {/* Match / Live Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          {event.isLive ? (
            <span className="bg-[#C5A059] text-[#0B0B0B] text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-md">
              <Crown className="w-3 h-3 fill-[#0B0B0B]" />
              ROYAL LOUNGE
            </span>
          ) : event.matchPercentage >= 95 ? (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 fill-white" />
              {event.matchPercentage}% Match
            </span>
          ) : null}
        </div>

        {/* Bookmark Heart Button & Rating */}
        <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(event);
              }}
              className={`p-1.5 rounded-md backdrop-blur-md transition-all ${
                isBookmarked
                  ? 'bg-[#C5A059] text-[#0B0B0B]'
                  : 'bg-[#0B0B0B]/70 text-[#A0A0A0] hover:text-white'
              }`}
              title={isBookmarked ? 'Remove from VIP List' : 'Save to VIP List'}
            >
              <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#0B0B0B]' : ''}`} />
            </button>
          )}

          <div className="bg-[#0B0B0B]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{event.rating.replace(' ★', '')}</span>
          </div>
        </div>

        {/* Hover Trailer Play Button */}
        {onWatchTrailer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(event);
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          >
            <div className="w-10 h-10 bg-[#C5A059] text-[#0B0B0B] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-[#0B0B0B] ml-0.5" />
            </div>
          </button>
        )}
      </div>

      {/* Card Content - Flat Cinematic Luxury Aesthetic (#161616 background) */}
      <div className="p-3.5 space-y-2 bg-[#161616] text-white">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-[11px] text-[#A0A0A0] font-medium">
          <span className="text-[#C5A059] font-semibold uppercase tracking-wider text-[10px]">
            {event.category}
          </span>
          <span className="flex items-center gap-1 text-[#A0A0A0]">
            <Calendar className="w-3 h-3 text-[#A0A0A0]" />
            {event.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1 group-hover:text-[#C5A059] transition-colors duration-200 font-serif">
          {event.title}
        </h3>

        {/* Venue & Location */}
        <div className="flex items-center space-x-1 text-xs text-[#A0A0A0] line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-[#A0A0A0] shrink-0" />
          <span>{event.venue}, {event.location}</span>
        </div>

        {/* Footer Row: Price & 1-Tap Reserve Button */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[#A0A0A0]">VIP Pass</span>
            <span className="text-xs font-black text-[#C5A059]">{event.price}</span>
          </div>

          {/* Quick Reserve Button - #C5A059 Champagne Gold rounded-md */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyTickets(event);
            }}
            className="flex items-center space-x-1.5 bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] text-xs font-extrabold px-3 py-1.5 rounded-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider shadow-md"
          >
            <Crown className="w-3.5 h-3.5 fill-[#0B0B0B]" />
            <span>1-Tap Reserve</span>
          </button>
        </div>
      </div>
    </div>
  );
};
