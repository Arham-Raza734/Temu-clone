import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        name: { $regex: search, $options: 'i' },
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (Admin simulated)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, marketPrice, salesCount, ratingStars, ratingCount, image } = req.body;

    const product = new Product({
      name,
      description,
      price,
      marketPrice,
      salesCount: salesCount || '0 sold',
      ratingStars: ratingStars || 5,
      ratingCount: ratingCount || 0,
      image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (Admin simulated)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, marketPrice, salesCount, ratingStars, ratingCount, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.price = price ?? product.price;
      product.marketPrice = marketPrice ?? product.marketPrice;
      product.salesCount = salesCount ?? product.salesCount;
      product.ratingStars = ratingStars ?? product.ratingStars;
      product.ratingCount = ratingCount ?? product.ratingCount;
      product.image = image ?? product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (Admin simulated)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
