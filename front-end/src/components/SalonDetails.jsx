import React from 'react';
import '../styles/SalonDetails.css';

const SalonDetails = ({ salon }) => {
  // Default salon data if none provided
  const defaultSalon = {
    name: "Elite Hair Studio",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    isOpen: true,
    rating: 4.5,
    address: "123 Fashion Street, Downtown",
    hasAC: true,
    distance: "2.3 km",
    waitingList: 8,
    maxCapacity: 15
  };

  const salonData = salon || defaultSalon;

  return (
    <div className="salon-details-container">
      <div className="salon-details-card">
        {/* Left Side - Salon Details */}
        <div className="salon-details-info">
          <div className="salon-status">
            <span className={`status-indicator ${salonData.isOpen ? 'open' : 'closed'}`}>
              {salonData.isOpen ? '●' : '○'}
            </span>
            <span className="status-text">
              {salonData.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>

          <h2 className="salon-name">{salonData.name}</h2>
          
          <div className="salon-rating">
            <span className="rating-stars">★★★★☆</span>
            <span className="rating-number">{salonData.rating}</span>
          </div>

          <p className="salon-address">{salonData.address}</p>

          {/* Filters Section */}
          <div className="salon-filters">
            <span className="filters-label">Filters:</span>
            <div className="filters-tags">
              <span className={`filter-tag ${salonData.hasAC ? 'ac' : 'non-ac'}`}>
                {salonData.hasAC ? 'AC' : 'Non-AC'}
              </span>
              <span className="filter-tag distance">
                {salonData.distance}
              </span>
              <span className="filter-tag waiting-list">
                {salonData.waitingList} in queue
              </span>
            </div>
          </div>

          <button className="book-appointment-btn">
            Book Appointment
          </button>
        </div>

        {/* Right Side - Salon Image */}
        <div className="salon-image-container">
          <img 
            src={salonData.image} 
            alt={salonData.name}
            className="salon-image"
          />
        </div>
      </div>
    </div>
  );
};

export default SalonDetails;
