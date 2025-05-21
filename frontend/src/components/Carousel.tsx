import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Carousel.css";

const images = [
  {
    src: "img/tea.jpg",
    alt: "Tea",
    category: "Tea",
    text: "Discover our curated collection of premium teas from around the world.",
  },
  {
    src: "img/beans.jpg",
    alt: "Coffee",
    category: "Coffee Beans",
    text: "Single-origin and specialty blends, roasted to bring out their unique flavor profiles.",
  },
  {
    src: "img/mug.jpg",
    alt: "Utensils",
    category: "Accessories",
    text: "Elevate your brewing experience with our curated selection of premium accessories.",
  },
  {
    src: "img/machine.jpg",
    alt: "Machines",
    category: "Accessories",
    text: "Professional-grade equipment for the perfect brew, every time.",
  },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNavigate = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel">
      <div
        className="carousel-container"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="slide" key={index}>
            <img src={img.src} alt={img.alt} />
            <div className="description">
              <p>{img.text}</p>
              <a href="#" onClick={(e) => handleNavigate(img.category, e)}>
                {img.category === "Tea" ? "Discover Teas" :
                 img.category === "Coffee Beans" ? "Discover Beans" :
                 "View Accessories"}
              </a>
            </div>
          </div>
        ))}
      </div>
      <button className="prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="next" onClick={nextSlide}>
        &#10095;
      </button>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
