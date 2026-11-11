import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Phone,
  Zap,
  Award,
  Layers
} from 'lucide-react';
import { categories, services } from '../data/services';
import { useCart } from '../context/CartContext';
import ServiceModal from '../components/ServiceModal';

function StarRating({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
          strokeWidth="2"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ type }) {
  if (!type) return null;
  const isBestseller = type === 'Bestseller';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide shadow-sm ${
        isBestseller
          ? 'bg-amber-400 text-brand-navy'
          : 'bg-teal-600 text-white'
      }`}
    >
      {isBestseller ? '★ Bestseller' : '⚡ Super Savers'}
    </span>
  );
}

function ServiceCard({ service, onViewDetails }) {
  const { addItem, items, updateQuantity } = useCart();
  const defaultPackage = service.packages[0];
  const packageKey = `${service.id}-${defaultPackage.id}`;
  const cartItem = items.find((i) => i.packageId === packageKey);
  const count = cartItem ? cartItem.quantity : 0;
  const discount = Math.round(
    ((service.originalPrice - service.price) / service.originalPrice) * 100
  );

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({
      packageId: packageKey,
      serviceId: service.id,
      serviceName: service.name,
      packageName: defaultPackage.name,
      price: service.price,
      originalPrice: service.originalPrice,
    });
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    updateQuantity(packageKey, count + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    updateQuantity(packageKey, count - 1);
  };

  return (
    <div
      onClick={() => onViewDetails(service)}
      className="group bg-white rounded-2xl border border-uc-border shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden flex flex-col w-64 sm:w-72 flex-shrink-0"
    >
      {/* Image container */}
      <div className="relative h-44 bg-uc-light overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Badge */}
        {service.badge && (
          <div className="absolute top-3 left-3">
            <Badge type={service.badge} />
          </div>
        )}

        {/* Discount chip */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            {discount}% OFF
          </div>
        )}

        <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold flex items-center gap-1.5">
          <Clock size={12} />
          <span>{service.duration}</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-brand-navy text-sm leading-snug line-clamp-1 group-hover:text-brand-teal transition-colors mb-1.5">
          {service.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-black">
            <Star size={11} className="fill-emerald-600 text-emerald-600" />
            <span>{service.rating}</span>
          </div>
          <span className="text-xs text-uc-muted font-medium">
            ({service.reviews})
          </span>
        </div>

        {/* Price and CTA */}
        <div className="mt-auto pt-3 border-t border-uc-border flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-brand-navy">
                ₹{service.price}
              </span>
              <span className="text-xs text-uc-muted line-through font-medium">
                ₹{service.originalPrice}
              </span>
            </div>
          </div>

          {count === 0 ? (
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 rounded-xl border border-brand-teal text-brand-teal text-xs font-bold hover:bg-brand-teal hover:text-white transition-all shadow-sm active:scale-95"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center border border-brand-teal rounded-xl overflow-hidden shadow-sm bg-white">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center font-bold text-brand-teal hover:bg-teal-50 transition-colors text-base"
              >
                −
              </button>
              <span className="text-xs font-black text-brand-navy w-5 text-center">
                {count}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center font-bold text-brand-teal hover:bg-teal-50 transition-colors text-base"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCarousel({ title, subtitle, items, onViewDetails }) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-uc-muted mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-uc-border bg-white flex items-center justify-center text-brand-navy hover:border-brand-teal hover:text-brand-teal hover:bg-teal-50/50 transition-all shadow-sm"
              title="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-uc-border bg-white flex items-center justify-center text-brand-navy hover:border-brand-teal hover:text-brand-teal hover:bg-teal-50/50 transition-all shadow-sm"
              title="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((svc) => (
            <div key={svc.id} style={{ scrollSnapAlign: 'start' }}>
              <ServiceCard service={svc} onViewDetails={onViewDetails} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const mostBooked = services.filter((s) => s.badge === 'Bestseller');
  const superSavers = services.filter((s) => s.badge === 'Super Savers');
  const cleaning = services.filter((s) => s.categoryId === 'cleaning');

  return (
    <div className="min-h-screen pt-16 sm:pt-18 bg-white">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#12263f] to-[#0a4652] text-white py-12 sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#008290_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-teal-200">
                <Sparkles size={14} className="text-teal-300" />
                <span>India's #1 Doorstep Service Network</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
                Home services at <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-white">
                  your doorstep
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed font-normal">
                Trained professionals, verified background, standardized pricing, and upfront warranties. Salon, spa, deep cleaning, and repairs made effortless.
              </p>

              {/* Guarantees pill list */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300 pt-2">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 size={15} className="text-teal-300" /> 4.8+ Rated Pros
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 size={15} className="text-teal-300" /> 30-Day Warranty
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 size={15} className="text-teal-300" /> Transparent Pricing
                </span>
              </div>
            </div>

            {/* Right: Embedded Service Category Grid */}
            <div className="lg:col-span-5 bg-white/95 backdrop-blur-lg rounded-3xl p-6 sm:p-7 shadow-modal border border-white/40 text-brand-navy">
              <div className="flex items-center justify-between pb-4 border-b border-uc-border">
                <div>
                  <h3 className="text-base font-black">What are you looking for?</h3>
                  <p className="text-xs text-uc-muted font-medium">Select a category to view verified services</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-50 text-brand-teal flex items-center justify-center font-bold text-xs">
                  8+
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/services/${cat.slug}`)}
                    className="flex flex-col items-center group text-center p-2 rounded-2xl hover:bg-teal-50/60 transition-all active:scale-95"
                  >
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-uc-border group-hover:scale-110 group-hover:shadow-md transition-all mb-1.5"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-bold text-brand-navy leading-tight line-clamp-2">
                      {cat.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-uc-border flex items-center justify-between text-xs">
                <span className="text-uc-muted font-medium">Looking for instant AC check?</span>
                <button
                  onClick={() => navigate('/services/ac-repair')}
                  className="font-bold text-brand-teal hover:underline flex items-center gap-1"
                >
                  Book AC Repair <ArrowRight size={13} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BADGES BAR ── */}
      <section className="border-b border-uc-border bg-uc-bg/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center flex-shrink-0 border border-teal-100">
                <Shield size={22} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">Verified Professionals</h4>
                <p className="text-[11px] text-uc-muted">100% background checked</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center flex-shrink-0 border border-teal-100">
                <Award size={22} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">Standardized Pricing</h4>
                <p className="text-[11px] text-uc-muted">Fixed rates with invoice</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center flex-shrink-0 border border-teal-100">
                <Clock size={22} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">On-Time Arrival</h4>
                <p className="text-[11px] text-uc-muted">Exact slot dispatch</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center flex-shrink-0 border border-teal-100">
                <ThumbsUp size={22} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">Free Re-work Guarantee</h4>
                <p className="text-[11px] text-uc-muted">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL 1: MOST BOOKED SERVICES ── */}
      <ServiceCarousel
        title="Most Booked Services"
        subtitle="Trusted by over 5 million households this month"
        items={mostBooked}
        onViewDetails={setSelectedService}
      />

      {/* ── PROMO BANNER ── */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-brand-teal to-teal-800 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                UC Plus Membership
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Save up to 15% on every booking
              </h3>
              <p className="text-teal-100 text-xs sm:text-sm max-w-lg">
                Get unlimited free deliveries, 10% off salon services, and priority slots with Urban Company Plus.
              </p>
            </div>
            <button
              onClick={() => alert("Urban Company Plus Membership plan activated!")}
              className="px-6 py-3 rounded-xl bg-white text-brand-navy font-black text-sm hover:bg-teal-50 transition-all shadow-md active:scale-95 flex-shrink-0"
            >
              Explore Plus @ ₹299
            </button>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL 2: SUPER SAVERS ── */}
      <ServiceCarousel
        title="Super Savers"
        subtitle="Exclusive packaged deals with highest customer savings"
        items={superSavers}
        onViewDetails={setSelectedService}
      />

      {/* ── CAROUSEL 3: CLEANING & PEST CONTROL ── */}
      <ServiceCarousel
        title="Cleaning & Pest Control"
        subtitle="Deep disinfection, mechanized floor scrubbing & eco-friendly chemicals"
        items={cleaning}
        onViewDetails={setSelectedService}
      />

      {/* ── ALL CATEGORIES EXPLORATION ── */}
      <section className="py-12 bg-uc-bg border-t border-uc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy">
              Explore All Home Services
            </h2>
            <p className="text-xs sm:text-sm text-uc-muted mt-2 font-medium">
              Whatever your home needs, we have certified professionals ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/services/${cat.slug}`)}
                className="bg-white rounded-2xl p-5 border border-uc-border shadow-card hover:shadow-xl hover:border-brand-teal transition-all cursor-pointer group flex items-start gap-4"
              >
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-teal">
                    {cat.tag}
                  </span>
                  <h4 className="text-sm font-bold text-brand-navy truncate mt-0.5">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-uc-muted font-medium flex items-center gap-1 mt-1 group-hover:text-brand-teal transition-colors">
                    View packages <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-teal-300">50M+</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Services Delivered
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-teal-300">4.8★</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Average Rating
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-teal-300">45,000+</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Trained Partners
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-teal-300">62 Cities</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Across India & UAE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-uc-border py-12 text-uc-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-uc-border">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center">
                  <span className="text-white font-black text-xs">UC</span>
                </div>
                <span className="text-lg font-black text-brand-navy">
                  Urban Company
                </span>
              </div>
              <p className="text-xs text-uc-muted leading-relaxed max-w-sm">
                Urban Company is Asia's largest home services platform, helping customers book reliable services delivered by experienced professionals in the comfort of their home.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                Company
              </h5>
              <ul className="space-y-2 text-xs text-uc-muted font-medium">
                <li><a href="#about" className="hover:text-brand-teal">About Us</a></li>
                <li><a href="#terms" className="hover:text-brand-teal">Terms & Conditions</a></li>
                <li><a href="#privacy" className="hover:text-brand-teal">Privacy Policy</a></li>
                <li><a href="#careers" className="hover:text-brand-teal">Careers</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                For Customers
              </h5>
              <ul className="space-y-2 text-xs text-uc-muted font-medium">
                <li><a href="#reviews" className="hover:text-brand-teal">UC Reviews</a></li>
                <li><a href="#categories" className="hover:text-brand-teal">Categories Near You</a></li>
                <li><a href="#blog" className="hover:text-brand-teal">Blog & Tips</a></li>
                <li><a href="#contact" className="hover:text-brand-teal">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                For Partners
              </h5>
              <ul className="space-y-2 text-xs text-uc-muted font-medium">
                <li><a href="#partner" className="hover:text-brand-teal">Register as a Professional</a></li>
                <li><a href="#training" className="hover:text-brand-teal">Partner Training Hub</a></li>
                <li><a href="#safety" className="hover:text-brand-teal">Safety Measures</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-uc-muted gap-4">
            <p>© 2026 Urban Company Clone. Built for production demonstration.</p>
            <div className="flex items-center gap-4">
              <span>Security Guaranteed</span>
              <span>•</span>
              <span>100% Verified Partners</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SERVICE MODAL / DRAWER ── */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
