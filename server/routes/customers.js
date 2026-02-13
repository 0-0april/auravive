
const router = express.Router();


import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

// Get all customers
router.get('/', async (req, res) => {
  try {
    const [customers] = await pool.query('SELECT customID, customFname, customLname, customEmail, customPhone, customUserN, created_at FROM customers');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register customer
router.post('/register', async (req, res) => {
  try {
    const { customFname, customLname, customEmail, customPhone, customUserN, customPass } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(customPass, 10);
    
    const [result] = await db.query(
      'INSERT INTO customers (customFname, customLname, customEmail, customPhone, customUserN, customPass) VALUES (?, ?, ?, ?, ?, ?)',
      [customFname, customLname, customEmail, customPhone, customUserN, hashedPassword]
    );
    
    res.json({ customID: result.insertId, message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login customer
router.post('/login', async (req, res) => {
  try {
    const { customUserN, customPass } = req.body;
    
    const [customers] = await db.query('SELECT * FROM customers WHERE customUserN = ?', [customUserN]);
    
    if (customers.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const customer = customers[0];
    const passwordMatch = await bcrypt.compare(customPass, customer.customPass);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Don't send password back
    delete customer.customPass;
    res.json({ customer, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 