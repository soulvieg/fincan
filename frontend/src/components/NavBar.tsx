import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";

const NavBar: React.FC = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.includes('/admin');

    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#fff0e2', outline: '1px solid #666' }}>
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <Link className="navbar-brand brand-logo" to={isAdminPage ? "/admin" : "/"} style={{ color: '#6d4c41'}}>
                    Fincan
                    {isAdminPage && <MdOutlineAdminPanelSettings size={22} style={{marginTop: '14px', marginLeft: '-2px'}}/>}
                </Link>
                {!isAdminPage ? (
                    <>
                        <div className="d-flex justify-content-end flex-grow-1">
                            <SearchBar />
                        </div>
                        <Link
                            to="/shoppingCart"
                            className="btn btn-link"
                            style={{
                                color: '#6d4c41',
                                border: 'none',
                            }}
                        >
                            <RiShoppingCart2Fill size={34} />
                        </Link>
                        <ProfileDropdown
                            menuItems={[
                                { label: 'Profile', href: '/profile-settings' },
                                { label: 'Orders', href: '/order-history' },
                                { label: 'Settings', href: '/settings' },
                                { label: 'Sign Out', href: '/', onClick: () => console.log('Sign Out clicked') }
                            ]}
                        />
                    </>
                ) : (
                    <>
                        <Link
                            to="/"
                            className="btn"
                            style={{
                                color: '#6d4c41',
                                border: '1px solid #6d4c41',
                                borderRadius: '14px',
                                padding: '6px 12px'
                            }}
                            onClick={() => console.log('Admin Sign Out clicked')}
                        >
                            Sign Out <IoLogOutOutline size={20} style={{ marginLeft: '0px', marginBottom: '2px' }} />
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;