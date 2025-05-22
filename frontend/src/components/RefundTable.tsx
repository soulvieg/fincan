// src/components/RefundTable.tsx
import React, { useEffect, useState } from "react";
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

  /** local cache – order_id → refund record */
  const [refunds, setRefunds] = useState<Record<number, RefundRow>>({});

  /* --- fetch (or refresh) refund rows whenever orders change -------- */
  useEffect(() => {
    const relevant = orders.filter(
      (o) => o.status === "cancelled" || o.status === "delivered"
    );

    relevant.forEach((o) => {
      axios
        .get<RefundRow>(`/api/orders/${o.id}/refund`)
        .then((res) =>
          setRefunds((prev) => ({ ...prev, [o.id]: res.data }))
        )
        .catch((err) => {
          if (err.response?.status === 404) {
            // no refund record: make sure it’s removed from local map
            setRefunds((prev) => {
              const copy = { ...prev };
              delete copy[o.id];
              return copy;
            });
          } else {
            console.error(`Failed loading refund for order ${o.id}`, err);
          }
        });
    });
  }, [orders]);

  /* --- helpers ------------------------------------------------------ */
  const refundOrders = orders.filter((o) => refunds[o.id] !== undefined);

  const handleAccept = async (orderId: number) => {
    try {
      await updateRefundStatus(orderId, "Refunded");
      setRefunds((r) => ({
        ...r,
        [orderId]: { ...r[orderId], refund_status: "Refunded" },
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (orderId: number) => {
    try {
      await updateRefundStatus(orderId, "Refund Denied");
      setRefunds((r) => ({
        ...r,
        [orderId]: { ...r[orderId], refund_status: "Refund Denied" },
      }));
    } catch (e) {
      console.error(e);
    }
  };

  /* --- UI ----------------------------------------------------------- */
  return (
    <Card className="rounded-border" style={{ backgroundColor: "#fff0e2" }}>
      <Card.Header as="h4" style={{ backgroundColor: "transparent" }}>
        Refund Requests
      </Card.Header>

      <Card.Body>
        <Table
          bordered
          hover
          className="custom-table"
          style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
        >
          <thead>
            <tr className="rounded-row header-row">
              <th>Order&nbsp;ID</th>
              <th>Customer&nbsp;ID</th>
              <th>Customer&nbsp;Name</th>
              <th>Total&nbsp;Price</th>
              <th>Address</th>
              <th>Order&nbsp;Status</th>
              <th>Days&nbsp;Left</th>
              <th>Refund&nbsp;Status</th>
            </tr>
          </thead>

          <tbody>
            {refundOrders.map((order) => (
              <RefundItem
                key={order.id}
                order={order}
                daysLeft={calculateDaysLeft(order)}
                refundStatus={refunds[order.id].refund_status}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}