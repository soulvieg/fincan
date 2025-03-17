import React from 'react';
import { Card, Table } from 'react-bootstrap';
import DeliveryItem from './DeliveryItem';

interface Delivery {
    id: number;
    customerId: number;
    productId: number;
    customer: string;
    quantity: number;
    products: string;
    totalPrice: number;
    status: string;
    address: string;
}

interface DeliveryTableProps {
    deliveries: Delivery[];
    onUpdateStatus: (deliveryId: number) => void;
    onCancel: (deliveryId: number) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({ deliveries, onUpdateStatus, onCancel }) => {
    return (
        <Card className="rounded-border" style={{ backgroundColor: '#fff0e2' }}>
            <Card.Header as="h4" style={{borderBottom: 'none', backgroundColor: 'transparent'}}>Deliveries</Card.Header>
            <Card.Body>
                <Table bordered hover className="custom-table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                    <tr className="rounded-row header-row">
                        <th className="text-center align-middle">Order ID</th>
                        <th className="text-center align-middle">Customer ID</th>
                        <th className="text-center align-middle">Customer</th>
                        <th className="text-center align-middle">Product ID</th>
                        <th className="text-center align-middle">Products</th>
                        <th className="text-center align-middle">Quantity</th>
                        <th className="text-center align-middle">Total Price</th>
                        <th className="text-center align-middle">Status</th>
                        <th className="text-center align-middle">Address</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deliveries.map(delivery => (
                        <DeliveryItem
                            key={delivery.id}
                            delivery={delivery}
                            onUpdateStatus={onUpdateStatus}
                            onCancel={onCancel}
                        />
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default DeliveryTable;