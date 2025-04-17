import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import './ProductPage.css';

const Wishlist: React.FC = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();

    const handleRemoveFromWishlist = (productId: number) => {
        removeFromWishlist(productId);
    };

    const handleViewProduct = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    if (wishlist.length === 0) {
        return (
            <Container className="product-page">
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h4" sx={{ color: '#4a756e', mb: 2 }}>
                        Your Wishlist is Empty
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                        Start adding your favorite products to your wishlist!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                        sx={{
                            bgcolor: '#4a756e',
                            '&:hover': { bgcolor: '#3a655e' },
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        Browse Products
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container className="product-page">
            <Typography variant="h4" sx={{ color: '#4a756e', mb: 4, textAlign: 'center' }}>
                Your Wishlist
            </Typography>
            <div className="product-list">
                {wishlist.map((item) => (
                    <div key={item.productId} className="product-card">
                        <div className="product-rating">
                            <StarIcon className="star-icon" />
                            <span>4.5</span>
                        </div>
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p className="product-price">${item.price.toFixed(2)}</p>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => handleViewProduct(item.productId)}
                                sx={{
                                    bgcolor: '#4a756e',
                                    '&:hover': { bgcolor: '#3a655e' },
                                    fontSize: '12px',
                                    px: 1.5,
                                    py: 0.5,
                                }}
                            >
                                View Details
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleRemoveFromWishlist(item.productId)}
                                sx={{
                                    bgcolor: '#ff4081',
                                    '&:hover': { bgcolor: '#f50057' },
                                    fontSize: '12px',
                                    px: 1.5,
                                    py: 0.5,
                                }}
                            >
                                Remove from wishlist
                            </Button>
                        </Box>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default Wishlist;