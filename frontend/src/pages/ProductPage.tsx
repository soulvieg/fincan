// src/pages/ProductPage.tsx
import React, { useState, useEffect } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CircularProgress from "@mui/material/CircularProgress";
import "./ProductPage.css";

const ProductPage: React.FC = () => {
  const { products, categories, loading, error } = useProductContext();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Read category query-param
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") ?? "All";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // Sorting state
  const [sortMethod, setSortMethod] = useState<"default" | "priceAsc" | "priceDesc" | "ratingDesc">("default");

  // Keep selectedCategory in sync with URL
  useEffect(() => {
    const q = params.get("category");
    if (q && categories.includes(q)) setSelectedCategory(q);
  }, [location.search, categories]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
        <p>Loading products…</p>
      </div>
    );
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Filter by category
  const filtered = products.filter((p) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Best Sellers") return p.is_best_seller;
    return p.category === selectedCategory;
  });

  // Sort filtered
  const sorted = [...filtered].sort((a, b) => {
    switch (sortMethod) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "ratingDesc":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.quantity_in_stock === 0) return;
    addToCart({
      id:       product.product_id,
      name:     product.name,
      price:    product.price,
      quantity: 1,
      image:    product.image_url,
    });
    // notification UI
    const note = document.createElement("div");
    note.className = "add-to-cart-notification";
    note.textContent = `${product.name} added to cart!`;
    document.body.appendChild(note);
    setTimeout(() => {
      note.classList.add("show");
      setTimeout(() => {
        note.classList.remove("show");
        setTimeout(() => document.body.removeChild(note), 300);
      }, 2000);
    }, 10);
  };

  const changeCategory = (cat: string) => {
    setSelectedCategory(cat);
    navigate(`/products?category=${encodeURIComponent(cat)}`, { replace: true });
  };

  return (
    <div className="product-page">
      <div className="filter-bar">
        {/* Categories */}
        <section className="categories">
          <h2>Categories</h2>
          <div className="category-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-button ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => changeCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Sort dropdown */}
        <div className="sort-dropdown">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value as any)}
          >
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="ratingDesc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      <section className="product-list">
        {sorted.map((product) => (
          <div
            key={product.product_id}
            className={`product-card ${product.is_best_seller ? "best-seller-card" : ""}`}
            onClick={() => navigate(`/product/${product.product_id}`)}
          >
            {product.is_best_seller && <div className="best-seller-badge">Best Seller</div>}

            <div className="product-rating">
              <span>{product.rating !== null ? product.rating.toFixed(1) : "N/A"}</span>
              <StarIcon fontSize="small" />
            </div>

            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>

            <button
              className="add-to-cart-button"
              disabled={product.quantity_in_stock === 0}
              onClick={(e) => handleAdd(product, e)}
            >
              {product.quantity_in_stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProductPage;