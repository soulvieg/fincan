import React, { createContext, useState, useContext } from "react";

// Define a type for the product
type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  isBestSeller?: boolean; // Add this flag
};

// Define a type for the context value
type ProductContextType = {
  products: Product[];
  updateRating: (id: number, newRating: number) => void;
  getBestSellers: () => Product[]; // Add this method
};

// Create the context with a default value
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([
    // Coffee Beans
    {
      id: 1,
      name: "Kenya Coffee",
      description: "Rich and smooth",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-coffee-label-design-template_23-2149814317.jpg",
      price: 15.99,
      rating: 4.5,
      category: "Coffee Beans",
    },
    {
      id: 2,
      name: "Premium Coffee",
      description: "Local Farming",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-coffee-label-template-design_23-2149824207.jpg",
      price: 12.99,
      rating: 4.0,
      category: "Coffee Beans",
    },
    {
      id: 3,
      name: "Blue Coffee",
      description: "Blue Bottle coffee",
      image:
        "https://images.unsplash.com/photo-1605711599412-775918dbe770?q=80&w=3024&auto=format&fit=crop",
      price: 18.99,
      rating: 4.7,
      category: "Coffee Beans",
    },
    {
      id: 4,
      name: "Vienese Coffee",
      description: "Rich and smooth",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-coffee-label-design-template_23-2149814329.jpg",
      price: 14.99,
      rating: 4.3,
      category: "Coffee Beans",
    },
    {
      id: 5,
      name: "Moroccan Coffee",
      description: "Rich and smooth",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-coffee-label-design-template_23-2149814314.jpg",
      price: 16.99,
      rating: 4.6,
      category: "Coffee Beans",
    },
    // Tea
    {
      id: 6,
      name: "Fresh Tea",
      description: "Refreshing and healthy",
      image:
        "https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30486.jpg",
      price: 9.99,
      rating: 4.2,
      category: "Tea",
    },
    {
      id: 7,
      name: "Chamomile Tea",
      description: "Chamomile herbal tea",
      image:
        "https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30456.jpg",
      price: 8.99,
      rating: 4.4,
      category: "Tea",
    },
    {
      id: 8,
      name: "Blackcurrant Tea",
      description: "Authentic Handmade tea",
      image:
        "https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30487.jpg",
      price: 10.99,
      rating: 4.1,
      category: "Tea",
    },
    {
      id: 9,
      name: "Jasmine Tea",
      description: "Jasmine herbal tea",
      image:
        "https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30486.jpg",
      price: 11.99,
      rating: 4.5,
      category: "Tea",
    },
    // Accessories
    {
      id: 10,
      name: "Espresso Machine",
      description: "Perfect brew every time",
      image:
        "https://img.freepik.com/free-photo/view-3d-coffee-cup-with-machine_23-2151083728.jpg",
      price: 199.99,
      rating: 4.8,
      category: "Accessories",
    },
    {
      id: 11,
      name: "Coffee Grinder",
      description: "Freshly ground beans",
      image:
        "https://images.unsplash.com/photo-1637029436347-e33bf98a5412?q=80&w=2960&auto=format&fit=crop",
      price: 49.99,
      rating: 4.4,
      category: "Accessories",
    },
    // Best Sellers (added from BestSellers.json)
    {
      id: 12,
      name: "Turkish Coffee Cup",
      description: "Traditional Turkish coffee cup with elegant design",
      image: "/img/best-seller1.jpg",
      price: 4.99,
      rating: 4.9,
      category: "Accessories",
      isBestSeller: true,
    },
    {
      id: 13,
      name: "Tea Cup & Kettle",
      description: "Premium tea cup and kettle set for tea enthusiasts",
      image: "/img/best-seller2.webp",
      price: 19.99,
      rating: 4.7,
      category: "Accessories",
      isBestSeller: true,
    },
  ]);

  const updateRating = (id: number, newRating: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, rating: newRating } : product
      )
    );
  };

  // Add a method to get best sellers
  const getBestSellers = () => {
    return products.filter((product) => product.isBestSeller);
  };

  return (
    <ProductContext.Provider value={{ products, updateRating, getBestSellers }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
