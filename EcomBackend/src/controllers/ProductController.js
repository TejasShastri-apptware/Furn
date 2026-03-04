const pool = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    // The cat name would be needed not just the ID
    const [rows] = await pool.query(`
      SELECT p.*, c.category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { 
      category_id, name, description, image_url, 
      price, discount_price, material, color, 
      dimensions, stock_quantity 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products 
      (category_id, name, description, image_url, price, discount_price, material, color, dimensions, stock_quantity) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, description, image_url, price, discount_price, material, color, dimensions, stock_quantity]
    );

    res.status(201).json({
      product_id: result.insertId,
      name,
      message: "Product added successfully"
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [result] = await pool.query(
      "UPDATE products SET ? WHERE product_id = ?",
      [updateData, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Server error" });
  }
};