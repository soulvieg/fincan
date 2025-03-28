// controllers/reviewController.js
const {
    addCommentToProduct,
    addRatingToProduct,
  } = require("../services/reviewService");
  
  /**
   * Controller to add or update a comment
   * @route POST /api/products/:productId/comment
   */
  async function addCommentController(req, res) {
    try {
      const { productId } = req.params;
      const { userId, comment } = req.body;
  
      if (!userId || !comment) {
        return res.status(400).json({ message: "userId and comment are required." });
      }
  
      const review = await addCommentToProduct(productId, userId, comment);
      return res.status(201).json({
        message: "Comment added successfully",
        review,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
   * Controller to add or update a rating
   * @route POST /api/products/:productId/rating
   */
  async function addRatingController(req, res) {
    try {
      const { productId } = req.params;
      const { userId, rating } = req.body;
  
      if (!userId || typeof rating === "undefined") {
        return res.status(400).json({ message: "userId and rating are required." });
      }
  
      const review = await addRatingToProduct(productId, userId, rating);
      return res.status(201).json({
        message: "Rating added successfully",
        review,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  module.exports = {
    addCommentController,
    addRatingController,
  };
  