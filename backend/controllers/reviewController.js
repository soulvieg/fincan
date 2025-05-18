// controllers/reviewController.js
const {
    addCommentToProduct,
    addRatingToProduct,
    reviewComment,
    getApprovedCommentsForProduct,
    getPendingComments,
    getComments,
  } = require("../services/reviewService");
  const { hasUserPurchasedProduct } = require("../services/orderService");
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
  
      const new_comment = await addCommentToProduct(productId, userId, comment);
      return res.status(201).json({
        message: "Comment submitted for approval.",
        comment: new_comment,
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
      const { customer_id, rating } = req.body;
      
      if (!customer_id || typeof rating === "undefined") {
        return res.status(400).json({ message: "customer id and rating are required." });
      }
      console.log("Comes here. 2");
      const new_rating = await addRatingToProduct(productId, customer_id, rating);
      
      return res.status(201).json({
        message: "Rating added successfully",
        rating: new_rating,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
 * Controller for manager/admin to approve or decline a comment
 * @route PATCH /api/comments/:commentId/review
 */
async function reviewCommentController(req, res) {
  try {
    const { commentId } = req.params;
    const { managerId, approve } = req.body; // approve should be true/false

    if (!managerId || typeof approve !== "boolean") {
      return res.status(400).json({ message: "managerId and approve (true/false) are required." });
    }

    const updatedComment = await reviewComment(commentId, managerId, approve);
    return res.status(200).json({
      message: `Comment ${approve ? "approved" : "declined"} successfully.`,
      comment: updatedComment,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
  

/**
 * Controller to get all approved comments for a product
 * @route GET /api/products/:productId/comments
 */
async function getApprovedCommentsController(req, res) {
  try {
    const { productId } = req.params;

    const comments = await getApprovedCommentsForProduct(productId);
    return res.status(200).json({
      comments,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
  
/**
 * Controller to get all pending comments across products
 * @route GET /api/products/comments/pending
 */
async function getPendingCommentsController(req, res) {
  try {
    const comments = await getPendingComments();
    return res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("Error fetching pending comments:", error);
    return res.status(400).json({ message: error.message });
  }
}

  /**
 * Controller to get all approved comments for a product
 * @route GET /api/products/comments/all
 */
async function getCommentsController(req, res) {
  try {
    const comments = await getComments();
    return res.status(200).json({
      comments,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
  


  module.exports = {
    addCommentController,
    addRatingController,
    reviewCommentController,
    getApprovedCommentsController,
    getPendingCommentsController,
    getCommentsController,
  };
  
