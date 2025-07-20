import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { salonAPI } from '../services/api';
import '../styles/AppointmentBooking.css';
import FilterSidebar from '../components/FilterSidebar';
import SalonDetails from '../components/SalonDetails';

const AppointmentBooking = () => {
  const { user } = useAuth();
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for testing when backend is not available
  const mockSalons = [
    {
      id: 1,
      name: "Elite Hair Studio",
      description: "Premium hair styling and treatments",
      rating: 4.5,
      city: "Mumbai",
      address: "123 Fashion Street, Downtown",
      isOpen: true,
      hasAC: true,
      distance: "2.3 km",
      waitingList: 8,
      maxCapacity: 15,
      workingHours: {
        monday: { open: "09:00", close: "20:00", isOpen: true },
        tuesday: { open: "09:00", close: "20:00", isOpen: true },
        wednesday: { open: "09:00", close: "20:00", isOpen: true },
        thursday: { open: "09:00", close: "20:00", isOpen: true },
        friday: { open: "09:00", close: "20:00", isOpen: true },
        saturday: { open: "10:00", close: "18:00", isOpen: true },
        sunday: { open: "10:00", close: "16:00", isOpen: true }
      },
      services: [
        { id: 1, name: "Hair Cut", price: 500, duration: 30 },
        { id: 2, name: "Hair Color", price: 1500, duration: 120 },
        { id: 3, name: "Facial", price: 800, duration: 60 }
      ],
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Beauty Paradise",
      description: "Complete beauty solutions and spa treatments",
      rating: 4.2,
      city: "Delhi",
      address: "456 Beauty Lane, Central",
      isOpen: true,
      hasAC: false,
      distance: "1.8 km",
      waitingList: 3,
      maxCapacity: 12,
      workingHours: {
        monday: { open: "10:00", close: "19:00", isOpen: true },
        tuesday: { open: "10:00", close: "19:00", isOpen: true },
        wednesday: { open: "10:00", close: "19:00", isOpen: true },
        thursday: { open: "10:00", close: "19:00", isOpen: true },
        friday: { open: "10:00", close: "19:00", isOpen: true },
        saturday: { open: "11:00", close: "17:00", isOpen: true },
        sunday: { open: "11:00", close: "15:00", isOpen: true }
      },
      services: [
        { id: 4, name: "Manicure", price: 400, duration: 45 },
        { id: 5, name: "Pedicure", price: 600, duration: 60 },
        { id: 6, name: "Massage", price: 1200, duration: 90 }
      ],
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Glamour Salon",
      description: "Trendy styling and modern beauty treatments",
      rating: 4.7,
      city: "Bangalore",
      address: "789 Style Avenue, Tech Park",
      isOpen: true,
      hasAC: true,
      distance: "3.1 km",
      waitingList: 12,
      maxCapacity: 20,
      workingHours: {
        monday: { open: "09:00", close: "21:00", isOpen: true },
        tuesday: { open: "09:00", close: "21:00", isOpen: true },
        wednesday: { open: "09:00", close: "21:00", isOpen: true },
        thursday: { open: "09:00", close: "21:00", isOpen: true },
        friday: { open: "09:00", close: "21:00", isOpen: true },
        saturday: { open: "10:00", close: "19:00", isOpen: true },
        sunday: { open: "10:00", close: "18:00", isOpen: true }
      },
      services: [
        { id: 7, name: "Hair Styling", price: 800, duration: 45 },
        { id: 8, name: "Bridal Makeup", price: 3000, duration: 180 },
        { id: 9, name: "Spa Treatment", price: 2000, duration: 120 }
      ],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    }
  ];

  useEffect(() => {
    fetchSalons();
  }, []);

  // Add a refresh mechanism when the component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSalons();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    filterSalons();
  }, [salons, searchTerm]);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess(''); // Clear previous success messages
      
      console.log('Fetching salons from API...');
      
      // Try to fetch from API first
      const response = await salonAPI.getAllSalons();
      console.log('API response:', response);
      
      const apiSalons = response.data.salons || response.data;
      console.log('Raw API salons:', apiSalons);
      
      if (apiSalons && apiSalons.length > 0) {
        // Transform API data to match our expected format
        const transformedSalons = apiSalons.map(salon => ({
          id: salon.id,
          name: salon.name,
          description: salon.description || `Salon offering ${salon.services?.map(s => s.name).join(', ') || 'various services'}`,
          rating: salon.rating || 0,
          city: salon.city || 'Unknown',
          address: salon.address,
          isOpen: salon.isOpen !== false, // Default to true if not specified
          hasAC: salon.hasAC !== false, // Default to true if not specified
          distance: salon.distance || '0 km',
          waitingList: salon.waitingList || 0,
          maxCapacity: salon.maxCapacity || 10,
          workingHours: salon.workingHours || {},
          services: salon.services || [],
          image: salon.images?.[0] || salon.profileImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
        }));
        
        console.log('Transformed salons:', transformedSalons);
        setSalons(transformedSalons);
        setError(''); // Clear any previous errors
      } else {
        console.log('No salons found in API response, using mock data');
        setSalons(mockSalons);
        setError('No real salon data available, showing sample data');
      }
    } catch (error) {
      console.error('API fetch failed:', error);
      console.error('API error response:', error.response?.data);
      console.log('Falling back to mock data');
      // If API fails, use mock data
      setSalons(mockSalons);
      setError('Could not load salon data from server, showing sample data');
    } finally {
      setLoading(false);
    }
  };

  const filterSalons = () => {
    let filtered = [...salons];

    // Search by name, description, or address
    if (searchTerm) {
      filtered = filtered.filter(salon =>
        salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSalons(filtered);
  };

  const handleSalonSelect = async (salon) => {
    try {
      // Fetch detailed salon info including availability
      const response = await salonAPI.getSalonProfile(salon.id);
      const detailedSalon = response.data.salon || response.data;
      
      // Merge with existing salon data
      const updatedSalon = {
        ...salon,
        ...detailedSalon,
        services: detailedSalon.services || salon.services,
        workingHours: detailedSalon.workingHours || salon.workingHours
      };
      
      setSelectedSalon(updatedSalon);
    } catch (error) {
      console.log('Using existing salon data');
      // If API fails, use the salon data we already have
      setSelectedSalon(salon);
    }
  };

  const createTestSalon = async () => {
    try {
      setLoading(true);
      console.log('Creating test salon...');
      
      const response = await fetch('http://localhost:3001/api/salon/test-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      console.log('Test salon creation result:', result);
      
      if (result.success) {
        setSuccess('Test salon created successfully! Refreshing salon list...');
        // Refresh the salon list
        await fetchSalons();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to create test salon: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating test salon:', error);
      setError('Failed to create test salon');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="appointment-booking-root">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading salons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-booking-root">
      <div className="booking-header-row">
        <input
          type="text"
          className="booking-search-bar"
          placeholder="Search for salons or services..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSidebar inlineToggle />
      </div>
      
      <div className="appointment-booking-container">
        <div className="appointment-booking-header">
          <h1>Find Your Perfect Salon</h1>
          <p>Discover and book appointments at the best salons in your area</p>
          
          {/* Display success and error messages */}
          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '10px',
              border: '1px solid #c3e6cb'
            }}>
              {success}
            </div>
          )}
          
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '10px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          {/* Add manual refresh button */}
          <button 
            onClick={fetchSalons}
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Salons'}
          </button>
          
          {/* Add test salon creation button */}
          <button 
            onClick={createTestSalon}
            disabled={loading}
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Create Test Salon
          </button>
        </div>
        {selectedSalon ? (
          <div className="salon-details-view">
            <button 
              className="back-to-list-btn"
              onClick={() => setSelectedSalon(null)}
            >
              ← Back to Salons
            </button>
            <SalonDetails salon={selectedSalon} />
          </div>
        ) : (
          <div className="salons-list">
            <h2 className="salons-list-title">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Available Salons'}
            </h2>
            {filteredSalons.length === 0 ? (
              <div className="no-salons">
                <p>No salons found matching your search criteria.</p>
                {searchTerm && (
                  <p>Try searching for a different term or browse all available salons.</p>
                )}
              </div>
            ) : (
              <div className="salons-grid">
                {filteredSalons.map(salon => (
                  <div 
                    key={salon.id} 
                    className="salon-card"
                    onClick={() => handleSalonSelect(salon)}
                  >
                    <div className="salon-card-image">
                      <img src={salon.image} alt={salon.name} />
                      <div className="salon-status-badge">
                        <span className={`status-dot ${salon.isOpen ? 'open' : 'closed'}`}></span>
                        {salon.isOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>
                    <div className="salon-card-content">
                      <h3 className="salon-card-name">{salon.name}</h3>
                      <div className="salon-card-rating">
                        <span className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(salon.rating) ? 'star filled' : 'star'}>
                              ★
                            </span>
                          ))}
                        </span>
                        <span className="rating-number">{salon.rating}</span>
                      </div>
                      <p className="salon-card-address">{salon.address}</p>
                      <div className="salon-card-tags">
                        <span className={`tag ac ${salon.hasAC ? 'yes' : 'no'}`}>
                          {salon.hasAC ? 'AC' : 'Non-AC'}
                        </span>
                        <span className="tag distance">{salon.distance}</span>
                        <span className="tag waiting">{salon.waitingList} in queue</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking; 