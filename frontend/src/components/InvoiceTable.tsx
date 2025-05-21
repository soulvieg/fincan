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
      const response = await axios.get("http://localhost:5001/api/orders", { params });
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
        <p><strong>Customer:</strong> ${order.customer} (ID: ${order.customerId})</p>
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
                  <td align="right">${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `
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
    <Card className="shadow-sm rounded-4 border-0 mb-5" style={{ background: "#ADD8E6", marginTop: "2.5rem" }}>
      <Card.Header
        as="h4"
        style={{ borderBottom: "none", background: "transparent", color: "#264e70" }}
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
          className="rounded-3 overflow-hidden"
          style={{ background: "#fff", borderCollapse: "separate", borderSpacing: "0 8px", marginBottom: "2rem", marginTop: "2.5rem" }}
        >
          <thead>
            <tr style={{ background: "#e2eaff", color: "#264e70" }}>
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
                {/* Order ID with pastel badge */}
                <td className="text-center align-middle">
                  <span style={{
                    background: '#f3e6ff',
                    color: '#872ff7',
                    borderRadius: '16px',
                    padding: '2px 12px',
                    fontSize: '0.98rem',
                    display: 'inline-block'
                  }}>{order.id}</span>
                </td>
                {/* Customer info */}
                <td className="text-center align-middle">
                  {order.customer} (ID: {order.customerId})
                </td>
                {/* Date & address */}
                <td className="text-center align-middle">{order.date}</td>
                <td className="text-center align-middle">{order.address}</td>
                {/* Total with pastel badge */}
                <td className="text-center align-middle">
                  <span style={{
                    background: '#fde9d7',
                    color: '#de7015',
                    borderRadius: '14px',
                    padding: '2px 18px',
                    fontSize: '1.01rem',
                    display: 'inline-block'
                  }}>{formatCurrency(order.total)}</span>
                </td>
                {/* Download Action */}
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
