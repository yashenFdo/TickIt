import React from 'react';
import { Crown, Info, Calendar, MapPin, Sparkles, Clock, Play, Heart, ShieldCheck } from 'lucide-react';
import type { EventItem } from '../data/events';

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
    <div className="relative w-full h-[82vh] min-h-[560px] max-h-[780px] overflow-hidden bg-[#0B0B0B] select-none">
      {/* Background Image with Cinematic Luxury Gradient Masking */}
      <div className="absolute inset-0">
        <img
          src={event.backdropUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-85 animate-fade-in"
        />
        {/* Dark Classic Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent z-10" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0B0B0B]/90 to-transparent z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-4">
          {/* Top VIP Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold tracking-wider">
            {/* VIP Royal Pass Badge */}
            <span className="bg-[#C5A059] text-[#0B0B0B] font-extrabold px-3 py-1 rounded-md flex items-center gap-1.5 uppercase text-[10px] shadow-md">
              <Crown className="w-3.5 h-3.5 fill-[#0B0B0B]" />
              ROYAL VIP SELECTION
            </span>

            <span className="text-[#A0A0A0]">•</span>

            {/* Category Tag */}
            <span className="bg-[#161616]/90 border border-[#C5A059]/30 text-white px-2.5 py-1 rounded-md uppercase tracking-wider text-[10px]">
              {event.category}
            </span>

            {/* Match percentage */}
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              {event.matchPercentage}% VIP Match
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-serif drop-shadow-md leading-none">
              {event.title}
            </h1>
            <p className="text-base sm:text-xl font-medium text-[#C5A059] font-sans">
              {event.subtitle}
            </p>
          </div>

          {/* Date, Time & Venue Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90 py-1">
            <div className="flex items-center space-x-1.5 bg-[#161616]/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#C5A059]/20">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>{event.date}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#161616]/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#C5A059]/20">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#161616]/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#C5A059]/20">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>{event.venue}, {event.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A0A0A0] line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {event.description}
          </p>

          {/* VIP Perks Included */}
          {event.vipPerks && event.vipPerks.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              {event.vipPerks.map((perk) => (
                <span key={perk} className="bg-[#161616] text-[#C5A059] border border-[#C5A059]/30 px-2.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  {perk}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons - 1-Tap Gold Concierge CTA */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* 1-Tap Concierge Reserve Button - #C5A059 Champagne Gold */}
            <button
              onClick={() => onGetTickets(event)}
              className="flex items-center space-x-2 bg.5 bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] text-sm sm:text-base font-black px-7 py-3.5 rounded-md transition-all duration-200 active:scale-95 shadow-xl group cursor-pointer uppercase tracking-wider"
            >
              <Crown className="w-5 h-5 fill-[#0B0B0B]" />
              <span>1-Tap VIP Concierge Reserve ({event.price})</span>
            </button>

            {/* Watch Trailer Button */}
            {onWatchTrailer && (
              <button
                onClick={() => onWatchTrailer(event)}
                className="flex items-center space-x-2 bg-white text-black hover:bg-white/90 text-sm sm:text-base font-bold px-5 py-3.5 rounded-md transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Trailer</span>
              </button>
            )}

            {/* Bookmark Heart Button */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(event)}
                className={`p-3.5 rounded-md transition-all active:scale-95 cursor-pointer border ${
                  isBookmarked
                    ? 'bg-[#C5A059] text-[#0B0B0B] border-[#C5A059]'
                    : 'bg-[#161616]/90 text-[#A0A0A0] hover:text-white border-white/20'
                }`}
                title={isBookmarked ? 'Saved in VIP List' : 'Save to VIP List'}
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-[#0B0B0B]' : ''}`} />
              </button>
            )}

            {/* Secondary Details Button */}
            <button
              onClick={() => onMoreInfo(event)}
              className="flex items-center space-x-2 bg-[#161616]/90 hover:bg-[#161616] text-white text-sm sm:text-base font-semibold px-5 py-3.5 rounded-md transition-all duration-200 border border-[#C5A059]/30 hover:border-[#C5A059] active:scale-95 cursor-pointer"
            >
              <Info className="w-5 h-5 text-[#A0A0A0]" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
