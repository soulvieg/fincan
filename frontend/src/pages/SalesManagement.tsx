import React from "react";
import RefundTable from "../components/RefundTable";
import SalesManagerInvoiceTable from "../components/InvoiceTable";

const SalesManagement: React.FC = () => (
  <div style={{ padding: 20 }}>
    <h2 style={{ marginBottom: 20, color: "#6b3503" }}>Sales Management</h2>

    {/* refund block */}
    <div style={{ marginBottom: 40 }}>
      <RefundTable />
    </div>

    {/* invoices block */}
    <SalesManagerInvoiceTable />
  </div>
);

export default SalesManagement;