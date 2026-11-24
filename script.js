/**
 * ==============================================================================
 * ESPORTS WEBSITE - ROOT SCRIPT ENTRY POINT (LEGACY FALLBACK)
 * ==============================================================================
 * Mã nguồn JavaScript chính cùng toàn bộ cơ sở dữ liệu đã được tái cấu trúc
 * và phân tách rõ ràng theo chuẩn module tại:
 *   - assets/js/data/news-data.js      (Dữ liệu tin tức)
 *   - assets/js/data/wiki-data.js      (Dữ liệu tướng, trang bị, vũ khí)
 *   - assets/js/data/roster-data.js    (Dữ liệu tuyển thủ & trận đấu)
 *   - assets/js/script.js              (Mã nguồn xử lý logic chính)
 * ==============================================================================
 */
(function() {
    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    if (!window.NEWS_ARTICLES_DATA) {
        loadScript('assets/js/data/news-data.js')
            .then(function() { return loadScript('assets/js/data/wiki-data.js'); })
            .then(function() { return loadScript('assets/js/data/roster-data.js'); })
            .then(function() { return loadScript('assets/js/script.js?v=3.0.0'); })
            .catch(function(err) {
                console.warn('Lỗi tải script module assets:', err);
            });
    }
})();
