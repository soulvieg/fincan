import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

interface NewProductProps {
    onSave: (product: Omit<Product, 'id'>) => void;
    onCancel: () => void;
    categories?: string[];
}

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

const NewProductRow: React.FC<NewProductProps> = ({ onSave, onCancel, categories = [] }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        model: '',
        serialNumber: '',
        description: '',
        quantity: '' as string | number,
        price: '' as string | number,
        warrantyStatus: 'No Warranty',
        distributor: '',
        category: categories.length > 0 ? categories[0] : '',
        cost: 0,
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setNewProduct(prev => ({
            ...prev,
            [name]: (name === 'quantity' || name === 'price')
                ? (value === '' ? '' : value)
                : value
        }));
    };

    const handleSubmit = () => {
        const productToSave = {
            ...newProduct,
            quantity: newProduct.quantity === '' ? 0 : Number(newProduct.quantity),
            price: newProduct.price === '' ? 0 : Number(newProduct.price),
        };
        onSave(productToSave);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const currentInput = event.currentTarget as HTMLInputElement;
            if (!currentInput.checkValidity()) {
                currentInput.reportValidity();
                return;
            }

            const inputs = Array.from(
                event.currentTarget.closest('tr')?.querySelectorAll('input, select') || []
            );

            const currentIndex = inputs.indexOf(event.currentTarget);
            const nextInput = inputs[currentIndex + 1] as HTMLElement;

            if (nextInput) {
                nextInput.focus();
            } else {
                // If at the last input, submit form
                handleSubmit();
            }
        }
    };

    return (
        <tr className="rounded-row position-relative" style={{ backgroundColor: '#e9f7ef' }}>
            <td className="text-center align-middle">ID</td>
            <td className="text-center align-middle">
                <Form.Control
                    type="text"
                    name="name"
                    autoFocus={true}
                    value={newProduct.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    pattern="[A-Za-z\s]+"
                    required
                />
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    type="text"
                    name="model"
                    value={newProduct.model}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    pattern="[A-Za-z0-9\s]+"
                    required
                />
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    // Check for letter inclusion
                    pattern="[A-Za-z0-9\s]+"
                    required
                />
            </td>
            <td className="text-center align-middle">
                <Form.Select
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    required
                >
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))
                    ) : (
                        <option value="">No categories available</option>
                    )}
                </Form.Select>
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    type="text"
                    name="serialNumber"
                    value={newProduct.serialNumber}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    pattern="^[A-Z]{2}[0-9]{6}$"
                    required
                />
            </td>
            <td className="text-center align-middle">
                <Form.Select
                    name="warrantyStatus"
                    value={newProduct.warrantyStatus}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                >
                    <option value="No Warranty">No Warranty</option>
                    <option value="1 Year">1 Year</option>
                    <option value="3 Years">3 Years</option>
                </Form.Select>
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    type="text"
                    name="distributor"
                    value={newProduct.distributor}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    pattern="[A-Za-z0-9\s]+"
                    required
                />
            </td>
            <td className="text-center align-middle">
                <div className="input-group input-group-sm">
                    <span className="input-group-text">$</span>
                    <Form.Control
                        type="text"
                        name="price"
                        value={newProduct.price}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        size="sm"
                        min="0"
                        pattern="[0-9]+"
                        required
                    />
                </div>
            </td>
            <td className="text-center align-middle">
                <Form.Control
                    type="number"
                    name="quantity"
                    placeholder={'0'}
                    value={newProduct.quantity}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    size="sm"
                    min="0"
                    required
                />
            </td>
                <div className="d-flex align-items-center justify-content-center gap-2 action-buttons"
                     style={{
                         position: 'absolute',
                         right: '-100px',
                         top: '0',
                         bottom: '0',
                         height: '100%',
                         outline: '1px solid #666',
                     }}>
                    <Button variant="outline-success" size="sm" onClick={handleSubmit}>
                        <IoCheckmarkOutline size={22}/>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={onCancel}>
                        <IoCloseOutline size={22}/>
                    </Button>
                </div>
        </tr>
    );
};

export default NewProductRow;