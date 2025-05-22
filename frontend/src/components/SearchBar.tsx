import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../contexts/ProductContext";

/* ───────── types ───────── */
interface Product {
  product_id:   number;
  name:         string;
  description:  string;
  price:        string;      // comes as string from backend
  discount?:    number;      // ⇦ NEW: 0 – 1 (undefined or 0 ⇒ no discount)
  stock:        number;
  category_id:  number;
  sku:          string;
}

/* ───────── tiny inline spinner style ───────── */
const spinnerStyles = {
  loadingSpinner: {
    border:       "3px solid #f3f3f3",
    borderTop:    "3px solid #6d4c41",
    borderRadius: "50%",
    width:        20,
    height:       20,
    animation:    "spin 1s linear infinite",
    margin:       "0 auto 10px",
  },
};

const SearchBar: React.FC = () => {
  const { categories } = useProductContext();

  /* ------------------------------------------------ state */
  const [term,    setTerm]    = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  const nav    = useNavigate();
  const refBox = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------ click-outside to close */
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (refBox.current && !refBox.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  /* ------------------------------------------------ search logic */
  const fetchResults = async (query: string, isSubmit = false) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      return;
    }

    /* check for exact category match (submit only) */
    if (isSubmit) {
      const found = categories.find(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (found) {
        nav(`/products?category=${encodeURIComponent(found.name)}`);
        setOpen(false);
        return;
      }
    }

    setLoading(true);
    setOpen(true);
    try {
      const { data } = await axios.get<{ products: Product[] }>(
        `/api/products/search?query=${encodeURIComponent(trimmed)}`
      );

      /* filter out 0-price products */
      const filtered = (data.products ?? []).filter((p) => {
        const price = Number(p.price);
        return isFinite(price) && price > 0;
      });
      setResults(filtered);

      /* auto-navigate if only exact product match on submit */
      if (
        isSubmit &&
        filtered.length === 1 &&
        filtered[0].name.toLowerCase() === trimmed.toLowerCase()
      ) {
        handleResultClick(filtered[0]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------ handlers */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(term, true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTerm(v);
    if (v.trim().length >= 3) {
      const id = setTimeout(() => fetchResults(v), 500);
      return () => clearTimeout(id);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleResultClick = (p: Product) => {
    nav(`/product/${p.product_id}`);
    setOpen(false);
  };

  /* helper: price with discount */
  const renderPrice = (p: Product) => {
    const base  = parseFloat(p.price);
    const disc  = p.discount ?? 0;
    const final = base * (1 - disc);

    return disc > 0 ? (
      <div style={{ textAlign: "right" }}>
        <div style={{ color: "#c92a2a", fontWeight: 700 }}>
          ${final.toFixed(2)}
        </div>
        <div
          style={{
            textDecoration: "line-through",
            fontSize: "12px",
            color: "#888",
          }}
        >
          ${base.toFixed(2)}
        </div>
      </div>
    ) : (
      <div style={{ color: "#6d4c41", fontWeight: "bold" }}>
        ${base.toFixed(2)}
      </div>
    );
  };

  /* ------------------------------------------------ render */
  return (
    <div ref={refBox} style={{ position: "relative" }}>
      {/* search input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: 300,
          position: "relative",
          margin: "0 15px",
        }}
      >
        <input
          type="text"
          placeholder="Search for products…"
          value={term}
          onChange={handleChange}
          onFocus={() => term.trim().length >= 3 && setOpen(true)}
          style={{
            padding: "8px 12px",
            paddingRight: 40,
            borderRadius: 20,
            border: "1px solid #d0d0d0",
            width: "100%",
            fontSize: 14,
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            outline: "none",
            transition: "all 0.3s ease",
          }}
        />
        <button
          type="submit"
          style={{
            position: "absolute",
            right: 5,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: "50%",
            color: "#6d4c41",
          }}
          aria-label="Search"
        >
          <FaSearch size={16} />
        </button>
      </form>

      {/* dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: 5,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            maxHeight: 350,
            overflowY: "auto",
            zIndex: 1000,
            marginTop: 5,
            width: 300,
          }}
        >
          {loading ? (
            <div style={{ padding: 15, textAlign: "center" }}>
              <div style={spinnerStyles.loadingSpinner} />
              <p>Searching…</p>
            </div>
          ) : results.length ? (
            <>
              <div
                style={{
                  padding: 10,
                  borderBottom: "1px solid #eee",
                  fontWeight: "bold",
                }}
              >
                Search Results
              </div>

              {results.map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => handleResultClick(p)}
                  style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  {/* left – name & snippet */}
                  <div>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        marginTop: 3,
                      }}
                    >
                      {p.description.length > 50
                        ? `${p.description.slice(0, 50)}…`
                        : p.description}
                    </div>
                  </div>

                  {/* right – price (with discount support) */}
                  {renderPrice(p)}
                </div>
              ))}
            </>
          ) : (
            <div style={{ padding: 15, textAlign: "center", color: "#666" }}>
              No products found matching “{term}”
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;