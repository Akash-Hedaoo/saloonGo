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
        <h4>SaloonGo connects you with nearby salons, offering real-time queue updates and seamless booking.</h4>
      </div>
    </div>
  );
};

export default LandingPage;
