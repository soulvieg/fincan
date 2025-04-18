import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineAdminPanelSettings, MdHome } from "react-icons/md";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import { useUser } from "../contexts/UserContext"; // Import user context
import { useCart } from "../contexts/CartContext"; // Import useCart

const NavBar: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");
  const { user, logout } = useUser(); // Access user context
  const { cart } = useCart(); // Get cart from context

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            style={{
              color: "#f5f0e6",
              fontSize: "35px",
              fontFamily: '"The Seasons", serif',
            }}
          >
            Fincan
            {isAdminPage && (
              <MdOutlineAdminPanelSettings
                size={22}
                style={{ marginTop: "14px", marginLeft: "-2px" }}
              />
            )}
          </Link>
        </div>

        {!isAdminPage && (
          <div className="d-flex justify-content-end flex-grow-1 me-5" style={{ marginLeft: "20rem" }}>
            <Link
              to="/"
              className="mx-3 d-flex align-items-center"
              style={{
                color: "#f5f0e6",
                textDecoration: "none",
                fontSize: "1rem",
                textTransform: "uppercase",
                lineHeight: "1",
                display: "flex",
                alignItems: "center",
                gap: "2px"
              }}
            >
              <MdHome size={20} className="me-0" style={{ marginRight: "-2px", marginBottom: "2px" }} />
              Home
            </Link>
            <Link
              to="/products"
              className="mx-3"
              style={{
                color: "#f5f0e6",
                textDecoration: "none",
                fontSize: "1rem",
                textTransform: "uppercase",
              }}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="mx-3"
              style={{
                color: "#f5f0e6",
                textDecoration: "none",
                fontSize: "1rem",
                textTransform: "uppercase",
              }}
            >
              About Us
            </Link>
          </div>
        )}

        {!isAdminPage ? (
          <>
            <div className="d-flex justify-content-end flex-grow-1">
              <SearchBar />
            </div>

            <Link
              to="/shoppingCart"
              className="btn btn-link position-relative"
              style={{
                color: "#f5f0e6",
                border: "none",
                padding: "0.5rem",
              }}
            >
              <RiShoppingCart2Fill size={34} />
              {totalItems > 0 && (
                <span
                  className="position-absolute badge rounded-pill"
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    right: "-5px",
                    minWidth: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#3a655e",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <ProfileDropdown
                menuItems={[
                  { label: "Profile", href: "/profile-settings" },
                  { label: "Orders", href: "/order-history" },
                  { label: "Wishlist", href: "/wishlist" }, // from first version
                  {
                    label: "Sign Out",
                    href: "/",
                    onClick: () => logout(),
                  },
                ]}
              />
            ) : (
              <Link
                to="/login-user"
                className="btn btn-outline-light ms-3"
                style={{
                  borderRadius: "10px",
                  color: "#f5f0e6",
                  borderColor: "#f5f0e6",
                }}
              >
                Log in
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/"
            className="btn"
            style={{
              color: "#f5f0e6",
              border: "1px solid #f5f0e6",
              borderRadius: "14px",
              padding: "6px 12px",
            }}
            onClick={() => logout()}
          >
            Sign Out{" "}
            <IoLogOutOutline
              size={20}
              style={{ marginLeft: "0px", marginBottom: "2px" }}
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
