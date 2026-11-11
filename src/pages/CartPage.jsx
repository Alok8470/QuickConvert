import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Tag,
  Shield,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, originalTotal, savings, tax, total } = useCart();
  const navigate = useNavigate();

  const [bookingStep, setBookingStep] = useState('cart'); // 'cart' | 'schedule' | 'confirmed'
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 12 Nov');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState('pay-after'); // 'pay-after' | 'upi' | 'card'

  const dates = [
    'Today, 11 Nov',
    'Tomorrow, 12 Nov',
    'Thu, 13 Nov',
    'Fri, 14 Nov',
    'Sat, 15 Nov'
  ];

  const timeSlots = [
    '08:00 AM - 09:00 AM',
    '10:00 AM - 11:00 AM',
    '01:00 PM - 02:00 PM',
    '04:00 PM - 05:00 PM',
    '06:30 PM - 07:30 PM'
  ];

  if (items.length === 0 && bookingStep !== 'confirmed') {
    return (
      <div className="pt-24 min-h-screen bg-uc-bg flex items-center justify-center p-4">
        <div className="text-center px-6 py-12 max-w-md mx-auto bg-white rounded-3xl border border-uc-border shadow-card">
          <div className="w-24 h-24 mx-auto mb-6 bg-teal-50 rounded-full flex items-center justify-center text-brand-teal">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-2xl font-black text-brand-navy mb-2">Your Cart is Empty</h2>
          <p className="text-uc-muted mb-8 text-sm leading-relaxed">
            Explore our bestselling services like AC Repair, Salon for Women, and Intense Deep Cleaning.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md active:scale-95"
          >
            <ArrowLeft size={16} />
            Explore Services
          </Link>
        </div>
      </div>
    );
  }

  if (bookingStep === 'confirmed') {
    return (
      <div className="pt-24 min-h-screen bg-uc-bg flex items-center justify-center p-4">
        <div className="text-center px-8 py-12 max-w-lg mx-auto bg-white rounded-3xl border border-uc-border shadow-modal animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle size={44} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            Booking Confirmed #UC-98241
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy mb-3">
            Service Scheduled!
          </h2>
          <p className="text-uc-muted text-sm leading-relaxed mb-6">
            A verified professional has been assigned. You will receive real-time SMS & WhatsApp alerts with professional details 1 hour prior.
          </p>

          <div className="p-4 rounded-2xl bg-uc-bg text-left space-y-2 mb-8 text-xs">
            <div className="flex justify-between">
              <span className="text-uc-muted">Slot Time:</span>
              <span className="font-bold text-brand-navy">{selectedDate} @ {selectedSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-uc-muted">Address:</span>
              <span className="font-bold text-brand-navy truncate max-w-[240px]">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-uc-muted">Amount Payable:</span>
              <span className="font-bold text-brand-teal text-sm">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-uc-muted">Payment Mode:</span>
              <span className="font-bold text-brand-navy uppercase">{paymentMethod === 'pay-after' ? 'Pay After Service' : paymentMethod}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-all text-center"
            >
              Back to Home
            </Link>
            <button
              onClick={() => window.print()}
              className="py-3 px-4 border border-uc-border text-brand-navy text-xs font-bold rounded-xl hover:bg-uc-bg transition-all"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-uc-bg pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              if (bookingStep === 'schedule') setBookingStep('cart');
              else navigate(-1);
            }}
            className="p-2 bg-white hover:bg-uc-bg rounded-xl border border-uc-border transition-colors text-brand-navy"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-brand-navy">
              {bookingStep === 'cart' ? 'Review Booking Cart' : 'Select Date & Slot'}
            </h1>
            <p className="text-xs text-uc-muted font-medium">
              {items.reduce((s, i) => s + i.quantity, 0)} item(s) • Doorstep Service Delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-4">
            
            {bookingStep === 'cart' && (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const discount = Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) * 100
                    );
                    return (
                      <div
                        key={item.packageId}
                        className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-uc-border flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          UC
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-brand-navy text-sm sm:text-base leading-tight">
                            {item.serviceName}
                          </h3>
                          <span className="inline-block mt-0.5 text-xs text-brand-teal font-semibold bg-teal-50 px-2 py-0.5 rounded">
                            {item.packageName}
                          </span>

                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-base font-black text-brand-navy">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-uc-muted line-through">
                                ₹{(item.originalPrice * item.quantity).toLocaleString()}
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                                {discount}% off
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter & Remove */}
                        <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0">
                          <button
                            onClick={() => removeItem(item.packageId)}
                            className="p-1.5 text-uc-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="flex items-center border border-brand-teal rounded-xl overflow-hidden bg-white shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.packageId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-brand-teal font-bold hover:bg-teal-50 transition-colors text-base"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-black text-brand-navy w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.packageId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-brand-teal font-bold hover:bg-teal-50 transition-colors text-base"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add More Services button */}
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-dashed border-brand-teal text-brand-teal text-xs font-bold rounded-2xl hover:bg-teal-50/50 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  Add more services from catalog
                </Link>

                {/* UC Cancellation Policy Guarantee */}
                <div className="bg-white rounded-2xl p-5 border border-uc-border shadow-card flex items-start gap-4">
                  <Shield size={22} className="text-brand-teal flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-brand-navy">Free Cancellation & Rescheduling</h4>
                    <p className="text-uc-muted">
                      Cancel or change slot anytime up to 2 hours before the scheduled time with zero cancellation fee.
                    </p>
                  </div>
                </div>
              </>
            )}

            {bookingStep === 'schedule' && (
              <div className="space-y-6">
                {/* Date Picker */}
                <div className="bg-white rounded-2xl p-6 border border-uc-border shadow-card">
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2 mb-4">
                    <Calendar size={16} className="text-brand-teal" />
                    Select Service Date
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {dates.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                          selectedDate === d
                            ? 'border-brand-teal bg-teal-50 text-brand-teal shadow-sm'
                            : 'border-uc-border text-uc-text hover:bg-uc-bg'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Picker */}
                <div className="bg-white rounded-2xl p-6 border border-uc-border shadow-card">
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-brand-teal" />
                    Select Arrival Slot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          selectedSlot === slot
                            ? 'border-brand-teal bg-teal-50 text-brand-teal shadow-sm'
                            : 'border-uc-border text-uc-text hover:bg-uc-bg'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Selection */}
                <div className="bg-white rounded-2xl p-6 border border-uc-border shadow-card">
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-brand-teal" />
                    Delivery Address
                  </h3>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl border border-uc-border text-xs font-medium focus:border-brand-teal focus:outline-none bg-uc-bg"
                    placeholder="Enter complete address..."
                  />
                </div>

                {/* Payment Selection */}
                <div className="bg-white rounded-2xl p-6 border border-uc-border shadow-card">
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2 mb-4">
                    <CreditCard size={16} className="text-brand-teal" />
                    Payment Options
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { id: 'pay-after', title: 'Pay After Service (Cash / UPI to Partner)', desc: 'Inspect work first, then pay' },
                      { id: 'upi', title: 'Instant UPI / QR Code', desc: 'Google Pay, PhonePe, Paytm' },
                      { id: 'card', title: 'Credit / Debit Card / Netbanking', desc: 'Secure 128-bit encrypted' },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === opt.id
                            ? 'border-brand-teal bg-teal-50/50'
                            : 'border-uc-border hover:bg-uc-bg'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="mt-0.5 text-brand-teal focus:ring-brand-teal"
                        />
                        <div>
                          <div className="text-xs font-bold text-brand-navy">{opt.title}</div>
                          <div className="text-[11px] text-uc-muted">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-card border border-uc-border overflow-hidden sticky top-24">
              
              {/* Header */}
              <div className="p-5 border-b border-uc-border bg-uc-bg/50">
                <h3 className="font-black text-brand-navy text-sm uppercase tracking-wider">
                  Payment Summary
                </h3>
              </div>

              {/* Line items */}
              <div className="p-5 space-y-3.5 text-xs">
                <div className="flex justify-between text-uc-text font-medium">
                  <span className="text-uc-muted">Item Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} /> Super Saver Discount
                    </span>
                    <span>−₹{savings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-uc-text font-medium">
                  <span className="text-uc-muted">Convenience & Safety Fee</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                <div className="flex justify-between text-uc-text font-medium">
                  <span className="text-uc-muted">Taxes & Govt GST (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-uc-border flex justify-between items-baseline">
                  <span className="text-sm font-black text-brand-navy">Total Payable</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-navy">
                      ₹{total.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-bold">
                      Includes ₹{savings.toLocaleString()} savings
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo badge */}
              {savings > 0 && (
                <div className="mx-5 mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Yay! You're saving ₹{savings.toLocaleString()} on this booking.</span>
                </div>
              )}

              {/* Action Button */}
              <div className="p-5 pt-0">
                {bookingStep === 'cart' ? (
                  <button
                    onClick={() => setBookingStep('schedule')}
                    className="w-full py-3.5 bg-brand-navy hover:bg-brand-dark text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Proceed to Slot Selection</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      clearCart();
                      setBookingStep('confirmed');
                    }}
                    className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal-dark text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle size={16} />
                    <span>Confirm Booking (₹{total.toLocaleString()})</span>
                  </button>
                )}
              </div>

              {/* Guarantees */}
              <div className="p-4 bg-uc-bg/60 border-t border-uc-border text-center text-[11px] text-uc-muted font-medium flex items-center justify-center gap-1.5">
                <Shield size={14} className="text-brand-teal" />
                <span>Urban Company Insurance Protected</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
