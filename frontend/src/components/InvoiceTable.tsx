import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Card } from "react-bootstrap";
import axios from "axios";
import html2pdf from "html2pdf.js";

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerId: number;
  customer: string;
  date: string;
  address: string;
  total: number;
  items: OrderItem[];
}

const SalesManagerInvoiceTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchOrders = useCallback(async () => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get("http://localhost:5001/api/orders", {
        params,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleDownload = (order: Order) => {
    const content = `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #6b3503">Fincan - Customer Invoice</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customer} (ID: ${
      order.customerId
    })</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Date:</strong> ${order.date}</p>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th align="left">Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td align="center">${item.quantity}</td>
                  <td align="right">${formatCurrency(item.price)}</td>
                  <td align="right">${formatCurrency(
                    item.price * item.quantity
                  )}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <h3 style="margin-top: 20px;">Total: ${formatCurrency(order.total)}</h3>
      </div>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    document.body.appendChild(tempDiv);

    html2pdf()
      .set({ filename: `invoice_${order.customer}_${order.id}.pdf` })
      .from(tempDiv)
      .save()
      .then(() => document.body.removeChild(tempDiv));
  };

  return (
    <Card className="rounded-border" style={{ backgroundColor: "#fff0e2" }}>
      <Card.Header
        as="h4"
        style={{ borderBottom: "none", backgroundColor: "transparent" }}
      >
        All Orders
      </Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="me-2"
          />
          <span className="me-2">-</span>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="me-3"
          />
          <Button variant="dark" onClick={fetchOrders}>
            Filter
          </Button>
        </div>
        <Table
          bordered
          hover
          className="custom-table"
          style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
        >
          <thead>
            <tr className="rounded-row header-row">
              <th className="text-center align-middle">Order ID</th>
              <th className="text-center align-middle">Customer</th>
              <th className="text-center align-middle">Date</th>
              <th className="text-center align-middle">Address</th>
              <th className="text-center align-middle">Total</th>
              <th className="text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="text-center align-middle">{order.id}</td>
                <td className="text-center align-middle">
                  {order.customer} (ID: {order.customerId})
                </td>
                <td className="text-center align-middle">{order.date}</td>
                <td className="text-center align-middle">{order.address}</td>
                <td className="text-center align-middle">
                  {formatCurrency(order.total)}
                </td>
                <td className="text-center align-middle">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleDownload(order)}
                  >
                    Download Invoice
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default SalesManagerInvoiceTable;
