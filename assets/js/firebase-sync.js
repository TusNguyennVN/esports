/**
 * ESPORTS WEBSITE - REALTIME CLOUD SYNC VIA FIREBASE
 * -------------------------------------------------------------
 * Đồng bộ đa thiết bị tức thì:
 * 1. Tài khoản tạo trên bất kỳ thiết bị nào -> Tự động lưu lên Firebase Realtime Database
 * 2. Tài khoản đang truy cập (Online Presence) -> Theo dõi chính xác người đang mở trang
 * 3. Nhật ký truy cập (Visitor Logs) -> Đẩy lên Cloud cho Admin xem trực tiếp
 */

(function () {
    let db = null;
    let isInitialized = false;
    let sessionId = null;
    let sessionRef = null;

    // Helper: chuẩn hoá key cho Firebase (không chứa '.', '#', '$', '[', ']')
    function sanitizeKey(k) {
        if (!k) return 'unknown';
        return encodeURIComponent(k.toString().trim().toLowerCase()).replace(/\./g, '%2E');
    }

    // Helper: nhận diện thiết bị
    function getDeviceString() {
        const ua = navigator.userAgent;
        let os = "Thiết bị khác";
        if (/Android/i.test(ua)) os = "Android";
        else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
        else if (/Windows/i.test(ua)) os = "Windows";
        else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS";
        else if (/Linux/i.test(ua)) os = "Linux";

        let browser = "Trình duyệt";
        if (/Edg/i.test(ua)) browser = "Edge";
        else if (/CocCoc/i.test(ua)) browser = "Cốc Cốc";
        else if (/Chrome/i.test(ua)) browser = "Chrome";
        else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
        else if (/Firefox/i.test(ua)) browser = "Firefox";

        return `${os} • ${browser}`;
    }

    // Khởi tạo Firebase
    function initFirebase() {
        if (typeof firebase === 'undefined') {
            console.warn('[FirebaseSync] Firebase SDK chưa được nhúng.');
            return false;
        }

        if (typeof window.isFirebaseConfigured === 'function' && !window.isFirebaseConfigured()) {
            console.warn('[FirebaseSync] Firebase chưa được cấu hình key thật. Vui lòng mở assets/js/firebase-config.js để dán firebaseConfig.');
            return false;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(window.firebaseConfig);
            }
            db = firebase.database();
            isInitialized = true;
            console.log('⚡ [FirebaseSync] Kết nối thành công tới Firebase Realtime Database!');
            setupPresence();
            setupAutoAccountSync();
            return true;
        } catch (err) {
            console.error('[FirebaseSync] Lỗi khởi tạo Firebase:', err);
            return false;
        }
    }

    // 1. REALTIME PRESENCE (Theo dõi người đang truy cập)
    function setupPresence() {
        if (!db) return;

        // Sinh sessionId duy nhất cho mỗi tab/phiên làm việc
        sessionId = sessionStorage.getItem('esports_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
            sessionStorage.setItem('esports_session_id', sessionId);
        }

        sessionRef = db.ref('online_sessions/' + sessionId);
        const connectedRef = db.ref('.info/connected');

        connectedRef.on('value', function (snapshot) {
            if (snapshot.val() === true) {
                // Khi mất kết nối hoặc đóng tab, Firebase tự xoá session này
                sessionRef.onDisconnect().remove();

                updateSessionPresence();
            }
        });

        // Cập nhật nhịp tim (heartbeat) định kỳ mỗi 40s
        setInterval(function () {
            if (db && sessionRef) {
                sessionRef.child('lastSeen').set(Date.now());
            }
        }, 40000);
    }

    function updateSessionPresence() {
        if (!sessionRef) return;
        const currentUser = localStorage.getItem('esportsUser') || 'Khách vãng lai';
        const pageTitle = document.title || window.location.pathname.split('/').pop() || 'Trang chủ';
        const pagePath = window.location.pathname.split('/').pop() || 'index.html';

        sessionRef.set({
            id: sessionId,
            user: currentUser,
            page: pageTitle,
            path: pagePath,
            device: getDeviceString(),
            startTime: Date.now(),
            lastSeen: Date.now()
        }).catch(function (e) {
            console.warn('[FirebaseSync] Presence set error:', e);
        });
    }

    // 2. TỰ ĐỘNG ĐỒNG BỘ TÀI KHOẢN TỪ CLOUD VỀ LOCAL STORAGE
    function setupAutoAccountSync() {
        if (!db) return;

        // Lắng nghe thay đổi tài khoản trên Cloud
        db.ref('accounts').on('value', function (snapshot) {
            const data = snapshot.val();
            if (!data) return;

            let localList = [];
            try {
                localList = JSON.parse(localStorage.getItem('esportsAccounts') || '[]');
            } catch (e) {
                localList = [];
            }

            let changed = false;
            Object.keys(data).forEach(function (key) {
                const cloudAcc = data[key];
                if (!cloudAcc || !cloudAcc.username) return;

                const idx = localList.findIndex(function (a) {
                    return a.username && a.username.toLowerCase() === cloudAcc.username.toLowerCase();
                });

                if (idx === -1) {
                    localList.push(cloudAcc);
                    changed = true;
                } else {
                    // Cập nhật số dư hoặc thông tin mới nhất
                    const localAcc = localList[idx];
                    if (JSON.stringify(localAcc) !== JSON.stringify(cloudAcc)) {
                        localList[idx] = Object.assign({}, localAcc, cloudAcc);
                        changed = true;
                    }
                }
            });

            if (changed) {
                localStorage.setItem('esportsAccounts', JSON.stringify(localList));
                console.log('🔄 [FirebaseSync] Đã đồng bộ tài khoản mới từ Cloud về máy!');

                // Cập nhật giao diện nếu có
                if (typeof window.updateHeaderAccountState === 'function') {
                    window.updateHeaderAccountState();
                }
                if (typeof window.updateAccountPortalUI === 'function') {
                    window.updateAccountPortalUI();
                }
                if (typeof window.renderUsersTable === 'function') {
                    window.renderUsersTable();
                }
                if (typeof window.renderKPIs === 'function') {
                    window.renderKPIs();
                }
            }
        });
    }

    // EXPORT API RA WINDOW ĐỂ TOÀN BỘ WEBSITE SỬ DỤNG
    window.EsportsFirebase = {
        isReady: function () {
            return isInitialized && db !== null;
        },

        // Lưu hoặc cập nhật tài khoản lên Cloud
        saveAccountToCloud: function (account) {
            if (!account || !account.username) return Promise.resolve(false);
            if (!this.isReady()) {
                console.warn('[FirebaseSync] Chưa kết nối Firebase, chỉ lưu cục bộ.');
                return Promise.resolve(false);
            }
            const key = sanitizeKey(account.username);
            return db.ref('accounts/' + key).set(account).then(function () {
                console.log('✅ [FirebaseSync] Đã lưu tài khoản lên Cloud:', account.username);
                return true;
            }).catch(function (err) {
                console.error('[FirebaseSync] Lỗi lưu tài khoản lên Cloud:', err);
                return false;
            });
        },

        // Lấy toàn bộ tài khoản từ Cloud
        fetchAccountsFromCloud: function () {
            if (!this.isReady()) return Promise.resolve([]);
            return db.ref('accounts').once('value').then(function (snapshot) {
                const data = snapshot.val();
                if (!data) return [];
                return Object.values(data);
            });
        },

        // Lắng nghe danh sách tài khoản thay đổi
        onAccountsChanged: function (callback) {
            if (!this.isReady()) return;
            db.ref('accounts').on('value', function (snapshot) {
                const data = snapshot.val();
                const list = data ? Object.values(data) : [];
                callback(list);
            });
        },

        // Lắng nghe người đang online
        onOnlineUsersChanged: function (callback) {
            if (!this.isReady()) return;
            db.ref('online_sessions').on('value', function (snapshot) {
                const data = snapshot.val() || {};
                const now = Date.now();
                // Lọc bỏ session bị treo quá 2 phút nếu có
                const activeSessions = Object.values(data).filter(function (s) {
                    return s && (now - (s.lastSeen || s.startTime || 0) < 120000);
                });
                callback(activeSessions);
            });
        },

        // Gửi nhật ký truy cập lên Cloud
        pushVisitorLogToCloud: function (log) {
            if (!this.isReady() || !log) return;
            try {
                db.ref('visitor_logs').push(log);
            } catch (e) {}
        },

        // Lắng nghe nhật ký truy cập từ Cloud
        onVisitorLogsChanged: function (callback) {
            if (!this.isReady()) return;
            // Lấy 60 log mới nhất
            db.ref('visitor_logs').limitToLast(60).on('value', function (snapshot) {
                const data = snapshot.val() || {};
                const list = Object.values(data).reverse();
                callback(list);
            });
        },

        // Cập nhật presence khi đăng nhập / đăng xuất
        updatePresenceOnAuthChange: function () {
            updateSessionPresence();
        },

        // Đồng bộ toàn bộ danh sách tài khoản lên Cloud (khi Admin chỉnh sửa, nạp tiền, reset pass)
        saveAllAccountsToCloud: function (accounts) {
            if (!this.isReady() || !Array.isArray(accounts)) return Promise.resolve(false);
            const updates = {};
            accounts.forEach(function (acc) {
                if (acc && acc.username) {
                    const k = sanitizeKey(acc.username);
                    updates['accounts/' + k] = acc;
                }
            });
            return db.ref().update(updates).then(function () {
                console.log('✅ [FirebaseSync] Đã đồng bộ tất cả tài khoản lên Cloud!');
                return true;
            }).catch(function (err) {
                console.error('[FirebaseSync] Lỗi update tài khoản:', err);
                return false;
            });
        },

        // Xóa 1 tài khoản khỏi Cloud
        deleteAccountFromCloud: function (username) {
            if (!this.isReady() || !username) return Promise.resolve(false);
            const k = sanitizeKey(username);
            return db.ref('accounts/' + k).remove().catch(function (e) {
                console.error('[FirebaseSync] Lỗi xóa tài khoản:', e);
            });
        },

        // Xóa toàn bộ nhật ký truy cập trên Cloud
        clearVisitorLogsOnCloud: function () {
            if (!this.isReady()) return Promise.resolve(false);
            return db.ref('visitor_logs').remove().catch(function (e) {});
        }
    };

    // Tự động khởi chạy khi trang load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFirebase);
    } else {
        initFirebase();
    }
})();
