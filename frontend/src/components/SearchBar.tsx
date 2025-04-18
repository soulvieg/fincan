import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category_id: number;
  sku: string;
}

const categoryMap: { [key: number]: string } = {
  1: "Coffee Beans",
  2: "Accessories",
  3: "Tea",
  4: "Best Sellers",
};

const spinnerStyles = {
  loadingSpinner: {
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #6d4c41",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 10px",
  },
};

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      if (e.type === "submit") {
        const lowerSearchTerm = trimmedSearchTerm.toLowerCase();

        const matchingCategory = Object.entries(categoryMap).find(
          ([id, name]) => name.toLowerCase() === lowerSearchTerm
        );

        if (matchingCategory) {
          navigate(
            `/products?category=${encodeURIComponent(matchingCategory[1])}`
          );
          setShowResults(false);
          return;
        }
      }

      const response = await axios.get(
        `http://localhost:5001/api/products/search?query=${encodeURIComponent(
          trimmedSearchTerm
        )}`
      );

      if (response.data && response.data.products) {
        setSearchResults(response.data.products);

        if (
          e.type === "submit" &&
          response.data.products.length === 1 &&
          response.data.products[0].name.toLowerCase() ===
            trimmedSearchTerm.toLowerCase()
        ) {
          handleResultClick(response.data.products[0]);
          return;
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length >= 3) {
      const debounceTimer = setTimeout(() => {
        const fakeEvent = {
          preventDefault: () => {},
          type: "input",
        } as React.FormEvent;
        handleSearch(fakeEvent);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (product: Product) => {
    if (!product.product_id) return;

    navigate(`/product/${product.product_id}`);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} style={{ position: "relative" }}>
      <form
        className="search-container"
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "300px",
          position: "relative",
          margin: "0 15px",
        }}
      >
        <input
          type="text"
          placeholder="Search for coffee, mugs..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim() && setShowResults(true)}
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
            transition: "all 0.3s ease",
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
            transition: "background-color 0.2s ease",
          }}
          className="search-button"
          aria-label="Search"
        >
          <FaSearch size={16} />
        </button>
      </form>
      {showResults && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            maxHeight: "350px",
            overflowY: "auto",
            zIndex: 1000,
            marginTop: "5px",
            width: "300px",
          }}
        >
          {isLoading ? (
            <div style={{ padding: "15px", textAlign: "center" }}>
              <div style={spinnerStyles.loadingSpinner}></div>
              <p>Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  fontWeight: "bold",
                }}
              >
                Search Results
              </div>
              {searchResults.map((product) => (
                <div
                  key={product.product_id}
                  style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onClick={() => handleResultClick(product)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>{product.name}</div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "3px",
                      }}
                    >
                      {product.description.length > 50
                        ? `${product.description.substring(0, 50)}...`
                        : product.description}
                    </div>
                  </div>
                  <div style={{ color: "#6d4c41", fontWeight: "bold" }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              style={{ padding: "15px", textAlign: "center", color: "#666" }}
            >
              No products found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
