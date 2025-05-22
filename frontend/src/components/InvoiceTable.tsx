import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Card } from "react-bootstrap";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "../styles/CustomTables.css";        // ⬅️ uses .custom-table & .rounded-row

/* ─────────── shared pastel palette (same as Refund / Price tables) ─────── */
const CARD_BG      = "#fff0e2";
const HEADER_COLOR = "#6b3503";
const TH_STYLE     = { background: "#e2eaff", color: "#264e70" };
const ID_BADGE     = { background: "#f3e6ff", color: "#872ff7" };
const MONEY_BADGE  = { background: "#fde9d7", color: "#de7015" };

/* ─────────── types ─────────── */
interface OrderItem {
  name: string; image: string; quantity: number; price: number;
}
interface Order {
  id: number; customerId: number; customer: string; date: string;
  address: string; total: number; items: OrderItem[];
}

export default function SalesManagerInvoiceTable() {
  /* state */
  const [orders, setOrders]       = useState<Order[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate,   setEndDate]   = useState("");

  /* fetch */
  const fetchOrders = useCallback(async () => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate)   params.endDate   = endDate;
      const { data } = await axios.get("/api/orders", { params });
      setOrders(data);
    } catch (err) { console.error("Failed to fetch orders:", err); }
  }, [startDate, endDate]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* helpers */
  const $ = (n:number)=>`$${n.toFixed(2)}`;

  const dl = (o:Order) => {
    const html = `
      <div style="font-family:Arial;padding:20px">
        <h2 style="color:#6b3503">Fincan – Customer Invoice</h2>
        <p><strong>Order:</strong> ${o.id}</p>
        <p><strong>Customer:</strong> ${o.customer} (ID:${o.customerId})</p>
        <p><strong>Address:</strong> ${o.address}</p>
        <p><strong>Date:</strong> ${o.date}</p>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr><th align=left>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${o.items.map(i=>`
              <tr>
                <td>${i.name}</td><td align=center>${i.quantity}</td>
                <td align=right>${$(i.price)}</td>
                <td align=right>${$(i.price*i.quantity)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <h3 style="margin-top:20px">Total: ${$(o.total)}</h3>
      </div>`;
    const el=document.createElement("div"); el.innerHTML=html; document.body.appendChild(el);
    html2pdf().set({ filename:`invoice_${o.customer}_${o.id}.pdf` }).from(el).save()
      .then(()=>document.body.removeChild(el));
  };

  /* render */
  return (
    <Card className="rounded-border mb-5" style={{ background:CARD_BG }}>
      <Card.Header as="h4" style={{ color:HEADER_COLOR, background:"transparent", borderBottom:"none" }}>
        All Orders
      </Card.Header>

      <Card.Body>
        {/* date filter */}
        <div className="d-flex align-items-center mb-3">
          <Form.Control type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="me-2"/>
          <span className="me-2">-</span>
          <Form.Control type="date" value={endDate}   onChange={e=>setEndDate  (e.target.value)} className="me-3"/>
          <Button variant="dark" onClick={fetchOrders}>Filter</Button>
        </div>

        <Table
          bordered hover responsive
          className="custom-table"              /* <-- unified style */
          style={{ background:"#fff", borderCollapse:"separate", borderSpacing:"0 8px" }}
        >
          <thead><tr style={TH_STYLE}>
            <th className="text-center">Order&nbsp;ID</th>
            <th className="text-center">Customer</th>
            <th className="text-center">Date</th>
            <th className="text-center">Address</th>
            <th className="text-center">Total</th>
            <th className="text-center">Actions</th>
          </tr></thead>

          <tbody>
            {orders.map(o=>(
              <tr key={o.id} className="rounded-row">
                <td className="text-center align-middle">
                  <span style={{ ...ID_BADGE, borderRadius:16, padding:"2px 12px" }}>{o.id}</span>
                </td>
                <td className="text-center align-middle">{o.customer} (ID:{o.customerId})</td>
                <td className="text-center align-middle">{o.date}</td>
                <td className="text-center align-middle">{o.address}</td>
                <td className="text-center align-middle">
                  <span style={{ ...MONEY_BADGE, borderRadius:14, padding:"2px 18px" }}>{$(o.total)}</span>
                </td>
                <td className="text-center align-middle">
                  <Button variant="outline-secondary" onClick={()=>dl(o)}>Download Invoice</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}