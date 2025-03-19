import React from "react";
import { Link } from "react-router-dom";
import "../styles/AnonymousHeader.css";

const MainHeader: React.FC = () => {
  return (
    <header className="main-header">
      <h1 className="title">
        <span className="emoji">☕</span>Fincan
      </h1>
      <div className="header-right">
        <nav>
          <Link className="ShoppingCart" to="/shopping-cart">
            🛒
          </Link>
          <a href="login.html" className="login-button">
            Please log in
          </a>
        </nav>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-button">Find</button>
      </div>
    </header>
  );
};

export default MainHeader;
