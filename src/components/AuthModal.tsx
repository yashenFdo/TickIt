import React from 'react';
import { X, Ticket, ShieldCheck } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  provider: 'Google' | 'Instagram' | 'Apple';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-netflix-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface - Netflix Dark Grey (#141414) */}
      <div className="relative w-full max-w-md bg-netflix-dark-grey text-netflix-white rounded-md overflow-hidden shadow-2xl border border-white/10 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-netflix-light-grey hover:text-white hover:bg-netflix-red transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-netflix-red text-white p-2.5 rounded-md shadow-md">
            <Ticket className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-2xl font-black text-netflix-white tracking-tight uppercase">
            Sign In to <span className="text-netflix-red">TickIt</span>
          </h2>
          <p className="text-xs text-netflix-light-grey max-w-xs mx-auto">
            1-Click social authentication to auto-fill ticket details and manage passes.
          </p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="space-y-3 pt-2">
          {/* Sign in with Google */}
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center space-x-3 bg-netflix-black hover:bg-white/10 text-white border border-white/15 py-3 rounded-md font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-sm group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign in with Instagram */}
          <button
            onClick={() => handleSocialLogin('Instagram')}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white py-3 rounded-md font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Continue with Instagram</span>
          </button>

          {/* Sign in with Apple */}
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="w-full flex items-center justify-center space-x-3 bg-white text-black hover:bg-neutral-200 py-3 rounded-md font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.13-1.96.99-3.11-.97.04-2.17.65-2.86 1.46-.62.72-1.16 1.88-1.01 3.01 1.09.08 2.21-.54 2.88-1.36z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Security Assurance */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-netflix-light-grey text-center border-t border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>OAuth 2.0 Encryption • Instant Profile Auto-Fill</span>
        </div>
      </div>
    </div>
  );
};
