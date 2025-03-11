import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const NavBar: React.FC = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.includes('/admin');

    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#fff0e2', outline: '1px solid #666' }}>
            <div className="container-fluid d-flex justify-content-between">
                <Link className="navbar-brand brand-logo" to="/" style={{ color: '#6d4c41'}}>
                    Fincan
                    {isAdminPage && <MdOutlineAdminPanelSettings size={22} style={{marginTop: '14px', marginLeft: '-2px'}}/>}
                </Link>
                <Link className="navbar-brand brand-logo" to="/">
                    <div className="d-flex align-items-center">
                    {isAdminPage && <span style={{ fontSize: '1rem', fontWeight: 400, marginRight: '-5px', marginTop: '14px'}}>Sign Out</span>}
                    {isAdminPage && <IoLogOutOutline size={22} style={{marginTop: '14px', marginLeft: '10px'}}/>}
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;