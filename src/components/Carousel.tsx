import React, { useState } from "react";
import "../styles/Carousel.css";

const images = [
  {
    src: "img/tea.jpg",
    alt: "Tea",
    link: "tea.html",
    text: "Discover the variety of teas that we offer, perfect for any occasion.",
  },
  {
    src: "img/beans.jpg",
    alt: "Coffee",
    link: "coffee.html",
    text: "Explore our premium coffee beans, freshly roasted to perfection.",
  },
  {
    src: "img/mug.jpg",
    alt: "Utensils",
    link: "utensils.html",
    text: "Find the best utensils for your coffee and tea needs.",
  },
  {
    src: "img/machine.jpg",
    alt: "Machines",
    link: "machine.html",
    text: "Get the best machines to brew your drinks at home.",
  },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
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
              <a href={img.link}>Click here</a>
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
    </div>
  );
};

export default Carousel;
