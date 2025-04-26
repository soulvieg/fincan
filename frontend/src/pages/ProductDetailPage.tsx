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
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useProductContext } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import StarComponent from "../components/StarComponent";
import CommentComponent from "../components/CommentComponent";
import StarIcon from "@mui/icons-material/Star";
import "./ProductPage.css";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateRating } = useProductContext();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const product = products.find(
    (p) => p.id === parseInt(id || "0", 10) || String(p.id) === id
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [comments, setComments] = useState([
    { user: "Alice", text: "Great coffee, loved the aroma!" },
    { user: "Bob", text: "A bit too strong for my taste, but still good." },
  ]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    };

    addToCart(cartItem);

    const notification = document.createElement("div");
    notification.className = "add-to-cart-notification";
    notification.textContent = `${quantity} × ${product.name} added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }, 10);
  };

  const handleAddComment = (comment: string) => {
    setComments([...comments, { user: "Anonymous", text: comment }]);
  };

  const handleRatingChange = (newRating: number) => {
    if (product) {
      updateRating(product.id, newRating);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    const wishlistItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Product not found
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoBack}
            sx={{ bgcolor: "#4A756E", ":hover": { bgcolor: "#3A655E" } }}
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
        onClick={handleGoBack}
        sx={{ mb: 2, bgcolor: "#4A756E", ":hover": { bgcolor: "#3A655E" } }}
      >
        ← Back
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: "10px",
                backgroundColor: "#f5f0e6",
              }}
            >
              <CardMedia
                component="img"
                height="400"
                image={product.image}
                alt={product.name}
                sx={{
                  borderRadius: "10px",
                  objectFit: "contain",
                  maxWidth: "90%",
                  margin: "0 auto",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography>{product.rating?.toFixed(1) || "N/A"}</Typography>
                <StarIcon sx={{ color: "#ffc107" }} />
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#4A756E",
              color: "#fff",
              p: 4,
              borderRadius: "15px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              marginTop: "20px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#ffcc80" }}
            >
              {product.name ?? "Unknown Product"}
            </Typography>
            {product.isBestSeller && (
              <Box
                sx={{
                  display: "inline-block",
                  backgroundColor: "#ffcc80",
                  color: "#4e342e",
                  padding: "4px 10px",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  ml: 2,
                  verticalAlign: "middle",
                }}
              >
                Best Seller
              </Box>
            )}
            <Typography sx={{ mt: 2, fontSize: "16px", color: "#fff" }}>
              {product.description ?? "No description available."}
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "#ffcc80", mt: 4 }}
            >
              ${product.price?.toFixed(2) ?? "0.00"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 4, alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#ffcc80",
                  borderRadius: "5px",
                  padding: "5px 10px",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "30px",
                    padding: "5px",
                    fontSize: "1rem",
                    color: "#4e342e",
                    borderColor: "#ffcc80",
                    backgroundColor: "#ffcc80",
                    ":hover": {
                      backgroundColor: "#ffb74d",
                    },
                  }}
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                >
                  -
                </Button>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#4e342e",
                  }}
                >
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: "30px",
                    padding: "5px",
                    fontSize: "1rem",
                    color: "#4e342e",
                    borderColor: "#ffcc80",
                    backgroundColor: "#ffcc80",
                    ":hover": {
                      backgroundColor: "#ffb74d",
                    },
                  }}
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    bgcolor: "#ffcc80",
                    color: "#4e342e",
                    ":hover": { bgcolor: "#ffb74d" },
                    fontSize: "14px",
                    px: 2,
                    py: 1,
                    minWidth: "auto",
                  }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  startIcon={isInWishlist(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  sx={{
                    bgcolor: isInWishlist(product.id) ? "#ff4081" : "#ffcc80",
                    color: "#4e342e",
                    ":hover": { bgcolor: isInWishlist(product.id) ? "#f50057" : "#ffb74d" },
                    fontSize: "14px",
                    px: 2,
                    py: 1,
                    minWidth: "auto",
                  }}
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }} id="comments-section">
        <Box
          sx={{
            backgroundColor: "#4A756E",
            p: 3,
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#ffcc80", mb: 2 }}>
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
