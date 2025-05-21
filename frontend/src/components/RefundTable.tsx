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
    <Card className="shadow-sm rounded-4 mt-4 border-0" style={{ background: "#ADD8E6" }}>
      <Card.Header
        as="h4"
        style={{ borderBottom: "none", background: "transparent", color: "#264e70" }}
      >
        Refund Requests
      </Card.Header>
      <Card.Body>
        <Table
          bordered
          hover
          className="rounded-3 overflow-hidden mb-0"
          style={{ background: "#fff", borderCollapse: "separate", borderSpacing: "0 8px", marginBottom: "2rem"}}
        >
          <thead>
            <tr style={{ background: "#e2eaff", color: "#264e70" }}>
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
