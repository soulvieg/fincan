import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductManagement from './pages/ProductManagement';
import SalesManagement from './pages/SalesManagement';
import NavBar from './components/NavBar'; // Adjust the path as needed
import { SiBuymeacoffee } from "react-icons/si";

const MainStore: React.FC = () => (
    <div className="text-center mt-5">
        <h1>Fincan Store</h1>
        <p className="lead">Welcome to our online shop</p>
        <p>This is the main store page (to be implemented)</p>
        <Link to="/admin" className="btn btn-outline-dark">Go to Admin Panel</Link>
    </div>
);

const AdminHome: React.FC = () => (
    <div className="text-center mt-5">
        <SiBuymeacoffee size={140} color="#6d4c41" className="mb-3"/>
        <h3 className="mb-2">Welcome!</h3>
        <h4 className="mb-5">Please navigate to your department</h4>
        <div className="d-flex justify-content-center">
            <Link to="/admin/sales" className="btn btn-outline-dark btn-lg me-3 departments-custom-outline">Sales
                Management</Link>
            <Link to="/admin/inventory" className="btn btn-outline-dark btn-lg departments-custom-outline">Product
                Management</Link>
        </div>
    </div>
);

const App: React.FC = () => {
    return (
        <div className="d-flex flex-column vh-100">
            <NavBar />

            <div className="container flex-grow-1 d-flex flex-column justify-content-start align-items-center py-4 pt-5">
                <div className="w-100 mt-5">
                    <Routes>
                        <Route path="/" element={<MainStore />} />

                        <Route path="/admin" element={<AdminHome />} />
                        <Route path="/admin/sales" element={<SalesManagement />} />
                        <Route path="/admin/inventory" element={<ProductManagement />} />

                        <Route path="/sales" element={<Navigate to="/admin/sales" replace />} />
                        <Route path="/inventory" element={<Navigate to="/admin/inventory" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;