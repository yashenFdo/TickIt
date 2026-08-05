import React, { useState } from 'react';
import { X, Ticket, QrCode, Calendar, MapPin, Download, Trash2, Send, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex justify-end bg-netflix-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Slide-out Panel Surface - Netflix Dark Grey (#141414) */}
      <div className="w-full max-w-md bg-netflix-dark-grey text-netflix-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-white/10 animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-netflix-dark-grey sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="bg-netflix-red p-1.5 rounded-md">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg tracking-tight text-netflix-white">My Digital Wallet</h2>
              <p className="text-xs text-netflix-light-grey">{tickets.length} Purchased Mobile Tickets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-netflix-light-grey hover:text-white rounded-md hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Ticket className="w-12 h-12 text-netflix-light-grey/40 mx-auto" />
              <h3 className="text-base font-bold text-netflix-white">No Purchased Tickets Yet</h3>
              <p className="text-xs text-netflix-light-grey max-w-xs mx-auto">
                Explore trending concerts, standup comedy, and sports events to buy your digital passes!
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-netflix-black rounded-md overflow-hidden border border-white/10 p-4 space-y-3 relative group"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-netflix-red font-bold uppercase tracking-wider text-[10px]">
                    {ticket.tier}
                  </span>
                  <button
                    onClick={() => onRemoveTicket(ticket.id)}
                    className="text-netflix-light-grey hover:text-netflix-red p-1 transition-colors"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Event Info */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-netflix-white line-clamp-1">
                    {ticket.event.title}
                  </h4>
                  <div className="text-xs text-netflix-light-grey flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-netflix-red shrink-0" />
                    <span>{ticket.event.date} • {ticket.event.time}</span>
                  </div>
                  <div className="text-xs text-netflix-light-grey flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-netflix-red shrink-0" />
                    <span>{ticket.event.venue}</span>
                  </div>
                </div>

                {/* Simulated Digital Barcode */}
                <div className="bg-netflix-dark-grey p-3 rounded-md flex items-center justify-between border border-white/5">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-8 h-8 text-netflix-white shrink-0" />
                    <div className="text-[10px] text-netflix-light-grey">
                      <div className="font-mono text-white">CODE: {ticket.id}</div>
                      <div>Scan at Venue Entry Gate</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setTransferTicketId(ticket.id)}
                      className="p-1.5 bg-netflix-black text-netflix-light-grey hover:text-white rounded-md transition-colors text-xs font-semibold flex items-center gap-1 border border-white/10"
                      title="Transfer Pass"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => alert(`Saved Pass #${ticket.id} to Apple/Google Wallet!`)}
                      className="p-1.5 bg-netflix-red/20 text-netflix-red hover:bg-netflix-red hover:text-white rounded-md transition-colors text-xs font-bold flex items-center gap-1"
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
          <div className="absolute inset-0 bg-netflix-black/95 z-30 p-6 flex flex-col justify-center animate-fadeIn space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-netflix-red" />
                <span>Transfer Ticket Pass</span>
              </div>
              <button onClick={() => setTransferTicketId(null)} className="text-netflix-light-grey hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {transferSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-bold text-white text-sm">Pass Transferred Successfully!</div>
                <p className="text-xs text-netflix-light-grey">
                  Sent to <span className="text-netflix-red font-semibold">{recipientEmail}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="text-netflix-light-grey font-semibold">Recipient Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="friend@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full bg-netflix-dark-grey text-white p-2.5 rounded-md border border-white/10 focus:border-netflix-red focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white font-bold py-2.5 rounded-md text-xs transition-colors uppercase tracking-wider"
                >
                  Send Mobile Ticket
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-netflix-dark-grey">
          <button
            onClick={onClose}
            className="w-full bg-netflix-red hover:bg-netflix-red/90 text-netflix-white font-bold py-2.5 rounded-md text-sm transition-colors cursor-pointer uppercase tracking-wider"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
