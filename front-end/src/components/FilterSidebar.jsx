import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, inlineToggle = false }) => {
  const [isExpanded, setIsExpanded] = useState(!inlineToggle);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const filterRef = useRef(null);

  const availableServices = [
    "Haircut",
    "Hair Coloring", 
    "Hair Styling",
    "Hair Treatment",
    "Beard Trim",
    "Facial",
    "Manicure",
    "Pedicure",
    "Waxing",
    "Massage",
    "Body Care",
    "Hair Extensions"
  ];

  const ratingOptions = [
    { value: 0, label: 'Any Rating', icon: '⭐' },
    { value: 3.0, label: '3.0+ Stars', icon: '⭐⭐⭐' },
    { value: 3.5, label: '3.5+ Stars', icon: '⭐⭐⭐⭐' },
    { value: 4.0, label: '4.0+ Stars', icon: '⭐⭐⭐⭐⭐' },
    { value: 4.5, label: '4.5+ Stars', icon: '⭐⭐⭐⭐⭐' }
  ];

  const priceOptions = [
    { value: 'all', label: 'Any Price', icon: '💰' },
    { value: '$', label: 'Budget ($)', icon: '💵' },
    { value: '$$', label: 'Moderate ($$)', icon: '💳' },
    { value: '$$$', label: 'Premium ($$$)', icon: '💎' },
    { value: '$$$$', label: 'Luxury ($$$$)', icon: '👑' }
  ];

  const distanceOptions = [
    { value: 'all', label: 'Any Distance', icon: '🌍' },
    { value: '1km', label: 'Within 1 km', icon: '📍' },
    { value: '2km', label: 'Within 2 km', icon: '📍📍' },
    { value: '5km', label: 'Within 5 km', icon: '📍📍📍' },
    { value: '10km', label: 'Within 10 km', icon: '📍📍📍📍' }
  ];

  // Click outside handler for inline filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (inlineToggle && showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inlineToggle, showFilters]);

  const handleServiceToggle = (service) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    
    onFilterChange({
      ...filters,
      services: newServices
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: rating
    });
  };

  const handlePriceRangeChange = (priceRange) => {
    onFilterChange({
      ...filters,
      priceRange: priceRange
    });
  };

  const handleDistanceChange = (distance) => {
    onFilterChange({
      ...filters,
      distance: distance
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      services: [],
      rating: 0,
      priceRange: 'all',
      distance: 'all'
    });
  };

  const hasActiveFilters = filters.services.length > 0 || 
                          filters.rating > 0 || 
                          filters.priceRange !== 'all' || 
                          filters.distance !== 'all';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.services.length > 0) count += filters.services.length;
    if (filters.rating > 0) count += 1;
    if (filters.priceRange !== 'all') count += 1;
    if (filters.distance !== 'all') count += 1;
    return count;
  };

  // If inlineToggle is true, render a modern compact filter button
  if (inlineToggle) {
    return (
      <div className="filter-sidebar-inline" ref={filterRef}>
        <button 
          className="filter-toggle-btn inline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="filter-badge">{getActiveFiltersCount()}</span>
          )}
        </button>
        
        {showFilters && (
          <div className="filter-dropdown">
            <div className="filter-dropdown-content">
              {/* Filter Header */}
              <div className="filter-header-section">
                <h3 className="filter-main-title">Filter Options</h3>
                {hasActiveFilters && (
                  <button 
                    className="clear-filters-btn-header"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeTab === 'services' ? 'active' : ''}`}
                  onClick={() => setActiveTab('services')}
                >
                  <span className="tab-icon">✂️</span>
                  Services
                </button>
                <button 
                  className={`filter-tab ${activeTab === 'rating' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rating')}
                >
                  <span className="tab-icon">⭐</span>
                  Rating
                </button>
                <button 
                  className={`filter-tab ${activeTab === 'price' ? 'active' : ''}`}
                  onClick={() => setActiveTab('price')}
                >
                  <span className="tab-icon">💰</span>
                  Price
                </button>
                <button 
                  className={`filter-tab ${activeTab === 'distance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('distance')}
                >
                  <span className="tab-icon">📍</span>
                  Distance
                </button>
              </div>

              {/* Filter Content */}
              <div className="filter-content-section">
                {activeTab === 'services' && (
                  <div className="filter-section">
                    <h4 className="filter-title">Select Services</h4>
                    <div className="services-grid">
                      {availableServices.map(service => (
                        <label key={service} className="service-checkbox">
                          <input
                            type="checkbox"
                            checked={filters.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                          />
                          <span className="checkbox-custom"></span>
                          <span className="service-label">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'rating' && (
                  <div className="filter-section">
                    <h4 className="filter-title">Minimum Rating</h4>
                    <div className="rating-filter">
                      {ratingOptions.map(option => (
                        <label key={option.value} className="rating-option">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === option.value}
                            onChange={() => handleRatingChange(option.value)}
                          />
                          <span className="rating-custom"></span>
                          <span className="option-content">
                            <span className="option-icon">{option.icon}</span>
                            <span className="option-label">{option.label}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'price' && (
                  <div className="filter-section">
                    <h4 className="filter-title">Price Range</h4>
                    <div className="price-filter">
                      {priceOptions.map(option => (
                        <label key={option.value} className="price-option">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={filters.priceRange === option.value}
                            onChange={() => handlePriceRangeChange(option.value)}
                          />
                          <span className="price-custom"></span>
                          <span className="option-content">
                            <span className="option-icon">{option.icon}</span>
                            <span className="option-label">{option.label}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'distance' && (
                  <div className="filter-section">
                    <h4 className="filter-title">Distance</h4>
                    <div className="distance-filter">
                      {distanceOptions.map(option => (
                        <label key={option.value} className="distance-option">
                          <input
                            type="radio"
                            name="distance"
                            checked={filters.distance === option.value}
                            onChange={() => handleDistanceChange(option.value)}
                          />
                          <span className="distance-custom"></span>
                          <span className="option-content">
                            <span className="option-icon">{option.icon}</span>
                            <span className="option-label">{option.label}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply Filters Button */}
              <div className="filter-actions">
                <button 
                  className="apply-filters-btn"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular sidebar filter (for non-inline use)
  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button 
          className="expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
      </div>

      {isExpanded && (
        <>
          {hasActiveFilters && (
            <div className="filter-actions">
              <button 
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Services Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Services</h4>
            <div className="services-grid">
              {availableServices.map(service => (
                <label key={service} className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="service-label">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Minimum Rating</h4>
            <div className="rating-filter">
              {ratingOptions.map(option => (
                <label key={option.value} className="rating-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === option.value}
                    onChange={() => handleRatingChange(option.value)}
                  />
                  <span className="rating-custom"></span>
                  <span className="option-content">
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-filter">
              {priceOptions.map(option => (
                <label key={option.value} className="price-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === option.value}
                    onChange={() => handlePriceRangeChange(option.value)}
                  />
                  <span className="price-custom"></span>
                  <span className="option-content">
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Distance</h4>
            <div className="distance-filter">
              {distanceOptions.map(option => (
                <label key={option.value} className="distance-option">
                  <input
                    type="radio"
                    name="distance"
                    checked={filters.distance === option.value}
                    onChange={() => handleDistanceChange(option.value)}
                  />
                  <span className="distance-custom"></span>
                  <span className="option-content">
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSidebar; 