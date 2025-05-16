import React, { useState, useEffect } from 'react';
import '../styles/Help.css';
import { FaShoppingCart, FaShippingFast, FaExchangeAlt, FaQuestionCircle, FaUserCircle } from 'react-icons/fa';

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const helpSections = [
    {
      id: 'ordering',
      title: 'Ordering',
      icon: <FaShoppingCart />,
      content: (
        <div>
          <h3>How to Place an Order</h3>
          <ol>
            <li>Browse our products and add items to your cart</li>
            <li>Click on the cart icon in the navigation bar</li>
            <li>Review your items and quantities</li>
            <li>Click "Proceed to Checkout"</li>
            <li>Enter your shipping and payment information</li>
            <li>Review your order and click "Place Order"</li>
          </ol>
          
          <h3>Payment Methods</h3>
          <p>We accept the following payment methods:</p>
          <ul>
            <li>Credit/Debit Cards (Visa, MasterCard, American Express)</li>
            <li>PayPal</li>
            <li>Apple Pay</li>
            <li>Google Pay</li>
          </ul>
        </div>
      )
    },
    {
      id: 'shipping',
      title: 'Shipping',
      icon: <FaShippingFast />,
      content: (
        <div>
          <h3>Shipping Options</h3>
          <ul>
            <li>Standard Shipping (3-5 business days)</li>
            <li>Express Shipping (1-2 business days)</li>
            <li>International Shipping (7-14 business days)</li>
          </ul>

          <h3>Shipping Costs</h3>
          <p>Shipping costs are calculated based on:</p>
          <ul>
            <li>Order weight and dimensions</li>
            <li>Shipping destination</li>
            <li>Selected shipping method</li>
          </ul>
          <p>Free shipping is available for orders over $50 within the continental United States.</p>
        </div>
      )
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: <FaExchangeAlt />,
      content: (
        <div>
          <h3>Return Policy</h3>
          <p>We accept returns within 14 days of delivery. Items must be:</p>
          <ul>
            <li>Unused and in original packaging</li>
            <li>In the same condition as received</li>
            <li>Accompanied by the original receipt</li>
          </ul>

          <h3>Refund Process</h3>
          <ol>
            <li>Contact our customer service to initiate a return</li>
            <li>Package the item securely with all original packaging</li>
            <li>Include the return form in your package</li>
            <li>Ship the item back to us</li>
            <li>Once received, we'll process your refund within 5-7 business days</li>
          </ol>
        </div>
      )
    },
    {
      id: 'account',
      title: 'Account Help',
      icon: <FaUserCircle />,
      content: (
        <div>
          <h3>Managing Your Account</h3>
          <ul>
            <li>Update your personal information</li>
            <li>Change your password</li>
            <li>View order history</li>
            <li>Save items to your wishlist</li>
            <li>Manage your shipping addresses</li>
          </ul>

          <h3>Password Reset</h3>
          <p>If you've forgotten your password:</p>
          <ol>
            <li>Click "Log in" in the navigation bar</li>
            <li>Click "Forgot Password"</li>
            <li>Enter your email address</li>
            <li>Follow the instructions in the email you receive</li>
          </ol>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: <FaQuestionCircle />,
      content: (
        <div>
          <h3>Frequently Asked Questions</h3>
          
          <div className="faq-item">
            <h4>How do I track my order?</h4>
            <p>You can track your order by logging into your account and visiting the Order History page. You'll receive tracking information via email once your order ships.</p>
          </div>

          <div className="faq-item">
            <h4>Do you ship internationally?</h4>
            <p>Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location.</p>
          </div>

          <div className="faq-item">
            <h4>How do I cancel my order?</h4>
            <p>Orders can be cancelled within 1 hour of placement. Please contact our customer service team immediately for assistance.</p>
          </div>

          <div className="faq-item">
            <h4>What is your coffee freshness guarantee?</h4>
            <p>We guarantee that all our coffee beans are roasted within 7 days of shipping. Each bag is stamped with the roast date.</p>
          </div>

          <div className="faq-item">
            <h4>How should I store my coffee?</h4>
            <p>Store coffee in an airtight container in a cool, dark place. For best results, use within 2 weeks of opening.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="help-container">
      <h1>Help Center</h1>
      <p className="help-intro">Find answers to common questions and learn more about our services.</p>

      <div className="help-sections">
        {helpSections.map((section) => (
          <div key={section.id} className="help-section">
            <button
              className={`help-section-header ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => toggleSection(section.id)}
            >
              <span className="section-icon">{section.icon}</span>
              <h2>{section.title}</h2>
            </button>
            {activeSection === section.id && (
              <div className="help-section-content">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="contact-support">
        <h2>Still Need Help?</h2>
        <p>Our customer service team is here to help you.</p>
        <div className="contact-methods">
          <div className="contact-method">
            <h3>Email Us</h3>
            <p>support@fincan.com</p>
            <p>Response within 24 hours</p>
          </div>
          <div className="contact-method">
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri, 9am-5pm EST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 