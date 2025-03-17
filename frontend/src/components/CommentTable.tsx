import React from 'react';
import { Card, Table } from 'react-bootstrap';
import CommentItem from './CommentItem';

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

const CommentTable: React.FC<CommentTableProps> = ({ comments, onApprove, onReject }) => {
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
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onApprove={onApprove}
                            onReject={onReject}
                        />
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default CommentTable;