import React from 'react';
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
    const getQuantityStyle = (quantity: number) => {
        return quantity <= 5 ? { color: 'red', fontWeight: 'bold' } : {};
    };

    return (
        <tr className="rounded-row" style={{ backgroundColor: '#f9f9f9' }}>
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
            <td className="text-center align-middle">
                <Button variant="outline-warning" size="sm" onClick={() => onEdit(product)}>
                    <MdOutlineModeEdit size={24}/>
                </Button>
            </td>
            <td className="text-center align-middle">
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(product.id)}>
                    <IoTrashOutline size={24}/>
                </Button>
            </td>
        </tr>
    );
};

export default ProductInventoryItem;