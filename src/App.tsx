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
import { Film, ShieldCheck, Heart, Crown, PhoneCall } from 'lucide-react';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [trailerEventModal, setTrailerEventModal] = useState<EventItem | null>(null);
  const [isTicketsDrawerOpen, setIsTicketsDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Social Auth User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Yashen Fernando',
    email: 'yashen.fernando@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    provider: 'Google',
  });

  // Bookmarking / Favorites State
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(['feat-1', 'tr-1', 'tr-2'])
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

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    city: 'All Locations',
    dateRange: 'all',
    maxPrice: 600,
    sortBy: 'match',
  });

  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([
    {
      id: 'TK-992104',
      event: FEATURED_EVENT,
      tier: 'Royal Paddock Suite & Concierge',
      quantity: 1,
      totalPrice: 12500,
      purchaseDate: '2026-08-05',
      customerName: 'Yashen Fernando',
    },
  ]);

  // Aggregate all events
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

  // Multi-criteria filter & sort pipeline
  const filteredEvents = useMemo(() => {
    let result = [...allEventsList];

    // Category filter
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

    // Search query filter
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

    // Location / City filter
    if (filters.city !== 'All Locations') {
      result = result.filter((e) => e.location.includes(filters.city));
    }

    // Date range filter
    if (filters.dateRange === 'tonight') {
      result = result.filter((e) => e.date.toUpperCase().includes('TONIGHT') || e.isLive);
    } else if (filters.dateRange === 'weekend') {
      result = result.filter((e) => e.date.includes('SAT') || e.date.includes('SUN'));
    }

    // Sorting Order
    result.sort((a, b) => {
      if (filters.sortBy === 'match') {
        return b.matchPercentage - a.matchPercentage;
      }
      if (filters.sortBy === 'price-asc') {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return pA - pB;
      }
      if (filters.sortBy === 'price-desc') {
        const pA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
        const pB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
        return pB - pA;
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
    seats: any[];
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

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-[#C5A059] selection:text-[#0B0B0B] flex flex-col justify-between">
      {/* Top Fixed Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenMyTickets={() => setIsTicketsDrawerOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        bookmarkCount={bookmarkedIds.size}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* If Active Filter, Search, or My List View */}
        {isFiltered ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 space-y-6">
            {/* Filter Controls Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={(updated) => setFilters(updated)}
              onReset={() => {
                setFilters({
                  city: 'All Locations',
                  dateRange: 'all',
                  maxPrice: 600,
                  sortBy: 'match',
                });
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            />

            <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 font-serif">
                  {selectedCategory === 'mylist' && <Heart className="w-6 h-6 fill-[#C5A059] text-[#C5A059]" />}
                  {selectedCategory === 'mylist'
                    ? 'Saved VIP Collection'
                    : searchQuery
                    ? `VIP Search Results for "${searchQuery}"`
                    : `Curated VIP Event Catalog`}
                </h1>
                <p className="text-xs text-[#A0A0A0] mt-1">
                  Showing {filteredEvents.length} exclusive events matching your criteria
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFilters({
                    city: 'All Locations',
                    dateRange: 'all',
                    maxPrice: 600,
                    sortBy: 'match',
                  });
                }}
                className="bg-[#161616] hover:bg-[#C5A059] hover:text-[#0B0B0B] text-white text-xs font-bold px-3.5 py-2 rounded-md transition-colors border border-[#C5A059]/30 uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-[#161616] rounded-md space-y-3 border border-white/5">
                <Film className="w-12 h-12 text-[#A0A0A0]/40 mx-auto" />
                <h2 className="text-lg font-bold text-white font-serif">
                  {selectedCategory === 'mylist' ? 'Your Saved VIP Collection is Empty' : 'No Matching VIP Events Found'}
                </h2>
                <p className="text-xs text-[#A0A0A0] max-w-xs mx-auto">
                  {selectedCategory === 'mylist'
                    ? 'Click the heart icon on any event card to save royal passes to your collection!'
                    : 'Try adjusting your location filters or reset the view.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex justify-center">
                    <EventCard
                      event={event}
                      isBookmarked={bookmarkedIds.has(event.id)}
                      onSelect={(e) => setSelectedEventModal(e)}
                      onBuyTickets={(e) => setSelectedEventModal(e)}
                      onToggleBookmark={handleToggleBookmark}
                      onWatchTrailer={(e) => setTrailerEventModal(e)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default Classic VIP Aesthetic Home Dashboard */
          <>
            {/* Featured Billboard Hero */}
            <HeroBanner
              event={FEATURED_EVENT}
              isBookmarked={bookmarkedIds.has(FEATURED_EVENT.id)}
              onGetTickets={(e) => setSelectedEventModal(e)}
              onMoreInfo={(e) => setSelectedEventModal(e)}
              onWatchTrailer={(e) => setTrailerEventModal(e)}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* Filter Bar Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-30">
              <FilterBar
                filters={filters}
                onFilterChange={(updated) => setFilters(updated)}
                onReset={() => {
                  setFilters({
                    city: 'All Locations',
                    dateRange: 'all',
                    maxPrice: 600,
                    sortBy: 'match',
                  });
                }}
              />
            </div>

            {/* Horizontal VIP Rows Container */}
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

            {/* Premium VIP Highlights Surface (#161616 surface) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="bg-[#161616] rounded-md p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border border-[#C5A059]/20 shadow-2xl">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#C5A059]/20 text-[#C5A059] p-3 rounded-md shrink-0 border border-[#C5A059]/40">
                    <Crown className="w-6 h-6 fill-[#C5A059]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-white font-serif">1-Tap VIP Concierge</h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Zero friction checkout. Direct 1-tap reservation for Royal Suites, Private Boxes, and F1 Paddock passes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#C5A059]/20 text-[#C5A059] p-3 rounded-md shrink-0 border border-[#C5A059]/40">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-white font-serif">Chauffeur & Helicopter Transit</h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Integrated door-to-door luxury Maybach fleet and private helicopter air charter booking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-[#C5A059]/20 text-[#C5A059] p-3 rounded-md shrink-0 border border-[#C5A059]/40">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-white font-serif">24/7 Dedicated Butler Line</h3>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Direct phone access to your personal executive butler and venue concierge team worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer Surface (#161616) */}
      <footer className="bg-[#161616] border-t border-[#C5A059]/20 py-10 px-4 sm:px-6 lg:px-8 text-[#A0A0A0] text-xs">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2.5">
              <div className="bg-[#C5A059] text-[#0B0B0B] p-1.5 rounded-md">
                <Crown className="w-4 h-4 fill-[#0B0B0B]" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-serif">
                TICK<span className="text-[#C5A059]">IT</span> VIP CONCIERGE
              </span>
              <span className="text-xs text-[#A0A0A0] ml-2">
                • Ultra-Luxury Event Ticketing Platform
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-medium">
              <a href="#" className="hover:text-[#C5A059] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#C5A059] transition-colors">Terms of VIP Service</a>
              <a href="#" className="hover:text-[#C5A059] transition-colors">24/7 Butler Desk</a>
              <a href="#" className="hover:text-[#C5A059] transition-colors">Private Jet Charter</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A0A0A0]/70 gap-2">
            <div>© 2026 TickIt VIP Inc. Timeless Classic Edition. All Rights Reserved.</div>
            <div>Exact Hex Palette: #C5A059 (Champagne Gold) | #0B0B0B (Onyx Black) | #161616 (Surface Dark)</div>
          </div>
        </div>
      </footer>

      {/* Social Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* 1-Tap VIP Ticket Purchase Modal */}
      <EventModal
        event={selectedEventModal}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onClose={() => setSelectedEventModal(null)}
        onConfirmPurchase={handleConfirmPurchase}
      />

      {/* Event Trailer Teaser Player Modal */}
      <TrailerModal
        event={trailerEventModal}
        onClose={() => setTrailerEventModal(null)}
        onGetTickets={(e) => setSelectedEventModal(e)}
      />

      {/* My Tickets Drawer */}
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
