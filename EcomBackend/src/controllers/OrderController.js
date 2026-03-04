const pool = require("../config/db");

exports.placeOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { user_id, shipping_address, payment_id } = req.body;
        await connection.beginTransaction();

        const [cartItems] = await connection.query(
            `SELECT c.product_id, c.quantity, p.price, p.stock_quantity
            FROM cart_items c
            JOIN products p ON c.product_id = p.product_id
            WHERE c.user_id = ?
            `, [user_id]
        );

        if (cartItems.length === 0) throw new Error("Empty Cart");

        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock : ${item.product_id}`);
            }
            totalAmount += item.price * item.quantity;
        }

        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_amount, payment_id, shipping_address, order_status) 
       VALUES (?, ?, ?, ?, 'paid')`,
            [user_id, totalAmount, payment_id, shipping_address]
        );

        const orderId = orderResult.insertId;

        //inserting in order_item and updating the stock
        for (const item of cartItems) {
            const subtotal = item.quantity * item.price;

            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price, subtotal]
            );

            await connection.query(
                `UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
                [item.quantity, item.product_id]
            );
        }

        await connection.query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

        await connection.commit();

        res.status(201).json({
            message: "Order placed successfully",
            order_id: orderId,
            total_amount: totalAmount
        });

    } catch (error) {
        await connection.rollback();
        console.error("Order Transaction Error:", error.message);
        res.status(400).json({ message: error.message || "Failed to place order" });
    } finally {
        connection.release();
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [orders] = await pool.query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [user_id]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

exports.getAllOrders = async(req, res) => {
    try {
        const {user_id} = req.params;
        const [orders] = await pool.query(
            `SELECT * from orders ORDER BY created_at DESC`
        );
        res.json(orders);
    } catch(error) {
        res.status(500).json({message: "Error fetching all orders, OrderController -> getAllOrders"})
    }
}

exports.getDetailedOrdersByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [orders] = await pool.query(
            `SELECT 
                o.order_id,
                o.user_id,
                o.total_amount,
                o.order_status,
                o.shipping_address,
                o.created_at,
                oi.product_id,
                p.name AS product_name,
                oi.quantity,
                oi.unit_price,
                oi.subtotal
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC`,
            [user_id]
        ); //! This should stay the same I guess

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
};