import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { EventRow } from './components/EventRow';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { TrailerModal } from './components/TrailerModal';
import { MyTicketsDrawer } from './components/MyTicketsDrawer';
import type { PurchasedTicket } from './components/MyTicketsDrawer';
import { FilterBar } from './components/FilterBar';
import type { FilterState } from './components/FilterBar';
import { FEATURED_EVENT, EVENTS_BY_CATEGORY, EVENT_CATEGORIES } from './data/events';
import type { EventItem } from './data/events';
import type { SelectedSeat } from './components/SeatPicker';
import { Sparkles, Film, Ticket, ShieldCheck, Zap, Heart } from 'lucide-react';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [trailerEventModal, setTrailerEventModal] = useState<EventItem | null>(null);
  const [isTicketsDrawerOpen, setIsTicketsDrawerOpen] = useState<boolean>(false);

  // Bookmarking / Favorites State
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

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    city: 'All Locations',
    dateRange: 'all',
    maxPrice: 600,
    sortBy: 'match',
  });

  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([
    {
      id: 'TK-882194',
      event: EVENTS_BY_CATEGORY['Trending Now'][0],
      tier: 'VIP Front Row (VIP-1-2)',
      quantity: 2,
      totalPrice: 190,
      purchaseDate: '2026-08-04',
      customerName: 'Alex Morgan',
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

    // Max Price filter
    result = result.filter((e) => {
      const priceNum = parseInt(e.price.replace(/[^0-9]/g, '')) || 50;
      return priceNum <= filters.maxPrice;
    });

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

  return (
    <div className="min-h-screen bg-netflix-black text-netflix-white font-sans selection:bg-netflix-red selection:text-white flex flex-col justify-between">
      {/* Top Fixed Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenMyTickets={() => setIsTicketsDrawerOpen(true)}
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

            <div className="flex items-center justify-between border-b border-netflix-light-grey/10 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-netflix-white tracking-tight flex items-center gap-2">
                  {selectedCategory === 'mylist' && <Heart className="w-6 h-6 fill-netflix-red text-netflix-red" />}
                  {selectedCategory === 'mylist'
                    ? 'My Saved List & Bookmarked Events'
                    : searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : `Explore Live Events`}
                </h1>
                <p className="text-xs text-netflix-light-grey mt-1">
                  Showing {filteredEvents.length} events matching your selection
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
                className="bg-netflix-dark-grey hover:bg-netflix-red text-netflix-white text-xs font-semibold px-3.5 py-2 rounded-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-netflix-dark-grey rounded-md space-y-3">
                <Film className="w-12 h-12 text-netflix-light-grey/40 mx-auto" />
                <h2 className="text-lg font-bold text-netflix-white">
                  {selectedCategory === 'mylist' ? 'Your Saved List is Empty' : 'No Matching Events Found'}
                </h2>
                <p className="text-xs text-netflix-light-grey max-w-xs mx-auto">
                  {selectedCategory === 'mylist'
                    ? 'Click the heart icon on any event card to save shows and concerts to your list!'
                    : 'Try adjusting your price range slider or clearing city filters.'}
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
          /* Default Netflix Aesthetic Home Dashboard */
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

            {/* Horizontal Netflix Rows Container */}
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

            {/* Premium Highlights Surface (#141414 surface) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="bg-netflix-dark-grey rounded-md p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="flex items-start space-x-4">
                  <div className="bg-netflix-red/20 text-netflix-red p-3 rounded-md shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-netflix-white">Instant QR Mobile Pass</h3>
                    <p className="text-xs text-netflix-light-grey leading-relaxed">
                      Zero physical tickets. Instant digital barcode delivery straight to your TickIt wallet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-netflix-red/20 text-netflix-red p-3 rounded-md shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-netflix-white">Verified 100% Guarantee</h3>
                    <p className="text-xs text-netflix-light-grey leading-relaxed">
                      Every ticket is authenticated directly through official event organizers with buyer protection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-netflix-red/20 text-netflix-red p-3 rounded-md shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-netflix-white">Personalized Match Algorithm</h3>
                    <p className="text-xs text-netflix-light-grey leading-relaxed">
                      Curated recommendations tailored to your music taste, location, and past show attendance.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer Surface (#141414) */}
      <footer className="bg-netflix-dark-grey border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8 text-netflix-light-grey text-xs">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex items-center space-x-2">
              <div className="bg-netflix-red text-white p-1 rounded-md">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-netflix-red">
                TICK<span className="text-netflix-white">IT</span>
              </span>
              <span className="text-xs text-netflix-light-grey ml-2">
                • Cinematic Event Ticketing Platform
              </span>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-medium">
              <a href="#" className="hover:text-netflix-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-netflix-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-netflix-white transition-colors">Help & FAQ</a>
              <a href="#" className="hover:text-netflix-white transition-colors">Corporate Tickets</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-netflix-light-grey/70 gap-2">
            <div>© 2026 TickIt Inc. Netflix Aesthetic Design System. All Rights Reserved.</div>
            <div>Exact Hex Palette: #E50914 (Red) | #000000 (Black) | #141414 (Dark Grey) | #B3B3B3 (Light Grey)</div>
          </div>
        </div>
      </footer>

      {/* Ticket Purchase & Seat Selection Wizard Modal */}
      <EventModal
        event={selectedEventModal}
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
