import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import ProductInventoryTable from "../components/ProductInventoryTable";
import DeliveryTable from "../components/DeliveryTable";
import CommentTable from "../components/CommentTable";
import AddCategoryModal from "../components/AddCategoryModal";
import { FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { VscCommentDiscussion } from "react-icons/vsc";
import { useReview } from "../contexts/ReviewContext";
import axios from 'axios';

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
  const [categories, setCategories] = useState<string[]>([]);

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const { approveComment, rejectComment } = useReview();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data.map((cat: any) => cat.name));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Fetch comments and ratings from backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products/comments/all');
        const data = await response.json();
        const normalizedComments: Comment[] = data.comments.map((c: any) => ({
          id: c.comment_id,
          productId: c.product_id,
          customerId: c.customer_id,
          product: c.product || 'Unknown Product',
          user: c.user || 'Anonymous',
          comment: c.text,
          rating: 2,
          status: c.approval === null ? 'Pending' : (c.approval ? 'Approved' : 'Rejected'),
        }));

        const commentsWithRatings = await Promise.all(
          normalizedComments.map(async (comment) => {
            try {
              const ratingRes = await axios.get(
                `http://localhost:5001/api/products/${comment.productId}/${comment.customerId}/rating`
              );
              const score = ratingRes.data.rating?.[0]?.score || comment.rating;
              return { ...comment, rating: score };
            } catch (error) {
              console.error(`Failed to fetch rating for comment ${comment.id}:`, error);
              return comment;
            }
          })
        );

        setComments(commentsWithRatings);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, []);

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
  };

  const handleSaveCategory = async (categoryName: string) => {
    try {
      const response = await axios.post('/api/categories', { name: categoryName });
      if (response.status === 201) {
        // Refresh the categories list
        const categoriesResponse = await axios.get('/api/categories');
        setCategories(categoriesResponse.data.map((cat: any) => cat.name));
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Comment handlers
  const handleApproveComment = async (commentId: number) => {
    try {
      const updated = await approveComment(commentId);
      if (!updated) throw new Error("Failed to approve comment");
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: "Approved" } : c));
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleRejectComment = async (commentId: number) => {
    try {
      const updated = await rejectComment(commentId);
      if (!updated) throw new Error("Failed to reject comment");
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: "Rejected" } : c));
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  return (
    <>
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
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Container>
          <Card className="mb-4 border-0" style={{ backgroundColor: "#e8dace" }}>
            <Card.Body>
              <Card.Text style={{ fontSize: "30px", textAlign: "center", marginTop: "40px", marginBottom: "60px" }}>
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

          <div ref={setStocksElement} className="mb-5">
            <ProductInventoryTable
              products={products}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAddProduct={handleAddProduct}
              onAddCategory={handleAddCategory}
            />
          </div>

          <div ref={setDeliveriesElement} className="mb-5">
            <DeliveryTable />
          </div>

          <div ref={setCommentsElement} className="mb-5">
            <CommentTable
              comments={comments}
              onApprove={handleApproveComment}
              onReject={handleRejectComment}
            />
          </div>
        </Container>
      </div>
      <AddCategoryModal
        show={showAddCategoryModal}
        onHide={() => setShowAddCategoryModal(false)}
        onSave={handleSaveCategory}
      />
    </>
  );
};

export default ProductManagement;
