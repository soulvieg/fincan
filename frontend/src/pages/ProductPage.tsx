// src/pages/ProductPage.tsx
import React, { useState, useEffect } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import "./ProductPage.css";

const ProductPage: React.FC = () => {
  const { products } = useProductContext();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "All",
    "Best Sellers",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const params = new URLSearchParams(location.search);
  const initial = params.get("category") ?? "All";
  const [selectedCategory, setSelectedCategory] = useState(initial);

  useEffect(() => {
    const q = params.get("category");
    if (q && categories.includes(q)) setSelectedCategory(q);
  }, [location.search, categories]);

  const filtered =
    selectedCategory === "All"
      ? products
      : selectedCategory === "Best Sellers"
      ? products.filter((p) => p.is_best_seller)
      : products.filter((p) => p.category === selectedCategory);

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id:       product.product_id,
      name:     product.name,
      price:    product.price,
      quantity: 1,
      image:    product.image_url,
    });
    // …your notification UI…
  };

  return (
    <div className="product-page">
      <section className="categories">
        <h2>Categories</h2>
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-button ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(cat);
                navigate(`/products?category=${encodeURIComponent(cat)}`, {
                  replace: true,
                });
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="product-list">
        {filtered.map((product) => (
          <div
            key={product.product_id}
            className={`product-card ${
              product.is_best_seller ? "best-seller-card" : ""
            }`}
            onClick={() => navigate(`/product/${product.product_id}`)}
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
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button
              className="add-to-cart-button"
              onClick={(e) => handleAdd(product, e)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProductPage;