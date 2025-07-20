import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, inlineToggle = false }) => {
  const [isExpanded, setIsExpanded] = useState(!inlineToggle);
  const [showFilters, setShowFilters] = useState(false);
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

  // If inlineToggle is true, render a compact filter button
  if (inlineToggle) {
    return (
      <div className="filter-sidebar-inline" ref={filterRef}>
        <button 
          className="filter-toggle-btn inline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
          </svg>
          Filters
          {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v !== 'all' && v !== 0 && (Array.isArray(v) ? v.length > 0 : true)).length}</span>}
        </button>
        
        {showFilters && (
          <div className="filter-dropdown">
            <div className="filter-dropdown-content">
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
                  {[4.5, 4.0, 3.5, 3.0, 0].map(rating => (
                    <label key={rating} className="rating-option">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleRatingChange(rating)}
                      />
                      <span className="rating-custom">
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Price Range</h4>
                <div className="price-filter">
                  {[
                    { value: 'all', label: 'Any Price' },
                    { value: '$', label: 'Budget ($)' },
                    { value: '$$', label: 'Moderate ($$)' },
                    { value: '$$$', label: 'Premium ($$$)' },
                    { value: '$$$$', label: 'Luxury ($$$$)' }
                  ].map(option => (
                    <label key={option.value} className="price-option">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange === option.value}
                        onChange={() => handlePriceRangeChange(option.value)}
                      />
                      <span className="price-custom">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Distance</h4>
                <div className="distance-filter">
                  {[
                    { value: 'all', label: 'Any Distance' },
                    { value: '1km', label: 'Within 1 km' },
                    { value: '2km', label: 'Within 2 km' },
                    { value: '5km', label: 'Within 5 km' },
                    { value: '10km', label: 'Within 10 km' }
                  ].map(option => (
                    <label key={option.value} className="distance-option">
                      <input
                        type="radio"
                        name="distance"
                        checked={filters.distance === option.value}
                        onChange={() => handleDistanceChange(option.value)}
                      />
                      <span className="distance-custom">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
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
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular sidebar filter
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
              {[4.5, 4.0, 3.5, 3.0, 0].map(rating => (
                <label key={rating} className="rating-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                  />
                  <span className="rating-custom">
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-filter">
              {[
                { value: 'all', label: 'Any Price' },
                { value: '$', label: 'Budget ($)' },
                { value: '$$', label: 'Moderate ($$)' },
                { value: '$$$', label: 'Premium ($$$)' },
                { value: '$$$$', label: 'Luxury ($$$$)' }
              ].map(option => (
                <label key={option.value} className="price-option">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === option.value}
                    onChange={() => handlePriceRangeChange(option.value)}
                  />
                  <span className="price-custom">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Distance</h4>
            <div className="distance-filter">
              {[
                { value: 'all', label: 'Any Distance' },
                { value: '1km', label: 'Within 1 km' },
                { value: '2km', label: 'Within 2 km' },
                { value: '5km', label: 'Within 5 km' },
                { value: '10km', label: 'Within 10 km' }
              ].map(option => (
                <label key={option.value} className="distance-option">
                  <input
                    type="radio"
                    name="distance"
                    checked={filters.distance === option.value}
                    onChange={() => handleDistanceChange(option.value)}
                  />
                  <span className="distance-custom">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="active-filters">
              <h4 className="filter-title">Active Filters</h4>
              <div className="active-filters-list">
                {filters.services.map(service => (
                  <span key={service} className="active-filter-tag">
                    {service}
                    <button 
                      onClick={() => handleServiceToggle(service)}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.rating > 0 && (
                  <span className="active-filter-tag">
                    {filters.rating}+ Rating
                    <button 
                      onClick={() => handleRatingChange(0)}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.priceRange !== 'all' && (
                  <span className="active-filter-tag">
                    {filters.priceRange} Price
                    <button 
                      onClick={() => handlePriceRangeChange('all')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.distance !== 'all' && (
                  <span className="active-filter-tag">
                    {filters.distance} Distance
                    <button 
                      onClick={() => handleDistanceChange('all')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilterSidebar; 