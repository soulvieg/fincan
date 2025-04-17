const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.post("/", addToWishlist); // POST /api/wishlist
router.delete("/", removeFromWishlist); // DELETE /api/wishlist
router.get("/:customerId", getWishlist); // GET /api/wishlist/:customerId

module.exports = router;

