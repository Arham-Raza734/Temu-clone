import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = ({ searchInput, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // If there's a search term, fetch with search parameter
        const endpoint = searchInput 
          ? `${API_URL}/products?search=${encodeURIComponent(searchInput)}`
          : `${API_URL}/products`;
        
        const response = await axios.get(endpoint);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Could not connect to the backend server. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchInput]);

  return (
    <div className="main-content">
      <div className="result">
        <div>
          {searchInput ? `Search results for "${searchInput}"` : "Recommended Items"}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 'normal', color: '#666' }}>
          Showing {products.length} products
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '15px' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: '#ff5722' }}></i>
          <p style={{ color: '#666', fontWeight: '500' }}>Loading awesome deals for you...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff2ee', borderRadius: '12px', border: '1px solid #ffdddd', margin: '20px 0' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '50px', color: '#ff5722', marginBottom: '15px' }}></i>
          <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>Connection Error</h3>
          <p style={{ color: '#555', maxWidth: '500px', margin: '0 auto 20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
            style={{ padding: '8px 20px' }}
          >
            Retry Connection
          </button>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
          <i className="fa-regular fa-face-frown" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }}></i>
          <h3>No Products Found</h3>
          <p style={{ marginTop: '8px' }}>We couldn't find any items matching your request. Try another search term!</p>
        </div>
      ) : (
        <div className="auto-fitgoods">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
