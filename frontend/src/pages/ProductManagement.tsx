// src/pages/ProductManagement.tsx
import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import ProductInventoryTable from "../components/ProductInventoryTable";
import DeliveryTable from "../components/DeliveryTable";
import CommentTable from "../components/CommentTable";
import AddCategoryModal from "../components/AddCategoryModal";
import ImageUrlModal from "../components/ImageUrlModal";
import { FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { VscCommentDiscussion } from "react-icons/vsc";
import { useReview } from "../contexts/ReviewContext";
import axios from "axios";

axios.defaults.withCredentials = true;

// ——— Interfaces ———
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
  greyedOut?: boolean;
}

interface Category {
  category_id: number;
  name: string;
}

const ProductManagement: React.FC = () => {
  const [stocksElement, setStocksElement] = useState<HTMLDivElement | null>(null);
  const [deliveriesElement, setDeliveriesElement] = useState<HTMLDivElement | null>(null);
  const [commentsElement, setCommentsElement] = useState<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string>("");

  const { approveComment, rejectComment } = useReview();

  // Fetch products & categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/categories"),
        ]);

        // Build category map & names
        const map: Record<number, string> = {};
        const names: string[] = [];
        (catRes.data as Category[]).forEach((c) => {
          map[c.category_id] = c.name;
          names.push(c.name);
        });
        setCategoryMap(map);
        setCategories(names);

        // Map products into UI shape and sort asc by id
        const uiProds: Product[] = (prodRes.data as any[]).map((p) => ({
          id: p.product_id,
          name: p.name,
          model: p.model,
          serialNumber: p.serial_number,
          description: p.description,
          quantity: p.quantity_in_stock,
          price: p.price,
          warrantyStatus: p.warranty_status,
          distributor: p.distributor_info,
          category: map[p.category_id] || "Unknown",
          cost: 0,
          image: p.image_url,
        }));
        uiProds.sort((a, b) => a.id - b.id);
        setProducts(uiProds);
      } catch (err) {
        console.error("Error loading products/categories:", err);
      }
    };
    loadData();
  }, []);

  // Fetch comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const resp = await fetch("/api/products/comments/all");
        const data = await resp.json();
        const norm: Comment[] = data.comments.map((c: any) => ({
          id: c.comment_id,
          productId: c.product_id,
          customerId: c.customer_id,
          product: c.product || "Unknown Product",
          user: c.user || "Anonymous",
          comment: c.text,
          rating: 2,
          status: c.approval === null ? "Pending" : c.approval ? "Approved" : "Rejected",
        }));
        const withScores = await Promise.all(
          norm.map(async (cmt) => {
            try {
              const r = await axios.get(
                `/api/products/${cmt.productId}/${cmt.customerId}/rating`
              );
              return { ...cmt, rating: r.data.rating?.[0]?.score ?? cmt.rating };
            } catch {
              return cmt;
            }
          })
        );
        setComments(withScores);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };
    loadComments();
  }, []);

  // Stock handlers
  const handleIncrementStock = async (id: number) => {
    try {
      const res = await axios.patch(`/api/products/${id}/increment`);
      const upd = res.data.product;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === upd.product_id ? { ...p, quantity: upd.quantity_in_stock } : p
        )
      );
    } catch (err) {
      console.error("Increment failed:", err);
    }
  };
  const handleDecrementStock = async (id: number) => {
    try {
      const res = await axios.patch(`/api/products/${id}/decrement`);
      const upd = res.data.product;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === upd.product_id ? { ...p, quantity: upd.quantity_in_stock } : p
        )
      );
    } catch (err) {
      console.error("Decrement failed:", err);
    }
  };

  // Delete & Add product
  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const handleAddProduct = async (newP: Omit<Product, "id">) => {
    try {
      const catId =
        Number(Object.entries(categoryMap).find(([,n]) => n === newP.category)?.[0]) || 0;
      const payload = {
        ...newP,
        category_id:       catId,
        serial_number:     newP.serialNumber,
        quantity_in_stock: newP.quantity,
        warranty_status:   newP.warrantyStatus,
        distributor_info:  newP.distributor,
        image_url:         newP.image ?? "",
      };
      const res = await axios.post("/api/products", payload);
      const p = res.data;
      setProducts((prev) => [
        ...prev,
        {
          id: p.product_id,
          name: p.name,
          model: p.model,
          serialNumber: p.serial_number,
          description: p.description,
          quantity: p.quantity_in_stock,
          price: p.price,
          warrantyStatus: p.warranty_status,
          distributor: p.distributor_info,
          category: categoryMap[p.category_id] || "Unknown",
          cost: 0,
          image: p.image_url,
        },
      ]);
    } catch (err) {
      console.error("Add product failed:", err);
    }
  };

  // Comment moderation
  const handleApproveComment = async (cid: number) => {
    if (await approveComment(cid)) {
      setComments((prev) => prev.map((c) =>
        c.id === cid ? { ...c, status: "Approved" } : c
      ));
    }
  };
  const handleRejectComment = async (cid: number) => {
    if (await rejectComment(cid)) {
      setComments((prev) => prev.map((c) =>
        c.id === cid ? { ...c, status: "Rejected" } : c
      ));
    }
  };

  // Add category
  const handleAddCategory = () => setShowAddCategoryModal(true);
  const handleSaveCategory = async (name: string) => {
    try {
      const res = await axios.post<Category>("/api/categories", { name });
      const newCat = res.data;
      setCategories((prev) => [...prev, newCat.name]);
      setCategoryMap((prev) => ({ ...prev, [newCat.category_id]: newCat.name }));
    } catch (err: any) {
      console.error("Failed to add category:", err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setShowAddCategoryModal(false);
    }
  };

  // Image modal handlers
  const openImageModal = (id: number, current?: string) => {
    setEditingProductId(id);
    setEditingImageUrl(current || "");
    setShowImageModal(true);
  };
  const handleSaveImage = async (url: string) => {
    if (editingProductId == null) return;
    try {
      const res = await axios.patch(
        `/api/products/${editingProductId}/image`,
        { image_url: url }
      );
      const upd = res.data.product;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === upd.product_id ? { ...p, image: upd.image_url } : p
        )
      );
    } catch (err) {
      console.error("Failed to update image:", err);
    } finally {
      setShowImageModal(false);
      setEditingProductId(null);
    }
  };

  const scrollTo = (el: HTMLDivElement | null) =>
    el?.scrollIntoView({ behavior: "smooth" });

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
          {/* “What would you like to do?” card omitted for brevity */}

          <div ref={setStocksElement} className="mb-5">
            <ProductInventoryTable
              products={products}
              categories={categories}
              onEdit={(p) => console.log("edit", p)}
              onDelete={handleDeleteProduct}
              onIncrement={handleIncrementStock}
              onDecrement={handleDecrementStock}
              onAddProduct={handleAddProduct}
              onAddCategory={handleAddCategory}
              onUpdateImage={openImageModal}
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

      <ImageUrlModal
        show={showImageModal}
        initialUrl={editingImageUrl}
        onSave={handleSaveImage}
        onHide={() => setShowImageModal(false)}
      />
    </>
  );
};

export default ProductManagement;