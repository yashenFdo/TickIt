import React, { useState } from 'react';
import { Armchair, Sparkles } from 'lucide-react';

export interface SelectedSeat {
  id: string; // e.g. 'A-12'
  section: string; // e.g. 'VIP Front'
  row: string; // e.g. 'Row A'
  number: number;
  price: number;
}

interface SeatPickerProps {
  basePrice: number;
  onSeatsChange: (seats: SelectedSeat[]) => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({ basePrice, onSeatsChange }) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Venue Layout Configuration
  const sections = [
    { name: 'VIP Front Row', rowPrefix: 'VIP', rows: 2, seatsPerRow: 8, multiplier: 2.2 },
    { name: 'Orchestra Floor', rowPrefix: 'ORCH', rows: 3, seatsPerRow: 10, multiplier: 1.5 },
    { name: 'Balcony Tier', rowPrefix: 'BALC', rows: 3, seatsPerRow: 12, multiplier: 1.0 },
  ];

  // Pre-determined occupied seats for realistic realism
  const occupiedSeatIds = new Set(['VIP-1-3', 'VIP-1-4', 'ORCH-2-5', 'ORCH-2-6', 'BALC-1-8']);

  const handleSeatClick = (sectionName: string, rowIdx: number, seatNum: number, multiplier: number) => {
    const seatId = `${rowIdx + 1}-${seatNum}`;
    const fullId = `${sectionName.substring(0, 3)}-${seatId}`;

    if (occupiedSeatIds.has(fullId)) return;

    const existingIndex = selectedSeats.findIndex((s) => s.id === fullId);
    let updated: SelectedSeat[];

    if (existingIndex > -1) {
      updated = selectedSeats.filter((s) => s.id !== fullId);
    } else {
      if (selectedSeats.length >= 6) {
        alert('Maximum 6 seats allowed per booking.');
        return;
      }
      const newSeat: SelectedSeat = {
        id: fullId,
        section: sectionName,
        row: `Row ${rowIdx + 1}`,
        number: seatNum,
        price: Math.round(basePrice * multiplier),
      };
      updated = [...selectedSeats, newSeat];
    }

    setSelectedSeats(updated);
    onSeatsChange(updated);
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6 bg-netflix-black p-4 sm:p-6 rounded-md border border-white/5">
      {/* Stage Visual Indicator */}
      <div className="space-y-2 text-center">
        <div className="w-3/4 mx-auto h-3 bg-gradient-to-r from-transparent via-netflix-red to-transparent rounded-full shadow-[0_0_15px_rgba(229,9,20,0.6)] animate-pulse" />
        <div className="text-[10px] tracking-widest uppercase font-bold text-netflix-light-grey">
          ✦ MAIN STAGE / PERFORMANCE AREA ✦
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-netflix-light-grey pt-2 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 rounded-sm bg-emerald-500/80" />
          <span>Available</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 rounded-sm bg-netflix-red ring-2 ring-netflix-red/50" />
          <span className="text-netflix-white font-bold">Selected</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 rounded-sm bg-neutral-800 border border-white/10 opacity-60" />
          <span>Occupied</span>
        </div>
      </div>

      {/* Interactive Seating Sections */}
      <div className="space-y-6 overflow-x-auto no-scrollbar py-2">
        {sections.map((section) => (
          <div key={section.name} className="space-y-2 text-center min-w-[360px]">
            <div className="text-xs font-bold text-netflix-white flex items-center justify-center gap-1.5">
              <span>{section.name}</span>
              <span className="text-[10px] text-netflix-red font-semibold">
                (${Math.round(basePrice * section.multiplier)})
              </span>
            </div>

            <div className="space-y-1.5 inline-block">
              {Array.from({ length: section.rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                  <span className="text-[9px] font-mono text-netflix-light-grey w-6 text-right">
                    R{rowIdx + 1}
                  </span>

                  {Array.from({ length: section.seatsPerRow }).map((_, seatIdx) => {
                    const seatNum = seatIdx + 1;
                    const fullId = `${section.name.substring(0, 3)}-${rowIdx + 1}-${seatNum}`;
                    const isOccupied = occupiedSeatIds.has(fullId);
                    const isSelected = selectedSeats.some((s) => s.id === fullId);

                    return (
                      <button
                        key={seatNum}
                        type="button"
                        disabled={isOccupied}
                        onClick={() =>
                          handleSeatClick(section.name, rowIdx, seatNum, section.multiplier)
                        }
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-200 focus:outline-none ${
                          isOccupied
                            ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-white/5'
                            : isSelected
                            ? 'bg-netflix-red text-white scale-110 shadow-md ring-2 ring-white/20'
                            : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title={`${section.name} Row ${rowIdx + 1} Seat ${seatNum} - $${Math.round(
                          basePrice * section.multiplier
                        )}`}
                      >
                        <Armchair className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}

                  <span className="text-[9px] font-mono text-netflix-light-grey w-6 text-left">
                    R{rowIdx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Seats Summary Box */}
      <div className="bg-netflix-dark-grey p-3.5 rounded-md border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="font-bold text-netflix-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-netflix-red" />
            <span>Selected Seats ({selectedSeats.length})</span>
          </div>
          {selectedSeats.length === 0 ? (
            <div className="text-netflix-light-grey text-[11px]">
              Click on any available green seat above to select
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedSeats.map((s) => (
                <span
                  key={s.id}
                  className="bg-netflix-red/20 text-netflix-red border border-netflix-red/40 px-2 py-0.5 rounded-md font-semibold text-[10px]"
                >
                  {s.section} {s.row} S{s.number} (${s.price})
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="text-right w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
          <div className="text-[10px] text-netflix-light-grey uppercase font-medium">Subtotal</div>
          <div className="text-lg font-black text-netflix-white">${totalPrice}</div>
        </div>
      </div>
    </div>
  );
};
