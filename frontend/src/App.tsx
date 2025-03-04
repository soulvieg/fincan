import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import ProductManagement from './pages/ProductManagement';
import {SiBuymeacoffee} from "react-icons/si";


const Home: React.FC = () => (
    <div className="text-center mt-5">
        <SiBuymeacoffee size={100} color="black" className="mb-3" />
        <h3 className="mb-2">Welcome!</h3>
        <h4 className="mb-5">Please navigate to your department</h4>
        <div className="d-flex justify-content-center">
            <Link to="/sales" className="btn btn-outline-dark btn-lg me-3">Sales Management</Link>
            <Link to="/inventory" className="btn btn-outline-dark btn-lg">Product Management</Link>
        </div>
    </div>
);

const SalesManagement: React.FC = () => (
    <div className="text-center mt-5" >
        <h2>Nothing to see here (yet)!</h2>
    </div>
);

const App: React.FC = () => {
    return (
        <div className="d-flex flex-column vh-100">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid d-flex justify-content-center">
                    <Link className="navbar-brand brand-logo" to="/">Fincan</Link>
                </div>
            </nav>

            <div className="container flex-grow-1 d-flex flex-column justify-content-start align-items-center py-4 pt-5">
                <div className="w-100 mt-5">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sales" element={<SalesManagement />} />
                        <Route path="/inventory" element={<ProductManagement />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;