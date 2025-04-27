import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarComponent from "../components/StarComponent";
import CommentComponent from "../components/CommentComponent";
import { useProductContext } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import "./ProductPage.css";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    products,
    updateRating,
  } = useProductContext();
  const { addToCart } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const navigate = useNavigate();

  const product = products.find(
    (p) => p.product_id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState<
    { user: string; text: string }[]
  >([]);
  const [infoOpen, setInfoOpen] = useState(false);

  const handleAddToCart = () => {
    if (!product || product.quantity_in_stock === 0) return;
    addToCart({
      id:       product.product_id,
      name:     product.name,
      price:    product.price,
      quantity: quantity,
      image:    product.image_url,
    });
    // notification
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

  const handleAddComment = (text: string) =>
    setComments((c) => [...c, { user: "Anonymous", text }]);

  const handleRatingChange = (newRating: number) =>
    product && updateRating(product.product_id, newRating);

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.product_id)) {
      removeFromWishlist(product.product_id);
    } else {
      addToWishlist({
        productId: product.product_id,
        name:      product.name,
        price:     product.price,
        image:     product.image_url,
      });
    }
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h5">Product not found</Typography>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            ← Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{ mb: 2, bgcolor: "#4A756E" }}
      >
        ← Back
      </Button>
      <Grid container spacing={4}>
        {/* Image & Overall Rating */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, bgcolor: "#f5f0e6" }}>
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
              <Typography>
                {product.rating?.toFixed(1) ?? "N/A"}
              </Typography>
              <StarIcon sx={{ color: "#ffc107" }} />
            </Box>
          </Box>
        </Grid>

        {/* Details & Actions */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              p: 4,
              bgcolor: "#4A756E",
              color: "#fff",
              borderRadius: 2,
            }}
          >
            <IconButton
              onClick={() => setInfoOpen(true)}
              sx={{ position: "absolute", top: 8, right: 8, color: "#ffcc80" }}
            >
              <InfoOutlinedIcon fontSize="large" />
            </IconButton>

            <Typography variant="h4" sx={{ mb: 1, color: "#ffcc80" }}>
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
                  ml: 1,
                }}
              >
                Best Seller
              </Box>
            )}

            <Typography sx={{ mt: 2 }}>{product.description}</Typography>
            <Typography
              variant="h3"
              sx={{ mt: 3, color: "#ffcc80", fontWeight: "bold" }}
            >
              ${product.price.toFixed(2)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
              <Button
                onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                sx={{
                  bgcolor: "#ffcc80",
                  color: "#4e342e",
                  ":hover": { bgcolor: "#ffb74d" },
                }}
              >
                -
              </Button>
              <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                {quantity}
              </Typography>
              <Button
                onClick={() => setQuantity((q) => q + 1)}
                sx={{
                  bgcolor: "#ffcc80",
                  color: "#4e342e",
                  ":hover": { bgcolor: "#ffb74d" },
                }}
              >
                +
              </Button>

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
        </Grid>
      </Grid>

      {/* Information Dialog */}
      <Dialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Product Information</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="ID"
                secondary={product.product_id}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Model"
                secondary={product.model}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Serial Number"
                secondary={product.serial_number}
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
                secondary={product.warranty_status}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Distributor"
                secondary={product.distributor_info}
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      {/* Rating & Comments */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mb: 2, bgcolor: "#4A756E", p: 3, borderRadius: 2 }}>
          <Typography sx={{ color: "#ffcc80", mb: 1 }}>
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