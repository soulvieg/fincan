import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

// This interface represents what we get from the backend
interface CartItemResponse {
  id: number;
  userId: number | null;
  sessionId: string | null;
  productId: number;
  quantity: number;
}

// This interface represents what we display in the UI
// We'll need to fetch product details separately
interface CartItemWithDetails {
  id: number;
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
  const [cart, setCart] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize session ID for guest users
  useEffect(() => {
    // If no session ID in localStorage, create one
    if (!localStorage.getItem("sessionId")) {
      const newSessionId = `guest-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      localStorage.setItem("sessionId", newSessionId);
    }
    setSessionId(localStorage.getItem("sessionId"));
  }, []);

  // Fetch cart when user or sessionId changes
  useEffect(() => {
    if (user || sessionId) {
      fetchCart();
    }
  }, [user, sessionId]);

  // Mock function to get product details - replace with actual API call
  const getProductDetails = async (
    productId: number
  ): Promise<{
    name: string;
    price: number;
    image: string;
  }> => {
    // This should be replaced with an actual API call to get product details
    // For now, returning mock data
    return {
      name: `Product ${productId}`,
      price: 9.99,
      image: "/img/product-placeholder.jpg",
    };
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = user?.id;
      const queryParams = new URLSearchParams();

      if (userId) {
        queryParams.append("userId", userId.toString());
      } else if (sessionId) {
        queryParams.append("sessionId", sessionId);
      }

      const response = await fetch(`/api/cart?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      const cartItems: CartItemResponse[] = data.cart;

      // Fetch product details for each cart item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const productDetails = await getProductDetails(item.productId);
          return {
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            ...productDetails,
          };
        })
      );

      setCart(itemsWithDetails);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Updated addToCart to handle both ways of calling it
  const addToCart = async (
    productIdOrItem: number | CartItemInput,
    quantity?: number
  ) => {
    try {
      setLoading(true);
      const userId = user?.id;

      let productId: number;
      let productQuantity: number;

      // Check if the first argument is a number (productId) or an object (CartItemInput)
      if (typeof productIdOrItem === "number") {
        productId = productIdOrItem;
        productQuantity = quantity || 1; // Default to 1 if quantity is not provided
      } else {
        // It's a CartItemInput object
        productId = productIdOrItem.id;
        productQuantity = productIdOrItem.quantity;

        // For now, we'll just add it to the local state for immediate feedback
        // and then sync with the backend
        const newItem: CartItemWithDetails = {
          id: Date.now(), // Temporary ID until we get the real one from the backend
          productId: productIdOrItem.id,
          name: productIdOrItem.name,
          price: productIdOrItem.price,
          quantity: productIdOrItem.quantity,
          image: productIdOrItem.image,
        };

        setCart((prevCart) => [...prevCart, newItem]);
      }

      // Now send the request to the backend
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId || null,
          sessionId: userId ? null : sessionId,
          productId,
          quantity: productQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      // Refresh the cart after adding an item to get the updated state from the backend
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      setLoading(true);
      // This endpoint doesn't exist yet in your backend
      // You'll need to add it
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update local state
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      // This endpoint doesn't exist yet in your backend
      // You'll need to add it
      const userId = user?.id;
      const queryParams = new URLSearchParams();

      if (userId) {
        queryParams.append("userId", userId.toString());
      } else if (sessionId) {
        queryParams.append("sessionId", sessionId);
      }

      const response = await fetch(`/api/cart?${queryParams.toString()}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      // Clear local state
      setCart([]);
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
};
