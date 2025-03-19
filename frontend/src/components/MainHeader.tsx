import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Assuming you have a UserContext for shared state
import "../styles/MainHeader.css";

const MainHeader: React.FC = () => {
  const { user } = useUser(); // Fetch user from context
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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

          {/* Show "Please log in" only if no user is logged in */}
          {!user && (
            <Link to="/login-user" className="login-button">
              Please log in
            </Link>
          )}

          {/* Show profile button only if a user is logged in */}
          {user && (
            <div className="profile-container">
              <button className="profile" onClick={toggleDropdown}>
                👤
              </button>
              {showDropdown && (
                <div className="profile-dropdown">
                  <p>
                    <strong>Name:</strong> {user.name} {user.surname}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <button onClick={() => navigate("/profile-settings")}>
                    Go to Settings
                  </button>
                  <button>Log Out</button>
                </div>
              )}
            </div>
          )}
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
