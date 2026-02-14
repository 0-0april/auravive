import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get all orders with user and product info
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.*,
        u.userFname,
        u.userLname,
        u.userEmail,
        p.productName,
        p.productPrice,
        p.productImg,
        p.productCateg
      FROM orders o
      INNER JOIN users u ON o.userID = u.userID
      INNER JOIN products p ON o.productID = p.productID
      ORDER BY o.orderDate DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by user
router.get('/user/:userID', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.*,
        p.productName,
        p.productPrice,
        p.productImg,
        p.productCateg
      FROM orders o
      INNER JOIN products p ON o.productID = p.productID
      WHERE o.userID = ?
      ORDER BY o.orderDate DESC
    `, [req.params.userID]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order with full details
router.get('/:id', async (req, res) => {
  try {
    const [order] = await pool.query(`
      SELECT 
        o.*,
        u.userFname,
        u.userLname,
        u.userEmail,
        u.userPhone,
        p.productName,
        p.productDescrip,
        p.productPrice,
        p.productImg,
        p.productCateg
      FROM orders o
      INNER JOIN users u ON o.userID = u.userID
      INNER JOIN products p ON o.productID = p.productID
      WHERE o.orderId = ?
    `, [req.params.id]);

    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order (handles multiple cart items)
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { userID, items } = req.body;
    // items: [{ productID, quantity, totalAmount }]

    const orderIds = [];
    for (const item of items) {
      const { productID, quantity, totalAmount } = item;

      // Check if product has enough stock
      const [product] = await connection.query('SELECT productStock FROM products WHERE productID = ?', [productID]);
      if (product.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: `Product ${productID} not found` });
      }

      if (product[0].productStock < quantity) {
        await connection.rollback();
        return res.status(400).json({ error: `Insufficient stock for product ${productID}` });
      }

      // Create order
      const [result] = await connection.query(
        'INSERT INTO orders (userID, productID, orderCount, orderTotalAmount) VALUES (?, ?, ?, ?)',
        [userID, productID, quantity, totalAmount]
      );

      // Update product stock
      await connection.query(
        'UPDATE products SET productStock = productStock - ? WHERE productID = ?',
        [quantity, productID]
      );

      orderIds.push(result.insertId);
    }

    await connection.commit();
    res.json({ orderIds, message: 'Order(s) created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    await pool.query('UPDATE orders SET orderStatus = ? WHERE orderId = ?', [orderStatus, req.params.id]);
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order (restore stock)
router.delete('/:id', async (req, res) => {
  try {
    const [order] = await pool.query('SELECT productID, orderCount FROM orders WHERE orderId = ?', [req.params.id]);
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Restore stock
    await pool.query(
      'UPDATE products SET productStock = productStock + ? WHERE productID = ?',
      [order[0].orderCount, order[0].productID]
    );

    // Delete order
    await pool.query('DELETE FROM orders WHERE orderId = ?', [req.params.id]);
    res.json({ message: 'Order cancelled and stock restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;