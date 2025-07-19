import React from "react";
import "../styles/LandingPage.css";
import landingpageimg from "../assets/images/landingpagephoto.jpg";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="image-container">
        <img src={landingpageimg} alt="Landing" />
      </div>
      <div className="imgtext">
        <h1>Book your next saloon appointment with ease</h1>
        <h4>
          SaloonGo connects you with nearby salons, offering real-time queue
          updates and seamless booking.
        </h4>
        <button>Book Slot</button>
      </div>
      <div className="midpart">
        <div className="sidetext">
             <h1>Key Features</h1>
        <h5>Experience the convenience of SaloonGo with these essential features</h5>
        </div>
       
        <div className="featurecontainer">
            <div className="feature">
                <img src="" alt="" />
                <h1>Easy Booking</h1>
                <p>Schedule appointments effortlessly with just a few taps.</p>
            </div>
            <div className="feature">
                 <img src="" alt="" />
                <h1>Real-Time Queue Updates</h1>
                <p>Stay informed with live updates on your appointment status.</p>
            </div>
            <div className="feature">
                 <img src="" alt="" />
                <h1>Find Nearby Salons</h1>
                <p>Discover top-rated salons in your area with our intuitive map.</p>
            </div>
        </div>
      </div>
      <div className="landing-page-footer">
        <h1>Ready to transform your saloon experience?</h1>
        
      </div>
      <div className="footer">&copy; : 2025 All rights reserved</div>
    </div>
  );
};

export default LandingPage;
