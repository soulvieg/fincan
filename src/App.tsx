import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnonymousPage from "./pages/AnonymousPage";
import CustomerPage from "./pages/CustomerPage";
import ManagerPage from "./pages/ManagerPage";
import ShoppingCart from "./components/ShoppingCart";
import ProfileSettings from "./pages/ProfileSettings";
import { CartProvider } from "./components/CartContext";
import { UserProvider } from "./components/UserContext"; // Import UserProvider

import "./styles/App.css";

function SwitchBetween() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap the app with UserProvider */}
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AnonymousPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/manager" element={<ManagerPage />} />
            <Route path="/shopping-cart" element={<ShoppingCart />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
          </Routes>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default SwitchBetween;
