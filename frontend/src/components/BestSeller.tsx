import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import "../styles/BestSeller.css";

interface BestSellerItem {
  id: number;
  name: string; // Change title to name
  image: string;
  price: number;
}

const BestSeller: React.FC = () => {
  const { addToCart } = useCart();
  const [bestSellers, setBestSellers] = useState<BestSellerItem[]>([]);

  useEffect(() => {
    fetch("/data/BestSellers.json")
      .then((response) => response.json())
      .then((data) => setBestSellers(data))
      .catch((error) => console.error("Error loading best sellers:", error));
  }, []);

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
            <button onClick={() => addToCart({ ...item, quantity: 1 })}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
