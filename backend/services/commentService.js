const Review = require("../models/Reviews"); // Import the Reviews model
const Comment = require("../models/Comment");
async function approveComment(commentId) {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    comment.approval = true;
    await comment.save();

    return { success: true, message: "Comment approved", comment };
  } catch (error) {
    console.error("Error approving comment:", error.message);
    throw new Error("Failed to approve comment");
  }
}

async function rejectComment(commentId) {
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error("Comment not found");

    comment.approval = false;
    await comment.save();

    return { success: true, message: "Comment rejected", comment };
  } catch (error) {
    console.error("Error rejecting comment:", error.message);
    throw new Error("Failed to reject comment");
  }
}

module.exports = { approveComment, rejectComment };
