import React, { useState } from 'react';
import { Container, Card, Button, Table } from 'react-bootstrap';
import ProductInventoryItem from '../components/ProductInventoryItem';
import { FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { VscCommentDiscussion } from "react-icons/vsc";


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

// Mock data for the page
const mockProducts: Product[] = [
    {
        id: 1,
        name: "Coffee",
        model: "Guatemala",
        serialNumber: "SN7834562",
        description: "Premium coffee beans with rich aroma",
        quantity: 45,
        price: 199.99,
        warranty: "1 year",
        distributor: "Coffee Inc.",
        category: "Premium Beans",
        cost: 150.00
    },
    {
        id: 2,
        name: "Coffee",
        model: "Arabica",
        serialNumber: "SN9856321",
        description: "Premium coffee beans with rich aroma",
        quantity: 5,
        price: 24.99,
        warranty: "6 months",
        distributor: "Coffee Inc.",
        category: "Regular Beans",
        cost: 12.50
    },
    {
        id: 3,
        name: "Coffee Maker",
        model: "Pro Brewer",
        serialNumber: "SN3456789",
        description: "Professional coffee brewing machine",
        quantity: 0,
        price: 349.99,
        warranty: "2 years",
        distributor: "Coffee Equipment Co.",
        category: "Equipment",
        cost: 200.00
    },
    {
        id: 4,
        name: "Coffee",
        model: "Bolivia",
        serialNumber: "SN9856324",
        description: "Premium coffee beans with rich aroma",
        quantity: 5,
        price: 24.99,
        warranty: "6 months",
        distributor: "Coffee Inc.",
        category: "Regular Beans",
        cost: 12.50
    }
];

// Mock data for deliveries and comments
const mockDeliveries = [
    {
        id: 1001,
        customer: "John Doe",
        products: "Coffee - Guatemala (2)",
        status: "Processing",
        address: "123 Main St, Anytown"
    },
    {
        id: 1002,
        customer: "Jane Smith",
        products: "Coffee - Arabica (1)",
        status: "In-Transit",
        address: "456 Oak Ave, Somewhere"
    }
];

const mockComments = [
    {
        id: 1,
        product: "Coffee - Guatemala",
        user: "Jane Smith",
        comment: "Great taste and quality!",
        rating: 4.5,
        status: "Pending"
    },
    {
        id: 2,
        product: "Coffee - Arabica",
        user: "Mike Johnson",
        comment: "Excellent aroma, would buy again.",
        rating: 5,
        status: "Pending"
    }
];

const ProductManagement: React.FC = () => {
    const [stocksElement, setStocksElement] = useState<HTMLDivElement | null>(null);
    const [deliveriesElement, setDeliveriesElement] = useState<HTMLDivElement | null>(null);
    const [commentsElement, setCommentsElement] = useState<HTMLDivElement | null>(null);

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    // Function to handle scrolling to sections
    const scrollToSection = (element: HTMLDivElement | null) => {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handler for editing a product
    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
        console.log('Edit product:', product);
    };

    // Handler for deleting a product
    const handleDeleteProduct = (productId: number) => {
        setProducts(products.filter(p => p.id !== productId));
        console.log('Delete product with ID:', productId);
    };

    return (
        <Container>
            <Card className="mb-4 border-0" style={{ backgroundColor: '#e8dace' }}>
                <Card.Body>
                    <Card.Text style={{ fontSize: '30px', textAlign: 'center',marginTop:'40px', marginBottom: '60px' }}>
                        What would you like to do?
                    </Card.Text>
                    {/* Navigation Buttons */}
                    <div className="d-flex gap-3 mt-3 justify-content-center" style={{ marginBottom: '240px' }}>
                        <Button
                            variant="primary"
                            onClick={() => scrollToSection(stocksElement)}
                            style={{ width: '250px', height: '280px', backgroundColor: '#fff0e2', color: 'black', borderColor: 'black', borderRadius: '38px', fontSize: '24px', fontWeight: 'semibold', }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                <FaBoxOpen style={{ fontSize: '100px' }} />
                            </div>
                            Manage Stocks
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => scrollToSection(deliveriesElement)}
                            style={{ width: '250px', height: '280px', backgroundColor: '#fff0e2', color: 'black', borderColor: 'black', borderRadius: '38px', fontSize: '24px', fontWeight: 'semibold', }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                <TbTruckDelivery style={{ fontSize: '100px' }} />
                            </div>
                            Manage Deliveries
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => scrollToSection(commentsElement)}
                            style={{ width: '250px', height: '280px', backgroundColor: '#fff0e2', color: 'black', borderColor: 'black', borderRadius: '38px', fontSize: '24px', fontWeight: 'semibold', }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                <VscCommentDiscussion style={{ fontSize: '100px' }} />
                            </div>
                            Manage Comments
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Stocks Section */}
            <div ref={setStocksElement} className="mb-5">
                <Card className="rounded-border" style={{backgroundColor: '#fff0e2'}}>
                    <Card.Header as="h4">Product Inventory</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Model</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => (
                                <ProductInventoryItem
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                />
                            ))}
                            </tbody>
                        </Table>
                        <Button variant="outline-success" className="me-3">Add Product</Button>
                        <Button variant="outline-primary">Add New Category</Button>
                    </Card.Body>
                </Card>
            </div>

            {/* Deliveries Section */}
            <div ref={setDeliveriesElement} className="mb-5">
                <Card className="rounded-border" style={{backgroundColor: '#fff0e2'}}>
                    <Card.Header as="h4">Deliveries</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mockDeliveries.map(delivery => (
                                <tr key={delivery.id}>
                                    <td>{delivery.id}</td>
                                    <td>{delivery.customer}</td>
                                    <td>{delivery.products}</td>
                                    <td>{delivery.status}</td>
                                    <td>
                                        <Button variant="primary" size="sm">Update Status</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>

            {/* Comments Section */}
            <div ref={setCommentsElement} className="mb-5">
                <Card className="rounded-border" style={{backgroundColor: '#fff0e2'}}>
                    <Card.Header as="h4">Comments</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>User</th>
                                <th>Comment</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mockComments.map(comment => (
                                <tr key={comment.id}>
                                    <td>{comment.product}</td>
                                    <td>{comment.user}</td>
                                    <td>{comment.comment}</td>
                                    <td>{comment.rating}/5</td>
                                    <td>
                                        <Button variant="success" size="sm" className="me-2">Approve</Button>
                                        <Button variant="danger" size="sm">Reject</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default ProductManagement;