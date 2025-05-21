// src/pages/ProductPage.tsx
import React, { useState, useEffect } from "react";
import { useProductContext, Category } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CircularProgress from "@mui/material/CircularProgress";
import "./ProductPage.css";

const ProductPage: React.FC = () => {
  const {
    products,
    categories,
    loading,
    error,
    updateStockAfterPurchase,
  } = useProductContext();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // parse categoryId from URL (0 = All, -1 = Best Sellers, >0 real category_id)
  const params = new URLSearchParams(location.search);
  const initialCatParam = params.get("category");
  const initialCategoryId = (() => {
    if (!initialCatParam) return 0;
    const found = categories.find((c) => c.name === initialCatParam);
    return found ? found.category_id : 0;
  })();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    initialCategoryId
  );
  const [sortMethod, setSortMethod] = useState<
    "default" | "priceAsc" | "priceDesc" | "ratingDesc"
  >("default");

  // sync URL→state
  useEffect(() => {
    const catName = params.get("category");
    const found = categories.find((c) => c.name === catName);
    setSelectedCategoryId(found ? found.category_id : 0);
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

  // filter by selectedCategoryId
  const filtered = products
    .filter((p) => {
      if (selectedCategoryId === 0) return true;              // All
      if (selectedCategoryId === -1) return p.is_best_seller; // Best Sellers
      return p.category_id === selectedCategoryId;            // real category
    })
    // remove any products without a valid numeric price > 0
    .filter((p) => {
      const priceNum = Number(p.price);
      return (
        p.price != null &&
        isFinite(priceNum) &&
        priceNum > 0
      );
    });

  // then sort
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

  // clicking "Add to Cart"
  const handleAdd = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.quantity_in_stock === 0) return;

    const ok = await updateStockAfterPurchase(product.product_id, 1);
    if (!ok) return;

    addToCart({
      id:       product.product_id,
      name:     product.name,
      price:    product.price,
      quantity: 1,
      image:    product.image_url,
    });

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

  const changeCategory = (cat: Category) => {
    setSelectedCategoryId(cat.category_id);
    navigate(`/products?category=${encodeURIComponent(cat.name)}`, {
      replace: true,
    });
  };

  return (
    <div className="product-page">
      <div className="filter-bar">
        <section className="categories">
          <h2>Categories</h2>
          <div className="category-buttons">
            {categories.map((cat) => (
              <button
                key={cat.category_id}
                className={`category-button ${
                  selectedCategoryId === cat.category_id ? "active" : ""
                }`}
                onClick={() => changeCategory(cat)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
        <div className="sort-dropdown">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortMethod}
            onChange={(e) =>
              setSortMethod(e.target.value as any)
            }
          >
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="ratingDesc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      <section className="product-list">
        {sorted.map((product) => (
          <div
            key={product.product_id}
            className={`product-card ${
              product.is_best_seller ? "best-seller-card" : ""
            }`}
            onClick={() =>
              navigate(`/product/${product.product_id}`)
            }
          >
            {product.is_best_seller && (
              <div className="best-seller-badge">Best Seller</div>
            )}

            <div className="product-rating">
              <span>
                {product.rating !== null
                  ? product.rating.toFixed(1)
                  : "N/A"}
              </span>
              <StarIcon fontSize="small" />
            </div>

            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="product-price">
              ${product.price.toFixed(2)}
            </p>

            <button
              className="add-to-cart-button"
              disabled={product.quantity_in_stock === 0}
              onClick={(e) => handleAdd(product, e)}
            >
              {product.quantity_in_stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProductPage;