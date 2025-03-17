import React from 'react';
import { Button } from 'react-bootstrap';

interface DeliveryItemProps {
    delivery: {
        id: number;
        customer: string;
        products: string;
        status: string;
        quantity: number;
        address: string;
    };
    onUpdateStatus: (deliveryId: number) => void;
    onCancel: () => void;
}

const DeliveryItem: React.FC<DeliveryItemProps> = ({ delivery, onUpdateStatus }) => {
    return (
        <tr>
            <td>{delivery.id}</td>
            <td>{delivery.customer}</td>
            <td>{delivery.products}</td>
            <td>{delivery.status}</td>
            <td>{delivery.address}</td>
            <td>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onUpdateStatus(delivery.id)}
                >
                    Update Status
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {}}
                >
                    Cancel Order
                </Button>
            </td>
        </tr>
    );
};

export default DeliveryItem;