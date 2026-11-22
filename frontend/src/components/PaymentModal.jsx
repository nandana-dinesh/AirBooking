import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2, Loader2, Plane } from 'lucide-react';

export const PaymentModal = ({
  isOpen,
  onClose,
  bookingDetails,
  onConfirmPayment,
  isProcessing = false,
}) => {
  if (!isOpen || !bookingDetails) return null;

  const [cardNumber, setCardNumber] = useState('4532 8920 1192 4892');
  const [cardHolder, setCardHolder] = useState(bookingDetails.passenger_name || 'JOHN DOE');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('883');
  const [stage, setStage] = useState('input'); // 'input', 'processing'

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStage('processing');

    // Simulate realistic bank authorization delay
    setTimeout(() => {
      onConfirmPayment({
        card_number: cardNumber,
        card_expiry: expiry,
        card_cvv: cvv,
      });
    }, 1400);
  };

  const totalAmount = bookingDetails.total_price || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">AirBooking Secure Checkout</h3>
              <p className="text-xs text-slate-400">256-Bit Encrypted Simulated Payment Gateway</p>
            </div>
          </div>
          {stage !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {stage === 'processing' || isProcessing ? (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">Authorizing Payment...</h4>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Confirming seat allocations with the airline reservation system. Please do not close this window.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Summary Banner */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block">
                  Flight Reservation
                </span>
                <span className="font-bold text-slate-900">
                  {bookingDetails.flight?.flight_number}: {bookingDetails.flight?.origin_code} → {bookingDetails.flight?.destination_code}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seats: <span className="font-semibold text-slate-700">{bookingDetails.seat_numbers}</span> ({bookingDetails.cabin_class})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Due</span>
                <span className="text-2xl font-black text-sky-700">${Number(totalAmount).toFixed(2)}</span>
              </div>
            </div>

            {/* Virtual Card Graphic */}
            <div className="bg-gradient-to-tr from-slate-800 via-slate-900 to-sky-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">AirBooking Platinum</span>
                <CreditCard className="w-6 h-6 text-sky-400" />
              </div>
              <div className="font-mono text-lg tracking-wider mb-4 text-slate-100">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Cardholder</span>
                  <span className="font-semibold uppercase tracking-wider text-slate-200">
                    {cardHolder || 'CARDHOLDER NAME'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Expires</span>
                  <span className="font-semibold text-slate-200">{expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 8920 1192 4892"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="FULL NAME ON CARD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-sm uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVV / CVC</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono text-sm text-center"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>Simulated Payment: No real financial charges will occur.</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2"
              >
                <span>Pay ${Number(totalAmount).toFixed(2)}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
