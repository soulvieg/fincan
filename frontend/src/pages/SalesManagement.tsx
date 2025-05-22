// src/pages/SalesManagement.tsx
import React from "react";
import RefundTable from "../components/RefundTable";
import SalesManagerInvoiceTable from "../components/InvoiceTable";
import ProductPriceTable from "../components/ProductPriceTable";

const SalesManagement: React.FC = () => (
  <div style={{ padding: 20 }}>
    <h2 style={{ marginBottom: 20, color: "#6b3503" }}>Sales Management</h2>

    {/* ── Refunds ─────────────────────────────────────────────── */}
    <div style={{ marginBottom: 40 }}>
      <RefundTable />
    </div>

    {/* ── All orders / invoices ──────────────────────────────── */}
    <div style={{ marginBottom: 40 }}>
      <SalesManagerInvoiceTable />
    </div>

    {/* ── Product-price editor ───────────────────────────────── */}
    <ProductPriceTable />
  </div>
);

export default SalesManagement;