import React from "react";
import { Link } from "react-router-dom";
import { SiBuymeacoffee } from "react-icons/si";

const AdminHome: React.FC = () => (
  <div className="admin-home text-center mt-5">
    <SiBuymeacoffee size={140} color="#6d4c41" className="mb-3" />
    <h3 className="mb-2">Welcome!</h3>
    <h4 className="mb-5">Please navigate to your department</h4>
    <div className="d-flex justify-content-center">
      <Link
        to="/admin/sales"
        className="btn btn-outline-dark btn-lg me-3 departments-custom-outline"
      >
        Sales Management
      </Link>
      <Link
        to="/admin/inventory"
        className="btn btn-outline-dark btn-lg departments-custom-outline"
      >
        Product Management
      </Link>
    </div>
  </div>
);

export default AdminHome;
