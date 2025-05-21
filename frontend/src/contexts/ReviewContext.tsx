// src/contexts/ReviewContext.tsx
import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
  } from "react";
  import axios from "axios";
  
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  
  interface Comment {
    id: number;
    text: string;
    approval: boolean;
    customer_id: number;
    product_id: number;
    manager_id: number | null;
    createdAt: string;
    updatedAt: string;
    greyedOut: boolean;
    Customer?: {
      id: number;
      firstName: string;
  }
}
interface Rating {
    id: number;
    score: number;
    customer_id: number;
    product_id: number;
    manager_id: number | null;
    approval: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  interface ReviewContextType {
    addComment: (
      productId: number,
      userId: number,
      comment: string
    ) => Promise<Comment | null>;
    addRating: (
      productId: number,
      customerId: number,
      rating: number
    ) => Promise<Rating | null>;
    getApprovedComments: (productId: number) => Promise<Comment[]>;
    getPendingComments: (productId: number) => Promise<Comment[]>;
    approveComment: (commentId: number) => Promise<Comment | null>;
    rejectComment: (commentId: number) => Promise<Comment | null>;
    getUsersRatingForProduct: (
      productID: number,
      customerID: number
    ) => Promise<Rating[]>;
  }
  
  const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
  
  export const ReviewProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const addComment = async (
      productId: number,
      userId: number,
      comment: string
    ): Promise<Comment | null> => {
      try {
        const res = await axios.post(`/api/products/${productId}/comment`, {
          userId,
          comment,
        });
        return {...res.data.comment, greyedOut: true};
      } catch (err) {
        console.error("Add comment error:", err);
        return null;
      }
    };
  
    const addRating = async (
      
      productId: number,
      customerId: number,
      rating: number
    ): Promise<Rating | null> => {
      try {
        const res = await axios.post(`/api/products/${productId}/rating`, {
          customer_id: customerId,
          rating: rating,
        });
        return res.data.rating;
      } catch (err) {
        console.error("Add rating error:", err);
        return null;
      }
    };
  
    const getApprovedComments = async (
      productId: number
    ): Promise<Comment[]> => {
      try {
        const res = await axios.get(`/api/products/${productId}/comments`);
        console.log(res.data.comments);
        return res.data.comments;
      } catch (err) {
        console.error("Fetch comments error:", err);
        return [];
      }
    };

    const getPendingComments = async (
      productId: number
    ): Promise<Comment[]> => {
      try {
        const res = await axios.get(`/api/products/${productId}/comments/pending`);
        console.log(res.data.comments);
        return res.data.comments;
      } catch (err) {
        console.error("Fetch comments error:", err);
        return [];
      }
    };
    
    const getUsersRatingForProduct = async (
      productID: number,
      customerID: number
    ): Promise<Rating[]> => {
      try {
        const res = await axios.get<Rating[]>(`/api/products/${productID}/${customerID}/rating`);
        console.log(res.data[0].score);
        return res.data;
      } catch (err) {
        console.error("Fetch comments error:", err);
        return [];
      }
    };
    
    // Approve Comment
    const approveComment = async (commentId: number): Promise<Comment | null> => {
    try {
      const res = await axios.put(`/api/products/comments/${commentId}/approve`);
      return res.data.comment;
    } catch (err) {
      console.error("Approve comment error:", err);
      return null;
    }
  };
      
      // Reject Comment
  const rejectComment = async (commentId: number): Promise<Comment | null> => {
    try {
      const res = await axios.put(`/api/products/comments/${commentId}/reject`);
      return res.data.comment;
    } catch (err) {
      console.error("Reject comment error:", err);
      return null;
    }
  };
    
  return (
      <ReviewContext.Provider
        value={{
          addComment,
          addRating,
          getApprovedComments,
          approveComment,
          rejectComment,
          getUsersRatingForProduct,
          getPendingComments,
        }}
      >
        {children}
      </ReviewContext.Provider>
    );
  };
  
  export const useReview = (): ReviewContextType => {
    const ctx = useContext(ReviewContext);
    if (!ctx) throw new Error("useReview must be used within ReviewProvider");
    return ctx;
  };
  