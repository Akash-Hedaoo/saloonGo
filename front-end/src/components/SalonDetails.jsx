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
    services: ["Haircut", "Shave", "Facial", "Styling"]
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

          <div className="salon-services">
            <span className="services-label">Services:</span>
            <div className="services-tags">
              {salonData.services.slice(0, 3).map((service, index) => (
                <span key={index} className="service-tag">{service}</span>
              ))}
              {salonData.services.length > 3 && (
                <span className="service-tag more">+{salonData.services.length - 3} more</span>
              )}
            </div>
          </div>

          <button className="view-details-btn">
            View Details
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
