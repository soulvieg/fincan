import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface StarComponentProps {
  onRatingChange: (rating: number) => void;
}

const StarComponent: React.FC<StarComponentProps> = ({ onRatingChange }) => {
  const [hover, setHover] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);

  const handleRating = (value: number) => {
    setRating(value);
    onRatingChange(value);
  };

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}> {/* Reduced gap between stars */}
      {[1, 2, 3, 4, 5].map((value) => (
        <IconButton
          key={value}
          onClick={() => handleRating(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(null)}
          sx={{
            color: value <= (hover || rating) ? "#ffcc80" : "#ccc",
            fontSize: "1.2rem", // Smaller star size
          }}
        >
          {value <= (hover || rating) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
        </IconButton>
      ))}
    </Box>
  );
};

export default StarComponent;
