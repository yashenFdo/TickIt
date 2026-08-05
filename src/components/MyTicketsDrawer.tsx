import React, { useState } from 'react';
import { X, Crown, QrCode, Calendar, MapPin, Download, Trash2, Send, Check } from 'lucide-react';
import type { EventItem } from '../data/events';
import type { SelectedSeat } from './SeatPicker';

export interface PurchasedTicket {
  id: string;
  event: EventItem;
  tier: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  seats?: SelectedSeat[];
  customerName?: string;
}

interface MyTicketsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: PurchasedTicket[];
  onRemoveTicket: (id: string) => void;
}

export const MyTicketsDrawer: React.FC<MyTicketsDrawerProps> = ({
  isOpen,
  onClose,
  tickets,
  onRemoveTicket,
}) => {
  if (!isOpen) return null;

  const [transferTicketId, setTransferTicketId] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;
    setTransferSuccess(true);
    setTimeout(() => {
      if (transferTicketId) {
        onRemoveTicket(transferTicketId);
      }
      setTransferTicketId(null);
      setTransferSuccess(false);
      setRecipientEmail('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0B0B0B]/85 backdrop-blur-sm animate-fadeIn">
      {/* Slide-out Panel Surface - Deep Luxury Dark (#161616) */}
      <div className="w-full max-w-md bg-[#161616] text-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-[#C5A059]/30 animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#161616] sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#C5A059] p-2 rounded-md shadow-md">
              <Crown className="w-5 h-5 text-[#0B0B0B] fill-[#0B0B0B]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg tracking-tight text-white font-serif">VIP Passes Wallet</h2>
              <p className="text-xs text-[#A0A0A0]">{tickets.length} Active Royal Passes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A0A0A0] hover:text-white rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Crown className="w-12 h-12 text-[#C5A059]/30 mx-auto" />
              <h3 className="text-base font-bold text-white font-serif">No Active VIP Passes</h3>
              <p className="text-xs text-[#A0A0A0] max-w-xs mx-auto">
                Explore Formula 1, royal galas, and private orchestra events to reserve your passes!
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-[#0B0B0B] rounded-md overflow-hidden border border-[#C5A059]/20 p-4 space-y-3 relative group"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">
                    {ticket.tier}
                  </span>
                  <button
                    onClick={() => onRemoveTicket(ticket.id)}
                    className="text-[#A0A0A0] hover:text-[#C5A059] p-1 transition-colors"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Event Info */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white font-serif line-clamp-1">
                    {ticket.event.title}
                  </h4>
                  <div className="text-xs text-[#A0A0A0] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C5A059] shrink-0" />
                    <span>{ticket.event.date} • {ticket.event.time}</span>
                  </div>
                  <div className="text-xs text-[#A0A0A0] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                    <span>{ticket.event.venue}</span>
                  </div>
                </div>

                {/* Simulated Digital Barcode */}
                <div className="bg-[#161616] p-3 rounded-md flex items-center justify-between border border-white/5">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-8 h-8 text-[#C5A059] shrink-0" />
                    <div className="text-[10px] text-[#A0A0A0]">
                      <div className="font-mono text-white">PASS ID: {ticket.id}</div>
                      <div>Scan at Royal Gate</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setTransferTicketId(ticket.id)}
                      className="p-1.5 bg-[#0B0B0B] text-[#A0A0A0] hover:text-white rounded-md transition-colors text-xs font-semibold flex items-center gap-1 border border-white/10"
                      title="Transfer Pass"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => alert(`Saved VIP Pass #${ticket.id} to Apple/Google Wallet!`)}
                      className="p-1.5 bg-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#0B0B0B] rounded-md transition-colors text-xs font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Wallet</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Transfer Modal Overlay */}
        {transferTicketId && (
          <div className="absolute inset-0 bg-[#0B0B0B]/95 z-30 p-6 flex flex-col justify-center animate-fadeIn space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="font-bold text-sm text-white flex items-center gap-2 font-serif">
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>Transfer VIP Pass</span>
              </div>
              <button onClick={() => setTransferTicketId(null)} className="text-[#A0A0A0] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {transferSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-bold text-white text-sm font-serif">Pass Transferred!</div>
                <p className="text-xs text-[#A0A0A0]">
                  Pass sent to <span className="text-[#C5A059] font-semibold">{recipientEmail}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="text-[#A0A0A0] font-semibold">Recipient Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="guest@vip-concierge.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full bg-[#161616] text-white p-2.5 rounded-md border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] font-bold py-2.5 rounded-md text-xs transition-colors uppercase tracking-wider"
                >
                  Send VIP Pass
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#161616]">
          <button
            onClick={onClose}
            className="w-full bg-[#C5A059] hover:bg-[#E6CA65] text-[#0B0B0B] font-bold py-2.5 rounded-md text-sm transition-colors cursor-pointer uppercase tracking-wider"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
