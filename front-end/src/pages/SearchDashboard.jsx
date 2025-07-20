import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import '../styles/SalonSearch.css';

const SearchDashboard = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    services: [],
    rating: 0,
    priceRange: 'all',
    distance: 'all'
  });

  // Dummy salon data
  const dummySalons = [
    {
      id: 1,
      name: "Elite Beauty Salon",
      address: "123 Fashion Street, Downtown",
      rating: 4.8,
      reviews: 156,
      services: ["Haircut", "Hair Coloring", "Facial", "Manicure"],
      priceRange: "$$",
      distance: "0.5 km",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
      waitTime: "15 min",
      isOpen: true,
      specialOffers: ["20% off first visit", "Free consultation"]
    },
    {
      id: 2,
      name: "Glamour Studio",
      address: "456 Style Avenue, Midtown",
      rating: 4.6,
      reviews: 89,
      services: ["Haircut", "Hair Styling", "Pedicure", "Waxing"],
      priceRange: "$$$",
      distance: "1.2 km",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      waitTime: "25 min",
      isOpen: true,
      specialOffers: ["Student discount", "Loyalty program"]
    },
    {
      id: 3,
      name: "Modern Cuts",
      address: "789 Trend Lane, Uptown",
      rating: 4.9,
      reviews: 234,
      services: ["Haircut", "Beard Trim", "Hair Treatment"],
      priceRange: "$",
      distance: "2.1 km",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
      waitTime: "5 min",
      isOpen: true,
      specialOffers: ["Walk-in welcome", "Quick service"]
    },
    {
      id: 4,
      name: "Luxury Spa & Salon",
      address: "321 Wellness Road, Luxury District",
      rating: 4.7,
      reviews: 189,
      services: ["Facial", "Massage", "Hair Treatment", "Body Care"],
      priceRange: "$$$$",
      distance: "3.5 km",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400",
      waitTime: "45 min",
      isOpen: false,
      specialOffers: ["VIP membership", "Spa packages"]
    },
    {
      id: 5,
      name: "Quick Style Bar",
      address: "654 Speed Street, Business District",
      rating: 4.3,
      reviews: 67,
      services: ["Haircut", "Quick Styling", "Beard Trim"],
      priceRange: "$",
      distance: "0.8 km",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
      waitTime: "10 min",
      isOpen: true,
      specialOffers: ["Express service", "Corporate rates"]
    },
    {
      id: 6,
      name: "Artistic Hair Design",
      address: "987 Creative Corner, Arts District",
      rating: 4.5,
      reviews: 112,
      services: ["Haircut", "Hair Coloring", "Hair Extensions", "Styling"],
      priceRange: "$$$",
      distance: "1.8 km",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
      waitTime: "30 min",
      isOpen: true,
      specialOffers: ["Creative consultation", "Portfolio sessions"]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSalons(dummySalons);
      setFilteredSalons(dummySalons);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterSalons();
  }, [searchTerm, selectedFilters, salons]);

  const filterSalons = () => {
    let filtered = salons.filter(salon => {
      // Search term filter
      const matchesSearch = salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           salon.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           salon.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));

      // Rating filter
      const matchesRating = selectedFilters.rating === 0 || salon.rating >= selectedFilters.rating;

      // Price range filter
      const matchesPrice = selectedFilters.priceRange === 'all' || salon.priceRange === selectedFilters.priceRange;

      // Services filter
      const matchesServices = selectedFilters.services.length === 0 || 
                             selectedFilters.services.some(service => salon.services.includes(service));

      return matchesSearch && matchesRating && matchesPrice && matchesServices;
    });

    setFilteredSalons(filtered);
  };

  const handleSalonClick = (salonId) => {
    navigate(`/salon-details?id=${salonId}`);
  };

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="search-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding the best salons for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-dashboard">
      <div className="search-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search salons, services, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-stats">
            <span>{filteredSalons.length} salons found</span>
          </div>
        </div>
      </div>

      <div className="search-content">
        <FilterSidebar 
          filters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
        
        <div className="salons-grid">
          {filteredSalons.length === 0 ? (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3>No salons found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            filteredSalons.map(salon => (
              <div key={salon.id} className="salon-card" onClick={() => handleSalonClick(salon.id)}>
                <div className="salon-image">
                  <img src={salon.image} alt={salon.name} />
                  <div className={`salon-status ${salon.isOpen ? 'open' : 'closed'}`}>
                    {salon.isOpen ? 'Open' : 'Closed'}
                  </div>
                  {salon.specialOffers.length > 0 && (
                    <div className="salon-offer">
                      {salon.specialOffers[0]}
                    </div>
                  )}
                </div>
                
                <div className="salon-info">
                  <div className="salon-header">
                    <h3 className="salon-name">{salon.name}</h3>
                    <div className="salon-rating">
                      <span className="rating-stars">
                        {'★'.repeat(Math.floor(salon.rating))}
                        {'☆'.repeat(5 - Math.floor(salon.rating))}
                      </span>
                      <span className="rating-number">{salon.rating}</span>
                      <span className="rating-count">({salon.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="salon-address">{salon.address}</p>
                  
                  <div className="salon-services">
                    {salon.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="service-tag">{service}</span>
                    ))}
                    {salon.services.length > 3 && (
                      <span className="service-tag more">+{salon.services.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="salon-meta">
                    <div className="salon-price">{salon.priceRange}</div>
                    <div className="salon-distance">{salon.distance}</div>
                    {salon.isOpen && (
                      <div className="salon-wait-time">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        {salon.waitTime} wait
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;
