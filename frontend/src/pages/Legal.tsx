import React from 'react';
import '../styles/Legal.css';

const Legal: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>Legal Information</h1>
      
      <section className="legal-section">
        <h2>Terms of Service</h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <div className="legal-content">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using Fincan, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h3>2. Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Fincan's website for personal, non-commercial transitory viewing only.</p>

          <h3>3. Disclaimer</h3>
          <p>The materials on Fincan's website are provided on an 'as is' basis. Fincan makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Privacy Policy</h2>
        <div className="legal-content">
          <h3>1. Information We Collect</h3>
          <p>We collect information that you provide directly to us, including but not limited to:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Order history</li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your orders and payments</li>
            <li>Communicate with you about your orders</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>

          <h3>3. Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Shipping Policy</h2>
        <div className="legal-content">
          <h3>1. Processing Time</h3>
          <p>Orders are typically processed within 1-2 business days after payment confirmation.</p>

          <h3>2. Shipping Methods</h3>
          <p>We offer various shipping methods including standard and express delivery. Shipping costs and delivery times may vary based on your location and selected shipping method.</p>

          <h3>3. International Shipping</h3>
          <p>International orders may be subject to customs duties and taxes, which are the responsibility of the recipient.</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Return Policy</h2>
        <div className="legal-content">
          <h3>1. Return Window</h3>
          <p>You have 14 days from the date of delivery to initiate a return.</p>

          <h3>2. Return Conditions</h3>
          <p>Items must be unused and in their original packaging with all tags attached.</p>

          <h3>3. Refund Process</h3>
          <p>Refunds will be processed within 5-7 business days after receiving the returned item.</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Contact Information</h2>
        <div className="legal-content">
          <p>For any legal inquiries, please contact us at:</p>
          <p>Email: legal@fincan.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Coffee Street, Brew City, BC 12345</p>
        </div>
      </section>
    </div>
  );
};

export default Legal; 