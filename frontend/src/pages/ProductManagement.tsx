import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import ProductInventoryItem from '../components/ProductInventoryItem';

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

const mockProducts: Product[] = [
    {
        id: 1,
        name: "Coffee",
        model: "Guatemala",
        serialNumber: "SN7834562",
        description: "Latest smartwatch with health tracking and notifications",
        quantity: 45,
        price: 199.99,
        warranty: "1 year",
        distributor: "Coffee Inc.",
        category: "Coffee",
        cost: 150.00
    },
    {
        id: 2,
        name: "Coffee",
        model: "Arabica",
        serialNumber: "SN9856321",
        description: "Noise cancelling wireless headphones",
        quantity: 30,
        price: 149.99,
        warranty: "2 years",
        distributor: "Coffee Inc.",
        category: "Coffee",
        cost: 125.00
    }
];

const mockCategories: string[] = ["Coffee Beans", "Coffee Machines", "Tea Bags", "Accessories"];

const ProductManagement: React.FC = () => {
    // State for products data
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [stockFilter, setStockFilter] = useState<string>('All');

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
        }, 500);
    }, []);

    const handleEditProduct = (product: Product) => {
        // Handle edit functionality
        console.log('Editing product:', product);
        // Here you would typically open a modal or navigate to an edit page
    };

    const handleDeleteProduct = (productId: number) => {
        // Handle delete functionality
        console.log('Deleting product ID:', productId);
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleAddProduct = () => {
        // Handle add product functionality
        console.log('Adding new product');
        // Here you would typically open a modal or navigate to an add product page
    };

    // Filter products based on search, category, and stock status
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;

        const matchesStock = stockFilter === 'All' ||
            (stockFilter === 'In Stock' && product.quantity > 0) ||
            (stockFilter === 'Out of Stock' && product.quantity === 0);

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa' }}>
            <Row className="mb-4">
                <Col>
                    <h1>Product Management</h1>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                    <Button variant="primary" onClick={handleAddProduct}>
                        Add New Product
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading inventory data...</p>
                </div>
            ) : (
                <>
                    <Card className="mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            <option value="All">All Categories</option>
                                            {mockCategories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Select
                                            value={stockFilter}
                                            onChange={(e) => setStockFilter(e.target.value)}
                                        >
                                            <option value="All">All Stock Status</option>
                                            <option value="In Stock">In Stock</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Model</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map(product => (
                            <ProductInventoryItem
                                key={product.id}
                                product={product}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                            />
                        ))}
                        </tbody>
                    </Table>

                    {filteredProducts.length === 0 && (
                        <div className="text-center p-5">
                            <p>No products match your search criteria.</p>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default ProductManagement;