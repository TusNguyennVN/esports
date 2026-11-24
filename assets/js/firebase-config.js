/**
 * ESPORTS WEBSITE - FIREBASE REALTIME CONFIGURATION
 * -------------------------------------------------------------
 * Hướng dẫn:
 * 1. Vào https://console.firebase.google.com/ tạo dự án mới (miễn phí).
 * 2. Vào mục "Build" -> "Realtime Database" -> Bấm "Create Database" (chọn Asia-Southeast1/Singapore).
 * 3. Chuyển sang Rules, cho phép:
 *    {
 *      "rules": {
 *        ".read": true,
 *        ".write": true
 *      }
 *    }
 * 4. Vào Cài đặt dự án (Project Settings) -> "Your Apps" -> Thêm Web App (</>) và copy firebaseConfig dán vào dưới đây.
 */

const firebaseConfig = {
  apiKey: "AIzaSyC85ahIvV5nptlLbC-0wEkzIS1mEuLSJgA",
  authDomain: "esports-d633e.firebaseapp.com",
  databaseURL: "https://esports-d633e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esports-d633e",
  storageBucket: "esports-d633e.firebasestorage.app",
  messagingSenderId: "937472010793",
  appId: "1:937472010793:web:bfbda96f5c06f404670a38",
  measurementId: "G-QFHW6HXQW4"
};

// Kiểm tra xem người dùng đã cấu hình Firebase thật hay chưa
window.isFirebaseConfigured = function() {
    return window.firebaseConfig &&
        window.firebaseConfig.apiKey &&
        !window.firebaseConfig.apiKey.includes('YOUR_API_KEY_HERE') &&
        window.firebaseConfig.databaseURL &&
        !window.firebaseConfig.databaseURL.includes('YOUR_PROJECT_ID');
};
