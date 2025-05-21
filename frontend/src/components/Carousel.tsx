import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Carousel.css";

const images = [
  {
    src: "img/tea.jpg",
    alt: "Tea",
    category: "Tea",
    text: "Discover the variety of teas that we offer, perfect for any occasion.",
  },
  {
    src: "img/beans.jpg",
    alt: "Coffee",
    category: "Coffee Beans",
    text: "Explore our premium coffee beans, freshly roasted to perfection.",
  },
  {
    src: "img/mug.jpg",
    alt: "Utensils",
    category: "Accessories",
    text: "Find the best utensils for your coffee and tea needs.",
  },
  {
    src: "img/machine.jpg",
    alt: "Machines",
    category: "Accessories",
    text: "Get the best machines to brew your drinks at home.",
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
                Click here
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
