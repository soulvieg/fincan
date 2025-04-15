import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

// Define the order interface
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  customerId: number;
  date: string;
  items: OrderItem[];
  total: number;
  status: "Processing" | "In-Transit" | "Delivered" | "Cancelled";
  address: string;
  customer: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (
    order: Omit<Order, "id" | "status" | "customerId" | "customer" | "address">
  ) => void;
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
  cancelOrder: (orderId: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const getNextOrderId = (currentOrders: Order[]) => {
    return currentOrders.length > 0
      ? Math.max(...currentOrders.map((order) => order.id)) + 1
      : 1;
  };

  // In your addOrder function in OrderContext.tsx

  // Clean up existing orders with invalid product IDs
  useEffect(() => {
    const cleanupExistingOrders = () => {
      setOrders((prevOrders) => {
        // Map through all orders
        const cleanedOrders = prevOrders.map((order) => {
          // Clean up items in each order
          const cleanedItems = order.items.map((item) => {
            // If ID is a timestamp (large number), map it to a valid product ID (1-13)
            if (item.id > 1000) {
              return {
                ...item,
                id: (item.id % 13) + 1,
              };
            }
            return item;
          });

          return {
            ...order,
            items: cleanedItems,
          };
        });

        // Save cleaned orders back to localStorage
        localStorage.setItem("orders", JSON.stringify(cleanedOrders));
        return cleanedOrders;
      });
    };

    cleanupExistingOrders();
  }, []); // Run once on component mount

  // Update the addOrder function in OrderContext.tsx

  const addOrder = (
    orderData: Omit<
      Order,
      "id" | "status" | "customerId" | "customer" | "address"
    >
  ) => {
    if (!user) return;

    // Ensure all order items have the correct product IDs
    // No need to modify the IDs, just use them as they are
    const orderItems = orderData.items;

    setOrders((prevOrders) => {
      const nextId = getNextOrderId(prevOrders);
      const newOrder: Order = {
        ...orderData,
        items: orderItems,
        id: nextId,
        customerId: user.id || Date.now(), // Use user ID if available
        status: "Processing",
        customer: `${user.first_name} ${user.last_name}`,
        address: user.address || "No address provided",
      };
      return [...prevOrders, newOrder];
    });
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const cancelOrder = (orderId: number) => {
    updateOrderStatus(orderId, "Cancelled");
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, cancelOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
