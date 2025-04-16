const Review = require("../models/Reviews"); // Import the Reviews model

async function approveComment(commentId) {
  try {
    const comment = await Review.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    comment.status = "Approved";
    await comment.save();

    return { success: true, message: "Comment approved", comment };
  } catch (error) {
    console.error("Error approving comment:", error.message);
    throw new Error("Failed to approve comment");
  }
}

async function rejectComment(commentId) {
  try {
    const comment = await Review.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    comment.status = "Rejected";
    await comment.save();

    return { success: true, message: "Comment rejected", comment };
  } catch (error) {
    console.error("Error rejecting comment:", error.message);
    throw new Error("Failed to reject comment");
  }
}

module.exports = { approveComment, rejectComment };
