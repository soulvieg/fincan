import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
    menuItems: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
        icon?: React.ReactNode;
    }>;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
                                                             menuItems,
                                                         }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            <button
                className="profile-dropdown-toggle"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <FaUserCircle className="profile-avatar-icon" size={36} />
                <svg
                    className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2.5 4.5L6 8L9.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="profile-dropdown-menu"
                    aria-labelledby="profile-dropdown-toggle"
                >
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.href ? (
                                <Link
                                    to={item.href}
                                    className="dropdown-item"
                                    onClick={() => {
                                        if (item.onClick) item.onClick();
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        if (item.onClick) item.onClick();
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                                    {item.label}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;