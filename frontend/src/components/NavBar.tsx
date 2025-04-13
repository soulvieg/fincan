import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import { useUser } from "../contexts/UserContext"; // Import user context

const NavBar: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");
  const { user, logout } = useUser(); // Access user context

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#6d4c41", outline: "1px solid #666" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link
            className="navbar-brand brand-logo"
            to={isAdminPage ? "/admin" : "/"}
            style={{ color: "#f5f0e6", fontSize: '35px',fontFamily: '"The Seasons", serif' }}
          >
            Fincan
            {isAdminPage && (
              <MdOutlineAdminPanelSettings
                size={22}
                style={{ marginTop: "14px", marginLeft: "-2px" }}
              />
            )}
          </Link>
          <Link
            to="/products"
            className="ms-3"
            style={{
              color: "#f5f0e6",
              textDecoration: "none",
              fontSize: "1rem",
              border: "1px solid #f5f0e6",
              borderRadius: "14px",
              padding: "6px 12px",
            }}
          >
            Products
          </Link>
        </div>

        {!isAdminPage ? (
          <>
            <div className="d-flex justify-content-end flex-grow-1">
              <SearchBar />
            </div>

            <Link
              to="/shoppingCart"
              className="btn btn-link"
              style={{
                color: "#f5f0e6",
                border: "none",
              }}
            >
              <RiShoppingCart2Fill size={34} />
            </Link>

            {user ? (
              // If user is logged in, show profile dropdown
              <ProfileDropdown
                menuItems={[
                  { label: "Profile", href: "/profile-settings" },
                  { label: "Orders", href: "/order-history" },
                  { label: "Settings", href: "/settings" },
                  {
                    label: "Sign Out",
                    href: "/",
                    onClick: () => logout(), // Call logout function
                  },
                ]}
              />
            ) : (
              // If user is not logged in, show log in button
              <Link
                to="/login-user"
                className="btn btn-outline-dark ms-3"
                style={{ borderRadius: "10px" }}
              >
                Log in
              </Link>
            )}
          </>
        ) : (
          <>
            <Link
              to="/"
              className="btn"
              style={{
                color: "#6d4c41",
                border: "1px solid #f5f0e6",
                borderRadius: "14px",
                padding: "6px 12px",
              }}
              onClick={() => logout()} // Log out when clicking sign out
            >
              Sign Out{" "}
              <IoLogOutOutline
                size={20}
                style={{ marginLeft: "0px", marginBottom: "2px" }}
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

