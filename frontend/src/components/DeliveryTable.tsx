import React from 'react';
import { Card, Table } from 'react-bootstrap';
import DeliveryItem from './DeliveryItem';

interface Delivery {
    id: number;
    customer: string;
    products: string;
    status: string;
    address: string;
}

interface DeliveryTableProps {
    deliveries: Delivery[];
    onUpdateStatus: (deliveryId: number) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({ deliveries, onUpdateStatus }) => {
    return (
        <Card className="rounded-border" style={{ backgroundColor: '#fff0e2' }}>
            <Card.Header as="h4">Deliveries</Card.Header>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deliveries.map(delivery => (
                        <DeliveryItem
                            key={delivery.id}
                            delivery={delivery}
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default DeliveryTable;