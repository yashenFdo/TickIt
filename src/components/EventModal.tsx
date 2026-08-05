import React, { useState } from 'react';
import { X, Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import type { EventItem } from '../data/events';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
  onConfirmPurchase: (ticketInfo: {
    event: EventItem;
    tier: string;
    quantity: number;
    totalPrice: number;
  }) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onConfirmPurchase }) => {
  if (!event) return null;

  const [selectedTier, setSelectedTier] = useState<'standard' | 'vip' | 'backstage'>('standard');
  const [quantity, setQuantity] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

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
  const totalPrice = unitPrice * quantity;

  const handleCheckout = () => {
    onConfirmPurchase({
      event,
      tier: currentTierObj.name,
      quantity,
      totalPrice,
    });
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-netflix-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Surface Container - Netflix Dark Grey (#141414) */}
      <div className="relative w-full max-w-3xl bg-netflix-dark-grey text-netflix-white rounded-md overflow-hidden shadow-2xl border border-white/5 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-netflix-black/70 text-netflix-light-grey hover:text-netflix-white hover:bg-netflix-red transition-all duration-200"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {purchaseSuccess ? (
          /* Purchase Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-netflix-white">
                Ticket Order Confirmed!
              </h2>
              <p className="text-sm text-netflix-light-grey max-w-md mx-auto">
                You have successfully reserved <span className="text-netflix-white font-bold">{quantity}x {currentTierObj.name}</span> for{' '}
                <span className="text-netflix-red font-bold">{event.title}</span>.
              </p>
            </div>

            {/* Simulated Digital Ticket Stub */}
            <div className="bg-netflix-black p-4 rounded-md border border-white/10 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between items-center text-xs text-netflix-light-grey border-b border-white/10 pb-2">
                <span>ORDER ID: #TK-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span className="text-emerald-400 font-semibold">VALID TICKET</span>
              </div>
              <div className="text-sm font-bold text-netflix-white">{event.title}</div>
              <div className="text-xs text-netflix-light-grey flex items-center justify-between">
                <span>{event.date} • {event.time}</span>
                <span className="text-netflix-red font-bold">${totalPrice}</span>
              </div>
            </div>

            <p className="text-xs text-netflix-light-grey animate-pulse">
              Adding to your TickIt Wallet...
            </p>
          </div>
        ) : (
          /* Normal Ticket Booking Screen */
          <div>
            {/* Backdrop & Header Banner */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-black">
              <img
                src={event.backdropUrl}
                alt={event.title}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-netflix-dark-grey/40 to-transparent" />

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
                <h2 className="text-2xl sm:text-4xl font-black text-netflix-white uppercase tracking-tight font-sans">
                  {event.title}
                </h2>
                <p className="text-xs sm:text-sm text-netflix-light-grey">{event.subtitle}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-netflix-black p-3.5 rounded-md text-xs">
                <div className="flex items-center space-x-2 text-netflix-light-grey">
                  <Calendar className="w-4 h-4 text-netflix-red shrink-0" />
                  <div>
                    <div className="text-[10px] text-netflix-light-grey uppercase">Date & Time</div>
                    <div className="font-semibold text-netflix-white">{event.date} • {event.time}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-netflix-light-grey">
                  <MapPin className="w-4 h-4 text-netflix-red shrink-0" />
                  <div>
                    <div className="text-[10px] text-netflix-light-grey uppercase">Venue</div>
                    <div className="font-semibold text-netflix-white">{event.venue}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-netflix-light-grey">
                  <UserCheck className="w-4 h-4 text-netflix-red shrink-0" />
                  <div>
                    <div className="text-[10px] text-netflix-light-grey uppercase">Performers</div>
                    <div className="font-semibold text-netflix-white truncate">{event.performers.join(', ')}</div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-netflix-light-grey uppercase tracking-wider">
                  About Event
                </h3>
                <p className="text-xs sm:text-sm text-netflix-light-grey leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Ticket Tier Selection */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-netflix-light-grey uppercase tracking-wider">
                  Select Ticket Tier
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tiers.map((tier) => {
                    const price = Math.round(basePriceNumber * tier.multiplier);
                    const isSelected = selectedTier === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as any)}
                        className={`p-3.5 rounded-md cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-netflix-black border-2 border-netflix-red'
                            : 'bg-netflix-black/60 hover:bg-netflix-black border border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-sm">
                          <span className={isSelected ? 'text-netflix-red' : 'text-netflix-white'}>
                            {tier.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-netflix-light-grey mt-1 line-clamp-2">
                          {tier.desc}
                        </p>
                        <div className="mt-3 text-base font-extrabold text-netflix-white">
                          ${price}{' '}
                          <span className="text-[10px] text-netflix-light-grey font-normal">/ ticket</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center justify-between bg-netflix-black p-4 rounded-md">
                <div>
                  <div className="text-xs font-bold text-netflix-white">Quantity</div>
                  <div className="text-[11px] text-netflix-light-grey">Maximum 6 tickets per order</div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-md bg-netflix-dark-grey text-netflix-white hover:bg-netflix-red font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base text-netflix-white px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(6, quantity + 1))}
                    className="w-8 h-8 rounded-md bg-netflix-dark-grey text-netflix-white hover:bg-netflix-red font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Footer Total & Checkout CTA Button - netflix-red rounded-md (NO pills!) */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 gap-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xs text-netflix-light-grey uppercase font-semibold">Total Price:</span>
                  <span className="text-2xl font-black text-netflix-white">${totalPrice}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">No Hidden Fees</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-netflix-red hover:bg-netflix-red/90 text-netflix-white font-extrabold text-base px-8 py-3 rounded-md transition-all active:scale-95 cursor-pointer shadow-lg"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Confirm & Complete Booking</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-netflix-light-grey pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified 100% Authentic Ticket Guarantee by TickIt Secure</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
