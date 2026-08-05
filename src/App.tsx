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
import {
  Sparkles, Film, Ticket, ShieldCheck, Zap, Heart,
  MessageCircle, AtSign, Share2, Video, Mail, Phone,
  MapPin, Globe, ChevronRight,
} from 'lucide-react';

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
      const updated = new Set(prev);
      if (updated.has(event.id)) {
        updated.delete(event.id);
      } else {
        updated.add(event.id);
      }
      return updated;
    });
  };

  const [filters, setFilters] = useState<FilterState>({
    city: 'All Locations',
    dateRange: 'all',
    maxPrice: 600,
    sortBy: 'match',
  });

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
    Object.values(EVENTS_BY_CATEGORY).forEach((arr) => {
      arr.forEach((item) => {
        if (!list.some((existing) => existing.id === item.id)) {
          list.push(item);
        }
      });
    });
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

    if (filters.city !== 'All Locations') {
      result = result.filter((e) => e.location.includes(filters.city));
    }

    if (filters.dateRange === 'tonight') {
      result = result.filter((e) => e.date.toUpperCase().includes('TONIGHT') || e.isLive);
    } else if (filters.dateRange === 'weekend') {
      result = result.filter((e) => e.date.includes('SAT') || e.date.includes('SUN'));
    }

    result = result.filter((e) => {
      const priceNum = parseInt(e.price.replace(/[^0-9]/g, '')) || 50;
      return priceNum <= filters.maxPrice;
    });

    result.sort((a, b) => {
      if (filters.sortBy === 'match') return b.matchPercentage - a.matchPercentage;
      if (filters.sortBy === 'price-asc') {
        return (parseInt(a.price.replace(/[^0-9]/g, '')) || 0) - (parseInt(b.price.replace(/[^0-9]/g, '')) || 0);
      }
      if (filters.sortBy === 'price-desc') {
        return (parseInt(b.price.replace(/[^0-9]/g, '')) || 0) - (parseInt(a.price.replace(/[^0-9]/g, '')) || 0);
      }
      return 0;
    });

    return result;
  }, [allEventsList, selectedCategory, searchQuery, filters, bookmarkedIds]);

  const handleConfirmPurchase = (ticketInfo: {
    event: EventItem;
    tier: string;
    quantity: number;
    totalPrice: number;
    seats: SelectedSeat[];
    customerName: string;
  }) => {
    const newTicket: PurchasedTicket = {
      id: `TK-${Math.floor(100000 + Math.random() * 900000)}`,
      event: ticketInfo.event,
      tier: ticketInfo.tier,
      quantity: ticketInfo.quantity,
      totalPrice: ticketInfo.totalPrice,
      purchaseDate: new Date().toISOString().split('T')[0],
      seats: ticketInfo.seats,
      customerName: ticketInfo.customerName,
    };
    setPurchasedTickets((prev) => [newTicket, ...prev]);
  };

  const handleRemoveTicket = (id: string) => {
    setPurchasedTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    filters.city !== 'All Locations' ||
    filters.dateRange !== 'all' ||
    filters.maxPrice < 600;

  const resetFilters = () => {
    setFilters({ city: 'All Locations', dateRange: 'all', maxPrice: 600, sortBy: 'match' });
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-netflix-black text-netflix-white font-sans selection:bg-netflix-red selection:text-white flex flex-col">

      {/* ── Fixed Navbar ─────────────────────────────── */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); setSearchQuery(''); }}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenMyTickets={() => setIsTicketsDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        bookmarkCount={bookmarkedIds.size}
      />

      {/* ── Main Content ─────────────────────────────── */}
      <main className="flex-1">

        {isFiltered ? (
          /* ── Filtered / Search / My List View ── */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-6">
            <FilterBar
              filters={filters}
              onFilterChange={(updated) => setFilters(updated)}
              onReset={resetFilters}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-netflix-light-grey/10 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-netflix-white tracking-tight flex items-center gap-2 flex-wrap">
                  {selectedCategory === 'mylist' && <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-netflix-red text-netflix-red" />}
                  {selectedCategory === 'mylist'
                    ? 'My Saved List'
                    : searchQuery
                    ? `Results for "${searchQuery}"`
                    : 'Explore Events'}
                </h1>
                <p className="text-xs text-netflix-light-grey mt-1">
                  {filteredEvents.length} events found
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="self-start sm:self-auto bg-netflix-dark-grey hover:bg-netflix-red text-netflix-white text-xs font-semibold px-4 py-2 rounded-md transition-colors whitespace-nowrap"
              >
                Reset Filters
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-netflix-dark-grey rounded-md space-y-3 px-4">
                <Film className="w-12 h-12 text-netflix-light-grey/40 mx-auto" />
                <h2 className="text-lg font-bold text-netflix-white">
                  {selectedCategory === 'mylist' ? 'Your Saved List is Empty' : 'No Events Found'}
                </h2>
                <p className="text-xs text-netflix-light-grey max-w-xs mx-auto">
                  {selectedCategory === 'mylist'
                    ? 'Tap the heart icon on any event to save it here.'
                    : 'Try clearing filters or searching something else.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isBookmarked={bookmarkedIds.has(event.id)}
                    onSelect={(e) => setSelectedEventModal(e)}
                    onBuyTickets={(e) => setSelectedEventModal(e)}
                    onToggleBookmark={handleToggleBookmark}
                    onWatchTrailer={(e) => setTrailerEventModal(e)}
                  />
                ))}
              </div>
            )}
          </div>

        ) : (
          /* ── Home Dashboard ── */
          <>
            {/* Hero Banner — sits directly under fixed navbar (no extra padding needed;
                the hero itself is full-viewport-height and the navbar overlaps it intentionally
                as in Netflix. The gradient covers the overlap area.) */}
            <HeroBanner
              event={FEATURED_EVENT}
              isBookmarked={bookmarkedIds.has(FEATURED_EVENT.id)}
              onGetTickets={(e) => setSelectedEventModal(e)}
              onMoreInfo={(e) => setSelectedEventModal(e)}
              onWatchTrailer={(e) => setTrailerEventModal(e)}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-30">
              <FilterBar
                filters={filters}
                onFilterChange={(updated) => setFilters(updated)}
                onReset={() => setFilters({ city: 'All Locations', dateRange: 'all', maxPrice: 600, sortBy: 'match' })}
              />
            </div>

            {/* Event Rows */}
            <div className="relative z-30 mt-4 space-y-4">
              {Object.entries(EVENTS_BY_CATEGORY).map(([categoryTitle, eventsList]) => (
                <EventRow
                  key={categoryTitle}
                  title={categoryTitle}
                  events={eventsList}
                  bookmarkedIds={bookmarkedIds}
                  onSelectEvent={(e) => setSelectedEventModal(e)}
                  onBuyTickets={(e) => setSelectedEventModal(e)}
                  onToggleBookmark={handleToggleBookmark}
                  onWatchTrailer={(e) => setTrailerEventModal(e)}
                />
              ))}
            </div>

            {/* Trust Highlights Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-4">
              <div className="bg-netflix-dark-grey rounded-md p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
                {[
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: 'Instant QR Mobile Pass',
                    desc: 'Zero physical tickets. Instant digital barcode delivery straight to your TickIt wallet.',
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6" />,
                    title: 'Verified 100% Guarantee',
                    desc: 'Every ticket authenticated directly through official event organizers with full buyer protection.',
                  },
                  {
                    icon: <Sparkles className="w-6 h-6" />,
                    title: 'Personalized Recommendations',
                    desc: 'Curated events tailored to your music taste, location, and past show attendance.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="bg-netflix-red/20 text-netflix-red p-3 rounded-md shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm sm:text-base text-netflix-white">{item.title}</h3>
                      <p className="text-xs text-netflix-light-grey leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="bg-netflix-dark-grey border-t border-white/5 text-netflix-light-grey">

        {/* Newsletter Strip */}
        <div className="bg-netflix-red/10 border-b border-netflix-red/20 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-netflix-white font-bold text-base sm:text-lg">Never miss an event.</h3>
              <p className="text-netflix-light-grey text-xs sm:text-sm mt-0.5">Get ticket drops, exclusive presales & personalised picks.</p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full sm:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64 bg-netflix-black/60 text-netflix-white text-sm px-4 py-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none placeholder-netflix-light-grey/50"
              />
              <button
                type="submit"
                className="bg-netflix-red hover:bg-netflix-red/90 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-netflix-red text-white p-1.5 rounded-md">
                  <Ticket className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-netflix-red">
                  TICK<span className="text-netflix-white">IT</span>
                </span>
              </div>
              <p className="text-xs text-netflix-light-grey leading-relaxed max-w-xs">
                The world's most cinematic event ticketing platform. From sold-out concerts to exclusive sporting events — your next unforgettable experience starts here.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-1">
                {[
                  { icon: <MessageCircle className="w-4 h-4" />, label: 'Community', href: '#' },
                  { icon: <AtSign className="w-4 h-4" />, label: 'Instagram', href: '#' },
                  { icon: <Share2 className="w-4 h-4" />, label: 'Share', href: '#' },
                  { icon: <Video className="w-4 h-4" />, label: 'YouTube', href: '#' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-md bg-white/5 hover:bg-netflix-red text-netflix-light-grey hover:text-white flex items-center justify-center transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Discover Column */}
            <div className="space-y-4">
              <h4 className="text-netflix-white font-bold text-sm uppercase tracking-widest">Discover</h4>
              <ul className="space-y-2.5 text-xs">
                {['Concerts & Music', 'Sports & Gaming', 'Comedy & Standup', 'Theatre & Arts', 'Tech Conferences', 'Festival Passes'].map((link) => (
                  <li key={link}>
                    <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-netflix-white transition-colors group">
                      <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="text-netflix-white font-bold text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5 text-xs">
                {['About TickIt', 'Careers', 'Press & Media', 'Partner with Us', 'Corporate Tickets', 'Investor Relations'].map((link) => (
                  <li key={link}>
                    <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-netflix-white transition-colors group">
                      <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h4 className="text-netflix-white font-bold text-sm uppercase tracking-widest">Support</h4>
              <ul className="space-y-3 text-xs">
                {[
                  { icon: <Mail className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: 'support@tickit.io' },
                  { icon: <Phone className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: '+1 800 555 0100' },
                  { icon: <MapPin className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: 'San Francisco, CA 94103' },
                  { icon: <Globe className="w-3.5 h-3.5 text-netflix-red shrink-0" />, text: 'Available Worldwide' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-2 text-netflix-light-grey">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 space-y-2 text-xs">
                <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-netflix-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 transition-opacity" />Help Center
                </a>
                <a href="#" className="flex items-center gap-1.5 text-netflix-light-grey hover:text-netflix-white transition-colors group">
                  <ChevronRight className="w-3 h-3 text-netflix-red opacity-0 group-hover:opacity-100 transition-opacity" />Refund Policy
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-netflix-light-grey/60">
            <div>© 2026 TickIt Inc. All Rights Reserved.</div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4">
              <a href="#" className="hover:text-netflix-light-grey transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-netflix-light-grey transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-netflix-light-grey transition-colors">Cookie Preferences</a>
              <a href="#" className="hover:text-netflix-light-grey transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modals & Drawers ─────────────────────────── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
      <EventModal
        event={selectedEventModal}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onClose={() => setSelectedEventModal(null)}
        onConfirmPurchase={handleConfirmPurchase}
      />
      <TrailerModal
        event={trailerEventModal}
        onClose={() => setTrailerEventModal(null)}
        onGetTickets={(e) => setSelectedEventModal(e)}
      />
      <MyTicketsDrawer
        isOpen={isTicketsDrawerOpen}
        onClose={() => setIsTicketsDrawerOpen(false)}
        tickets={purchasedTickets}
        onRemoveTicket={handleRemoveTicket}
      />
    </div>
  );
}

export default App;
