import React, { useState } from 'react';
import { X, Check, Info, Plane, Sparkles, ShieldCheck } from 'lucide-react';

export const SeatMapModal = ({
  isOpen,
  onClose,
  occupiedSeats = [],
  seatCount = 1,
  selectedSeats = [],
  onConfirmSeats,
  cabinClass = 'ECONOMY',
  aircraftModel = 'Airbus A321neo',
}) => {
  if (!isOpen) return null;

  const [currentSelected, setCurrentSelected] = useState([...selectedSeats]);

  const rows = [
    { row: 1, type: 'PREMIUM', label: 'Row 1 • Front Row Extra Legroom' },
    { row: 2, type: 'BUSINESS', label: 'Row 2 • Business Club' },
    { row: 3, type: 'BUSINESS', label: 'Row 3 • Business Club' },
    { row: 4, type: 'ECONOMY', label: 'Row 4 • Forward Economy' },
    { row: 5, type: 'ECONOMY', label: 'Row 5 • Standard Economy' },
    { row: 6, type: 'ECONOMY', label: 'Row 6 • Standard Economy' },
    { row: 7, type: 'ECONOMY', label: 'Row 7 • Standard Economy' },
    { row: 8, type: 'ECONOMY', label: 'Row 8 • Over-Wing View' },
    { row: 9, type: 'ECONOMY', label: 'Row 9 • Over-Wing View' },
    { row: 10, type: 'ECONOMY', label: 'Row 10 • Standard Economy' },
    { row: 11, type: 'ECONOMY', label: 'Row 11 • Standard Economy' },
    { row: 12, type: 'EXIT', label: 'Row 12 • Emergency Exit Extra Legroom' },
  ];

  const leftCols = ['A', 'B', 'C'];
  const rightCols = ['D', 'E', 'F'];

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    if (currentSelected.includes(seatId)) {
      setCurrentSelected(currentSelected.filter((s) => s !== seatId));
    } else {
      if (currentSelected.length >= seatCount) {
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

  const getSeatPerk = (seatId) => {
    const col = seatId.slice(-1);
    const rowNum = parseInt(seatId.slice(0, -1));
    if (col === 'A' || col === 'F') return 'Window (Scenic View)';
    if (col === 'C' || col === 'D') return 'Aisle (Easy Access)';
    return 'Middle';
  };

  const handleConfirm = () => {
    onConfirmSeats(currentSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-800 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <h3 className="font-bold text-base">Select Your Aircraft Seats</h3>
              <p className="text-xs text-sky-200">
                {aircraftModel} • Select {seatCount} {seatCount === 1 ? 'seat' : 'seats'}
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
        <div className="flex flex-wrap items-center justify-center gap-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-white border border-slate-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-sky-600 border border-sky-700"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A/F = Window, C/D = Aisle</span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Plane Cockpit Front Graphic */}
          <div className="w-36 h-10 mx-auto mb-6 bg-slate-100 rounded-t-full border-t border-x border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Flight Deck / Cockpit
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            {rows.map(({ row, type, label }) => (
              <div key={row} className="space-y-1">
                <div className="flex items-center justify-between">
                  {/* Left (A, B, C) */}
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
                          title={`${seatId}: ${getSeatPerk(seatId)}`}
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center relative ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 scale-105'
                              : 'bg-white text-slate-700 border border-slate-300 hover:border-sky-500 hover:bg-sky-50'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seatId}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="text-[10px] font-mono font-bold text-slate-400 px-2 select-none">
                    R{row}
                  </div>

                  {/* Right (D, E, F) */}
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
                          title={`${seatId}: ${getSeatPerk(seatId)}`}
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center relative ${
                            isOccupied
                              ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 scale-105'
                              : 'bg-white text-slate-700 border border-slate-300 hover:border-sky-500 hover:bg-sky-50'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seatId}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subtitle for special rows */}
                {(row === 1 || row === 12) && (
                  <span className="text-[9px] font-semibold text-indigo-600 block text-center">
                    {row === 1 ? '⭐ Row 1 • Priority Extra Legroom' : '🚪 Row 12 • Emergency Exit Space'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Selected Seats:</span>
            <span className="text-sm font-bold text-sky-800">
              {currentSelected.length > 0 ? (
                currentSelected.map((s) => `${s} (${s.endsWith('A') || s.endsWith('F') ? 'Window' : (s.endsWith('C') || s.endsWith('D') ? 'Aisle' : 'Middle')})`).join(', ')
              ) : (
                'Please select your seat'
              )}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={currentSelected.length === 0}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition"
            >
              Confirm Seats ({currentSelected.length}/{seatCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
