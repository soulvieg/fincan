// src/pages/OrderHistory.tsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useOrders, Order } from "../contexts/OrderContext";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import "../styles/ShoppingCart.css";
import html2pdf from "html2pdf.js";
import { useUser } from "../contexts/UserContext";

function formatOrderDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const OrderHistory: React.FC = () => {
  const { user } = useUser();
  const { orders, cancelOrder, requestRefund, calculateDaysLeft } = useOrders();
  const navigate = useNavigate();

  /** map<orderId, refund_status> */
  const [refundStatuses, setRefundStatuses] = useState<Record<number, string>>(
    {}
  );

  // ────────────────────────────────── refund helpers ──────────────────────────
  const fetchRefundStatus = useCallback(async (orderId: number) => {
    try {
      const res = await axios.get(`/api/orders/${orderId}/refund`);
      const status = res.data.refund_status ?? res.data.status;
      setRefundStatuses((r) => ({ ...r, [orderId]: status }));
    } catch (err: any) {
      if (err.response?.status === 404) {
        setRefundStatuses((r) => {
          const copy = { ...r };
          delete copy[orderId];
          return copy;
        });
      } else {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    orders.forEach((o) => fetchRefundStatus(o.id));
  }, [orders, fetchRefundStatus]);

  const handleCancelOrder = async (id: number) => {
    try {
      await cancelOrder(id);
      await fetchRefundStatus(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefundRequest = async (id: number) => {
    try {
      await requestRefund(id);
      await fetchRefundStatus(id);
    } catch (err) {
      console.error(err);
    }
  };

  const getRefundButtonText = (id: number) => {
    const s = refundStatuses[id];
    if (s === "Waiting for Refund") return "Waiting for Refund";
    if (s === "Refunded") return "Refunded";
    if (s === "Refund Denied") return "Refund Denied";
    return "Ask for Refund";
  };

  const isRefundButtonDisabled = (order: Order) => {
    const s = refundStatuses[order.id];
    const expired =
      order.deliveryDate != null ? calculateDaysLeft(order) === 0 : false;
    const already = typeof s === "string";
    return expired || already;
  };

  // ────────────────────────────────── PDF helper ──────────────────────────────
  const toBase64 = (url: string): Promise<string> =>
    fetch(url, { mode: "cors" })
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onloadend = () => res(reader.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          })
      );

  const generateAndDownloadPDF = async (order: Order) => {
    const items = (order.items ?? []).map((i) => ({ ...i })); // safe copy
    const itemsWithImg = await Promise.all(
      items.map(async (it) => {
        let b64 = "";
        try {
          b64 = await toBase64(it.image);
        } catch { /* ignore */ }
        return { ...it, image: b64 };
      })
    );

    const receiptHTML = `<div>Your receipt HTML here…</div>`;
    const div = document.createElement("div");
    div.innerHTML = receiptHTML;
    document.body.appendChild(div);

    const filename = `invoice_${user?.first_name || "user"}_${order.id}.pdf`;
    setTimeout(() => {
      html2pdf()
        .set({ filename })
        .from(div)
        .save()
        .then(() => document.body.removeChild(div));
    }, 200);
  };

  // ────────────────────────────────── UI helpers ──────────────────────────────
  const getStatusBadge = (status: Order["status"]) => {
    const map: Record<Order["status"], string> = {
      processing: "badge-primary",
      "in-transit": "badge-warning",
      delivered: "badge-success",
      cancelled: "badge-danger",
    };
    return (
      <span className={`badge ${map[status] ?? "badge-secondary"}`} style={{ padding: "5px 10px" }}>
        {status}
      </span>
    );
  };

  const canCancel = (s: Order["status"]) => s === "processing" || s === "in-transit";

  const handleReviewClick = (pid: number) => {
    navigate("/products");
    setTimeout(() => navigate(`/product/${pid}#comments-section`), 10);
  };

  // ────────────────────────────────── render ──────────────────────────────────
  if (!orders.length) {
    return (
      <div className="order-history-container">
        <div className="no-orders-card">
          <h2>Order History</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>Order History</h2>

      {orders
        .slice()
        .sort((a, b) => b.id - a.id)
        .map((order) => {
          const items = order.items ?? [];   // ← always an array
          const total = order.total ?? 0;    // safe number

          return (
            <div key={order.id} className="order-card mb-4">
              {/* header */}
              <div
                style={{
                  background: "#e2d2b5",
                  borderRadius: "8px 8px 0 0",
                  padding: "18px 26px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#492c08",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  borderBottom: "2px solid #d5bb98",
                }}
              >
                <span>
                  Order <b>#{order.id}</b> – {formatOrderDate(order.date)}
                </span>
                <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                  <span>Status: {getStatusBadge(order.status)}</span>
                  {canCancel(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        background: "#60350e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "9px 25px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(186,161,110,0.2)",
                        cursor: "pointer",
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* items table */}
              <div style={{ padding: 15 }}>
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
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: 40, marginRight: 8 }}
                            />
                            {item.name}
                          </div>
                        </td>
                        <td>${Number(item.price ?? 0).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          $
                          {(
                            Number(item.price ?? 0) * Number(item.quantity ?? 0)
                          ).toFixed(2)}
                        </td>
                        {order.status === "delivered" && (
                          <td>
                            <span
                              onClick={() => handleReviewClick(item.productId)}
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                color: "#4A756E",
                              }}
                            >
                              Leave a review?{" "}
                              <StarIcon
                                sx={{ color: "#ffc107", marginLeft: 4 }}
                              />
                            </span>
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
                      <td colSpan={order.status === "delivered" ? 2 : 1}>
                        <strong>${Number(total).toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>

                <div style={{ marginTop: "1rem" }}>
                  <strong>Shipping Address:</strong> {order.address}
                </div>

                {/* refund info / button */}
                {(order.status === "delivered" ||
                  order.status === "cancelled") && (
                  refundStatuses[order.id] ? (
                    <span
                      style={{
                        background: "#f0f0f0",
                        color: "#333",
                        borderRadius: 10,
                        padding: "8px 20px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        marginTop: 12,
                        display: "inline-block",
                      }}
                    >
                      {refundStatuses[order.id]}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRefundRequest(order.id)}
                      disabled={isRefundButtonDisabled(order)}
                      style={{
                        background: "#60350e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "8px 20px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        marginTop: 12,
                        cursor: isRefundButtonDisabled(order)
                          ? "not-allowed"
                          : "pointer",
                        opacity: isRefundButtonDisabled(order) ? 0.6 : 1,
                      }}
                      title={
                        isRefundButtonDisabled(order) &&
                        calculateDaysLeft(order) === 0
                          ? "Refund period expired"
                          : undefined
                      }
                    >
                      {getRefundButtonText(order.id)}
                    </button>
                  )
                )}

                {/* download invoice */}
                <button
                  onClick={() => generateAndDownloadPDF(order)}
                  style={{
                    background: "#60350e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 20px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginTop: 12,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default OrderHistory;