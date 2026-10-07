const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Admin Credential Management with persistent file support
const credsFilePath = path.join(__dirname, 'admin_creds.json');
let adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'Mr9iceguy',
  password: process.env.ADMIN_PASSWORD || '@Mr9iceguy'
};

if (fs.existsSync(credsFilePath)) {
  try {
    const savedCreds = JSON.parse(fs.readFileSync(credsFilePath, 'utf8'));
    if (savedCreds.username && savedCreds.password) {
      adminCredentials = savedCreds;
    }
  } catch (e) {
    console.warn('Could not read admin_creds.json file:', e.message);
  }
}

// Ensure public/assets/images directory exists
const imagesDir = path.join(__dirname, 'public', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy artifact generated images if present locally
const currentBrainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\defb9861-1c9f-462b-88bc-b4212b74c98c';
const oldBrainDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\a217631a-70ed-49a7-a567-c443a76fc8ec';

[currentBrainDir, oldBrainDir].forEach(brainDir => {
  if (fs.existsSync(brainDir)) {
    try {
      const files = fs.readdirSync(brainDir);
      files.filter(f => f.endsWith('.png') || f.endsWith('.jpg')).forEach(file => {
        const src = path.join(brainDir, file);
        if (file.includes('pubg_mobile_cover')) {
          const destPubg = path.join(imagesDir, 'pubg_mobile_cover.png');
          fs.copyFileSync(src, destPubg);
        }
        if (file.includes('war_planet_online_cover')) {
          const destWpo = path.join(imagesDir, 'war_planet_online_cover.png');
          fs.copyFileSync(src, destWpo);
        }
        const dest = path.join(imagesDir, file);
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
        }
      });
    } catch (err) {
      // Silent fallback
    }
  }
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection setup (Neon PostgreSQL)
let pool = null;
let useMemoryFallback = false;
let memoryOrders = [];

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log('⚡ Connected to Neon PostgreSQL Database via DATABASE_URL');
  } catch (err) {
    console.warn('⚠️ Neon PostgreSQL connection failed to initialize. Falling back to local memory store.', err);
    useMemoryFallback = true;
  }
} else {
  console.log('ℹ️ No DATABASE_URL provided. Running in local memory store mode for local development.');
  useMemoryFallback = true;
}

// Auto-initialize DB Schema if using PostgreSQL
async function initDb() {
  if (!pool || useMemoryFallback) return;

  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(30) UNIQUE NOT NULL,
        game_id VARCHAR(50) NOT NULL,
        game_name VARCHAR(100) NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        item_name VARCHAR(100) NOT NULL,
        item_price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'GHS',
        player_id VARCHAR(100) NOT NULL,
        server_id VARCHAR(100) DEFAULT '',
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(150),
        payment_method VARCHAR(50) DEFAULT 'Telecel Mobile Money',
        payment_number VARCHAR(30) DEFAULT '0205438685',
        payment_reference VARCHAR(100) NOT NULL,
        status VARCHAR(30) DEFAULT 'Pending Verification',
        admin_notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log('✅ Neon PostgreSQL Database schema verified & initialized');
  } catch (err) {
    console.error('❌ Failed to create Neon DB tables:', err.message);
    useMemoryFallback = true;
  }
}

initDb();

// Generate unique order ID
function generateOrderId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IPT-${rand}`;
}

// --- REST API ENDPOINTS ---

// 1. Submit New Order
app.post('/api/orders', async (req, res) => {
  try {
    const {
      game_id,
      game_name,
      item_id,
      item_name,
      item_price,
      player_id,
      server_id = '',
      customer_name,
      customer_phone,
      customer_email = '',
      payment_reference
    } = req.body;

    // Strict input validation
    if (!game_id || !item_id || !player_id || !customer_name || !customer_phone || !payment_reference) {
      return res.status(400).json({
        success: false,
        error: 'Missing required order information. Player ID and Payment Reference are mandatory.'
      });
    }

    if (isNaN(item_price) || Number(item_price) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid package price.'
      });
    }

    // Server-side validation against fake/empty reference numbers
    const cleanRef = String(payment_reference).trim();
    if (cleanRef.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid Telecel Mobile Money transaction reference number.'
      });
    }

    const orderId = generateOrderId();
    const createdAt = new Date().toISOString();

    const orderObj = {
      order_id: orderId,
      game_id,
      game_name: game_name || game_id,
      item_id,
      item_name: item_name || item_id,
      item_price: parseFloat(item_price),
      currency: 'GHS',
      player_id: String(player_id).trim(),
      server_id: String(server_id).trim(),
      customer_name: String(customer_name).trim(),
      customer_phone: String(customer_phone).trim(),
      customer_email: String(customer_email).trim(),
      payment_method: 'Telecel Mobile Money',
      payment_number: '0205438685',
      payment_reference: cleanRef,
      status: 'Pending Verification',
      created_at: createdAt,
      updated_at: createdAt
    };

    if (pool && !useMemoryFallback) {
      const query = `
        INSERT INTO orders (
          order_id, game_id, game_name, item_id, item_name, item_price,
          player_id, server_id, customer_name, customer_phone, customer_email,
          payment_method, payment_number, payment_reference, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *;
      `;
      const values = [
        orderObj.order_id,
        orderObj.game_id,
        orderObj.game_name,
        orderObj.item_id,
        orderObj.item_name,
        orderObj.item_price,
        orderObj.player_id,
        orderObj.server_id,
        orderObj.customer_name,
        orderObj.customer_phone,
        orderObj.customer_email,
        orderObj.payment_method,
        orderObj.payment_number,
        orderObj.payment_reference,
        orderObj.status,
        orderObj.created_at,
        orderObj.updated_at
      ];

      const result = await pool.query(query, values);
      return res.status(201).json({
        success: true,
        message: 'Order created successfully. Pending verification by administrator.',
        order: result.rows[0]
      });
    } else {
      orderObj.id = memoryOrders.length + 1;
      memoryOrders.unshift(orderObj);
      return res.status(201).json({
        success: true,
        message: 'Order created successfully (Memory Store). Pending verification.',
        order: orderObj
      });
    }
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to record order: ' + err.message
    });
  }
});

// 2. Track Order Status
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const searchKey = String(orderId).trim();

  try {
    if (pool && !useMemoryFallback) {
      const query = `
        SELECT order_id, game_name, item_name, item_price, currency, player_id, server_id,
               customer_name, customer_phone, payment_method, payment_reference, status, admin_notes, created_at, updated_at
        FROM orders
        WHERE order_id = $1 OR customer_phone = $1 OR payment_reference = $1
        ORDER BY created_at DESC LIMIT 1;
      `;
      const result = await pool.query(query, [searchKey]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.json({ success: true, order: result.rows[0] });
    } else {
      const match = memoryOrders.find(
        o => o.order_id === searchKey || o.customer_phone === searchKey || o.payment_reference === searchKey
      );
      if (!match) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.json({ success: true, order: match });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Admin Authentication & Credential Management
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Both username and password are required.' });
  }

  if (username.trim().toLowerCase() === adminCredentials.username.toLowerCase() && password === adminCredentials.password) {
    return res.json({
      success: true,
      username: adminCredentials.username,
      token: 'admin-authenticated-token-' + Date.now(),
      message: 'Admin access granted'
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid Administrator Username or Password' });
});

// Change Admin Username & Password Endpoint
app.post('/api/admin/change-credentials', (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword || !newUsername || !newPassword) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (currentPassword !== adminCredentials.password) {
    return res.status(401).json({ success: false, error: 'Incorrect current password' });
  }

  const cleanUser = String(newUsername).trim();
  if (cleanUser.length < 3) {
    return res.status(400).json({ success: false, error: 'Username must be at least 3 characters long' });
  }

  if (String(newPassword).length < 4) {
    return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long' });
  }

  adminCredentials.username = cleanUser;
  adminCredentials.password = newPassword;

  try {
    fs.writeFileSync(credsFilePath, JSON.stringify(adminCredentials, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save admin credentials file:', err.message);
  }

  return res.json({
    success: true,
    username: adminCredentials.username,
    message: 'Admin username and password updated successfully!'
  });
});

// 4. Fetch All Orders (Admin)
app.get('/api/admin/orders', async (req, res) => {
  const { status, search } = req.query;

  try {
    if (pool && !useMemoryFallback) {
      let query = `SELECT * FROM orders`;
      const conditions = [];
      const params = [];

      if (status && status !== 'ALL') {
        params.push(status);
        conditions.push(`status = $${params.length}`);
      }

      if (search) {
        params.push(`%${search}%`);
        conditions.push(`(order_id ILIKE $${params.length} OR player_id ILIKE $${params.length} OR customer_name ILIKE $${params.length} OR customer_phone ILIKE $${params.length} OR payment_reference ILIKE $${params.length})`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      query += ` ORDER BY created_at DESC;`;

      const result = await pool.query(query, params);
      return res.json({ success: true, orders: result.rows });
    } else {
      let filtered = [...memoryOrders];
      if (status && status !== 'ALL') {
        filtered = filtered.filter(o => o.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          o =>
            o.order_id.toLowerCase().includes(q) ||
            o.player_id.toLowerCase().includes(q) ||
            o.customer_name.toLowerCase().includes(q) ||
            o.customer_phone.toLowerCase().includes(q) ||
            o.payment_reference.toLowerCase().includes(q)
        );
      }
      return res.json({ success: true, orders: filtered });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Update Order Status (Admin)
app.patch('/api/admin/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const validStatuses = ['Pending Verification', 'Payment Verified', 'Completed', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }

  try {
    const updatedAt = new Date().toISOString();

    if (pool && !useMemoryFallback) {
      const query = `
        UPDATE orders
        SET status = COALESCE($1, status),
            admin_notes = COALESCE($2, admin_notes),
            updated_at = $3
        WHERE id = $4 OR order_id = $4
        RETURNING *;
      `;
      const result = await pool.query(query, [status, admin_notes, updatedAt, id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.json({ success: true, order: result.rows[0] });
    } else {
      const idx = memoryOrders.findIndex(o => String(o.id) === String(id) || o.order_id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      if (status) memoryOrders[idx].status = status;
      if (admin_notes !== undefined) memoryOrders[idx].admin_notes = admin_notes;
      memoryOrders[idx].updated_at = updatedAt;

      return res.json({ success: true, order: memoryOrders[idx] });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Delete Order (Admin)
app.delete('/api/admin/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (pool && !useMemoryFallback) {
      await pool.query(`DELETE FROM orders WHERE id = $1 OR order_id = $1`, [id]);
    } else {
      memoryOrders = memoryOrders.filter(o => String(o.id) !== String(id) && o.order_id !== id);
    }
    return res.json({ success: true, message: 'Order removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Get Summary Stats (Admin)
app.get('/api/admin/stats', async (req, res) => {
  try {
    let ordersList = [];
    if (pool && !useMemoryFallback) {
      const result = await pool.query(`SELECT status, item_price FROM orders`);
      ordersList = result.rows;
    } else {
      ordersList = memoryOrders;
    }

    const totalOrders = ordersList.length;
    const pendingOrders = ordersList.filter(o => o.status === 'Pending Verification').length;
    const verifiedOrders = ordersList.filter(o => o.status === 'Payment Verified').length;
    const completedOrders = ordersList.filter(o => o.status === 'Completed').length;
    const rejectedOrders = ordersList.filter(o => o.status === 'Rejected').length;

    const totalRevenue = ordersList
      .filter(o => o.status === 'Completed' || o.status === 'Payment Verified')
      .reduce((acc, o) => acc + parseFloat(o.item_price || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        verifiedOrders,
        completedOrders,
        rejectedOrders,
        totalRevenue: totalRevenue.toFixed(2)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to single page app index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 IN-PURCHASES TOP-UP server running on port ${PORT}`);
  console.log(`📱 Telecel Mobile Money Target: 0205438685`);
});
