import React, { useState } from 'react';
import { X, User, Mail, Phone, CreditCard, Lock, Camera, CheckCircle2, Save } from 'lucide-react';
import type { UserProfile } from './AuthModal';

interface AccountSettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  // Local state for profile details
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [mobile, setMobile] = useState(currentUser.mobile || '');
  const [nic, setNic] = useState(currentUser.nic || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  // Local state for password change (simulated)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email,
      mobile,
      nic,
      avatar,
    });
    showSavedFeedback();
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    // Simulate API call for password change
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showSavedFeedback();
  };

  const showSavedFeedback = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker.
    // For this demo, we'll cycle through a few high-quality Unsplash avatars.
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop'
    ];
    const currentIndex = avatars.indexOf(avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    setAvatar(avatars[nextIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface */}
      <div className="relative w-full max-w-2xl bg-netflix-dark-grey text-white rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-netflix-black/50">
          <h2 className="text-lg font-black tracking-tight">Account Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/10 p-4 space-y-2 shrink-0 bg-black/20">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'profile' ? 'bg-netflix-red text-white' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'security' ? 'bg-netflix-red text-white' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4" />
              Security
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
                {/* Avatar Section */}
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-netflix-red/50"
                    />
                    <button
                      type="button"
                      onClick={handleAvatarChange}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Profile Picture</h3>
                    <p className="text-xs text-white/50 mb-2">Click your avatar to cycle through pictures.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Add a mobile number"
                        className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">NIC Number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={nic}
                        onChange={(e) => setNic(e.target.value)}
                        placeholder="National Identity Card (Optional)"
                        className="w-full bg-black/50 text-white text-sm pl-9 pr-3 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-2 opacity-0 transition-opacity" style={{ opacity: isSaved ? 1 : 0 }}>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved successfully
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-bold text-sm px-6 py-2.5 rounded transition-all active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSaveSecurity} className="space-y-6 animate-fadeIn">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-white">Change Password</h3>
                  <p className="text-xs text-white/50 mt-1">Update your password to keep your account secure.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-black/50 text-white text-sm px-4 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/50 text-white text-sm px-4 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest pl-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/50 text-white text-sm px-4 py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-8">
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-2 opacity-0 transition-opacity" style={{ opacity: isSaved ? 1 : 0 }}>
                    <CheckCircle2 className="w-4 h-4" />
                    Password updated
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-bold text-sm px-6 py-2.5 rounded transition-all active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
