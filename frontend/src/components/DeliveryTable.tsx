// src/components/DeliveryTable.tsx
import React from "react";
import { Card, Table } from "react-bootstrap";
import DeliveryItem from "./DeliveryItem";
import { useOrders, Order } from "../contexts/OrderContext";

const DeliveryTable: React.FC = () => {
  const { orders, updateOrderStatus, cancelOrder } = useOrders();

  // Build the same delivery‐shaped objects you had originally
  const deliveries = orders.map((order) => {
    const productIds = order.items.map((item) => item.productId);
    return {
      id: order.id,
      customerId: order.customerId,
      productId: productIds[0] ?? 0,      // fallback for single-column display
      customer: order.customer,
      products: order.items.map((i) => i.name).join(", "),
      quantity: order.items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: order.total,
      status: order.status,
      address: order.address,
      _productIds: productIds,
      _isRealOrder: true,
    };
  });

  const handleUpdateStatus = (id: number, newStatus: string) => {
    updateOrderStatus(id, newStatus as Order["status"]);
  };

  const handleCancel = (id: number) => {
    cancelOrder(id);
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
              <th className="text-center align-middle">Product IDs</th>
              <th className="text-center align-middle">Products</th>
              <th className="text-center align-middle">Quantity</th>
              <th className="text-center align-middle">Total Price</th>
              <th className="text-center align-middle">Status</th>
              <th className="text-center align-middle">Address</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <DeliveryItem
                key={d.id}
                delivery={d}
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