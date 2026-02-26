const pool = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const [result] = await pool.query(
      "INSERT INTO user (name, email) VALUES (?, ?)",
      [name, email]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};