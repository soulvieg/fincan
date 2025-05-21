// routes/reviewRoutes.js
const express = require("express");
const {
  addCommentController,
  addRatingController,
  reviewCommentController,
  getApprovedCommentsController,
  getPendingCommentsController,
  getCommentsController,
  getRatingForCustomerCommentsController,
} = require("../controllers/reviewController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// POST /api/products/:productId/comment
router.post("/:productId/comment",authenticate,addCommentController);

// POST /api/products/:productId/rating
router.post("/:productId/rating",authenticate,addRatingController);

// PATCH /api/comments/:commentId/review
router.patch("/comments/:commentId/review", authenticate, reviewCommentController);

// GET /api/products/:productId/comments
router.get("/:productId/comments", getApprovedCommentsController);

// GET /api/products/comments/pending
router.get("/comments/pending", getPendingCommentsController);

// GET /api/products/comments/all
router.get("/comments/all", getCommentsController);

// GET /:productID/:customerID/rating
router.get("/:productID/:customerID/rating", getRatingForCustomerCommentsController);

module.exports = router;
