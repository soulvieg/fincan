import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import NavBar from "./components/NavBar";
import { SiBuymeacoffee } from "react-icons/si";
import ProfileSettings from "./pages/ProfileSettings";
import ShoppingCart from "./pages/ShoppingCart";
import OrderHistory from "./pages/OrderHistory";
import { UserProvider } from "./contexts/UserContext";
import BestSeller from "./components/BestSeller"; // Import BestSeller
import Carousel from "./components/Carousel"; // Import Carousel
import { CartProvider } from "./contexts/CartContext"; // Import CartProvider

const MainStore: React.FC = () => (
  <div className="text-center mt-5">
    <Carousel />
    <BestSeller />
    <Link to="/admin" className="btn btn-outline-dark rounded-border mt-3">
      Go to Admin Panel
    </Link>
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
        className="btn btn-outline-dark btn-lg departments-custom-outline rounded-border"
      >
        Product Management
      </Link>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <UserProvider>
      <CartProvider>
        <div className="d-flex flex-column vh-100">
          <NavBar />
          <div className="container flex-grow-1 d-flex flex-column justify-content-start align-items-center py-4 pt-5">
            <div className="w-100 mt-5">
              <Routes>
                <Route path="/" element={<MainStore />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/sales" element={<SalesManagement />} />
                <Route
                  path="/admin/inventory"
                  element={<ProductManagement />}
                />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/shoppingcart" element={<ShoppingCart />} />
                <Route path="/order-history" element={<OrderHistory />} />
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
      </CartProvider>
    </UserProvider>
  );
};

export default App;
