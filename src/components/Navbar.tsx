import React, { useState, useEffect } from 'react';
import { Search, Crown, User, Menu, X, Heart, LogOut, PhoneCall } from 'lucide-react';
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
    { id: 'mylist', label: 'Saved VIP Passes', count: bookmarkCount },
    { id: 'gala', label: 'Royal Galas' },
    { id: 'motorsport', label: 'Formula 1' },
    { id: 'concerts', label: 'Orchestras' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#121212]/95 backdrop-blur-md border-b border-[#C5A059]/20 shadow-2xl'
          : 'bg-gradient-to-b from-[#0B0B0B]/95 via-[#0B0B0B]/70 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Side: Classic Gold Logo & VIP Navigation Links */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          {/* Classic VIP Logo */}
          <button
            onClick={() => onSelectCategory('all')}
            className="flex items-center space-x-2.5 group focus:outline-none cursor-pointer"
          >
            <div className="bg-[#C5A059] text-[#0B0B0B] p-2 rounded-md flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 fill-[#0B0B0B]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black tracking-widest text-white font-serif uppercase">
                TICK<span className="text-[#C5A059]">IT</span>
              </span>
              <span className="text-[9px] tracking-widest text-[#C5A059] uppercase font-mono font-bold">
                VIP CONCIERGE
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = selectedCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectCategory(link.id)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center space-x-1 cursor-pointer ${
                    isActive
                      ? 'text-[#C5A059] font-bold border-b-2 border-[#C5A059] pb-1'
                      : 'text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  {link.id === 'mylist' && <Heart className="w-3.5 h-3.5 fill-current text-[#C5A059]" />}
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="bg-[#C5A059] text-[#0B0B0B] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: 24/7 VIP Hotline, Search, Account, My Passes */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* 24/7 VIP Concierge Hotline Indicator */}
          <a
            href="tel:+1800555847"
            onClick={(e) => {
              e.preventDefault();
              alert('Direct VIP Concierge Line: 1-800-VIP-TICKIT (24/7 Dedicated Assistance Active)');
            }}
            className="hidden lg:flex items-center space-x-1.5 bg-[#161616] hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-xs px-3 py-1.5 rounded-md transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-semibold text-[11px] tracking-wide">24/7 Concierge</span>
          </a>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            {showSearchInput ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search VIP galas, Monaco, opera..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
                  className="bg-[#161616] text-white text-xs pl-9 pr-8 py-1.5 rounded-md border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none w-44 sm:w-64 transition-all duration-300"
                  autoFocus
                />
                <Search className="w-4 h-4 text-[#A0A0A0] absolute left-2.5" />
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchQuery('');
                    if (onSearchChange) onSearchChange('');
                  }}
                  className="absolute right-2 text-[#A0A0A0] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-[#A0A0A0] hover:text-white transition-colors duration-200"
                title="Search VIP Catalog"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* My Passes CTA Button */}
          <button
            onClick={onOpenMyTickets}
            className="flex items-center space-x-2 bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] text-xs font-bold px-4 py-2 rounded-md transition-transform duration-200 active:scale-95 shadow-md cursor-pointer uppercase tracking-wider"
          >
            <Crown className="w-4 h-4" />
            <span className="hidden xs:inline">My Passes</span>
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
                  className="w-8 h-8 rounded-md object-cover ring-2 ring-[#C5A059]"
                />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#161616] border border-[#C5A059]/30 rounded-md shadow-2xl py-2 z-50 text-xs space-y-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-white/10">
                    <div className="font-bold text-white line-clamp-1">{currentUser.name}</div>
                    <div className="text-[10px] text-[#A0A0A0] line-clamp-1">{currentUser.email}</div>
                    <div className="mt-1 text-[9px] bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 px-1.5 py-0.2 rounded inline-block font-bold">
                      VIP Concierge • {currentUser.provider}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[#A0A0A0] hover:text-[#C5A059] hover:bg-white/5 flex items-center space-x-2 transition-colors font-semibold"
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
              className="bg-[#161616] hover:bg-[#0B0B0B] text-white border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>VIP Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A0A0A0] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161616] border-t border-white/10 px-4 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectCategory(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === link.id
                  ? 'bg-[#C5A059]/20 text-[#C5A059] font-bold'
                  : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
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
