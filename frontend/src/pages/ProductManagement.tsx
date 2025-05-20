import React, { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import ProductInventoryTable from "../components/ProductInventoryTable";
import DeliveryTable from "../components/DeliveryTable";
import CommentTable from "../components/CommentTable";
import { FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { VscCommentDiscussion } from "react-icons/vsc";

// --- Interfaces ---
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

interface Comment {
  id: number;
  productId: number;
  customerId: number;
  product: string;
  user: string;
  comment: string;
  rating: number;
  status: string;
}

// --- Mock Data ---
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Coffee",
    model: "Guatemala",
    serialNumber: "SN7834562",
    description: "Premium coffee beans with rich aroma",
    quantity: 45,
    price: 199.99,
    warrantyStatus: "1 year",
    distributor: "Coffee Inc.",
    category: "Premium Beans",
    cost: 150.0,
  },
  {
    id: 2,
    name: "Coffee",
    model: "Arabica",
    serialNumber: "SN9856321",
    description: "Premium coffee beans with rich aroma",
    quantity: 5,
    price: 24.99,
    warrantyStatus: "6 months",
    distributor: "Coffee Inc.",
    category: "Regular Beans",
    cost: 12.5,
  },
  {
    id: 3,
    name: "Coffee Maker",
    model: "Pro Brewer",
    serialNumber: "SN3456789",
    description: "Professional coffee brewing machine",
    quantity: 0,
    price: 349.99,
    warrantyStatus: "2 years",
    distributor: "Coffee Equipment Co.",
    category: "Equipment",
    cost: 200.0,
  },
  {
    id: 4,
    name: "Coffee",
    model: "Bolivia",
    serialNumber: "SN9856324",
    description: "Premium coffee beans with rich aroma",
    quantity: 5,
    price: 24.99,
    warrantyStatus: "6 months",
    distributor: "Coffee Inc.",
    category: "Regular Beans",
    cost: 12.5,
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    productId: 1,
    customerId: 102,
    product: "Coffee - Guatemala",
    user: "Jane Smith",
    comment: "Great taste and quality!",
    rating: 4.5,
    status: "Pending",
  },
  {
    id: 2,
    productId: 2,
    customerId: 103,
    product: "Coffee - Arabica",
    user: "Mike Johnson",
    comment: "Excellent aroma, would buy again.",
    rating: 5,
    status: "Pending",
  },
];

const ProductManagement: React.FC = () => {
  const [stocksElement, setStocksElement] = useState<HTMLDivElement | null>(null);
  const [deliveriesElement, setDeliveriesElement] = useState<HTMLDivElement | null>(null);
  const [commentsElement, setCommentsElement] = useState<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);

  // Scroll to a section
  const scrollToSection = (el: HTMLDivElement | null) => {
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // Product handlers
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
    console.log("Edit product:", product);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    console.log("Delete product with ID:", productId);
  };

  const handleAddProduct = () => {
    setShowAddProductModal(true);
    console.log("Opening add product modal");
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
    console.log("Opening add category modal");
  };

  // Comment handlers
  const handleApproveComment = async (commentId: number) => {
    try {
      const res = await fetch(`/api/products/comments/${commentId}/approve`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to approve comment");
      const { comment: updatedComment } = await res.json();
      setComments((prev) => prev.map((c) => (c.id === commentId ? updatedComment : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectComment = async (commentId: number) => {
    try {
      const res = await fetch(`/api/products/comments/${commentId}/reject`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to reject comment");
      const { comment: updatedComment } = await res.json();
      setComments((prev) => prev.map((c) => (c.id === commentId ? updatedComment : c)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Full-page background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#e8dace",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Container>
          <Card className="mb-4 border-0" style={{ backgroundColor: "#e8dace" }}>
            <Card.Body>
              <Card.Text
                style={{
                  fontSize: "30px",
                  textAlign: "center",
                  marginTop: "40px",
                  marginBottom: "60px",
                }}
              >
                What would you like to do?
              </Card.Text>
              <div className="d-flex gap-3 mt-3 justify-content-center" style={{ marginBottom: "240px" }}>
                <Button
                  variant="primary"
                  onClick={() => scrollToSection(stocksElement)}
                  style={{ width: "250px", height: "280px", backgroundColor: "#fff0e2", color: "black", borderColor: "black", borderRadius: "38px", fontSize: "24px", fontWeight: "semibold" }}
                >
                  <FaBoxOpen style={{ fontSize: "100px", marginBottom: "10px" }} />
                  Manage Stocks
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => scrollToSection(deliveriesElement)}
                  style={{ width: "250px", height: "280px", backgroundColor: "#fff0e2", color: "black", borderColor: "black", borderRadius: "38px", fontSize: "24px", fontWeight: "semibold" }}
                >
                  <TbTruckDelivery style={{ fontSize: "100px", marginBottom: "10px" }} />
                  Manage Deliveries
                </Button>
                <Button
                  variant="primary"
                  onClick={() => scrollToSection(commentsElement)}
                  style={{ width: "250px", height: "280px", backgroundColor: "#fff0e2", color: "black", borderColor: "black", borderRadius: "38px", fontSize: "24px", fontWeight: "semibold" }}
                >
                  <VscCommentDiscussion style={{ fontSize: "100px", marginBottom: "10px" }} />
                  Manage Comments
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Stocks Section */}
          <div ref={setStocksElement} className="mb-5">
            <ProductInventoryTable
              products={products}
              categories={[]}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAddProduct={handleAddProduct}
              onAddCategory={handleAddCategory}
            />
          </div>

          {/* Deliveries Section */}
          <div ref={setDeliveriesElement} className="mb-5">
            <DeliveryTable />
          </div>

          {/* Comments Section */}
          <div ref={setCommentsElement} className="mb-5">
            <CommentTable
              comments={comments}
              onApprove={handleApproveComment}
              onReject={handleRejectComment}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProductManagement;