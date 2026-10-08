/**
 * IN-PURCHASES TOP-UP - Admin Dashboard Logic
 */

let adminToken = localStorage.getItem('ipt_admin_token') || null;
let currentAdminUser = localStorage.getItem('ipt_admin_user') || 'Mr9iceguy';
let allOrdersCache = [];
let activeStatusFilter = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
  if (adminToken) {
    showDashboard();
    fetchAdminData();
  } else {
    showLoginOverlay();
  }
});

function showLoginOverlay() {
  document.getElementById('adminLoginOverlay').classList.add('active');
  document.getElementById('adminDashboardContent').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('changeCredsBtn').style.display = 'none';
  const badge = document.getElementById('adminUserBadge');
  if (badge) badge.style.display = 'none';
}

function showDashboard() {
  document.getElementById('adminLoginOverlay').classList.remove('active');
  document.getElementById('adminDashboardContent').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'inline-flex';
  document.getElementById('changeCredsBtn').style.display = 'inline-flex';
  const badge = document.getElementById('adminUserBadge');
  const userDisp = document.getElementById('adminUserDisplay');
  const activeLabel = document.getElementById('activeAdminUserLabel');
  if (badge && userDisp) {
    badge.style.display = 'inline-flex';
    userDisp.textContent = currentAdminUser;
  }
  if (activeLabel) {
    activeLabel.textContent = currentAdminUser;
  }
}

// Handle Admin Login Form (Master Credentials Only)
async function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUserInput').value.trim();
  const password = document.getElementById('adminPassInput').value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      adminToken = data.token;
      currentAdminUser = data.username || username;
      localStorage.setItem('ipt_admin_token', adminToken);
      localStorage.setItem('ipt_admin_user', currentAdminUser);
      showDashboard();
      fetchAdminData();
      showToast(`Welcome back, ${currentAdminUser}!`, 'success');
    } else {
      showToast(data.error || 'Invalid username or password', 'error');
    }
  } catch (err) {
    // Client-side verification fallback
    const customCreds = JSON.parse(localStorage.getItem('ipt_custom_credentials') || '{"username":"Mr9iceguy","password":"@Mr9iceguy"}');
    if (username.toLowerCase() === customCreds.username.toLowerCase() && password === customCreds.password) {
      adminToken = 'local-admin-token-' + Date.now();
      currentAdminUser = username;
      localStorage.setItem('ipt_admin_token', adminToken);
      localStorage.setItem('ipt_admin_user', currentAdminUser);
      showDashboard();
      fetchAdminData();
      showToast(`Welcome back, ${currentAdminUser}! (Local Mode)`, 'success');
    } else {
      showToast('Invalid username or password', 'error');
    }
  }
}

function adminLogout() {
  adminToken = null;
  localStorage.removeItem('ipt_admin_token');
  showLoginOverlay();
  showToast('Logged out of admin dashboard', 'info');
}

// Credential Change Functions
function openChangeCredsModal() {
  const modal = document.getElementById('adminCredsModal');
  if (!modal) return;
  modal.classList.add('active');
  document.getElementById('currentPassInput').value = '';
  document.getElementById('newUserInput').value = currentAdminUser;
  document.getElementById('newPassInput').value = '';
  document.getElementById('confirmPassInput').value = '';
}

function closeChangeCredsModal() {
  const modal = document.getElementById('adminCredsModal');
  if (modal) modal.classList.remove('active');
}

async function handleChangeCredentials(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('currentPassInput').value.trim();
  const newUsername = document.getElementById('newUserInput').value.trim();
  const newPassword = document.getElementById('newPassInput').value.trim();
  const confirmPassword = document.getElementById('confirmPassInput').value.trim();

  if (newPassword !== confirmPassword) {
    showToast('New passwords do not match!', 'error');
    return;
  }

  if (newUsername.length < 3) {
    showToast('Username must be at least 3 characters long', 'error');
    return;
  }

  if (newPassword.length < 4) {
    showToast('Password must be at least 4 characters long', 'error');
    return;
  }

  try {
    const res = await fetch('/api/admin/change-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newUsername, newPassword })
    });

    const data = await res.json();

    if (data.success) {
      currentAdminUser = data.username || newUsername;
      localStorage.setItem('ipt_admin_user', currentAdminUser);
      localStorage.setItem('ipt_custom_credentials', JSON.stringify({ username: currentAdminUser, password: newPassword }));
      closeChangeCredsModal();
      showDashboard();
      showToast('Username & password updated successfully!', 'success');
    } else {
      showToast(data.error || 'Failed to update credentials', 'error');
    }
  } catch (err) {
    // Offline local mode fallback update
    const customCreds = JSON.parse(localStorage.getItem('ipt_custom_credentials') || '{"username":"admin","password":"admin123"}');
    if (currentPassword !== customCreds.password) {
      showToast('Incorrect current password', 'error');
      return;
    }

    currentAdminUser = newUsername;
    localStorage.setItem('ipt_admin_user', currentAdminUser);
    localStorage.setItem('ipt_custom_credentials', JSON.stringify({ username: newUsername, password: newPassword }));
    closeChangeCredsModal();
    showDashboard();
    showToast('Credentials updated successfully! (Local Mode)', 'success');
  }
}

// Toggle Mobile Header Dropdown Menu
function toggleAdminMenu() {
  const actions = document.getElementById('adminNavActions');
  const icon = document.getElementById('adminMenuIcon');
  if (actions) {
    actions.classList.toggle('active');
    if (icon) {
      if (actions.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    }
  }
}

// Fetch Orders & Stats from Backend
async function fetchAdminData() {
  const refreshIcons = document.querySelectorAll('#refreshIcon, #mobileRefreshFab i');
  refreshIcons.forEach(icon => icon.classList.add('fa-spin'));

  try {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();

    if (data.success) {
      allOrdersCache = data.orders || [];
      renderAdminTable(allOrdersCache);
      updateAdminStats(allOrdersCache);
    }
  } catch (err) {
    console.warn('Could not fetch remote admin orders:', err);
  } finally {
    setTimeout(() => {
      refreshIcons.forEach(icon => icon.classList.remove('fa-spin'));
    }, 500);
  }
}

// Filter Orders by Status Pill
function filterAdminStatus(status, btnElement) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  activeStatusFilter = status;
  applyFiltersAndSearch();
}

// Search Handler
function handleAdminSearch() {
  applyFiltersAndSearch();
}

function applyFiltersAndSearch() {
  const searchTerm = document.getElementById('adminSearchInput').value.trim().toLowerCase();

  let filtered = [...allOrdersCache];

  if (activeStatusFilter !== 'ALL') {
    filtered = filtered.filter(o => o.status === activeStatusFilter);
  }

  if (searchTerm) {
    filtered = filtered.filter(o =>
      (o.order_id && o.order_id.toLowerCase().includes(searchTerm)) ||
      (o.player_id && o.player_id.toLowerCase().includes(searchTerm)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(searchTerm)) ||
      (o.customer_phone && o.customer_phone.toLowerCase().includes(searchTerm)) ||
      (o.payment_reference && o.payment_reference.toLowerCase().includes(searchTerm))
    );
  }

  renderAdminTable(filtered);
}

// Helper to format timestamps
function formatOrderTime(dateStr) {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

// Render Orders (Table for Desktop & Cards for Mobile)
function renderAdminTable(orders) {
  const tbody = document.getElementById('adminOrdersTbody');
  const cardsWrapper = document.getElementById('adminOrdersCards');

  if (orders.length === 0) {
    const emptyHtml = `
      <div class="empty-orders-card">
        <i class="fa-solid fa-inbox empty-icon"></i>
        <h3 class="empty-title">No orders yet</h3>
        <p class="empty-desc">No orders match the selected filter or search criteria.</p>
      </div>
    `;

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px 20px;">
            <i class="fa-solid fa-inbox" style="font-size: 2.2rem; margin-bottom: 12px; display: block; color: var(--color-primary);"></i>
            No orders found matching current criteria.
          </td>
        </tr>
      `;
    }
    if (cardsWrapper) {
      cardsWrapper.innerHTML = emptyHtml;
    }
    return;
  }

  // Render Desktop Table Rows
  if (tbody) {
    tbody.innerHTML = orders.map(o => {
      const statusClass = (o.status === 'Completed') ? 'completed' : ((o.status === 'Rejected') ? 'rejected' : ((o.status === 'Payment Verified') ? 'verified' : 'pending'));
      const priceFormatted = typeof o.item_price === 'number' ? o.item_price.toFixed(2) : parseFloat(o.item_price || 0).toFixed(2);

      return `
        <tr>
          <td><strong style="color: var(--color-primary);">${o.order_id}</strong></td>
          <td>
            <div style="font-weight: 700;">${o.game_name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${o.item_name}</div>
          </td>
          <td style="font-weight: 800; color: var(--color-accent);">GHS ${priceFormatted}</td>
          <td>
            <span style="font-family: monospace; font-size: 0.95rem; color: #fff;">${o.player_id}</span>
            <button class="copy-btn" onclick="copyToClipboard('${o.player_id}')" title="Copy Player ID"><i class="fa-regular fa-copy"></i></button>
          </td>
          <td>
            <div>${o.customer_name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${o.customer_phone}</div>
          </td>
          <td>
            <span class="momo-val" style="font-size: 0.88rem;">${o.payment_reference}</span>
            <button class="copy-btn" onclick="copyToClipboard('${o.payment_reference}')" title="Copy Ref"><i class="fa-regular fa-copy"></i></button>
          </td>
          <td><span class="status-badge ${statusClass}">${o.status}</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button onclick="updateOrderStatus('${o.id || o.order_id}', 'Payment Verified')" class="copy-btn" style="color: var(--color-primary);" title="Verify Payment">
                <i class="fa-solid fa-check"></i>
              </button>
              <button onclick="updateOrderStatus('${o.id || o.order_id}', 'Completed')" class="copy-btn" style="color: var(--color-success);" title="Fulfill / Complete">
                <i class="fa-solid fa-circle-check"></i>
              </button>
              <button onclick="updateOrderStatus('${o.id || o.order_id}', 'Rejected')" class="copy-btn" style="color: var(--color-danger);" title="Reject Order">
                <i class="fa-solid fa-ban"></i>
              </button>
              <button onclick="deleteOrderRecord('${o.id || o.order_id}')" class="copy-btn" style="color: #64748b;" title="Delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Mobile Cards View
  if (cardsWrapper) {
    cardsWrapper.innerHTML = orders.map(o => {
      const statusClass = (o.status === 'Completed') ? 'completed' : ((o.status === 'Rejected') ? 'rejected' : ((o.status === 'Payment Verified') ? 'verified' : 'pending'));
      const priceFormatted = typeof o.item_price === 'number' ? o.item_price.toFixed(2) : parseFloat(o.item_price || 0).toFixed(2);
      const timeStr = formatOrderTime(o.created_at || o.timestamp);

      return `
        <div class="order-mobile-card status-border-${statusClass}">
          <div class="card-header-row">
            <div class="card-id-block">
              <span class="card-order-id">${o.order_id}</span>
              <span class="card-order-time"><i class="fa-regular fa-clock"></i> ${timeStr}</span>
            </div>
            <span class="status-badge ${statusClass}">${o.status}</span>
          </div>

          <div class="card-product-box">
            <div class="card-product-left">
              <div class="card-game-name">${o.game_name}</div>
              <div class="card-item-name">${o.item_name}</div>
            </div>
            <div class="card-price-tag">GHS ${priceFormatted}</div>
          </div>

          <div class="card-details-grid">
            <div class="card-detail-item">
              <span class="detail-label">Player ID:</span>
              <div class="detail-value-wrap">
                <span class="detail-mono">${o.player_id}</span>
                <button class="btn-copy-chip" onclick="copyToClipboard('${o.player_id}')" title="Copy Player ID">
                  <i class="fa-regular fa-copy"></i> Copy
                </button>
              </div>
            </div>

            <div class="card-detail-item">
              <span class="detail-label">Telecel MoMo Ref:</span>
              <div class="detail-value-wrap">
                <span class="detail-mono ref-highlight">${o.payment_reference}</span>
                <button class="btn-copy-chip" onclick="copyToClipboard('${o.payment_reference}')" title="Copy MoMo Reference">
                  <i class="fa-regular fa-copy"></i> Copy
                </button>
              </div>
            </div>

            <div class="card-detail-item">
              <span class="detail-label">Customer Info:</span>
              <div class="detail-value-wrap">
                <span class="detail-text">${o.customer_name || 'Customer'} &bull; <a href="tel:${o.customer_phone}" class="customer-tel-link">${o.customer_phone}</a></span>
              </div>
            </div>
          </div>

          <div class="card-actions-bar">
            <button onclick="updateOrderStatus('${o.id || o.order_id}', 'Payment Verified')" class="card-action-btn btn-card-verify" title="Verify Payment">
              <i class="fa-solid fa-check"></i> Verify
            </button>
            <button onclick="updateOrderStatus('${o.id || o.order_id}', 'Completed')" class="card-action-btn btn-card-complete" title="Fulfill Order">
              <i class="fa-solid fa-circle-check"></i> Complete
            </button>
            <button onclick="updateOrderStatus('${o.id || o.order_id}', 'Rejected')" class="card-action-btn btn-card-reject" title="Reject Order">
              <i class="fa-solid fa-ban"></i> Reject
            </button>
            <button onclick="deleteOrderRecord('${o.id || o.order_id}')" class="card-action-btn btn-card-delete" title="Delete Record">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Update Stats
function updateAdminStats(orders) {
  const total = orders.length;
  const pending = orders.filter(o => o.status === 'Pending Verification').length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  const revenue = orders
    .filter(o => o.status === 'Completed' || o.status === 'Payment Verified')
    .reduce((acc, o) => acc + parseFloat(o.item_price || 0), 0);

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statRevenue').textContent = `GHS ${revenue.toFixed(2)}`;
}

// Status Update Handler
async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await res.json();
    if (data.success) {
      showToast(`Order status updated to: ${newStatus}`, 'success');
      fetchAdminData();
    } else {
      showToast(data.error || 'Update failed', 'error');
    }
  } catch (err) {
    // Local fallback update
    const idx = allOrdersCache.findIndex(o => String(o.id) === String(orderId) || o.order_id === orderId);
    if (idx !== -1) {
      allOrdersCache[idx].status = newStatus;
      renderAdminTable(allOrdersCache);
      updateAdminStats(allOrdersCache);
      showToast(`Order status set to: ${newStatus} (Local)`, 'success');
    }
  }
}

// Delete Order Record
async function deleteOrderRecord(orderId) {
  if (!confirm('Are you sure you want to delete this order record?')) return;

  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      showToast('Order removed', 'info');
      fetchAdminData();
    }
  } catch (err) {
    allOrdersCache = allOrdersCache.filter(o => String(o.id) !== String(orderId) && o.order_id !== orderId);
    renderAdminTable(allOrdersCache);
    updateAdminStats(allOrdersCache);
  }
}

// Toast helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text} to clipboard!`, 'info');
  });
}
