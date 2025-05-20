import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import CommentItem from './CommentItem';
import { useReview } from '../contexts/ReviewContext';
interface Comment {
    id: number;
    productId: number;
    customerId: number;
    product: string;
    user: string;
    comment: string;
    rating: number;
    status: string;
}

interface CommentTableProps {
    comments: Comment[];
    onApprove: (commentId: number) => void;
    onReject: (commentId: number) => void;
}

const CommentTable: React.FC<CommentTableProps> = ({ comments, onApprove, onReject}) => {
    const { approveComment, rejectComment } = useReview();
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  
  const handleApprove = async (commentId: number) => {
    const updated = await approveComment(commentId);
    if (updated) {
      setLocalComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, status: 'Approved' } : comment
        )
      );
    }
  };

  const handleReject = async (commentId: number) => {
    const updated = await rejectComment(commentId);
    if (updated) {
      setLocalComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, status: 'Rejected' } : comment
        )
      );
    }
  };
    return (
        <Card className="rounded-border" style={{ backgroundColor: '#fff0e2' }}>
            <Card.Header as="h4" style={{borderBottom: 'none', backgroundColor: 'transparent'}}>Comments</Card.Header>
            <Card.Body>
                <Table bordered hover className="custom-table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                    <tr className="rounded-row header-row">
                        <th className="text-center align-middle">Comment ID</th>
                        <th className="text-center align-middle">Product ID</th>
                        <th className="text-center align-middle">Product</th>
                        <th className="text-center align-middle">Customer ID</th>
                        <th className="text-center align-middle">User</th>
                        <th className="text-center align-middle">Comment</th>
                        <th className="text-center align-middle">Rating</th>
                        <th className="text-center align-middle">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {localComments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default CommentTable;