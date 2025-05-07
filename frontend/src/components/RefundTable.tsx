import React from "react";
import { Card, Table } from "react-bootstrap";
import { useOrders, Order } from "../contexts/OrderContext";
import RefundItem from "./RefundItem";

const RefundTable: React.FC = () => {
  const { orders, updateRefundStatus, calculateDaysLeft } = useOrders();

  const refundOrders = orders.filter(
    (order) =>
      (order.status === "Delivered" && order.refundStatus) ||
      order.status === "Cancelled"
  );

  const handleAcceptRefund = (orderId: number) => {
    updateRefundStatus(orderId, "Refunded");
  };

  const handleRejectRefund = (orderId: number) => {
    updateRefundStatus(orderId, "Refund Denied");
  };

  return (
    <Card className="rounded-border" style={{ backgroundColor: "#fff0e2" }}>
      <Card.Header
        as="h4"
        style={{ borderBottom: "none", backgroundColor: "transparent" }}
      >
        Refund Requests
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
              <th className="text-center align-middle">Customer Name</th>
              <th className="text-center align-middle">Total Price</th>
              <th className="text-center align-middle">Address</th>
              <th className="text-center align-middle">Order Status</th>
              <th className="text-center align-middle">Days Left</th>
              <th className="text-center align-middle">Refund Status</th>
            </tr>
          </thead>
          <tbody>
            {refundOrders.map((order) => (
              <RefundItem
                key={order.id}
                order={order}
                daysLeft={calculateDaysLeft(order)}
                onAccept={handleAcceptRefund}
                onReject={handleRejectRefund}
              />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default RefundTable;
