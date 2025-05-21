// src/components/RefundTable.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";
import { useOrders, Order } from "../contexts/OrderContext";
import RefundItem from "./RefundItem";

interface RefundRow {
  refund_id:    number;
  order_id:     number;
  refund_status:string;
  amount?:      number;
}

export default function RefundTable() {
  const { orders, updateRefundStatus, calculateDaysLeft } = useOrders();

  // Map of orderId → refund record
  const [refunds, setRefunds] = useState<Record<number,RefundRow>>({});

  // Whenever orders change, fetch refunds for those that qualify
  useEffect(() => {
    // only orders delivered or cancelled
    const toFetch = orders.filter(o =>
      o.status === "cancelled" ||
      (o.status === "delivered")
    );

    toFetch.forEach(o => {
      axios
        .get<RefundRow>(`/api/orders/${o.id}/refund`)
        .then(res => {
          setRefunds(r => ({ ...r, [o.id]: res.data }));
        })
        .catch(err => {
          if (err.response?.status === 404) {
            // no refund record yet
            setRefunds(r => {
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

  // Build a list of orders that actually have a refund entry
  const refundOrders = orders.filter(o => refunds[o.id]);

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
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Total Price</th>
              <th>Address</th>
              <th>Order Status</th>
              <th>Days Left</th>
              <th>Refund Status</th>
            </tr>
          </thead>
          <tbody>
            {refundOrders.map(order => (
              <RefundItem
                key={order.id}
                order={order}
                daysLeft={calculateDaysLeft(order)}
                refundStatus={refunds[order.id].refund_status}
                onAccept={id => {
                  updateRefundStatus(id, "Refunded");
                  // immediately update UI
                  setRefunds(r => ({
                    ...r,
                    [id]: { ...r[id], refund_status: "Refunded" }
                  }));
                }}
                onReject={id => {
                  updateRefundStatus(id, "Refund Denied");
                  setRefunds(r => ({
                    ...r,
                    [id]: { ...r[id], refund_status: "Refund Denied" }
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