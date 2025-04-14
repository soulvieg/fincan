import React from "react";
import { useOrders, Order } from "../contexts/OrderContext";
import { Button, Card, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import "../styles/ShoppingCart.css"; // Use the existing CSS file

const OrderHistory: React.FC = () => {
  const { orders, cancelOrder } = useOrders();
  const navigate = useNavigate();

  const getStatusBadge = (status: Order["status"]) => {
    let className = "";
    switch (status) {
      case "Processing":
        className = "badge-primary";
        break;
      case "In-Transit":
        className = "badge-warning";
        break;
      case "Delivered":
        className = "badge-success";
        break;
      case "Cancelled":
        className = "badge-danger";
        break;
      default:
        className = "badge-secondary";
    }
    return (
      <span className={`badge ${className}`} style={{ padding: "5px 10px" }}>
        {status}
      </span>
    );
  };

  const canCancel = (status: Order["status"]) => {
    return status === "Processing" || status === "In-Transit";
  };

  const handleReviewClick = (productId: number) => {
    navigate(`/product/${productId}#comments-section`);
  };

  if (orders.length === 0) {
    return (
      <div className="order-history-container">
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ color: "#6b3503", marginBottom: "20px" }}>
            Order History
          </h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2
        style={{
          color: "#6b3503",
          marginBottom: "20px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        Order History
      </h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card mb-4">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{
              padding: "15px",
              backgroundColor: "rgba(228, 212, 180, 0.8)",
            }}
          >
            <div>
              <strong>Order #{order.id}</strong> - {order.date}
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3">Status: {getStatusBadge(order.status)}</div>
              {canCancel(order.status) && (
                <button
                  className="clear-order-history-button"
                  style={{ margin: "0", padding: "5px 10px" }}
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
          <div style={{ padding: "15px" }}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  {order.status === "Delivered" && <th>Review</th>}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-img"
                        />
                        {item.name}
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    {order.status === "Delivered" && (
                      <td>
                        <div
                          className="review-button"
                          onClick={() => handleReviewClick(item.id)}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#4A756E",
                          }}
                        >
                          <span>Leave a review?</span>
                          <StarIcon
                            sx={{
                              color: "#ffc107",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: "scale(1.2)",
                              },
                            }}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={order.status === "Delivered" ? 3 : 2}
                    className="text-end"
                  >
                    <strong>Total:</strong>
                  </td>
                  <td>
                    <strong>${order.total.toFixed(2)}</strong>
                  </td>
                  {order.status === "Delivered" && <td></td>}
                </tr>
              </tfoot>
            </Table>
            <div className="mt-3">
              <strong>Shipping Address:</strong> {order.address}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
