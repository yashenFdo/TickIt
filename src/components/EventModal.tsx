import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2, Sparkles, Star, ThumbsUp, MessageSquare, Zap } from 'lucide-react';
import type { EventItem } from '../data/events';
import { SeatPicker } from './SeatPicker';
import type { SelectedSeat } from './SeatPicker';
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
    seats: SelectedSeat[];
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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeTab, setActiveTab] = useState<'booking' | 'reviews'>('booking');
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'vip' | 'backstage'>('standard');
  const [quantity, setQuantity] = useState(1);
  const [bookingMode, setBookingMode] = useState<'express' | 'seats' | 'tier'>('express');

  // Customer Form State
  const [customerName, setCustomerName] = useState('Alex Morgan');

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
    }
  }, [currentUser]);

  // Reviews State
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      author: 'Marcus Vance',
      rating: 5,
      date: '2 days ago',
      comment: 'Mind-blowing production! The spatial audio and laser lighting were truly cinematic. Worth every dollar!',
      likes: 34,
      isVerified: true,
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      rating: 5,
      date: '1 week ago',
      comment: 'Front row VIP seats gave an unmatched view of the stage. The mobile entry pass worked seamlessly at the gate.',
      likes: 21,
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
        author: currentUser ? currentUser.name : customerName || 'Verified Attendee',
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

  const basePriceNumber = parseInt(event.price.replace(/[^0-9]/g, '')) || 95;

  const tiers = [
    {
      id: 'standard',
      name: 'General Admission',
      multiplier: 1,
      desc: 'Standard seating area, live experience, mobile digital entry pass.',
    },
    {
      id: 'vip',
      name: 'VIP Pass & Lounge Access',
      multiplier: 1.8,
      desc: 'Premium front-row seating, expedited VIP fast-track entry, complimentary drinks.',
    },
    {
      id: 'backstage',
      name: 'Ultimate Backstage & Meet Pass',
      multiplier: 3.2,
      desc: 'Backstage access pass, performer meet & greet, exclusive band merchandise bundle.',
    },
  ];

  const currentTierObj = tiers.find((t) => t.id === selectedTier) || tiers[0];
  const unitPrice = Math.round(basePriceNumber * currentTierObj.multiplier);

  const totalPrice =
    bookingMode === 'seats' && selectedSeats.length > 0
      ? selectedSeats.reduce((sum, s) => sum + s.price, 0)
      : unitPrice * quantity;

  const finalQuantity = bookingMode === 'seats' && selectedSeats.length > 0 ? selectedSeats.length : quantity;
  const tierName =
    bookingMode === 'seats' && selectedSeats.length > 0
      ? selectedSeats.map((s) => `${s.section} (${s.id})`).join(', ')
      : currentTierObj.name;

  const handleExpressCheckout = () => {
    onConfirmPurchase({
      event,
      tier: tierName,
      quantity: finalQuantity,
      totalPrice,
      seats: selectedSeats,
      customerName: currentUser ? currentUser.name : customerName,
    });
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-netflix-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface Container - Netflix Dark Grey (#141414) */}
      <div className="relative w-full max-w-3xl bg-netflix-dark-grey text-netflix-white rounded-md overflow-hidden shadow-2xl border border-white/5 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-netflix-black/70 text-netflix-light-grey hover:text-netflix-white hover:bg-netflix-red transition-all duration-200"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tab Switcher */}
        <div className="bg-netflix-black/90 px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center space-x-1.5 py-1 transition-colors cursor-pointer ${
                activeTab === 'booking'
                  ? 'text-netflix-white font-extrabold border-b-2 border-netflix-red'
                  : 'text-netflix-light-grey hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4 text-netflix-red" />
              <span className="uppercase text-[11px]">Express Ticket Booking</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center space-x-1.5 py-1 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-netflix-white font-extrabold border-b-2 border-netflix-red'
                  : 'text-netflix-light-grey hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-netflix-red" />
              <span className="uppercase text-[11px]">Fan Reviews ({reviewsList.length})</span>
            </button>
          </div>
        </div>

        {/* Fan Reviews Tab Content */}
        {activeTab === 'reviews' ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-netflix-white">Verified Fan Reviews</h3>
                <p className="text-xs text-netflix-light-grey">
                  Community feedback from verified ticket buyers for {event.title}
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-netflix-black px-3 py-1.5 rounded-md border border-white/10">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-sm text-white">{event.rating}</span>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="space-y-2 bg-netflix-black p-4 rounded-md border border-white/5">
              <label className="text-xs font-semibold text-netflix-white">Write a Review</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your experience with other fans..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-netflix-dark-grey text-netflix-white text-xs p-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-netflix-red hover:bg-netflix-red/90 text-white font-bold text-xs px-4 rounded-md transition-colors cursor-pointer"
                >
                  Post
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="bg-netflix-black p-4 rounded-md border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-netflix-white">{rev.author}</span>
                      {rev.isVerified && (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Attendee
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-netflix-light-grey">{rev.date}</span>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-netflix-light-grey leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center space-x-1 text-[11px] text-netflix-light-grey pt-1">
                    <button className="flex items-center space-x-1 hover:text-netflix-red">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.likes} Helpfulness</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : step === 4 ? (
          /* Final Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-netflix-white">
                Ticket Issued Successfully!
              </h2>
              <p className="text-sm text-netflix-light-grey max-w-md mx-auto">
                Thank you, <span className="text-netflix-white font-bold">{currentUser ? currentUser.name : customerName}</span>. Your digital mobile pass for{' '}
                <span className="text-netflix-red font-bold">{event.title}</span> is ready.
              </p>
            </div>

            {/* Digital Pass Receipt Box */}
            <div className="bg-netflix-black p-5 rounded-md border border-white/10 max-w-md mx-auto text-left space-y-3 shadow-lg">
              <div className="flex justify-between items-center text-xs text-netflix-light-grey border-b border-white/10 pb-2">
                <span>PASS CODE: #TK-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 1-CLICK VERIFIED
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-netflix-white">{event.title}</div>
                <div className="text-xs text-netflix-light-grey">{event.venue}, {event.location}</div>
              </div>

              <div className="text-xs text-netflix-light-grey space-y-1 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="text-netflix-white font-semibold">{event.date} • {event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pass Tier:</span>
                  <span className="text-netflix-red font-bold">{tierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Paid:</span>
                  <span className="text-netflix-white font-bold">${totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-netflix-red hover:bg-netflix-red/90 text-netflix-white font-bold px-8 py-3 rounded-md transition-all active:scale-95 text-sm cursor-pointer shadow-md"
            >
              View Pass in Wallet
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
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-netflix-dark-grey/50 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-netflix-red text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                    {event.category}
                  </span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-emerald-400" />
                    {event.matchPercentage}% Match
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-netflix-white uppercase tracking-tight font-sans">
                  {event.title}
                </h2>
                <p className="text-xs text-netflix-light-grey flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-netflix-red" />
                  <span>{event.date} • {event.time}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-netflix-red" />
                  <span>{event.venue}</span>
                </p>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Mode Switcher (Express 1-Click vs Interactive Seat Map) */}
              <div className="flex items-center justify-between bg-netflix-black p-1 rounded-md border border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBookingMode('express')}
                  className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    bookingMode === 'express'
                      ? 'bg-netflix-red text-white'
                      : 'text-netflix-light-grey hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Express 1-Click Checkout</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingMode('seats')}
                  className={`flex-1 py-2 text-center rounded-md transition-colors cursor-pointer ${
                    bookingMode === 'seats'
                      ? 'bg-netflix-red text-white'
                      : 'text-netflix-light-grey hover:text-white'
                  }`}
                >
                  Custom Seat Picker
                </button>
              </div>

              {/* Express 1-Click Mode */}
              {bookingMode === 'express' ? (
                <div className="space-y-5 bg-netflix-black p-5 rounded-md border border-white/10">
                  {/* Auth / Account Quick Status Bar */}
                  {currentUser ? (
                    <div className="flex items-center justify-between bg-netflix-dark-grey p-3 rounded-md border border-emerald-500/30">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-md object-cover ring-2 ring-netflix-red"
                        />
                        <div className="text-xs">
                          <div className="font-bold text-netflix-white flex items-center gap-1">
                            <span>{currentUser.name}</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                              Verified Account
                            </span>
                          </div>
                          <div className="text-netflix-light-grey text-[11px]">
                            {currentUser.email} ({currentUser.provider})
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-netflix-light-grey">Auto-Filled</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-netflix-dark-grey p-3.5 rounded-md border border-netflix-red/40">
                      <div className="text-xs">
                        <div className="font-bold text-netflix-white">Sign In for 1-Click Checkout</div>
                        <div className="text-[11px] text-netflix-light-grey">
                          Use Google, Instagram, or Apple account to auto-fill ticket details.
                        </div>
                      </div>
                      <button
                        onClick={onOpenAuthModal}
                        className="bg-netflix-red hover:bg-netflix-red/90 text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0"
                      >
                        Sign In Now
                      </button>
                    </div>
                  )}

                  {/* Quantity & Tier Selection Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-netflix-light-grey font-semibold">Select Ticket Tier</label>
                      <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value as any)}
                        className="w-full bg-netflix-dark-grey text-netflix-white p-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
                      >
                        {tiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} (${Math.round(basePriceNumber * t.multiplier)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-netflix-light-grey font-semibold">Ticket Quantity</label>
                      <div className="flex items-center space-x-3 bg-netflix-dark-grey p-1.5 rounded-md border border-white/10">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-7 h-7 bg-netflix-black text-white font-bold rounded-md cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-extrabold text-sm text-netflix-white">
                          {quantity} Ticket(s)
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(6, quantity + 1))}
                          className="w-7 h-7 bg-netflix-black text-white font-bold rounded-md cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Express 1-Click Pay Big CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleExpressCheckout}
                      className="w-full flex items-center justify-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white font-extrabold text-base py-3.5 rounded-md transition-all active:scale-95 cursor-pointer shadow-xl"
                    >
                      <Zap className="w-5 h-5 fill-white" />
                      <span>1-Click Express Pay (${totalPrice})</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Custom Seat Map Mode */
                <SeatPicker
                  basePrice={basePriceNumber}
                  onSeatsChange={(seats) => setSelectedSeats(seats)}
                />
              )}

              <div className="flex items-center justify-center space-x-2 text-[11px] text-netflix-light-grey pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified 100% Authentic Ticket Guarantee by TickIt Express</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
