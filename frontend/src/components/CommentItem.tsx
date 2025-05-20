import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

interface CommentItemProps {
  comment: {
    id: number;
    productId: number;
    customerId: number;
    product: string;
    user: string;
    comment: string;
    rating: number;
    status: string;
  };
  onApprove: (commentId: number) => void;
  onReject: (commentId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onApprove, onReject }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [localStatus, setLocalStatus] = useState(comment.status);
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        console.log(status);
        return { color: '#28a745', fontWeight: 'bold' };
      case 'rejected':
        return { color: '#dc3545', fontWeight: 'bold' };
      case 'pending':
        return { color: '#fd7e14', fontWeight: 'bold' };
      default:
        return {};
    }
  };
  
  const getRatingStyle = (rating: number) => {
    if (rating >= 4) {
      return { color: '#28a745' }; // Green for high ratings
    } else if (rating >= 3) {
      return { color: '#fd7e14' }; // Orange for medium ratings
    } else {
      return { color: '#dc3545' }; // Red for low ratings
    }
  };
  
  // Disable actions if the comment is already approved or rejected
  const isActionable = localStatus.toLowerCase() === 'pending';
  
  return (
    <tr
      className="rounded-row"
      style={{ 
        backgroundColor: '#f9f9f9',
        transition: 'all 0.5s ease',
        transform: isHovering ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovering ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
        zIndex: isHovering ? 1 : 'auto'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <td className="text-center align-middle">{comment.id}</td>
      <td className="text-center align-middle">{comment.productId}</td>
      <td className="text-center align-middle">{comment.product}</td>
      <td className="text-center align-middle">{comment.customerId}</td>
      <td className="text-center align-middle">{comment.user}</td>
      <td className="text-center align-middle">{comment.comment}</td>
      <td className="text-center align-middle" style={getRatingStyle(comment.rating)}>{comment.rating}/5</td>
      <td className="text-center align-middle position-relative" style={getStatusStyle(localStatus)}>
        {localStatus}
        {isHovering && isActionable && (
          <div
            className={`action-buttons ${isHovering ? 'visible' : 'invisible'}`}
            style={{
              position: 'absolute',
              left: '88%',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#f9f9f9',
              padding: '0.25rem',
              height: '42px',
              border: '1.4px solid #000',
              borderLeft: 'none',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => {setLocalStatus('Approved'); onApprove(comment.id)}}
              style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              
            >
              <FaCheck size={14}/>
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {setLocalStatus('Rejected'); onReject(comment.id)}}
              style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              
            >
              <FaTimes size={14}/>
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default CommentItem;