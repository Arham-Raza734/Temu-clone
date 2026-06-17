import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('temu_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('temu_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cartItems]);

  // Handler to add item to cart
  const handleAddToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      
      if (existingItem) {
        // Update quantity
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  // Handler to update item quantity in cart
  const handleUpdateQty = (itemId, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Handler to remove item from cart
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          cartCount={totalCartCount} 
          searchInput={searchInput} 
          setSearchInput={setSearchInput}
        />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  searchInput={searchInput} 
                  onAddToCart={handleAddToCart}
                />
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProductDetail 
                  onAddToCart={handleAddToCart}
                />
              } 
            />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cartItems={cartItems} 
                  onUpdateQty={handleUpdateQty} 
                  onRemoveItem={handleRemoveItem}
                />
              } 
            />
            <Route 
              path="/admin" 
              element={<Admin />} 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
