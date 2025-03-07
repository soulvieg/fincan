import React from "react";
import "../styles/AnonymousHeader.css";

const MainHeader: React.FC = () => {
  return (
    <header className="main-header">
      <h1 className="title">
        <span className="emoji">☕</span>Fincan
      </h1>
      <nav>
        <a class="ShoppingCart" href="ShoppingCart.html">
          🛒
        </a>
        <a href="login.html" className="login-button">
          Please log in
        </a>
      </nav>

      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-button">Find</button>
      </div>
    </header>
  );
};

export default MainHeader;
