import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/SalonDetails.css';

const SalonDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Dummy salon data
  const dummySalons = {
    1: {
      id: 1,
      name: "Elite Beauty Salon",
      address: "123 Fashion Street, Downtown",
      phone: "+1 (555) 123-4567",
      email: "info@elitebeauty.com",
      rating: 4.8,
      reviews: 156,
      services: [
        {
          id: 1,
          name: "Haircut & Styling",
          description: "Professional haircut with styling consultation",
          duration: "45 min",
          price: 45,
          category: "Hair"
        },
        {
          id: 2,
          name: "Hair Coloring",
          description: "Full hair coloring with premium products",
          duration: "2 hours",
          price: 120,
          category: "Hair"
        },
        {
          id: 3,
          name: "Facial Treatment",
          description: "Deep cleansing facial with mask",
          duration: "60 min",
          price: 75,
          category: "Facial"
        },
        {
          id: 4,
          name: "Manicure",
          description: "Classic manicure with polish",
          duration: "30 min",
          price: 35,
          category: "Nails"
        }
      ],
      priceRange: "$$",
      distance: "0.5 km",
      images: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800"
      ],
      waitTime: "15 min",
      isOpen: true,
      specialOffers: ["20% off first visit", "Free consultation"],
      workingHours: {
        "Monday": "9:00 AM - 8:00 PM",
        "Tuesday": "9:00 AM - 8:00 PM",
        "Wednesday": "9:00 AM - 8:00 PM",
        "Thursday": "9:00 AM - 8:00 PM",
        "Friday": "9:00 AM - 9:00 PM",
        "Saturday": "10:00 AM - 7:00 PM",
        "Sunday": "11:00 AM - 6:00 PM"
      },
      amenities: ["Free WiFi", "Air Conditioning", "Parking", "Wheelchair Accessible"],
      description: "Elite Beauty Salon offers premium salon services in a luxurious and relaxing environment. Our experienced stylists use only the finest products to ensure you look and feel your best."
    },
    2: {
      id: 2,
      name: "Glamour Studio",
      address: "456 Style Avenue, Midtown",
      phone: "+1 (555) 987-6543",
      email: "hello@glamourstudio.com",
      rating: 4.6,
      reviews: 89,
      services: [
        {
          id: 1,
          name: "Haircut & Styling",
          description: "Trendy haircut with modern styling",
          duration: "40 min",
          price: 50,
          category: "Hair"
        },
        {
          id: 2,
          name: "Hair Extensions",
          description: "Professional hair extensions installation",
          duration: "3 hours",
          price: 200,
          category: "Hair"
        },
        {
          id: 3,
          name: "Pedicure",
          description: "Luxury pedicure with foot massage",
          duration: "45 min",
          price: 45,
          category: "Nails"
        },
        {
          id: 4,
          name: "Waxing",
          description: "Professional waxing services",
          duration: "30 min",
          price: 40,
          category: "Body"
        }
      ],
      priceRange: "$$$",
      distance: "1.2 km",
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800"
      ],
      waitTime: "25 min",
      isOpen: true,
      specialOffers: ["Student discount", "Loyalty program"],
      workingHours: {
        "Monday": "10:00 AM - 7:00 PM",
        "Tuesday": "10:00 AM - 7:00 PM",
        "Wednesday": "10:00 AM - 7:00 PM",
        "Thursday": "10:00 AM - 8:00 PM",
        "Friday": "10:00 AM - 8:00 PM",
        "Saturday": "9:00 AM - 6:00 PM",
        "Sunday": "Closed"
      },
      amenities: ["Free WiFi", "Air Conditioning", "Refreshments", "Magazines"],
      description: "Glamour Studio is your destination for trendy hairstyles and beauty treatments. Our creative team stays updated with the latest trends to give you the look you desire."
    }
  };

  useEffect(() => {
    const salonId = searchParams.get('id');
    if (salonId && dummySalons[salonId]) {
      setTimeout(() => {
        setSalon(dummySalons[salonId]);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBooking = () => {
    // Simulate booking process
    alert(`Booking confirmed for ${selectedService.name} at ${salon.name}!`);
    setShowBookingModal(false);
    setSelectedService(null);
  };

  const handleBackToSearch = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="salon-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="salon-details-container">
        <div className="error-container">
          <h2>Salon not found</h2>
          <p>The salon you're looking for doesn't exist.</p>
          <button onClick={handleBackToSearch} className="back-btn">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="salon-details-container">
      {/* Header */}
      <div className="salon-header">
        <button onClick={handleBackToSearch} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12,19 5,12 12,5"></polyline>
          </svg>
          Back to Search
        </button>
      </div>

      {/* Salon Gallery */}
      <div className="salon-gallery">
        <div className="main-image">
          <img src={salon.images[0]} alt={salon.name} />
          <div className={`salon-status ${salon.isOpen ? 'open' : 'closed'}`}>
            {salon.isOpen ? 'Open' : 'Closed'}
          </div>
        </div>
        <div className="image-grid">
          {salon.images.slice(1).map((image, index) => (
            <img key={index} src={image} alt={`${salon.name} ${index + 2}`} />
          ))}
        </div>
      </div>

      {/* Salon Info */}
      <div className="salon-info-section">
        <div className="salon-basic-info">
          <h1 className="salon-name">{salon.name}</h1>
          <div className="salon-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.floor(salon.rating))}
              {'☆'.repeat(5 - Math.floor(salon.rating))}
            </span>
            <span className="rating-number">{salon.rating}</span>
            <span className="rating-count">({salon.reviews} reviews)</span>
          </div>
          <p className="salon-address">{salon.address}</p>
          <div className="salon-meta">
            <span className="price-range">{salon.priceRange}</span>
            <span className="distance">{salon.distance}</span>
            {salon.isOpen && (
              <span className="wait-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                {salon.waitTime} wait
              </span>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <div className="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>{salon.phone}</span>
          </div>
          <div className="contact-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>{salon.email}</span>
          </div>
        </div>

        {/* Special Offers */}
        {salon.specialOffers.length > 0 && (
          <div className="special-offers">
            <h3>Special Offers</h3>
            <div className="offers-list">
              {salon.specialOffers.map((offer, index) => (
                <span key={index} className="offer-tag">{offer}</span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="salon-description">
          <h3>About</h3>
          <p>{salon.description}</p>
        </div>

        {/* Amenities */}
        <div className="amenities">
          <h3>Amenities</h3>
          <div className="amenities-list">
            {salon.amenities.map((amenity, index) => (
              <span key={index} className="amenity-tag">{amenity}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="services-section">
        <h2>Services</h2>
        <div className="services-grid">
          {salon.services.map(service => (
            <div key={service.id} className="service-card" onClick={() => handleServiceSelect(service)}>
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className="service-price">${service.price}</span>
              </div>
              <p className="service-description">{service.description}</p>
              <div className="service-meta">
                <span className="service-duration">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  {service.duration}
                </span>
                <span className="service-category">{service.category}</span>
              </div>
              <button className="book-service-btn">Book Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="working-hours-section">
        <h2>Working Hours</h2>
        <div className="hours-grid">
          {Object.entries(salon.workingHours).map(([day, hours]) => (
            <div key={day} className="day-schedule">
              <span className="day-name">{day}</span>
              <span className="day-hours">{hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="booking-modal" onClick={() => setShowBookingModal(false)}>
          <div className="booking-content" onClick={e => e.stopPropagation()}>
            <div className="booking-header">
              <h3>Book Appointment</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>
            <div className="booking-body">
              <div className="service-summary">
                <h4>{selectedService.name}</h4>
                <p>{selectedService.description}</p>
                <div className="service-details">
                  <span>Duration: {selectedService.duration}</span>
                  <span>Price: ${selectedService.price}</span>
                </div>
              </div>
              <div className="booking-form">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <select>
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" placeholder="Your phone number" />
                </div>
              </div>
              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <div className="summary-item">
                  <span>Service:</span>
                  <span>{selectedService.name}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{selectedService.duration}</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>${selectedService.price}</span>
                </div>
              </div>
            </div>
            <div className="booking-actions">
              <button className="confirm-booking-btn" onClick={handleBooking}>
                Confirm Booking
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetails;
