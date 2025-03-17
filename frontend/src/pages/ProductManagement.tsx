import React, { useState } from 'react';
import { Container, Card, Button, Table } from 'react-bootstrap';
import ProductInventoryTable from '../components/ProductInventoryTable';
import DeliveryTable from '../components/DeliveryTable';
import CommentTable from '../components/CommentTable';
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
    warrantyStatus: string;
    distributor: string;
    category: string;
    cost: number;
    image?: string;
}

interface Delivery {
    id: number;
    customerId: number;
    productId: number;
    customer: string;
    quantity: number;
    products: string;
    totalPrice: number;
    status: string;
    address: string;
}

interface Comment {
    id: number;
    productId: number;
    customerId: number;
    product: string;
    user: string;
    comment: string;
    rating: number;
    status: string;
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
        warrantyStatus: "1 year",
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
        warrantyStatus: "6 months",
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
        warrantyStatus: "2 years",
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
        warrantyStatus: "6 months",
        distributor: "Coffee Inc.",
        category: "Regular Beans",
        cost: 12.50
    }
];

// Updated mock data for deliveries with all required fields
const mockDeliveries: Delivery[] = [
    {
        id: 1001,
        customerId: 101,
        productId: 1,
        customer: "John Doe",
        products: "Coffee - Guatemala",
        quantity: 2,
        totalPrice: 399.98,
        status: "Processing",
        address: "123 Main St, Anytown"
    },
    {
        id: 1002,
        customerId: 102,
        productId: 2,
        customer: "Jane Smith",
        products: "Coffee - Arabica",
        quantity: 1,
        totalPrice: 24.99,
        status: "In-Transit",
        address: "456 Oak Ave, Somewhere"
    }
];

const mockComments: Comment[] = [
    {
        id: 1,
        productId: 1,
        customerId: 102,
        product: "Coffee - Guatemala",
        user: "Jane Smith",
        comment: "Great taste and quality!",
        rating: 4.5,
        status: "Pending"
    },
    {
        id: 2,
        productId: 2,
        customerId: 103,
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
    const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
    const [comments, setComments] = useState<Comment[]>(mockComments);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);

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

    // Handler for adding a new product
    const handleAddProduct = () => {
        setShowAddProductModal(true);
        console.log('Opening add product modal');
    };

    // Handler for adding a new category
    const handleAddCategory = () => {
        setShowAddCategoryModal(true);
        console.log('Opening add category modal');
    };

    // Handlers for updating delivery status
    const handleUpdateDeliveryStatus = (deliveryId: number) => {
        console.log('Update status for delivery ID:', deliveryId);
        // Implement status update logic here
    };

    // Handler for canceling an order
    const handleCancelDelivery = (deliveryId: number) => {
        console.log('Cancel delivery with ID:', deliveryId);
        // Implement cancel delivery logic here
    };

    // Handlers for comment approval/rejection
    const handleApproveComment = (commentId: number) => {
        console.log('Approve comment ID:', commentId);
        // Implement comment approval logic here
    };

    const handleRejectComment = (commentId: number) => {
        console.log('Reject comment ID:', commentId);
        // Implement comment rejection logic here
    };

    return (
        <Container>
            <Card className="mb-4 border-0" style={{ backgroundColor: '#e8dace' }}>
                <Card.Body>
                    <Card.Text style={{ fontSize: '30px', textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
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

            <div ref={setStocksElement} className="mb-5">
                <ProductInventoryTable
                    products={products}
                    categories={[]}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onAddProduct={handleAddProduct}
                    onAddCategory={handleAddCategory}
                />
            </div>

            {/* Deliveries Section */}
            <div ref={setDeliveriesElement} className="mb-5">
                <DeliveryTable
                    deliveries={deliveries}
                    onUpdateStatus={handleUpdateDeliveryStatus}
                    onCancel={handleCancelDelivery}
                />
            </div>

            {/* Comments Section */}
            <div ref={setCommentsElement} className="mb-5">
                <CommentTable
                    comments={comments}
                    onApprove={handleApproveComment}
                    onReject={handleRejectComment}
                />
            </div>

        </Container>
    );
};

export default ProductManagement;