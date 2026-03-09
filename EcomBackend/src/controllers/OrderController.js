const pool = require("../config/db");

exports.placeOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const orgId = req.org_id;
        const userId = req.user_id;
        const { shipping_address_id, payment_id } = req.body;
        
        // Restriction : User and Org
        const [cartItems] = await connection.query(
            `SELECT c.product_id, c.quantity, p.price, p.stock_quantity
             FROM cart_items c
             JOIN products p ON c.product_id = p.product_id
             WHERE c.user_id = ? AND c.org_id = ?`, 
            [userId, orgId]
        );

        if (cartItems.length === 0) throw new Error("Empty Cart");

        // Inventory & Total Calculation
        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ID: ${item.product_id}`);
            }
            totalAmount += item.price * item.quantity;
        }
        
        // Insert Order with shipping_address_id
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, org_id, total_amount, payment_id, shipping_address_id, order_status) 
             VALUES (?, ?, ?, ?, ?, 'paid')`,
            [userId, orgId, totalAmount, payment_id, shipping_address_id]
        );

        const orderId = orderResult.insertId;

        //snapshot and deduction & Strict Org Check
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );

            await connection.query(
                `UPDATE products SET stock_quantity = stock_quantity - ? 
                 WHERE product_id = ? AND org_id = ?`,
                [item.quantity, item.product_id, orgId]
            );
        }

        await connection.query("DELETE FROM cart_items WHERE user_id = ? AND org_id = ?", [userId, orgId]);

        await connection.commit();
        res.status(201).json({ order_id: orderId, total_amount: totalAmount });

    } catch (error) {
        await connection.rollback();
        res.status(400).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.getUserOrdersByOrg = async (req, res) => {
    try {
        const orgId = req.org_id;
        const userId = req.user_id;

        const [orders] = await pool.query(
            "SELECT * FROM orders WHERE user_id = ? AND org_id = ? ORDER BY created_at DESC",
            [userId, orgId]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders" });
    }
};

// Global
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

exports.getAllOrdersByOrg = async(req,res) => {
    try {
        const orgId = req.org_id;
        const [orders] = await pool.query(
            `SELECT * from orders WHERE org_id = ? ORDER BY created_at DESC`, [orgId]
        );
        res.json(orders);
    } catch(error) {
        res.status(500).json({message: "Error fetching all orders by org, OrderController -> getAllOrdersByOrg"})
    }
}

exports.getDetailedOrdersByUser = async (req, res) => {
    try {
        const userId = req.user_id;
        const orgId = req.org_id;

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
            WHERE o.user_id = ? AND o.org_id = ?
            ORDER BY o.created_at DESC`,
            [userId, orgId]
        ); //! This should stay the same I guess

        res.status(200).json({"orders" : orders});

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { order_id } = req.params;

        const [order] = await pool.query(
            `SELECT * FROM orders WHERE order_id = ?`,
            [order_id]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        const [items] = await pool.query(
            `SELECT oi.order_item_id, oi.product_id, p.name, oi.quantity, oi.unit_price
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             WHERE oi.order_id = ?`,
            [order_id]
        );

        res.json({
            order: order[0],
            items: items
        });

    } catch (e) {
        res.status(500).json({
            message: "Error fetching order by ID, OrderController -> getOrderById"
        });
    }
};


exports.getDetailedOrderById = async (req, res) => {
    try {
        const { order_id } = req.params;
        const orgId = req.org_id;

        // 1. Fetch Order with Address Details
        const [orderRows] = await pool.query(
            `SELECT o.*, a.address_line1, a.city, a.postal_code, a.country 
             FROM orders o
             LEFT JOIN addresses a ON o.shipping_address_id = a.address_id
             WHERE o.order_id = ? AND o.org_id = ?`,
            [order_id, orgId]
        );

        if (orderRows.length === 0) return res.status(404).json({ message: "Order not found" });

        // 2. Fetch Snapshotted Items (unit_price at time of purchase)
        const [items] = await pool.query(
            `SELECT oi.product_id, p.name, oi.quantity, oi.unit_price, oi.subtotal
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             WHERE oi.order_id = ?`,
            [order_id]
        );

        res.json({
            order: orderRows[0],
            items: items
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching order details" });
    }
};