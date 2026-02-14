import express from 'express';
import pool from '../config/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY productCreated DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get distinct categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT DISTINCT productCateg FROM products WHERE productCateg IS NOT NULL ORDER BY productCateg');
    res.json(categories.map(c => c.productCateg));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [product] = await pool.query('SELECT * FROM products WHERE productID = ?', [req.params.id]);
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE productCateg = ?', [req.params.category]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (with image upload)
router.post('/', upload.single('productImg'), async (req, res) => {
  try {
    const { productName, productDescrip, productCateg, productPrice, productStock } = req.body;
    let productImg = req.body.productImg; // fallback if URL is provided instead of file

    if (req.file) {
      // If a file was uploaded, store the relative path
      productImg = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.query(
      'INSERT INTO products (productName, productDescrip, productCateg, productPrice, productStock, productImg) VALUES (?, ?, ?, ?, ?, ?)',
      [productName, productDescrip, productCateg, productPrice, productStock, productImg]
    );
    res.json({ productID: result.insertId, message: 'Product created successfully', productImg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (with optional image upload)
router.put('/:id', upload.single('productImg'), async (req, res) => {
  try {
    const { productName, productDescrip, productCateg, productPrice, productStock } = req.body;
    let productImg = req.body.productImg;

    if (req.file) {
      // If a new file was uploaded, use it
      productImg = `/uploads/${req.file.filename}`;
    }

    // Only update productImg if it's provided (either as file or string)
    let query = 'UPDATE products SET productName=?, productDescrip=?, productCateg=?, productPrice=?, productStock=?';
    let params = [productName, productDescrip, productCateg, productPrice, productStock];

    if (productImg !== undefined) {
      query += ', productImg=?';
      params.push(productImg);
    }

    query += ' WHERE productID=?';
    params.push(req.params.id);

    await pool.query(query, params);
    res.json({ message: 'Product updated successfully', productImg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE productID = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;