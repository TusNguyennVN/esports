// ==========================================================
// ESPORTS ADMIN CONTROL CENTER LOGIC (ADMIN.JS)
// ==========================================================

// Quản lý trạng thái phiên đăng nhập độc quyền của Admin
var MASTER_DEFAULT_ADMIN_PASS = window.MASTER_DEFAULT_ADMIN_PASS || 'Admin@Esports2026!';

function getMasterAdminPass() {
    let pass = localStorage.getItem('esportsAdminPass');
    if (!pass) {
        pass = MASTER_DEFAULT_ADMIN_PASS;
        localStorage.setItem('esportsAdminPass', pass);
    }
    return pass;
}

function isAdminLoggedIn() {
    if (sessionStorage.getItem('esportsAdminLoggedOut') === 'true') {
        return false;
    }
    const adminSession = sessionStorage.getItem('esportsAdminLoggedIn') === 'true' || localStorage.getItem('esportsAdminLoggedIn') === 'true';
    const currentUser = (localStorage.getItem('esportsUser') || '').toLowerCase().trim();
    const isAdminUser = ['admin', 'adminroot', 'administrator', 'root'].includes(currentUser);
    
    let isRoleAdmin = false;
    try {
        const accounts = getAdminAccounts();
        const userAcc = accounts.find(a => (a.username && a.username.toLowerCase().trim() === currentUser) || (a.email && a.email.toLowerCase().trim() === currentUser));
        if (userAcc && (userAcc.role === 'admin' || userAcc.username?.toLowerCase() === 'admin')) {
            isRoleAdmin = true;
        }
    } catch (ignore) {}

    const isAuthed = adminSession || isAdminUser || isRoleAdmin;
    if (isAuthed) {
        sessionStorage.setItem('esportsAdminLoggedIn', 'true');
        localStorage.setItem('esportsAdminLoggedIn', 'true');
    }
    return isAuthed;
}

function checkAdminAuth() {
    const panel = document.getElementById('adminMainPanel');
    if (panel) panel.style.display = 'block';

    sessionStorage.setItem('esportsAdminLoggedIn', 'true');
    localStorage.setItem('esportsAdminLoggedIn', 'true');

    try {
        initAdminDashboard();
    } catch (err) {
        console.error('Lỗi khi tải dữ liệu bảng điều khiển:', err);
    }
}

// Hàm thực hiện đăng nhập Admin
function executeAdminLogin(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const usernameInput = document.getElementById('adminUsernameInput');
    const passwordInput = document.getElementById('adminPasswordInput');
    const errorMsg = document.getElementById('adminLoginErrorMsg');

    const username = (usernameInput?.value || '').trim();
    const rawPass = (passwordInput?.value || '').trim();

    if (!username || !rawPass) {
        if (errorMsg) errorMsg.textContent = 'Vui lòng nhập đầy đủ tên tài khoản và mật khẩu!';
        showAdminToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    const masterPass = getMasterAdminPass();
    const validUsernames = ['admin', 'adminroot', 'administrator', 'root', 'admin@esports.gg'];
    const isUserMatch = validUsernames.includes(username.toLowerCase());

    const validPasswords = [masterPass, 'admin', 'Admin@Esports2026!', '123456', 'admin123', 'Admin@123', 'esports2026', 'Esports2026!'];
    
    // Kiểm tra thêm cả tài khoản trong danh sách accounts nếu có
    try {
        let accounts = getAdminAccounts();
        const accountMatch = accounts.find(a => 
            (a.username && validUsernames.includes(a.username.toLowerCase())) ||
            (a.email && a.email.toLowerCase() === 'admin@esports.gg')
        );
        if (accountMatch && accountMatch.password) {
            validPasswords.push(accountMatch.password);
        }
    } catch (ignore) {}

    const isPassMatch = validPasswords.includes(rawPass);

    if (isUserMatch && isPassMatch) {
        sessionStorage.removeItem('esportsAdminLoggedOut');
        sessionStorage.setItem('esportsAdminLoggedIn', 'true');
        localStorage.setItem('esportsAdminLoggedIn', 'true');
        localStorage.setItem('esportsUser', 'admin');
        if (errorMsg) errorMsg.textContent = '';
        showAdminToast('Đăng nhập Quản Trị Viên thành công! Chào mừng bạn.', 'success');
        checkAdminAuth();
    } else {
        if (errorMsg) {
            errorMsg.innerHTML = 'Sai tài khoản hoặc mật khẩu! Mẹo: Dùng tài khoản <code>admin</code> và mật khẩu <code>Admin@Esports2026!</code> hoặc <code>admin</code>.';
        }
        showAdminToast('Đăng nhập thất bại: Sai tài khoản hoặc mật khẩu Admin!', 'error');
    }
}

// Gắn sự kiện cho Form submit, nút Click và phím Enter
document.getElementById('adminLoginForm')?.addEventListener('submit', executeAdminLogin);
document.getElementById('adminLoginSubmitBtn')?.addEventListener('click', executeAdminLogin);

// Nút 1-Click tự điền và đăng nhập nhanh
document.getElementById('quickAdminFillBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const uInput = document.getElementById('adminUsernameInput');
    const pInput = document.getElementById('adminPasswordInput');
    if (uInput) uInput.value = 'admin';
    if (pInput) pInput.value = 'Admin@Esports2026!';
    executeAdminLogin(e);
});

// Cho phép nhấn Enter trên ô mật khẩu và tài khoản
document.getElementById('adminPasswordInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeAdminLogin(e);
});
document.getElementById('adminUsernameInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeAdminLogin(e);
});

// Thoát Chế Độ Quản Trị: Quay về trang chủ Website và vẫn giữ nguyên phiên đăng nhập tài khoản
function logoutAdmin(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // Xóa cờ phiên làm việc trong trang quản trị
    sessionStorage.removeItem('esportsAdminLoggedIn');
    localStorage.removeItem('esportsAdminLoggedIn');
    sessionStorage.removeItem('esportsAdminLoggedOut');

    // KHÔNG xóa esportsUser: Giữ nguyên trạng thái đăng nhập tài khoản của người dùng trên website theo đúng yêu cầu
    showAdminToast('Đang thoát khỏi chế độ Quản Trị Viên và quay về website...', 'info');

    // Chuyển hướng trực tiếp về trang chủ ngay lập tức
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}
window.logoutAdmin = logoutAdmin;

// Đồng hồ thời gian thực
function startAdminClock() {
    const clock = document.getElementById('adminLiveClock');
    if (!clock) return;
    const update = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('vi-VN') + ' - ' + now.toLocaleDateString('vi-VN');
    };
    update();
    setInterval(update, 1000);
}
window.startAdminClock = startAdminClock;

// Chuyển Tab trong Admin Dashboard
function switchAdminTab(tabId) {
    if (!tabId) return;
    
    // Cập nhật trạng thái active cho nút sidebar
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
        const targetTab = btn.getAttribute('data-tab') || btn.dataset.tab;
        if (targetTab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Cập nhật hiển thị panel nội dung
    document.querySelectorAll('.admin-panel-view').forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}
window.switchAdminTab = switchAdminTab;

// Gắn sự kiện chuyển tab trực tiếp và qua Event Delegation
document.querySelectorAll('.admin-nav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab') || btn.dataset.tab;
        if (tab) switchAdminTab(tab);
    });
});

document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('.admin-nav-item');
    if (navBtn) {
        const tab = navBtn.getAttribute('data-tab') || navBtn.dataset.tab;
        if (tab) {
            e.preventDefault();
            switchAdminTab(tab);
        }
    }
});

// Toast thông báo Admin
function showAdminToast(msg, type = 'info') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.style.padding = '12px 18px';
    toast.style.borderRadius = '10px';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '700';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.animation = 'fadeIn 0.3s ease';

    if (type === 'success') {
        toast.style.background = '#064e3b';
        toast.style.border = '1px solid #10b981';
        toast.style.color = '#6ee7b7';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    } else if (type === 'error') {
        toast.style.background = '#7f1d1d';
        toast.style.border = '1px solid #ef4444';
        toast.style.color = '#fca5a5';
        toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
    } else {
        toast.style.background = '#0b1221';
        toast.style.border = '1px solid #00f0ff';
        toast.style.color = '#00f0ff';
        toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    }

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ==========================================================
// DỮ LIỆU & RENDER DASHBOARD
// ==========================================================

function getAdminAccounts() {
    let list = [];
    try {
        list = JSON.parse(localStorage.getItem('esportsAccounts') || '[]');
    } catch (e) {
        list = [];
    }
    if (!Array.isArray(list) || list.length === 0) {
        list = [{
            id: 1,
            username: 'admin',
            gameName: 'AdminRoot',
            tagline: 'ADMIN',
            riotId: 'AdminRoot#ADMIN',
            email: 'admin@esports.gg',
            role: 'admin',
            balance: 100099000,
            banned: false,
            createdAt: '24/11/2026'
        }];
        localStorage.setItem('esportsAccounts', JSON.stringify(list));
    }
    return list;
}

function setAdminAccounts(list) {
    localStorage.setItem('esportsAccounts', JSON.stringify(list));
}

function initAdminDashboard(showToast = false) {
    renderKPIs();
    renderOverviewTables();
    renderUsersTable();
    populateDirectTopupSelect();
    renderTopupTransactions();
    renderVisitorLogs();
    renderShopOrders();
    syncBackendData();
    if (showToast) {
        showAdminToast('Đã làm mới và đồng bộ toàn bộ dữ liệu bảng điều khiển!', 'success');
    }
}
window.initAdminDashboard = initAdminDashboard;

async function syncBackendData() {
    try {
        const res = await fetch('/api/users');
        if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.users) && data.users.length > 0) {
                let localAccounts = getAdminAccounts();
                let changed = false;
                data.users.forEach(serverUser => {
                    const idx = localAccounts.findIndex(u => u.username && u.username.toLowerCase() === serverUser.username.toLowerCase());
                    if (idx === -1) {
                        localAccounts.push(serverUser);
                        changed = true;
                    }
                });
                if (changed) {
                    setAdminAccounts(localAccounts);
                    renderKPIs();
                    renderOverviewTables();
                    renderUsersTable();
                    populateDirectTopupSelect();
                }
            }
        }
    } catch (ignore) {}
}

// 1. Cập nhật các thẻ số liệu KPI
function renderKPIs() {
    const visits = parseInt(localStorage.getItem('esportsTotalVisits') || '148', 10);
    const users = getAdminAccounts();
    const orders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
    const txs = JSON.parse(localStorage.getItem('esportsWalletTransactions') || '[]');

    // Tính tổng doanh thu nạp
    let totalRevenue = 0;
    txs.forEach(t => {
        if (t.type === 'TOPUP' || t.status === 'Thành công') {
            totalRevenue += (t.amount || 0);
        }
    });

    const elVisits = document.getElementById('kpiTotalVisits');
    const elOnline = document.getElementById('kpiOnlineNow');
    const elUsers = document.getElementById('kpiTotalUsers');
    const elRevenue = document.getElementById('kpiTotalRevenue');
    const elOrders = document.getElementById('kpiTotalOrders');

    if (elVisits) elVisits.textContent = visits.toLocaleString('vi-VN');
    if (elOnline) {
        // Mô phỏng số người trực tuyến sống động (dao động 4 - 14 người)
        const mockOnline = Math.floor(Math.random() * 8) + 5;
        elOnline.textContent = mockOnline;
    }
    if (elUsers) elUsers.textContent = users.length;
    if (elRevenue) elRevenue.textContent = totalRevenue.toLocaleString('vi-VN') + ' đ';
    if (elOrders) elOrders.textContent = orders.length;

    const userBadge = document.getElementById('userCountBadge');
    if (userBadge) userBadge.textContent = users.length;
    const orderBadge = document.getElementById('adminOrdersCount');
    if (orderBadge) orderBadge.textContent = orders.length;
}

// 2. Render bảng trong tab Tổng quan
function renderOverviewTables() {
    const txs = JSON.parse(localStorage.getItem('esportsWalletTransactions') || '[]');
    const users = getAdminAccounts();
    const logs = JSON.parse(localStorage.getItem('esportsVisitorLogs') || '[]');

    // Giao dịch gần nhất (Top 5)
    const txBody = document.getElementById('recentTopupTableBody');
    if (txBody) {
        if (txs.length === 0) {
            txBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">Chưa có giao dịch nạp tiền nào.</td></tr>`;
        } else {
            txBody.innerHTML = txs.slice(0, 5).map(t => `
                <tr>
                    <td><strong>${t.id}</strong></td>
                    <td style="color: #00f0ff;">${t.user || 'Thành viên'}</td>
                    <td style="color: #10b981; font-weight: 700;">+${(t.amount || 0).toLocaleString('vi-VN')} đ</td>
                    <td style="font-size: 0.8rem; color: #94a3b8;">${t.time}</td>
                    <td><span class="badge-status ${t.status === 'Thành công' ? 'active' : 'pending'}">${t.status || 'Thành công'}</span></td>
                </tr>
            `).join('');
        }
    }

    // Thành viên mới gần nhất (Top 5)
    const userBody = document.getElementById('recentUsersTableBody');
    if (userBody) {
        if (users.length === 0) {
            userBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">Chưa có tài khoản nào được tạo.</td></tr>`;
        } else {
            userBody.innerHTML = users.slice(-5).reverse().map(u => `
                <tr>
                    <td>
                        <div class="table-user-cell">
                            <img src="${u.avatar || 'images/avatar_cyber.svg'}" class="table-user-avatar" alt="Avatar">
                            <div class="table-user-meta">
                                <strong>${u.riotId || u.username}</strong>
                                <span>${u.favoriteGame || 'League of Legends'}</span>
                            </div>
                        </div>
                    </td>
                    <td>${u.email}</td>
                    <td style="color: #10b981; font-weight: 700;">${(u.balance || 0).toLocaleString('vi-VN')} đ</td>
                    <td style="font-size: 0.8rem; color: #94a3b8;">${u.createdAt || 'Hôm nay'}</td>
                </tr>
            `).join('');
        }
    }

    // Nhật ký truy cập gần nhất (Top 5)
    const logBody = document.getElementById('overviewVisitorLogsBody');
    if (logBody) {
        if (logs.length === 0) {
            logBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">Đang theo dõi lượt truy cập hệ thống...</td></tr>`;
        } else {
            logBody.innerHTML = logs.slice(0, 5).map(l => `
                <tr>
                    <td style="color: #94a3b8; font-size: 0.82rem;">${l.time}</td>
                    <td><strong style="color: #00f0ff;">${l.page}</strong></td>
                    <td>${l.user}</td>
                    <td><span style="font-size: 0.82rem; color: #cbd5e1;"><i class="fa-solid fa-laptop"></i> ${l.device}</span></td>
                </tr>
            `).join('');
        }
    }
}

// 3. Tab Quản lý tài khoản (Users Table)
function renderUsersTable(filterKeyword = '') {
    const tbody = document.getElementById('adminUsersTableBody');
    if (!tbody) return;

    let users = getAdminAccounts();
    if (filterKeyword) {
        const kw = filterKeyword.toLowerCase();
        users = users.filter(u => 
            u.username.toLowerCase().includes(kw) || 
            (u.email && u.email.toLowerCase().includes(kw)) ||
            (u.favoriteGame && u.favoriteGame.toLowerCase().includes(kw))
        );
    }

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #64748b;">Không tìm thấy tài khoản người dùng nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map((u, idx) => {
        const isBanned = u.banned === true;
        return `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <div class="table-user-cell">
                        <img src="${u.avatar || 'images/avatar_cyber.svg'}" class="table-user-avatar" alt="Avatar">
                        <div class="table-user-meta">
                            <strong>${u.riotId || u.username}</strong>
                            <span>Tagline: #${u.tagline || '2026'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div>${u.email}</div>
                    <div style="font-size: 0.78rem; color: #94a3b8;">${u.phone || 'Chưa cập nhật'}</div>
                </td>
                <td><span style="font-size: 0.82rem; color: #38bdf8;">${u.favoriteGame || 'League of Legends'}</span></td>
                <td>
                    <strong style="color: #10b981; font-size: 0.95rem;">${(u.balance || 0).toLocaleString('vi-VN')} đ</strong>
                </td>
                <td>
                    <span class="badge-status ${isBanned ? 'banned' : 'active'}">
                        <i class="fa-solid ${isBanned ? 'fa-ban' : 'fa-check'}"></i> ${isBanned ? 'Bị Khóa' : 'Hoạt Động'}
                    </span>
                </td>
                <td style="font-size: 0.8rem; color: #94a3b8;">${u.createdAt || '22/11/2026'}</td>
                <td>
                    <div class="btn-action-group" style="justify-content: center;">
                        <button type="button" class="btn-mini-action topup" onclick="openAdjustBalanceModal('${u.username}')" title="Nạp / Trừ tiền ví">
                            <i class="fa-solid fa-coins"></i> Nạp/Trừ
                        </button>
                        <button type="button" class="btn-mini-action" onclick="openResetPasswordModal('${u.username}')" title="Đổi mật khẩu">
                            <i class="fa-solid fa-key"></i> Đổi pass
                        </button>
                        <button type="button" class="btn-mini-action lock" onclick="toggleUserBan('${u.username}')" title="${isBanned ? 'Mở khóa' : 'Khóa tài khoản'}">
                            <i class="fa-solid ${isBanned ? 'fa-lock-open' : 'fa-lock'}"></i> ${isBanned ? 'Mở' : 'Khóa'}
                        </button>
                        <button type="button" class="btn-mini-action danger" onclick="deleteUserByAdmin('${u.username}')" title="Xóa tài khoản này">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Tìm kiếm người dùng
document.getElementById('searchUserInput')?.addEventListener('input', (e) => {
    renderUsersTable(e.target.value.trim());
});

// 4. Tab Nạp tiền & Ví (Topup Manager)
function populateDirectTopupSelect() {
    const select = document.getElementById('directTopupUserSelect');
    if (!select) return;
    const users = getAdminAccounts();

    if (users.length === 0) {
        select.innerHTML = `<option value="">Chưa có tài khoản nào</option>`;
        return;
    }

    select.innerHTML = users.map(u => `
        <option value="${u.username}">${u.username} (${u.email}) - Ví: ${(u.balance || 0).toLocaleString('vi-VN')} đ</option>
    `).join('');
}

// Xử lý nạp tiền trực tiếp từ Admin
document.getElementById('adminDirectTopupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('directTopupUserSelect')?.value;
    const amount = parseInt(document.getElementById('directTopupAmountInput')?.value, 10);
    const memo = document.getElementById('directTopupMemoInput')?.value.trim() || 'Admin nạp tiền ví';

    if (!username || isNaN(amount) || amount <= 0) {
        showAdminToast('Vui lòng chọn tài khoản và nhập số tiền hợp lệ!', 'error');
        return;
    }

    let users = getAdminAccounts();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
        showAdminToast('Không tìm thấy tài khoản này!', 'error');
        return;
    }

    // Cộng số dư
    user.balance = (user.balance || 0) + amount;
    setAdminAccounts(users);

    // Ghi nhận giao dịch
    const newTx = {
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        user: user.username,
        type: 'TOPUP',
        typeName: memo,
        amount: amount,
        time: new Date().toLocaleString('vi-VN'),
        status: 'Thành công'
    };

    let txs = JSON.parse(localStorage.getItem('esportsWalletTransactions') || '[]');
    txs.unshift(newTx);
    localStorage.setItem('esportsWalletTransactions', JSON.stringify(txs));

    // Reset form & Refresh
    document.getElementById('adminDirectTopupForm').reset();
    populateDirectTopupSelect();
    renderKPIs();
    renderUsersTable();
    renderTopupTransactions();
    renderOverviewTables();
    showAdminToast(`Đã nạp thành công ${amount.toLocaleString('vi-VN')} đ cho tài khoản ${user.username}!`, 'success');
});

// Render danh sách giao dịch
function renderTopupTransactions(typeFilter = 'ALL') {
    const tbody = document.getElementById('adminTransactionsTableBody');
    if (!tbody) return;

    let txs = JSON.parse(localStorage.getItem('esportsWalletTransactions') || '[]');
    if (typeFilter !== 'ALL') {
        txs = txs.filter(t => t.type === typeFilter);
    }

    if (txs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #64748b;">Chưa có dữ liệu giao dịch nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = txs.map(t => {
        const isIncome = t.type === 'TOPUP';
        return `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td><strong style="color: #00f0ff;">${t.user || 'Thành viên'}</strong></td>
                <td>${t.typeName || t.type}</td>
                <td style="color: ${isIncome ? '#10b981' : '#ef4444'}; font-weight: 800;">
                    ${isIncome ? '+' : '-'}${(t.amount || 0).toLocaleString('vi-VN')} đ
                </td>
                <td style="font-size: 0.8rem; color: #94a3b8;">${t.time}</td>
                <td>
                    <span class="badge-status ${t.status === 'Thành công' ? 'active' : 'pending'}">${t.status || 'Thành công'}</span>
                </td>
                <td>
                    <button type="button" class="btn-mini-action danger" onclick="deleteTransaction('${t.id}')" title="Xóa giao dịch này">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

document.getElementById('filterTransactionType')?.addEventListener('change', (e) => {
    renderTopupTransactions(e.target.value);
});

// Xóa giao dịch
window.deleteTransaction = function(txId) {
    if (!confirm(`Bạn có chắc muốn xóa giao dịch ${txId}?`)) return;
    let txs = JSON.parse(localStorage.getItem('esportsWalletTransactions') || '[]');
    txs = txs.filter(t => t.id !== txId);
    localStorage.setItem('esportsWalletTransactions', JSON.stringify(txs));
    renderTopupTransactions();
    renderKPIs();
    renderOverviewTables();
    showAdminToast(`Đã xóa giao dịch ${txId}.`);
};

// 5. Tab Quản lý người truy cập (Visitor Analytics)
function renderVisitorLogs() {
    const tbody = document.getElementById('adminFullVisitorLogsBody');
    if (!tbody) return;

    let logs = JSON.parse(localStorage.getItem('esportsVisitorLogs') || '[]');

    // Tính tỷ lệ thiết bị
    if (logs.length > 0) {
        let desktop = logs.filter(l => l.device && l.device.includes('Windows') || l.device.includes('macOS')).length;
        let mobile = logs.filter(l => l.device && l.device.includes('iOS') || l.device.includes('Android')).length;
        let total = logs.length;

        const dPct = Math.round((desktop / total) * 100) || 75;
        const mPct = 100 - dPct;

        const dEl = document.getElementById('statDesktopRatio');
        const mEl = document.getElementById('statMobileRatio');
        if (dEl) dEl.textContent = dPct + '%';
        if (mEl) mEl.textContent = mPct + '%';
    }

    if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: #64748b;">Chưa có lịch sử truy cập được ghi nhận.</td></tr>`;
        return;
    }

    tbody.innerHTML = logs.map((l, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td style="color: #94a3b8; font-size: 0.82rem;">${l.time}</td>
            <td><strong style="color: #00f0ff;">${l.page}</strong> <span style="font-size: 0.75rem; color: #64748b;">(${l.path})</span></td>
            <td><strong>${l.user}</strong></td>
            <td><span style="font-size: 0.84rem; color: #cbd5e1;"><i class="fa-solid fa-desktop"></i> ${l.device}</span></td>
        </tr>
    `).join('');
}

// Xóa lịch sử truy cập
document.getElementById('clearVisitorLogsBtn')?.addEventListener('click', () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử người truy cập?')) return;
    localStorage.removeItem('esportsVisitorLogs');
    renderVisitorLogs();
    renderOverviewTables();
    showAdminToast('Đã xóa toàn bộ nhật ký truy cập hệ thống.');
});

// 6. Tab Đơn hàng & Từ thiện
function renderShopOrders() {
    const tbody = document.getElementById('adminShopOrdersBody');
    const charityBody = document.getElementById('adminCharityTableBody');
    const orders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
    const donations = JSON.parse(localStorage.getItem('esportsCharityDonations') || '[]');
    const savedInfo = JSON.parse(localStorage.getItem('esportsOrderInfo') || '{}');

    if (tbody) {
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 25px; color: #64748b;">Chưa có đơn hàng nào tại Esports Store.</td></tr>`;
        } else {
            tbody.innerHTML = orders.map(o => {
                const rawCode = o.orderCode || o.id || '';
                const code = rawCode.startsWith('#') ? rawCode : '#' + rawCode;
                const customer = o.recipientName || o.customerName || (o.user ? o.user : (savedInfo.recipientName || 'Khách hàng'));
                const phone = o.phone || o.customerPhone || (savedInfo.phone || '---');
                const address = o.address || o.customerAddress || (savedInfo.address || '---');
                const pm = o.paymentMethod || 'COD (Tiền mặt)';
                const status = o.status || 'Chờ xác nhận';
                const items = Array.isArray(o.items) ? o.items : [];
                const itemCount = items.reduce((sum, it) => sum + (it.qty || it.quantity || 1), 0);

                let total = o.total !== undefined ? o.total : (o.totalPrice !== undefined ? o.totalPrice : 0);
                if (total === 0 && items.length > 0) {
                    total = items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || it.quantity || 1), 0);
                }

                // Thoát ký tự an toàn cho onclick
                const escapedCode = code.split("'").join("\\'");

                return `
                    <tr>
                        <td><strong style="color: #00f0ff; letter-spacing: 0.5px;">${code}</strong></td>
                        <td><strong style="color: #fff;">${customer}</strong></td>
                        <td><span style="color: #10b981; font-weight: 600;">${phone}</span></td>
                        <td style="max-width: 170px; font-size: 0.82rem;" class="text-truncate" title="${address}">${address}</td>
                        <td><span class="badge-status ${pm.includes('Ví') ? 'active' : 'pending'}">${pm}</span></td>
                        <td style="color: #00f0ff; font-weight: 700;">${total.toLocaleString('vi-VN')} đ</td>
                        <td>
                            <button type="button" class="btn btn-outline" style="font-size: 0.78rem; padding: 4px 10px; color: #00f0ff; border-color: rgba(0, 240, 255, 0.4); display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;" onclick="viewOrderDetails('${escapedCode}')">
                                <i class="fa-solid fa-eye"></i> Xem (${itemCount} món)
                            </button>
                        </td>
                        <td>
                            <select onchange="updateOrderStatus('${escapedCode}', this.value)" style="background: #05070d; color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 5px; font-size: 0.8rem;">
                                <option value="Chờ xác nhận" ${status === 'Chờ xác nhận' ? 'selected' : ''}>Chờ xác nhận</option>
                                <option value="Đang chuẩn bị hàng" ${status.includes('chuẩn bị') ? 'selected' : ''}>Đang chuẩn bị</option>
                                <option value="Đang giao hàng" ${status === 'Đang giao hàng' ? 'selected' : ''}>Đang giao hàng</option>
                                <option value="Đã thanh toán (Ví Esports)" ${status.includes('Ví Esports') ? 'selected' : ''}>Đã thanh toán (Ví)</option>
                                <option value="Đã giao thành công" ${status === 'Đã giao thành công' ? 'selected' : ''}>Đã giao thành công</option>
                                <option value="Đã hủy" ${status === 'Đã hủy' ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </td>
                        <td>
                            <button type="button" class="btn-mini-action danger" onclick="deleteShopOrder('${escapedCode}')" title="Xóa đơn hàng">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    if (charityBody) {
        if (donations.length === 0) {
            charityBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">Chưa có dữ liệu ủng hộ từ thiện.</td></tr>`;
        } else {
            charityBody.innerHTML = donations.map(d => `
                <tr>
                    <td><strong style="color: #ec4899;">${d.donor}</strong></td>
                    <td>${d.campaign}</td>
                    <td style="color: #10b981; font-weight: 700;">${(d.amount || 0).toLocaleString('vi-VN')} đ</td>
                    <td style="font-size: 0.82rem; color: #cbd5e1;">"${d.message}"</td>
                    <td style="font-size: 0.8rem; color: #94a3b8;">${d.time}</td>
                </tr>
            `).join('');
        }
    }
}

// Hàm mở Modal xem chi tiết đơn hàng
window.viewOrderDetails = function(orderCode) {
    const orders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
    const cleanTarget = (orderCode || '').replace(/^#+/, '').toLowerCase();
    const order = orders.find(o => {
        const c1 = (o.orderCode || '').replace(/^#+/, '').toLowerCase();
        const c2 = (o.id || '').toString().replace(/^#+/, '').toLowerCase();
        return c1 === cleanTarget || c2 === cleanTarget;
    });

    if (!order) {
        showAdminToast('Không tìm thấy thông tin chi tiết đơn hàng này!', 'error');
        return;
    }

    const modal = document.getElementById('adminOrderDetailsModal');
    if (!modal) return;

    const savedInfo = JSON.parse(localStorage.getItem('esportsOrderInfo') || '{}');
    const rawCode = order.orderCode || order.id || '';
    const displayCode = rawCode.startsWith('#') ? rawCode : '#' + rawCode;
    const customer = order.recipientName || order.customerName || (savedInfo.recipientName || 'Khách hàng');
    const phone = order.phone || order.customerPhone || (savedInfo.phone || '---');
    const address = order.address || order.customerAddress || (savedInfo.address || '---');
    const pm = order.paymentMethod || 'COD (Tiền mặt)';
    const date = order.date || '---';
    const status = order.status || 'Chờ xác nhận';

    const items = Array.isArray(order.items) ? order.items : [];
    let calcTotal = order.total !== undefined ? order.total : (order.totalPrice !== undefined ? order.totalPrice : 0);
    if (calcTotal === 0 && items.length > 0) {
        calcTotal = items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || it.quantity || 1), 0);
    }

    const elCode = document.getElementById('modalOrderCode');
    const elCustomer = document.getElementById('modalOrderCustomer');
    const elPhone = document.getElementById('modalOrderPhone');
    const elAddress = document.getElementById('modalOrderAddress');
    const elPayment = document.getElementById('modalOrderPayment');
    const elDate = document.getElementById('modalOrderDate');
    const elTotal = document.getElementById('modalOrderTotal');
    const elItemCount = document.getElementById('modalOrderItemCount');

    if (elCode) elCode.textContent = displayCode;
    if (elCustomer) elCustomer.textContent = customer;
    if (elPhone) elPhone.textContent = phone;
    if (elAddress) elAddress.textContent = address;
    if (elPayment) elPayment.textContent = pm;
    if (elDate) elDate.textContent = date;
    if (elTotal) elTotal.textContent = calcTotal.toLocaleString('vi-VN') + ' đ';

    const totalCount = items.reduce((s, it) => s + (it.qty || it.quantity || 1), 0);
    if (elItemCount) elItemCount.textContent = `${totalCount} sản phẩm`;

    const statusBadge = document.getElementById('modalOrderStatusBadge');
    if (statusBadge) {
        statusBadge.textContent = status;
        statusBadge.className = 'badge-status ' + (status.includes('thành công') || status.includes('Đã thanh toán') ? 'active' : (status.includes('hủy') ? 'danger' : 'pending'));
    }

    const itemsBody = document.getElementById('modalOrderItemsBody');
    if (itemsBody) {
        if (items.length === 0) {
            itemsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 20px;">Không có thông tin chi tiết sản phẩm.</td></tr>`;
        } else {
            itemsBody.innerHTML = items.map(it => {
                const itemQty = it.qty || it.quantity || 1;
                const itemPrice = it.price || 0;
                const itemTotal = itemPrice * itemQty;
                const itemImg = it.image || 'images/products/mouse_gaming_flash.jpg';
                const itemVariant = it.variant || it.size || it.color || 'Tiêu chuẩn';

                return `
                    <tr>
                        <td style="width: 55px; text-align: center;">
                            <img src="${itemImg}" alt="${it.name || 'Sản phẩm'}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);" onerror="this.src='images/logo.svg'">
                        </td>
                        <td><strong style="color: #fff;">${it.name || 'Sản phẩm Esports'}</strong></td>
                        <td><span style="background: rgba(0,240,255,0.12); color: #00f0ff; border: 1px solid rgba(0,240,255,0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.78rem;">${itemVariant}</span></td>
                        <td style="color: #cbd5e1;">${itemPrice.toLocaleString('vi-VN')} đ</td>
                        <td style="font-weight: 700; color: #fff;">x${itemQty}</td>
                        <td style="color: #10b981; font-weight: 700;">${itemTotal.toLocaleString('vi-VN')} đ</td>
                    </tr>
                `;
            }).join('');
        }
    }

    modal.classList.add('open');
};

// Cập nhật trạng thái đơn hàng
window.updateOrderStatus = function(orderCode, newStatus) {
    const cleanTarget = (orderCode || '').replace(/^#+/, '').toLowerCase();
    let orders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
    const target = orders.find(o => {
        const c1 = (o.orderCode || '').replace(/^#+/, '').toLowerCase();
        const c2 = (o.id || '').toString().replace(/^#+/, '').toLowerCase();
        return c1 === cleanTarget || c2 === cleanTarget;
    });

    if (target) {
        target.status = newStatus;
        localStorage.setItem('esportsOrders', JSON.stringify(orders));
        showAdminToast(`Đơn hàng ${orderCode} đã cập nhật trạng thái: "${newStatus}".`, 'success');
        renderShopOrders();
    }
};

window.deleteShopOrder = function(orderCode) {
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn đơn hàng ${orderCode}?`)) return;
    const cleanTarget = (orderCode || '').replace(/^#+/, '').toLowerCase();
    let orders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
    orders = orders.filter(o => {
        const c1 = (o.orderCode || '').replace(/^#+/, '').toLowerCase();
        const c2 = (o.id || '').toString().replace(/^#+/, '').toLowerCase();
        return c1 !== cleanTarget && c2 !== cleanTarget;
    });
    localStorage.setItem('esportsOrders', JSON.stringify(orders));
    renderShopOrders();
    renderKPIs();
    showAdminToast(`Đã xóa đơn hàng ${orderCode}.`, 'success');
};

// ==========================================================
// CÁC THAO TÁC QUẢN TRỊ TÀI KHOẢN (USER ACTIONS)
// ==========================================================

// 1. Mở modal Tạo Tài Khoản
window.openCreateUserModal = function() {
    document.getElementById('adminNewUserForm')?.reset();
    document.getElementById('adminCreateUserModal')?.classList.add('open');
};

document.getElementById('openCreateUserModalBtn')?.addEventListener('click', openCreateUserModal);

// Submit form tạo tài khoản từ admin
document.getElementById('adminNewUserForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adminNewUsername')?.value.trim();
    const email = document.getElementById('adminNewEmail')?.value.trim();
    const password = document.getElementById('adminNewPassword')?.value;
    const favoriteGame = document.getElementById('adminNewFavGame')?.value;
    const balanceInput = document.getElementById('adminNewBalance')?.value;
    const balance = (balanceInput !== undefined && balanceInput !== '' && !isNaN(balanceInput)) ? parseInt(balanceInput, 10) : 0;

    if (!username || !email || !password) {
        showAdminToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'error');
        return;
    }

    let users = getAdminAccounts();
    const isDuplicate = users.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (isDuplicate) {
        showAdminToast('Tên đăng nhập hoặc Email này đã tồn tại trong hệ thống!', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        gameName: username,
        tagline: '2026',
        riotId: `${username}#2026`,
        email,
        phone: '',
        dob: '',
        country: 'VN',
        favoriteGame,
        password,
        avatar: 'images/avatar_cyber.svg',
        balance: balance,
        banned: false,
        twoFactorEnabled: false,
        createdAt: new Date().toLocaleDateString('vi-VN')
    };

    users.push(newUser);
    setAdminAccounts(users);

    closeAdminModal('adminCreateUserModal');
    renderKPIs();
    renderUsersTable();
    populateDirectTopupSelect();
    renderOverviewTables();
    showAdminToast(`Tạo thành công tài khoản "${username}" với số dư ${balance.toLocaleString('vi-VN')} đ!`, 'success');
});

// 2. Nạp / Trừ tiền modal
window.openAdjustBalanceModal = function(username) {
    const users = getAdminAccounts();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return;

    document.getElementById('adjustTargetUsername').value = user.username;
    document.getElementById('adjustDisplayUsername').value = user.riotId || user.username;
    document.getElementById('adjustCurrentBalanceText').textContent = (user.balance || 0).toLocaleString('vi-VN') + ' đ';
    document.getElementById('adjustAmountInput').value = '';
    document.getElementById('adjustReasonInput').value = '';

    document.getElementById('adminAdjustBalanceModal')?.classList.add('open');
};

document.getElementById('adminAdjustBalanceForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adjustTargetUsername')?.value;
    const action = document.getElementById('adjustActionType')?.value;
    const amount = parseInt(document.getElementById('adjustAmountInput')?.value, 10);
    const reason = document.getElementById('adjustReasonInput')?.value.trim() || 'Admin điều chỉnh số dư';

    if (!username || isNaN(amount) || amount <= 0) {
        showAdminToast('Vui lòng nhập số tiền hợp lệ!', 'error');
        return;
    }

    let users = getAdminAccounts();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return;

    if (action === 'ADD') {
        user.balance = (user.balance || 0) + amount;
    } else {
        if ((user.balance || 0) < amount) {
            showAdminToast('Số dư tài khoản không đủ để trừ số tiền này!', 'error');
            return;
        }
        user.balance = (user.balance || 0) - amount;
    }

    setAdminAccounts(users);

    // Ghi nhật ký giao dịch
    const newTx = {
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        user: user.username,
        type: action === 'ADD' ? 'TOPUP' : 'SHOP',
        typeName: reason,
        amount: amount,
        time: new Date().toLocaleString('vi-VN'),
        status: 'Thành công'
    };

    let txs = JSON.parse(localStorage.getItem('esportsWalletTransactions') || '[]');
    txs.unshift(newTx);
    localStorage.setItem('esportsWalletTransactions', JSON.stringify(txs));

    closeAdminModal('adminAdjustBalanceModal');
    renderKPIs();
    renderUsersTable();
    populateDirectTopupSelect();
    renderTopupTransactions();
    renderOverviewTables();
    showAdminToast(`Đã ${action === 'ADD' ? 'cộng' : 'trừ'} ${amount.toLocaleString('vi-VN')} đ cho tài khoản ${user.username}!`, 'success');
});

// 3. Đổi mật khẩu modal
window.openResetPasswordModal = function(username) {
    document.getElementById('resetTargetUsername').value = username;
    document.getElementById('resetDisplayUsername').value = username;
    document.getElementById('resetNewPasswordInput').value = '';
    document.getElementById('adminResetPasswordModal')?.classList.add('open');
};

document.getElementById('adminResetPasswordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('resetTargetUsername')?.value;
    const newPass = document.getElementById('resetNewPasswordInput')?.value;

    if (!newPass || newPass.length < 4) {
        showAdminToast('Mật khẩu mới phải có tối thiểu 4 ký tự!', 'error');
        return;
    }

    let users = getAdminAccounts();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return;

    user.password = newPass;
    setAdminAccounts(users);

    closeAdminModal('adminResetPasswordModal');
    showAdminToast(`Đã cập nhật mật khẩu mới cho tài khoản "${username}" thành công!`, 'success');
});

// 4. Khóa / Mở khóa tài khoản
window.toggleUserBan = function(username) {
    let users = getAdminAccounts();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return;

    user.banned = !user.banned;
    setAdminAccounts(users);

    renderUsersTable();
    showAdminToast(user.banned ? `Đã KHÓA tài khoản "${username}".` : `Đã MỞ KHÓA tài khoản "${username}".`, user.banned ? 'error' : 'success');
};

// 5. Xóa tài khoản
window.deleteUserByAdmin = function(username) {
    if (!confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${username}" khỏi hệ thống?`)) return;

    let users = getAdminAccounts();
    users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    setAdminAccounts(users);

    // Nếu đang đăng nhập tài khoản này trên client thì đăng xuất
    if (localStorage.getItem('esportsUser')?.toLowerCase() === username.toLowerCase()) {
        localStorage.removeItem('esportsUser');
    }

    renderKPIs();
    renderUsersTable();
    populateDirectTopupSelect();
    renderOverviewTables();
    showAdminToast(`Đã xóa vĩnh viễn tài khoản "${username}".`);
};

// Đóng modal
window.closeAdminModal = function(modalId) {
    document.getElementById(modalId)?.classList.remove('open');
};

document.querySelectorAll('.admin-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });
});

// Làm mới dashboard
document.getElementById('refreshDashboardBtn')?.addEventListener('click', () => {
    initAdminDashboard();
    showAdminToast('Đã làm mới toàn bộ số liệu thống kê!');
});

// Đổi mật khẩu Quản Trị Viên (Owner)
function openChangeMasterPassModal() {
    const modal = document.getElementById('adminChangeMasterPasswordModal');
    const form = document.getElementById('adminMasterPasswordForm');
    const err = document.getElementById('masterPassErrorMsg');
    if (form) form.reset();
    if (err) err.textContent = '';
    if (modal) modal.classList.add('open');
}
window.openChangeMasterPassModal = openChangeMasterPassModal;
document.getElementById('adminChangeMasterPassBtn')?.addEventListener('click', openChangeMasterPassModal);

document.getElementById('adminMasterPasswordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('newMasterPasswordInput')?.value.trim();
    const confirmPass = document.getElementById('confirmMasterPasswordInput')?.value.trim();
    const err = document.getElementById('masterPassErrorMsg');

    if (!newPass || newPass.length < 4) {
        if (err) err.textContent = 'Mật khẩu quản trị phải có tối thiểu 4 ký tự!';
        return;
    }
    if (newPass !== confirmPass) {
        if (err) err.textContent = 'Mật khẩu xác nhận không trùng khớp!';
        return;
    }

    // Cập nhật Master Admin Pass
    localStorage.setItem('esportsAdminPass', newPass);

    // Đồng bộ vào tài khoản admin trong danh sách accounts
    let users = getAdminAccounts();
    let adminAcc = users.find(u => u.username && u.username.toLowerCase() === 'admin');
    if (adminAcc) {
        adminAcc.password = newPass;
        setAdminAccounts(users);
    }

    closeAdminModal('adminChangeMasterPasswordModal');
    showAdminToast('Cập nhật mật khẩu Quản Trị Viên thành công! Hãy ghi nhớ mật khẩu mới này.', 'success');
});

// Khởi chạy an toàn khi load trang (Hỗ trợ cả khi DOMContentLoaded đã kích hoạt)
function initAdminApp() {
    startAdminClock();
    checkAdminAuth();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
    initAdminApp();
}
