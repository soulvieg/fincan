// src/components/RefundItem.tsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Order } from "../contexts/OrderContext";

interface Props {
  order:        Order;
  daysLeft:     number;
  refundStatus: string;
  onAccept:    (orderId: number) => void;
  onReject:    (orderId: number) => void;
}

export default function RefundItem({
  order,
  daysLeft,
  refundStatus,
  onAccept,
  onReject,
}: Props) {
  const [hover, setHover] = useState(false);

  const statusStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case "waiting for refund":
        return { color: "#fd7e14", fontWeight: "bold" };
      case "refunded":
        return { color: "#28a745", fontWeight: "bold" };
      case "refund denied":
        return { color: "#dc3545", fontWeight: "bold" };
      default:
        return {};
    }
  };

  const orderStatusStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case "processing":
        return { color: "#007bff", fontWeight: "bold" };
      case "in-transit":
        return { color: "#fd7e14", fontWeight: "bold" };
      case "delivered":
        return { color: "#28a745", fontWeight: "bold" };
      case "cancelled":
        return { color: "#dc3545", fontWeight: "bold" };
      default:
        return {};
    }
  };

  return (
    <tr
      className="rounded-row"
      style={{
        backgroundColor: "#f9f9f9",
        transform: hover ? "scale(1.02)" : "scale(1)",
        boxShadow: hover ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <td className="text-center align-middle">{order.id}</td>
      <td className="text-center align-middle">{order.customerId}</td>
      <td className="text-center align-middle">{order.customer}</td>
      <td className="text-center align-middle">
        ${order.total.toFixed(2)}
      </td>
      <td className="text-center align-middle">{order.address}</td>
      <td
        className="text-center align-middle"
        style={orderStatusStyle(order.status)}
      >
        {order.status}
      </td>
      <td className="text-center align-middle">
        {order.status === "delivered" ? daysLeft : "N/A"}
      </td>
      <td
        className="text-center align-middle position-relative"
        style={statusStyle(refundStatus)}
      >
        {refundStatus}

        {hover && (
          <div
            style={{
              position: "absolute",
              left:     "100%",
              top:      "50%",
              transform: "translateY(-50%)",
              display:  "flex",
              gap:      "0.25rem",
              padding:  "0.25rem",
              backgroundColor: "#f9f9f9",
              border:   "1px solid #ccc",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => onAccept(order.id)}
              disabled={refundStatus === "Refunded"}
            >
              <BsCheckCircleFill />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onReject(order.id)}
              disabled={refundStatus === "Refund Denied"}
            >
              <IoCloseCircleOutline />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}