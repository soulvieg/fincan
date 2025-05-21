import React from "react";
import { useCart } from "../contexts/CartContext";
import { useProductContext } from "../contexts/ProductContext";
import "../styles/BestSeller.css";

const BestSeller: React.FC = () => {
  const { addToCart } = useCart();
  const { getBestSellers } = useProductContext();
  const bestSellers = getBestSellers();

  return (
    <div className="best-seller-container">
      <h4 className="best-seller-title">This Month's Best Sellers</h4>
      <div className="best-seller">
        <div className="bs-items">
          {bestSellers.map((item) => (
            <div className="bs-item" key={item.product_id}>
              <div className="bs-item-image-container">
                <img src={item.image_url} alt={item.name} />
                <div className="bs-item-overlay">
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.product_id,
                        name: item.name,
                        price: item.price,
                        image: item.image_url,
                        quantity: 1,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="bs-item-details">
                <h3 className="bs-item-name">{item.name}</h3>
                <p className="bs-item-price">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
