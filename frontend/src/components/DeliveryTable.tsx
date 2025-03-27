import React from "react";
import { Card, Table } from "react-bootstrap";
import DeliveryItem from "./DeliveryItem";
import { useOrders, Order } from "../contexts/OrderContext";

interface Delivery {
  id: number;
  customerId: number;
  productId: number;
  customer: string;
  quantity: number;
  products: string;
  totalPrice: number;
  status: string;
  address: string;
}

interface DeliveryTableProps {
  deliveries: Delivery[];
  onUpdateStatus: (deliveryId: number) => void;
  onCancel: (deliveryId: number) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries: initialDeliveries,
  onUpdateStatus,
  onCancel,
}) => {
  const { orders, updateOrderStatus, cancelOrder } = useOrders();

  // Convert orders to the delivery format
  const orderDeliveries = orders.map((order) => ({
    id: order.id,
    customerId: order.customerId,
    productId: order.items[0]?.id || 0, // Using first item's ID as product ID
    customer: order.customer,
    products: order.items.map((item) => item.name).join(", "),
    quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: order.total,
    status: order.status,
    address: order.address,
  }));

  // Combine mock deliveries with real order deliveries
  const allDeliveries = [...initialDeliveries, ...orderDeliveries];

  const handleUpdateStatus = (deliveryId: number, newStatus: string) => {
    // Check if it's a real order
    const isRealOrder = orders.some((order) => order.id === deliveryId);

    if (isRealOrder) {
      updateOrderStatus(deliveryId, newStatus as Order["status"]);
    } else {
      // Handle mock deliveries
      onUpdateStatus(deliveryId);
    }
  };

  const handleCancel = (deliveryId: number) => {
    // Check if it's a real order
    const isRealOrder = orders.some((order) => order.id === deliveryId);

    if (isRealOrder) {
      cancelOrder(deliveryId);
    } else {
      // Handle mock deliveries
      onCancel(deliveryId);
    }
  };

  return (
    <Card className="rounded-border" style={{ backgroundColor: "#fff0e2" }}>
      <Card.Header
        as="h4"
        style={{ borderBottom: "none", backgroundColor: "transparent" }}
      >
        Deliveries
      </Card.Header>
      <Card.Body>
        <Table
          bordered
          hover
          className="custom-table"
          style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
        >
          <thead>
            <tr className="rounded-row header-row">
              <th className="text-center align-middle">Order ID</th>
              <th className="text-center align-middle">Customer ID</th>
              <th className="text-center align-middle">Customer</th>
              <th className="text-center align-middle">Product ID</th>
              <th className="text-center align-middle">Products</th>
              <th className="text-center align-middle">Quantity</th>
              <th className="text-center align-middle">Total Price</th>
              <th className="text-center align-middle">Status</th>
              <th className="text-center align-middle">Address</th>
            </tr>
          </thead>
          <tbody>
            {allDeliveries.map((delivery) => (
              <DeliveryItem
                key={delivery.id}
                delivery={delivery}
                onUpdateStatus={handleUpdateStatus}
                onCancel={handleCancel}
              />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default DeliveryTable;
