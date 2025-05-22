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

const MS_PER_DAY = 1000 * 60 * 60 * 24;

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

const isExpired = (order: Order) => {
  return Date.now() - new Date(order.date).getTime() > 30 * MS_PER_DAY;
};

const OrderHistory: React.FC = () => {
  const { user } = useUser();
  const {
    orders,
    cancelOrder,
    requestRefund,
    calculateDaysLeft,
  } = useOrders();
  const navigate = useNavigate();

  const [refundStatuses, setRefundStatuses] = useState<Record<number, string>>(
    {}
  );

  const fetchRefundStatus = useCallback(async (orderId: number) => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}/refund`);
      const status = data.refund_status ?? data.status;
      setRefundStatuses((r) => ({ ...r, [orderId]: status }));
    } catch (err: any) {
      if (err.response?.status === 404) {
        setRefundStatuses((r) => {
          const c = { ...r };
          delete c[orderId];
          return c;
        });
      } else console.error(err);
    }
  }, []);

  useEffect(() => {
    orders.forEach((o) => fetchRefundStatus(o.id));
  }, [orders, fetchRefundStatus]);

  const handleCancelOrder = async (id: number) => {
    await cancelOrder(id);
    fetchRefundStatus(id);
  };
  const handleRefundRequest = async (id: number) => {
    await requestRefund(id);
    fetchRefundStatus(id);
  };

  const getRefundButtonText = (id: number) => {
    const s = refundStatuses[id];
    if (s === "Waiting for Refund") return "Waiting for Refund";
    if (s === "Refunded") return "Refunded";
    if (s === "Refund Denied") return "Refund Denied";
    return "Ask for Refund";
  };

  const isRefundDisabled = (order: Order) => {
    const already = typeof refundStatuses[order.id] === "string";
    return isExpired(order) || already;
  };

  const toBase64 = (url: string): Promise<string> =>
    fetch(url, { mode: "cors" })
      .then((r) => r.blob())
      .then(
        (b) =>
          new Promise<string>((res, rej) => {
            const rd = new FileReader();
            rd.onloadend = () => res(rd.result as string);
            rd.onerror = rej;
            rd.readAsDataURL(b);
          })
      );

  const generateAndDownloadPDF = async (order: Order) => {
    const items = await Promise.all(
      (order.items ?? []).map(async (it) => ({
        ...it,
        image: await toBase64(it.image).catch(() => it.image),
      }))
    );
    const div = document.createElement("div");
    div.innerHTML = `<div>Your receipt HTML here…</div>`;
    document.body.appendChild(div);
    html2pdf()
      .set({ filename: `invoice_${user?.first_name || "user"}_${order.id}.pdf` })
      .from(div)
      .save()
      .then(() => document.body.removeChild(div));
  };

  const getStatusBadge = (s: Order["status"]) => {
    const map: Record<Order["status"], string> = {
      processing: "badge-primary",
      "in-transit": "badge-warning",
      delivered: "badge-success",
      cancelled: "badge-danger",
    };
    return (
      <span
        className={`badge ${map[s] ?? "badge-secondary"}`}
        style={{ padding: "5px 10px" }}
      >
        {s}
      </span>
    );
  };
  const canCancel = (s: Order["status"]) =>
    s === "processing" || s === "in-transit";
  const handleReviewClick = (pid: number) => {
    navigate("/products");
    setTimeout(() => navigate(`/product/${pid}#comments-section`), 10);
  };

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
          const items = order.items ?? [];
          const total = order.total ?? 0;
          const expired = isExpired(order);
          const disabled = isRefundDisabled(order);

          return (
            <div key={order.id} className="order-card mb-4">
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
                    {items.map((it, i) => (
                      <tr key={i}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={it.image}
                              alt={it.name}
                              style={{ width: 40, marginRight: 8 }}
                            />
                            {it.name}
                          </div>
                        </td>
                        <td>${Number(it.price ?? 0).toFixed(2)}</td>
                        <td>{it.quantity}</td>
                        <td>
                          $
                          {(
                            Number(it.price ?? 0) * Number(it.quantity ?? 0)
                          ).toFixed(2)}
                        </td>
                        {order.status === "delivered" && (
                          <td>
                            <span
                              onClick={() => handleReviewClick(it.productId)}
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                color: "#4A756E",
                              }}
                            >
                              Leave a review? <StarIcon sx={{ ml: 0.5 }} />
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

                {(order.status === "delivered" ||
                  order.status === "cancelled") && (
                  <>
                    {refundStatuses[order.id] ? (
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
                        disabled={disabled}
                        style={{
                          background: disabled ? "#bfbfbf" : "#60350e",
                          color: disabled ? "#666" : "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 20px",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          marginTop: 12,
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.8 : 1,
                        }}
                        title={
                          expired ? "Refund period expired (30 days)" : undefined
                        }
                      >
                        {expired ? "Can’t refund" : getRefundButtonText(order.id)}
                      </button>
                    )}
                  </>
                )}

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