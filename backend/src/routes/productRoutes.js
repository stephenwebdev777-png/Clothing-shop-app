
const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', getProducts);
router.get('/:id', getProductById);
// Accept either with or without file
const optionalUpload = upload.single('image');
const parseRequestBody = (req, res, next) => {
  if (req.is('multipart/form-data')) {
    optionalUpload(req, res, (err) => {
      next(err);
    });
  } else {
    next();
  }
};
router.post('/', parseRequestBody, createProduct);
router.put('/:id', parseRequestBody, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
