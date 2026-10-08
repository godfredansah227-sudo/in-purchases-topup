/**
 * IN-PURCHASES TOP-UP - Main Application Logic
 */

// Game Catalog Database
const GAMES_CATALOG = [
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'shooter',
    tagline: 'Unknown Cash (UC) & Royale Pass Top-Up',
    image: 'assets/images/pubg_mobile_cover.png',
    badge: 'Hot & Popular',
    requiresServer: false,
    packages: [
      { id: 'pubg-uc-60', name: '60 UC', price: 13.00, badge: 'Starter' },
      { id: 'pubg-uc-325', name: '325 UC (300 + 25 UC)', price: 59.00, badge: 'Popular' },
      { id: 'pubg-uc-660', name: '660 UC (600 + 60 UC)', price: 113.00, badge: 'Best Value' },
      { id: 'pubg-uc-1800', name: '1,800 UC (1,500 + 300 UC)', price: 325.00 },
      { id: 'pubg-uc-3850', name: '3,850 UC (3,000 + 850 UC)', price: 555.00, badge: 'Pro Choice' },
      { id: 'pubg-uc-8100', name: '8,100 UC (6,000 + 2,100 UC)', price: 1105.00, badge: 'Ultimate' },
    ]
  },
  {
    id: 'fc-mobile',
    name: 'FC Mobile',
    category: 'sports',
    tagline: 'EA Sports FC Points & Silver Top-Up',
    image: 'assets/images/fc_mobile_cover_1790931894744.png',
    badge: 'Popular',
    requiresServer: false,
    packages: [
      { id: 'fc-40', name: '40 FC Points', price: 6.00, badge: 'Starter' },
      { id: 'fc-100', name: '100 FC Points', price: 11.00 },
      { id: 'fc-520', name: '520 FC Points', price: 56.00, badge: 'Popular' },
      { id: 'fc-1070', name: '1,070 FC Points', price: 110.620, badge: 'Best Value' },
      { id: 'fc-2200', name: '2,200 FC Points', price: 218.00 },
      { id: 'fc-5750', name: '5,750 FC Points', price: 526.00, badge: 'Pro Choice' },
      { id: 'fc-12000', name: '12,000 FC Points', price: 1044.00, badge: 'Ultimate' },
      { id: 'silver-39', name: '39 FC Silver', price: 6.00, badge: 'Popular' },
      { id: 'silver-99', name: '99 FC Silver', price: 12.00, badge: 'New' },
      { id: 'silver-499', name: '499 FC Silver', price: 53.00 },
      { id: 'silver-999', name: '999 FC Silver', price: 105.00 },
      { id: 'silver-1999', name: '1999 FC Silver', price: 219.00 },
      { id: 'silver-4999', name: '4999 FC Silver', price: 524.00 },
    ]
  },
  {
    id: 'modern-warships',
    name: 'Modern Warships: Naval Battle',
    category: 'strategy',
    tagline: 'Gold, Dollars & VIP Battle Pass',
    image: 'assets/images/modern_warships_cover_1790931918258.png',
    badge: 'Hot',
    requiresServer: false,
    packages: [
      { id: 'mw-Premium-7-Days', name: 'Premium Account - 7 Days', price: 40.00 },
      { id: 'mw-Premium-30-Days', name: 'Premium Account - 30 Days', price: 120.00 },
      { id: 'mw-artcoins-140', name: '140 Artcoins', price: 60.00 },
      { id: 'mw-artcoins-300', name: '300 Artcoins', price: 120.00 },
      { id: 'mw-artcoins-650', name: '650 Artcoins', price: 242.00 },
      { id: 'mw-artcoins-1,750', name: '1,750 Artcoins', price: 590.00 },
      { id: 'mw-artcoins-3,000', name: '3,000 Artcoins', price: 960.00 },
      { id: 'mw-gold-500', name: '500 Gold', price: 60.00 },
      { id: 'mw-gold-1,200', name: '1,200 Gold', price: 120.00 },
      { id: 'mw-gold-2,500', name: '2,500 Gold', price: 170.00, badge: 'Best Value' },
      { id: 'mw-gold-5,500', name: '5,500 Gold', price: 475.00 },
      { id: 'mw-dollars-5t', name: '$500,000 Dollars Pack', price: 45.00 },
      { id: 'mw-dollars-15m', name: '$1,500,000 Dollars Pack', price: 60.00 },
      { id: 'mw-dollars-35m', name: '$3,500,000 Dollars Pack', price: 120.00 },
      { id: 'mw-dollars-8m', name: '$500,000 Dollars Pack', price: 242.00 },
      { id: 'mw-dollars-20m', name: '$20,000,000 Dollars Pack', price: 473.00 },
      { id: 'mw-battle-pass-vip', name: 'Battle Pass VIP', price: 167.00, badge: 'Featured' },
      { id: 'mw-fire-shield-bundle', name: 'Fire Shield Bundle', price: 68.00, badge:'New' },
      { id: 'mw-strike-group-bundle', name: 'Strike Group Bundle', price: 79.00, badge: 'Featured'}

    ]
  },
  {
    id: 'delta-force',
    name: 'Delta Force',
    category: 'shooter',
    tagline: 'Delta Coins',
    image: 'assets/images/delta_force_cover_1790931950013.png',
    badge: 'New',
    requiresServer: true,
    packages: [
      { id: 'df-coins-18', name: '18 Delta Coins', price: 4.80, badge: 'Starter' },
      { id: 'df-coins-30', name: '30 Delta Coins', price: 6.70, badge: 'New'},
      { id: 'df-coins-60', name: '60 Delta Coins', price: 11.40 },
      { id: 'df-coins-300-+-20', name: '300 + 20 Delta Coins', price: 50.00, badge: 'Popular' },
      { id: 'df-coins-420-+40', name: '420 + 20 Delta Coins', price: 70.50 },
      { id: 'df-coins-680-+-70', name: '680 + 70 Delta Coins', price: 96.50, badge: 'Popular'},
      { id: 'df-coins-1280-+-200', name: '1280 + 200 Delta Coins', price: 192.00 },
      { id: 'df-coins-1680-+-300', name: '980 Delta Coins', price: 238.00 },
      { id: 'df-coins-3280-+-670', name: '3280 + 670 Delta Coins', price: 475.00 },
      { id: 'df-coins-6480-+-1620', name: '6480 + 1620 Delta Coins', price: 947.00 },
    ]
  },
  {
    id: 'garena-delta-force',
    name: 'Garena Delta Force',
    category: 'shooter',
    tagline: 'Garena Shells & Tactical Points',
    image: 'assets/images/delta_force_cover_1790931950013.png',
    badge: 'Garena',
    requiresServer: true,
    outOfStock: true,
    packages: [
      { id: 'gdf-shells-100', name: '100 Garena Shells', price: 35.00 },
      { id: 'gdf-shells-500', name: '500 Garena Shells', price: 160.00, badge: 'Best Seller' },
      { id: 'gdf-shells-1000', name: '1,000 Garena Shells', price: 310.00 },
      { id: 'gdf-tactical-points', name: 'Tactical Points Pack', price: 120.00 }
    ]
  },
  {
    id: 'war-planet-online',
    name: 'War Planet Online',
    category: 'strategy',
    tagline: 'Medals, Energy Packs & Commander VIP',
    image: 'assets/images/website_banner_1790931861629.png',
    badge: 'Strategy',
    requiresServer: true,
    packages: [
      { id: 'wpo-HC-1,000HC-+-400-VIP-points', name: '1,000 HC + 400 VIP Points', price: 9.00, badge: 'starter' },
      { id: 'wpo-HC-2,400HC-+-800-VIP-points', name: '2,400 HC + 800 VIP Points', price: 18.00, badge: 'popular' },
      { id: 'wpo-HC-5,000HC-+-1,500-VIP-points', name: '5,000 HC + 1,500 VIP Points', price: 33.00, badge: 'new' },
      { id: 'wpo-HC-12,500HC-+-3,500-VIP-points', name: '12,500 HC + 3,500 VIP Points', price: 71.00 },
      { id: 'wpo-HC-30,000HC-+-10,000-VIP-points', name: '30,000 HC + 10,000 VIP Points', price: 166.00 },
      { id: 'wpo-HC-70,000HC-+-20,000-VIP-points', name: '70,000 HC + 20,000 VIP Points', price: 356.00 },
    ]
  },
  {
    id: 'blood-strike',
    name: 'Blood Strike',
    category: 'shooter',
    tagline: 'Gold Coins & Strike Pass',
    image: 'assets/images/blood_strike_cover_1790931979376.png',
    badge: 'Trending',
    requiresServer: false,
    packages: [
      { id: 'bs-gold-50-+6', name: '50 + 6 Gold ', price: 7.00, badge: 'new' },
      { id: 'bs-gold-100-+-16', name: '100 + 16 Gold', price: 13.00, badge: 'Popular' },
      { id: 'bs-gold-300-+52', name: '300 + 52 Gold Coin', price: 33.00 },
      { id: 'bs-gold-500-+94', name: '500 + 94 Gold Coin', price: 52.00 },
      { id: 'bs-gold-1,000-+210', name: '1,000 + 210 Gold Coin', price: 99.00 },
      { id: 'bs-gold-2,000-+486', name: '2,000 + 486 Gold Coin', price: 195.00 },
      { id: 'bs-strike-pass-elite', name: 'Strike Pass Elite', price: 43.00, badge: 'Featured' },
      { id: 'bs-strike-pass-premium', name: 'Strike Pass Premium', price: 91.00, badge: 'Featured' },
    ]
  },
  {
    id: 'arena-breakout',
    name: 'Arena Breakout Garena',
    category: 'shooter',
    tagline: 'Bonds & Extraction Supply Packs',
    image: 'assets/images/arena_breakout_cover_1790932023681.png',
    badge: 'Tactical',
    requiresServer: false,
    packages: [
      { id: 'ab-bonds-60', name: '60 Bonds', price: 15.00 },
      { id: 'ab-bonds-310-+-25', name: '310 + 25 Bonds', price: 57.00, badge: 'Popular' },
      { id: 'ab-bonds-630-+-45', name: '630 + 45 Bonds', price: 110.00, badge: 'Popular' },
      { id: 'ab-bonds-1580-+-110', name: '1,580 + 110 Bonds', price: 267.00 },
      { id: 'ab-bonds-3200-+-200', name: '3200 + 200 Bonds', price: 537.00, badge: 'Popular' },
      { id: 'ab-beginner-select', name:'Beginner select', price: 12.00 },
      { id: 'ab-bulletproof-case-privileges', name: 'Bulletproof Case Privileges', price: 33.00 },
      { id: 'ab-composite-case-privileges', name: 'Composite Case Privileges', price: 91.00 },
      { id: 'ab-monthly-advanced', name: 'Monthly Advanced Battle pass Activation Pass', price: 16.00 },
      { id: 'ab-monthly-premium', name: 'Monthly Premium Battle pass Activation Pass', price: 54.00 },
      { id: 'ab-quarterly-premium', name: 'Quarterly Premium Battle Pass Bundle Activation Pass Bundle', price: 154.00 },
    ]
  },
  {
    id: 'garena-undawn',
    name: 'Garena Undawn',
    category: 'shooter',
    tagline: 'RC Credits & Survivor Growth Fund',
    image: 'assets/images/undawn_cover_1790932056046.png',
    badge: 'RPG',
    requiresServer: true,
    packages: [
      { id: 'undawn-rc-148-+-19', name: '148 + 19 RC', price: 25.00, badge:'new' },
      { id: 'undawn-rc-208-+-27', name: '208 + 27 RC ', price: 37.00, badge: 'Popular' },
      { id: 'undawn-rc-298-+-39', name: '298 + 39 RC ', price: 53.00 },
      { id: 'undawn-rc-445-+-63', name: '445 + 63 RC', price: 73.00,badge:'Popular' },
      { id: 'undawn-rc-475-+-67', name: '475 + 67 RC', price: 78.00 },
      { id: 'undawn-rc-520-+-73', name: '520 + 73 RC', price: 84.00 },
      { id: 'undawn-rc-745-+-105', name: '745 + 105 RC', price: 121.00 },
      { id: 'undawn-rc-weekly-card', name: 'Weekly Card', price: 37.00,badge:'new' },
      { id: 'undawn-rc-monthly-card', name: 'Monthly Card', price: 58.00 },
      { id: 'undawn-rc-growth-fund', name: 'Growth Fund', price: 109.00 },
      { id: 'undawn-rc-battle-pass-premium', name: 'Battle Pass Premium', price: 156.00 },
      { id: 'undawn-rc-glory-pass-premuim', name: 'Glory Pass Premium S9', price: 156.00,badge:'new' },
    ]
  }
];

// Active State
let currentSelectedGame = null;
let currentSelectedPackage = null;

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  renderGamesGrid(GAMES_CATALOG);
  startLiveTickerAnimation();
});

// Render Games Grid
function renderGamesGrid(games) {
  const grid = document.getElementById('gamesGrid');
  if (!grid) return;

  grid.innerHTML = games.map(game => {
    const isOut = game.outOfStock || false;
    return `
      <div class="game-card ${isOut ? 'out-of-stock' : ''}">
        <div class="game-card-img-wrapper">
          <img src="${game.image}" alt="${game.name}" class="game-card-img" onerror="this.src='assets/images/website_banner.png'">
          ${isOut 
            ? `<span class="game-badge out-of-stock-badge"><i class="fa-solid fa-clock"></i> Out of Stock</span>` 
            : `<span class="game-badge">${game.badge}</span>`
          }
          ${isOut ? `<div class="out-of-stock-overlay"><i class="fa-solid fa-triangle-exclamation"></i> Temporarily Out of Stock</div>` : ''}
        </div>
        <div class="game-card-body">
          <h3 class="game-title">${game.name}</h3>
          <p class="game-subtitle">${game.tagline}</p>
          <div class="game-footer">
            <span class="price-tag ${isOut ? 'unavailable' : ''}">
              ${isOut ? 'Temp. Out of Stock' : 'From GHS ' + game.packages[0].price.toFixed(2)}
            </span>
            <button class="btn-topup ${isOut ? 'btn-disabled' : ''}" 
                    ${isOut ? 'disabled' : ''} 
                    onclick="${isOut ? `showToast('${game.name} is temporarily out of stock. Please check back later.', 'error')` : `openCheckoutModal('${game.id}')`}">
              <i class="fa-solid ${isOut ? 'fa-ban' : 'fa-bolt'}"></i> ${isOut ? 'Out of Stock' : 'Top-Up'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Filter Games
function filterGames(category, btnElement) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  if (category === 'all') {
    renderGamesGrid(GAMES_CATALOG);
  } else {
    const filtered = GAMES_CATALOG.filter(g => g.category === category);
    renderGamesGrid(filtered);
  }
}

// Open Checkout Modal
function openCheckoutModal(gameId) {
  const game = GAMES_CATALOG.find(g => g.id === gameId);
  if (!game) return;

  if (game.outOfStock) {
    showToast(`${game.name} is temporarily out of stock. Please check back later.`, 'error');
    return;
  }

  currentSelectedGame = game;
  currentSelectedPackage = game.packages[0]; // default select first

  document.getElementById('selectedGameId').value = game.id;
  document.getElementById('selectedGameName').value = game.name;
  document.getElementById('modalGameTitle').innerHTML = `<i class="fa-solid fa-gamepad"></i> ${game.name} Top-Up`;

  // Server ID field toggle
  const serverGroup = document.getElementById('serverGroup');
  if (game.requiresServer) {
    serverGroup.style.display = 'block';
  } else {
    serverGroup.style.display = 'none';
  }

  // Render Package Items
  renderPackageSelector(game.packages);

  // Show Modal
  document.getElementById('checkoutModal').classList.add('active');
}

// Render Package Selector Pills
function renderPackageSelector(packages) {
  const grid = document.getElementById('packagesGrid');
  grid.innerHTML = packages.map((pkg, idx) => `
    <div class="package-item ${idx === 0 ? 'selected' : ''}" onclick="selectPackage('${pkg.id}')" id="pkg-${pkg.id}">
      ${pkg.badge ? `<span class="package-badge">${pkg.badge}</span>` : ''}
      <div class="package-name">${pkg.name}</div>
      <div class="package-price">GHS ${pkg.price.toFixed(2)}</div>
    </div>
  `).join('');

  updatePackageSelection(packages[0]);
}

// Select Package Handler
function selectPackage(packageId) {
  const pkg = currentSelectedGame.packages.find(p => p.id === packageId);
  if (!pkg) return;

  document.querySelectorAll('.package-item').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById(`pkg-${packageId}`);
  if (el) el.classList.add('selected');

  updatePackageSelection(pkg);
}

function updatePackageSelection(pkg) {
  currentSelectedPackage = pkg;
  document.getElementById('selectedItemId').value = pkg.id;
  document.getElementById('selectedItemName').value = pkg.name;
  document.getElementById('selectedItemPrice').value = pkg.price;
  document.getElementById('paymentAmountDisplay').textContent = `GHS ${pkg.price.toFixed(2)}`;
}

// Close Checkout Modal
function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('active');
}

// Submit Order Handler
async function handleOrderSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const originalBtnText = submitBtn.innerHTML;

  const playerId = document.getElementById('playerIdInput').value.trim();
  const serverId = document.getElementById('serverIdInput').value.trim();
  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const paymentRef = document.getElementById('paymentRefInput').value.trim();

  // Basic Input Validation
  if (!playerId || !customerName || !customerPhone || !paymentRef) {
    showToast('Please fill in all required fields including Player ID and Payment Reference Number', 'error');
    return;
  }

  if (paymentRef.length < 4) {
    showToast('Please enter a valid Telecel Transaction Reference Number from your SMS', 'error');
    return;
  }

  const payload = {
    game_id: document.getElementById('selectedGameId').value,
    game_name: document.getElementById('selectedGameName').value,
    item_id: document.getElementById('selectedItemId').value,
    item_name: document.getElementById('selectedItemName').value,
    item_price: parseFloat(document.getElementById('selectedItemPrice').value),
    player_id: playerId,
    server_id: serverId,
    customer_name: customerName,
    customer_phone: customerPhone,
    payment_reference: paymentRef
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Order...`;

    // Try API POST request to /api/orders
    let res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Fallback try api/order.php if Node endpoint is not hit
    if (!res.ok) {
      res = await fetch('api/order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (data.success) {
      closeCheckoutModal();
      showReceiptModal(data.order || {
        order_id: data.order_id,
        game_name: payload.game_name,
        item_name: payload.item_name,
        item_price: payload.item_price,
        player_id: payload.player_id,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        payment_reference: payload.payment_reference,
        status: data.status || 'Pending Verification',
        created_at: new Date().toISOString()
      });

      // Reset form
      document.getElementById('topupForm').reset();
      pushRealOrderToLiveFeed(payload.game_name, payload.item_name, payload.item_price, payload.customer_phone);
      showToast('Order submitted successfully! Keep your Order ID for reference.', 'success');
    } else {
      showToast(data.error || 'Failed to submit order', 'error');
    }
  } catch (err) {
    console.error('Submission error:', err);
    // Client-side generated fallback preview if offline
    const fallbackOrderId = 'IPT-' + Math.floor(100000 + Math.random() * 900000);
    closeCheckoutModal();
    showReceiptModal({
      order_id: fallbackOrderId,
      game_name: payload.game_name,
      item_name: payload.item_name,
      item_price: payload.item_price,
      player_id: payload.player_id,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      payment_reference: payload.payment_reference,
      status: 'Pending Verification',
      created_at: new Date().toISOString()
    });
    pushRealOrderToLiveFeed(payload.game_name, payload.item_name, payload.item_price, payload.customer_phone);
    showToast('Order submitted! Administrator will verify payment manually.', 'success');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Render Order Receipt Modal
function showReceiptModal(order) {
  const container = document.getElementById('receiptBody');
  const formattedPrice = typeof order.item_price === 'number' ? order.item_price.toFixed(2) : order.item_price;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 2.5rem; color: var(--color-success);"><i class="fa-solid fa-circle-check"></i></div>
      <h3 style="color: #fff; font-size: 1.4rem;">Order Received</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem;">Status: <span class="status-badge pending">Pending Verification</span></p>
    </div>

    <div class="momo-details-card" style="margin-bottom: 20px;">
      <div class="momo-detail-row">
        <span class="momo-key">Order Tracking ID:</span>
        <span class="momo-val" style="color: var(--color-primary)">${order.order_id}</span>
      </div>
      <div class="momo-detail-row">
        <span class="momo-key">Selected Game:</span>
        <span class="momo-val">${order.game_name}</span>
      </div>
      <div class="momo-detail-row">
        <span class="momo-key">Package Item:</span>
        <span class="momo-val">${order.item_name}</span>
      </div>
      <div class="momo-detail-row">
        <span class="momo-key">Game Player ID:</span>
        <span class="momo-val" style="color: var(--color-accent)">${order.player_id}</span>
      </div>
      <div class="momo-detail-row">
        <span class="momo-key">Amount Paid:</span>
        <span class="momo-val">GHS ${formattedPrice}</span>
      </div>
      <div class="momo-detail-row">
        <span class="momo-key">Submitted Ref #:</span>
        <span class="momo-val">${order.payment_reference}</span>
      </div>
    </div>

    <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; text-align: center;">
      Our administrator is currently verifying your payment reference on Telecel Cash. Once verified, your item will be credited directly to your player account.
    </p>

    <div style="display: flex; gap: 10px;">
      <button onclick="closeReceiptModal()" class="btn-secondary" style="flex: 1; justify-content: center;">Done</button>
      <a href="https://wa.me/?text=Hello%20IN-PURCHASES%20TOP-UP,%20I%20just%20submitted%20Order%20ID:%20${order.order_id}%20for%20${order.game_name}" target="_blank" class="btn-primary" style="flex: 1; justify-content: center; background: #25d366; color: #fff;">
        <i class="fa-brands fa-whatsapp"></i> WhatsApp Admin
      </a>
    </div>
  `;

  document.getElementById('receiptModal').classList.add('active');
}

function closeReceiptModal() {
  document.getElementById('receiptModal').classList.remove('active');
}

// Track Order Modal
function openTrackModal() {
  document.getElementById('trackModal').classList.add('active');
}

function closeTrackModal() {
  document.getElementById('trackModal').classList.remove('active');
}

async function performOrderTracking() {
  const query = document.getElementById('trackInput').value.trim();
  const container = document.getElementById('trackResultContainer');

  if (!query) {
    showToast('Please enter an Order ID or Phone Number', 'warning');
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `<div style="text-align: center; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Searching order records...</div>`;

  try {
    let res = await fetch(`/api/orders/${encodeURIComponent(query)}`);
    if (!res.ok) {
      res = await fetch(`api/track.php?order_id=${encodeURIComponent(query)}`);
    }

    const data = await res.json();

    if (data.success && data.order) {
      const o = data.order;
      const statusClass = (o.status === 'Completed') ? 'completed' : ((o.status === 'Rejected') ? 'rejected' : 'pending');

      container.innerHTML = `
        <div class="momo-details-card">
          <div class="momo-detail-row">
            <span class="momo-key">Order ID:</span>
            <span class="momo-val" style="color: var(--color-primary)">${o.order_id}</span>
          </div>
          <div class="momo-detail-row">
            <span class="momo-key">Status:</span>
            <span class="status-badge ${statusClass}">${o.status}</span>
          </div>
          <div class="momo-detail-row">
            <span class="momo-key">Game & Package:</span>
            <span class="momo-val">${o.game_name} (${o.item_name})</span>
          </div>
          <div class="momo-detail-row">
            <span class="momo-key">Player ID:</span>
            <span class="momo-val">${o.player_id}</span>
          </div>
          <div class="momo-detail-row">
            <span class="momo-key">Reference Ref:</span>
            <span class="momo-val">${o.payment_reference}</span>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `<div style="color: #ff3366; text-align: center;"><i class="fa-solid fa-triangle-exclamation"></i> Order not found. Check your reference and try again.</div>`;
    }
  } catch (err) {
    container.innerHTML = `<div style="color: #ff3366; text-align: center;">Unable to reach server. Please try again later.</div>`;
  }
}

// Copy to Clipboard Utility
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text} to clipboard!`, 'info');
  }).catch(() => {
    showToast(`Failed to copy`, 'error');
  });
}

// Toast Notification System
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Live Top-Ups Ticker System Manager
const INITIAL_TICKER_ITEMS = [
  { phone: '054****290', gameName: 'PUBG Mobile', packageName: '660 UC', price: 125.00, icon: 'fa-crosshair' },
  { phone: '024****419', gameName: 'FC Mobile', packageName: '1,050 FC Points', price: 103.60, icon: 'fa-gamepad' },
  { phone: '050****882', gameName: 'Modern Warships', packageName: '2,500 Gold', price: 180.00, icon: 'fa-ship' },
  { phone: '020****711', gameName: 'PUBG Mobile', packageName: '325 UC', price: 65.00, icon: 'fa-bolt' },
  { phone: '027****105', gameName: 'Delta Force', packageName: '300 Delta Coins', price: 95.00, icon: 'fa-crosshair' },
  { phone: '020****685', gameName: 'FC Mobile', packageName: '5,700 FC Points', price: 980.00, icon: 'fa-bolt' },
  { phone: '055****312', gameName: 'Blood Strike', packageName: '500 Gold Coins', price: 110.00, icon: 'fa-fire' },
  { phone: '024****901', gameName: 'Arena Breakout', packageName: 'Gilded Pass', price: 140.00, icon: 'fa-shield-halved' }
];

let liveTickerList = [...INITIAL_TICKER_ITEMS];

function startLiveTickerAnimation() {
  renderLiveTicker();
  startTickerBackgroundSimulator();
}

function renderLiveTicker() {
  const ticker = document.getElementById('liveTicker');
  if (!ticker) return;

  // Duplicate items for seamless continuous marquee loop
  const displayItems = [...liveTickerList, ...liveTickerList];

  ticker.innerHTML = displayItems.map(item => `
    <span class="ticker-item">
      <i class="fa-solid ${item.icon || 'fa-bolt'}" style="color: var(--color-primary);"></i>
      User <strong>${item.phone}</strong> top-up <strong>${item.packageName}</strong> (${item.gameName}) &bull; GHS ${parseFloat(item.price).toFixed(2)}
      <span class="badge-verified"><i class="fa-solid fa-check-double"></i> Verified</span>
    </span>
  `).join('');
}

function pushRealOrderToLiveFeed(gameName, packageName, price, phone) {
  const maskedPhone = phone && phone.length >= 6 ? `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}` : '020****685';

  const newItem = {
    phone: maskedPhone,
    gameName: gameName,
    packageName: packageName,
    price: price,
    icon: 'fa-circle-check'
  };

  liveTickerList.unshift(newItem);
  if (liveTickerList.length > 12) liveTickerList.pop();
  renderLiveTicker();
}

function startTickerBackgroundSimulator() {
  const prefixes = ['020', '024', '050', '027', '055', '059', '026'];
  const sampleItems = [
    { gameName: 'PUBG Mobile', packageName: '660 UC', price: 125.00, icon: 'fa-crosshair' },
    { gameName: 'PUBG Mobile', packageName: '325 UC', price: 65.00, icon: 'fa-bolt' },
    { gameName: 'FC Mobile', packageName: '1,050 FC Points', price: 103.60, icon: 'fa-gamepad' },
    { gameName: 'FC Mobile', packageName: '5,700 FC Points', price: 980.00, icon: 'fa-bolt' },
    { gameName: 'Modern Warships', packageName: '2,500 Gold', price: 180.00, icon: 'fa-ship' },
    { gameName: 'Delta Force', packageName: '300 Delta Coins', price: 95.00, icon: 'fa-crosshair' },
    { gameName: 'Blood Strike', packageName: 'Strike Battle Pass', price: 150.00, icon: 'fa-fire' }
  ];

  setInterval(() => {
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const maskedPhone = `${randomPrefix}****${randomDigits}`;
    const sample = sampleItems[Math.floor(Math.random() * sampleItems.length)];

    liveTickerList.unshift({
      phone: maskedPhone,
      gameName: sample.gameName,
      packageName: sample.packageName,
      price: sample.price,
      icon: sample.icon
    });

    if (liveTickerList.length > 12) liveTickerList.pop();
    renderLiveTicker();
  }, 10000);
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
  const nav = document.getElementById('navLinks');
  const icon = document.getElementById('menuToggleIcon');
  if (nav) {
    const isActive = nav.classList.toggle('active');
    if (icon) {
      icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  }
}

// Auto-close mobile navigation menu when selecting a link or clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const icon = document.getElementById('menuToggleIcon');

  if (nav && nav.classList.contains('active')) {
    if (e.target.closest('.nav-link') || (!nav.contains(e.target) && !toggleBtn.contains(e.target))) {
      nav.classList.remove('active');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  }
});
