import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

interface Comment {
  user: string;
  text: string;
  greyedOut?: boolean; 
}

interface CommentComponentProps {
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments
      </Typography>
      {comments.map((comment, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            backgroundColor: comment.greyedOut ? "#f5f5f5" : "#fff",
            p: 2,
            borderRadius: "10px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            opacity: comment.greyedOut ? 0.7 : 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold", color: comment.greyedOut ? "#9e9e9e" : "#4e342e" }}>
            {comment.user}
          </Typography>
          <Typography variant="body2" sx={{ color: comment.greyedOut ? "#9e9e9e" : "#4e342e", fontStyle: comment.greyedOut ? "italic" : "normal" }}>
            {comment.text}
          </Typography>
        </Box>
      ))}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Write your comment here..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#fff",
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleAddComment}
        sx={{
          bgcolor: "#55b2a2",
          color: "#fff",
          ":hover": { bgcolor: "#4a756e" },
          borderRadius: "10px",
          px: 4,
        }}
      >
        Submit Comment
      </Button>
    </Box>
  );
};

export default CommentComponent;
