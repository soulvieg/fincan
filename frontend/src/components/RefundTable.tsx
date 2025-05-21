// src/components/RefundTable.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";
import { useOrders } from "../contexts/OrderContext";
import RefundItem from "./RefundItem";

interface RefundRow {
  refund_id:     number;
  order_id:      number;
  refund_status: string;
  amount?:       number;
}

export default function RefundTable() {
  const { orders, updateRefundStatus, calculateDaysLeft } = useOrders();

  /** map<orderId, RefundRow> */
  const [refunds, setRefunds] = useState<Record<number, RefundRow>>({});

  /* ------------------------------------------------------------------ *
   * Fetch refund rows for every delivered / cancelled order.            *
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const relevant = orders.filter(
      (o) => o.status === "cancelled" || o.status === "delivered"
    );

    relevant.forEach((o) => {
      axios
        .get<RefundRow>(`/api/orders/${o.id}/refund`)
        .then((res) =>
          setRefunds((r) => ({
            ...r,
            [o.id]: res.data,
          }))
        )
        .catch((err) => {
          if (err.response?.status === 404) {
            // no refund record yet – remove any stale entry
            setRefunds((r) => {
              const copy = { ...r };
              delete copy[o.id];
              return copy;
            });
          } else {
            console.error(`Failed to load refund for order ${o.id}`, err);
          }
        });
    });
  }, [orders]);

  const refundOrders = orders.filter((o) => refunds[o.id]);

  return (
    <Card
      className="shadow-sm rounded-4 mt-4 border-0"
      style={{ background: "#ADD8E6" }}
    >
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
          style={{
            background: "#fff",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            marginBottom: "2rem",
          }}
        >
          <thead>
            <tr style={{ background: "#e2eaff", color: "#264e70" }}>
              <th className="text-center align-middle">Order&nbsp;ID</th>
              <th className="text-center align-middle">Customer&nbsp;ID</th>
              <th className="text-center align-middle">Customer&nbsp;Name</th>
              <th className="text-center align-middle">Total&nbsp;Price</th>
              <th className="text-center align-middle">Address</th>
              <th className="text-center align-middle">Order&nbsp;Status</th>
              <th className="text-center align-middle">Days&nbsp;Left</th>
              <th className="text-center align-middle">Refund&nbsp;Status</th>
            </tr>
          </thead>

          <tbody>
            {refundOrders.map((order) => (
              <RefundItem
                key={order.id}
                order={order}
                daysLeft={calculateDaysLeft(order)}
                refundStatus={refunds[order.id].refund_status}
                onAccept={(id) => {
                  updateRefundStatus(id, "Refunded");
                  setRefunds((r) => ({
                    ...r,
                    [id]: { ...r[id], refund_status: "Refunded" },
                  }));
                }}
                onReject={(id) => {
                  updateRefundStatus(id, "Refund Denied");
                  setRefunds((r) => ({
                    ...r,
                    [id]: { ...r[id], refund_status: "Refund Denied" },
                  }));
                }}
              />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}