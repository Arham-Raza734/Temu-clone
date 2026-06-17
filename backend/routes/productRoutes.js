import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Ensure uploads folder exists (use /tmp on Vercel as filesystem is read-only)
const isVercel = process.env.VERCEL === '1';
const uploadDir = isVercel ? '/tmp/uploads' : './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Validate image extension
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp)!'));
  }
};

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// Single image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct dynamic server static URL
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
