import React from "react";
import { useOrders, Order } from "../contexts/OrderContext";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import "../styles/ShoppingCart.css"; // Use the existing CSS file
import html2pdf from "html2pdf.js";
import { useUser } from "../contexts/UserContext"; // get user name

const OrderHistory: React.FC = () => {
  const { user } = useUser(); // To access first and last name
  const { orders, cancelOrder, requestRefund, calculateDaysLeft } = useOrders();
  const navigate = useNavigate();
  console.log(
    "Orders before sorting:",
    orders.map((o) => ({ id: o.id, date: o.date }))
  );

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  console.log(
    "Orders after sorting:",
    sortedOrders.map((o) => ({ id: o.id, date: o.date }))
  );
  const handleRefundRequest = (orderId: number) => {
    requestRefund(orderId);
  };
  const getRefundButtonText = (order: Order) => {
    if (order.refundStatus === "Waiting for Refund")
      return "Waiting for Refund";
    if (order.refundStatus === "Refunded") return "Refunded";
    if (order.refundStatus === "Refund Denied") return "Refund Denied";
    return "Ask for Refund";
  };
  const isRefundButtonDisabled = (order: Order) => {
    const moreThan30Days = order.deliveryDate
      ? calculateDaysLeft(order) === 0
      : false;

    const hasRefundStatus =
      order.refundStatus !== null && order.refundStatus !== undefined;

    return hasRefundStatus || moreThan30Days;
  };

  const toBase64 = (url: string): Promise<string> =>
    fetch(url, { mode: "cors" })
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const generateAndDownloadPDF = async (order: Order) => {
    const itemsWithBase64 = await Promise.all(
      order.items.map(async (item) => {
        let base64Image = "";
        try {
          base64Image = await toBase64(item.image);
        } catch (e) {
          console.warn("Failed to convert image:", item.image);
          // Optionally, set a fallback image
          base64Image = ""; // or a default base64 image
        }
        return { ...item, image: base64Image };
      })
    );

    const receiptHTML = `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    <div style="border-top: 6px solid #458500; padding: 16px;">
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px;">
        <strong>Thank You for Your Order</strong>
      </span>
    </div>
    <div style="padding: 0 16px;">
      <p>We'll send you tracking information when the order ships.</p>
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #333;">
        <strong>Order #${order.id}</strong>
      </div>

      ${itemsWithBase64
        .map(
          (item) => `
        <table style="width: 100%; border-collapse: collapse; height: 62px;">
          <tbody>
            <tr style="vertical-align: top; height: 62px;">
              <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content;">
              ${
                item.image
                  ? `<img style="height: 64px;" src="${item.image}" alt="item" height="64px">`
                  : `<div style="height: 64px; width: 64px; background: #ccc; display: inline-block;"></div>`
              }

              </td>
              <td style="padding: 24px 8px 0 8px; width: 100%;">
                <div>${item.name}</div>
                <div style="font-size: 14px; color: #888; padding-top: 4px;">QTY: ${
                  item.quantity
                }</div>
              </td>
              <td style="padding: 24px 4px 0 0; white-space: nowrap;"><strong>$${item.price.toFixed(
                2
              )}</strong></td>
            </tr>
          </tbody>
        </table>
      `
        )
        .join("")}

      <div style="padding: 24px 0;">
        <div style="border-top: 2px solid #333;">&nbsp;</div>
      </div>

      <table style="border-collapse: collapse; width: 100%; text-align: right;">
        <tbody>
          <tr>
            <td style="width: 60%;">&nbsp;</td>
            <td>Shipping</td>
            <td style="padding: 8px; white-space: nowrap;">$0.00</td>
          </tr>
          <tr>
            <td style="width: 60%;">&nbsp;</td>
            <td>Taxes</td>
            <td style="padding: 8px; white-space: nowrap;">$0.00</td>
          </tr>
          <tr>
            <td style="width: 60%;">&nbsp;</td>
            <td style="border-top: 2px solid #333;">
              <strong style="white-space: nowrap;">Order Total</strong>
            </td>
            <td style="padding: 16px 8px; border-top: 2px solid #333; white-space: nowrap;">
              <strong>$${order.total.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
`;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = receiptHTML;
    document.body.appendChild(tempDiv);

    const filename = `invoice_${user?.first_name || "user"}_${order.id}.pdf`;

    setTimeout(() => {
      html2pdf()
        .set({ filename })
        .from(tempDiv)
        .save()
        .then(() => {
          document.body.removeChild(tempDiv);
        });
    }, 200);
  };

  const getStatusBadge = (status: Order["status"]) => {
    let className = "";
    switch (status) {
      case "processing":
        className = "badge-primary";
        break;
      case "in-transit":
        className = "badge-warning";
        break;
      case "delivered":
        className = "badge-success";
        break;
      case "cancelled":
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
    return status === "processing" || status === "in-transit";
  };

  // Update the handleReviewClick function
  const handleReviewClick = (productId: number) => {
    // First navigate to the products page, then to the specific product
    navigate("/products");

    // Use setTimeout to ensure the first navigation completes
    setTimeout(() => {
      navigate(`/product/${productId}#comments-section`);
    }, 10);
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
      {[...orders]
        .sort((a, b) => b.id - a.id)
        .map((order) => (
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
                <div className="me-3">
                  Status: {getStatusBadge(order.status)}
                </div>
                {canCancel(order.status) && (
                  <button
                    className="clear-order-history-button"
                    style={{ margin: "0", padding: "5px 10px" }}
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
                {(order.status === "delivered" ||
                  order.status === "cancelled") && (
                  <div
                    title={
                      isRefundButtonDisabled(order) &&
                      calculateDaysLeft(order) === 0
                        ? "Refund period expired"
                        : ""
                    }
                  >
                    <button
                      className="clear-order-history-button"
                      style={{
                        margin: "0 0 0 10px",
                        padding: "5px 10px",
                        opacity: isRefundButtonDisabled(order) ? 0.5 : 1,
                        cursor: isRefundButtonDisabled(order)
                          ? "not-allowed"
                          : "pointer",
                        pointerEvents: isRefundButtonDisabled(order)
                          ? "none"
                          : "auto",
                      }}
                      onClick={() => handleRefundRequest(order.id)}
                      disabled={isRefundButtonDisabled(order)}
                    >
                      {getRefundButtonText(order)}
                    </button>
                  </div>
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
                    {order.status === "delivered" && <th>Review</th>}
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
                      {order.status === "delivered" && (
                        <td>
                          <div
                            className="review-button"
                            onClick={() => handleReviewClick(item.productId)}
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
                      colSpan={order.status === "delivered" ? 3 : 2}
                      className="text-end"
                    >
                      <strong>Total:</strong>
                    </td>
                    <td>
                      <strong>${order.total.toFixed(2)}</strong>
                    </td>
                    {order.status === "delivered" && <td></td>}
                  </tr>
                </tfoot>
              </Table>
              <div className="mt-3">
                <strong>Shipping Address:</strong> {order.address}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => generateAndDownloadPDF(order)}
                  className="clear-order-history-button"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrderHistory;
