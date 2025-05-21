// src/components/SearchBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category_id: number;
  sku: string;
}

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
  const { categories } = useProductContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // click outside to close
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      // check for exact category match on submit
      if (e.type === "submit") {
        const lower = trimmed.toLowerCase();
        const foundCat = categories.find(
          (c) => c.name.toLowerCase() === lower
        );
        if (foundCat) {
          navigate(
            `/products?category=${encodeURIComponent(foundCat.name)}`
          );
          setShowResults(false);
          return;
        }
      }

      const { data } = await axios.get<{
        products: Product[];
      }>(
        `/api/products/search?query=${encodeURIComponent(trimmed)}`
      );

      if (data.products) {
        // filter out zero‐price items
        const filtered = data.products.filter((p) => {
          const price = Number(p.price);
          return isFinite(price) && price > 0;
        });
        setSearchResults(filtered);

        // if exactly one result and exact name match on submit, go straight to product
        if (
          e.type === "submit" &&
          filtered.length === 1 &&
          filtered[0].name.toLowerCase() === trimmed.toLowerCase()
        ) {
          handleResultClick(filtered[0]);
          return;
        }
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length >= 3) {
      const timer = setTimeout(() => {
        // fake submit event
        handleSearch({ preventDefault: () => {}, type: "input" } as any);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (product: Product) => {
    navigate(`/product/${product.product_id}`);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} style={{ position: "relative" }}>
      <form
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
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() =>
            searchTerm.trim().length >= 3 && setShowResults(true)
          }
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
            padding: "6px",
            borderRadius: "50%",
            color: "#6d4c41",
            transition: "background-color 0.2s ease",
          }}
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
              {searchResults.map((prod) => (
                <div
                  key={prod.product_id}
                  onClick={() => handleResultClick(prod)}
                  style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{prod.name}</div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "3px",
                      }}
                    >
                      {prod.description.length > 50
                        ? `${prod.description.slice(0, 50)}…`
                        : prod.description}
                    </div>
                  </div>
                  <div style={{ color: "#6d4c41", fontWeight: "bold" }}>
                    ${parseFloat(prod.price).toFixed(2)}
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