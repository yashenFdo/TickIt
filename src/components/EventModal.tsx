import React, { useState, useEffect, useRef } from 'react';
import {
  X, Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2,
  Sparkles, Star, ThumbsUp, Zap, Users, Award, Info,
  ChevronRight, ChevronLeft, Minus, Plus, QrCode, Download,
  Clock, Flame, MessageSquare,
} from 'lucide-react';
import type { EventItem } from '../data/events';
import type { UserProfile } from './AuthModal';
import type { SelectedSeat } from './SeatPicker';

/* ─────────────────────────────────────────────────
   Types & constants
───────────────────────────────────────────────── */
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

type BookingStep = 1 | 2 | 3 | 4; // 1=Details, 2=Tickets, 3=Review, 4=Success

const STEP_LABELS: Record<BookingStep, string> = {
  1: 'Event Details',
  2: 'Choose Tickets',
  3: 'Review Order',
  4: 'Confirmed',
};

const buildTiers = (basePrice: number) => [
  {
    id: 'general' as const,
    name: 'General Admission',
    multiplier: 1,
    badge: null,
    color: 'border-white/15 hover:border-white/30',
    activeBorder: 'border-white/50',
    perks: [
      'Standard floor / seating area',
      'Mobile digital entry pass',
      'Access to all general areas',
      'Event programme',
    ],
    get price() { return Math.round(basePrice * this.multiplier); },
  },
  {
    id: 'vip' as const,
    name: 'VIP Premium',
    multiplier: 1.8,
    badge: 'Most Popular',
    color: 'border-amber-500/40 hover:border-amber-500/70',
    activeBorder: 'border-amber-400',
    perks: [
      'Premium front-row seating',
      'VIP fast-track entry lane',
      'Complimentary welcome drink',
      'Exclusive VIP lounge access',
      'Dedicated VIP host staff',
    ],
    get price() { return Math.round(basePrice * this.multiplier); },
  },
  {
    id: 'backstage' as const,
    name: 'Backstage Ultimate',
    multiplier: 3.2,
    badge: '🔥 Rare',
    color: 'border-netflix-red/40 hover:border-netflix-red/70',
    activeBorder: 'border-netflix-red',
    perks: [
      'All VIP perks included',
      'Backstage access pass',
      'Performer meet & greet',
      'Signed exclusive merchandise',
      'Professional photo opportunity',
      'Pre-show soundcheck access',
    ],
    get price() { return Math.round(basePrice * this.multiplier); },
  },
];

/* ─────────────────────────────────────────────────
   Step Progress Bar
───────────────────────────────────────────────── */
const StepBar: React.FC<{ currentStep: BookingStep }> = ({ currentStep }) => {
  const steps: BookingStep[] = [1, 2, 3, 4];
  return (
    <div className="flex items-center px-5 py-4 bg-netflix-black/60 border-b border-white/8">
      {steps.map((step, idx) => {
        const done = currentStep > step;
        const active = currentStep === step;
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2 flex-none">
              {/* Circle */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                  ? 'bg-netflix-red text-white ring-4 ring-netflix-red/20'
                  : 'bg-white/8 text-white/30'
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : step}
              </div>
              {/* Label — hidden on very small screens except active */}
              <span className={`text-[11px] font-semibold transition-colors hidden sm:block ${
                active ? 'text-white' : done ? 'text-emerald-400' : 'text-white/30'
              }`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 sm:mx-3 transition-all duration-300 ${
                currentStep > step ? 'bg-emerald-500' : 'bg-white/10'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Step 1 — Event Details
───────────────────────────────────────────────── */
const Step1Details: React.FC<{
  event: EventItem;
  onContinue: () => void;
}> = ({ event, onContinue }) => {
  const reviews = [
    { id: 'r1', author: 'Marcus Vance', rating: 5, date: '2 days ago', comment: 'Mind-blowing production! The spatial audio and laser lighting were truly cinematic. Worth every dollar!', likes: 34, verified: true },
    { id: 'r2', author: 'Elena Rostova', rating: 5, date: '1 week ago', comment: 'Front row VIP seats gave an unmatched view. The mobile entry pass worked seamlessly at the gate.', likes: 21, verified: true },
    { id: 'r3', author: 'James Okafor', rating: 4, date: '2 weeks ago', comment: 'Incredible atmosphere. Sound quality was exceptional. Minor queuing issue at entry but staff sorted it fast.', likes: 9, verified: true },
  ];

  return (
    <div className="space-y-5">
      {/* Event Header Image */}
      <div className="relative h-40 sm:h-52 overflow-hidden">
        <img src={event.backdropUrl} alt={event.title} className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark-grey via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-12 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-netflix-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {event.category}
            </span>
            {event.isLive && (
              <span className="bg-black/70 text-netflix-red border border-netflix-red text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-netflix-red rounded-full" />LIVE NOW
              </span>
            )}
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-emerald-400" />
              {event.matchPercentage}% Match
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">
            {event.title}
          </h2>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {/* Quick meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          {[
            { icon: <Calendar className="w-4 h-4 text-netflix-red" />, label: 'Date', value: event.date },
            { icon: <Clock className="w-4 h-4 text-netflix-red" />, label: 'Time', value: event.time },
            { icon: <MapPin className="w-4 h-4 text-netflix-red" />, label: 'Venue', value: `${event.venue}, ${event.location}` },
            { icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />, label: 'Rating', value: event.rating },
            { icon: <Flame className="w-4 h-4 text-netflix-red" />, label: 'Availability', value: `${event.ticketsRemaining} tickets left!` },
            { icon: <Ticket className="w-4 h-4 text-netflix-red" />, label: 'From', value: event.price },
          ].map((item) => (
            <div key={item.label} className="bg-netflix-black rounded p-2.5 flex items-start gap-2 border border-white/5">
              {item.icon}
              <div>
                <div className="text-white/40 text-[9px] uppercase tracking-wider">{item.label}</div>
                <div className="text-white font-semibold text-[11px] mt-0.5 leading-snug">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest">
            <Info className="w-4 h-4 text-netflix-red" />About This Event
          </h3>
          <p className="text-xs text-white/60 leading-relaxed">
            {event.fullDescription || event.description}
          </p>
        </div>

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Users className="w-4 h-4 text-netflix-red" />Guest Speakers & Performers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {event.speakers.map((sp) => (
                <div key={sp.name} className="flex items-center gap-3 bg-netflix-black p-2.5 rounded border border-white/5">
                  <img src={sp.avatar} alt={sp.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-netflix-red/30" />
                  <div>
                    <div className="text-sm font-bold text-white">{sp.name}</div>
                    <div className="text-[11px] text-white/50">{sp.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsors */}
        {event.sponsors && event.sponsors.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Award className="w-4 h-4 text-netflix-red" />Official Sponsors
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.sponsors.map((sp) => (
                <span key={sp.name} className="text-[11px] bg-netflix-black text-white/70 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-netflix-red" />
                  {sp.name}
                  <span className="text-white/30">· {sp.tier}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-netflix-red" />Fan Reviews
          </h3>
          <div className="space-y-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-netflix-black p-3 rounded border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-emerald-400 text-[9px] font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-white/50 leading-relaxed">{rev.comment}</p>
                <button className="flex items-center gap-1 text-white/30 hover:text-netflix-red transition-colors">
                  <ThumbsUp className="w-3 h-3" />{rev.likes} helpful
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="sticky bottom-0 px-5 pb-5 pt-3 bg-netflix-dark-grey border-t border-white/5">
        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-extrabold text-base py-3.5 rounded transition-all active:scale-[0.98] cursor-pointer shadow-lg"
        >
          <Ticket className="w-5 h-5" />
          Choose Your Tickets
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Step 2 — Choose Ticket Tier
───────────────────────────────────────────────── */
const Step2Tickets: React.FC<{
  event: EventItem;
  selectedTier: 'general' | 'vip' | 'backstage';
  quantity: number;
  onTierChange: (tier: 'general' | 'vip' | 'backstage') => void;
  onQuantityChange: (qty: number) => void;
  onBack: () => void;
  onContinue: () => void;
}> = ({ event, selectedTier, quantity, onTierChange, onQuantityChange, onBack, onContinue }) => {
  const basePrice = parseInt(event.price.replace(/[^0-9]/g, '')) || 95;
  const tiers = buildTiers(basePrice);
  const activeTier = tiers.find((t) => t.id === selectedTier)!;
  const subtotal = activeTier.price * quantity;
  const fees = Math.round(subtotal * 0.12);
  const total = subtotal + fees;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Instruction */}
        <div className="bg-netflix-red/8 border border-netflix-red/20 rounded p-3 text-xs text-white/70 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-netflix-red shrink-0 mt-0.5" />
          <span>Select the ticket type that best suits you, then choose how many tickets you need. You can purchase up to <strong className="text-white">6 tickets</strong> per booking.</span>
        </div>

        {/* Tier Cards */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Step 1 of 2 — Pick Your Ticket Type</p>
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onTierChange(tier.id)}
                className={`w-full text-left rounded border-2 p-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${tier.activeBorder} bg-white/5`
                    : `${tier.color} bg-netflix-black/50`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Radio dot */}
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                        isSelected ? 'border-netflix-red bg-netflix-red' : 'border-white/30'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-white text-sm">{tier.name}</span>
                      {tier.badge && (
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          tier.id === 'vip' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          tier.id === 'backstage' ? 'bg-netflix-red/20 text-netflix-red border border-netflix-red/30' : ''
                        }`}>
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    {/* Perks list */}
                    <ul className="space-y-1 pl-6">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="text-[11px] text-white/55 flex items-center gap-1.5">
                          <span className={`w-1 h-1 rounded-full shrink-0 ${isSelected ? 'bg-netflix-red' : 'bg-white/20'}`} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Price */}
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-white">${tier.price}</div>
                    <div className="text-[10px] text-white/40">per ticket</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quantity */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Step 2 of 2 — How Many Tickets?</p>
          <div className="bg-netflix-black rounded border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Number of Tickets</div>
                <div className="text-xs text-white/40 mt-0.5">Maximum 6 per booking</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded bg-netflix-dark-grey border border-white/10 hover:bg-netflix-red hover:border-netflix-red text-white font-bold transition-all flex items-center justify-center active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-black text-white w-8 text-center tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.min(6, quantity + 1))}
                  className="w-9 h-9 rounded bg-netflix-dark-grey border border-white/10 hover:bg-netflix-red hover:border-netflix-red text-white font-bold transition-all flex items-center justify-center active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer — price summary + CTA */}
      <div className="px-5 py-4 border-t border-white/8 bg-netflix-dark-grey space-y-3">
        {/* Mini price breakdown */}
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{quantity} × {activeTier.name} @ ${activeTier.price}</span>
          <span className="font-semibold text-white">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Service & Booking Fees (12%)</span>
          <span>${fees}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-extrabold text-white border-t border-white/10 pt-2">
          <span>Total</span>
          <span className="text-lg text-netflix-red">${total}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-white/50 hover:text-white text-sm font-semibold px-4 py-3 rounded border border-white/10 hover:border-white/30 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <button
            onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-extrabold text-sm py-3 rounded transition-all active:scale-[0.98] cursor-pointer"
          >
            Review My Order <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Step 3 — Review & Pay
───────────────────────────────────────────────── */
const Step3Review: React.FC<{
  event: EventItem;
  selectedTier: 'general' | 'vip' | 'backstage';
  quantity: number;
  attendeeName: string;
  currentUser: UserProfile | null;
  onNameChange: (name: string) => void;
  onBack: () => void;
  onPay: () => void;
  onOpenAuthModal: () => void;
}> = ({ event, selectedTier, quantity, attendeeName, currentUser, onNameChange, onBack, onPay, onOpenAuthModal }) => {
  const basePrice = parseInt(event.price.replace(/[^0-9]/g, '')) || 95;
  const tiers = buildTiers(basePrice);
  const tier = tiers.find((t) => t.id === selectedTier)!;
  const subtotal = tier.price * quantity;
  const fees = Math.round(subtotal * 0.12);
  const total = subtotal + fees;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Order Summary Card */}
        <div className="bg-netflix-black rounded-lg border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-netflix-red" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Order Summary</span>
          </div>
          <div className="p-4 space-y-3">
            {/* Event row */}
            <div className="flex gap-3">
              <img src={event.posterUrl} alt={event.title} className="w-16 aspect-video object-cover rounded" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-netflix-red font-bold uppercase tracking-wider">{event.category}</div>
                <div className="text-sm font-bold text-white leading-tight line-clamp-2">{event.title}</div>
                <div className="text-[11px] text-white/40 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />{event.date} · {event.time}
                </div>
                <div className="text-[11px] text-white/40 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />{event.venue}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Ticket Type</span>
                <span className="text-white font-semibold">{tier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Quantity</span>
                <span className="text-white font-semibold">{quantity} ticket{quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Price per ticket</span>
                <span className="text-white font-semibold">${tier.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Service fees (12%)</span>
                <span>${fees}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm border-t border-white/10 pt-2">
                <span className="text-white">Total Due</span>
                <span className="text-netflix-red text-base">${total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendee Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-netflix-red" />Attendee Information
          </h3>

          {currentUser ? (
            <div className="bg-netflix-black rounded border border-emerald-500/25 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded object-cover ring-2 ring-netflix-red/50" />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {currentUser.name}
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">✓ Verified</span>
                  </div>
                  <div className="text-[11px] text-white/40">{currentUser.email}</div>
                </div>
              </div>
              <span className="text-[10px] text-white/30 font-medium">Auto-filled</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Guest input */}
              <div className="space-y-1">
                <label className="text-xs text-white/50 font-semibold">Full Name (for ticket)</label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-netflix-black text-white text-sm p-3 rounded border border-white/10 focus:border-netflix-red focus:outline-none placeholder-white/25"
                />
              </div>
              {/* Sign in nudge */}
              <div className="bg-netflix-red/8 border border-netflix-red/25 rounded p-3 flex items-center justify-between gap-3">
                <p className="text-xs text-white/60">
                  <strong className="text-white">Sign in</strong> for faster checkout and to save your tickets automatically.
                </p>
                <button
                  onClick={onOpenAuthModal}
                  className="shrink-0 text-xs font-bold text-netflix-red hover:underline cursor-pointer"
                >
                  Sign In →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* What you get */}
        <div className="bg-netflix-black rounded border border-white/8 p-4 space-y-2">
          <div className="text-xs font-bold text-white uppercase tracking-widest">What's Included</div>
          <ul className="space-y-1.5">
            {tier.perks.map((perk) => (
              <li key={perk} className="text-[11px] text-white/55 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {perk}
              </li>
            ))}
            <li className="text-[11px] text-white/55 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Instant mobile QR pass (delivered to your TickIt wallet)
            </li>
            <li className="text-[11px] text-white/55 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              100% authentic ticket guarantee
            </li>
          </ul>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-white/30 py-2">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />Secure checkout</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" />Instant delivery</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />Free cancellation (48hr)</span>
        </div>
      </div>

      {/* Sticky Pay CTA */}
      <div className="px-5 py-4 border-t border-white/8 bg-netflix-dark-grey space-y-2">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-white/50 hover:text-white text-sm font-semibold px-4 py-3.5 rounded border border-white/10 hover:border-white/30 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <button
            onClick={onPay}
            disabled={!attendeeName.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded transition-all active:scale-[0.98] cursor-pointer shadow-lg"
          >
            <Zap className="w-4 h-4 fill-white" />
            Confirm & Pay ${total}
          </button>
        </div>
        <p className="text-center text-[10px] text-white/25">
          By confirming you agree to TickIt's Terms of Service and Refund Policy
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Step 4 — Success / Confirmation
───────────────────────────────────────────────── */
const Step4Success: React.FC<{
  event: EventItem;
  tier: string;
  quantity: number;
  total: number;
  attendeeName: string;
  passCode: string;
  onClose: () => void;
  onViewWallet: () => void;
}> = ({ event, tier, quantity, total, attendeeName, passCode, onClose, onViewWallet }) => (
  <div className="px-5 py-8 space-y-6 text-center animate-fadeIn">
    {/* Success icon */}
    <div className="flex flex-col items-center gap-3">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white">Ticket Confirmed!</h2>
        <p className="text-sm text-white/50 mt-1">
          Your pass is ready, <span className="text-white font-semibold">{attendeeName.split(' ')[0]}</span>.
        </p>
      </div>
    </div>

    {/* Digital Pass Card */}
    <div className="max-w-sm mx-auto bg-netflix-black rounded-xl border border-white/10 overflow-hidden shadow-2xl text-left">
      {/* Card Header — red band */}
      <div className="bg-netflix-red px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest text-red-200">TickIt Digital Pass</div>
          <div className="text-white font-black text-sm truncate max-w-[200px]">{event.title}</div>
        </div>
        <Ticket className="w-6 h-6 text-white/50" />
      </div>

      {/* Card body */}
      <div className="p-4 space-y-4">
        {/* Pass details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-white/30 uppercase tracking-wider text-[9px]">Date</div>
            <div className="text-white font-semibold">{event.date}</div>
          </div>
          <div>
            <div className="text-white/30 uppercase tracking-wider text-[9px]">Time</div>
            <div className="text-white font-semibold">{event.time}</div>
          </div>
          <div>
            <div className="text-white/30 uppercase tracking-wider text-[9px]">Venue</div>
            <div className="text-white font-semibold leading-snug">{event.venue}</div>
          </div>
          <div>
            <div className="text-white/30 uppercase tracking-wider text-[9px]">Tier</div>
            <div className="text-netflix-red font-bold">{tier}</div>
          </div>
          <div>
            <div className="text-white/30 uppercase tracking-wider text-[9px]">Quantity</div>
            <div className="text-white font-semibold">{quantity} ticket{quantity > 1 ? 's' : ''}</div>
          </div>
          <div>
            <div className="text-white/30 uppercase tracking-wider text-[9px]">Total Paid</div>
            <div className="text-white font-bold">${total}</div>
          </div>
        </div>

        {/* QR Code placeholder */}
        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/8">
          <div className="bg-white p-2 rounded">
            <QrCode className="w-12 h-12 text-black" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="text-white font-mono font-bold tracking-wider">{passCode}</div>
            <div className="text-white/40">Scan at venue entry gate</div>
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
              <ShieldCheck className="w-3 h-3" />100% Verified Pass
            </div>
          </div>
        </div>

        {/* Attendee */}
        <div className="text-xs text-center text-white/30">
          Issued to <span className="text-white font-bold">{attendeeName}</span>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="mx-4 border-t border-dashed border-white/10" />

      {/* Card footer */}
      <div className="px-4 py-3 flex items-center justify-between text-[10px] text-white/30">
        <span>TickIt Inc. · Powered by TickIt Express™</span>
        <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3 h-3" />Authentic</span>
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
      <button
        onClick={onViewWallet}
        className="flex-1 flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 text-white font-bold text-sm py-3 rounded transition-all active:scale-[0.98] cursor-pointer"
      >
        <Ticket className="w-4 h-4" />View in Wallet
      </button>
      <button
        onClick={() => alert(`Pass ${passCode} saved to Apple/Google Wallet!`)}
        className="flex-1 flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm py-3 rounded transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />Save Pass
      </button>
    </div>

    <button onClick={onClose} className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer">
      Close & return to events
    </button>
  </div>
);

/* ─────────────────────────────────────────────────
   MAIN MODAL WRAPPER
───────────────────────────────────────────────── */
export const EventModal: React.FC<EventModalProps> = ({
  event,
  currentUser,
  onOpenAuthModal,
  onClose,
  onConfirmPurchase,
}) => {
  if (!event) return null;

  const [step, setStep] = useState<BookingStep>(1);
  const [selectedTier, setSelectedTier] = useState<'general' | 'vip' | 'backstage'>('general');
  const [quantity, setQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState(currentUser?.name ?? '');
  const [passCode] = useState(`TK-${Math.floor(100000 + Math.random() * 900000)}`);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Sync name when user logs in mid-flow
  useEffect(() => {
    if (currentUser?.name) setAttendeeName(currentUser.name);
  }, [currentUser]);

  // Scroll modal body to top on step change
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Reset state when event changes
  useEffect(() => {
    setStep(1);
    setSelectedTier('general');
    setQuantity(1);
    setAttendeeName(currentUser?.name ?? '');
  }, [event?.id]);

  const basePrice = parseInt(event.price.replace(/[^0-9]/g, '')) || 95;
  const tiers = buildTiers(basePrice);
  const activeTier = tiers.find((t) => t.id === selectedTier)!;
  const subtotal = activeTier.price * quantity;
  const fees = Math.round(subtotal * 0.12);
  const total = subtotal + fees;

  const handlePay = () => {
    onConfirmPurchase({
      event,
      tier: activeTier.name,
      quantity,
      totalPrice: total,
      seats: [],
      customerName: attendeeName,
    });
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Panel */}
      <div
        ref={bodyRef}
        className="relative w-full max-w-xl sm:max-w-2xl bg-netflix-dark-grey text-white rounded-xl overflow-hidden shadow-2xl border border-white/8 flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 text-white/60 hover:text-white hover:bg-netflix-red flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step progress bar — hide on success */}
        {step < 4 && <StepBar currentStep={step} />}

        {/* Step content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <Step1Details event={event} onContinue={() => setStep(2)} />
          )}
          {step === 2 && (
            <Step2Tickets
              event={event}
              selectedTier={selectedTier}
              quantity={quantity}
              onTierChange={setSelectedTier}
              onQuantityChange={setQuantity}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Review
              event={event}
              selectedTier={selectedTier}
              quantity={quantity}
              attendeeName={attendeeName}
              currentUser={currentUser}
              onNameChange={setAttendeeName}
              onBack={() => setStep(2)}
              onPay={handlePay}
              onOpenAuthModal={onOpenAuthModal}
            />
          )}
          {step === 4 && (
            <Step4Success
              event={event}
              tier={activeTier.name}
              quantity={quantity}
              total={total}
              attendeeName={attendeeName}
              passCode={passCode}
              onClose={onClose}
              onViewWallet={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
