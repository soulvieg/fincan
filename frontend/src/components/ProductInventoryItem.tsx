import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";


interface Product {
    id: number;
    name: string;
    model: string;
    serialNumber: string;
    description: string;
    quantity: number;
    price: number;
    warrantyStatus: string;
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

const ProductInventoryItem: React.FC<ProductInventoryItemProps> = ({ product, onEdit, onDelete }) => {
    const [isHovering, setIsHovering] = useState(false);

    const getQuantityStyle = (quantity: number) => {
        return quantity <= 5 ? { color: 'red', fontWeight: 'bold' } : {};
    };

    return (
        <tr
            className="rounded-row position-relative"
            style={{ backgroundColor: '#f9f9f9' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <td className="text-center align-middle">{product.id}</td>
            <td className="text-center align-middle">{product.name}</td>
            <td className="text-center align-middle">{product.model}</td>
            <td className="text-center align-middle">{product.description}</td>
            <td className="text-center align-middle">{product.category}</td>
            <td className="text-center align-middle">{product.serialNumber}</td>
            <td className="text-center align-middle">{product.warrantyStatus}</td>
            <td className="text-center align-middle">{product.distributor}</td>
            <td className="text-center align-middle">${product.price.toFixed(2)}</td>
            <td className="text-center align-middle" style={getQuantityStyle(product.quantity)}>
                {product.quantity === 0 ? 'Out of stock' : product.quantity}
            </td>
            {isHovering && (
                <div className="position-absolute d-flex align-items-center justify-content-center gap-2 action-buttons"
                     style={{
                         right: '-100px',
                         top: '0',
                         bottom: '0',
                         height: '100%',
                         outline: '1px solid #666',
                     }}>
                    <Button variant="outline-warning" size="sm" onClick={() => onEdit(product)}>
                        <MdOutlineModeEdit size={22}/>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(product.id)}>
                        <IoTrashOutline size={22}/>
                    </Button>
                </div>
            )}
        </tr>
    );
};

export default ProductInventoryItem;