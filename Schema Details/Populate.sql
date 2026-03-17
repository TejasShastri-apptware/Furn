USE furn2;

INSERT INTO
    roles (role_id, role_name)
VALUES (1, 'dev'),
    (2, 'admin'),
    (3, 'customer');

INSERT INTO
    organization (
        org_name,
        org_contact,
        org_email
    )
VALUES (
        'WoodNest',
        '9876543210',
        'contact@woodnest.com'
    ),
    (
        'LuxLiving',
        '9123456780',
        'hello@luxliving.com'
    );

INSERT INTO
    users (
        full_name,
        email,
        password_hash,
        phone,
        role_id,
        org_id
    )
VALUES (
        'Arjun Sharma',
        'arjun@woodnest.com',
        'hash_arjun',
        '9000000001',
        4,
        1
    ),
    (
        'Priya Mehta',
        'priya@woodnest.com',
        'hash_priya',
        '9000000002',
        2,
        1
    ),
    (
        'Ravi Kapoor',
        'ravi@luxliving.com',
        'hash_ravi',
        '9000000003',
        4,
        2
    ),
    (
        'Sneha Iyer',
        'sneha@luxliving.com',
        'hash_sneha',
        '9000000004',
        2,
        2
    );

-- user_id 1 = Arjun  (WoodNest, admin)
-- user_id 2 = Priya  (WoodNest, customer)
-- user_id 3 = Ravi   (LuxLiving, admin)
-- user_id 4 = Sneha  (LuxLiving, customer)

-- -------------------------------------------------------------
-- 4. Addresses
-- -------------------------------------------------------------
INSERT INTO
    addresses (
        org_id,
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default
    )
VALUES (
        1,
        2,
        '12 Mango Lane',
        'Apt 3',
        'Mumbai',
        'Maharashtra',
        '400001',
        'India',
        TRUE
    ),
    (
        1,
        2,
        '77 Elm Street',
        NULL,
        'Pune',
        'Maharashtra',
        '411001',
        'India',
        FALSE
    ),
    (
        2,
        4,
        '9 Rose Boulevard',
        'Floor 2',
        'Bangalore',
        'Karnataka',
        '560001',
        'India',
        TRUE
    );

-- address_id 1 = Priya default (Mumbai)
-- address_id 2 = Priya secondary (Pune)
-- address_id 3 = Sneha default (Bangalore)

-- -------------------------------------------------------------
-- 5. Categories (org-scoped)
-- -------------------------------------------------------------
INSERT INTO
    categories (
        org_id,
        category_name,
        description
    )
VALUES (
        1,
        'Sofas',
        'All kinds of sofas and couches'
    ),
    (
        1,
        'Dining Sets',
        'Dining tables and chair combos'
    ),
    (
        2,
        'Beds',
        'Bed frames and headboards'
    ),
    (
        2,
        'Wardrobes',
        'Storage and wardrobe solutions'
    );

-- category_id 1,2 = WoodNest | 3,4 = LuxLiving

-- -------------------------------------------------------------
-- 6. Tags
-- -------------------------------------------------------------
INSERT INTO
    tags (org_id, tag_name, tag_type)
VALUES (1, 'Oak', 'material'),
    (1, 'Living Room', 'room'),
    (1, 'Modern', 'style'),
    (2, 'King Size', 'general'),
    (2, 'Minimalist', 'style');

-- tag_id 1,2,3 = WoodNest | 4,5 = LuxLiving

-- -------------------------------------------------------------
-- 7. Products
-- -------------------------------------------------------------
INSERT INTO
    products (
        org_id,
        category_id,
        name,
        description,
        price,
        discount_price,
        material,
        color,
        length,
        width,
        height,
        stock_quantity,
        is_active,
        is_featured
    )
VALUES (
        1,
        1,
        'Oslo 3-Seater Sofa',
        'Comfortable linen sofa',
        24999.00,
        21999.00,
        'Linen',
        'Grey',
        220.00,
        85.00,
        90.00,
        15,
        TRUE,
        TRUE
    ),
    (
        1,
        1,
        'Rio L-Shape Sofa',
        'Corner sofa with storage',
        34999.00,
        NULL,
        'Velvet',
        'Navy',
        280.00,
        200.00,
        85.00,
        8,
        TRUE,
        FALSE
    ),
    (
        1,
        2,
        'Nordic Dining Set',
        '4-seater solid oak set',
        18999.00,
        16999.00,
        'Oak',
        'Brown',
        140.00,
        80.00,
        75.00,
        20,
        TRUE,
        TRUE
    ),
    (
        2,
        3,
        'Cloud King Bed',
        'Upholstered king bed',
        32999.00,
        29999.00,
        'Fabric',
        'White',
        200.00,
        190.00,
        120.00,
        10,
        TRUE,
        TRUE
    ),
    (
        2,
        4,
        'Alpine Wardrobe',
        '3-door sliding wardrobe',
        27500.00,
        NULL,
        'Plywood',
        'Beige',
        180.00,
        60.00,
        210.00,
        5,
        TRUE,
        FALSE
    );

-- product_id 1,2,3 = WoodNest | 4,5 = LuxLiving

-- -------------------------------------------------------------
-- 8. Product Tags
-- -------------------------------------------------------------
INSERT INTO
    product_tags (product_id, tag_id)
VALUES (1, 1), -- Oslo Sofa → Oak (wrong material intentionally kept to test tag filter)
    (1, 2), -- Oslo Sofa → Living Room
    (1, 3), -- Oslo Sofa → Modern
    (2, 2), -- Rio Sofa → Living Room
    (3, 1), -- Nordic Dining → Oak
    (4, 4), -- Cloud Bed → King Size
    (4, 5), -- Cloud Bed → Minimalist
    (5, 5);
-- Alpine Wardrobe → Minimalist

-- -------------------------------------------------------------
-- 9. Cart Items (for order placement testing)
-- -------------------------------------------------------------
INSERT INTO
    cart_items (
        user_id,
        org_id,
        product_id,
        quantity
    )
VALUES (2, 1, 1, 2), -- Priya has 2x Oslo Sofa
    (2, 1, 3, 1), -- Priya has 1x Nordic Dining Set
    (4, 2, 4, 1);
-- Sneha has 1x Cloud Bed

-- -------------------------------------------------------------
-- 10. Orders (pre-existing history for getOrderById etc.)
-- -------------------------------------------------------------
INSERT INTO
    orders (
        user_id,
        org_id,
        total_amount,
        payment_id,
        shipping_address_id,
        order_status
    )
VALUES (
        2,
        1,
        18999.00,
        'PAY_TEST_001',
        1,
        'paid'
    ),
    (
        4,
        2,
        29999.00,
        'PAY_TEST_002',
        3,
        'shipped'
    );

-- order_id 1 = Priya's past order (WoodNest)
-- order_id 2 = Sneha's past order (LuxLiving)

INSERT INTO
    order_items (
        order_id,
        product_id,
        quantity,
        unit_price
    )
VALUES (1, 3, 1, 18999.00),
    (2, 4, 1, 29999.00);