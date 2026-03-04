const pool = require("../config/db");

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // ON DUPLICATE work here because of UNIQUE(user_id, product_id) constraint
    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;

    await pool.query(query, [user_id, product_id, quantity]);

    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

//! How should I handle fetching cart -> actual order items mapping?
exports.getCart = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [items] = await pool.query(`
      SELECT c.cart_item_id, c.product_id, p.name, p.price, p.image_url, c.quantity,
      (p.price * c.quantity) AS item_total
      FROM cart_items c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = ?
    `, [user_id]);

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    await pool.query(
      "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
      [quantity, cart_item_id]
    );

    res.json({ message: "Quantity updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cart_item_id } = req.params;

    await pool.query("DELETE FROM cart_items WHERE cart_item_id = ?", [cart_item_id]);

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};