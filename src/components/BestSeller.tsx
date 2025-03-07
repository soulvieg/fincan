import React from "react";
import "../styles/BestSeller.css";

const bestSellers = [
  { src: "img/best-seller1.jpg", alt: "BS1", caption: "Best Seller 1" },
  { src: "img/best-seller2.webp", alt: "BS2", caption: "Best Seller 2" },
];

const BestSeller: React.FC = () => {
  return (
    <div className="best-seller">
      <div className="bs-desc">This month's best sellers:</div>
      <div className="bs-items">
        {bestSellers.map((item, index) => (
          <div className="bs-item" key={index}>
            <img src={item.src} alt={item.alt} />
            <p className="bs-caption">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
