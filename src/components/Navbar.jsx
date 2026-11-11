import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ChevronDown,
  ShoppingCart,
  Menu,
  X,
  User,
  Sparkles,
  PhoneCall,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { locations, services, categories } from '../data/services';

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginStep, setLoginStep] = useState('phone'); // 'phone' | 'otp' | 'success'

  const searchRef = useRef(null);

  // Filter city list in modal
  const filteredCities = locations.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Autocomplete service matches
  const searchResults = searchQuery.trim().length > 0
    ? services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categories.find(c => c.id === s.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close search popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectService = (service) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/services/${service.categoryId}`);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-uc-border shadow-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-6 py-2">
            
            {/* Left: Brand Logo & Location */}
            <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-white font-extrabold text-base tracking-tighter">UC</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-brand-navy tracking-tight leading-none">
                    Urban Company
                  </span>
                  <span className="text-[10px] text-brand-teal font-bold uppercase tracking-wider mt-0.5">
                    Quality Assured
                  </span>
                </div>
              </Link>

              {/* Location Selector Button */}
              <button
                onClick={() => setShowCityModal(true)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-uc-bg border border-uc-border hover:border-brand-teal hover:bg-teal-50/50 transition-all text-xs font-semibold text-brand-navy"
                title="Select City"
              >
                <MapPin size={15} className="text-brand-teal flex-shrink-0" />
                <span className="max-w-[120px] truncate">{selectedCity}</span>
                <ChevronDown size={14} className="text-uc-muted" />
              </button>
            </div>

            {/* Center: Global Search Bar */}
            <div className="relative flex-1 max-w-xl mx-auto hidden sm:block" ref={searchRef}>
              <div className="relative flex items-center">
                <Search size={17} className="absolute left-3.5 text-uc-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for 'AC Service', 'Salon', 'Cleaning'..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2.5 bg-uc-bg border border-uc-border rounded-xl text-sm font-medium text-uc-text placeholder-uc-muted focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal focus:bg-white transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-uc-muted hover:text-uc-text text-xs p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-modal border border-uc-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-uc-border bg-uc-bg/60 flex items-center justify-between text-xs font-semibold text-uc-muted px-4">
                    <span>Services matching "{searchQuery}"</span>
                    <span>{searchResults.length} results</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-uc-border">
                    {searchResults.length > 0 ? (
                      searchResults.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleSelectService(service)}
                          className="p-3.5 hover:bg-teal-50/60 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-uc-border"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-brand-navy truncate">
                              {service.name}
                            </h4>
                            <p className="text-xs text-uc-muted truncate">
                              {service.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-black text-brand-navy">
                              ₹{service.price}
                            </span>
                            <span className="block text-[11px] text-brand-teal font-semibold">
                              View →
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-uc-muted text-sm">
                        No services matching "{searchQuery}". Try "Salon", "AC", or "Cleaning".
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              
              {/* Partner link */}
              <a
                href="#partner"
                onClick={(e) => { e.preventDefault(); alert("Redirecting to Urban Company Partner Registration portal."); }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-uc-text hover:text-brand-teal rounded-lg transition-colors"
              >
                <Briefcase size={14} className="text-brand-teal" />
                Register as a partner
              </a>

              {/* Help link */}
              <a
                href="#help"
                onClick={(e) => { e.preventDefault(); alert("24/7 Urban Company Help Center: Call 1800-120-120 or chat with us."); }}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-uc-text hover:text-brand-teal rounded-lg transition-colors"
              >
                <HelpCircle size={14} className="text-uc-muted" />
                Help
              </a>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center p-2.5 rounded-xl bg-uc-bg border border-uc-border hover:border-brand-teal hover:bg-teal-50/50 transition-all"
                title="View Booking Cart"
              >
                <ShoppingCart size={20} className="text-brand-navy" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-brand-teal text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Sign In Button */}
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-dark transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <User size={14} />
                <span>Sign in</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-xl text-brand-navy hover:bg-uc-bg"
              >
                {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="sm:hidden pb-3 pt-1">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 text-uc-muted" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="w-full pl-9 pr-3 py-2 bg-uc-bg border border-uc-border rounded-xl text-xs font-medium text-uc-text focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-uc-border bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => { setShowCityModal(true); setShowMobileMenu(false); }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-uc-bg text-sm font-semibold text-brand-navy"
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-teal" /> City: {selectedCity}
              </span>
              <span className="text-xs text-brand-teal font-bold">Change</span>
            </button>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { alert("Partner Portal"); setShowMobileMenu(false); }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-uc-border text-xs font-bold text-uc-text"
              >
                <Briefcase size={14} className="text-brand-teal" /> Register Partner
              </button>
              <button
                onClick={() => { alert("Help Center: 1800-120-120"); setShowMobileMenu(false); }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-uc-border text-xs font-bold text-uc-text"
              >
                <HelpCircle size={14} className="text-brand-teal" /> Help Center
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Location Modal ── */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-modal border border-uc-border">
            <div className="flex items-center justify-between pb-4 border-b border-uc-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-brand-teal">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Select your city</h3>
                  <p className="text-xs text-uc-muted">Choose your current location for service availability</p>
                </div>
              </div>
              <button
                onClick={() => setShowCityModal(false)}
                className="p-1.5 rounded-full hover:bg-uc-bg text-uc-muted hover:text-brand-navy transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-uc-muted" />
                <input
                  type="text"
                  placeholder="Search your city..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-uc-bg border border-uc-border rounded-xl text-sm font-medium focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityModal(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedCity === city
                      ? 'border-brand-teal bg-teal-50/80 text-brand-teal'
                      : 'border-uc-border hover:border-uc-muted text-uc-text hover:bg-uc-bg'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && (
                    <span className="w-2 h-2 rounded-full bg-brand-teal" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-uc-border text-center">
              <p className="text-xs text-uc-muted">
                Looking for another area? We are expanding to 100+ cities in 2026.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sign In Modal ── */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-modal border border-uc-border relative">
            <button
              onClick={() => {
                setShowSignInModal(false);
                setLoginStep('phone');
                setPhoneNumber('');
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-uc-bg text-uc-muted"
            >
              <X size={18} />
            </button>

            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal mx-auto flex items-center justify-center mb-3">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Welcome to Urban Company</h3>
              <p className="text-xs text-uc-muted mt-1">
                Enter your mobile number to get booking updates and discounts.
              </p>
            </div>

            {loginStep === 'phone' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (phoneNumber.length === 10) setLoginStep('otp');
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-uc-muted mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex items-center border border-uc-border rounded-xl overflow-hidden focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20">
                    <span className="px-3.5 py-2.5 bg-uc-bg text-sm font-semibold text-brand-navy border-r border-uc-border">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 text-sm font-medium focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={phoneNumber.length !== 10}
                  className="w-full py-3 bg-brand-teal text-white rounded-xl font-bold text-sm hover:bg-brand-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Continue
                </button>
              </form>
            )}

            {loginStep === 'otp' && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-xs text-uc-muted">OTP sent to +91 {phoneNumber}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        defaultValue={i * 2}
                        className="w-12 h-12 text-center text-lg font-bold border border-uc-border rounded-xl focus:border-brand-teal focus:outline-none"
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setLoginStep('success')}
                  className="w-full py-3 bg-brand-teal text-white rounded-xl font-bold text-sm hover:bg-brand-teal-dark transition-all shadow-md"
                >
                  Verify & Sign in
                </button>
              </div>
            )}

            {loginStep === 'success' && (
              <div className="mt-6 text-center space-y-4">
                <div className="text-green-500 text-4xl">✓</div>
                <h4 className="font-bold text-brand-navy">Successfully Signed In!</h4>
                <p className="text-xs text-uc-muted">Welcome back. Your booking history is synchronized.</p>
                <button
                  onClick={() => {
                    setShowSignInModal(false);
                    setLoginStep('phone');
                  }}
                  className="w-full py-2.5 bg-brand-navy text-white rounded-xl font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
