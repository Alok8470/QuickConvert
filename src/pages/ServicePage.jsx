import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, ArrowLeft, ShoppingCart, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { categories, services } from '../data/services';
import { useCart } from '../context/CartContext';
import ServiceModal from '../components/ServiceModal';

function StarRating({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} stroke={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ type }) {
  if (!type) return null;
  const styles = {
    'Bestseller': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Super Savers': 'bg-teal-50 text-teal-700 border border-teal-200',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[type] || ''}`}>{type}</span>;
}

function ServiceCard({ service, onViewDetails }) {
  const { addItem, items, updateQuantity } = useCart();
  const cartItem = items.find(i => i.serviceId === service.id && i.packageId === `${service.id}-default`);
  const count = cartItem ? cartItem.quantity : 0;
  const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({ packageId: `${service.id}-default`, serviceId: service.id, serviceName: service.name, packageName: service.packages[0].name, price: service.price, originalPrice: service.originalPrice });
  };
  const handleIncrease = (e) => { e.stopPropagation(); updateQuantity(`${service.id}-default`, count + 1); };
  const handleDecrease = (e) => { e.stopPropagation(); updateQuantity(`${service.id}-default`, count - 1); };

  return (
    <div className="bg-white rounded-2xl border border-uc-border shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-44 sm:h-auto relative bg-uc-light overflow-hidden flex-shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {service.badge && <div className="mb-2"><Badge type={service.badge} /></div>}
          
          <h3
            onClick={() => onViewDetails(service)}
            className="font-bold text-brand-navy text-lg leading-tight mb-1 cursor-pointer hover:text-brand-teal transition-colors"
          >
            {service.name}
          </h3>
          <p className="text-sm text-uc-muted mb-3 line-clamp-2 leading-relaxed">{service.description}</p>

          {/* Rating & Duration */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <StarRating rating={service.rating} />
              <span className="text-sm font-semibold text-uc-text">{service.rating}</span>
              <span className="text-xs text-uc-muted">({service.reviews})</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-uc-border" />
            <div className="flex items-center gap-1 text-xs text-uc-muted">
              <Clock size={12} />
              {service.duration}
            </div>
          </div>

          {/* Quick Inclusions */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.includes.slice(0, 3).map((inc, i) => (
              <span key={i} className="text-xs bg-uc-bg text-uc-muted px-2 py-1 rounded-lg border border-uc-border">
                ✓ {inc.length > 25 ? inc.slice(0, 25) + '…' : inc}
              </span>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-uc-border">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-brand-navy">₹{service.price.toLocaleString()}</span>
                <span className="text-sm text-uc-muted line-through">₹{service.originalPrice.toLocaleString()}</span>
              </div>
              <button
                onClick={() => onViewDetails(service)}
                className="text-xs text-brand-teal font-medium hover:underline flex items-center gap-1 mt-1"
              >
                View details <ChevronRight size={11} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {count === 0 ? (
                <button
                  onClick={handleAdd}
                  className="px-6 py-2.5 border-2 border-brand-teal text-brand-teal font-semibold rounded-xl hover:bg-brand-teal hover:text-white transition-all duration-200 text-sm"
                >
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-2 border-2 border-brand-teal rounded-xl overflow-hidden">
                  <button onClick={handleDecrease} className="w-9 h-9 flex items-center justify-center text-brand-teal font-bold hover:bg-brand-teal hover:text-white transition-colors text-lg">−</button>
                  <span className="text-sm font-bold text-brand-teal w-6 text-center">{count}</span>
                  <button onClick={handleIncrease} className="w-9 h-9 flex items-center justify-center text-brand-teal font-bold hover:bg-brand-teal hover:text-white transition-colors text-lg">+</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Cart Bar (bottom of screen)
function FloatingCart({ totalItems, total, onViewCart }) {
  if (totalItems === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
      <button
        onClick={onViewCart}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-brand-navy text-white rounded-2xl shadow-modal hover:bg-brand-navy/90 transition-all duration-200"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%) translateX(-50%); opacity: 0; } to { transform: translateY(0) translateX(0); opacity: 1; } }`}</style>
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-teal rounded-full text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="font-semibold text-sm">{totalItems} item{totalItems > 1 ? 's' : ''} in cart</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">₹{total.toLocaleString()}</span>
          <ChevronRight size={16} />
        </div>
      </button>
    </div>
  );
}

export default function ServicePage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { totalItems, total } = useCart();
  const [selectedService, setSelectedService] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const currentCategory = categories.find(c => c.slug === category);
  const categoryServices = services.filter(s => s.categoryId === category);

  // Sort services
  const sortedServices = [...categoryServices].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.rating * parseInt(b.reviews) - a.rating * parseInt(a.reviews); // popular
  });

  // If category not found, show all services
  const displayServices = sortedServices.length > 0 ? sortedServices : services.slice(0, 5);

  return (
    <div className="pt-16 min-h-screen bg-uc-bg pb-24">
      {/* Category Header */}
      <div
        className="relative py-10 overflow-hidden"
        style={{ background: currentCategory ? `linear-gradient(135deg, #12263f, #1a3a5c)` : 'linear-gradient(135deg, #12263f, #1a3a5c)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <div className="flex items-center gap-4">
            {currentCategory && (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                style={{ background: currentCategory.color }}
              >
                {currentCategory.icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">
                {currentCategory ? currentCategory.name : 'All Services'}
              </h1>
              <p className="text-white/60 text-sm">{displayServices.length} service{displayServices.length !== 1 ? 's' : ''} available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="bg-white border-b border-uc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/services/${cat.slug}`}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${cat.slug === category ? 'bg-brand-teal text-white shadow-sm' : 'bg-uc-bg text-uc-text hover:bg-uc-border'}`}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sort Bar */}
      <div className="bg-white border-b border-uc-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <SlidersHorizontal size={15} className="text-uc-muted flex-shrink-0" />
          <span className="text-sm text-uc-muted font-medium mr-2">Sort:</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { value: 'popular', label: 'Most Popular' },
              { value: 'rating', label: 'Top Rated' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${sortBy === opt.value ? 'bg-brand-teal text-white' : 'bg-uc-bg text-uc-muted hover:text-uc-text'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {displayServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">No services found</h3>
            <p className="text-uc-muted mb-6">We're not in this category yet. Check back soon!</p>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white font-semibold rounded-xl">
              <ArrowLeft size={15} /> Browse All Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayServices.map(svc => (
              <ServiceCard key={svc.id} service={svc} onViewDetails={setSelectedService} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCart totalItems={totalItems} total={total} onViewCart={() => navigate('/cart')} />

      {/* Service Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
