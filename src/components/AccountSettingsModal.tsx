import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, CreditCard, Lock, Camera, CheckCircle2, Save, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import type { UserProfile } from './AuthModal';

interface AccountSettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

type VerificationStep = 'none' | 'email' | 'mobile' | 'nic-check';

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

  // Verification state
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('none');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local state for password change (simulated)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Reset verification state when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setVerificationStep('none');
      setOtpCode('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  const finalizeProfileUpdate = () => {
    onUpdateUser({
      ...currentUser,
      name,
      email,
      mobile,
      nic,
      avatar,
    });
    setVerificationStep('none');
    showSavedFeedback();
  };

  const checkNextVerificationStep = (currentCompleted: 'email' | 'mobile' | 'none') => {
    const emailChanged = email !== currentUser.email;
    const mobileChanged = mobile !== currentUser.mobile;
    const nicChanged = nic !== currentUser.nic;

    if (currentCompleted === 'none') {
      if (emailChanged) return setVerificationStep('email');
      if (mobileChanged) return setVerificationStep('mobile');
      if (nicChanged) return startNicCheck();
      return finalizeProfileUpdate();
    }

    if (currentCompleted === 'email') {
      if (mobileChanged) return setVerificationStep('mobile');
      if (nicChanged) return startNicCheck();
      return finalizeProfileUpdate();
    }

    if (currentCompleted === 'mobile') {
      if (nicChanged) return startNicCheck();
      return finalizeProfileUpdate();
    }
  };

  const startNicCheck = () => {
    setVerificationStep('nic-check');
    setErrorMsg(null);
    // Simulate backend delay
    setTimeout(() => {
      if (nic.toUpperCase() === '123456789V') {
        setErrorMsg('This NIC is already associated with another account.');
      } else {
        finalizeProfileUpdate();
      }
    }, 1500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    checkNextVerificationStep('none');
  };

  const handleVerifyOtp = (e: React.FormEvent, stepType: 'email' | 'mobile') => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setErrorMsg('Please enter a valid 4-digit code.');
      return;
    }
    setErrorMsg(null);
    setOtpCode('');
    checkNextVerificationStep(stepType);
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

  // --- Render Verification Steps ---
  if (verificationStep === 'email' || verificationStep === 'mobile') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-sm bg-netflix-dark-grey text-white rounded-xl overflow-hidden shadow-2xl border border-white/10 p-6 space-y-6">
          <button onClick={() => setVerificationStep('none')} className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center pt-4 space-y-2">
            <div className="inline-flex bg-netflix-red/20 p-3 rounded-full mb-2">
              {verificationStep === 'email' ? <Mail className="w-6 h-6 text-netflix-red" /> : <Phone className="w-6 h-6 text-netflix-red" />}
            </div>
            <h2 className="text-xl font-black">Verify {verificationStep === 'email' ? 'Email' : 'Mobile'}</h2>
            <p className="text-xs text-white/50 px-4">
              Enter the 4-digit verification code sent to <br/>
              <span className="text-white font-bold">{verificationStep === 'email' ? email : mobile}</span>
            </p>
          </div>

          <form onSubmit={(e) => handleVerifyOtp(e, verificationStep)} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={4}
                autoFocus
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/[^0-9]/g, ''));
                  setErrorMsg(null);
                }}
                placeholder="0000"
                className="w-full bg-black/50 text-white text-center text-2xl tracking-[1em] font-mono py-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none transition-colors"
              />
              {errorMsg && <p className="text-netflix-red text-xs mt-2 text-center">{errorMsg}</p>}
            </div>
            <button
              type="submit"
              disabled={otpCode.length < 4}
              className="w-full flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded transition-all active:scale-[0.98]"
            >
              Verify & Continue
            </button>
            <p className="text-[10px] text-center text-white/40">Demo: Enter any 4 digits to pass.</p>
          </form>
        </div>
      </div>
    );
  }

  if (verificationStep === 'nic-check') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-sm bg-netflix-dark-grey text-white rounded-xl overflow-hidden shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-4">
          {errorMsg ? (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-netflix-red" />
              </div>
              <h2 className="text-lg font-black text-white">NIC Verification Failed</h2>
              <p className="text-sm text-white/60">{errorMsg}</p>
              <button
                onClick={() => setVerificationStep('none')}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm py-3 rounded transition-all active:scale-[0.98]"
              >
                Go Back
              </button>
            </>
          ) : (
            <>
              <Loader2 className="w-10 h-10 text-netflix-red animate-spin" />
              <h2 className="text-lg font-bold text-white mt-2">Verifying NIC...</h2>
              <p className="text-xs text-white/50">Checking backend database securely</p>
            </>
          )}
        </div>
      </div>
    );
  }

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
                    {email !== currentUser.email && <p className="text-[10px] text-amber-500 pl-1">Requires verification on save.</p>}
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
                    {mobile !== currentUser.mobile && mobile !== '' && <p className="text-[10px] text-amber-500 pl-1">Requires verification on save.</p>}
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
                    <p className="text-[10px] text-white/40 pl-1">Demo: NIC "123456789V" triggers an error.</p>
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
