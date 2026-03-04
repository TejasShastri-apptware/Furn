const pool = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.user_id, u.full_name, u.email, u.phone, u.default_shipping_address, r.role_name, u.created_at 
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT user_id, full_name, email, phone, default_shipping_address, role_id FROM users WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password_hash, phone, role_id } = req.body;

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, phone, role_id) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, password_hash, phone, role_id || 2]
    );

    res.status(201).json({
      user_id: result.insertId,
      full_name,
      email,
      role_id: role_id || 2
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, default_shipping_address } = req.body;

    const [result] = await pool.query(
      "UPDATE users SET full_name = ?, phone = ?, default_shipping_address = ? WHERE user_id = ?",
      [full_name, phone, default_shipping_address, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};