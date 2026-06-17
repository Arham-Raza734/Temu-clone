import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form / Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null); // null means "Create mode", otherwise ID of product being edited
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    marketPrice: '',
    salesCount: '0 sold',
    ratingStars: '5',
    ratingCount: '0',
    image: '/image (1).jpg',
  });
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not fetch products. Please ensure the backend server is running and database is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculations
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 
    ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts)
    : 0;
  const highRatedCount = products.filter((p) => p.ratingStars >= 4.6).length;

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle local file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append('image', file);
    setUploading(true);
    setFormError(null);

    try {
      const response = await axios.post(`${API_URL}/products/upload`, fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({
        ...formData,
        image: response.data.imageUrl,
      });
    } catch (err) {
      console.error('Upload error:', err);
      setFormError(err.response?.data?.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  // Open Modal (Create Mode)
  const openCreateModal = () => {
    setEditProductId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      marketPrice: '',
      salesCount: '0 sold',
      ratingStars: '5',
      ratingCount: '0',
      image: '/image (1).jpg',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Modal (Edit Mode)
  const openEditModal = (product) => {
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      marketPrice: product.marketPrice.toString(),
      salesCount: product.salesCount,
      ratingStars: product.ratingStars.toString(),
      ratingCount: product.ratingCount.toString(),
      image: product.image,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!formData.name.trim() || !formData.description.trim() || !formData.image.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const priceNum = Number(formData.price);
    const marketPriceNum = Number(formData.marketPrice);
    if (isNaN(priceNum) || priceNum <= 0 || isNaN(marketPriceNum) || marketPriceNum <= 0) {
      setFormError('Price values must be valid positive numbers.');
      return;
    }

    const payload = {
      ...formData,
      price: priceNum,
      marketPrice: marketPriceNum,
      ratingStars: parseFloat(formData.ratingStars) || 5,
      ratingCount: Number(formData.ratingCount) || 0,
    };

    try {
      if (editProductId) {
        // Update product
        await axios.put(`${API_URL}/products/${editProductId}`, payload);
        showSuccess('Product updated successfully!');
      } else {
        // Create product
        await axios.post(`${API_URL}/products`, payload);
        showSuccess('New product created successfully!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError(err.response?.data?.message || 'Error occurred while saving the product.');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API_URL}/products/${id}`);
      showSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Render stars helper
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

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Manage products, edit details, and track performance indicators</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fa-solid fa-plus"></i> Add New Product
        </button>
      </div>

      {successMessage && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', animation: 'fadeIn 0.2s' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '18px' }}></i>
          <span style={{ fontWeight: '500' }}>{successMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h3>Total Catalog Items</h3>
            <div className="metric-value">{totalProducts}</div>
          </div>
          <div className="metric-icon blue">
            <i className="fa-solid fa-box"></i>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h3>Average Price</h3>
            <div className="metric-value">Rs. {avgPrice.toLocaleString()}</div>
          </div>
          <div className="metric-icon orange">
            <i className="fa-solid fa-tag"></i>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-info">
            <h3>High Rated Items (4.6+)</h3>
            <div className="metric-value">{highRatedCount}</div>
          </div>
          <div className="metric-icon green">
            <i className="fa-solid fa-star"></i>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="table-header">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Product Inventory</h3>
          <div className="table-search">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fa-solid fa-magnifying-glass table-search-icon"></i>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', flexDirection: 'column', gap: '15px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '30px', color: '#ff5722' }}></i>
            <p style={{ color: '#64748b' }}>Refreshing inventory details...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#dc2626' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-regular fa-face-frown" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
            <p>No products found in database.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Pricing</th>
                  <th>Sales Status</th>
                  <th>Ratings</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="prod-thumbnail-cell">
                        <img src={product.image} className="prod-thumbnail" alt={product.name} />
                        <div>
                          <div className="prod-name" title={product.name}>{product.name}</div>
                          <div className="prod-desc-cell">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="price-tag">Rs. {product.price.toLocaleString()}</span>
                      <span className="market-price-tag">Rs. {product.marketPrice.toLocaleString()}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '500', color: '#475569' }}>{product.salesCount}</span>
                    </td>
                    <td>
                      <div className="rating-badge">
                        <i className="fa-solid fa-star" style={{ color: '#eab308' }}></i>
                        <span>{product.ratingStars}</span>
                        <span style={{ color: '#a1a1aa', fontWeight: 'normal' }}>({product.ratingCount})</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(product)}
                          className="btn-icon btn-edit-icon"
                          title="Edit details"
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="btn-icon btn-delete-icon"
                          title="Delete product"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editProductId ? 'Edit Product Details' : 'Create New Product'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
                    {formError}
                  </div>
                )}

                <div className="form-group">
                  <label>Product Name / Title *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter short, descriptive title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter details, features, specifications..."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Discount Price (Rs.) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g. 1995"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Market Price / Slash Price (Rs.) *</label>
                    <input
                      type="number"
                      name="marketPrice"
                      value={formData.marketPrice}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g. 7935"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sales Volume Text</label>
                    <input
                      type="text"
                      name="salesCount"
                      value={formData.salesCount}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g. 31k+ sold"
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Product Image (Local Asset) *</label>
                    <select
                      name="image"
                      value={formData.image.startsWith('http') ? 'custom' : formData.image}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setFormData({ ...formData, image: e.target.value });
                        } else {
                          setFormData({ ...formData, image: '' });
                        }
                      }}
                      className="form-control"
                    >
                      {Array.from({ length: 15 }, (_, i) => `/image (${i + 1}).jpg`).map((img) => (
                        <option key={img} value={img}>
                          {img}
                        </option>
                      ))}
                      <option value="custom">Upload / Custom URL...</option>
                    </select>
                  </div>
                </div>

                {(formData.image === 'custom' || formData.image === '' || formData.image.startsWith('http')) && (
                  <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '16px', marginBottom: '20px', backgroundColor: '#f8fafc' }}>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600', width: 'fit-content' }}>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>Choose Image from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {uploading && (
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          <i className="fa-solid fa-spinner fa-spin"></i> Uploading image...
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Or Paste Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter http://... or select upload above"
                      />
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Stars Rating (0 - 5)</label>
                    <input
                      type="number"
                      name="ratingStars"
                      value={formData.ratingStars}
                      onChange={handleInputChange}
                      className="form-control"
                      step="0.1"
                      min="0"
                      max="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reviews Count</label>
                    <input
                      type="number"
                      name="ratingCount"
                      value={formData.ratingCount}
                      onChange={handleInputChange}
                      className="form-control"
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fa-regular fa-floppy-disk"></i> {editProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
