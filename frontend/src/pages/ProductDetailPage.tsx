// src/pages/ProductDetailPage.tsx
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import { useProductContext } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useReview } from "../contexts/ReviewContext";
import { useUser } from "../contexts/UserContext";
import StarComponent from "../components/StarComponent";
import CommentComponent from "../components/CommentComponent";
import "./ProductPage.css";

const ProductDetailPage: React.FC = () => {
  const [quantity, setQuantity]       = useState<number>(1);
  const [comments, setComments]       = useState<{ user: string; text: string }[]>([]);
  const [infoOpen, setInfoOpen]       = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);

  
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const {
    products,
    updateRating,
    updateStockAfterPurchase,
  } = useProductContext();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addComment, addRating, getApprovedComments } = useReview(); 
  

  const navigate = useNavigate();

  const product = products.find(
    (p) => p.product_id === Number(id)
  );

  const handleAddToCart = async () => {
    if (!product) return;
    const stock = product.quantity_in_stock;
    if (stock === 0) return;

    if (quantity > stock) {
      setErrorMessage(`Only ${stock} in stock.`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const ok = await updateStockAfterPurchase(product.product_id, quantity);
    if (!ok) {
      setErrorMessage("Could not update stock. Try again.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    addToCart({
      id:       product.product_id,
      name:     product.name,
      price:    product.price,
      quantity: quantity,
      image:    product.image_url,
    });

    const note = document.createElement("div");
    note.className = "add-to-cart-notification";
    note.textContent = `${quantity} × ${product.name} added to cart!`;
    document.body.appendChild(note);
    setTimeout(() => {
      note.classList.add("show");
      setTimeout(() => {
        note.classList.remove("show");
        setTimeout(() => document.body.removeChild(note), 300);
      }, 2000);
    }, 10);
  };

  const handleRatingChange = async (newRating: number) => {
    if (!product || !user || typeof user.id !== "number") return;
    
    try {
      const ratingResponse = await addRating(product.product_id, user.id, newRating);
      if (ratingResponse) {
        setRating(ratingResponse.score);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };
  

  const handleAddComment = async (text: string) => {
    if (!product || !user || typeof user.id !== "number") return;
  
    try {
      const newComment = await addComment(product.product_id, user.id, text);
      if (newComment) {
        setComments((prev) => [...prev, { user: user.name || "You", text: newComment.text }]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  const handleWishlistToggle = () => {
    if (!product) return;
    const pid = product.product_id;
    if (isInWishlist(pid)) removeFromWishlist(pid);
    else
      addToWishlist({
        productId: pid,
        name:      product.name,
        price:     product.price,
        image:     product.image_url,
      });
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          ← Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        variant="contained"
        sx={{ mb: 2, bgcolor: "#4A756E", ":hover": { bgcolor: "#3A655E" } }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <Grid container spacing={4}>
        {/* Image + Rating */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, bgcolor: "#f5f0e6" }}>
              <CardMedia
                component="img"
                height="400"
                image={product.image_url}
                alt={product.name}
                sx={{
                  objectFit: "contain",
                  maxWidth: "90%",
                  mx: "auto",
                  my: 2,
                }}
              />
            </Card>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(0,0,0,0.5)",
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
          </Box>
        </Grid>

        {/* Details & Actions */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              bgcolor: "#4A756E",
              color: "#fff",
              p: 4,
              borderRadius: 2,
            }}
          >
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
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "#ffcc80",
                  color: "#4e342e",
                  px: 1,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                Best Seller
              </Box>
            )}
            <Typography sx={{ mt: 2, color: "#fff" }}>
              {product.description}
            </Typography>
            <Typography
              variant="h3"
              sx={{ mt: 3, color: "#ffcc80", fontWeight: "bold" }}
            >
              ${product.price.toFixed(2)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
              {errorMessage && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "-3rem",
                    bgcolor: "#f44336",
                    color: "#fff",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {errorMessage}
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "30px",
                    bgcolor: "#ffcc80",
                    color: "#4e342e",
                    borderColor: "#ffcc80",
                    ":hover": { bgcolor: "#ffb74d" },
                  }}
                  onClick={() =>
                    setQuantity((q) => Math.max(q - 1, 1))
                  }
                >
                  –
                </Button>
                <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "30px",
                    bgcolor: "#ffcc80",
                    color: "#4e342e",
                    borderColor: "#ffcc80",
                    ":hover": { bgcolor: "#ffb74d" },
                  }}
                  onClick={() =>
                    setQuantity((q) =>
                      q < product.quantity_in_stock ? q + 1 : q
                    )
                  }
                >
                  +
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  disabled={product.quantity_in_stock === 0}
                  onClick={handleAddToCart}
                  sx={{
                    bgcolor:
                      product.quantity_in_stock === 0 ? "#ccc" : "#ffcc80",
                    color: "#4e342e",
                    ":hover": {
                      bgcolor:
                        product.quantity_in_stock === 0
                          ? "#ccc"
                          : "#ffb74d",
                    },
                  }}
                >
                  {product.quantity_in_stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    isInWishlist(product.product_id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )
                  }
                  onClick={handleWishlistToggle}
                  sx={{
                    bgcolor: isInWishlist(product.product_id)
                      ? "#ff4081"
                      : "#ffcc80",
                    color: "#4e342e",
                    ":hover": {
                      bgcolor: isInWishlist(product.product_id)
                        ? "#f50057"
                        : "#ffb74d",
                    },
                  }}
                >
                  {isInWishlist(product.product_id)
                    ? "In Wishlist"
                    : "Add to Wishlist"}
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
            <ListItem>
              <ListItemText
                primary="Model"
                secondary={product.model || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Serial Number"
                secondary={product.serial_number || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Stock"
                secondary={
                  product.quantity_in_stock > 0
                    ? product.quantity_in_stock
                    : "Out of Stock"
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Warranty"
                secondary={product.warranty_status || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Distributor"
                secondary={product.distributor_info || "N/A"}
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      <Box sx={{ mt: 4 }} id="comments-section">
        <Box
          sx={{
            bgcolor: "#4A756E",
            p: 3,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#ffcc80" }}>
            Rate this product:
          </Typography>
          <StarComponent onRatingChange={handleRatingChange} />
        </Box>
        <CommentComponent
          comments={comments}
          onAddComment={handleAddComment}
        />
      </Box>
    </Container>
  );
};

export default ProductDetailPage;