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
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  };

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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-netflix-dark-grey/95 backdrop-blur-md shadow-lg border-b border-netflix-light-grey/10'
          : 'bg-gradient-to-b from-netflix-black/90 via-netflix-black/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left Side: Logo & Main Navigation Links */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          {/* Logo */}
          <button
            onClick={() => onSelectCategory('all')}
            className="flex items-center space-x-2 group focus:outline-none cursor-pointer"
          >
            <div className="bg-netflix-red text-netflix-white p-1.5 rounded-md flex items-center justify-center font-black tracking-tighter text-xl">
              <Ticket className="w-5 h-5 fill-netflix-white text-netflix-red" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-netflix-red uppercase font-sans">
              TICK<span className="text-netflix-white">IT</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = selectedCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectCategory(link.id)}
                  className={`text-sm font-medium transition-colors duration-200 flex items-center space-x-1 cursor-pointer ${
                    isActive
                      ? 'text-netflix-white font-bold border-b-2 border-netflix-red pb-1'
                      : 'text-netflix-light-grey hover:text-netflix-white'
                  }`}
                >
                  {link.id === 'mylist' && <Heart className="w-3.5 h-3.5 fill-current text-netflix-red" />}
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="bg-netflix-red text-netflix-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Search, Notifications, Profile, My Tickets CTA */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            {showSearchInput ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
                  className="bg-netflix-dark-grey text-netflix-white text-xs sm:text-sm pl-9 pr-8 py-1.5 rounded-md border border-netflix-light-grey/30 focus:border-netflix-red focus:outline-none w-44 sm:w-64 transition-all duration-300"
                  autoFocus
                />
                <Search className="w-4 h-4 text-netflix-light-grey absolute left-2.5" />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchQuery('');
                    if (onSearchChange) onSearchChange('');
                  }}
                  className="absolute right-2 text-netflix-light-grey hover:text-netflix-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-netflix-light-grey hover:text-netflix-white transition-colors duration-200"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Notifications Bell */}
          <div className="relative hidden sm:block">
            <button
              className="p-2 text-netflix-light-grey hover:text-netflix-white transition-colors duration-200 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-netflix-red rounded-full ring-2 ring-netflix-dark-grey animate-pulse"></span>
            </button>
          </div>

          {/* My Tickets Button - netflix-red rounded-md (no pill!) */}
          <button
            onClick={onOpenMyTickets}
            className="flex items-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md transition-transform duration-200 active:scale-95 shadow-sm cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden xs:inline">My Tickets</span>
          </button>

          {/* User Profile Avatar / Sign In */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-md object-cover ring-2 ring-netflix-red"
                />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-netflix-dark-grey border border-netflix-light-grey/20 rounded-md shadow-2xl py-2 z-50 text-xs space-y-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-netflix-light-grey/10">
                    <div className="font-bold text-netflix-white line-clamp-1">{currentUser.name}</div>
                    <div className="text-[10px] text-netflix-light-grey line-clamp-1">{currentUser.email}</div>
                    <div className="mt-1 text-[9px] bg-netflix-red/20 text-netflix-red border border-netflix-red/30 px-1.5 py-0.2 rounded inline-block font-semibold">
                      Via {currentUser.provider}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-netflix-light-grey hover:text-netflix-red hover:bg-white/5 flex items-center space-x-2 transition-colors font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="bg-netflix-dark-grey hover:bg-netflix-black text-netflix-white border border-netflix-light-grey/20 hover:border-netflix-red text-xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5 text-netflix-red" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-netflix-light-grey hover:text-netflix-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-dark-grey border-t border-netflix-light-grey/10 px-4 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectCategory(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === link.id
                  ? 'bg-netflix-red/20 text-netflix-red font-bold'
                  : 'text-netflix-light-grey hover:text-netflix-white hover:bg-white/5'
              }`}
            >
              {link.label} {link.count !== undefined && link.count > 0 ? `(${link.count})` : ''}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
