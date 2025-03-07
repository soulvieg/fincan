import React from "react";
import "../styles/CustomerHeader.css";

const CustomerHeader: React.FC = () => {
  return (
    <header className="main-header">
      <h1 className="title">
        <span className="emoji">☕</span>Fincan
      </h1>
      <nav>
        <a class="ShoppingCart" href="ShoppingCart.html">
          🛒
        </a>
        <div class="profile-container">
          <a href="profile.html" class="profile">
            👤
          </a>
        </div>
      </nav>

      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-button">Find</button>
      </div>
    </header>
  );
};

export default CustomerHeader;
