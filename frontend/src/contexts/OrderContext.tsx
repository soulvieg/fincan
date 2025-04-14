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

  const addOrder = (
    orderData: Omit<
      Order,
      "id" | "status" | "customerId" | "customer" | "address"
    >
  ) => {
    if (!user) return;

    setOrders((prevOrders) => {
      const nextId = getNextOrderId(prevOrders);
      const newOrder: Order = {
        ...orderData,
        id: nextId,
        customerId: Date.now(),
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
