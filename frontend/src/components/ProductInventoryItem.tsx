import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { IoTrashOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import './ProductInventoryItem.css';

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
    onIncrement?: (productId: number) => void;
    onDecrement?: (productId: number) => void;
}

const ProductInventoryItem: React.FC<ProductInventoryItemProps> = ({
                                                                       product,
                                                                       onEdit,
                                                                       onDelete,
                                                                       onIncrement,
                                                                       onDecrement
                                                                   }) => {
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

    const handleIncrement = () => {
        if (onIncrement) {
            onIncrement(product.id);
            setTempQuantity(tempQuantity + 1);
        } else {
            setTempQuantity(tempQuantity + 1);
        }
    };

    const handleDecrement = () => {
        if (tempQuantity > 0) {
            if (onDecrement) {
                onDecrement(product.id);
                setTempQuantity(tempQuantity - 1);
            } else {
                setTempQuantity(tempQuantity - 1);
            }
        }
    };

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
                        <InputGroup style={{ width: '65px' }}>
                            <Form.Control
                                type="number"
                                min="0"
                                autoFocus={true}
                                value={tempQuantity}
                                onChange={(e) => setTempQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                size="sm"
                                className="no-spinners"
                                style={{ textAlign: 'center', fontSize: '14px' }}
                            />
                            <InputGroup.Text className="p-0 d-flex flex-column" style={{ height: '31px' }}>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 m-0"
                                    onClick={handleIncrement}
                                    style={{ height: '15px', lineHeight: '0' }}
                                >
                                    <IoIosArrowUp size={12} />
                                </Button>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 m-0"
                                    onClick={handleDecrement}
                                    disabled={tempQuantity <= 0}
                                    style={{ height: '15px', lineHeight: '0' }}
                                >
                                    <IoIosArrowDown size={12} />
                                </Button>
                            </InputGroup.Text>
                        </InputGroup>
                        <div className="ms-2 d-flex">
                            <Button 
                                variant="outline-success" 
                                size="sm" 
                                onClick={handleSaveQuantity} 
                                style={{ width: '40px', marginRight: '5px' }}
                            >
                                <FaCheck size={14} />
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={handleCancelEdit} 
                                style={{ width: '40px' }}
                            >
                                <FaTimes size={14} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="position-relative">
                        <span>{product.quantity === 0 ? 'Out of stock' : product.quantity}</span>
                        {isHovering && !isEditingQuantity && (
                            <div className={`action-buttons ${isHovering ? 'visible' : 'invisible'}`}
                                style={{
                                    position: 'absolute',
                                    left: '95%',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#f9f9f9',
                                    padding: '0.25rem',
                                    height: '66px',
                                    border: '1.4px solid #000',
                                    borderLeft: 'none',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Button 
                                    variant="outline-warning" 
                                    size="sm" 
                                    onClick={() => setIsEditingQuantity(true)}
                                >
                                    <MdOutlineModeEdit size={16}/>
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={() => onDelete(product.id)}
                                >
                                    <IoTrashOutline size={16}/>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default ProductInventoryItem;