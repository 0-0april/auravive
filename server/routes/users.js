import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body); // Debug log
    
    const { userUserN, userPass } = req.body;
    
    if (!userUserN || !userPass) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password are required' 
      });
    }
    
    console.log('Querying database for user:', userUserN); // Debug log
    
    // Get user from database - Include userRole column
    const [users] = await pool.query(
      'SELECT userID, userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole FROM users WHERE userUserN = ?',
      [userUserN]
    );
    
    console.log('User found:', users.length > 0 ? 'Yes' : 'No'); // Debug log
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }
    
    const user = users[0];
    
    console.log('Comparing passwords...'); // Debug log
    
    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(userPass, user.userPass);
    
    console.log('Password match:', passwordMatch); // Debug log
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }
    
    // Remove password before sending
    delete user.userPass;
    
    // Ensure userRole exists (default to 'customer' if not set)
    if (!user.userRole) {
      user.userRole = 'customer';
    }
    
    console.log('Login successful for:', user.userUserN, 'Role:', user.userRole); // Debug log
    
    res.json({ 
      success: true,
      message: 'Login successful',
      user: user
    });
    
  } catch (error) {
    console.error('Login error details:', error); // Detailed error log
    res.status(500).json({ 
      success: false,
      error: 'Server error during login',
      details: error.message // Send error details in development
    });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body); // Debug log
    
    const { userFname, userLname, userEmail, userPhone, userUserN, userPass } = req.body;
    
    // Validate required fields
    if (!userFname || !userLname || !userEmail || !userUserN || !userPass) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }
    
    // Check if username already exists
    const [existing] = await pool.query('SELECT userID FROM users WHERE userUserN = ?', [userUserN]);
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }
    
    // Check if email already exists
    const [existingEmail] = await pool.query('SELECT userID FROM users WHERE userEmail = ?', [userEmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }
    
    console.log('Hashing password...'); // Debug log
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userPass, 10);
    
    console.log('Inserting user into database...'); // Debug log
    
    // Insert new user with default role as 'customer'
    const [result] = await pool.query(
      'INSERT INTO users (userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userFname, userLname, userEmail, userPhone || '', userUserN, hashedPassword, 'customer']
    );
    
    console.log('Registration successful, userID:', result.insertId); // Debug log
    
    res.json({ 
      success: true,
      userID: result.insertId, 
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Registration error details:', error); // Detailed error log
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      details: error.message
    });
  }
});

export default router;
