import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ cartCount, searchInput, setSearchInput }) => {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    // If we're not on the home page, redirect to home to show search results
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header>
      <div className="navbar1">
        <a href="#" className="box1 a1">
          <i className="fa-regular fa-truck delivery-icon"></i>
          <div className="content1">
            <p>Free shipping on all orders<i className="fa-solid fa-chevron-right"></i></p>
            <p className="s-text">Limited-time offer</p>
          </div>
        </a>
        <div className="glowline"></div>
        <a href="#" className="box2 a2">
          <i className="fa-regular fa-square-check icon"></i>
          <div className="content1">
            <p>Delivery guarantee</p>
            <p className="s-text">Refund for any issues</p>
          </div>
        </a>
        <div className="glowline"></div>
        <a href="#" className="box2 a2">
          <i className="fa-solid fa-mobile-screen-button icon"></i>
          <p className="content1">Get the Temu App</p>
        </a>
        <div className="glowline"></div>
        <Link to="/admin" className="box2 a2" style={{ color: '#ffeb3b' }}>
          <i className="fa-solid fa-user-shield icon" style={{ color: '#ffeb3b', marginRight: '6px' }}></i>
          <p className="content1">Admin Panel</p>
        </Link>
      </div>

      <div className="navbar2">
        <Link to="/" className="logo"></Link>
        <Link to="/" className="box2-nav2 a3">
          <i className="fa-solid fa-thumbs-up like-icon"></i>
          <p className="content2">Best-Selling Items</p>
        </Link>
        <Link to="/" className="box3-nav2 a3">
          <i className="fa-solid fa-star-half-stroke star-icon"></i>
          <p className="content2">5-Star Rated</p>
        </Link>
        <Link to="/" className="box4-nav2 a3">
          <p className="content2">New In</p>
        </Link>
        <div className="box5-nav2 a3" style={{ cursor: 'pointer' }}>
          <p className="content2">Categories <i className="fa-solid fa-chevron-down"></i></p>
        </div>
        <div className="nav-search">
          <input
            placeholder="Search Temu"
            id="search-input"
            value={searchInput}
            onChange={handleSearchChange}
          />
          <a href="#" className="search-button a3" onClick={(e) => e.preventDefault()}>
            <i className="fa-solid fa-magnifying-glass search-icon" style={{ color: '#ffffff' }}></i>
          </a>
        </div>
        <Link to="/admin" className="box7-nav2 a3">
          <i className="fa-regular fa-user person-icon"></i>
          <p className="content2">Orders &<br />Accounts</p>
        </Link>
        <div className="box8-nav2 a3" style={{ cursor: 'pointer' }}>
          <i className="fa-regular fa-comment support-icon"></i>
          <p className="content2">Support</p>
        </div>
        <Link to="/cart" className="box9-nav2 a3">
          <i className="fa-solid fa-cart-shopping cart-icon"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Header;
