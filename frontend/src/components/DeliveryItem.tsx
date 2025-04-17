import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { TbTruckDelivery } from "react-icons/tb";
import { IoTrashOutline } from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";

interface DeliveryItemProps {
  delivery: {
    id: number;
    customerId: number;
    productId: number;
    customer: string;
    products: string;
    quantity: number;
    totalPrice: number;
    status: string;
    address: string;
    _productIds?: number[]; // Optional field for real orders
    _isRealOrder?: boolean; // Flag to identify real orders
  };
  onUpdateStatus: (deliveryId: number, newStatus: string) => void;
  onCancel: (deliveryId: number) => void;
}

const DeliveryItem: React.FC<DeliveryItemProps> = ({
                                                     delivery,
                                                     onUpdateStatus,
                                                     onCancel,
                                                   }) => {
  const [isHovering, setIsHovering] = useState(false);

  const getStatusStyle = (status: string) => {
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

  // Display product IDs differently based on whether it's a real order or mock delivery
  const displayProductIds =
      delivery._isRealOrder && delivery._productIds
          ? delivery._productIds.join(", ")
          : delivery.productId;

  return (
      <tr
          className="rounded-row position-relative"
          style={{ backgroundColor: "#f9f9f9" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
      >
        <td className="text-center align-middle">{delivery.id}</td>
        <td className="text-center align-middle">{delivery.customerId}</td>
        <td className="text-center align-middle">{delivery.customer}</td>
        <td className="text-center align-middle">{displayProductIds}</td>
        <td className="text-center align-middle">{delivery.products}</td>
        <td className="text-center align-middle">{delivery.quantity}</td>
        <td className="text-center align-middle">
          ${delivery.totalPrice.toFixed(2)}
        </td>
        <td
            className="text-center align-middle"
            style={getStatusStyle(delivery.status)}
        >
          {delivery.status}
        </td>
        <td className="text-center align-middle">{delivery.address}</td>
        {isHovering && (
            <div
                className="position-absolute d-flex align-items-center justify-content-center gap-2 action-buttons"
                style={{
                  right: "-140px", // Increased this value to move buttons further right
                  top: "0",
                  bottom: "0",
                  height: "100%",
                  width: "150px", // Added fixed width for the button container
                  outline: "1px solid #666",
                  backgroundColor: "#f9f9f9",
                  zIndex: 1000, // Added z-index to ensure buttons appear on top
                }}
            >
              <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onUpdateStatus(delivery.id, "In-Transit")}
                  disabled={
                      delivery.status === "In-Transit" ||
                      delivery.status === "Delivered" ||
                      delivery.status === "Cancelled"
                  }
              >
                <TbTruckDelivery size={22} />
              </Button>
              <Button
                  variant="success"
                  size="sm"
                  onClick={() => onUpdateStatus(delivery.id, "Delivered")}
                  disabled={
                      delivery.status === "Delivered" || delivery.status === "Cancelled"
                  }
              >
                <BsCheckCircleFill size={22} />
              </Button>
              <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onCancel(delivery.id)}
                  disabled={
                      delivery.status === "Delivered" || delivery.status === "Cancelled"
                  }
              >
                <IoTrashOutline size={22} />
              </Button>
            </div>
        )}
      </tr>
  );
};

export default DeliveryItem;
