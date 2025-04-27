import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

// Define the order interface
export interface OrderItem {
  productId: number;
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
  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  // Add this filtered orders variable after the state declaration:
  const orders = user
    ? allOrders.filter((order) => order.customerId === user.id)
    : [];

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(allOrders));
  }, [allOrders]);

  // Replace the current getNextOrderId function with this:
  const getNextOrderId = () => {
    if (!user) return 1;

    // Filter orders for the current user only
    const userOrders = allOrders.filter(
      (order) => order.customerId === user.id
    );

    // If the user has no orders, start with 1
    if (userOrders.length === 0) return 1;

    // Otherwise, find the max ID among this user's orders and add 1
    return Math.max(...userOrders.map((order) => order.id)) + 1;
  };

  const addOrder = (
    orderData: Omit<
      Order,
      "id" | "status" | "customerId" | "customer" | "address"
    >
  ) => {
    if (!user) return;

    // Ensure all order items have both id and productId
    const orderItems = orderData.items.map((item) => ({
      ...item,
      // If productId doesn't exist, use id as fallback (but this shouldn't happen)
      productId: item.productId,
    }));

    setAllOrders((prevOrders) => {
      const nextId = getNextOrderId();
      const newOrder: Order = {
        ...orderData,
        items: orderItems,
        id: nextId,
        customerId: user.id || 0,
        status: "Processing",
        customer: `${user.first_name} ${user.last_name}`,
        address: user.address || "No address provided",
      };
      return [...prevOrders, newOrder];
    });
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setAllOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  // Replace the cancelOrder function with:
  const cancelOrder = (orderId: number) => {
    // Only allow cancellation if the order belongs to the current user
    if (user) {
      const orderToCancel = allOrders.find(
        (order) => order.id === orderId && order.customerId === user.id
      );

      if (orderToCancel) {
        updateOrderStatus(orderId, "Cancelled");
      }
    }
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
