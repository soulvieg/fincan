import React from "react";
import { useCart } from "../contexts/CartContext";
import { useProductContext } from "../contexts/ProductContext";
import "../styles/BestSeller.css";

const BestSeller: React.FC = () => {
  const { addToCart } = useCart();
  const { getBestSellers } = useProductContext();
  const bestSellers = getBestSellers();

  return (
    <div className="best-seller">
      <div className="bs-desc">This month's best sellers:</div>
      <div className="bs-items">
        {bestSellers.map((item) => (
          <div className="bs-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <p className="bs-caption">
              {item.name} - ${item.price}
            </p>
            <button
              onClick={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
