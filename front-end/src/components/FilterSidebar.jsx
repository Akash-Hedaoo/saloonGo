import React, { useState } from 'react';
import '../styles/FilterSidebar.css';

const FilterSidebar = ({ inlineToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    rating: '',
    acSalon: false,
    distance: '',
    availability: ''
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      rating: '',
      acSalon: false,
      distance: '',
      availability: ''
    });
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    // TODO: Implement filter logic
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className={`filter-toggle-btn${inlineToggle ? ' inline' : ''}${isOpen ? ' active' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle filters"
        type="button"
        style={inlineToggle ? { position: 'static', marginLeft: '12px' } : {}}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
        </svg>
        <span>Filters</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="filter-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="close-btn" onClick={toggleSidebar} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="filter-content">
          {/* Rating Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Rating</h4>
            <div className="rating-options">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="rating-option">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating.toString()}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                  />
                  <span className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                      </svg>
                    ))}
                  </span>
                  <span className="rating-text">{rating}+ Stars</span>
                </label>
              ))}
            </div>
          </div>

          {/* AC Salon Filter */}
          <div className="filter-section">
            <h4 className="filter-title">AC Salon</h4>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={filters.acSalon}
                onChange={(e) => handleFilterChange('acSalon', e.target.checked)}
              />
              <span className="checkmark"></span>
              <span>Air Conditioned Salons Only</span>
            </label>
          </div>

          {/* Distance Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Distance</h4>
            <div className="distance-options">
              {[
                { value: '1', label: 'Within 1 km' },
                { value: '3', label: 'Within 3 km' },
                { value: '5', label: 'Within 5 km' },
                { value: '10', label: 'Within 10 km' }
              ].map(option => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="distance"
                    value={option.value}
                    checked={filters.distance === option.value}
                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                  />
                  <span className="radio-checkmark"></span>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Availability</h4>
            <div className="availability-options">
              {[
                { value: 'today', label: 'Available Today' },
                { value: 'tomorrow', label: 'Available Tomorrow' },
                { value: 'week', label: 'This Week' },
                { value: 'anytime', label: 'Any Time' }
              ].map(option => (
                <label key={option.value} className="radio-option">
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={filters.availability === option.value}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                  />
                  <span className="radio-checkmark"></span>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button className="clear-filters-btn" onClick={clearFilters} type="button">
            Clear All
          </button>
          <button className="apply-filters-btn" onClick={applyFilters} type="button">
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar; 