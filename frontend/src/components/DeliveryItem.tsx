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
      className="rounded-row"
      style={{
        backgroundColor: '#f9f9f9',
        transition: 'all 0.5s ease',
        transform: isHovering ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovering ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
        zIndex: isHovering ? 1 : 'auto'
      }}
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
      <td className="text-center align-middle position-relative">
        {delivery.address}
        {isHovering && (
          <div
            className={`action-buttons ${isHovering ? 'visible' : 'invisible'}`}
            style={{
              position: 'absolute',
              left: '95%',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#f9f9f9',
              padding: '0.25rem',
              height: '42px',
              border: '1.4px solid #000',
              borderLeft: 'none',
              display: 'flex',
              gap: '0.1rem',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => onUpdateStatus(delivery.id, "in-transit")}
              disabled={
                delivery.status === "in-transit" ||
                delivery.status === "delivered" ||
                delivery.status === "cancelled"
              }
            >
              <TbTruckDelivery size={16} />
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => onUpdateStatus(delivery.id, "delivered")}
              disabled={
                delivery.status === "delivered" || delivery.status === "cancelled"
              }
            >
              <BsCheckCircleFill size={16} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onCancel(delivery.id)}
              disabled={
                delivery.status === "delivered" || delivery.status === "cancelled"
              }
            >
              <IoTrashOutline size={16} />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default DeliveryItem;