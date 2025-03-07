import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnonymousPage from "./pages/AnonymousPage";
import CustomerPage from "./pages/CustomerPage";
import ManagerPage from "./pages/ManagerPage";

function SwitchBetween() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnonymousPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </Router>
  );
}

export default SwitchBetween;
