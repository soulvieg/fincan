import React from "react";
import RefundTable from "../components/RefundTable";
import SalesManagerInvoiceTable from "../components/InvoiceTable";
import ProductPriceTable from "../components/ProductPriceTable";

const SalesManagement: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#6b3503" }}>
        Sales Management
      </h2>
      <RefundTable />
      <SalesManagerInvoiceTable />
      <ProductPriceTable />
    </div>
  );
};

export default SalesManagement;
