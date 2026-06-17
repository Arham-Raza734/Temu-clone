import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Product not found or connection to backend lost.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQtyChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 5);
    const hasHalf = (rating || 5) % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fa-solid fa-star"></i>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<i key={i} className="fa-solid fa-star-half-stroke"></i>);
      } else {
        stars.push(<i key={i} className="fa-regular fa-star"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '15px' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: '#ff5722' }}></i>
        <p style={{ color: '#666', fontWeight: '500' }}>Fetching product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '400px' }}>
        <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '60px', color: '#ef4444', marginBottom: '20px' }}></i>
        <h3 style={{ color: '#1e293b' }}>Product Not Found</h3>
        <p style={{ color: '#64748b', marginTop: '8px' }}>{error || 'The requested item does not exist or has been removed.'}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
          Back to Shopping
        </Link>
      </div>
    );
  }

  const discountPercentage = Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100);

  return (
    <div className="product-detail-container">
      {/* Back button */}
      <div style={{ width: '100%', marginBottom: '-20px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', fontWeight: '600', fontSize: '14px' }}>
          <i className="fa-solid fa-arrow-left"></i> Back to catalog
        </Link>
      </div>

      {/* Gallery Section */}
      <div className="product-detail-gallery">
        <div className="product-detail-image-box">
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="product-detail-info">
        <h1 className="product-detail-title">{product.name}</h1>
        
        <div className="product-detail-rating">
          <div className="rating-stars" style={{ fontSize: '14px', color: '#ff9800', display: 'flex', gap: '2px' }}>
            {renderStars(product.ratingStars)}
          </div>
          <span style={{ fontWeight: '600', color: '#1e293b' }}>{product.ratingStars} / 5</span>
          <span style={{ color: '#64748b' }}>({product.ratingCount.toLocaleString()} reviews)</span>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ color: '#22c55e', fontWeight: '600' }}>{product.salesCount}</span>
        </div>

        <div className="product-detail-price-box">
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#ff5722', marginRight: '4px' }}>Rs.</span>
            <span className="product-detail-price">{product.price.toLocaleString()}</span>
            <span className="product-detail-market-price">Rs. {product.marketPrice.toLocaleString()}</span>
            {discountPercentage > 0 && (
              <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', marginLeft: '12px' }}>
                -{discountPercentage}%
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>
            Flash Deal: prices change quickly.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>Description</h4>
          <p className="product-detail-desc">{product.description}</p>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Quantity:</span>
            <div className="cart-qty-ctrl" style={{ height: '36px' }}>
              <button 
                className="cart-qty-btn" 
                onClick={() => handleQtyChange(quantity - 1)}
                style={{ width: '36px', height: '36px', fontSize: '16px' }}
              >
                -
              </button>
              <span className="cart-qty-val" style={{ padding: '0 15px', fontSize: '15px' }}>{quantity}</span>
              <button 
                className="cart-qty-btn" 
                onClick={() => handleQtyChange(quantity + 1)}
                style={{ width: '36px', height: '36px', fontSize: '16px' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="product-detail-actions">
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary" 
              style={{ flex: 1, height: '48px', justifyContent: 'center', borderRadius: '10px', fontSize: '16px' }}
            >
              <i className="fa-solid fa-cart-shopping" style={{ marginRight: '8px' }}></i> Add to Cart
            </button>
          </div>

          {addedMessage && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.2s' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '18px' }}></i>
              <span>Successfully added {quantity} {quantity === 1 ? 'item' : 'items'} to your shopping cart! <Link to="/cart" style={{ color: '#166534', textDecoration: 'underline', fontWeight: '600' }}>View Cart</Link></span>
            </div>
          )}
        </div>

        {/* Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fa-solid fa-shield-halved" style={{ color: '#22c55e', marginTop: '3px' }}></i>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Security Certified</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Safe checkout and buyer protection</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fa-solid fa-rotate-left" style={{ color: '#22c55e', marginTop: '3px' }}></i>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>90-Day Returns</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Easy returns if unsatisfied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
