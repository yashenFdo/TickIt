import React, { useState, useEffect } from 'react';
import { Search, Bell, Ticket, User, Menu, X, Heart, LogOut } from 'lucide-react';
import type { UserProfile } from './AuthModal';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenMyTickets: () => void;
  onOpenAuthModal: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  bookmarkCount?: number;
  onSelectEvent?: (eventId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenMyTickets,
  onOpenAuthModal,
  currentUser,
  onLogout,
  bookmarkCount = 0,
  onSelectEvent,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showUserDropdown && !showNotifications) return;
    const handler = () => {
      setShowUserDropdown(false);
      setShowNotifications(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showUserDropdown, showNotifications]);

  const navLinks = [
    { id: 'all', label: 'Home' },
    { id: 'mylist', label: 'My List', count: bookmarkCount },
    { id: 'concerts', label: 'Concerts' },
    { id: 'comedy', label: 'Standup' },
    { id: 'sports', label: 'Sports' },
    { id: 'theatre', label: 'Theatre' },
    { id: 'tech', label: 'Tech' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-netflix-dark-grey/98 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      }`}
    >
      {/* Main bar — 64px on mobile, 72px on sm+ */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3">

        {/* ── Left: Logo + desktop nav ── */}
        <div className="flex items-center gap-6 lg:gap-10 min-w-0">
          {/* Logo */}
          <button
            onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 shrink-0 focus:outline-none cursor-pointer"
          >
            <div className="bg-netflix-red p-1.5 rounded flex items-center justify-center">
              <Ticket className="w-4 h-4 fill-white text-netflix-red" />
            </div>
            <span className="text-xl font-black tracking-tight text-netflix-red uppercase leading-none">
              TICK<span className="text-white">IT</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => {
              const active = selectedCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectCategory(link.id)}
                  className={`relative text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    active ? 'text-white font-bold' : 'text-netflix-light-grey hover:text-white'
                  }`}
                >
                  {link.id === 'mylist' && (
                    <Heart className="w-3.5 h-3.5 fill-netflix-red text-netflix-red" />
                  )}
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-netflix-red rounded-full" />
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="bg-netflix-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search */}
          <div className="flex items-center">
            {showSearchInput ? (
              <div className="flex items-center relative animate-fadeIn">
                <Search className="w-4 h-4 text-netflix-light-grey absolute left-2.5 z-10 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search events…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearchChange?.(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSearchInput(false);
                      setSearchQuery('');
                      onSearchChange?.('');
                    }
                  }}
                  className="bg-netflix-black text-white text-sm pl-8 pr-8 py-1.5 rounded border border-white/20 focus:border-netflix-red focus:outline-none w-40 sm:w-56 transition-all"
                />
                <button
                  onClick={() => { setShowSearchInput(false); setSearchQuery(''); onSearchChange?.(''); }}
                  className="absolute right-2 text-netflix-light-grey hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-netflix-light-grey hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notifications — hidden on very small screens */}
          <div className="hidden sm:block relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowNotifications((v) => !v);
                setShowUserDropdown(false);
              }}
              className="p-2 text-netflix-light-grey hover:text-white transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-netflix-red rounded-full ring-2 ring-netflix-dark-grey animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-netflix-dark-grey border border-white/10 rounded-md shadow-2xl z-50 animate-fadeIn overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Notifications</span>
                  <button className="text-[10px] text-netflix-light-grey hover:text-white">Mark all as read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div 
                    onClick={() => onSelectEvent?.('live-1')}
                    className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3"
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-netflix-red shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">Tickets for THE WEEKND just dropped!</div>
                      <div className="text-[11px] text-netflix-light-grey leading-relaxed line-clamp-2">The After Hours Til Dawn final show is now live. Grab your tickets before they sell out.</div>
                      <div className="text-[10px] text-white/40 mt-1">2 mins ago</div>
                    </div>
                  </div>
                  <div 
                    onClick={() => onSelectEvent?.('wk-3')}
                    className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 opacity-75"
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-transparent border border-white/20 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">Price Drop Alert: F1 Las Vegas</div>
                      <div className="text-[11px] text-netflix-light-grey leading-relaxed line-clamp-2">Prices for the Grandstand have dropped by 15%. Check out the new deals.</div>
                      <div className="text-[10px] text-white/40 mt-1">1 hour ago</div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 opacity-75">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-transparent border border-white/20 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">Welcome to TickIt Express</div>
                      <div className="text-[11px] text-netflix-light-grey leading-relaxed line-clamp-2">Explore the best events, concerts, and sports right in your city. Customize your preferences in settings.</div>
                      <div className="text-[10px] text-white/40 mt-1">1 day ago</div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-white/10 text-center bg-black/20 hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-[11px] font-semibold text-netflix-light-grey hover:text-white">View all notifications</span>
                </div>
              </div>
            )}
          </div>

          {/* My Tickets */}
          <button
            onClick={onOpenMyTickets}
            className="flex items-center gap-1.5 bg-netflix-red hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Ticket className="w-4 h-4" />
            <span>My Tickets</span>
          </button>

          {/* Profile */}
          {currentUser ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowUserDropdown((v) => !v);
                  setShowNotifications(false);
                }}
                className="focus:outline-none cursor-pointer"
                aria-label="Account menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded object-cover ring-2 ring-netflix-red hover:ring-red-400 transition-all"
                />
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-netflix-dark-grey border border-white/10 rounded shadow-2xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="font-semibold text-white text-sm truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-netflix-light-grey mt-0.5 truncate">{currentUser.email}</div>
                    <span className="mt-1.5 inline-block text-[10px] bg-netflix-red/20 text-netflix-red border border-netflix-red/30 px-1.5 py-0.5 rounded font-semibold">
                      via {currentUser.provider}
                    </span>
                  </div>
                  <button
                    onClick={() => { onLogout(); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-netflix-light-grey hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-netflix-dark-grey hover:bg-netflix-black text-white border border-white/15 hover:border-netflix-red text-xs sm:text-sm font-semibold px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-netflix-red" />
              Sign In
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 text-netflix-light-grey hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-dark-grey border-t border-white/10 animate-fadeIn">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { onSelectCategory(link.id); setMobileMenuOpen(false); }}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === link.id
                    ? 'bg-netflix-red/15 text-white border-l-2 border-netflix-red pl-4'
                    : 'text-netflix-light-grey hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.id === 'mylist' && <Heart className="w-4 h-4 fill-netflix-red text-netflix-red" />}
                  {link.label}
                </span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="bg-netflix-red text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {link.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
