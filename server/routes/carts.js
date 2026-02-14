import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Get cart items for a user
router.get('/:userID', async (req, res) => {
    try {
        const [items] = await pool.query(`
      SELECT 
        c.cartID,
        c.quantity,
        p.productID,
        p.productName,
        p.productDescrip,
        p.productCateg,
        p.productPrice,
        p.productStock,
        p.productImg
      FROM carts c
      INNER JOIN products p ON c.productID = p.productID
      WHERE c.userID = ?
    `, [req.params.userID]);

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add item to cart (or increment quantity if already present)
router.post('/', async (req, res) => {
    try {
        const { userID, productID } = req.body;

        // Check if item already in cart
        const [existing] = await pool.query(
            'SELECT cartID, quantity FROM carts WHERE userID = ? AND productID = ?',
            [userID, productID]
        );

        if (existing.length > 0) {
            // Update quantity
            await pool.query(
                'UPDATE carts SET quantity = quantity + 1 WHERE cartID = ?',
                [existing[0].cartID]
            );
            res.json({ message: 'Cart item quantity updated', cartID: existing[0].cartID });
        } else {
            // Insert new cart item
            const [result] = await pool.query(
                'INSERT INTO carts (userID, productID, quantity) VALUES (?, ?, 1)',
                [userID, productID]
            );
            res.json({ message: 'Item added to cart', cartID: result.insertId });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update cart item quantity
router.put('/:cartID', async (req, res) => {
    try {
        const { quantity } = req.body;

        if (quantity <= 0) {
            await pool.query('DELETE FROM carts WHERE cartID = ?', [req.params.cartID]);
            return res.json({ message: 'Cart item removed' });
        }

        await pool.query('UPDATE carts SET quantity = ? WHERE cartID = ?', [quantity, req.params.cartID]);
        res.json({ message: 'Cart item updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
router.delete('/item/:cartID', async (req, res) => {
    try {
        await pool.query('DELETE FROM carts WHERE cartID = ?', [req.params.cartID]);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear user cart
router.delete('/user/:userID', async (req, res) => {
    try {
        await pool.query('DELETE FROM carts WHERE userID = ?', [req.params.userID]);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
