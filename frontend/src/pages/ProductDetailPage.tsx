import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Box,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ShoppingCartIcon       from "@mui/icons-material/ShoppingCart";
import FavoriteIcon           from "@mui/icons-material/Favorite";
import FavoriteBorderIcon     from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon       from "@mui/icons-material/InfoOutlined";
import StarIcon               from "@mui/icons-material/Star";

import { useProductContext }  from "../contexts/ProductContext";
import { useCart }            from "../contexts/CartContext";
import { useWishlist }        from "../contexts/WishlistContext";
import { useReview }          from "../contexts/ReviewContext";
import { useUser }            from "../contexts/UserContext";

import StarComponent          from "../components/StarComponent";
import CommentComponent       from "../components/CommentComponent";
import "./ProductPage.css";

const ProductDetailPage: React.FC = () => {
  /* ------------------------------------------------ local state */
  const [qty,      setQty]      = useState(1);
  const [comments, setComments] = useState<
    { user: string; text: string; greyedOut: boolean }[]
  >([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [rating,   setRating]   = useState(0);

  /* ------------------------------------------------ contexts / hooks */
  const { id } = useParams<{ id: string }>();
  const nav    = useNavigate();
  const { user } = useUser();

  const {
    products,
    updateStockAfterPurchase,
  } = useProductContext();

  const { addToCart }                 = useCart();
  const { addToWishlist,
          removeFromWishlist,
          isInWishlist }              = useWishlist();

  const {
    addComment,
    addRating,
    getApprovedComments,
    getPendingComments,
  }                                   = useReview();

  /* ------------------------------------------------ locate product */
  const product = products.find((p) => p.product_id === Number(id));

  /* ------------------------------------------------ fetch comments on mount */
  useEffect(() => {
    if (!product) return;
    (async () => {
      try {
        const approved = await getApprovedComments(product.product_id);
        const pending  = await getPendingComments(product.product_id);
        setComments([
          ...approved.map((c) => ({
            user: c.Customer?.firstName || `User #${c.customer_id}`,
            text: c.text,
            greyedOut: false,
          })),
          ...pending.map((c) => ({
            user: c.Customer?.firstName || `User #${c.customer_id}`,
            text: c.text,
            greyedOut: true,
          })),
        ]);
      } catch (e) {
        console.error("Error fetching comments:", e);
      }
    })();
  }, [product]);

  /* ------------------------------------------------ derived price helpers */
  const discount     = product?.discount ?? 0;         // 0–1
  const basePrice    = product ? Number(product.price) : 0;
  const finalPrice   = basePrice * (1 - discount);     // shown / used
  const hasDiscount  = discount > 0.0001;

  /* ------------------------------------------------ cart handler */
  const handleAddToCart = async () => {
    if (!product) return;

    if (qty > product.quantity_in_stock) {
      setError(`Only ${product.quantity_in_stock} in stock`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const ok = await updateStockAfterPurchase(product.product_id, qty);
    if (!ok) {
      setError("Could not update stock. Try again.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    addToCart({
      id:       product.product_id,
      name:     product.name,
      price:    finalPrice,                  // 🠕 discounted price
      quantity: qty,
      image:    product.image_url,
    });

    /* small toast */
    const note = document.createElement("div");
    note.className   = "add-to-cart-notification";
    note.textContent = `${qty} × ${product.name} added to cart!`;
    document.body.appendChild(note);
    setTimeout(() => {
      note.classList.add("show");
      setTimeout(() => {
        note.classList.remove("show");
        setTimeout(() => document.body.removeChild(note), 300);
      }, 2000);
    }, 10);
  };

  /* ------------------------------------------------ rating / comment handlers */
  const handleRatingChange = async (newScore: number) => {
    if (!product || !user || typeof user.id !== "number") return;
    try {
      const r = await addRating(product.product_id, user.id, newScore);
      if (r) setRating(r.score);
    } catch (e) {
      console.error("Error submitting rating:", e);
    }
  };

  const handleAddComment = async (txt: string) => {
    if (!product || !user || typeof user.id !== "number") return;
    try {
      const c = await addComment(product.product_id, user.id, txt);
      if (c) {
        setComments((prev) => [
          ...prev,
          { user: user.name || "You", text: c.text, greyedOut: c.greyedOut },
        ]);
      }
    } catch (e) {
      console.error("Error adding comment:", e);
    }
  };

  /* ------------------------------------------------ wishlist toggle */
  const toggleWishlist = () => {
    if (!product) return;
    const pid = product.product_id;
    isInWishlist(pid)
      ? removeFromWishlist(pid)
      : addToWishlist({
          productId: pid,
          name:      product.name,
          price:     finalPrice,
          image:     product.image_url,
        });
  };

  /* ------------------------------------------------ early exit */
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button variant="contained" onClick={() => nav(-1)}>
          ← Back to Products
        </Button>
      </Container>
    );
  }

  /* ------------------------------------------------ UI */
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        variant="contained"
        sx={{ mb: 2, bgcolor: "#4A756E", ":hover": { bgcolor: "#3A655E" } }}
        onClick={() => nav(-1)}
      >
        ← Back
      </Button>

      <Grid container spacing={4}>
        {/* ─────────── Image + rating box ─────────── */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, bgcolor: "#f5f0e6" }}>
              <CardMedia
                component="img"
                height="400"
                image={product.image_url}
                alt={product.name}
                sx={{ objectFit: "contain", maxWidth: "90%", mx: "auto", my: 2 }}
              />
            </Card>

            {/* rating badge */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(0,0,0,0.55)",
                color: "#fff",
                p: 1,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography>{product.rating?.toFixed(1) ?? "N/A"}</Typography>
              <StarIcon sx={{ color: "#ffc107" }} />
            </Box>

            {/* discount ribbon */}
            {hasDiscount && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: -16,
                  background: "#c92a2a",
                  color: "#fff",
                  px: 2,
                  py: 0.5,
                  transform: "rotate(-45deg)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {Math.round(discount * 100)}% OFF
              </Box>
            )}
          </Box>
        </Grid>

        {/* ─────────── Details & actions ─────────── */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative", bgcolor: "#4A756E", color: "#fff", p: 4, borderRadius: 2 }}>
            <IconButton
              onClick={() => setInfoOpen(true)}
              sx={{ position: "absolute", top: 12, right: 12, color: "#ffcc80" }}
            >
              <InfoOutlinedIcon fontSize="large" />
            </IconButton>

            <Typography variant="h4" sx={{ color: "#ffcc80", mb: 1 }}>
              {product.name}
            </Typography>

            {product.is_best_seller && (
              <Box sx={{ display: "inline-block", bgcolor: "#ffcc80", color: "#4e342e", px: 1, borderRadius: 1, mb: 2 }}>
                Best Seller
              </Box>
            )}

            <Typography sx={{ mt: 2 }}>{product.description}</Typography>

            {/* Price block */}
            <Box sx={{ mt: 3 }}>
              {hasDiscount ? (
                <>
                  <Typography variant="h3" sx={{ color: "#ffcc80", fontWeight: 700 }}>
                    ${finalPrice.toFixed(2)}
                  </Typography>
                  <Typography sx={{ textDecoration: "line-through", color: "#ddd" }}>
                    ${basePrice.toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography variant="h3" sx={{ color: "#ffcc80", fontWeight: 700 }}>
                  ${basePrice.toFixed(2)}
                </Typography>
              )}
            </Box>

            {/* Quantity + buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
              {error && (
                <Box sx={{ position: "absolute", top: "-3rem", bgcolor: "#f44336", color: "#fff", p: 1, borderRadius: 1 }}>
                  {error}
                </Box>
              )}

              {/* qty selector */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  sx={{ minWidth: 30, bgcolor: "#ffcc80", color: "#4e342e", borderColor: "#ffcc80", ":hover": { bgcolor: "#ffb74d" } }}
                >
                  –
                </Button>
                <Typography sx={{ fontWeight: 700 }}>{qty}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => setQty((q) => (q < product.quantity_in_stock ? q + 1 : q))}
                  sx={{ minWidth: 30, bgcolor: "#ffcc80", color: "#4e342e", borderColor: "#ffcc80", ":hover": { bgcolor: "#ffb74d" } }}
                >
                  +
                </Button>
              </Box>

              {/* cart & wishlist */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  startIcon={<ShoppingCartIcon />}
                  disabled={product.quantity_in_stock === 0}
                  onClick={handleAddToCart}
                  sx={{
                    bgcolor: product.quantity_in_stock === 0 ? "#ccc" : "#ffcc80",
                    color: "#4e342e",
                    ":hover": { bgcolor: product.quantity_in_stock === 0 ? "#ccc" : "#ffb74d" },
                  }}
                >
                  {product.quantity_in_stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Button
                  startIcon={isInWishlist(product.product_id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={toggleWishlist}
                  sx={{
                    bgcolor: isInWishlist(product.product_id) ? "#ff4081" : "#ffcc80",
                    color: "#4e342e",
                    ":hover": { bgcolor: isInWishlist(product.product_id) ? "#f50057" : "#ffb74d" },
                  }}
                >
                  {isInWishlist(product.product_id) ? "In Wishlist" : "Add to Wishlist"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Info dialog */}
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Product Information</DialogTitle>
        <DialogContent>
          <List>
            <ListItem><ListItemText primary="Model"         secondary={product.model || "N/A"} /></ListItem>
            <ListItem><ListItemText primary="Serial Number" secondary={product.serial_number || "N/A"} /></ListItem>
            <ListItem><ListItemText primary="Stock"         secondary={product.quantity_in_stock || "Out of Stock"} /></ListItem>
            <ListItem><ListItemText primary="Warranty"      secondary={product.warranty_status || "N/A"} /></ListItem>
            <ListItem><ListItemText primary="Distributor"   secondary={product.distributor_info || "N/A"} /></ListItem>
            {hasDiscount && (
              <ListItem>
                <ListItemText
                  primary="Discount"
                  secondary={`${Math.round(discount * 100)}% off`}
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* rating & comments */}
      <Box sx={{ mt: 4 }} id="comments-section">
        <Box sx={{ bgcolor: "#4A756E", p: 3, borderRadius: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ color: "#ffcc80" }}>
            Rate this product:
          </Typography>
          <StarComponent onRatingChange={handleRatingChange} />
        </Box>
        <CommentComponent comments={comments} onAddComment={handleAddComment} />
      </Box>
    </Container>
  );
};

export default ProductDetailPage;