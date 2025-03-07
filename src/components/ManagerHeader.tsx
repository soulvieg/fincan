import React from "react";
import "../styles/ManagerHeader.css";

const ManagerHeader: React.FC = () => {
  return (
    <header className="main-header">
      <h1 className="title">
        <span className="emoji">☕</span>Fincan
      </h1>
      <nav>
        <a class="ShoppingCart" href="ShoppingCart.html">
          🛒
        </a>
        <a href="admin-panel.html" className="admin-panel">
          Go to Admin Panel
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

export default ManagerHeader;
