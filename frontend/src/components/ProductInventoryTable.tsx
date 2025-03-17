import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import ProductInventoryItem from './ProductInventoryItem';
import NewProductRow from './NewProductRow';
import { useNavigate } from 'react-router-dom';

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

interface ProductInventoryTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onAddCategory: () => void;
    categories: string[];
}

const ProductInventoryTable: React.FC<ProductInventoryTableProps> = ({
                                                                         products,
                                                                         onEdit,
                                                                         onDelete,
                                                                         onAddProduct,
                                                                         onAddCategory,
                                                                         categories
                                                                     }) => {
    const navigate = useNavigate();
    const [showNewProductRow, setShowNewProductRow] = useState(false);

    const handleAddProductClick = () => {
        setShowNewProductRow(true);
    };

    const handleSaveProduct = (newProduct: Omit<Product, 'id'>) => {
        onAddProduct(newProduct);
        setShowNewProductRow(false);
    };

    const handleCancelAddProduct = () => {
        setShowNewProductRow(false);
    };

    return (
        <Card className="rounded-border" style={{backgroundColor: '#fff0e2'}}>
            <div className="d-flex align-items-end mb-1 mt-2 justify-content-between">
                <Card.Header as="h4" style={{borderBottom: 'none', backgroundColor: 'transparent'}}>Product Inventory</Card.Header>
                <div>
                    <Button
                        variant="outline-success"
                        style={{ fontSize: '15px', padding: '5px 10px' }}
                        size='sm'
                        className="me-2 add-button"
                        onClick={handleAddProductClick}
                        disabled={showNewProductRow}>
                        Add New Product
                    </Button>
                    <Button
                        variant="outline-dark"
                        style={{ fontSize: '15px', padding: '5px 10px' }}
                        size="sm"
                        className="me-3 add-button"
                        onClick={onAddCategory}>
                        Add New Category
                    </Button>
                </div>
            </div>
            <Card.Body>
                <Table bordered hover className="custom-table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                    <tr className="rounded-row header-row">
                        <th className="text-center align-middle">Product ID</th>
                        <th className="text-center align-middle">Name</th>
                        <th className="text-center align-middle">Model</th>
                        <th className="text-center align-middle">Description</th>
                        <th className="text-center align-middle">Category</th>
                        <th className="text-center align-middle">Serial Number</th>
                        <th className="text-center align-middle">Warranty Status</th>
                        <th className="text-center align-middle">Distributor</th>
                        <th className="text-center align-middle">Price</th>
                        <th className="text-center align-middle">Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <ProductInventoryItem
                            key={product.id}
                            product={product}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {showNewProductRow && (
                        <NewProductRow
                            onSave={handleSaveProduct}
                            onCancel={handleCancelAddProduct}
                            categories={categories}
                        />
                    )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default ProductInventoryTable;