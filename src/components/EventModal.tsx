import React, { useState } from 'react';
import { X, Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2, Sparkles, CreditCard, Lock, Smartphone, ChevronRight, ChevronLeft } from 'lucide-react';
import type { EventItem } from '../data/events';
import { SeatPicker } from './SeatPicker';
import type { SelectedSeat } from './SeatPicker';

interface EventModalProps {
  event: EventItem | null;
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

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onConfirmPurchase }) => {
  if (!event) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'vip' | 'backstage'>('standard');
  const [quantity, setQuantity] = useState(1);
  const [bookingMode, setBookingMode] = useState<'seats' | 'tier'>('seats');

  // Customer Form State
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [customerEmail, setCustomerEmail] = useState('alex.morgan@netflix-tickit.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 382-9102');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'googlepay' | 'crypto'>('card');

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

  // Total price calculation depending on booking mode
  const totalPrice =
    bookingMode === 'seats' && selectedSeats.length > 0
      ? selectedSeats.reduce((sum, s) => sum + s.price, 0)
      : unitPrice * quantity;

  const finalQuantity = bookingMode === 'seats' && selectedSeats.length > 0 ? selectedSeats.length : quantity;
  const tierName =
    bookingMode === 'seats' && selectedSeats.length > 0
      ? selectedSeats.map((s) => `${s.section} (${s.id})`).join(', ')
      : currentTierObj.name;

  const handleCompleteOrder = () => {
    onConfirmPurchase({
      event,
      tier: tierName,
      quantity: finalQuantity,
      totalPrice,
      seats: selectedSeats,
      customerName,
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

        {/* Wizard Steps Header Indicator */}
        <div className="bg-netflix-black/90 px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2 text-netflix-white">
            <span className="bg-netflix-red text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">
              {step}
            </span>
            <span className="uppercase tracking-wider text-[11px] font-bold">
              {step === 1 && '1. Choose Seats / Tier'}
              {step === 2 && '2. Customer Details'}
              {step === 3 && '3. Secure Payment'}
              {step === 4 && '4. Order Confirmation'}
            </span>
          </div>

          {step < 4 && (
            <div className="hidden sm:flex items-center space-x-1 text-[11px] text-netflix-light-grey">
              <span className={step >= 1 ? 'text-netflix-red font-bold' : ''}>Seats</span>
              <ChevronRight className="w-3 h-3 text-netflix-light-grey" />
              <span className={step >= 2 ? 'text-netflix-red font-bold' : ''}>Attendee</span>
              <ChevronRight className="w-3 h-3 text-netflix-light-grey" />
              <span className={step >= 3 ? 'text-netflix-red font-bold' : ''}>Payment</span>
            </div>
          )}
        </div>

        {/* Step 4: Final Confirmation Screen */}
        {step === 4 ? (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-netflix-white">
                Ticket Order Confirmed!
              </h2>
              <p className="text-sm text-netflix-light-grey max-w-md mx-auto">
                Thank you, <span className="text-netflix-white font-bold">{customerName}</span>. Your digital entry pass for{' '}
                <span className="text-netflix-red font-bold">{event.title}</span> has been issued.
              </p>
            </div>

            {/* Digital Pass Receipt Box */}
            <div className="bg-netflix-black p-5 rounded-md border border-white/10 max-w-md mx-auto text-left space-y-3 shadow-lg">
              <div className="flex justify-between items-center text-xs text-netflix-light-grey border-b border-white/10 pb-2">
                <span>PASS CODE: #TK-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> CONFIRMED
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
                  <span>Seats/Tier:</span>
                  <span className="text-netflix-red font-bold">{tierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="text-netflix-white font-bold">${totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-netflix-red hover:bg-netflix-red/90 text-netflix-white font-bold px-8 py-3 rounded-md transition-all active:scale-95 text-sm cursor-pointer shadow-md"
            >
              View Ticket in Wallet
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
              {/* Step 1: Seat Picker & Tier Selection */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Mode Switcher */}
                  <div className="flex items-center justify-between bg-netflix-black p-1 rounded-md border border-white/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setBookingMode('seats')}
                      className={`flex-1 py-2 text-center rounded-md transition-colors ${
                        bookingMode === 'seats'
                          ? 'bg-netflix-red text-white'
                          : 'text-netflix-light-grey hover:text-white'
                      }`}
                    >
                      Interactive Seat Map
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingMode('tier')}
                      className={`flex-1 py-2 text-center rounded-md transition-colors ${
                        bookingMode === 'tier'
                          ? 'bg-netflix-red text-white'
                          : 'text-netflix-light-grey hover:text-white'
                      }`}
                    >
                      Quick Tier Selection
                    </button>
                  </div>

                  {bookingMode === 'seats' ? (
                    <SeatPicker
                      basePrice={basePriceNumber}
                      onSeatsChange={(seats) => setSelectedSeats(seats)}
                    />
                  ) : (
                    /* Tier Selection */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {tiers.map((tier) => {
                          const price = Math.round(basePriceNumber * tier.multiplier);
                          const isSelected = selectedTier === tier.id;
                          return (
                            <div
                              key={tier.id}
                              onClick={() => setSelectedTier(tier.id as any)}
                              className={`p-4 rounded-md cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? 'bg-netflix-black border-2 border-netflix-red'
                                  : 'bg-netflix-black/60 hover:bg-netflix-black border border-white/5'
                              }`}
                            >
                              <div className="font-bold text-sm text-netflix-white">{tier.name}</div>
                              <p className="text-[11px] text-netflix-light-grey mt-1">{tier.desc}</p>
                              <div className="mt-3 text-lg font-black text-netflix-white">${price}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between bg-netflix-black p-4 rounded-md">
                        <div className="text-xs font-bold text-netflix-white">Number of Tickets</div>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 rounded-md bg-netflix-dark-grey text-white font-bold"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-base text-netflix-white">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.min(6, quantity + 1))}
                            className="w-8 h-8 rounded-md bg-netflix-dark-grey text-white font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Customer Contact Info */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-netflix-white uppercase tracking-wider">
                    Attendee Contact Details
                  </h3>

                  <div className="space-y-3 bg-netflix-black p-4 rounded-md border border-white/5 text-xs">
                    <div className="space-y-1">
                      <label className="text-netflix-light-grey font-semibold">Full Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-netflix-dark-grey text-netflix-white p-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-netflix-light-grey font-semibold">Email Address (For Pass Delivery)</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-netflix-dark-grey text-netflix-white p-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-netflix-light-grey font-semibold">Mobile Phone (SMS Gate Pass)</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-netflix-dark-grey text-netflix-white p-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method & Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-netflix-white uppercase tracking-wider">
                    Select Payment Method
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'card', name: 'Credit Card', icon: CreditCard },
                      { id: 'applepay', name: 'Apple Pay', icon: Smartphone },
                      { id: 'googlepay', name: 'Google Pay', icon: Smartphone },
                      { id: 'crypto', name: 'Crypto Web3', icon: Lock },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-3 rounded-md cursor-pointer text-center space-y-1 transition-all ${
                            isSelected
                              ? 'bg-netflix-black border-2 border-netflix-red text-netflix-red'
                              : 'bg-netflix-black/60 hover:bg-netflix-black text-netflix-light-grey border border-white/5'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto" />
                          <div className="text-xs font-bold">{method.name}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Review Box */}
                  <div className="bg-netflix-black p-4 rounded-md border border-white/10 space-y-2 text-xs">
                    <div className="font-bold text-netflix-white flex justify-between border-b border-white/10 pb-2">
                      <span>Order Summary</span>
                      <span className="text-netflix-red font-black">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-netflix-light-grey">
                      <span>Event:</span>
                      <span className="text-netflix-white font-semibold">{event.title}</span>
                    </div>
                    <div className="flex justify-between text-netflix-light-grey">
                      <span>Passes/Seats:</span>
                      <span className="text-netflix-white font-semibold">{tierName}</span>
                    </div>
                    <div className="flex justify-between text-netflix-light-grey">
                      <span>Recipient:</span>
                      <span className="text-netflix-white font-semibold">{customerName} ({customerEmail})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav Control Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as any)}
                    className="flex items-center space-x-1 bg-netflix-black hover:bg-netflix-black/80 text-netflix-light-grey hover:text-white px-4 py-2.5 rounded-md text-xs font-bold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-[10px] text-netflix-light-grey uppercase font-semibold">Total Price</div>
                    <div className="text-xl font-black text-netflix-white">${totalPrice}</div>
                  </div>

                  {step < 3 ? (
                    <button
                      type="button"
                      disabled={bookingMode === 'seats' && selectedSeats.length === 0}
                      onClick={() => setStep((step + 1) as any)}
                      className="flex items-center space-x-1 bg-netflix-red hover:bg-netflix-red/90 disabled:opacity-50 disabled:cursor-not-allowed text-netflix-white font-extrabold text-sm px-6 py-2.5 rounded-md transition-all active:scale-95 cursor-pointer shadow-md"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="flex items-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white font-extrabold text-sm px-7 py-2.5 rounded-md transition-all active:scale-95 cursor-pointer shadow-lg"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Pay & Issue Pass</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
