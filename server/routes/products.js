
const router = express.Router();
import express from 'express';
import pool from '../config/db.js';

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY productCreated DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [product] = await db.query('SELECT * FROM products WHERE productID = ?', [req.params.id]);
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
    const [products] = await db.query('SELECT * FROM products WHERE productCateg = ?', [req.params.category]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { productName, productDescrip, productCateg, productPrice, productStock, productImg } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (productName, productDescrip, productCateg, productPrice, productStock, productImg) VALUES (?, ?, ?, ?, ?, ?)',
      [productName, productDescrip, productCateg, productPrice, productStock, productImg]
    );
    res.json({ productID: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { productName, productDescrip, productCateg, productPrice, productStock, productImg } = req.body;
    await db.query(
      'UPDATE products SET productName=?, productDescrip=?, productCateg=?, productPrice=?, productStock=?, productImg=? WHERE productID=?',
      [productName, productDescrip, productCateg, productPrice, productStock, productImg, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE productID = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 