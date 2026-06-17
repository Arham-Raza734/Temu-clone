import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation(); // Don't trigger card click
    onAddToCart(product);
  };

  // Render stars dynamically based on ratings
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

  // Split sales count string into prefix and 'sold' literal to allow exact margin-left styles
  const rawSalesCount = product.salesCount || '0 sold';
  const salesNumber = rawSalesCount.replace(' sold', '').trim();

  return (
    <div className="box" onClick={handleCardClick}>
      <div className="box-image">
        <div className="image" style={{ backgroundImage: `url("${product.image}")` }}></div>
      </div>
      <p className="content3">{product.name}</p>
      
      <div className="sale-info">
        <div className="price">
          <span className="currency">Rs.</span>
          <span className="current-price">{product.price.toLocaleString()}</span>
        </div>
        <div className="price-2">
          <span className="market-price">{product.marketPrice.toLocaleString()}</span>{' '}
          <span>{salesNumber}</span>{' '}
          <span>sold</span>
        </div>
      </div>

      <div className="cart" onClick={handleCartClick}>
        <i className="fa-solid fa-cart-plus cart-icon"></i>
      </div>

      <div className="rating">
        <div className="rating-stars">
          {renderStars(product.ratingStars)}
        </div>
        <span>{product.ratingCount > 0 ? product.ratingCount.toLocaleString() : ''}</span>
      </div>
    </div>
  );
};

export default ProductCard;
