import React from "react";
import RefundTable from "../components/RefundTable";

const SalesManagement: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#6b3503" }}>
        Sales Management
      </h2>
      <RefundTable />
    </div>
  );
};

export default SalesManagement;
