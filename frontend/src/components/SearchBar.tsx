import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/api/products/search?query=${encodeURIComponent(searchTerm)}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setResults(data.products);
      setError(null); // clear previous errors
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <form
        className="search-container"
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          marginBottom: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 15px",
            paddingRight: "40px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            width: "100%",
            fontSize: "16px",
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            position: "absolute",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6d4c41",
          }}
          aria-label="Search"
        >
          <FaSearch size={18} />
        </button>
      </form>

      {/* Error Message */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {results.map((product) => (
              <li key={product.product_id} style={{ padding: "10px 0", borderBottom: "1px solid #ddd" }}>
                <strong>{product.name}</strong> - ${product.price}
                <br />
                <small>{product.description}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;



