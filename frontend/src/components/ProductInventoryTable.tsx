import React, { useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import ProductInventoryItem from "./ProductInventoryItem";
import NewProductRow from "./NewProductRow";

interface Product {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  description: string;
  quantity: number;
  price: number;
  warrantyStatus: string;
  distributor: string;
  category: string;
  cost: number;
  image?: string;
}

interface ProductInventoryTableProps {
  products: Product[];
  categories: string[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onUpdateImage: (productId: number, currentUrl?: string) => void;
  onAddProduct: (product: Omit<Product, "id">) => void;
  onAddCategory: () => void;
}

const ProductInventoryTable: React.FC<ProductInventoryTableProps> = ({
  products,
  categories,
  onEdit,
  onDelete,
  onIncrement,
  onDecrement,
  onUpdateImage,
  onAddProduct,
  onAddCategory,
}) => {
  const [showNewProductRow, setShowNewProductRow] = useState(false);

  return (
    <Card className="rounded-border" style={{ backgroundColor: "#fff0e2" }}>
      <div className="d-flex align-items-end mb-1 mt-2 justify-content-between">
        <Card.Header as="h4" style={{ borderBottom: "none", backgroundColor: "transparent" }}>
          Product Inventory
        </Card.Header>
        <div>
          <Button
            variant="outline-success"
            size="sm"
            className="me-2 add-button"
            onClick={() => setShowNewProductRow(true)}
            disabled={showNewProductRow}
          >
            Add New Product
          </Button>
          <Button
            variant="outline-dark"
            size="sm"
            className="me-3 add-button"
            onClick={onAddCategory}
          >
            Add New Category
          </Button>
        </div>
      </div>
      <Card.Body>
        <Table bordered hover className="custom-table" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <thead>
            <tr className="rounded-row header-row">
              <th className="text-center align-middle">Product ID</th>
              <th className="text-center align-middle">Image</th>
              <th className="text-center align-middle">Name</th>
              <th className="text-center align-middle">Model</th>
              <th className="text-center align-middle">Description</th>
              <th className="text-center align-middle">Category</th>
              <th className="text-center align-middle">Serial Number</th>
              <th className="text-center align-middle">Warranty Status</th>
              <th className="text-center align-middle">Distributor</th>
              <th className="text-center align-middle">Price</th>
              <th className="text-center align-middle">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductInventoryItem
                key={p.id}
                product={p}
                onEdit={onEdit}
                onDelete={onDelete}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onUpdateImage={() => onUpdateImage(p.id, p.image)}
              />
            ))}
            {showNewProductRow && (
              <NewProductRow
                categories={categories}
                onSave={(np) => {
                  onAddProduct(np);
                  setShowNewProductRow(false);
                }}
                onCancel={() => setShowNewProductRow(false)}
              />
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProductInventoryTable;