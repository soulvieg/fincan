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
    "Best Sellers", // Add a Best Sellers category
    ...Array.from(new Set(products.map((product) => product.category))),
  ];
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFromQuery && categories.includes(categoryFromQuery)
      ? categoryFromQuery
      : "All"
  );

  useEffect(() => {
    if (categoryFromQuery && categories.includes(categoryFromQuery)) {
      setSelectedCategory(categoryFromQuery);
    }
  }, [location.search, categories, categoryFromQuery]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : selectedCategory === "Best Sellers"
      ? products.filter((product) => product.isBestSeller)
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (
    product: any,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    addToCart(cartItem);
    const notification = document.createElement("div");
    notification.className = "add-to-cart-notification";
    notification.textContent = `${product.name} added to cart!`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }, 10);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    navigate(`/products?category=${encodeURIComponent(category)}`, {
      replace: true,
    });
  };

  return (
    <div className="product-page">
      <section className="categories">
        <h2>Categories</h2>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
      <section className="product-list">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`product-card ${
              product.isBestSeller ? "best-seller-card" : ""
            }`}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.isBestSeller && (
              <div className="best-seller-badge">Best Seller</div>
            )}
            <div className="product-rating">
              <span>{product.rating?.toFixed(1) || "N/A"}</span>
              <StarIcon fontSize="small" />
            </div>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="product-price">
              ${product.price?.toFixed(2) || "0.00"}
            </p>
            <button
              className="add-to-cart-button"
              onClick={(e) => handleAddToCart(product, e)}
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
