// src/pages/SalesManagement.tsx
import React from "react";
import RefundTable                 from "../components/RefundTable";
import SalesManagerInvoiceTable    from "../components/InvoiceTable";
import ProductPriceTable           from "../components/ProductPriceTable";

const SalesManagement: React.FC = () => (
  <div style={{ padding: 20 }}>
    <h2 style={{ marginBottom: 20, color: "#6b3503" }}>
      Sales Management
    </h2>

    {/* Refund requests */}
    <section style={{ marginBottom: 40 }}>
      <RefundTable />
    </section>

    {/* Invoices / all orders */}
    <section style={{ marginBottom: 40 }}>
      <SalesManagerInvoiceTable />
    </section>

    {/* Price overview */}
    <section>
      <ProductPriceTable />
    </section>
  </div>
);

export default SalesManagement;