/*import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

// This interface represents what we display in the UI
interface CartItemWithDetails {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// This interface represents what we get from ProductPage/ProductDetailPage
interface CartItemInput {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItemWithDetails[];
  loading: boolean;
  addToCart: (
    productIdOrItem: number | CartItemInput,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItemWithDetails[]>(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch cart from localStorage
  const fetchCart = async () => {
    try {
      setLoading(true);
      // Just load from localStorage - no API call needed
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productIdOrItem: number | CartItemInput,
    quantity?: number
  ) => {
    try {
      setLoading(true);
      if (typeof productIdOrItem === "number") {
        // This case isn't fully implemented since we need product details
        console.warn("Adding by product ID is not fully implemented");
        return;
      } else {
        // It's a CartItemInput object with all the details we need
        const productId = productIdOrItem.id;

        // Check if the item already exists in the cart
        const existingItemIndex = cart.findIndex(
          (item) => item.productId === productId
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += productIdOrItem.quantity;
          setCart(updatedCart);
        } else {
          // Add new item with the original product ID
          const newItem: CartItemWithDetails = {
            productId: productIdOrItem.id, // Use the product's actual ID
            name: productIdOrItem.name,
            price: productIdOrItem.price,
            quantity: productIdOrItem.quantity,
            image: productIdOrItem.image,
          };
          setCart((prevCart) => [...prevCart, newItem]);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      // Update local state and localStorage
      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      // Clear local state and localStorage
      setCart([]);
      localStorage.setItem("cart", JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};*/

// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

interface CartItemWithDetails {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemInput {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItemWithDetails[];
  loading: boolean;
  addToCart: (
    productIdOrItem: number | CartItemInput,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItemWithDetails[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();

  // ─── OPTION A: Re-sync prices from /api/products once on mount ─────────
  useEffect(() => {
    if (cart.length === 0) return;

    (async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products");
        const allProducts: any[] = res.data;
        const updatedCart = cart.map((item) => {
          const fresh = allProducts.find(
            (p) => p.product_id === item.productId
          );
          return fresh
            ? { ...item, price: parseFloat(fresh.price) }
            : item;
        });
        setCart(updatedCart);
      } catch (err) {
        console.error("Error refreshing cart prices:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []); // run only once

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const generateSession = () => {
    const id = "guest-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("guest_session_id", id);
    return id;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productIdOrItem: number | CartItemInput,
    quantity?: number
  ) => {
    try {
      setLoading(true);

      // initialize with safe defaults
      let productId: number;
      let name: string = "";
      let price: number = 0;
      let image: string = "";
      let qty: number;

      if (typeof productIdOrItem === "number") {
        productId = productIdOrItem;
        qty = quantity || 1;
      } else {
        productId = productIdOrItem.id;
        name = productIdOrItem.name;
        price = productIdOrItem.price;
        image = productIdOrItem.image;
        qty = productIdOrItem.quantity;
      }

      const body = {
        product_id: productId,
        quantity: qty,
        ...(user?.id
          ? { customer_id: user.id }
          : {
              session_id:
                localStorage.getItem("guest_session_id") ||
                generateSession(),
            }),
      };

      const response = await fetch(
        "http://localhost:5001/api/cart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      const newItem: CartItemWithDetails = {
        productId,
        name: name || data.cartItem.product?.name || "Product",
        price: price || data.cartItem.product?.price || 0,
        image: image || "/default.jpg",
        quantity: qty,
      };

      setCart((prev) => {
        const idx = prev.findIndex((i) => i.productId === productId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx].quantity += qty;
          return updated;
        }
        return [...prev, newItem];
      });
    } catch (error: any) {
      alert(error.message || "Error adding to cart");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      setCart((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setCart([]);
      localStorage.setItem("cart", JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
