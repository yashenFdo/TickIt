import React from 'react';
import { Calendar, MapPin, Ticket, Sparkles, Star } from 'lucide-react';
import type { EventItem } from '../data/events';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onBuyTickets: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, onBuyTickets }) => {
  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative flex-none w-64 sm:w-72 bg-netflix-dark-grey rounded-md overflow-hidden cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-105 hover:z-30 border-0"
    >
      {/* Event Poster Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark subtle gradient overlay at bottom of poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-transparent to-black/30" />

        {/* Match / Live Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          {event.isLive ? (
            <span className="bg-netflix-red text-netflix-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE TONIGHT
            </span>
          ) : event.matchPercentage >= 95 ? (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 fill-white" />
              {event.matchPercentage}% Match
            </span>
          ) : null}
        </div>

        {/* Rating Badge Top Right */}
        <div className="absolute top-2 right-2 bg-netflix-black/80 backdrop-blur-sm text-netflix-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{event.rating.replace(' ★', '')}</span>
        </div>
      </div>

      {/* Card Content - Flat Cinematic Aesthetic (#141414 background) */}
      <div className="p-3.5 space-y-2 bg-netflix-dark-grey text-netflix-white">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-[11px] text-netflix-light-grey font-medium">
          <span className="text-netflix-red font-semibold uppercase tracking-wider text-[10px]">
            {event.category}
          </span>
          <span className="flex items-center gap-1 text-netflix-light-grey">
            <Calendar className="w-3 h-3 text-netflix-light-grey" />
            {event.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold tracking-tight text-netflix-white line-clamp-1 group-hover:text-netflix-red transition-colors duration-200">
          {event.title}
        </h3>

        {/* Venue & Location */}
        <div className="flex items-center space-x-1 text-xs text-netflix-light-grey line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-netflix-light-grey shrink-0" />
          <span>{event.venue}, {event.location}</span>
        </div>

        {/* Footer Row: Price & Buy Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-netflix-light-grey">From</span>
            <span className="text-xs font-bold text-netflix-white">{event.price}</span>
          </div>

          {/* Quick Buy Button - netflix-red rounded-md (NO pills) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyTickets(event);
            }}
            className="flex items-center space-x-1 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all active:scale-95 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
};
