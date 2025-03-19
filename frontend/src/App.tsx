import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AdminHome from "./pages/AdminHome";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import LoginUser from "./pages/LoginUser";
import SignupUser from "./pages/SignupUser";
import NavBar from "./components/NavBar";
import MainPage from "./pages/MainPage";
import ShoppingCart from "./pages/ShoppingCart";
import ProfileSettings from "./pages/ProfileSettings";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import OrderHistory from "./pages/OrderHistory";

const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  // Add/remove admin-page class to body

  return (
    <UserProvider>
      <CartProvider>
        {/* Show NavBar only on admin routes */}
        {isAdminRoute && <NavBar />}

        <Routes>
          {/* Main store routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/signup-user" element={<SignupUser />} />
          <Route path="/order-history" element={<OrderHistory />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/sales" element={<SalesManagement />} />
          <Route path="/admin/inventory" element={<ProductManagement />} />

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

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
