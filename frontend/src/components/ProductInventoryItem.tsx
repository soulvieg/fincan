import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
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
    const [isEditingQuantity, setIsEditingQuantity] = useState(false);
    const [tempQuantity, setTempQuantity] = useState(product.quantity);

    const getQuantityStyle = (quantity: number) => {
        return quantity <= 10 ? { color: 'red', fontWeight: '300px' } : {};
    };

    const handleSaveQuantity = () => {
        onEdit({ ...product, quantity: tempQuantity });
        setIsEditingQuantity(false);
    };

    const handleCancelEdit = () => {
        setTempQuantity(product.quantity);
        setIsEditingQuantity(false);
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
                {isEditingQuantity ? (
                    <div className="d-flex align-items-center">
                        <Form.Control
                            type="number"
                            min="0"
                            autoFocus={true}
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                            size="sm"
                            style={{ width: '65px', textAlign: 'center', fontSize: '14px' }}
                        />
                        <div className="ms-2 d-flex flex-column">
                            <Button variant="success" size="sm" onClick={handleSaveQuantity} style={{ width: '65px', marginBottom: '5px' }}>
                                Save
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={handleCancelEdit} style={{ width: '65px' }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    product.quantity === 0 ? 'Out of stock' : product.quantity
                )}
            </td>
            {isHovering && !isEditingQuantity && (
                <div className="position-absolute d-flex align-items-center justify-content-center gap-2 action-buttons"
                     style={{
                         right: '-100px',
                         top: '0',
                         bottom: '0',
                         height: '100%',
                         outline: '1px solid #666',
                     }}>
                    <Button variant="outline-warning" size="sm" onClick={() => setIsEditingQuantity(true)}>
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