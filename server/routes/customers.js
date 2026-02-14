import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const [customers] = await pool.query(
      "SELECT userID, userFname, userLname, userEmail, userPhone, userUserN, userAccCreated FROM users WHERE userRole = 'customer'"
    );
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;