import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Pages
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import UserManagement from "./pages/UserManagement";
import LoginUser from "./pages/LoginUser";
import SignupUser from "./pages/SignupUser";
import OrderHistory from "./pages/OrderHistory";
import Wishlists from "./pages/Wishlist";
import ShoppingCart from "./pages/ShoppingCart";
import ProfileSettings from "./pages/ProfileSettings";
import ProductsPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutUs from "./components/AboutUs";

// Contexts
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import { ProductProvider } from "./contexts/ProductContext";
import { OrderProvider } from "./contexts/OrderContext";
import { WishlistProvider } from "./contexts/WishlistContext";

// Components
import Carousel from "./components/Carousel";
import BestSeller from "./components/BestSeller";
import NavBar from "./components/NavBar";

// Icons
import { SiBuymeacoffee } from "react-icons/si";
import { BsEnvelope, BsQuestionCircle } from "react-icons/bs";

const MainStore: React.FC = () => (
  <div className="d-flex flex-column min-vh-100">
    <div className="flex-grow-1">
      <Carousel />
      <BestSeller />
    </div>
    <div className="mt-auto py-4 border-top">
      <div className="container d-flex justify-content-center gap-2">
        <Link to="/contact" className="text-decoration-underline text-dark d-flex align-items-center gap-1">
          Contact
        </Link>
        <Link to="/help" className="text-decoration-underline text-dark d-flex align-items-center gap-1">
          Help
        </Link>
        <Link to="/legal" className="text-decoration-underline text-dark">
          Legal
        </Link>
        <Link to="/admin" className="text-decoration-underline text-dark">
          Admin Panel
        </Link>
      </div>
    </div>
  </div>
);

const AdminHome: React.FC = () => (
  <div className="text-center mt-5">
    <SiBuymeacoffee size={140} color="#6d4c41" className="mb-3" />
    <h3 className="mb-2">Welcome!</h3>
    <h4 className="mb-5">Please navigate to your department</h4>
    <div className="d-flex justify-content-center">
      <Link
        to="/admin/sales"
        className="btn btn-outline-dark btn-lg me-3 departments-custom-outline rounded-border"
      >
        Sales Management
      </Link>
      <Link
        to="/admin/inventory"
        className="btn btn-outline-dark btn-lg me-3 departments-custom-outline rounded-border"
      >
        Product Management
      </Link>
      <Link
        to="/admin/users"
        className="btn btn-outline-dark btn-lg departments-custom-outline rounded-border"
      >
        User Management
      </Link>
    </div>
  </div>
);

const App: React.FC = () => {
  // Uncomment to clear local storage (e.g., for resetting order histories)
  // useEffect(() => {
  //   localStorage.clear(); // This clears ALL localStorage for your domain
  // }, []);

  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          <ProductProvider>
            <WishlistProvider>
              <div className="d-flex flex-column vh-100">
                <NavBar />
                <div className="container flex-grow-1 d-flex flex-column justify-content-start align-items-center py-4 pt-5">
                  <div className="w-100 mt-5">
                    <Routes>
                      {/* Public/Main Routes */}
                      <Route path="/" element={<MainStore />} />
                      <Route path="/login-user" element={<LoginUser />} />
                      <Route path="/signup-user" element={<SignupUser />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route
                        path="/profile-settings"
                        element={<ProfileSettings />}
                      />
                      <Route path="/shoppingcart" element={<ShoppingCart />} />
                      <Route path="/order-history" element={<OrderHistory />} />
                      <Route path="/wishlist" element={<Wishlists />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route
                        path="/product/:id"
                        element={<ProductDetailPage />}
                      />

                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminHome />} />
                      <Route path="/admin/sales" element={<SalesManagement />} />
                      <Route
                        path="/admin/inventory"
                        element={<ProductManagement />}
                      />
                      <Route path="/admin/users" element={<UserManagement />} />

                      {/* Redirects */}
                      <Route
                        path="/sales"
                        element={<Navigate to="/admin/sales" replace />}
                      />
                      <Route
                        path="/inventory"
                        element={<Navigate to="/admin/inventory" replace />}
                      />
                      <Route
                        path="/adding-product"
                        element={<Navigate to="/admin/adding-product" replace />}
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            </WishlistProvider>
          </ProductProvider>
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;