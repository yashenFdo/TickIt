import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { EventRow } from './components/EventRow';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { TrailerModal } from './components/TrailerModal';
import { AuthModal } from './components/AuthModal';
import type { UserProfile } from './components/AuthModal';
import { MyTicketsDrawer } from './components/MyTicketsDrawer';
import type { PurchasedTicket } from './components/MyTicketsDrawer';
import { FilterBar } from './components/FilterBar';
import type { FilterState } from './components/FilterBar';
import { FEATURED_EVENT, EVENTS_BY_CATEGORY, EVENT_CATEGORIES } from './data/events';
import type { EventItem } from './data/events';
import type { SelectedSeat } from './components/SeatPicker';
import { Sparkles, Film, Ticket, ShieldCheck, Zap, Heart, Mail, Phone, MapPin, Globe, ChevronRight, MessageCircle, AtSign, Share2, Video } from 'lucide-react';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [trailerEventModal, setTrailerEventModal] = useState<EventItem | null>(null);
  const [isTicketsDrawerOpen, setIsTicketsDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Yashen Fernando',
    email: 'yashen.fernando@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    provider: 'Google',
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(['feat-1', 'tr-1', 'rec-1'])
  );

  const handleToggleBookmark = (event: EventItem) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.has(event.id) ? next.delete(event.id) : next.add(event.id);
      return next;
    });
  };

  const [filters, setFilters] = useState<FilterState>({
    city: 'All Locations',
    dateRange: 'all',
    maxPrice: 600,
    sortBy: 'match',
  });

  const resetFilters = () => {
    setFilters({ city: 'All Locations', dateRange: 'all', maxPrice: 600, sortBy: 'match' });
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const initialTicketEvent = Object.values(EVENTS_BY_CATEGORY)[0]?.[0] || FEATURED_EVENT;

  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([
    {
      id: 'TK-882194',
      event: initialTicketEvent,
      tier: 'VIP Front Row (VIP-1-2)',
      quantity: 2,
      totalPrice: 190,
      purchaseDate: '2026-08-04',
      customerName: 'Yashen Fernando',
    },
  ]);

  const allEventsList = useMemo(() => {
    const list: EventItem[] = [FEATURED_EVENT];
    Object.values(EVENTS_BY_CATEGORY).forEach((arr) =>
      arr.forEach((item) => {
        if (!list.some((e) => e.id === item.id)) list.push(item);
      })
    );
    return list;
  }, []);

  const filteredEvents = useMemo(() => {
    let result = [...allEventsList];

    if (selectedCategory === 'mylist') {
      result = result.filter((e) => bookmarkedIds.has(e.id));
    } else if (selectedCategory !== 'all') {
      const catObj = EVENT_CATEGORIES.find((c) => c.id === selectedCategory);
      if (catObj) {
        result = result.filter((e) =>
          e.category.toLowerCase().includes(catObj.name.toLowerCase().split(' ')[0])
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.performers.some((p) => p.toLowerCase().includes(q))
      );
    }

    if (filters.city !== 'All Locations') result = result.filter((e) => e.location.includes(filters.city));

    if (filters.dateRange === 'tonight') result = result.filter((e) => e.isLive);
    else if (filters.dateRange === 'weekend') result = result.filter((e) => e.date.includes('SAT') || e.date.includes('SUN'));

    result = result.filter((e) => (parseInt(e.price.replace(/[^0-9]/g, '')) || 50) <= filters.maxPrice);

    result.sort((a, b) => {
      if (filters.sortBy === 'match') return b.matchPercentage - a.matchPercentage;
      const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
      const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
      if (filters.sortBy === 'price-asc') return pA - pB;
      if (filters.sortBy === 'price-desc') return pB - pA;
      return 0;
    });

    return result;
  }, [allEventsList, selectedCategory, searchQuery, filters, bookmarkedIds]);

  const handleConfirmPurchase = (ticketInfo: {
    event: EventItem; tier: string; quantity: number;
    totalPrice: number; seats: SelectedSeat[]; customerName: string;
  }) => {
    setPurchasedTickets((prev) => [{
      id: `TK-${Math.floor(100000 + Math.random() * 900000)}`,
      event: ticketInfo.event,
      tier: ticketInfo.tier,
      quantity: ticketInfo.quantity,
      totalPrice: ticketInfo.totalPrice,
      purchaseDate: new Date().toISOString().split('T')[0],
      seats: ticketInfo.seats,
      customerName: ticketInfo.customerName,
    }, ...prev]);
  };

  const handleRemoveTicket = (id: string) => setPurchasedTickets((prev) => prev.filter((t) => t.id !== id));

  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'all' || filters.city !== 'All Locations' || filters.dateRange !== 'all' || filters.maxPrice < 600;

  return (
    <div className="min-h-screen bg-netflix-black text-white font-sans flex flex-col">

      {/* Fixed Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); setSearchQuery(''); }}
        onSearchChange={setSearchQuery}
        onOpenMyTickets={() => setIsTicketsDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        bookmarkCount={bookmarkedIds.size}
      />

      {/* Main content — no top padding here; hero handles its own spacing */}
      <main className="flex-1">
        {isFiltered ? (
          /* ── Filter / Search / My List view ── */
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-5">
            <FilterBar filters={filters} onFilterChange={setFilters} onReset={resetFilters} />

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex flex-wrap items-center gap-2">
                  {selectedCategory === 'mylist' && <Heart className="w-6 h-6 fill-netflix-red text-netflix-red" />}
                  {selectedCategory === 'mylist' ? 'My Saved List' : searchQuery ? `"${searchQuery}"` : 'Explore Events'}
                </h1>
                <p className="text-xs text-netflix-light-grey mt-1">{filteredEvents.length} events found</p>
              </div>
              <button
                onClick={resetFilters}
                className="self-start sm:self-auto text-xs bg-netflix-dark-grey hover:bg-netflix-red text-white font-semibold px-4 py-2 rounded transition-colors whitespace-nowrap"
              >
                Reset All
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-netflix-dark-grey rounded space-y-3 px-4">
                <Film className="w-12 h-12 text-netflix-light-grey/30 mx-auto" />
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {selectedCategory === 'mylist' ? 'Your Saved List is Empty' : 'No Events Found'}
                </h2>
                <p className="text-xs text-netflix-light-grey max-w-xs mx-auto">
                  {selectedCategory === 'mylist'
                    ? 'Tap the ♥ on any event card to save it here.'
                    : 'Try adjusting filters or search differently.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBookmarked={bookmarkedIds.has(event.id)}
                    onSelect={setSelectedEventModal}
                    onBuyTickets={setSelectedEventModal}
                    onToggleBookmark={handleToggleBookmark}
                    onWatchTrailer={setTrailerEventModal}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Home / Default view ── */
          <>
            {/* Hero — no extra top margin; it covers full viewport from top */}
            <HeroBanner
              event={FEATURED_EVENT}
              isBookmarked={bookmarkedIds.has(FEATURED_EVENT.id)}
              onGetTickets={setSelectedEventModal}
              onMoreInfo={setSelectedEventModal}
              onWatchTrailer={setTrailerEventModal}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Filter bar */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-30">
              <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                onReset={() => setFilters({ city: 'All Locations', dateRange: 'all', maxPrice: 600, sortBy: 'match' })}
              />
            </div>

            {/* Event rows */}
            <div className="relative z-30 mt-3 space-y-2 pb-4">
              {Object.entries(EVENTS_BY_CATEGORY).map(([cat, list]) => (
                <EventRow
                  key={cat}
                  title={cat}
                  events={list}
                  bookmarkedIds={bookmarkedIds}
                  onSelectEvent={setSelectedEventModal}
                  onBuyTickets={setSelectedEventModal}
                  onToggleBookmark={handleToggleBookmark}
                  onWatchTrailer={setTrailerEventModal}
                />
              ))}
            </div>

            {/* Trust highlights */}
            <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-6">
              <div className="bg-netflix-dark-grey rounded p-5 sm:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: <Zap className="w-6 h-6" />, title: 'Instant QR Mobile Pass', desc: 'Zero physical tickets. Digital barcode delivered instantly to your TickIt wallet.' },
                  { icon: <ShieldCheck className="w-6 h-6" />, title: 'Verified 100% Guarantee', desc: 'Every ticket authenticated through official organizers with full buyer protection.' },
                  { icon: <Sparkles className="w-6 h-6" />, title: 'Personalised Picks', desc: 'Curated recommendations based on your music taste, location, and past events.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="bg-netflix-red/20 text-netflix-red p-3 rounded shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-netflix-light-grey leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-netflix-dark-grey border-t border-white/5 text-netflix-light-grey">

        {/* Newsletter bar */}
        <div className="border-b border-netflix-red/20 bg-netflix-red/8 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
            <div className="text-center sm:text-left shrink-0">
              <p className="text-white font-bold text-base sm:text-lg">Never miss an event.</p>
              <p className="text-netflix-light-grey text-xs sm:text-sm mt-0.5">Get drops, presales & personalised picks.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-60 bg-black/50 text-white text-sm px-4 py-2.5 rounded border border-white/10 focus:border-netflix-red focus:outline-none placeholder-netflix-light-grey/50"
              />
              <button
                type="submit"
                className="bg-netflix-red hover:bg-red-700 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Main grid */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

            {/* Brand */}
            <div className="col-span-2 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-netflix-red p-1.5 rounded">
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-netflix-red">
                  TICK<span className="text-white">IT</span>
                </span>
              </div>
              <p className="text-xs text-netflix-light-grey leading-relaxed max-w-xs">
                The world's most cinematic event ticketing platform. From sold-out concerts to exclusive sporting events — your next unforgettable experience starts here.
              </p>
              <div className="flex gap-2 pt-1">
                {[
                  { icon: <MessageCircle className="w-4 h-4" />, label: 'Community' },
                  { icon: <AtSign className="w-4 h-4" />, label: 'Instagram' },
                  { icon: <Share2 className="w-4 h-4" />, label: 'Share' },
                  { icon: <Video className="w-4 h-4" />, label: 'YouTube' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="w-9 h-9 rounded bg-white/5 hover:bg-netflix-red text-netflix-light-grey hover:text-white flex items-center justify-center transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Discover */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Discover</h4>
              <ul className="space-y-2.5 text-xs">
                {['Concerts & Music', 'Sports & Gaming', 'Comedy & Standup', 'Theatre & Arts', 'Tech Conferences', 'Festival Passes'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-white transition-colors group">
                      <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5 text-xs">
                {['About TickIt', 'Careers', 'Press & Media', 'Partner With Us', 'Corporate Tickets', 'Investor Relations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-white transition-colors group">
                      <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Support</h4>
              <ul className="space-y-3 text-xs">
                {[
                  { icon: <Mail className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: 'support@tickit.io' },
                  { icon: <Phone className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: '+1 800 555 0100' },
                  { icon: <MapPin className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: 'San Francisco, CA 94103' },
                  { icon: <Globe className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: 'Available Worldwide' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-netflix-light-grey">{item.text}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 text-xs mt-3">
                {['Help Center & FAQ', 'Refund Policy', 'Accessibility'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-white transition-colors group">
                      <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-netflix-light-grey/50">
            <span>© 2026 TickIt Inc. All Rights Reserved.</span>
            <div className="flex flex-wrap justify-center gap-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map((item) => (
                <a key={item} href="#" className="hover:text-netflix-light-grey transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={setCurrentUser} />
      <EventModal event={selectedEventModal} currentUser={currentUser} onOpenAuthModal={() => setIsAuthModalOpen(true)} onClose={() => setSelectedEventModal(null)} onConfirmPurchase={handleConfirmPurchase} />
      <TrailerModal event={trailerEventModal} onClose={() => setTrailerEventModal(null)} onGetTickets={setSelectedEventModal} />
      <MyTicketsDrawer isOpen={isTicketsDrawerOpen} onClose={() => setIsTicketsDrawerOpen(false)} tickets={purchasedTickets} onRemoveTicket={handleRemoveTicket} />
    </div>
  );
}

export default App;
