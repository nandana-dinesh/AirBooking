import React, { useState } from 'react';
import { X, Check, Info, Plane } from 'lucide-react';

export const SeatMapModal = ({
  isOpen,
  onClose,
  occupiedSeats = [],
  seatCount = 1,
  selectedSeats = [],
  onConfirmSeats,
  cabinClass = 'ECONOMY',
}) => {
  if (!isOpen) return null;

  const [currentSelected, setCurrentSelected] = useState([...selectedSeats]);

  // Generate 12 sample rows for intuitive desktop/mobile UI
  const rows = [
    { row: 1, type: 'BUSINESS' },
    { row: 2, type: 'BUSINESS' },
    { row: 3, type: 'BUSINESS' },
    { row: 4, type: 'ECONOMY' },
    { row: 5, type: 'ECONOMY' },
    { row: 6, type: 'ECONOMY' },
    { row: 7, type: 'ECONOMY' },
    { row: 8, type: 'ECONOMY' },
    { row: 9, type: 'ECONOMY' },
    { row: 10, type: 'ECONOMY' },
    { row: 11, type: 'ECONOMY' },
    { row: 12, type: 'ECONOMY' },
  ];

  const leftCols = ['A', 'B', 'C'];
  const rightCols = ['D', 'E', 'F'];

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    if (currentSelected.includes(seatId)) {
      setCurrentSelected(currentSelected.filter((s) => s !== seatId));
    } else {
      if (currentSelected.length >= seatCount) {
        // Replace oldest or replace all if 1
        if (seatCount === 1) {
          setCurrentSelected([seatId]);
        } else {
          setCurrentSelected([...currentSelected.slice(1), seatId]);
        }
      } else {
        setCurrentSelected([...currentSelected, seatId]);
      }
    }
  };

  const handleConfirm = () => {
    onConfirmSeats(currentSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Plane className="w-5 h-5 -rotate-45" />
            <div>
              <h3 className="font-bold text-lg">Aircraft Seat Map</h3>
              <p className="text-xs text-sky-100">
                Select {seatCount} {seatCount === 1 ? 'seat' : 'seats'} for your travel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-white border border-slate-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-sky-600 border border-sky-700"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300 cursor-not-allowed"></div>
            <span>Occupied</span>
          </div>
        </div>

        {/* Seat Layout Container */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Plane Cockpit Front */}
          <div className="w-32 h-10 mx-auto mb-6 bg-slate-100 rounded-t-full border-t border-x border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Front / Cockpit
          </div>

          <div className="space-y-2.5 max-w-sm mx-auto">
            {rows.map(({ row, type }) => (
              <div key={row} className="flex items-center justify-between">
                {/* Left side seats (A, B, C) */}
                <div className="flex space-x-1.5">
                  {leftCols.map((col) => {
                    const seatId = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = currentSelected.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isOccupied
                            ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 scale-105'
                            : 'bg-white text-slate-700 border border-slate-300 hover:border-sky-500 hover:bg-sky-50'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seatId}
                      </button>
                    );
                  })}
                </div>

                {/* Aisle Indicator */}
                <div className="text-[11px] font-bold text-slate-400 px-2 select-none">
                  Row {row}
                </div>

                {/* Right side seats (D, E, F) */}
                <div className="flex space-x-1.5">
                  {rightCols.map((col) => {
                    const seatId = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = currentSelected.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isOccupied
                            ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 scale-105'
                            : 'bg-white text-slate-700 border border-slate-300 hover:border-sky-500 hover:bg-sky-50'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seatId}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Selected Seats:</span>
            <span className="text-sm font-bold text-sky-700">
              {currentSelected.length > 0 ? currentSelected.join(', ') : 'None yet'}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={currentSelected.length === 0}
              onClick={handleConfirm}
              className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition"
            >
              Confirm Seats ({currentSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
