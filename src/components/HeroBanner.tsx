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
    /**
     * Height strategy:
     *  - Mobile: tall enough to show content under the 64px navbar, min 600px
     *  - sm+: viewport-based, capped at 800px
     * The top gradient covers the navbar overlap (Netflix convention).
     */
    <div className="relative w-full min-h-[600px] h-[92vh] sm:h-[84vh] sm:max-h-[800px] overflow-hidden bg-netflix-black select-none">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={event.backdropUrl}
          alt={event.title}
          className="w-full h-full object-cover object-top sm:object-center brightness-75 scale-[1.03]"
          loading="eager"
        />
        {/* Left gradient — desktop: from left, mobile: full cover */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent md:w-3/4 z-10" />
        {/* Bottom fade to page background */}
        <div className="absolute inset-x-0 bottom-0 h-56 sm:h-48 bg-gradient-to-t from-netflix-black via-netflix-black/70 to-transparent z-10" />
        {/* Top fade — covers the fixed navbar area (64px mobile / 72px desktop) */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-black to-transparent z-10" />
      </div>

      {/* Content — padded top to sit below navbar */}
      <div className="relative z-20 h-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 sm:pb-16 lg:pb-24 pt-20 sm:pt-24">
        <div className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              {event.matchPercentage}% Match
            </span>
            <span className="text-netflix-light-grey">•</span>
            <span className="bg-netflix-dark-grey/80 border border-white/15 text-white px-2.5 py-0.5 rounded uppercase tracking-wider text-[10px]">
              {event.category}
            </span>
            <span className="bg-netflix-dark-grey text-netflix-light-grey px-2 py-0.5 rounded border border-white/20 text-[10px]">
              {event.ageRating}
            </span>
            <span className="bg-netflix-red/20 text-netflix-red border border-netflix-red/40 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              <Flame className="w-3 h-3 fill-netflix-red" />
              {event.ticketsRemaining} left
            </span>
            <CountdownTicker targetHours={3} />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white uppercase leading-[1.05] drop-shadow-lg">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-medium text-netflix-light-grey line-clamp-2 sm:line-clamp-none">
            {event.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1.5 bg-netflix-dark-grey/70 backdrop-blur-sm px-2.5 py-1.5 rounded">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-netflix-red shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-netflix-dark-grey/70 backdrop-blur-sm px-2.5 py-1.5 rounded">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-netflix-red shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-netflix-dark-grey/70 backdrop-blur-sm px-2.5 py-1.5 rounded min-w-0">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-netflix-red shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-none">{event.venue}, {event.location}</span>
            </div>
          </div>

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-white font-semibold shrink-0">
                <Users className="w-4 h-4 text-netflix-red" />
                Speakers:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {event.speakers.map((sp) => (
                  <span key={sp.name} className="bg-netflix-dark-grey/90 text-white text-[11px] px-2 py-0.5 rounded border border-white/10">
                    {sp.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-white font-semibold shrink-0">
                <Award className="w-4 h-4 text-netflix-red" />
                Sponsors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {event.sponsors.map((sp) => (
                  <span key={sp.name} className="bg-netflix-dark-grey/90 text-netflix-light-grey text-[10px] px-2 py-0.5 rounded border border-white/10">
                    {sp.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description — hidden on very small screens to save space */}
          <p className="hidden sm:block text-xs sm:text-sm text-netflix-light-grey line-clamp-3 leading-relaxed">
            {event.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <button
              onClick={() => onGetTickets(event)}
              className="flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white text-sm sm:text-base font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded transition-all duration-200 active:scale-95 shadow-lg cursor-pointer group"
            >
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 fill-white group-hover:rotate-12 transition-transform" />
              1-Tap Reserve ({event.price})
            </button>

            {onWatchTrailer && (
              <button
                onClick={() => onWatchTrailer(event)}
                className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-sm sm:text-base font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                Trailer
              </button>
            )}

            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(event)}
                className={`p-2.5 sm:p-3 rounded transition-all active:scale-95 cursor-pointer border ${
                  isBookmarked
                    ? 'bg-netflix-red text-white border-netflix-red'
                    : 'bg-netflix-dark-grey/90 text-netflix-light-grey hover:text-white border-white/20 hover:border-white/50'
                }`}
                title={isBookmarked ? 'Saved in My List' : 'Add to My List'}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>
            )}

            <button
              onClick={() => onMoreInfo(event)}
              className="flex items-center gap-2 bg-netflix-dark-grey/90 hover:bg-netflix-dark-grey text-white text-sm sm:text-base font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded transition-all duration-200 border border-white/15 hover:border-white/40 active:scale-95 cursor-pointer"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-netflix-light-grey" />
              <span className="hidden xs:inline">Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
