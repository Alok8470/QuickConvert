import { useState, useEffect } from 'react';
import { X, Star, Clock, Check, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { reviews as allReviews } from '../data/services';

function StarRating({ rating, size = 14 }) {
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

export default function ServiceModal({ service, onClose }) {
  const { addItem, items, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPackage, setSelectedPackage] = useState(service.packages[0]);
  const [openFaq, setOpenFaq] = useState(null);
  const serviceReviews = allReviews.filter(r => r.serviceId === service.id);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const cartItem = items.find(i => i.packageId === `${service.id}-${selectedPackage.id}`);
  const count = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem({
      packageId: `${service.id}-${selectedPackage.id}`,
      serviceId: service.id,
      serviceName: service.name,
      packageName: selectedPackage.name,
      price: selectedPackage.price,
      originalPrice: selectedPackage.originalPrice,
    });
  };
  const handleIncrease = () => updateQuantity(`${service.id}-${selectedPackage.id}`, count + 1);
  const handleDecrease = () => updateQuantity(`${service.id}-${selectedPackage.id}`, count - 1);

  const tabs = ['overview', 'inclusions', 'faqs', 'reviews'];
  const discount = Math.round(((selectedPackage.originalPrice - selectedPackage.price) / selectedPackage.originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-modal flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header Image */}
        <div className="relative h-56 bg-uc-light flex-shrink-0">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
          >
            <X size={18} className="text-uc-text" />
          </button>
          {service.badge && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {service.badge}
              </span>
            </div>
          )}
        </div>

        {/* Service Info */}
        <div className="p-5 border-b border-uc-border flex-shrink-0">
          <h2 className="text-xl font-bold text-brand-navy mb-2">{service.name}</h2>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <StarRating rating={service.rating} />
              <span className="text-sm font-semibold text-uc-text">{service.rating}</span>
              <span className="text-sm text-uc-muted">({service.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-uc-muted">
              <Clock size={13} />
              {service.duration}
            </div>
          </div>
          <p className="text-sm text-uc-muted">{service.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-uc-border flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${activeTab === tab ? 'text-brand-teal border-b-2 border-brand-teal' : 'text-uc-muted hover:text-uc-text'}`}
            >
              {tab === 'inclusions' ? "What's Included" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* Overview — Package Selector */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="font-semibold text-brand-navy mb-4">Select Package</h3>
              <div className="space-y-3">
                {service.packages.map(pkg => {
                  const pkgDiscount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-brand-teal bg-teal-50' : 'border-uc-border hover:border-brand-teal/50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-brand-teal' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-brand-teal" />}
                          </div>
                          <div>
                            <div className="font-semibold text-uc-text text-sm">{pkg.name}</div>
                            <div className="text-xs text-uc-muted flex items-center gap-1 mt-0.5">
                              <Clock size={11} /> {pkg.duration}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-uc-text">₹{pkg.price.toLocaleString()}</div>
                          <div className="text-xs text-uc-muted line-through">₹{pkg.originalPrice.toLocaleString()}</div>
                          {pkgDiscount > 0 && (
                            <div className="text-xs text-green-600 font-semibold">{pkgDiscount}% off</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inclusions */}
          {activeTab === 'inclusions' && (
            <div>
              <div className="mb-6">
                <h3 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={14} className="text-green-600" />
                  </span>
                  What's Included
                </h3>
                <ul className="space-y-2.5">
                  {service.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-uc-text">
                      <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-green-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {service.excludes && service.excludes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                      <X size={14} className="text-red-500" />
                    </span>
                    Not Included
                  </h3>
                  <ul className="space-y-2.5">
                    {service.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-uc-muted">
                        <div className="w-5 h-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X size={11} className="text-red-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-navy mb-4">Frequently Asked Questions</h3>
              {service.faqs.map((faq, i) => (
                <div key={i} className="border border-uc-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-uc-bg transition-colors"
                  >
                    <span className="font-medium text-uc-text text-sm pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-brand-teal flex-shrink-0" /> : <ChevronDown size={16} className="text-uc-muted flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-uc-muted leading-relaxed border-t border-uc-border bg-uc-bg">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div>
              {/* Summary */}
              <div className="bg-uc-bg rounded-2xl p-4 mb-6 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-brand-navy">{service.rating}</div>
                  <StarRating rating={service.rating} size={16} />
                  <div className="text-xs text-uc-muted mt-1">{service.reviews} reviews</div>
                </div>
                <div className="flex-1">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-uc-muted w-4">{star}</span>
                      <div className="flex-1 h-1.5 bg-uc-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: star === 5 ? '65%' : star === 4 ? '25%' : star === 3 ? '7%' : '2%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {(serviceReviews.length > 0 ? serviceReviews : allReviews.slice(0, 3)).map(review => (
                  <div key={review.id} className="p-4 bg-uc-bg rounded-xl">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-uc-text text-sm">{review.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} size={12} />
                          <span className="text-xs text-uc-muted">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-uc-muted leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — sticky Add to Cart */}
        <div className="border-t border-uc-border p-4 bg-white flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-lg font-bold text-brand-navy">₹{selectedPackage.price.toLocaleString()}</div>
              <div className="text-xs text-uc-muted flex items-center gap-1.5">
                <span className="line-through">₹{selectedPackage.originalPrice.toLocaleString()}</span>
                <span className="text-green-600 font-semibold">{discount}% off</span>
              </div>
            </div>
            {count === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-teal text-white font-semibold rounded-xl hover:bg-brand-teal-dark transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-3 border-2 border-brand-teal rounded-xl overflow-hidden">
                <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center text-brand-teal font-bold hover:bg-brand-teal hover:text-white transition-colors text-xl">−</button>
                <span className="text-sm font-bold text-brand-teal w-6 text-center">{count}</span>
                <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center text-brand-teal font-bold hover:bg-brand-teal hover:text-white transition-colors text-xl">+</button>
              </div>
            )}
          </div>
          <p className="text-xs text-uc-muted text-center">📋 {selectedPackage.name} • {selectedPackage.duration}</p>
        </div>
      </div>
    </div>
  );
}
