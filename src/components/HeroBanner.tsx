import React from 'react';
import { Ticket, Info, Calendar, MapPin, Sparkles, Clock, Play, Heart, Flame, Users, Award } from 'lucide-react';
import type { EventItem } from '../data/events';
import { CountdownTicker } from './CountdownTicker';

interface HeroBannerProps {
  event: EventItem;
  isBookmarked?: boolean;
  onGetTickets: (event: EventItem) => void;
  onMoreInfo: (event: EventItem) => void;
  onWatchTrailer?: (event: EventItem) => void;
  onToggleBookmark?: (event: EventItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  event,
  isBookmarked = false,
  onGetTickets,
  onMoreInfo,
  onWatchTrailer,
  onToggleBookmark,
}) => {
  return (
    <div className="relative w-full h-[82vh] min-h-[560px] max-h-[780px] overflow-hidden bg-netflix-black select-none">
      {/* Background Image with Cinematic Gradient Masking */}
      <div className="absolute inset-0">
        <img
          src={event.backdropUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 animate-fade-in"
        />
        {/* Dark Netflix Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/75 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-transparent z-10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-netflix-black/90 to-transparent z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-4">
          {/* Top Badges & Live Countdown Ticker */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold tracking-wider">
            {/* Netflix Match Percentage */}
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              {event.matchPercentage}% Match for You
            </span>

            <span className="text-netflix-light-grey">•</span>

            {/* Category Tag */}
            <span className="bg-netflix-dark-grey/80 border border-netflix-light-grey/20 text-netflix-white px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
              {event.category}
            </span>

            {/* Age Rating Badge */}
            <span className="bg-netflix-dark-grey text-netflix-light-grey px-2 py-0.5 rounded-sm border border-netflix-light-grey/30 text-[10px]">
              {event.ageRating}
            </span>

            {/* Tickets remaining indicator */}
            <span className="bg-netflix-red/20 text-netflix-red border border-netflix-red/40 px-2.5 py-0.5 rounded-md text-[10px] flex items-center gap-1">
              <Flame className="w-3 h-3 fill-netflix-red" />
              Only {event.ticketsRemaining} Tickets Left!
            </span>

            {/* Countdown Ticker */}
            <CountdownTicker targetHours={3} />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-netflix-white uppercase font-sans drop-shadow-md leading-none">
              {event.title}
            </h1>
            <p className="text-base sm:text-xl font-medium text-netflix-light-grey">
              {event.subtitle}
            </p>
          </div>

          {/* Date, Time & Venue Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-netflix-white/90 py-1">
            <div className="flex items-center space-x-1.5 bg-netflix-dark-grey/70 backdrop-blur-sm px-3 py-1.5 rounded-md">
              <Calendar className="w-4 h-4 text-netflix-red" />
              <span>{event.date}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-netflix-dark-grey/70 backdrop-blur-sm px-3 py-1.5 rounded-md">
              <Clock className="w-4 h-4 text-netflix-red" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-netflix-dark-grey/70 backdrop-blur-sm px-3 py-1.5 rounded-md">
              <MapPin className="w-4 h-4 text-netflix-red" />
              <span>{event.venue}, {event.location}</span>
            </div>
          </div>

          {/* Speakers Pill Bar */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-netflix-light-grey">
              <Users className="w-4 h-4 text-netflix-red shrink-0" />
              <span className="font-semibold text-netflix-white">Speakers:</span>
              <div className="flex flex-wrap gap-1.5">
                {event.speakers.map((sp) => (
                  <span key={sp.name} className="bg-netflix-dark-grey/90 text-netflix-white text-[11px] px-2 py-0.5 rounded border border-white/10">
                    {sp.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Official Sponsors Badge Bar */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-netflix-light-grey">
              <Award className="w-4 h-4 text-netflix-red shrink-0" />
              <span className="font-semibold text-netflix-white">Sponsors:</span>
              <div className="flex flex-wrap gap-1.5">
                {event.sponsors.map((sp) => (
                  <span key={sp.name} className="bg-netflix-dark-grey/90 text-netflix-light-grey text-[10px] px-2 py-0.5 rounded border border-white/10">
                    {sp.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-netflix-light-grey line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {event.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Primary Express Ticket Button */}
            <button
              onClick={() => onGetTickets(event)}
              className="flex items-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white text-sm sm:text-base font-bold px-6 py-3 rounded-md transition-all duration-200 active:scale-95 shadow-md group cursor-pointer"
            >
              <Ticket className="w-5 h-5 fill-netflix-white group-hover:rotate-12 transition-transform duration-200" />
              <span>1-Tap Reserve ({event.price})</span>
            </button>

            {/* Watch Trailer Button */}
            {onWatchTrailer && (
              <button
                onClick={() => onWatchTrailer(event)}
                className="flex items-center space-x-2 bg-netflix-white text-netflix-black hover:bg-netflix-white/90 text-sm sm:text-base font-bold px-5 py-3 rounded-md transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
              >
                <Play className="w-5 h-5 fill-netflix-black" />
                <span>Trailer</span>
              </button>
            )}

            {/* Bookmark Heart Button */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(event)}
                className={`p-3 rounded-md transition-all active:scale-95 cursor-pointer border ${
                  isBookmarked
                    ? 'bg-netflix-red text-netflix-white border-netflix-red'
                    : 'bg-netflix-dark-grey/90 text-netflix-light-grey hover:text-white border-white/20'
                }`}
                title={isBookmarked ? 'Saved in My List' : 'Add to My List'}
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>
            )}

            {/* Secondary Details Button */}
            <button
              onClick={() => onMoreInfo(event)}
              className="flex items-center space-x-2 bg-netflix-dark-grey/90 hover:bg-netflix-dark-grey text-netflix-white text-sm sm:text-base font-semibold px-5 py-3 rounded-md transition-all duration-200 border border-netflix-light-grey/20 hover:border-netflix-light-grey/50 active:scale-95 cursor-pointer"
            >
              <Info className="w-5 h-5 text-netflix-light-grey" />
              <span>Speakers & Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
