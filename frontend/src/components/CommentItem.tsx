import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

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

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
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
    const isActionable = comment.status.toLowerCase() === 'pending';

    return (
        <tr
            className="rounded-row position-relative"
            style={{ backgroundColor: '#f9f9f9' }}
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
            <td className="text-center align-middle" style={getStatusStyle(comment.status)}>{comment.status}</td>

            {isHovering && isActionable && (
                <div className="position-absolute d-flex align-items-center justify-content-center gap-2 action-buttons"
                     style={{
                         right: '-100px',
                         top: '0',
                         bottom: '0',
                         height: '100%',
                         outline: '1px solid #666',
                     }}>
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => onApprove(comment.id)}
                    >
                        <IoCheckmarkCircleOutline size={22}/>
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onReject(comment.id)}
                    >
                        <IoCloseCircleOutline size={22}/>
                    </Button>
                </div>
            )}
        </tr>
    );
};

export default CommentItem;