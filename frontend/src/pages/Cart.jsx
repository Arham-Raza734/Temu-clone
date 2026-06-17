import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, onUpdateQty, onRemoveItem }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalMarketPrice = cartItems.reduce((acc, item) => acc + item.marketPrice * item.quantity, 0);
  const totalSavings = totalMarketPrice - subtotal;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart ({cartItems.length} items)</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="fa-solid fa-cart-shopping" style={{ fontSize: '60px', color: '#cbd5e1', marginBottom: '20px' }}></i>
          <h2>Your cart is empty</h2>
          <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '24px' }}>
            Find hot deals and stock up on best-sellers today!
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart items list */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-info">
                  <Link to={`/product/${item._id}`} className="cart-item-title">
                    {item.name}
                  </Link>
                  
                  <div className="cart-item-price-row">
                    <div>
                      <span style={{ fontWeight: '700', color: '#ff5722', fontSize: '15px' }}>Rs. {item.price.toLocaleString()}</span>
                      <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                        Rs. {item.marketPrice.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="cart-qty-ctrl">
                        <button 
                          className="cart-qty-btn"
                          onClick={() => onUpdateQty(item._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button 
                          className="cart-qty-btn"
                          onClick={() => onUpdateQty(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => onRemoveItem(item._id)}
                        className="btn-icon btn-delete-icon"
                        title="Remove item"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart summary */}
          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                <span style={{ fontWeight: '500' }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>FREE</span>
              </div>

              {totalSavings > 0 && (
                <div className="summary-row" style={{ color: '#22c55e' }}>
                  <span>Your Savings</span>
                  <span style={{ fontWeight: '600' }}>- Rs. {totalSavings.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>

              <button 
                onClick={() => alert('Checkout flow simulated! Thanks for testing this Temu MERN application.')}
                className="btn btn-primary" 
                style={{ width: '100%', height: '44px', justifyContent: 'center', marginTop: '20px', borderRadius: '10px', fontSize: '15px' }}
              >
                Proceed to Checkout
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <img src="/secure-icon (1).png" style={{ height: '20px', opacity: 0.5, margin: '0 4px' }} alt="trust" />
                <img src="/secure-icon (2).png" style={{ height: '20px', opacity: 0.5, margin: '0 4px' }} alt="trust" />
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                  All orders are backed by Temu Purchase Protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
