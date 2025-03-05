import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';

interface Product {
    id: number;
    name: string;
    model: string;
    serialNumber: string;
    description: string;
    quantity: number;
    price: number;
    warranty: string;
    distributor: string;
    category: string;
    cost: number;
    image?: string;
}

interface ProductInventoryItemProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
}

const ProductInventoryItem: React.FC<ProductInventoryItemProps> = ({
                                                                       product,
                                                                       onEdit,
                                                                       onDelete
                                                                   }) => {
    const handleEdit = () => {
        onEdit(product);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${product.name} (${product.model})?`)) {
            onDelete(product.id);
        }
    };

    // Inline styles for immediate effect
    const rowStyle = {
        backgroundColor: product.id % 2 === 0 ? '#fff0e2' : '#ffffff'
    };

    const actionContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const buttonStyle = {
        margin: '0 3px'
    };

    return (
        <tr style={rowStyle}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.model}</td>
            <td>{product.category}</td>
            <td>
                {product.quantity === 0 ? (
                    <Badge bg="danger">Out of Stock!</Badge>
                ) : product.quantity < 10 ? (
                    <Badge bg="warning" text="dark">Low Stock({product.quantity})</Badge>
                ) : (
                    product.quantity
                )}
            </td>
            <td>${product.price.toFixed(2)}</td>
            <td>
                <div style={actionContainerStyle}>
                    <Button
                        variant="warning"
                        size="sm"
                        style={buttonStyle}
                        onClick={handleEdit}
                        aria-label="Edit product"
                    >
                        <Pencil size={18}/>
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        style={buttonStyle}
                        onClick={handleDelete}
                        aria-label="Delete product"
                    >
                        <Trash size={18}/>
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default ProductInventoryItem;