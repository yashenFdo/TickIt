import React, { useState } from 'react';
import { X, Ticket, Mail, Phone, User as UserIcon, CreditCard, ChevronRight } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  mobile?: string;
  nic?: string;
  avatar: string;
  provider: 'Email' | 'Google' | 'Instagram' | 'Apple';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [nic, setNic] = useState('');
  const [name, setName] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !mobile) {
      alert('Please enter your email or mobile number.');
      return;
    }

    const mockUser: UserProfile = {
      name: mode === 'signup' && name ? name : 'Demo User',
      email: email || 'user@example.com',
      mobile: mobile,
      nic: nic,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      provider: 'Email',
    };

    onLoginSuccess(mockUser);
    onClose();
  };

  const handleSocialLogin = (provider: 'Google' | 'Instagram' | 'Apple') => {
    let mockUser: UserProfile;

    if (provider === 'Google') {
      mockUser = {
        name: 'Yashen Fernando',
        email: 'yashen.fernando@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        provider: 'Google',
      };
    } else if (provider === 'Instagram') {
      mockUser = {
        name: 'Yashen (@yashenfdo)',
        email: 'yashen.instagram@meta.com',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        provider: 'Instagram',
      };
    } else {
      mockUser = {
        name: 'Yashen (Apple ID)',
        email: 'yashen.fdo@icloud.com',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
        provider: 'Apple',
      };
    }

    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface */}
      <div className="relative w-full max-w-md bg-netflix-dark-grey text-white rounded-xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Decorative top red gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-netflix-red to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-netflix-red p-1.5 rounded">
                <Ticket className="w-5 h-5 fill-white text-netflix-red" />
              </div>
              <span className="text-xl font-black tracking-tight text-netflix-red uppercase">
                TICK<span className="text-white">IT</span>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-white/50">
              {mode === 'signin' ? 'Sign in to access your tickets and saved events.' : 'Join to discover and book the best events in your city.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">NIC Number</label>
                  <span className="text-[9px] text-netflix-red font-bold uppercase">Optional</span>
                </div>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    placeholder="National Identity Card (if available)"
                    className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-extrabold text-sm py-3.5 rounded transition-all active:scale-[0.98] mt-2"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-medium uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center py-2.5 bg-black/50 border border-white/10 hover:border-white/30 rounded transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialLogin('Instagram')}
              className="flex items-center justify-center py-2.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 hover:opacity-90 rounded transition-opacity"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center py-2.5 bg-white hover:bg-neutral-200 rounded transition-colors"
            >
              <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96.99-3.11-.97.04-2.17.65-2.86 1.46-.62.72-1.16 1.88-1.01 3.01 1.09.08 2.21-.54 2.88-1.36z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Switcher */}
        <div className="bg-black/50 p-4 text-center border-t border-white/10">
          <p className="text-xs text-white/60">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-white font-bold hover:text-netflix-red transition-colors"
            >
              {mode === 'signin' ? 'Sign up now.' : 'Sign in instead.'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
