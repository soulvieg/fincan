// routes/reviewRoutes.js
const express = require("express");
const {
  addCommentController,
  addRatingController,
} = require("../controllers/reviewController");

const router = express.Router();

// POST /api/products/:productId/comment
router.post("/:productId/comment", addCommentController);

// POST /api/products/:productId/rating
router.post("/:productId/rating", addRatingController);

module.exports = router;
