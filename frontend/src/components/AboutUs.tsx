import React from 'react';
import '../styles/AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-container">
      <h1>About Fincan</h1>
      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Welcome to Fincan, your premier destination for exceptional coffee and tea experiences. 
            Founded with a passion for quality and tradition, we've been serving coffee and tea 
            enthusiasts since 2024.
          </p>
        </div>
        
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            We are dedicated to providing the finest selection of coffee beans, teas, and brewing 
            accessories. Our commitment to quality ensures that every cup you brew is a moment of 
            pure enjoyment.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Offer</h2>
          <ul>
            <li>Premium coffee beans from around the world</li>
            <li>Exquisite tea selections</li>
            <li>High-quality brewing equipment</li>
            <li>Expert brewing advice and tips</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 