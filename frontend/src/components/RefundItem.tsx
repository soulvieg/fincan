import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Order } from "../contexts/OrderContext";

interface RefundItemProps {
  order: Order;
  daysLeft: number;
  onAccept: (orderId: number) => void;
  onReject: (orderId: number) => void;
}

const RefundItem: React.FC<RefundItemProps> = ({
  order,
  daysLeft,
  onAccept,
  onReject,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const getOrderStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getRefundStatusStyle = (status: string | undefined | null) => {
    if (!status) return {};

    switch (status.toLowerCase()) {
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

  return (
    <tr
      className="rounded-row"
      style={{
        backgroundColor: "#f9f9f9",
        transition: "all 0.5s ease",
        transform: isHovering ? "scale(1.02)" : "scale(1)",
        boxShadow: isHovering ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
        zIndex: isHovering ? 1 : "auto",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <td className="text-center align-middle">{order.id}</td>
      <td className="text-center align-middle">{order.customerId}</td>
      <td className="text-center align-middle">{order.customer}</td>
      <td className="text-center align-middle">${order.total.toFixed(2)}</td>
      <td className="text-center align-middle">{order.address}</td>
      <td
        className="text-center align-middle"
        style={getOrderStatusStyle(order.status)}
      >
        {order.status}
      </td>
      <td className="text-center align-middle">
        {order.status === "Delivered" ? daysLeft : "N/A"}
      </td>
      <td
        className="text-center align-middle position-relative"
        style={getRefundStatusStyle(order.refundStatus)}
      >
        {order.refundStatus || "Waiting for Refund"}

        {isHovering &&
          (order.refundStatus === "Waiting for Refund" ||
            order.refundStatus === "Refunded" ||
            order.refundStatus === "Refund Denied") && (
            <div
              className={`action-buttons ${
                isHovering ? "visible" : "invisible"
              }`}
              style={{
                position: "absolute",
                left: "95%",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#f9f9f9",
                padding: "0.25rem",
                height: "42px",
                border: "1.4px solid #000",
                borderLeft: "none",
                display: "flex",
                gap: "0.2rem",
                alignItems: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => onAccept(order.id)}
                disabled={
                  order.refundStatus === "Refunded" ||
                  order.refundStatus === "Refund Denied"
                }
              >
                <BsCheckCircleFill size={16} />
              </Button>
              {(order.status !== "Cancelled" ||
                order.refundStatus === "Refund Denied" ||
                order.refundStatus === "Refunded") && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onReject(order.id)}
                  disabled={
                    order.status === "Cancelled" ||
                    order.refundStatus === "Refunded" ||
                    order.refundStatus === "Refund Denied"
                  }
                >
                  <IoCloseCircleOutline size={16} />
                </Button>
              )}
            </div>
          )}
      </td>
    </tr>
  );
};

export default RefundItem;
