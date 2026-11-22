import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2, Loader2, Plane, Smartphone, Building2 } from 'lucide-react';

export const PaymentModal = ({
  isOpen,
  onClose,
  bookingDetails,
  onConfirmPayment,
  isProcessing = false,
}) => {
  if (!isOpen || !bookingDetails) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('rahul.sharma@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('6071 8920 1192 4892');
  const [cardHolder, setCardHolder] = useState(bookingDetails.passenger_name || 'RAHUL SHARMA');
  const [expiry, setExpiry] = useState('11/29');
  const [cvv, setCvv] = useState('583');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [stage, setStage] = useState('input'); // 'input', 'processing'

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStage('processing');

    setTimeout(() => {
      onConfirmPayment({
        payment_method:
          paymentMethod === 'upi'
            ? `UPI (${upiId})`
            : paymentMethod === 'netbanking'
            ? `NetBanking (${selectedBank})`
            : 'RuPay / Debit Card',
        card_number: paymentMethod === 'card' ? cardNumber : `UPI-${upiId}`,
        card_expiry: expiry,
        card_cvv: cvv,
      });
    }, 1300);
  };

  const totalAmount = bookingDetails.total_price || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">AirBooking India Secure Gateway</h3>
              <p className="text-xs text-slate-400">100% Safe & Encrypted (UPI / RuPay / Cards)</p>
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
            <h4 className="text-lg font-bold text-slate-800">Processing Your Payment...</h4>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Confirming seat allocations with the Indian aviation network. Please do not refresh.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Summary Banner */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block">
                  Flight Itinerary
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {bookingDetails.flight?.flight_number}: {bookingDetails.flight?.origin_code} → {bookingDetails.flight?.destination_code}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seats: <span className="font-semibold text-slate-700">{bookingDetails.seat_numbers}</span> ({bookingDetails.cabin_class})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Payable</span>
                <span className="text-2xl font-black text-sky-800 font-mono">
                  ₹{Number(totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Indian Payment Options Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'upi' ? 'bg-white text-sky-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>UPI (GPay/PhonePe)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'card' ? 'bg-white text-sky-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                <span>RuPay / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                  paymentMethod === 'netbanking' ? 'bg-white text-sky-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* UPI Option */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Enter UPI ID / VPA</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Instant Zero-Fee
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@okhdfcbank or user@paytm"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm bg-white"
                />
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                  <span>Supported:</span>
                  <span className="font-semibold text-slate-700">Google Pay</span> •
                  <span className="font-semibold text-slate-700">PhonePe</span> •
                  <span className="font-semibold text-slate-700">Paytm</span> •
                  <span className="font-semibold text-slate-700">BHIM</span>
                </div>
              </div>
            )}

            {/* Card Option (RuPay / Visa / Mastercard) */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                {/* Virtual RuPay Graphic */}
                <div className="bg-gradient-to-tr from-slate-800 via-sky-950 to-indigo-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono uppercase tracking-widest text-sky-300">
                      RuPay Platinum / Global
                    </span>
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
                      <span className="text-[10px] uppercase text-slate-400 block">Valid Thru</span>
                      <span className="font-semibold text-slate-200">{expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="6071 8920 1192 4892"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono text-sm text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Option */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <label className="block text-xs font-bold text-slate-700">Select Indian Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  You will be securely redirected to your bank's portal to authenticate with OTP.
                </p>
              </div>
            )}

            <div className="flex items-center text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>Simulated Payment: No real financial charges will be deducted from your account.</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-1.5"
              >
                <span>Pay ₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
