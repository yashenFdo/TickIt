import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Crown, ShieldCheck, Sparkles, Star, ThumbsUp, MessageSquare, Zap, Car, Plane } from 'lucide-react';
import type { EventItem } from '../data/events';
import type { UserProfile } from './AuthModal';

interface EventModalProps {
  event: EventItem | null;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onClose: () => void;
  onConfirmPurchase: (ticketInfo: {
    event: EventItem;
    tier: string;
    quantity: number;
    totalPrice: number;
    seats: any[];
    customerName: string;
  }) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  currentUser,
  onOpenAuthModal,
  onClose,
  onConfirmPurchase,
}) => {
  if (!event) return null;

  const [step, setStep] = useState<1 | 4>(1);
  const [activeTab, setActiveTab] = useState<'booking' | 'reviews'>('booking');

  // VIP Add-on options
  const [includeHelicopter, setIncludeHelicopter] = useState(false);
  const [includeChauffeur, setIncludeChauffeur] = useState(true);

  // Customer Form State
  const [customerName, setCustomerName] = useState('Yashen Fernando');

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
    }
  }, [currentUser]);

  // Reviews State
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      author: 'Lord Harrington',
      rating: 5,
      date: 'Yesterday',
      comment: 'The Royal Paddock Box surpassed expectations. Private concierge and helicopter transfer made transit frictionless.',
      likes: 42,
      isVerified: true,
    },
    {
      id: 'rev-2',
      author: 'Countess Sophia',
      rating: 5,
      date: '3 days ago',
      comment: 'Superb 1-click VIP reservation. The personal butler at Royal Albert Hall was exceptionally attentive.',
      likes: 29,
      isVerified: true,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewsList([
      {
        id: `rev-${Date.now()}`,
        author: currentUser ? currentUser.name : customerName || 'VIP Member',
        rating: 5,
        date: 'Just now',
        comment: newComment,
        likes: 1,
        isVerified: true,
      },
      ...reviewsList,
    ]);
    setNewComment('');
  };

  const basePriceNumber = parseInt(event.price.replace(/[^0-9]/g, '')) || 4800;
  const heliPrice = includeHelicopter ? 2500 : 0;
  const chauffeurPrice = includeChauffeur ? 800 : 0;
  const totalPrice = basePriceNumber + heliPrice + chauffeurPrice;

  const handle1TapReserve = () => {
    onConfirmPurchase({
      event,
      tier: 'Royal VIP Suite & Concierge',
      quantity: 1,
      totalPrice,
      seats: [],
      customerName: currentUser ? currentUser.name : customerName,
    });
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0B0B0B]/90 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface Container - Deep Luxury Dark (#161616) */}
      <div className="relative w-full max-w-2xl bg-[#161616] text-white rounded-md overflow-hidden shadow-2xl border border-[#C5A059]/30 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#0B0B0B]/80 text-[#A0A0A0] hover:text-white hover:bg-[#C5A059] hover:text-[#0B0B0B] transition-all duration-200"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tab Switcher */}
        <div className="bg-[#0B0B0B] px-6 py-3.5 border-b border-[#C5A059]/20 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center space-x-2 py-1 transition-colors cursor-pointer ${
                activeTab === 'booking'
                  ? 'text-[#C5A059] font-extrabold border-b-2 border-[#C5A059]'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 fill-current text-[#C5A059]" />
              <span className="uppercase text-[11px] tracking-wider">1-Tap VIP Concierge Reserve</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center space-x-2 py-1 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-[#C5A059] font-extrabold border-b-2 border-[#C5A059]'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#C5A059]" />
              <span className="uppercase text-[11px] tracking-wider">VIP Reviews ({reviewsList.length})</span>
            </button>
          </div>
        </div>

        {/* Fan Reviews Tab Content */}
        {activeTab === 'reviews' ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">VIP Member Reviews</h3>
                <p className="text-xs text-[#A0A0A0]">
                  Exclusive feedback from High-Net-Worth attendees for {event.title}
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-[#0B0B0B] px-3 py-1.5 rounded-md border border-[#C5A059]/30">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-sm text-white">{event.rating}</span>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="space-y-2 bg-[#0B0B0B] p-4 rounded-md border border-white/5">
              <label className="text-xs font-semibold text-[#C5A059]">Post VIP Impression</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share feedback on VIP butler, concierge, and private box..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-[#161616] text-white text-xs p-2.5 rounded-md border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] font-bold text-xs px-4 rounded-md transition-colors cursor-pointer"
                >
                  Publish
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-[#0B0B0B] p-4 rounded-md border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white font-serif">{rev.author}</span>
                      {rev.isVerified && (
                        <span className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-[9px] px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3" /> VIP Member
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#A0A0A0]">{rev.date}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-[#A0A0A0] leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center space-x-1 text-[11px] text-[#A0A0A0] pt-1">
                    <button className="flex items-center space-x-1 hover:text-[#C5A059]">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.likes} Endorsements</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 4 ? (
          /* Final Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#C5A059]/50">
              <Crown className="w-10 h-10 fill-[#C5A059] animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
                VIP Pass Issued & Confirmed!
              </h2>
              <p className="text-sm text-[#A0A0A0] max-w-md mx-auto">
                Thank you, <span className="text-[#C5A059] font-bold">{currentUser ? currentUser.name : customerName}</span>. Your 24/7 dedicated VIP concierge has been assigned for{' '}
                <span className="text-white font-bold">{event.title}</span>.
              </p>
            </div>

            {/* Digital Pass Receipt Box */}
            <div className="bg-[#0B0B0B] p-5 rounded-md border border-[#C5A059]/30 max-w-md mx-auto text-left space-y-3 shadow-xl">
              <div className="flex justify-between items-center text-xs text-[#A0A0A0] border-b border-white/10 pb-2">
                <span className="font-mono text-[#C5A059]">ROYAL PASS: #VIP-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 1-TAP ISSUED
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white font-serif">{event.title}</div>
                <div className="text-xs text-[#A0A0A0]">{event.venue}, {event.location}</div>
              </div>

              <div className="text-xs text-[#A0A0A0] space-y-1.5 border-t border-white/10 pt-2.5">
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="text-white font-semibold">{event.date} • {event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chauffeur Transit:</span>
                  <span className="text-emerald-400 font-semibold">{includeChauffeur ? 'Included' : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Helicopter Charter:</span>
                  <span className="text-emerald-400 font-semibold">{includeHelicopter ? 'Included ($2,500)' : 'None'}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm">
                  <span className="text-white">Total Charged:</span>
                  <span className="text-[#C5A059]">${totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] font-bold px-8 py-3 rounded-md transition-all active:scale-95 text-sm cursor-pointer shadow-md uppercase tracking-wider"
            >
              Open VIP Wallet
            </button>
          </div>
        ) : (
          <div>
            {/* Event Backdrop Header */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black">
              <img
                src={event.backdropUrl}
                alt={event.title}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/60 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#C5A059] text-[#0B0B0B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                    {event.category}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-emerald-400" />
                    {event.matchPercentage}% VIP Match
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-serif">
                  {event.title}
                </h2>
                <p className="text-xs text-[#A0A0A0] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{event.date} • {event.time}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{event.venue}</span>
                </p>
              </div>
            </div>

            {/* Modal Body - Ultra-Simplified 1-Tap Concierge Booking */}
            <div className="p-5 sm:p-7 space-y-5">
              {/* Account Quick Status Bar */}
              {currentUser ? (
                <div className="flex items-center justify-between bg-[#0B0B0B] p-3.5 rounded-md border border-[#C5A059]/30">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-md object-cover ring-2 ring-[#C5A059]"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white flex items-center gap-1.5 font-serif">
                        <span>{currentUser.name}</span>
                        <span className="text-[9px] bg-[#C5A059]/20 text-[#C5A059] px-1.5 py-0.2 rounded font-bold uppercase">
                          HNWI Member
                        </span>
                      </div>
                      <div className="text-[#A0A0A0] text-[11px]">
                        {currentUser.email} ({currentUser.provider} Auth)
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Ready for 1-Tap</span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#0B0B0B] p-3.5 rounded-md border border-[#C5A059]/40">
                  <div className="text-xs">
                    <div className="font-bold text-white">Sign In for Express 1-Tap Reserve</div>
                    <div className="text-[11px] text-[#A0A0A0]">
                      Use Google, Instagram, or Apple account for instant zero-form checkout.
                    </div>
                  </div>
                  <button
                    onClick={onOpenAuthModal}
                    className="bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] text-xs font-bold px-3.5 py-2 rounded-md transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* VIP Transit Add-ons */}
              <div className="space-y-3 bg-[#0B0B0B] p-4 rounded-md border border-white/5 text-xs">
                <div className="font-bold text-[#C5A059] uppercase tracking-wider text-[11px]">
                  VIP Transit & Concierge Add-ons
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-white/5">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <div className="font-bold text-white">Private Executive Chauffeur Fleet</div>
                      <div className="text-[10px] text-[#A0A0A0]">Door-to-door luxury Maybach / Rolls-Royce transit</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeChauffeur(!includeChauffeur)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      includeChauffeur ? 'bg-[#C5A059] text-[#0B0B0B]' : 'bg-[#0B0B0B] text-[#A0A0A0]'
                    }`}
                  >
                    {includeChauffeur ? 'Included' : '+ Add ($800)'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-[#161616] border border-white/5">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <div className="font-bold text-white">Private Helicopter Air Charter</div>
                      <div className="text-[10px] text-[#A0A0A0]">Direct helipad transfer to venue VIP pad</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeHelicopter(!includeHelicopter)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      includeHelicopter ? 'bg-[#C5A059] text-[#0B0B0B]' : 'bg-[#0B0B0B] text-[#A0A0A0]'
                    }`}
                  >
                    {includeHelicopter ? 'Included' : '+ Add ($2,500)'}
                  </button>
                </div>
              </div>

              {/* Price & 1-Tap Reserve Big Button */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-baseline text-xs px-1">
                  <span className="text-[#A0A0A0] uppercase font-semibold">Total VIP Package Price:</span>
                  <span className="text-2xl font-black text-[#C5A059] font-serif">${totalPrice}</span>
                </div>

                <button
                  onClick={handle1TapReserve}
                  className="w-full flex items-center justify-center space-x-2.5 bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] font-black text-base py-4 rounded-md transition-all active:scale-95 cursor-pointer shadow-2xl uppercase tracking-wider"
                >
                  <Zap className="w-5 h-5 fill-[#0B0B0B]" />
                  <span>1-Tap Reserve VIP Concierge (${totalPrice})</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-[#A0A0A0] pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified 100% Authentic VIP Protection by TickIt Concierge</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
