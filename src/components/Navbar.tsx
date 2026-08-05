import React, { useState, useEffect } from 'react';
import { Search, Bell, Ticket, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenMyTickets: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenMyTickets,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? 'bg-netflix-dark-grey/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-netflix-black/90 via-netflix-black/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left Side: Logo & Main Navigation Links */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          {/* Logo */}
          <button
            onClick={() => onSelectCategory('all')}
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <div className="bg-netflix-red text-white p-1.5 rounded-md flex items-center justify-center font-black tracking-tighter text-xl">
              <Ticket className="w-5 h-5 fill-white text-netflix-red" />
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
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-netflix-white font-bold border-b-2 border-netflix-red pb-1'
                      : 'text-netflix-light-grey hover:text-netflix-white'
                  }`}
                >
                  {link.label}
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
            className="flex items-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md transition-transform duration-200 active:scale-95 shadow-sm"
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden xs:inline">My Tickets</span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-600 to-netflix-red flex items-center justify-center text-netflix-white font-bold text-xs shadow-md border border-white/10">
              <User className="w-4 h-4 text-netflix-white" />
            </div>
          </div>

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
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
