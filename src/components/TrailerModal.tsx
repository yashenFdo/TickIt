import React, { useState } from 'react';
import { X, Volume2, VolumeX, Ticket, Play, Sparkles, MapPin, Calendar, Star } from 'lucide-react';
import type { EventItem } from '../data/events';

interface TrailerModalProps {
  event: EventItem | null;
  onClose: () => void;
  onGetTickets: (event: EventItem) => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ event, onClose, onGetTickets }) => {
  if (!event) return null;

  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-netflix-black/90 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface - Netflix Dark Grey (#141414) */}
      <div className="relative w-full max-w-4xl bg-netflix-dark-grey text-netflix-white rounded-md overflow-hidden shadow-2xl border border-white/10 my-8">
        {/* Top Controls Overlay */}
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-netflix-black/70 text-netflix-light-grey hover:text-white hover:bg-netflix-red transition-all"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-netflix-red" />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-netflix-black/70 text-netflix-light-grey hover:text-white hover:bg-netflix-red transition-all"
            title="Close Trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Trailer Showcase Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={event.backdropUrl}
            alt={event.title}
            className="w-full h-full object-cover filter brightness-90 animate-pulse scale-105"
          />

          {/* Simulated Video Player Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-black/40 to-transparent" />

          {/* Center Play Indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-netflix-red/90 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.8)] animate-pulse">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>

          {/* Live Audio Spectrum Bar */}
          <div className="absolute bottom-4 left-4 flex items-end space-x-1 z-20">
            <span className="w-1 h-4 bg-netflix-red animate-bounce" />
            <span className="w-1 h-6 bg-white animate-bounce delay-75" />
            <span className="w-1 h-3 bg-netflix-red animate-bounce delay-150" />
            <span className="w-1 h-5 bg-white animate-bounce delay-100" />
            <span className="text-xs font-bold text-netflix-white ml-2">
              Official 4K Cinematic Trailer Preview ({isMuted ? 'Muted' : 'Audio On'})
            </span>
          </div>
        </div>

        {/* Trailer Details Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-netflix-dark-grey">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-netflix-red text-white font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                  {event.category}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
                  {event.matchPercentage}% Match
                </span>
                <span className="text-netflix-light-grey flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {event.rating}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-netflix-white uppercase tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs sm:text-sm text-netflix-light-grey flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-netflix-red" />
                <span>{event.date} • {event.time}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-netflix-red" />
                <span>{event.venue}, {event.location}</span>
              </p>
            </div>

            {/* Action CTA Button - netflix-red rounded-md */}
            <button
              onClick={() => {
                onClose();
                onGetTickets(event);
              }}
              className="flex items-center justify-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-white font-extrabold px-6 py-3 rounded-md transition-all active:scale-95 text-sm cursor-pointer shadow-lg shrink-0"
            >
              <Ticket className="w-4 h-4 fill-white" />
              <span>Get Tickets ({event.price})</span>
            </button>
          </div>

          {/* Performers & Spotlight Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 bg-netflix-black p-3.5 rounded-md border border-white/5">
              <span className="text-netflix-light-grey uppercase font-bold text-[10px]">Headline Performers</span>
              <div className="text-netflix-white font-bold text-sm">{event.performers.join(' • ')}</div>
            </div>

            <div className="space-y-1.5 bg-netflix-black p-3.5 rounded-md border border-white/5">
              <span className="text-netflix-light-grey uppercase font-bold text-[10px]">Experience Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span key={tag} className="bg-netflix-dark-grey text-netflix-light-grey px-2 py-0.5 rounded-md text-[10px] border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
