import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
const router = express.Router();

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT userID, userFname, userLname, userEmail, userPhone, userUserN, userRole FROM users WHERE userID = ?',
      [req.params.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);

    const { userUserN, userPass } = req.body;

    if (!userUserN || !userPass) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    console.log('Querying database for user:', userUserN);

    const [users] = await pool.query(
      'SELECT userID, userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole FROM users WHERE userUserN = ?',
      [userUserN]
    );

    console.log('User found:', users.length > 0 ? 'Yes' : 'No');

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    const user = users[0];

    console.log('Comparing passwords...');

    const passwordMatch = await bcrypt.compare(userPass, user.userPass);

    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Remove password before sending
    delete user.userPass;

    // Ensure userRole exists
    if (!user.userRole) {
      user.userRole = 'customer';
    }

    console.log('Login successful for:', user.userUserN, 'Role:', user.userRole);

    res.json({
      success: true,
      message: 'Login successful',
      user: user
    });

  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login',
      details: error.message
    });
  }
});

// Facebook Auth
router.post('/facebook-auth', async (req, res) => {
  try {
    const { facebookID, userFname, userLname, userEmail } = req.body;

    if (!facebookID) {
      return res.status(400).json({ success: false, error: 'Facebook ID is required' });
    }

    // 1. Try to find user by Facebook ID
    let [users] = await pool.query('SELECT * FROM users WHERE userFacebookID = ?', [facebookID]);

    if (users.length === 0 && userEmail) {
      // 2. If not found by FB ID, try to find by Email
      const [emailUsers] = await pool.query('SELECT * FROM users WHERE userEmail = ?', [userEmail]);
      if (emailUsers.length > 0) {
        // Link existing email account to Facebook
        await pool.query('UPDATE users SET userFacebookID = ? WHERE userID = ?', [facebookID, emailUsers[0].userID]);
        users = [{ ...emailUsers[0], userFacebookID: facebookID }];
      }
    }

    if (users.length === 0) {
      // 3. Register new user
      const username = `fb_${facebookID.substring(0, 8)}_${Math.random().toString(36).substring(2, 5)}`;
      const [result] = await pool.query(
        'INSERT INTO users (userFacebookID, userFname, userLname, userEmail, userUserN, userRole) VALUES (?, ?, ?, ?, ?, ?)',
        [facebookID, userFname, userLname, userEmail || '', username, 'customer']
      );

      const [newUser] = await pool.query('SELECT * FROM users WHERE userID = ?', [result.insertId]);
      users = newUser;
    }

    const user = users[0];
    delete user.userPass;

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({ success: false, error: 'Facebook authentication failed', details: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);

    const { userFname, userLname, userEmail, userPhone, userUserN, userPass } = req.body;

    if (!userFname || !userLname || !userEmail || !userUserN || !userPass) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const [existing] = await pool.query('SELECT userID FROM users WHERE userUserN = ?', [userUserN]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    const [existingEmail] = await pool.query('SELECT userID FROM users WHERE userEmail = ?', [userEmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    console.log('Hashing password...');

    const hashedPassword = await bcrypt.hash(userPass, 10);

    console.log('Inserting user into database...');

    const [result] = await pool.query(
      'INSERT INTO users (userFname, userLname, userEmail, userPhone, userUserN, userPass, userRole) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userFname, userLname, userEmail, userPhone || '', userUserN, hashedPassword, 'customer']
    );

    console.log('Registration successful, userID:', result.insertId);

    res.json({
      success: true,
      userID: result.insertId,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: error.message
    });
  }
});

export default router;
