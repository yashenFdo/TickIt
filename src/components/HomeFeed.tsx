import React from 'react';
import { Zap, Flame, Sparkles, Star, Calendar, MapPin, Ticket, Heart, Play, TrendingUp, Clock } from 'lucide-react';
import { SPOTLIGHT_EVENTS } from '../data/events';
import type { EventItem } from '../data/events';

interface HomeFeedProps {
  bookmarkedIds: Set<string>;
  onSelectEvent: (event: EventItem) => void;
  onToggleBookmark: (event: EventItem) => void;
  onWatchTrailer: (event: EventItem) => void;
}

/* ── Small badge helper ───────────────────── */
const LiveBadge = () => (
  <span className="inline-flex items-center gap-1 bg-netflix-red text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />LIVE
  </span>
);
const NewBadge = () => (
  <span className="inline-flex items-center bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">NEW</span>
);
const TrendBadge = () => (
  <span className="inline-flex items-center gap-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
    <TrendingUp className="w-2.5 h-2.5" />HOT
  </span>
);

/* ── Spotlight / Wide card (used for hero-feed row) ── */
const SpotlightCard: React.FC<{
  event: EventItem;
  isBookmarked: boolean;
  onSelect: (e: EventItem) => void;
  onToggleBookmark: (e: EventItem) => void;
  onWatchTrailer: (e: EventItem) => void;
}> = ({ event, isBookmarked, onSelect, onToggleBookmark, onWatchTrailer }) => (
  <div
    onClick={() => onSelect(event)}
    className="relative overflow-hidden rounded-md cursor-pointer group select-none
      transition-transform duration-300 hover:scale-[1.02] hover:z-20 hover:shadow-2xl hover:shadow-black/70"
  >
    {/* Image */}
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <img
        src={event.backdropUrl}
        alt={event.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
        {event.isLive && <LiveBadge />}
        {event.isNew && !event.isLive && <NewBadge />}
        {event.isTrending && !event.isLive && <TrendBadge />}
      </div>

      {/* Bookmark */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleBookmark(event); }}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded backdrop-blur-md transition-all ${
          isBookmarked ? 'bg-netflix-red text-white' : 'bg-black/60 text-white/70 hover:text-white hover:bg-netflix-red/70'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
      </button>

      {/* Trailer play */}
      <button
        onClick={(e) => { e.stopPropagation(); onWatchTrailer(event); }}
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-netflix-red hover:border-netflix-red transition-all">
          <Play className="w-5 h-5 fill-white ml-0.5" />
        </div>
      </button>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-white/70">
          <span className="font-bold text-netflix-red uppercase tracking-wider">{event.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{event.rating.replace(' ★','')}</span>
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight line-clamp-2 uppercase tracking-tight">
          {event.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/60">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-netflix-red" />{event.date}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-netflix-red" />{event.venue}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-white">{event.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(event); }}
            className="flex items-center gap-1 bg-netflix-red hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded transition-all active:scale-95"
          >
            <Ticket className="w-3 h-3" />Tickets
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ── Compact list card (for "Live Tonight" side list) ── */
const CompactCard: React.FC<{
  event: EventItem;
  isBookmarked: boolean;
  rank?: number;
  onSelect: (e: EventItem) => void;
  onToggleBookmark: (e: EventItem) => void;
}> = ({ event, isBookmarked, rank, onSelect, onToggleBookmark }) => (
  <div
    onClick={() => onSelect(event)}
    className="flex gap-3 p-2.5 rounded cursor-pointer hover:bg-white/5 transition-colors group select-none"
  >
    {/* Rank number */}
    {rank !== undefined && (
      <div className="text-3xl font-black text-white/10 w-6 shrink-0 leading-none self-center tabular-nums">
        {rank}
      </div>
    )}
    {/* Thumbnail */}
    <div className="relative w-[72px] sm:w-20 aspect-video rounded overflow-hidden shrink-0">
      <img src={event.posterUrl} alt={event.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      {event.isLive && (
        <div className="absolute top-1 left-1"><LiveBadge /></div>
      )}
    </div>
    {/* Info */}
    <div className="flex-1 min-w-0 space-y-0.5">
      <span className="text-[10px] font-bold text-netflix-red uppercase tracking-wider">{event.category}</span>
      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">{event.title}</h4>
      <div className="flex items-center gap-2 text-[10px] text-white/50">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
        <span>•</span>
        <span className="font-semibold text-white/70">{event.price}</span>
      </div>
    </div>
    {/* Bookmark */}
    <button
      onClick={(e) => { e.stopPropagation(); onToggleBookmark(event); }}
      className={`shrink-0 self-center p-1.5 rounded transition-all ${
        isBookmarked ? 'text-netflix-red' : 'text-white/30 hover:text-white/70'
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-netflix-red' : ''}`} />
    </button>
  </div>
);

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export const HomeFeed: React.FC<HomeFeedProps> = ({
  bookmarkedIds,
  onSelectEvent,
  onToggleBookmark,
  onWatchTrailer,
}) => {
  const spotlightEvents = SPOTLIGHT_EVENTS;

  return (
    <div className="space-y-10 sm:space-y-14">

      {/* ══════════════════════════════════════════
          SECTION 1: Spotlight — 3 Wide Feature Cards
      ══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-netflix-red px-2 py-1 rounded text-white text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Spotlight
            </div>
            <span className="text-sm text-white/60 hidden sm:block">Editor's Top Picks</span>
          </div>
          <button className="text-xs text-white/40 hover:text-netflix-red transition-colors font-medium">See All →</button>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {spotlightEvents.map((event) => (
              <SpotlightCard
                key={event.id}
                event={event}
                isBookmarked={bookmarkedIds.has(event.id)}
                onSelect={onSelectEvent}
                onToggleBookmark={onToggleBookmark}
                onWatchTrailer={onWatchTrailer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: Live Tonight — Left big + Right list
      ══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2.5 px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center gap-1.5 bg-black border border-netflix-red px-2 py-1 rounded text-netflix-red text-xs font-black uppercase tracking-widest animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-netflix-red" />
            Live Tonight
          </div>
          <span className="text-sm text-white/60 hidden sm:block">Happening right now</span>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          {/* On mobile: stacked. On lg: side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Big featured live event */}
            <div className="lg:col-span-3">
              <SpotlightCard
                event={{ id: 'live-1', title: 'THE WEEKND — AFTER HOURS TIL DAWN', subtitle: 'World Tour Final Show — Live Stadium', category: 'Live Music', date: 'TONIGHT', time: '9:00 PM', venue: 'SoFi Stadium', location: 'Los Angeles, CA', price: '$145', rating: '5.0 ★', matchPercentage: 99, ageRating: '16+', backdropUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop', posterUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=600&auto=format&fit=crop', description: 'The most anticipated stadium tour finale of 2026.', tags: ['Pop', 'RnB'], isLive: true, ticketsRemaining: 3, performers: ['The Weeknd'], sponsors: [{ name: 'Apple Music', tier: 'Partner' }] }}
                isBookmarked={bookmarkedIds.has('live-1')}
                onSelect={onSelectEvent}
                onToggleBookmark={onToggleBookmark}
                onWatchTrailer={onWatchTrailer}
              />
            </div>
            {/* Right column: compact live list */}
            <div className="lg:col-span-2 bg-netflix-dark-grey rounded-md overflow-hidden divide-y divide-white/5">
              <div className="px-3 py-2.5 border-b border-white/5">
                <span className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Also Live Now</span>
              </div>
              {[
                { id: 'live-2', title: 'UFC 310 — MAIN EVENT', subtitle: '', category: 'Sports', date: 'TONIGHT', time: '10:00 PM', venue: 'T-Mobile Arena', location: 'Las Vegas, NV', price: '$250', rating: '4.9 ★', matchPercentage: 93, ageRating: '18+', backdropUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&auto=format&fit=crop', posterUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop', description: 'UFC Heavyweight Championship', tags: ['MMA'], isLive: true, ticketsRemaining: 7, performers: [] },
                { id: 'live-3', title: 'JAZZ UNDER THE STARS', subtitle: '', category: 'Live Music', date: 'TONIGHT', time: '8:30 PM', venue: 'Jackson Square', location: 'New Orleans, LA', price: '$45', rating: '4.8 ★', matchPercentage: 82, ageRating: 'All Ages', backdropUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop', posterUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=600&auto=format&fit=crop', description: 'Live jazz in the French Quarter', tags: ['Jazz'], isLive: true, ticketsRemaining: 18, performers: [] },
                { id: 'live-4', title: 'PREMIER LEAGUE — MAN CITY vs ARSENAL', subtitle: '', category: 'Sports', date: 'TONIGHT', time: '7:45 PM', venue: 'Etihad Stadium', location: 'Manchester, UK', price: '$180', rating: '5.0 ★', matchPercentage: 97, ageRating: 'All Ages', backdropUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', posterUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=600&auto=format&fit=crop', description: 'PL Title Decider', tags: ['Football'], isLive: true, ticketsRemaining: 2, performers: [] },
              ].map((e, i) => (
                <CompactCard
                  key={e.id}
                  event={e}
                  rank={i + 1}
                  isBookmarked={bookmarkedIds.has(e.id)}
                  onSelect={onSelectEvent}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: Top 10 This Week (Netflix-style ranked)
      ══════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2.5 px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded text-white text-xs font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Top 10 This Week
          </div>
        </div>

        {/* Horizontal scroll of big number + card */}
        <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-0 w-max pb-2">
            {[
              { id: 'feat-1', title: 'GLOBAL TECH & AI SUMMIT', posterUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop', price: '$299', category: 'Tech & AI', date: 'AUG 22', isLive: false },
              { id: 'wk-3', title: 'F1 LAS VEGAS GRAND PRIX', posterUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', price: '$495', category: 'Sports', date: 'AUG 9', isLive: false },
              { id: 'tr-1', title: 'SYNTHWAVE NEON NIGHTS', posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', price: '$95', category: 'Live Music', date: 'AUG 15', isLive: false },
              { id: 'wk-1', title: 'COACHELLA WEEK 3', posterUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop', price: '$399', category: 'Festival', date: 'AUG 9', isLive: false },
              { id: 'sp-2', title: 'WIMBLEDON FINAL', posterUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=600&auto=format&fit=crop', price: '$780', category: 'Sports', date: 'AUG 18', isLive: false },
              { id: 'new-4', title: 'COLDPLAY — MUSIC OF SPHERES', posterUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop', price: '$130', category: 'Live Music', date: 'NOV 8', isLive: false },
              { id: 'sp-3', title: 'HAMILTON — BROADWAY RETURN', posterUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=600&auto=format&fit=crop', price: '$425', category: 'Theatre', date: 'OCT 1', isLive: false },
              { id: 'com-1', title: 'DAVE CHAPPELLE SPECIAL', posterUrl: 'https://images.unsplash.com/photo-1537559841448-8cd22c8b40c4?q=80&w=600&auto=format&fit=crop', price: '$95', category: 'Standup', date: 'AUG 20', isLive: false },
              { id: 'tech-1', title: 'APPLE WWDC 2026', posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop', price: '$1,599', category: 'Tech', date: 'SEP 14', isLive: false },
              { id: 'live-4', title: 'PREMIER LEAGUE FINAL', posterUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=600&auto=format&fit=crop', price: '$180', category: 'Sports', date: 'TONIGHT', isLive: true },
            ].map((item, i) => (
              <div
                key={item.id}
                onClick={() => onSelectEvent({ id: item.id, title: item.title, subtitle: '', category: item.category, date: item.date, time: '', venue: '', location: '', price: item.price, rating: '4.8 ★', matchPercentage: 90, ageRating: 'All Ages', backdropUrl: item.posterUrl, posterUrl: item.posterUrl, description: '', tags: [], ticketsRemaining: 10, performers: [] })}
                className="relative flex items-end cursor-pointer group select-none"
              >
                {/* Giant rank number */}
                <span className="text-[72px] sm:text-[96px] font-black leading-none text-stroke-white mr-[-12px] sm:mr-[-18px] relative z-10 select-none"
                  style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)', color: 'transparent' }}>
                  {i + 1}
                </span>
                {/* Card */}
                <div className="w-28 sm:w-36 aspect-[2/3] rounded overflow-hidden relative shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-xl">
                  <img src={item.posterUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 space-y-0.5">
                    <div className="text-[9px] font-bold text-netflix-red uppercase tracking-wider truncate">{item.category}</div>
                    <div className="text-[10px] font-bold text-white line-clamp-2 leading-tight">{item.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/60">{item.date}</span>
                      {item.isLive && <LiveBadge />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
