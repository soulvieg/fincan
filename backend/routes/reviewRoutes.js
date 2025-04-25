// routes/reviewRoutes.js
const express = require("express");
const {
  addCommentController,
  addRatingController,
} = require("../controllers/reviewController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// POST /api/products/:productId/comment
router.post("/:productId/comment",authenticate,addCommentController);

// POST /api/products/:productId/rating
router.post("/:productId/rating",authenticate,addRatingController);

module.exports = router;
