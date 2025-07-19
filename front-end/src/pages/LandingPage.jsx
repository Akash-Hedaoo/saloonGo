import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import landingpageimg from "../assets/images/landingpagephoto.jpg";

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic or navigation here
    alert(`Searching for: ${search}`);
  };

  return (
    <div className="landing-page-container">
      {/* Premium Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-image-container">
            <img src={landingpageimg} alt="Salon Services" />
            <div className="hero-overlay"></div>
          </div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="hero-content">
          {/* Minimal Search Bar */}
          <form className="minimal-search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              className="minimal-search-input"
              placeholder="Search salons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="minimal-search-btn" tabIndex={-1}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
          <h1 className="hero-title">
            <span className="title-line">Transform Your</span>
            <span className="title-line highlight">Salon Journey</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of salon booking with real-time queues, 
            instant notifications, and seamless appointments.
          </p>
          <div className="hero-actions">
            <Link to="/search" className="cta-button primary">
              <span>Start Booking</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/shop-registration" className="cta-button secondary">
              <span>Join SaloonGo</span>
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">80%</span>
              <span className="stat-label">Faster Booking</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Premium Salons</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="section-header animate-on-scroll">
          <div className="section-badge">Features</div>
          <h2>Why Choose SaloonGo?</h2>
          <p>Experience the perfect blend of technology and luxury</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-on-scroll" style={{animationDelay: '0.1s'}}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <div className="icon-glow"></div>
            </div>
            <h3>Smart Booking</h3>
            <p>Book your preferred time slot with intelligent scheduling that adapts to your lifestyle.</p>
            <div className="feature-highlight">Instant Confirmation</div>
          </div>
          
          <div className="feature-card animate-on-scroll" style={{animationDelay: '0.2s'}}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className="icon-glow"></div>
            </div>
            <h3>Live Queue Updates</h3>
            <p>Real-time notifications keep you informed about your appointment status and estimated wait times.</p>
            <div className="feature-highlight">Real-time Alerts</div>
          </div>
          
          <div className="feature-card animate-on-scroll" style={{animationDelay: '0.3s'}}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="icon-glow"></div>
            </div>
            <h3>Premium Salons</h3>
            <p>Discover and book appointments at the finest salons in your area with detailed reviews and ratings.</p>
            <div className="feature-highlight">Curated Selection</div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-background">
          <div className="stats-pattern"></div>
        </div>
        <div className="stats-content">
          <div className="stats-header animate-on-scroll">
            <h2>Trusted by Thousands</h2>
            <p>Join the growing community of satisfied customers</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card animate-on-scroll" style={{animationDelay: '0.1s'}}>
              <div className="stat-number-wrapper">
                <span className="stat-number" data-target="80">0</span>
                <span className="stat-symbol">%</span>
              </div>
              <p>Reduction in Wait Times</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: '80%'}}></div>
              </div>
            </div>
            
            <div className="stat-card animate-on-scroll" style={{animationDelay: '0.2s'}}>
              <div className="stat-number-wrapper">
                <span className="stat-number" data-target="500">0</span>
                <span className="stat-symbol">+</span>
              </div>
              <p>Premium Salons Partnered</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: '85%'}}></div>
              </div>
            </div>
            
            <div className="stat-card animate-on-scroll" style={{animationDelay: '0.3s'}}>
              <div className="stat-number-wrapper">
                <span className="stat-number" data-target="10">0</span>
                <span className="stat-symbol">K+</span>
              </div>
              <p>Happy Customers</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="cta-content animate-on-scroll">
          <div className="cta-badge">Ready to Start?</div>
          <h2>Begin Your Premium Salon Experience</h2>
          <p>Join thousands of customers who have already discovered the convenience and luxury of SaloonGo</p>
          <div className="cta-actions">
            <Link to="/register" className="cta-button primary">
              <span>Get Started Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/search" className="cta-button secondary">
              <span>Explore Salons</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="footer">
        <div className="footer-background">
          <div className="footer-pattern"></div>
        </div>
        <div className="footer-content">
          <div className="footer-brand">
            <h3>SaloonGo</h3>
            <p>Revolutionizing salon booking with premium technology and exceptional service.</p>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Product</h4>
              <Link to="/search">Find Salons</Link>
              <Link to="/saloon-booking">Book Appointment</Link>
              <Link to="/user-profile">My Account</Link>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Careers</Link>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/faq">FAQ</Link>
              <a href="mailto:support@saloongo.com">Email Support</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 SaloonGo. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
