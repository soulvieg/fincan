// src/contexts/OrderContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// ——— Interfaces ———
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
  status: "processing" | "in-transit" | "delivered" | "cancelled";
  address: string;
  customer: string;
  refundStatus?: "Waiting for Refund" | "Refunded" | "Refund Denied" | null;
  deliveryDate?: string;
  daysLeft?: number;
}

// ——— Context Type ———
interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: { items: OrderItem[] }) => void;
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
  cancelOrder: (orderId: number) => void;
  requestRefund: (orderId: number) => void;
  updateRefundStatus: (orderId: number, status: Order["refundStatus"]) => void;
  calculateDaysLeft: (order: Order) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // 1️⃣ Fetch all orders from backend once on mount
  useEffect(() => {
    axios
      .get<Order[]>("/api/orders")
      .then((res) => setAllOrders(res.data))
      .catch((err) => console.error("Failed to load orders:", err));
  }, []);

  // 2️⃣ Place a new order
  const addOrder = (orderData: { items: OrderItem[] }) => {
    const products = orderData.items.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));

    axios
      .post<Order>("/api/orders", { customer_id: 1, products }) // use a real customer_id if you have one
      .then((res) => {
        setAllOrders((prev) => [...prev, res.data]);
      })
      .catch((err) => console.error("Place order failed:", err));
  };

  // 3️⃣ Update order status
  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    axios
      .patch<Order>(`/api/orders/${orderId}/status`, { status })
      .then((res) =>
        setAllOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        )
      )
      .catch((err) => console.error("Update status failed:", err));
  };

  // 4️⃣ Cancel an order
  const cancelOrder = (orderId: number) => {
    axios
      .patch<Order>(`/api/orders/${orderId}/cancel`)
      .then((res) =>
        setAllOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        )
      )
      .catch((err) => console.error("Cancel failed:", err));
  };

  // 5️⃣ Request refund
  const requestRefund = (orderId: number) => {
    axios
      .patch<Order>(`/api/orders/${orderId}/refund-request`)
      .then((res) =>
        setAllOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        )
      )
      .catch((err) => console.error("Refund request failed:", err));
  };

  // 6️⃣ Update refund status
  const updateRefundStatus = (
    orderId: number,
    refundStatus: Order["refundStatus"]
  ) => {
    axios
      .patch<Order>(`/api/orders/${orderId}/refund-status`, { refundStatus })
      .then((res) =>
        setAllOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        )
      )
      .catch((err) => console.error("Updating refund status failed:", err));
  };

  // 7️⃣ Calculate days left for refund window
  const calculateDaysLeft = (order: Order) => {
    if (!order.deliveryDate) return 0;
    const deliver = new Date(order.deliveryDate).getTime();
    const now = Date.now();
    const msLeft = deliver + 30 * 24 * 3600e3 - now;
    return Math.max(0, Math.ceil(msLeft / 86400e3));
  };

  // 8️⃣ Expose all orders (no filtering)
  const orders = allOrders;

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        cancelOrder,
        requestRefund,
        updateRefundStatus,
        calculateDaysLeft,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};