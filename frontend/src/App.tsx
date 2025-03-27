import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProductManagement from "./pages/ProductManagement";
import SalesManagement from "./pages/SalesManagement";
import LoginUser from "./pages/LoginUser";
import SignupUser from "./pages/SignupUser";
import NavBar from "./components/NavBar";
import ShoppingCart from "./pages/ShoppingCart";
import ProfileSettings from "./pages/ProfileSettings";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import OrderHistory from "./pages/OrderHistory";
import { SiBuymeacoffee } from "react-icons/si";
import Carousel from "./components/Carousel";
import BestSeller from "./components/BestSeller";
import { OrderProvider } from "./contexts/OrderContext";

const MainStore: React.FC = () => (
  <div className="text-center mt-5">
    <Link to="/admin" className="btn btn-outline-dark rounded-border">
      Go to Admin Panel
    </Link>
    <Carousel />
    <BestSeller />
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
  //uncomment to delete local storage, for reseting order hitories
  // useEffect(() => {
  //  localStorage.clear(); // This clears ALL localStorage for your domain
  //}, []);
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
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
                  <Route path="/login-user" element={<LoginUser />} />
                  <Route path="/signup-user" element={<SignupUser />} />
                  <Route
                    path="/profile-settings"
                    element={<ProfileSettings />}
                  />

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
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
