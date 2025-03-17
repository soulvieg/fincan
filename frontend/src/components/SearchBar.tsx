import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";


const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchTerm);
    };

    return (
        <form
            className="search-container"
            onSubmit={handleSearch}
            style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "300px",
                position: "relative",
                margin: "0 15px"
            }}
        >
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: "8px 12px",
                    paddingRight: "40px",
                    borderRadius: "20px",
                    border: "1px solid #d0d0d0",
                    width: "100%",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    outline: "none",
                    transition: "all 0.3s ease"
                }}
                className="search-input"
            />
            <button
                type="submit"
                style={{
                    position: "absolute",
                    right: "5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                    borderRadius: "50%",
                    color: "#6d4c41",
                    transition: "background-color 0.2s ease"
                }}
                className="search-button"
                aria-label="Search"
            >
                <FaSearch size={16} />
            </button>
        </form>
    );
};

export default SearchBar;