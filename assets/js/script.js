/**
 * ==============================================================================
 * ESPORTS WEBSITE - CORE APPLICATION JAVASCRIPT (v3.0.0)
 * ==============================================================================
 * 
 * 📌 CẤU TRÚC MÃ NGUỒN VÀ MỤC LỤC CÁC PHẦN (TABLE OF CONTENTS):
 * ------------------------------------------------------------------------------
 *  [0] NẠP DỮ LIỆU TÁCH RỜI (DATA LOADERS)
 *      - NEWS_ARTICLES_DATA        -> assets/js/data/news-data.js
 *      - wikiDatabase              -> assets/js/data/wiki-data.js
 *      - ALL_PLAYERS_DATA          -> assets/js/data/roster-data.js
 *      - ALL_MATCHES_DATA          -> assets/js/data/roster-data.js
 * 
 *  [1] LỌC TIN TỨC & MODAL BÀI VIẾT (NEWS MODULE)
 *  [2] HỆ THỐNG WIKI SPOTLIGHT, KỸ NĂNG & TRANG PHỤC (WIKI MODULE)
 *  [3] TÌM KIẾM THÔNG MINH TOÀN TRANG (SITE SEARCH ENGINE)
 *  [4] HỒ SƠ TUYỂN THỦ & TÓM TẮT TRẬN ĐẤU (ROSTER & MATCHES MODULE)
 *  [5] CỬA HÀNG TRANG BỊ & XEM TRƯỚC VŨ KHÍ (STORE MODULE)
 *  [6] MINI-GAME LUYỆN PHẢN XẠ (REFLEX PRACTICE GAME)
 *  [7] FORM NHẬN TIN NEWSLETTER & RESPONSIVE DRAWER MENU
 *  [8] GIỎ HÀNG, THEO DÕI ĐƠN HÀNG & VIETQR CHECKOUT (CART & SHOP)
 *  [9] ĐA NGÔN NGỮ VIỆT - ANH TOÀN TRANG (I18N MULTI-LANGUAGE)
 *  [10] TOAST NOTIFICATIONS & QUẢN LÝ DỮ LIỆU USER (AUTH CONTROLLER)
 *  [11] CỔNG QUẢN LÝ TÀI KHOẢN ESPORTS ID (ACCOUNT PORTAL & WALLET)
 *  [12] HỆ THỐNG XÁC THỰC MÃ CODE EMAIL (ESPORTS ID OTP)
 *  [13] ĐĂNG KÝ TÀI KHOẢN TẬP TRUNG (SQLITE SERVER SYNC)
 *  [14] LỊCH THI ĐẤU ĐỘNG & BẢNG ĐẤU TOURNAMENT (DYNAMIC BRACKETS)
 * ==============================================================================
 */

// --- 1. LỌC TIN TỨC THEO TAB GAME (TRANG NEWS.HTML) ---
const newsTabButtons = document.querySelectorAll('#newsFilterTabs .tab-btn');
const newsCards = document.querySelectorAll('#newsContainer .news-card');

if (newsTabButtons.length > 0 && newsCards.length > 0) {
    newsTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            newsTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedGame = button.getAttribute('data-game');
            newsCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.style.display = (selectedGame === 'all' || cardCategory === selectedGame) ? '' : 'none';
            });
        });
    });

    // Cho phép bấm vào thẻ tin tức để mở xem chi tiết nhanh
    newsCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.source-link-tag')) return;
            const newsId = card.getAttribute('data-news-id');
            if (newsId && typeof openNewsModal === 'function') {
                openNewsModal(newsId);
            }
        });
    });
}

// Database & Hàm mở Modal chi tiết tin tức (News Modal)

// [Extracted] NEWS_ARTICLES_DATA được nạp từ assets/js/data/news-data.js
const NEWS_ARTICLES_DATA = window.NEWS_ARTICLES_DATA || {};


window.openNewsModal = function(newsId) {
    const modal = document.getElementById('newsDetailModal');
    const contentBox = document.getElementById('newsModalContent');
    if (!modal || !contentBox) return;

    const n = NEWS_ARTICLES_DATA[newsId];
    if (!n) return;

    const imgSrc = n.image || n.fallbackImage || 'images/game_lol.png';
    const sourceLink = n.sourceUrl ? `
        <a href="${n.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.85rem; padding: 6px 14px; text-decoration: none;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Nguồn bài viết (${n.sourceName || 'Chính thức'})
        </a>
    ` : '';

    contentBox.innerHTML = `
        <div style="margin-bottom: 20px;">
            <!-- Hình ảnh bài báo chất lượng cao -->
            <div style="position: relative; border-radius: 10px; overflow: hidden; margin-bottom: 18px; border: 1px solid rgba(0, 240, 255, 0.35); max-height: 320px; background: #05070d;">
                <img src="${imgSrc}" alt="${n.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='${n.fallbackImage || 'images/game_lol.png'}'">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 15px; background: linear-gradient(transparent, rgba(5,7,13,0.9));">
                    <span class="game-tag ${n.tagClass}">${n.tag}</span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
                    <span style="color: #00f0ff; font-size: 0.88rem; font-weight: 600;"><i class="fa-solid fa-calendar-days"></i> ${n.date}</span>
                    <span style="color: #94a3b8; font-size: 0.88rem;"><i class="fa-solid fa-user-pen"></i> ${n.author}</span>
                </div>
                ${sourceLink}
            </div>

            <h2 style="color: #fff; font-size: 1.55rem; line-height: 1.35; margin-bottom: 16px; font-weight: 800;">${n.title}</h2>
            
            <div style="background: rgba(0, 240, 255, 0.08); border-left: 3px solid #00f0ff; padding: 14px 18px; border-radius: 6px; color: #e2e8f0; font-size: 1rem; line-height: 1.6; font-style: italic; margin-bottom: 22px;">
                ${n.summary}
            </div>

            <div style="color: #cbd5e1; line-height: 1.8; font-size: 0.98rem;" class="news-modal-body">
                ${n.content}
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 18px; flex-wrap: wrap; gap: 10px;">
            <div style="color: #64748b; font-size: 0.85rem;">
                <i class="fa-solid fa-shield-halved"></i> Bản quyền tin tức thuộc về ban tổ chức & nhà phát hành
            </div>
            <button type="button" class="btn btn-primary" onclick="closeNewsModal()"><i class="fa-solid fa-check"></i> Đóng Bài Viết</button>
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeNewsModal = function() {
    const modal = document.getElementById('newsDetailModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
};

// Đóng modal bài viết khi bấm ra vùng backdrop ngoài
document.getElementById('newsDetailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'newsDetailModal') {
        closeNewsModal();
    }
});

// Hàm chuẩn hóa chuỗi tiếng Việt không dấu dùng chung
function normalizeText(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}



// [Extracted] wikiDatabase được nạp từ assets/js/data/wiki-data.js
const wikiDatabase = window.wikiDatabase || {};


// ==========================================================
// HÀM MỞ & ĐÓNG CỬA SỔ SPOTLIGHT MODAL CHI TIẾT
// ==========================================================
function openWikiModal(id) {
    const item = wikiDatabase[id];
    if (!item) return;

    const overlay = document.getElementById('wikiModalOverlay');
    const heroBg = document.getElementById('wikiModalHeroBg');
    const title = document.getElementById('wikiModalTitle');
    const subtitle = document.getElementById('wikiModalSubtitle');
    const role = document.getElementById('wikiModalRole');
    const tags = document.getElementById('wikiModalTags');
    const lore = document.getElementById('wikiModalLore');
    const statBars = document.getElementById('wikiModalStatBars');
    const tips = document.getElementById('wikiModalTips');

    if (!overlay) return;

    if (heroBg) {
        heroBg.style.backgroundImage = `url('${item.image}')`;
        if (item.type === 'equipment') {
            heroBg.style.backgroundSize = 'contain';
            heroBg.style.backgroundRepeat = 'no-repeat';
            heroBg.style.backgroundPosition = 'right 40px center';
            heroBg.style.filter = 'drop-shadow(0 0 25px rgba(0, 240, 255, 0.45)) brightness(1)';
        } else {
            heroBg.style.backgroundSize = 'cover';
            heroBg.style.backgroundRepeat = 'no-repeat';
            heroBg.style.backgroundPosition = 'center 20%';
            heroBg.style.filter = 'brightness(0.75)';
        }
    }
    if (title) title.textContent = item.name;
    if (subtitle) subtitle.textContent = item.subtitle;
    if (role) {
        role.innerHTML = `<i class="fa-solid fa-shield"></i> ${item.role} • ${item.lane}`;
    }
    if (tags) {
        const gameBadgeClass = item.game === 'lol' ? 'lol' : (item.game === 'lq' ? 'lq' : 'ff');
        const typeBadgeClass = item.type === 'champion' ? 'champ' : (item.typeName === 'Trang Bị' ? 'item' : 'weapon');
        tags.innerHTML = `
            <span class="badge-cat ${gameBadgeClass}">${item.gameName}</span>
            <span class="badge-type ${typeBadgeClass}">${item.typeName}</span>
            <span class="badge-type" style="background: rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.25);">Độ khó: ${item.difficulty}</span>
        `;
    }
    if (lore) lore.textContent = item.lore;

    if (statBars && Array.isArray(item.stats)) {
        statBars.innerHTML = `
            <div class="wiki-stats-bars-grid">
                ${item.stats.map(s => `
                    <div class="stat-bar-row">
                        <span class="stat-bar-label"><i class="${s.icon}"></i> ${s.label}</span>
                        <div class="stat-bar-track">
                            <div class="stat-bar-fill" style="width: ${s.value}%;"></div>
                        </div>
                        <span class="stat-bar-val">${s.value}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // --- XỬ LÝ KỸ NĂNG: LMHT & LIÊN QUÂN CÓ BỘ CHIÊU THỨC SPOTLIGHT ---
    const lolSkillsSection = document.getElementById('wikiLolSkillsSection');
    const stdSkillsSection = document.getElementById('wikiStandardAbilitySection');
    const isChampionWithSkills = (item.game === 'lol' || item.game === 'lq') && item.type === 'champion' && Array.isArray(item.abilities) && item.abilities.length > 0;

    if (isChampionWithSkills && lolSkillsSection) {
        lolSkillsSection.style.display = 'block';
        if (stdSkillsSection) stdSkillsSection.style.display = 'none';

        const mainHeading = lolSkillsSection.querySelector('.wiki-lol-main-heading');
        const badgeRiot = lolSkillsSection.querySelector('.wiki-lol-badge-riot');
        const eyebrow = lolSkillsSection.querySelector('.wiki-lol-eyebrow');

        if (item.game === 'lol') {
            if (eyebrow) eyebrow.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> SPOTLIGHT KỸ NĂNG LIÊN MINH';
            if (badgeRiot) badgeRiot.innerHTML = '<i class="fa-solid fa-video"></i> Video Chiêu Thức Riot LMHT';
        } else if (item.game === 'lq') {
            if (eyebrow) eyebrow.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> KỸ NĂNG LIÊN QUÂN MOBILE';
            if (badgeRiot) badgeRiot.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Chiêu Thức Chuẩn Garena AoV';
        }

        const skillsNav = document.getElementById('wikiLolSkillsNav');
        if (skillsNav) {
            skillsNav.innerHTML = item.abilities.map((a, idx) => `
                <button type="button" class="wiki-lol-skill-btn ${idx === 0 ? 'active' : ''}" data-ability-idx="${idx}" aria-label="Xem kỹ năng ${a.name}">
                    <div class="wiki-lol-skill-btn-icon-wrap">
                        <img src="${a.icon || 'images/avatar_cyber.svg'}" alt="${a.name}" loading="lazy">
                        <span class="wiki-lol-skill-key-badge">${a.key}</span>
                    </div>
                    <div class="wiki-lol-skill-btn-info">
                        <span class="wiki-lol-skill-btn-key">${a.key}</span>
                        <span class="wiki-lol-skill-btn-name">${a.name}</span>
                    </div>
                </button>
            `).join('');

            const abilityBtns = skillsNav.querySelectorAll('.wiki-lol-skill-btn');
            function switchAbility(idx) {
                const targetAbility = item.abilities[idx];
                if (!targetAbility) return;

                abilityBtns.forEach((btn, bIdx) => {
                    btn.classList.toggle('active', bIdx === idx);
                });

                const videoWrapper = document.querySelector('.wiki-lol-video-wrapper');
                const video = document.getElementById('wikiAbilityVideo');
                const spellName = document.getElementById('wikiSpellName');
                const spellKey = document.getElementById('wikiSpellKey');
                const spellDesc = document.getElementById('wikiSpellDesc');

                if (targetAbility.videoMp4) {
                    if (videoWrapper) videoWrapper.style.backgroundImage = 'none';
                    if (video) {
                        video.style.display = 'block';
                        video.pause();
                        video.src = targetAbility.videoMp4;
                        if (targetAbility.thumb) video.poster = targetAbility.thumb;
                        video.load();
                        const p = video.play();
                        if (p !== undefined) p.catch(() => {});
                    }
                } else {
                    if (video) {
                        video.pause();
                        video.style.display = 'none';
                    }
                    if (videoWrapper) {
                        videoWrapper.style.backgroundImage = `url('${item.image}')`;
                        videoWrapper.style.backgroundSize = 'cover';
                        videoWrapper.style.backgroundPosition = 'center 20%';
                    }
                }

                if (spellName) spellName.textContent = targetAbility.name;
                if (spellKey) spellKey.textContent = targetAbility.key;
                if (spellDesc) spellDesc.textContent = targetAbility.desc;
            }

            abilityBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-ability-idx'), 10);
                    switchAbility(idx);
                });
            });

            switchAbility(0);
        }
    } else {
        if (lolSkillsSection) lolSkillsSection.style.display = 'none';
        if (stdSkillsSection) {
            stdSkillsSection.style.display = 'block';
            const abilityHeader = document.getElementById('wikiModalAbilityHeader');
            const abilities = document.getElementById('wikiModalAbilities');
            if (abilityHeader) {
                abilityHeader.innerHTML = item.type === 'champion'
                    ? `<i class="fa-solid fa-wand-magic-sparkles"></i> Bộ Kỹ Năng Thi Đấu`
                    : `<i class="fa-solid fa-crosshairs"></i> Thuộc Tính & Tính Năng Chi Tiết`;
            }
            if (abilities && Array.isArray(item.abilities)) {
                abilities.innerHTML = item.abilities.map(a => `
                    <div class="wiki-ability-card">
                        ${a.icon ? `<div class="ability-icon-wrap" style="width:48px;height:48px;border-radius:8px;overflow:hidden;flex-shrink:0;border:1px solid rgba(0,240,255,0.4);"><img src="${a.icon}" alt="${a.name}" style="width:100%;height:100%;object-fit:cover;"></div>` : `<div class="ability-key-badge">${a.key}</div>`}
                        <div class="ability-details">
                            <h5>${a.name}</h5>
                            <p>${a.desc}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // --- XỬ LÝ TRANG PHỤC CỦA TƯỚNG (LƯỚT XUỐNG CUỐI CÙNG - CẢ LMHT & LIÊN QUÂN) ---
    const skinsSection = document.getElementById('wikiSkinsSection');
    if (skinsSection) {
        if (Array.isArray(item.skins) && item.skins.length > 0) {
            skinsSection.style.display = 'block';
            const skinsCount = document.getElementById('wikiSkinsCount');
            const officialLink = document.getElementById('wikiOfficialLink');
            const activeSplash = document.getElementById('wikiSkinActiveSplash');
            const activeName = document.getElementById('wikiSkinActiveName');
            const skinTrack = document.getElementById('wikiSkinTrack');
            const prevBtn = document.getElementById('skinCarouselPrev');
            const nextBtn = document.getElementById('skinCarouselNext');

            if (skinsCount) skinsCount.textContent = item.skins.length;
            if (officialLink) {
                officialLink.href = item.officialUrl || (item.game === 'lol' ? `https://www.leagueoflegends.com/vi-vn/champions/${item.id}/` : `https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${item.id}/`);
                officialLink.innerHTML = item.game === 'lol'
                    ? `<i class="fa-solid fa-arrow-up-right-from-square"></i> Xem tại League of Legends`
                    : `<i class="fa-solid fa-arrow-up-right-from-square"></i> Xem tại Liên Quân Garena`;
            }

            let currentSkinIdx = 0;

            function switchSkin(idx) {
                if (idx < 0) idx = item.skins.length - 1;
                if (idx >= item.skins.length) idx = 0;
                currentSkinIdx = idx;
                const skin = item.skins[idx];
                if (!skin) return;

                if (activeSplash) {
                    activeSplash.style.opacity = '0.35';
                    activeSplash.src = skin.splash;
                    activeSplash.onload = () => { activeSplash.style.opacity = '1'; };
                }
                if (activeName) activeName.textContent = skin.name;

                if (skinTrack) {
                    const cards = skinTrack.querySelectorAll('.wiki-skin-thumb-card');
                    cards.forEach((card, cIdx) => {
                        const isMatch = cIdx === idx;
                        card.classList.toggle('active', isMatch);
                        if (isMatch) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                    });
                }
            }

            if (skinTrack) {
                skinTrack.innerHTML = item.skins.map((s, idx) => `
                    <div class="wiki-skin-thumb-card ${idx === 0 ? 'active' : ''}" data-skin-idx="${idx}" title="${s.name}">
                        <img src="${s.splash}" alt="${s.name}" loading="lazy">
                        <span>${s.name}</span>
                    </div>
                `).join('');

                const cards = skinTrack.querySelectorAll('.wiki-skin-thumb-card');
                cards.forEach(card => {
                    card.addEventListener('click', () => {
                        const idx = parseInt(card.getAttribute('data-skin-idx'), 10);
                        switchSkin(idx);
                    });
                });
            }

            if (prevBtn) {
                prevBtn.onclick = () => switchSkin(currentSkinIdx - 1);
            }
            if (nextBtn) {
                nextBtn.onclick = () => switchSkin(currentSkinIdx + 1);
            }

            switchSkin(0);
        } else {
            skinsSection.style.display = 'none';
        }
    }

    if (tips) {
        tips.innerHTML = item.tips;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeWikiModal() {
    const overlay = document.getElementById('wikiModalOverlay');
    if (overlay) {
        const video = document.getElementById('wikiAbilityVideo');
        if (video) {
            try {
                video.pause();
                video.src = '';
            } catch (err) {}
        }
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// --- 2. LỌC VÀ TÌM KIẾM WIKI (TỰA GAME, TƯỚNG/NHÂN VẬT & TRANG BỊ/VŨ KHÍ) ---
const wikiContainer = document.getElementById('wikiContainer');
if (wikiContainer) {
    const wikiGameTabBtns = document.querySelectorAll('#wikiGameTabs .tab-btn');
    const wikiSubTabBtns = document.querySelectorAll('#wikiSubTabs .sub-tab-btn');
    const wikiRoleTabBtns = document.querySelectorAll('#wikiRoleTabs .role-tab-btn');
    
    // Event delegation mở modal chi tiết cho tất cả thẻ wiki (kể cả thẻ thêm mới)
    wikiContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.wiki-card');
        if (card) {
            const wikiId = card.getAttribute('data-wiki-id');
            if (wikiId) openWikiModal(wikiId);
        }
    });

    const wikiCards = document.querySelectorAll('#wikiContainer .wiki-card');
    const wikiSearchInput = document.getElementById('wikiSearch');
    const wikiCountNumber = document.getElementById('wikiCountNumber');
    const wikiEmptyState = document.getElementById('wikiEmptyState');
    const crumbGame = document.getElementById('crumbGame');
    const crumbType = document.getElementById('crumbType');
    const crumbRole = document.getElementById('crumbRole');

    let currentWikiGame = 'all';
    let currentWikiType = 'all';
    let currentWikiRole = 'all';

    const gameLabels = {
        all: "Tất Cả Tựa Game",
        lol: "Liên Minh Huyền Thoại",
        lq: "Liên Quân Mobile",
        ff: "Free Fire"
    };

    const typeLabels = {
        all: "Tất Cả Mục",
        champion: "Tướng & Nhân Vật",
        equipment: "Trang Bị & Vũ Khí"
    };

    const roleLabels = {
        all: "Tất Cả Vai Trò",
        "dau-si": "Đấu Sĩ",
        "do-don": "Đỡ Đòn",
        "phap-su": "Pháp Sư",
        "sat-thu": "Sát Thủ",
        "tro-thu": "Trợ Thủ",
        "xa-thu": "Xạ Thủ"
    };

    function updateBreadcrumbs() {
        if (crumbGame) crumbGame.textContent = gameLabels[currentWikiGame] || "Tất Cả Tựa Game";
        if (crumbType) crumbType.textContent = typeLabels[currentWikiType] || "Tất Cả Mục";
        if (crumbRole) crumbRole.textContent = roleLabels[currentWikiRole] || "Tất Cả Vai Trò";
    }

    function applyWikiFilter() {
        const searchTerm = wikiSearchInput ? normalizeText(wikiSearchInput.value.trim()) : '';
        let visibleCount = 0;

        wikiCards.forEach(card => {
            const cardGame = card.getAttribute('data-game');
            const cardType = card.getAttribute('data-type');
            const cardRole = (card.getAttribute('data-role') || '').split(' ');
            const searchableText = normalizeText((card.getAttribute('data-name') || '') + ' ' + card.textContent);

            const matchesGame = (currentWikiGame === 'all' || cardGame === currentWikiGame);
            const matchesType = (currentWikiType === 'all' || cardType === currentWikiType);
            const matchesRole = (currentWikiRole === 'all' || cardRole.includes(currentWikiRole));
            const matchesSearch = searchableText.includes(searchTerm);

            if (matchesGame && matchesType && matchesRole && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (wikiCountNumber) {
            wikiCountNumber.textContent = visibleCount;
        }

        if (wikiEmptyState) {
            wikiEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        updateBreadcrumbs();
    }

    wikiGameTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            wikiGameTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWikiGame = btn.getAttribute('data-game');
            applyWikiFilter();
            updateWikiUrl();
        });
    });

    wikiSubTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            wikiSubTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWikiType = btn.getAttribute('data-type');
            applyWikiFilter();
            updateWikiUrl();
        });
    });

    wikiRoleTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            wikiRoleTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWikiRole = btn.getAttribute('data-role');
            applyWikiFilter();
            updateWikiUrl();
        });
    });

    if (wikiSearchInput) {
        wikiSearchInput.addEventListener('input', applyWikiFilter);
    }

    function updateWikiUrl() {
        const params = new URLSearchParams();
        if (currentWikiGame !== 'all') params.set('game', currentWikiGame);
        if (currentWikiType !== 'all') params.set('type', currentWikiType);
        if (currentWikiRole !== 'all') params.set('role', currentWikiRole);
        const queryStr = params.toString();
        const newUrl = queryStr ? `wiki.html?${queryStr}` : 'wiki.html';
        window.history.replaceState(null, '', newUrl);
    }

    function setWikiFilters(game, type, role) {
        currentWikiGame = game || 'all';
        currentWikiType = type || 'all';
        currentWikiRole = role || 'all';

        wikiGameTabBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-game') === currentWikiGame);
        });

        wikiSubTabBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-type') === currentWikiType);
        });

        wikiRoleTabBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-role') === currentWikiRole);
        });

        applyWikiFilter();
    }

    // Đọc tham số URL khi tải trang (?tab=lol-champ, ?game=..., ?type=..., ?role=...)
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const gameParam = urlParams.get('game');
    const typeParam = urlParams.get('type');
    const roleParam = urlParams.get('role');

    if (tabParam === 'lol-champ') {
        setWikiFilters('lol', 'champion', roleParam || 'all');
    } else if (tabParam === 'lq-champ') {
        setWikiFilters('lq', 'champion', roleParam || 'all');
    } else if (tabParam === 'ff-char') {
        setWikiFilters('ff', 'champion', roleParam || 'all');
    } else if (gameParam || typeParam || roleParam) {
        setWikiFilters(gameParam || 'all', typeParam || 'all', roleParam || 'all');
    } else {
        applyWikiFilter();
    }

    // Bắt sự kiện khi click menu dropdown Wiki ở Header nếu đang ở wiki.html
    document.querySelectorAll('.dropdown-menu a[href*="wiki.html"], .drawer-submenu a[href*="wiki.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.location.pathname.endsWith('wiki.html')) {
                e.preventDefault();
                const url = new URL(link.href, window.location.origin);
                const tab = url.searchParams.get('tab');
                const game = url.searchParams.get('game');
                const type = url.searchParams.get('type');
                if (tab === 'lol-champ') setWikiFilters('lol', 'champion');
                else if (tab === 'lq-champ') setWikiFilters('lq', 'champion');
                else if (tab === 'ff-char') setWikiFilters('ff', 'champion');
                else if (game || type) setWikiFilters(game || 'all', type || 'all');
                else setWikiFilters('all', 'all');
                updateWikiUrl();
                if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
            }
        });
    });

    // Gán sự kiện click cho các thẻ Wiki để mở modal chi tiết
    wikiCards.forEach(card => {
        card.addEventListener('click', () => {
            const wikiId = card.getAttribute('data-wiki-id');
            if (wikiId) openWikiModal(wikiId);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const wikiId = card.getAttribute('data-wiki-id');
                if (wikiId) openWikiModal(wikiId);
            }
        });
    });

    const wikiModalCloseBtn = document.getElementById('wikiModalClose');
    const wikiModalOverlay = document.getElementById('wikiModalOverlay');
    if (wikiModalCloseBtn) {
        wikiModalCloseBtn.addEventListener('click', closeWikiModal);
    }
    if (wikiModalOverlay) {
        wikiModalOverlay.addEventListener('click', (e) => {
            if (e.target === wikiModalOverlay) closeWikiModal();
        });
    }

}
// --- TỰ ĐỘNG THU GỌN THẺ WIKI & HIỆN NÚT "XEM CHI TIẾT" KHI HOVER ---
function formatCompactWikiCards() {
    const cards = document.querySelectorAll('#wikiContainer .wiki-card');
    cards.forEach(card => {
        if (card.classList.contains('lol-compact-card') || card.getAttribute('data-type') !== 'champion') return;

        const titleEl = card.querySelector('h3, h4');
        const titleText = titleEl ? titleEl.textContent.trim() : (card.getAttribute('data-name') || 'Chi Tiết');
        const imgEl = card.querySelector('img');

        const mediaBox = document.createElement('div');
        mediaBox.className = 'wiki-compact-media';

        if (imgEl) {
            mediaBox.appendChild(imgEl);
        } else {
            mediaBox.innerHTML = `<div class="wiki-compact-placeholder"><i class="fa-solid fa-shield-halved"></i></div>`;
        }

        const detailBtn = document.createElement('span');
        detailBtn.className = 'wiki-hover-detail-btn';
        detailBtn.innerHTML = `<i class="fa-solid fa-eye"></i> Xem Chi Tiết`;
        mediaBox.appendChild(detailBtn);

        const nameBar = document.createElement('div');
        nameBar.className = 'wiki-compact-namebar';
        nameBar.textContent = titleText;

        card.prepend(nameBar);
        card.prepend(mediaBox);
        card.classList.add('lol-compact-card');
    });
}

if (wikiContainer) {
    formatCompactWikiCards();
    // Tự động áp dụng cả khi danh sách thẻ được render động bằng JS
    const wikiObserver = new MutationObserver(() => formatCompactWikiCards());
    wikiObserver.observe(wikiContainer, { childList: true });
}
// --- 3. TÌM KIẾM TOÀN TRANG THÔNG MINH ---
const siteSearchIndex = [
    { title: "Faker (Lee Sang-hyeok)", category: "Tuyển thủ • T1 (LOL)", desc: "Đường Giữa huyền thoại với 5 chức vô địch CKTG thế giới.", url: "roster.html?game=lol", keywords: "faker lee sang hyeok t1 lol mid" },
    { title: "Maris (Nguyễn Chu Khánh Chấn)", category: "Tuyển thủ • Team Flash (Liên Quân)", desc: "Cựu MVP thế giới AIC, Pháp sư gánh team số 1 Team Flash.", url: "roster.html?game=lq", keywords: "maris nguyen chu khanh chan team flash tf lq lien quan mid raz" },
    { title: "Bear (Tô Văn Dũng)", category: "Tuyển thủ • Team Flash (Liên Quân)", desc: "Đường Caesar toàn diện với kỹ năng solo 1v1 tuyệt đỉnh.", url: "roster.html?game=lq", keywords: "bear to van dung team flash caesar florentino yena" },
    { title: "Bé Trọc (Nguyễn Khắc Cường)", category: "Tuyển thủ • Team Flash (Liên Quân)", desc: "Thần đồng xạ thủ sinh năm 2005 của Team Flash.", url: "roster.html?game=lq", keywords: "be troc nguyen khac cuong team flash adc elsu hayate" },
    { title: "Xuân Bách (XB - Trần Đức Bách)", category: "Tuyển thủ • Team Flash Legend", desc: "Huyền thoại 2 lần vô địch Thế giới AWC & AIC 2019 cùng 5 cúp ĐTDV.", url: "roster.html?game=lq", keywords: "xuan bach xb tran duc bach team flash legend aog" },
    { title: "Shin (Nguyễn Ngọc Trầm)", category: "Tuyển thủ • Team Flash Free Fire", desc: "Đội trưởng kiêm HLV kỳ cựu của Team Flash Free Fire.", url: "roster.html?game=ff", keywords: "shin nguyen ngoc tram team flash free fire ff captain" },
    { title: "Clear (Lê Thanh Toàn)", category: "Tuyển thủ • Team Flash Free Fire", desc: "Rusher toàn năng với kỹ năng cận chiến bùng nổ.", url: "roster.html?game=ff", keywords: "clear le thanh toan team flash free fire rusher" },
    { title: "ĐNP (Đoàn Ngọc Phước)", category: "Tuyển thủ • Team Flash Free Fire", desc: "Thần bắn tỉa số 1 thế hệ vàng đưa Team Flash sang Brazil dự FFWS 2019.", url: "roster.html?game=ff", keywords: "dnp doan ngoc phuoc team flash sniper awm" },
    { title: "Alan (Nguyễn Trí Dương)", category: "Tuyển thủ • P Esports (Free Fire)", desc: "Đệ nhất Rusher Free Fire Việt Nam, vô địch FFWS SEA.", url: "roster.html?game=ff", keywords: "alan nguyen tri duong p esports pesports free fire rusher" },
    { title: "Nero (Đỗ Kiên Huy)", category: "Tuyển thủ • P Esports (Free Fire)", desc: "Xạ thủ bắn xuyên bom keo M82B thần sầu của P Esports.", url: "roster.html?game=ff", keywords: "nero do kien huy p esports sniper m82b free fire" },
    { title: "Phú Đại (Nguyễn Phú Đại)", category: "Tuyển thủ • HEAVY (Free Fire)", desc: "Tay súng huyền thoại cự phách của HEAVY, vô địch Đấu Trường Sinh Tồn.", url: "roster.html?game=ff", keywords: "phu dai nguyen phu dai heavy free fire rusher m1887" },
    { title: "Panda (Thiều Văn Thuận)", category: "Tuyển thủ • HEAVY (Free Fire)", desc: "Thánh đoán bo máy cắn bo di động huyền thoại của HEAVY.", url: "roster.html?game=ff", keywords: "panda thieu van thuan heavy doan bo igl free fire" },
    { title: "TheGhost (Đặng Nguyễn Huy Khang)", category: "Tuyển thủ • Secret WAG", desc: "Tượng đài bắn tỉa AWM huyền thoại của Secret WAG Free Fire.", url: "roster.html?game=ff", keywords: "theghost dang nguyen huy khang secret wag sniper awm" },
    { title: "Gao Bạc (Nguyễn Đình Quốc)", category: "Tuyển thủ • God of Wolf (GOW)", desc: "Đội trưởng & Streamer sáng lập God of Wolf Esports.", url: "roster.html?game=ff", keywords: "gao bac nguyen dinh quoc god of wolf gow free fire" },
    { title: "K1llerS (Nguyễn Văn Thiện)", category: "Tuyển thủ • FPT Flash (Valorant)", desc: "Duelist hàng đầu VCT Challengers Vietnam, First Kill King.", url: "roster.html?game=valorant", keywords: "killers nguyen van thien fpt flash valorant duelist jett" },
    { title: "Lai Bâng (Thóng Lai Bâng)", category: "Tuyển thủ • SGP (Liên Quân)", desc: "Tuyển thủ đi rừng hàng đầu với bể tướng rộng và 8 cúp ĐTDV.", url: "roster.html?game=lq", keywords: "lai bang thong lai bang sgp lien quan rung nakroth" },
    { title: "Ghost (Nguyễn Văn Bảo)", category: "Tuyển thủ • Free Fire", desc: "Chuyên gia căn góc súng và giao tranh tầm trung.", url: "roster.html?game=ff", keywords: "ghost nguyen van bao free fire ff" },
    { title: "Demon1 (Max Mazanov)", category: "Tuyển thủ • Valorant", desc: "Bậc thầy dùng súng trường với độ chính xác tuyệt đối, vô địch VCT Champions.", url: "roster.html?game=valorant", keywords: "demon1 max mazanov valorant champions" },
    { title: "Chung kết thế giới LOL: Đội tuyển hạt giống số 1 chốt đội hình", category: "Tin tức • LOL", desc: "Những thay đổi về meta và chiến thuật cấm chọn.", url: "news.html", keywords: "chung ket the gioi lol cktg tin tuc meta" },
    { title: "Bản cập nhật đặc vụ mới Valorant", category: "Tin tức • Valorant", desc: "Nhà phát triển chính thức hé lộ kỹ năng của đặc vụ mới.", url: "news.html", keywords: "valorant dac vu moi cap nhat patch" },
    { title: "Lịch thi đấu: T1 vs Gen.G Esports (LCK Cup)", category: "Lịch thi đấu • 17:00 Hôm nay", desc: "Trận đại chiến tâm điểm LCK Cup đang diễn ra.", url: "index.html", keywords: "lich thi dau t1 geng lck" },
    { title: "Lịch thi đấu: Paper Rex vs DRX (VCT Pacific)", category: "Lịch thi đấu • 19:30 Hôm nay", desc: "Đại chiến khu vực Thái Bình Dương Valorant.", url: "index.html", keywords: "lich thi dau paper rex drx vct valorant" },
    { title: "Áo Đấu Pro Jersey 2026 - 450.000 đ", category: "Cửa hàng • Trang phục", desc: "Thun mè cao cấp thoát mồ hôi (Size S - XXL).", url: "store.html", keywords: "ao dau jersey 2026 quan ao t1 cua hang" },
    { title: "Balo Gaming Thể Thao Chống Nước - 790.000 đ", category: "Cửa hàng • Balo", desc: "Đựng vừa laptop 17.3 inch, vải Oxford trượt nước.", url: "store.html", keywords: "balo gaming chong nuoc laptop" },
    { title: "Lót Chuột Gaming Khổ Lớn LED RGB - 220.000 đ", category: "Cửa hàng • Phụ kiện", desc: "Kích thước 800x300x4mm, 14 chế độ sáng RGB.", url: "store.html", keywords: "lot chuot mousepad rgb gear" },
    { title: "Vô Cực Kiếm (+80 AD, +25% Chí Mạng)", category: "Wiki • Trang bị LOL", desc: "Giá: 3400 Vàng - Trang bị tăng sát thương chí mạng.", url: "wiki.html?game=lol&type=equipment", keywords: "vo cuc kiem infinity edge trang bi lol wiki" },
    { title: "Ahri - Hồ Ly Chín Đuôi", category: "Wiki • Tướng LOL", desc: "Pháp Sư / Sát Thủ đường giữa với độ cơ động cao và Hôn Gió.", url: "wiki.html?tab=lol-champ", keywords: "ahri ho ly chin duoi mid lol phap su tướng wiki" },
    { title: "Yasuo - Kẻ Bất Dung Thứ", category: "Wiki • Tướng LOL", desc: "Đấu Sĩ / Sát Thủ với Tường Gió và 100% tỷ lệ chí mạng từ nội tại.", url: "wiki.html?tab=lol-champ", keywords: "yasuo ke bat dung thu mid top lol dau si tuong gio wiki" },
    { title: "Florentino - Tay Kiếm Hào Hoa", category: "Wiki • Tướng Liên Quân", desc: "Đấu Sĩ đường Caesar với bộ combo nhặt hoa sát thương chuẩn.", url: "wiki.html?tab=lq-champ", keywords: "florentino tay kiem hao hoa nhat hoa lq lien quan wiki" },
    { title: "Nakroth - Lưỡi Đao Phán Xét", category: "Wiki • Tướng Liên Quân", desc: "Sát Thủ đi rừng cơ động bậc nhất với khả năng bắt chủ lực.", url: "wiki.html?tab=lq-champ", keywords: "nakroth luoi dao phan xet jungle rung lq lien quan wiki" },
    { title: "Thánh Kiếm (+110 Công VL, +25% Chí Mạng)", category: "Wiki • Trang bị Liên Quân", desc: "Giá: 2120 Vàng - Tăng 50% sát thương chí mạng.", url: "wiki.html?game=lq&type=equipment", keywords: "thanh kiem claves sancti trang bi lien quan lq wiki" },
    { title: "Alok (DJ Alok - Giai Điệu Sinh Mệnh)", category: "Wiki • Nhân vật Free Fire", desc: "Nhân vật tạo vòng hào quang hồi 5 HP/s và tăng 15% tốc chạy.", url: "wiki.html?tab=ff-char", keywords: "alok dj nhan vat free fire ff hoi mau toc do wiki" },
    { title: "Chrono (Hào Quang Hộ Mệnh)", category: "Wiki • Nhân vật Free Fire", desc: "Nhân vật tạo khiên trường lực chống chịu 800 sát thương trong 6s.", url: "wiki.html?tab=ff-char", keywords: "chrono cr7 nhan vat free fire ff khien chan wiki" },
    { title: "MP40 - Tiểu Liên Thần Tốc", category: "Wiki • Vũ khí Free Fire", desc: "Súng tiểu liên SMG cận chiến với tốc độ bắn 83 cao nhất game.", url: "wiki.html?game=ff&type=equipment", keywords: "mp40 tieu lien smg vu khi free fire ff wiki" },
    { title: "Vandal (Sát thương đầu: 160)", category: "Wiki • Vũ khí Valorant", desc: "Giá: 2900 Credits - Tốc độ bắn 9.75 v/s.", url: "wiki.html", keywords: "vandal sung valorant vu khi wiki" },
    { title: "Giả Lập Lên Đồ & Luyện Phản Xạ (Reflex Trainer)", category: "Phòng Tập Luyện", desc: "Thử nghiệm build đồ MOBA và test tốc độ phản xạ.", url: "practice.html", keywords: "phong tap luyen phan xa aim reflex build do" },
    { title: "Cổng Tải Game Esports Chính Thức (LOL, Valorant, Free Fire, CS2, PUBG, FIFA...)", category: "Tải Game", desc: "Đường dẫn tải an toàn, tốc độ cao trực tiếp từ nhà phát hành chính thức.", url: "downloads.html", keywords: "tai game download game client lien quan valorant lol free fire ff fifa fc online fco cs2 pubg mobile" },
    { title: "Tải Free Fire (CH Play / App Store)", category: "Tải Game • Mobile", desc: "Link tải chính thức Garena Free Fire từ Google Play Store.", url: "downloads.html", keywords: "tai free fire download ff ch play google play" },
    { title: "Tải Counter-Strike 2 (CS2 Steam)", category: "Tải Game • PC", desc: "Link tải chính thức Counter-Strike 2 miễn phí trên Steam Valve.", url: "downloads.html", keywords: "tai cs2 download counter strike 2 steam valve" },
    { title: "Tải PUBG Mobile VN (VNG Games)", category: "Tải Game • Mobile", desc: "Link tải chính thức PUBG Mobile VN phát hành bởi VNGGames.", url: "downloads.html", keywords: "tai pubg mobile vng download pubgm sinh ton" },
    { title: "Tải EA Sports FC Online (FIFA Online)", category: "Tải Game • PC", desc: "Link tải bộ cài đặt FC Online chính thức từ Garena & EA Sports.", url: "downloads.html", keywords: "tai fifa download fc online fco fo4 garena bong da" },
    { title: "Giải Đấu Trực Tiếp LOL, Free Fire, Liên Quân", category: "Giải Đấu • Video Trực Tiếp", desc: "Xem video cập nhật trực tiếp các giải đấu LOL, Free Fire và Liên Quân Mobile.", url: "tournaments.html", keywords: "giai dau truc tiep video live lol free fire lien quan tournament apl aic dtdv ffws lck cktg" }
];

const searchResultPanel = document.createElement('div');
searchResultPanel.id = 'globalSearchResults';
searchResultPanel.className = 'global-search-results';
document.body.appendChild(searchResultPanel);

function executeGlobalSearch(rawQuery) {
    const query = rawQuery.trim();
    if (!query) {
        searchResultPanel.classList.remove('open');
        return;
    }

    const normQuery = normalizeText(query);
    const matches = siteSearchIndex.filter(item => {
        const haystack = normalizeText(`${item.title} ${item.category} ${item.desc} ${item.keywords}`);
        return haystack.includes(normQuery);
    });

    if (matches.length === 0) {
        searchResultPanel.innerHTML = `
            <div class="search-res-header">
                <span>Kết quả cho "<strong>${query}</strong>"</span>
                <button type="button" onclick="document.getElementById('globalSearchResults').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p class="search-res-empty">Không tìm thấy nội dung phù hợp. Thử tìm: <em>Faker, Lai Bâng, Vandal, Áo đấu, Vô Cực Kiếm...</em></p>
        `;
    } else {
        searchResultPanel.innerHTML = `
            <div class="search-res-header">
                <span>Tìm thấy <strong>${matches.length}</strong> kết quả cho "<strong>${query}</strong>"</span>
                <button type="button" onclick="document.getElementById('globalSearchResults').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="search-res-list">
                ${matches.map(m => `
                    <a href="${m.url}" class="search-res-item">
                        <span class="search-res-cat">${m.category}</span>
                        <h4>${m.title}</h4>
                        <p>${m.desc}</p>
                    </a>
                `).join('')}
            </div>
        `;
    }
    searchResultPanel.classList.add('open');
}

document.querySelectorAll('#globalSearch, .drawer-search input').forEach(input => {
    input.addEventListener('input', () => executeGlobalSearch(input.value));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeGlobalSearch(input.value);
        }
    });
});

document.addEventListener('click', (e) => {
    const searchBox = document.getElementById('headerSearchBox');
    if (!searchResultPanel.contains(e.target) && (!searchBox || !searchBox.contains(e.target)) && !e.target.closest('.drawer-search')) {
        searchResultPanel.classList.remove('open');
    }
});



// [Extracted] ALL_PLAYERS_DATA và ALL_MATCHES_DATA được nạp từ assets/js/data/roster-data.js
const ALL_PLAYERS_DATA = window.ALL_PLAYERS_DATA || {};
const ALL_MATCHES_DATA = window.ALL_MATCHES_DATA || {};


// ==========================================================================
// HÀM MỞ / ĐÓNG MODAL HỒ SƠ TUYỂN THỦ (PLAYER PROFILE MODAL)
// ==========================================================================
function openPlayerModal(playerId) {
    const modal = document.getElementById('playerDetailModal');
    if (!modal) return;
    
    const p = ALL_PLAYERS_DATA[playerId];
    if (!p) return;

    // Set Avatar & Banner
    const avatarEl = document.getElementById('ppmAvatar');
    if (avatarEl) {
        avatarEl.src = p.avatar || p.teamLogo || 'images/avatar_cyber.svg';
        avatarEl.onerror = function() { this.onerror = null; this.src = p.teamLogo || 'images/team_flash.svg'; };
    }

    // Set Name & Info
    const nickEl = document.getElementById('ppmNick');
    if (nickEl) nickEl.textContent = p.name;

    const realEl = document.getElementById('ppmRealName');
    if (realEl) realEl.textContent = `(${p.realName})`;

    const countryEl = document.getElementById('ppmCountry');
    if (countryEl) countryEl.textContent = `${p.country} • ${p.age} • Vị trí: ${p.role}`;

    const teamEl = document.getElementById('ppmTeamName');
    if (teamEl) teamEl.textContent = p.teamName;

    // Set Skill Bars
    const s = p.skills || { mechanics: 95, reflex: 95, macro: 95, teamfight: 95, pool: 95 };
    const setBar = (idStat, idBar, val) => {
        const statEl = document.getElementById(idStat);
        const barEl = document.getElementById(idBar);
        if (statEl) statEl.textContent = val + '%';
        if (barEl) barEl.style.width = val + '%';
    };

    setBar('ppmStatMech', 'ppmBarMech', s.mechanics || 95);
    setBar('ppmStatReflex', 'ppmBarReflex', s.reflex || 95);
    setBar('ppmStatMacro', 'ppmBarMacro', s.macro || 95);
    setBar('ppmStatTf', 'ppmBarTf', s.teamfight || 95);
    setBar('ppmStatPool', 'ppmBarPool', s.pool || 95);

    // Set Trophies
    const trophEl = document.getElementById('ppmTrophiesList');
    if (trophEl) {
        trophEl.innerHTML = `
            <li><i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> ${p.trophy || 'Danh hiệu chuyên nghiệp'}</li>
            <li><i class="fa-solid fa-star" style="color: #00f0ff;"></i> KDA / Hiệu suất: <strong>${p.kda}</strong> (Tỉ lệ thắng: ${p.winrate})</li>
            <li><i class="fa-solid fa-medal" style="color: #10b981;"></i> Đạt danh hiệu MVP: <strong>${p.mvp}</strong></li>
        `;
    }

    const sigEl = document.getElementById('ppmSignature');
    if (sigEl) sigEl.textContent = p.signature || '-';

    const srcEl = document.getElementById('ppmSource');
    if (srcEl) srcEl.textContent = p.source || 'teamflash.gg / giaidau.ff.garena.vn';

    const bioEl = document.getElementById('ppmBio');
    if (bioEl) bioEl.textContent = p.bio || p.desc;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePlayerModal() {
    const modal = document.getElementById('playerDetailModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ==========================================================================
// HÀM MỞ / ĐÓNG MODAL TÓM TẮT TRẬN ĐẤU (MATCH SUMMARY MODAL)
// ==========================================================================
function openMatchSummary(matchId) {
    const modal = document.getElementById('matchSummaryModal');
    if (!modal) return;

    let m = ALL_MATCHES_DATA[matchId];
    if (!m) {
        m = generateGenericMatchSummary(matchId);
    }

    document.getElementById('msmTournamentTitle').textContent = m.title || 'Tóm Tắt Trận Đấu';
    document.getElementById('msmTeam1Name').textContent = m.team1.name;
    document.getElementById('msmTeam2Name').textContent = m.team2.name;
    document.getElementById('msmTeam1Logo').src = m.team1.logo || 'images/team_flash.svg';
    document.getElementById('msmTeam2Logo').src = m.team2.logo || 'images/team_sgp.svg';
    document.getElementById('msmScore').textContent = `${m.team1.score} - ${m.team2.score}`;
    document.getElementById('msmStatus').textContent = m.status || 'Đã Kết Thúc';
    document.getElementById('msmMeta').textContent = m.meta || 'Giải Đấu Esports';

    // MVP
    document.getElementById('msmMvpName').textContent = m.mvp.name;
    document.getElementById('msmMvpKDA').textContent = m.mvp.kda;
    document.getElementById('msmMvpPick').textContent = m.mvp.pick;
    document.getElementById('msmMvpDamage').textContent = m.mvp.damage;

    // Timeline
    const tlEl = document.getElementById('msmTimelineList');
    if (tlEl && m.timeline) {
        tlEl.innerHTML = m.timeline.map(t => `
            <li class="timeline-item">
                <span class="timeline-time">${t.time}</span>
                <span class="timeline-desc">${t.desc}</span>
            </li>
        `).join('');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMatchSummary() {
    const modal = document.getElementById('matchSummaryModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ==========================================================================
// HÀM MỞ / ĐÓNG MODAL ĐỘI HÌNH RA SÂN (MATCH LINEUP MODAL)
// ==========================================================================
function openMatchLineup(matchId) {
    const modal = document.getElementById('matchLineupModal');
    if (!modal) return;

    let m = ALL_MATCHES_DATA[matchId];
    if (!m) {
        m = generateGenericMatchSummary(matchId);
    }

    const lineup = m.lineup;
    document.getElementById('mlmTitle').textContent = `Đội Hình Ra Sân: ${m.team1.name} vs ${m.team2.name}`;
    document.getElementById('mlmCoach1').textContent = lineup.coach1 || 'Ban Huấn Luyện';
    document.getElementById('mlmCoach2').textContent = lineup.coach2 || 'Ban Huấn Luyện';
    document.getElementById('mlmSubs1').textContent = lineup.subs1 || 'Đang cập nhật';
    document.getElementById('mlmSubs2').textContent = lineup.subs2 || 'Đang cập nhật';

    const grid = document.getElementById('mlmGrid');
    if (grid && lineup.matchups) {
        grid.innerHTML = lineup.matchups.map(item => `
            <div class="lineup-matchup-row">
                <div class="lineup-player" onclick="openPlayerModal('${item.p1.id || 'fl_maris'}')" style="cursor: pointer;" title="Bấm để xem hồ sơ ${item.p1.name}">
                    <div class="lineup-player-avatar">
                        <img src="${m.team1.logo || 'images/team_flash.svg'}" alt="${item.p1.name}">
                    </div>
                    <div class="lineup-player-info">
                        <div class="lp-name">${item.p1.name}</div>
                        <div class="lp-pick"><i class="fa-solid fa-gamepad" style="color: #00f0ff;"></i> ${item.p1.pick} • KDA: ${item.p1.kda}</div>
                    </div>
                </div>

                <div class="lineup-role-pill">${item.role}</div>

                <div class="lineup-player right" onclick="openPlayerModal('${item.p2.id || 'lol_faker'}')" style="cursor: pointer;" title="Bấm để xem hồ sơ ${item.p2.name}">
                    <div class="lineup-player-avatar">
                        <img src="${m.team2.logo || 'images/team_sgp.svg'}" alt="${item.p2.name}">
                    </div>
                    <div class="lineup-player-info">
                        <div class="lp-name">${item.p2.name}</div>
                        <div class="lp-pick"><i class="fa-solid fa-gamepad" style="color: #c084fc;"></i> ${item.p2.pick} • KDA: ${item.p2.kda}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMatchLineup() {
    const modal = document.getElementById('matchLineupModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
}

function openMatchSummaryByTeams(team1, team2, gameId, tournament) {
    const customKey = `match_${team1}_${team2}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (ALL_MATCHES_DATA[customKey]) {
        openMatchSummary(customKey);
        return;
    }

    const dynamicMatch = {
        title: `${tournament} • ${team1} vs ${team2}`,
        team1: { name: team1, logo: getTeamLogoByName(team1), score: Math.floor(Math.random() * 2) + 1 },
        team2: { name: team2, logo: getTeamLogoByName(team2), score: Math.floor(Math.random() * 2) },
        status: "Đang Diễn Ra / Trực Tiếp",
        meta: `Giải Đấu ${tournament} • Bản Quyền Chính Thức`,
        mvp: {
            name: `${team1} Star Player`,
            kda: "6/1/9",
            pick: gameId === 'ff' ? "M1887 & Woodpecker" : (gameId === 'lol' ? "Orianna" : "Raz"),
            damage: "105,400 Sát Thương"
        },
        timeline: [
            { time: "05:12", desc: `Chiến công đầu thuộc về ${team1} sau pha phối hợp giao tranh chuẩn chỉ.` },
            { time: "16:40", desc: `Pha combat then chốt tại cứ điểm lớn, ${team1} giành quyền kiểm soát ván đấu.` }
        ]
    };
    ALL_MATCHES_DATA[customKey] = dynamicMatch;
    openMatchSummary(customKey);
}

function openMatchLineupByTeams(team1, team2, gameId, tournament) {
    const customKey = `match_${team1}_${team2}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (!ALL_MATCHES_DATA[customKey] || !ALL_MATCHES_DATA[customKey].lineup) {
        ALL_MATCHES_DATA[customKey] = generateLineupForTeams(team1, team2, gameId, tournament);
    }
    openMatchLineup(customKey);
}

function getTeamLogoByName(teamName) {
    const t = teamName.toLowerCase();
    if (t.includes('flash')) return 'images/team_flash.svg';
    if (t.includes('phantom') || t.includes('sgp')) return 'images/team_sgp.svg';
    if (t.includes('heavy')) return 'images/team_heavy.svg';
    if (t.includes('wag')) return 'images/team_wag.svg';
    if (t.includes('pesports') || t.includes('p esports')) return 'images/team_pesports.svg';
    if (t.includes('gow') || t.includes('wolf')) return 'images/team_gow.svg';
    if (t.includes('gaming') || t.includes('vgm')) return 'images/team_vgaming.svg';
    if (t.includes('t1')) return 'images/team_t1.svg';
    if (t.includes('gen.g') || t.includes('geng')) return 'images/team_geng.svg';
    return 'images/avatar_cyber.svg';
}

function generateLineupForTeams(team1, team2, gameId, tournament) {
    const isFF = gameId === 'ff';
    const roles = isFF ? 
        ["Rusher 1 (Đột Kích)", "Rusher 2 (Tiên Phong)", "Sniper (Bắn Tỉa)", "IGL (Chỉ Huy)"] :
        ["Đường Trên / Caesar", "Đi Rừng (Jungle)", "Đường Giữa (Mid)", "Xạ Thủ (ADC)", "Hỗ Trợ (Support)"];
    
    const matchups = roles.map((r, i) => ({
        role: r,
        p1: { name: `${team1} #${i+1}`, pick: isFF ? "M1887" : "Tướng Thuận Tay", kda: "4/2/7", id: "fl_maris" },
        p2: { name: `${team2} #${i+1}`, pick: isFF ? "MP40" : "Tướng Chiến Thuật", kda: "3/3/5", id: "pe_alan" }
    }));

    return {
        title: `${tournament} • ${team1} vs ${team2}`,
        team1: { name: team1, logo: getTeamLogoByName(team1), score: 2 },
        team2: { name: team2, logo: getTeamLogoByName(team2), score: 1 },
        status: "Đội Hình Thi Đấu",
        meta: tournament,
        mvp: { name: `${team1} Leader`, kda: "7/1/8", pick: "Đội Hình Chính", damage: "Đỉnh Cao" },
        timeline: [{ time: "Trận Đấu", desc: `Hai đội tuyển ${team1} và ${team2} sẵn sàng bước vào trận chiến sinh tử!` }],
        lineup: {
            coach1: `HLV Trưởng ${team1}`,
            coach2: `HLV Trưởng ${team2}`,
            subs1: "Dự bị 1, Dự bị 2",
            subs2: "Dự bị A, Dự bị B",
            matchups: matchups
        }
    };
}

function generateGenericMatchSummary(id) {
    return {
        title: "Tóm Tắt Trận Đấu Esports Đỉnh Cao",
        team1: { name: "Team 1", logo: "images/team_flash.svg", score: 2 },
        team2: { name: "Team 2", logo: "images/team_sgp.svg", score: 1 },
        status: "Đã Kết Thúc",
        meta: "Giải Đấu Chuyên Nghiệp",
        mvp: { name: "Tuyển thủ Xuất Sắc", kda: "8/2/10", pick: "Chủ Lực", damage: "115,000" },
        timeline: [
            { time: "Ván 1", desc: "Hai đội thi đấu cống hiến với những pha giao tranh mãn nhãn." }
        ],
        lineup: {
            coach1: "Ban Huấn Luyện", coach2: "Ban Huấn Luyện",
            subs1: "Cầu thủ dự bị", subs2: "Cầu thủ dự bị",
            matchups: [
                { role: "Vị Trí 1", p1: { name: "Tuyển thủ A", pick: "Vũ khí chính", kda: "5/2/8" }, p2: { name: "Tuyển thủ B", pick: "Vũ khí phụ", kda: "3/4/6" } }
            ]
        }
    };
}

function switchSummaryTab(idx) {
    const tabs = document.querySelectorAll('#msmGameTabs .match-tab-pill');
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
}

// ==========================================================================
// BỘ LỌC NÂNG CAO TRANG TUYỂN THỦ (ROSTER SEARCH & TEAM CHIPS & TABS)
// ==========================================================================
function initRosterFilters() {
    const searchInput = document.getElementById('rosterSearchInput');
    const teamChips = document.querySelectorAll('#rosterTeamChips .team-chip-btn');
    const gameTabs = document.querySelectorAll('.game-tabs .tab-btn');
    const counterBadge = document.getElementById('rosterCounterBadge');
    
    let currentGame = 'all';
    let currentTeam = 'all';
    let searchQuery = '';

    function applyFilters() {
        const cards = document.querySelectorAll('#rosterContainer .player-card');
        if (!cards.length) return;

        let visibleCount = 0;
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const cardTeam = card.getAttribute('data-team') || '';
            const cardText = card.textContent.toLowerCase();

            const matchGame = (currentGame === 'all' || cardCategory === currentGame);
            const matchTeam = (currentTeam === 'all' || cardTeam === currentTeam);
            const matchSearch = (!searchQuery || cardText.includes(searchQuery));

            if (matchGame && matchTeam && matchSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (counterBadge) {
            counterBadge.textContent = visibleCount;
        }
    }

    // Tab game click
    gameTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            gameTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGame = btn.getAttribute('data-game') || 'all';
            applyFilters();
            const newUrl = currentGame === 'all' ? 'roster.html' : `roster.html?game=${currentGame}`;
            window.history.replaceState(null, '', newUrl);
        });
    });

    // Team chip click
    teamChips.forEach(chip => {
        chip.addEventListener('click', () => {
            teamChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentTeam = chip.getAttribute('data-team-filter') || 'all';
            applyFilters();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    if (gameParam) {
        const matchingBtn = document.querySelector(`.game-tabs .tab-btn[data-game="${gameParam}"]`);
        if (matchingBtn) {
            gameTabs.forEach(b => b.classList.remove('active'));
            matchingBtn.classList.add('active');
            currentGame = gameParam;
            applyFilters();
        }
    }

    // Intercept dropdown team links when on roster page
    document.querySelectorAll('.dropdown-menu a[href*="roster.html?game="], #drawerTeamSubmenu a[href*="roster.html?game="]').forEach(link => {
        link.addEventListener('click', (e) => {
            const url = new URL(link.href, window.location.href);
            const selectedGame = url.searchParams.get('game');
            if (selectedGame && document.getElementById('rosterContainer')) {
                e.preventDefault();
                const matchingBtn = document.querySelector(`.game-tabs .tab-btn[data-game="${selectedGame}"]`);
                if (matchingBtn) {
                    gameTabs.forEach(b => b.classList.remove('active'));
                    matchingBtn.classList.add('active');
                    currentGame = selectedGame;
                    applyFilters();
                    window.history.replaceState(null, '', `roster.html?game=${selectedGame}`);
                    if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
                }
            }
        });
    });

    // Touch support for mobile hover
    document.querySelectorAll('#rosterContainer .player-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const playerId = this.getAttribute('data-player-id');
                if (playerId) openPlayerModal(playerId);
            }
        });
    });
}

// Tự động khởi chạy filter tuyển thủ khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    initRosterFilters();
});
if (document.getElementById('rosterContainer')) {
    initRosterFilters();
}

// Đóng modal khi click ra ngoài backdrop hoặc ấn ESC
window.addEventListener('click', (e) => {
    const playerModal = document.getElementById('playerDetailModal');
    const summaryModal = document.getElementById('matchSummaryModal');
    const lineupModal = document.getElementById('matchLineupModal');

    if (playerModal && e.target === playerModal) closePlayerModal();
    if (summaryModal && e.target === summaryModal) closeMatchSummary();
    if (lineupModal && e.target === lineupModal) closeMatchLineup();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePlayerModal();
        closeMatchSummary();
        closeMatchLineup();
    }
});


// --- 6. BỘ LỌC SẢN PHẨM TRANG CỬA HÀNG ---
function initStoreFilter() {
    const storeContainer = document.getElementById('storeContainer');
    if (!storeContainer) return;
    const storeFilterBtns = document.querySelectorAll('.wiki-filter-bar .filter-btn');
    if (!storeFilterBtns.length) return;

    storeFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            storeFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterVal = btn.getAttribute('data-filter');

            const allCards = storeContainer.querySelectorAll('.store-product-card, .wiki-card');
            allCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (filterVal === 'all' || category === filterVal) ? '' : 'none';
            });
        });
    });
}
initStoreFilter();

// --- 7. TÍNH NĂNG THỬ NGHIỆM TRANG BỊ (ITEM BUILDER) ---
const itemSelectBtns = document.querySelectorAll('.item-select-btn');
const selectedItemsText = document.getElementById('selectedItemsText');
const totalADElem = document.getElementById('totalAD');
const totalCritElem = document.getElementById('totalCrit');
const totalGoldElem = document.getElementById('totalGold');
const resetItemsBtn = document.getElementById('resetItemsBtn');

let chosenItems = [];

if (itemSelectBtns.length > 0) {
    itemSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const ad = parseInt(btn.getAttribute('data-ad'));
            const crit = parseInt(btn.getAttribute('data-crit'));
            const gold = parseInt(btn.getAttribute('data-gold'));

            chosenItems.push({ name, ad, crit, gold });
            updateItemStats();
        });
    });

    if (resetItemsBtn) {
        resetItemsBtn.addEventListener('click', () => {
            chosenItems = [];
            updateItemStats();
        });
    }
}

function updateItemStats() {
    if (!selectedItemsText) return;
    const isEn = getCurrentLang() === 'EN';
    const goldUnit = isEn ? ' Gold' : ' Vàng';

    if (chosenItems.length === 0) {
        selectedItemsText.textContent = isEn ? 'None' : 'Chưa có';
        totalADElem.textContent = '0';
        totalCritElem.textContent = '0%';
        totalGoldElem.textContent = '0' + goldUnit;
        return;
    }

    let names = chosenItems.map(i => getTranslatedText(i.name)).join(', ');
    let sumAD = chosenItems.reduce((acc, i) => acc + i.ad, 0);
    let sumCrit = chosenItems.reduce((acc, i) => acc + i.crit, 0);
    let sumGold = chosenItems.reduce((acc, i) => acc + i.gold, 0);

    selectedItemsText.textContent = names;
    totalADElem.textContent = '+' + sumAD;
    totalCritElem.textContent = sumCrit + '%';
    totalGoldElem.textContent = sumGold.toLocaleString() + goldUnit;
}

// --- 8. MINI-GAME LUYỆN PHẢN XẠ (REFLEX TRAINER) ---
const startReflexGameBtn = document.getElementById('startReflexGame');
const reflexScoreElem = document.getElementById('reflexScore');
const reflexTimerElem = document.getElementById('reflexTimer');
const reflexArena = document.getElementById('reflexArena');

let reflexScore = 0;
let reflexTimeLeft = 15;
let reflexInterval = null;
let targetTimeout = null;

if (startReflexGameBtn) {
    startReflexGameBtn.addEventListener('click', () => {
        clearInterval(reflexInterval);
        clearTimeout(targetTimeout);
        reflexArena.innerHTML = '';
        reflexScore = 0;
        reflexTimeLeft = 15;
        reflexScoreElem.textContent = reflexScore;
        reflexTimerElem.textContent = reflexTimeLeft;
        startReflexGameBtn.disabled = true;

        reflexInterval = setInterval(() => {
            reflexTimeLeft--;
            reflexTimerElem.textContent = reflexTimeLeft;
            if (reflexTimeLeft <= 0) {
                clearInterval(reflexInterval);
                clearTimeout(targetTimeout);
                const endText = getCurrentLang() === 'EN'
                    ? `Time's up! Your reflex score: ${reflexScore} 🎯`
                    : `Hết giờ! Điểm phản xạ của bạn: ${reflexScore} 🎯`;
                reflexArena.innerHTML = `<span style="color: #f59e0b; font-size: 1.3rem; font-weight: bold;">${endText}</span>`;
                startReflexGameBtn.disabled = false;
            }
        }, 1000);

        spawnTarget();
    });
}

function spawnTarget() {
    if (reflexTimeLeft <= 0) return;

    reflexArena.innerHTML = '';
    const target = document.createElement('div');
    target.style.width = '45px';
    target.style.height = '45px';
    target.style.background = '#ef4444';
    target.style.borderRadius = '50%';
    target.style.position = 'absolute';
    target.style.cursor = 'pointer';
    target.style.boxShadow = '0 0 15px #ef4444';

    const maxX = Math.max(0, reflexArena.clientWidth - 60);
    const maxY = Math.max(0, reflexArena.clientHeight - 60);
    target.style.left = Math.floor(Math.random() * maxX) + 'px';
    target.style.top = Math.floor(Math.random() * maxY) + 'px';

    target.addEventListener('click', () => {
        reflexScore++;
        reflexScoreElem.textContent = reflexScore;
        clearTimeout(targetTimeout);
        spawnTarget();
    });

    reflexArena.appendChild(target);
    targetTimeout = setTimeout(spawnTarget, 1000);
}

// --- 9. XỬ LÝ FORM ĐĂNG KÝ NHẬN TIN Ở FOOTER & CHẶN LINK RỖNG ---
const footerNewsletter = document.getElementById('footerNewsletter');
if (footerNewsletter) {
    footerNewsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = footerNewsletter.querySelector('input[type="email"]');
        if (input && input.value.trim() !== '') {
            const email = input.value.trim();
            alert(getCurrentLang() === 'EN'
                ? `Thank you (${email}) for subscribing to Esports!`
                : `Cảm ơn bạn (${email}) đã đăng ký nhận tin từ Esports!`);
            input.value = '';
        }
    });
}

document.querySelectorAll('.footer-links a[href="#"], .social-icons a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert(getCurrentLang() === 'EN' ? 'This page is currently being updated!' : 'Nội dung này đang được cập nhật!');
    });
});

// --- 10. ĐIỀU KHIỂN MENU NGĂN KÉO MOBILE ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileOverlay = document.getElementById('mobileOverlay');
const drawerTeamBtn = document.getElementById('drawerTeamBtn');
const drawerTeamSubmenu = document.getElementById('drawerTeamSubmenu');

function openMobileDrawer() {
    if (mobileDrawer && mobileOverlay) {
        mobileDrawer.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileDrawer() {
    if (mobileDrawer && mobileOverlay) {
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileDrawer);

if (drawerTeamBtn && drawerTeamSubmenu) {
    drawerTeamBtn.addEventListener('click', () => {
        drawerTeamBtn.classList.toggle('active');
        drawerTeamSubmenu.classList.toggle('open');
    });
}

// --- 11. BẬT/TẮT Ô TÌM KIẾM TỪ ICON KÍNH LÚP ---
const headerSearchBox = document.getElementById('headerSearchBox');
const searchToggleBtn = document.getElementById('searchToggleBtn');
const globalSearchInput = document.getElementById('globalSearch');

if (searchToggleBtn && headerSearchBox && globalSearchInput) {
    searchToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        headerSearchBox.classList.toggle('active');
        if (headerSearchBox.classList.contains('active')) {
            setTimeout(() => globalSearchInput.focus(), 50);
        }
    });

    globalSearchInput.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', (e) => {
        if (!headerSearchBox.contains(e.target)) {
            headerSearchBox.classList.remove('active');
        }
    });

    // Tìm kiếm tức thì các sản phẩm khi đang ở trang store.html
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            const storeContainer = document.getElementById('storeContainer');
            if (!storeContainer) return;
            const query = e.target.value.trim().toLowerCase();
            const cards = storeContainer.querySelectorAll('.store-product-card, .wiki-card');
            cards.forEach(card => {
                const text = (card.textContent + ' ' + (card.getAttribute('data-name') || '')).toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
}

// --- 13. QUẢN LÝ GIỎ HÀNG ĐÃ THÊM ---
let esportsCart = JSON.parse(localStorage.getItem('esportsCart')) || [];

const cartBadge = document.getElementById('cartBadge');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');

// Các phần tử trong ngăn kéo giỏ hàng & đặt hàng
const cartTabBtnCart = document.getElementById('cartTabBtnCart');
const cartTabBtnCheckout = document.getElementById('cartTabBtnCheckout');
const cartTabBadgeCount = document.getElementById('cartTabBadgeCount');
const cartPaneItems = document.getElementById('cartPaneItems');
const cartPaneCheckout = document.getElementById('cartPaneCheckout');
const checkoutBackToCartBtn = document.getElementById('checkoutBackToCartBtn');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const orderCouponInput = document.getElementById('orderCouponInput');
const dismissSuccessBtn = document.getElementById('dismissSuccessBtn');
const orderSuccessModal = document.getElementById('orderSuccessModal');

let appliedCoupon = null;
let orderAutoCloseTimer = null;
let orderAutoCloseTimeout = null;

const AVAILABLE_COUPONS = {
    'ESPORTS': { type: 'percent', val: 10, label: 'Giảm 10% tổng tiền hàng' },
    'GAMING': { type: 'percent', val: 15, label: 'Giảm 15% tổng tiền hàng' },
    'FREESHIP': { type: 'freeship', val: 30000, label: 'Miễn phí vận chuyển (Tiết kiệm 30.000 đ)' },
    'PRO2026': { type: 'fixed', val: 50000, label: 'Giảm 50.000 đ trực tiếp' },
    'VIP': { type: 'percent', val: 20, label: 'Giảm 20% đặc quyền Esports' }
};

// Toast thông báo gaming không gây chặn màn hình
function showToast(msg, duration = 3000) {
    let toast = document.getElementById('esportsGlobalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'esportsGlobalToast';
        toast.className = 'esports-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function closeCartDrawer() {
    const successModal = document.getElementById('orderSuccessModal');
    if (successModal && successModal.classList.contains('open')) {
        closeOrderSuccess();
    }
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
}

if (cartToggleBtn && cartDrawer && cartOverlay) {
    cartToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    });
}

if (cartCloseBtn) cartCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeCartDrawer(); });
if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCartDrawer();
        document.getElementById('accountModal')?.classList.remove('open');
        document.getElementById('langMenu')?.classList.remove('open');
        if (typeof closeWikiModal === 'function') closeWikiModal();
    }
});

function getCurrentLang() {
    return localStorage.getItem('esportsLang') || 'VI';
}

function getTranslatedText(text) {
    const lang = getCurrentLang();
    if (lang === 'EN') return viToEnDict[text] || text;
    return enToViDict[text] || text;
}

function renderCart() {
    const lang = getCurrentLang();
    const totalQty = esportsCart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
        cartBadge.textContent = totalQty;
    }
    const tabBadge = document.getElementById('cartTabBadgeCount');
    if (tabBadge) {
        tabBadge.textContent = totalQty;
    }
    if (!cartItemsList || !cartTotalPrice) return;

    if (esportsCart.length === 0) {
        const emptyMsg = lang === 'EN' ? 'Your cart is currently empty.' : 'Chưa có sản phẩm nào trong giỏ hàng.';
        cartItemsList.innerHTML = `<p class="empty-cart-msg">${emptyMsg}</p>`;
        cartTotalPrice.textContent = '0 đ';

        // Nếu giỏ về 0 khi đang ở tab đặt hàng, tự chuyển lại tab giỏ
        const paneCheckout = document.getElementById('cartPaneCheckout');
        if (paneCheckout && paneCheckout.classList.contains('active')) {
            switchCartTab('cart');
        }
        return;
    }

    let totalMoney = 0;
    cartItemsList.innerHTML = esportsCart.map((item, idx) => {
        totalMoney += item.price * item.qty;
        const displayName = getTranslatedText(item.name);
        const removeTitle = lang === 'EN' ? 'Remove' : 'Xóa';
        return `
            <div class="cart-item-row">
                ${item.image ? `<img src="${item.image}" class="cart-item-thumb" alt="${displayName}">` : ''}
                <div class="cart-item-info">
                    <h5>${displayName}</h5>
                    ${item.variant ? `<div class="cart-item-variant-tag"><i class="fa-solid fa-tag"></i> ${item.variant}</div>` : ''}
                    <div class="cart-item-meta">
                        <span>${(item.price * item.qty).toLocaleString('vi-VN')} đ</span>
                        <div class="cart-qty-controls">
                            <button type="button" class="cart-qty-btn" onclick="updateCartQty(${idx}, -1)" aria-label="Giảm số lượng">−</button>
                            <span class="cart-qty-val">${item.qty}</span>
                            <button type="button" class="cart-qty-btn" onclick="updateCartQty(${idx}, 1)" aria-label="Tăng số lượng">+</button>
                        </div>
                    </div>
                </div>
                <button type="button" class="cart-remove-btn" onclick="removeCartItem(${idx})" title="${removeTitle}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    cartTotalPrice.textContent = totalMoney.toLocaleString('vi-VN') + ' đ';

    const paneCheckout = document.getElementById('cartPaneCheckout');
    if (paneCheckout && paneCheckout.classList.contains('active')) {
        updateCheckoutSummary();
    }
}

window.updateCartQty = function(index, delta) {
    if (!esportsCart[index]) return;
    esportsCart[index].qty += delta;
    if (esportsCart[index].qty <= 0) {
        esportsCart.splice(index, 1); // Nếu giảm về 0 thì tự động xóa khỏi giỏ
    }
    localStorage.setItem('esportsCart', JSON.stringify(esportsCart));
    renderCart();
};

window.addToCart = function(name, price, variant = '', image = '') {
    const baseName = enToViDict[name] || name;
    const existing = esportsCart.find(i => i.name === baseName && (i.variant || '') === (variant || ''));
    if (existing) {
        existing.qty += 1;
        if (image && !existing.image) existing.image = image;
    } else {
        esportsCart.push({ name: baseName, price, qty: 1, variant: variant || '', image: image || '' });
    }
    localStorage.setItem('esportsCart', JSON.stringify(esportsCart));
    renderCart();

    if (cartDrawer && cartOverlay) {
        switchCartTab('cart');
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    }
    const variantMsg = variant ? ` (${variant})` : '';
    if (typeof showEsportsToast === 'function') {
        showEsportsToast(`🛒 Đã thêm "${baseName}"${variantMsg} vào giỏ hàng!`, 'success');
    }
};

window.selectProductOption = function(btn, type, val) {
    const card = btn.closest('.store-product-card');
    if (!card) return;
    const group = btn.closest('.product-option-block');
    if (group) {
        group.querySelectorAll('.size-pill, .color-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const displayVal = group.querySelector('.option-selected-val');
        if (displayVal) {
            displayVal.textContent = val;
        }
    }
    card.setAttribute('data-selected-variant', `${type === 'size' ? 'Size' : 'Màu'}: ${val}`);
};

window.addStoreProductToCart = function(btn, price) {
    const card = btn.closest('.store-product-card');
    if (!card) return;
    const title = card.querySelector('.store-product-title')?.textContent?.trim() || 'Sản phẩm';
    const activeOption = card.querySelector('.size-pill.active, .color-pill.active');
    let variant = card.getAttribute('data-selected-variant');
    if (!variant && activeOption) {
        const val = activeOption.getAttribute('data-val') || activeOption.textContent.trim();
        const isSize = activeOption.classList.contains('size-pill');
        variant = `${isSize ? 'Size' : 'Màu'}: ${val}`;
    }
    const img = card.querySelector('.store-product-media img')?.getAttribute('src') || '';
    window.addToCart(title, price, variant, img);
};

window.removeCartItem = function(index) {
    esportsCart.splice(index, 1);
    localStorage.setItem('esportsCart', JSON.stringify(esportsCart));
    renderCart();
};

// --- CHUYỂN TAB GIỎ HÀNG & THÔNG TIN ĐẶT HÀNG ---
window.switchCartTab = function(tabName) {
    const tabBtnCart = document.getElementById('cartTabBtnCart');
    const tabBtnCheckout = document.getElementById('cartTabBtnCheckout');
    const paneItems = document.getElementById('cartPaneItems');
    const paneCheckout = document.getElementById('cartPaneCheckout');
    const lang = getCurrentLang();

    if (tabName === 'checkout') {
        if (esportsCart.length === 0) {
            showToast(lang === 'EN' ? 'Your cart is empty! Please add products first.' : 'Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước.');
            return;
        }
        tabBtnCart?.classList.remove('active');
        tabBtnCheckout?.classList.add('active');
        paneItems?.classList.remove('active');
        paneCheckout?.classList.add('active');

        loadSavedOrderInfo();
        updateCheckoutSummary();
    } else {
        tabBtnCart?.classList.add('active');
        tabBtnCheckout?.classList.remove('active');
        paneItems?.classList.add('active');
        paneCheckout?.classList.remove('active');
    }
};

function loadSavedOrderInfo() {
    const saved = JSON.parse(localStorage.getItem('esportsOrderInfo') || '{}');
    const recipientInput = document.getElementById('orderRecipientName');
    const phoneInput = document.getElementById('orderPhone');
    const addressInput = document.getElementById('orderAddress');
    const currentUser = localStorage.getItem('esportsUser');

    if (recipientInput && !recipientInput.value) {
        recipientInput.value = saved.recipientName || currentUser || '';
    }
    if (phoneInput && !phoneInput.value && saved.phone) {
        phoneInput.value = saved.phone;
    }
    if (addressInput && !addressInput.value && saved.address) {
        addressInput.value = saved.address;
    }
}

function updateCheckoutSummary() {
    const summaryQty = document.getElementById('checkoutSummaryQty');
    const summarySubtotal = document.getElementById('checkoutSummarySubtotal');
    const summaryShipping = document.getElementById('checkoutSummaryShipping');
    const discountRow = document.getElementById('checkoutDiscountRow');
    const couponTag = document.getElementById('checkoutCouponTag');
    const discountAmount = document.getElementById('checkoutDiscountAmount');
    const grandTotal = document.getElementById('checkoutGrandTotal');
    const deliveryDateText = document.getElementById('orderDeliveryDateText');

    const totalQty = esportsCart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = esportsCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Ước tính ngày giao hàng linh hoạt (+2 đến +4 ngày từ thời điểm hiện tại)
    if (deliveryDateText) {
        const now = new Date();
        const startDay = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        const endDay = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
        const pad = (n) => n < 10 ? '0' + n : n;
        const startStr = `${pad(startDay.getDate())}/${pad(startDay.getMonth() + 1)}`;
        const endStr = `${pad(endDay.getDate())}/${pad(endDay.getMonth() + 1)}`;
        deliveryDateText.textContent = `Dự kiến giao: ${startStr} - ${endStr}`;
    }

    if (summaryQty) summaryQty.textContent = totalQty;
    if (summarySubtotal) summarySubtotal.textContent = subtotal.toLocaleString('vi-VN') + ' đ';

    // Phí vận chuyển: Miễn phí nếu đơn >= 500k hoặc áp mã FREESHIP
    let shippingFee = (subtotal >= 500000 || (appliedCoupon && appliedCoupon.code === 'FREESHIP')) ? 0 : 30000;
    if (summaryShipping) {
        summaryShipping.textContent = shippingFee === 0 ? 'Miễn phí' : shippingFee.toLocaleString('vi-VN') + ' đ';
        summaryShipping.className = shippingFee === 0 ? 'free-ship' : '';
    }

    // Tính mã giảm giá
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.round((subtotal * appliedCoupon.val) / 100);
        } else if (appliedCoupon.type === 'fixed') {
            discount = appliedCoupon.val;
        } else if (appliedCoupon.type === 'freeship') {
            discount = 30000;
        }
        if (discount > subtotal) discount = subtotal;

        if (discountRow) discountRow.style.display = 'flex';
        if (couponTag) couponTag.textContent = appliedCoupon.code;
        if (discountAmount) discountAmount.textContent = '-' + discount.toLocaleString('vi-VN') + ' đ';
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }

    const finalTotal = Math.max(0, subtotal + shippingFee - (appliedCoupon && appliedCoupon.code === 'FREESHIP' ? 0 : discount));
    if (grandTotal) grandTotal.textContent = finalTotal.toLocaleString('vi-VN') + ' đ';

    return { subtotal, shippingFee, discount, finalTotal };
}

window.fillCoupon = function(code) {
    const input = document.getElementById('orderCouponInput');
    if (input) {
        input.value = code;
        applyCoupon();
    }
};

function applyCoupon() {
    const input = document.getElementById('orderCouponInput');
    const msg = document.getElementById('couponStatusMsg');
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        msg.textContent = 'Vui lòng nhập mã giảm giá!';
        msg.className = 'coupon-status-msg error';
        return;
    }

    if (AVAILABLE_COUPONS[code]) {
        appliedCoupon = { code, ...AVAILABLE_COUPONS[code] };
        msg.textContent = `✓ Áp dụng mã ${code} thành công: ${AVAILABLE_COUPONS[code].label}!`;
        msg.className = 'coupon-status-msg success';
        updateCheckoutSummary();
    } else {
        appliedCoupon = null;
        msg.textContent = '✗ Mã giảm giá không hợp lệ hoặc đã hết hạn!';
        msg.className = 'coupon-status-msg error';
        updateCheckoutSummary();
    }
}

function handleConfirmOrder() {
    const recipientInput = document.getElementById('orderRecipientName');
    const phoneInput = document.getElementById('orderPhone');
    const addressInput = document.getElementById('orderAddress');
    const errorBanner = document.getElementById('checkoutFormError');

    // Reset lỗi
    [recipientInput, phoneInput, addressInput].forEach(el => el?.classList.remove('input-error'));
    if (errorBanner) {
        errorBanner.style.display = 'none';
        errorBanner.textContent = '';
    }

    if (esportsCart.length === 0) {
        switchCartTab('cart');
        return;
    }

    const recipientName = recipientInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const address = addressInput?.value.trim() || '';

    if (!recipientName) {
        recipientInput?.classList.add('input-error');
        recipientInput?.focus();
        showCheckoutError('Vui lòng nhập họ tên người nhận hàng!');
        return;
    }

    const phoneClean = phone.replace(/[\s\-\.]/g, '');
    if (!phoneClean || !/^(0|\+84)[0-9]{8,10}$/.test(phoneClean)) {
        phoneInput?.classList.add('input-error');
        phoneInput?.focus();
        showCheckoutError('Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0 hoặc +84)!');
        return;
    }

    if (!address || address.length < 5) {
        addressInput?.classList.add('input-error');
        addressInput?.focus();
        showCheckoutError('Vui lòng nhập địa chỉ nhận hàng chi tiết (số nhà, tên đường, quận/huyện, tỉnh/thành)!');
        return;
    }

    // Lưu thông tin người nhận
    localStorage.setItem('esportsOrderInfo', JSON.stringify({ recipientName, phone, address }));

    // Tính toán tổng tiền
    const { finalTotal } = updateCheckoutSummary();

    // Mã đơn hàng ngẫu nhiên chuyên nghiệp
    const orderCode = '#ESP-' + Math.floor(100000 + Math.random() * 900000);

    // Phương thức thanh toán
    const selectedPM = document.querySelector('input[name="orderPaymentMethod"]:checked')?.value || 'COD';
    let pmText = 'COD (Tiền mặt)';
    if (selectedPM === 'WALLET') pmText = 'Ví Tiền Esports (Đã trừ số dư)';
    if (selectedPM === 'BANK') pmText = 'VietQR / Banking';
    if (selectedPM === 'EWALLET') pmText = 'Ví MoMo / ZaloPay';

    // Xử lý thanh toán qua Ví Tiền Esports
    if (selectedPM === 'WALLET') {
        const account = typeof getCurrentUserAccount === 'function' ? getCurrentUserAccount() : null;
        if (!account) {
            showCheckoutError('Vui lòng đăng nhập tài khoản Esports để thanh toán bằng Ví Tiền!');
            return;
        }
        if ((account.balance || 0) < finalTotal) {
            showCheckoutError(`Số dư Ví Esports không đủ (${(account.balance || 0).toLocaleString('vi-VN')} đ / cần ${finalTotal.toLocaleString('vi-VN')} đ). Vui lòng nạp thêm tiền tại Cổng Tài Khoản hoặc chọn COD!`);
            return;
        }
        account.balance = (account.balance || 0) - finalTotal;
        saveCurrentUserAccount(account);

        if (typeof addWalletTransaction === 'function') {
            addWalletTransaction({
                id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
                type: 'SHOP',
                typeName: 'Mua hàng tại Esports Store: ' + orderCode,
                amount: -finalTotal,
                time: new Date().toLocaleString('vi-VN'),
                status: 'Thành công'
            });
        }
    }

    // Ghi nhận đơn hàng vào lịch sử đơn hàng để xem trong Cổng Tài Khoản
    try {
        const savedOrders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
        savedOrders.unshift({
            id: orderCode,
            orderCode: orderCode,
            date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
            recipientName: recipientName,
            customerName: recipientName,
            phone: phone,
            customerPhone: phone,
            address: address,
            customerAddress: address,
            paymentMethod: pmText,
            total: finalTotal,
            totalPrice: finalTotal,
            items: [...esportsCart],
            status: selectedPM === 'WALLET' ? 'Đã thanh toán (Ví Esports)' : 'Chờ xác nhận'
        });
        localStorage.setItem('esportsOrders', JSON.stringify(savedOrders));
    } catch (e) {
        console.error('Error saving orders', e);
    }

    // Thời gian giao hàng ước tính
    const deliveryText = document.getElementById('orderDeliveryDateText')?.textContent?.replace('Dự kiến giao: ', '') || '2 - 3 ngày làm việc';

    // Đưa thông tin vào phiếu đặt hàng thành công
    const codeElem = document.getElementById('successOrderCode');
    const nameElem = document.getElementById('successCustomerName');
    const phoneElem = document.getElementById('successCustomerPhone');
    const addrElem = document.getElementById('successCustomerAddress');
    const payElem = document.getElementById('successCustomerPayment');
    const totalElem = document.getElementById('successCustomerTotal');
    const deliverElem = document.getElementById('successDeliveryEstimate');

    if (codeElem) codeElem.textContent = orderCode;
    if (nameElem) nameElem.textContent = recipientName;
    if (phoneElem) phoneElem.textContent = phone;
    if (addrElem) {
        addrElem.textContent = address;
        addrElem.title = address;
    }
    if (payElem) payElem.textContent = pmText;
    if (totalElem) totalElem.textContent = finalTotal.toLocaleString('vi-VN') + ' đ';
    if (deliverElem) deliverElem.textContent = deliveryText;

    // Hiển thị popup thành công (thay thế cho alert mặc định)
    const successModal = document.getElementById('orderSuccessModal');
    if (successModal) {
        successModal.classList.add('open');
    }

    // Đếm ngược 3 giây rồi tự động tắt
    let secondsLeft = 3;
    const counterElem = document.getElementById('autoCloseCounter');
    const progressBar = document.getElementById('autoCloseProgressBar');
    if (counterElem) counterElem.textContent = secondsLeft;
    if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.transition = 'width 3.5s linear';
            progressBar.style.width = '0%';
        }, 50);
    }

    if (orderAutoCloseTimer) clearInterval(orderAutoCloseTimer);
    orderAutoCloseTimer = setInterval(() => {
        secondsLeft -= 1;
        if (counterElem && secondsLeft >= 0) {
            counterElem.textContent = secondsLeft;
        }
    }, 1000);

    if (orderAutoCloseTimeout) clearTimeout(orderAutoCloseTimeout);
    orderAutoCloseTimeout = setTimeout(() => {
        closeOrderSuccess();
    }, 3600);
}

function showCheckoutError(msg) {
    const errorBanner = document.getElementById('checkoutFormError');
    if (errorBanner) {
        errorBanner.textContent = msg;
        errorBanner.style.display = 'block';
    }
}

function closeOrderSuccess() {
    if (orderAutoCloseTimer) {
        clearInterval(orderAutoCloseTimer);
        orderAutoCloseTimer = null;
    }
    if (orderAutoCloseTimeout) {
        clearTimeout(orderAutoCloseTimeout);
        orderAutoCloseTimeout = null;
    }

    const successModal = document.getElementById('orderSuccessModal');
    if (successModal) successModal.classList.remove('open');

    // Xóa giỏ hàng và lưu rỗng
    esportsCart = [];
    localStorage.removeItem('esportsCart');
    renderCart();

    // Reset form đặt hàng và mã giảm giá
    appliedCoupon = null;
    const orderForm = document.getElementById('orderForm');
    if (orderForm) orderForm.reset();
    const couponInput = document.getElementById('orderCouponInput');
    if (couponInput) couponInput.value = '';
    const couponMsg = document.getElementById('couponStatusMsg');
    if (couponMsg) {
        couponMsg.textContent = '';
        couponMsg.className = 'coupon-status-msg';
    }
    const formError = document.getElementById('checkoutFormError');
    if (formError) formError.style.display = 'none';

    // Chuyển lại tab Giỏ hàng và đóng Drawer
    switchCartTab('cart');
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
}

// Gắn sự kiện các nút
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        switchCartTab('checkout');
    });
}

document.getElementById('cartTabBtnCart')?.addEventListener('click', () => switchCartTab('cart'));
document.getElementById('cartTabBtnCheckout')?.addEventListener('click', () => switchCartTab('checkout'));
document.getElementById('checkoutBackToCartBtn')?.addEventListener('click', () => switchCartTab('cart'));
document.getElementById('confirmOrderBtn')?.addEventListener('click', handleConfirmOrder);
document.getElementById('applyCouponBtn')?.addEventListener('click', applyCoupon);
document.getElementById('dismissSuccessBtn')?.addEventListener('click', closeOrderSuccess);

document.getElementById('orderCouponInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        applyCoupon();
    }
});

document.querySelectorAll('.coupon-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        if (code) fillCoupon(code);
    });
});

document.querySelectorAll('input[name="orderPaymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.querySelectorAll('.payment-method-card').forEach(card => card.classList.remove('selected'));
        radio.closest('.payment-method-card')?.classList.add('selected');
    });
});

// --- 14. CHỌN NGÔN NGỮ & DỊCH TOÀN TRANG 2 CHIỀU CHUẨN ---
const langToggleBtn = document.getElementById('langToggleBtn');
const langMenu = document.getElementById('langMenu');
const langOptions = document.querySelectorAll('.lang-option');

// Bổ sung sự kiện mở/đóng menu ngôn ngữ (đã bị thiếu ở bản cũ)
if (langToggleBtn && langMenu) {
    langToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target) && !langToggleBtn.contains(e.target)) {
            langMenu.classList.remove('open');
        }
    });
}

const viToEnDict = {
    "Trang Chủ": "Home",
    "Tin Tức": "News",
    "Đội Tuyển": "Teams",
    "Việt Nam": "Vietnam",
    "Quốc Tế": "International",
    "Cửa hàng": "Store",
    "Cửa Hàng": "Store",
    "Wiki & Thông Số": "Wiki & Stats",
    "Giải Đấu": "Tournaments",
    "Phòng Tập Luyện": "Training Room",
    "Tải Game": "Download",
    "Giỏ Hàng Của Bạn": "Your Cart",
    "Giỏ Hàng": "Cart",
    "Đặt Hàng": "Checkout",
    "Quay lại giỏ hàng": "Back to cart",
    "Họ tên người nhận": "Recipient Name",
    "Số điện thoại nhận hàng": "Phone Number",
    "Địa chỉ nhận hàng": "Delivery Address",
    "Ước tính thời gian nhận hàng": "Estimated Delivery Time",
    "Phương thức thanh toán": "Payment Method",
    "Mã giảm giá": "Discount Code",
    "Áp dụng": "Apply",
    "Gợi ý:": "Suggestions:",
    "Tạm tính": "Subtotal",
    "Phí vận chuyển:": "Shipping:",
    "Miễn phí": "Free",
    "Tổng thanh toán:": "Total Payment:",
    "Xác Nhận Đặt Hàng": "Confirm Order",
    "Đặt Hàng Thành Công!": "Order Placed Successfully!",
    "Cảm ơn bạn đã tin tưởng và ủng hộ Esports Store.": "Thank you for supporting Esports Store.",
    "Mã đơn hàng:": "Order ID:",
    "Người nhận:": "Recipient:",
    "Số điện thoại:": "Phone:",
    "Địa chỉ:": "Address:",
    "Thanh toán:": "Payment:",
    "Tổng tiền:": "Total:",
    "Dự kiến giao:": "Est. Delivery:",
    "Đóng ngay": "Close now",
    "Tiền mặt khi nhận hàng (COD)": "Cash on Delivery (COD)",
    "Chuyển khoản VietQR / Banking": "VietQR / Bank Transfer",
    "Ví MoMo / ZaloPay": "MoMo / ZaloPay E-Wallet",
    "Kiểm tra hàng trước khi thanh toán": "Check items before payment",
    "Quét mã QR tự động 24/7": "Scan QR 24/7 instant confirmation",
    "Thanh toán tức thì bảo mật": "Instant secure digital payment",
    "Đơn vị vận chuyển: Esports Express (Giao hàng tận nơi)": "Carrier: Esports Express (Home Delivery)",
    "2 - 3 ngày làm việc": "2 - 3 business days",
    "Chưa có sản phẩm nào trong giỏ hàng.": "Your cart is currently empty.",
    "Tổng cộng:": "Total:",
    "Thanh Toán Ngay": "Checkout Now",
    "Đăng Nhập Esports ID": "Sign In to Esports ID",
    "Đăng Ký Esports ID": "Register Esports ID",
    "Đồng bộ giỏ hàng, lịch thi đấu và thành tích luyện tập": "Sync your cart, match schedules, and training stats",
    "Đăng Nhập": "Sign In",
    "Tạo Tài Khoản": "Create Account",
    "Chưa có tài khoản?": "Don't have an account?",
    "Đăng ký ngay": "Sign up now",
    "Đăng nhập ngay": "Sign in now",
    "CHÀO MỪNG ĐẾN VỚI ESPORTS": "WELCOME TO ESPORTS",
    "CỔNG THÔNG TIN THỂ THAO ĐIỆN TỬ HÀNG ĐẦU": "PREMIER ESPORTS INFORMATION PORTAL",
    "Nơi cập nhật toàn diện tin tức, lịch thi đấu, hồ sơ tuyển thủ và thông số trang bị chuẩn xác cho cộng đồng game thủ.": "Your comprehensive hub for esports news, match schedules, pro player profiles, and accurate gear stats.",
    "Xem Tin Tức": "Read News",
    "Tra Cứu Wiki": "Explore Wiki",
    "Xem Trực Tiếp Giải Đấu": "Watch Live Tournaments",
    "Lịch Thi Đấu Tâm Điểm": "Featured Match Schedule",
    "Các trận đấu hấp dẫn diễn ra trong tuần": "Exciting matches taking place this week",
    "17:00 - Hôm nay": "17:00 - Today",
    "19:30 - Hôm nay": "19:30 - Today",
    "Đang diễn ra": "LIVE",
    "Sắp diễn ra": "Upcoming",
    "Bản Tin Esports Mới Nhất": "Latest Esports News",
    "Tổng hợp mọi diễn biến nóng hổi từ các giải đấu chuyên nghiệp": "All the hottest updates from professional tournaments",
    "Chung kết thế giới LOL: Đội tuyển hạt giống số 1 chốt đội hình": "LoL Worlds: Top-Seeded Team Finalizes Starting Roster",
    "Những thay đổi về meta và chiến thuật cấm chọn hứa hẹn loạt trận bùng nổ...": "Meta shifts and draft strategies promise an explosive series of matches...",
    "Bản cập nhật đặc vụ mới Valorant: Sức mạnh đảo lộn bảng đấu": "New Valorant Agent Patch: Game-Changing Abilities Shake Up the Bracket",
    "Nhà phát triển chính thức hé lộ kỹ năng của đặc vụ khởi tranh mùa giải mới...": "Developers officially reveal the abilities of the newest season-opening agent...",
    "Đọc thêm": "Read more",
    "Đội Hình & Ngôi Sao Tuyển Thủ": "Rosters & Pro Players",
    "Hồ sơ chi tiết các vận động viên chuyên nghiệp hàng đầu": "Detailed profiles of top professional esports athletes",
    "Tất Cả": "All",
    "Đường Giữa huyền thoại với 5 chức vô địch CKTG thế giới.": "Legendary Mid Laner with 5 World Championship titles.",
    "Tuyển thủ đi rừng hàng đầu với bể tướng rộng và những pha xử lý đột biến.": "Top-tier Jungler known for a deep champion pool and clutch plays.",
    "Chuyên gia căn góc súng và giao tranh tầm trung xuất sắc.": "Master of crosshair placement and mid-range gunfights.",
    "Bậc thầy dùng súng trường với độ chính xác tuyệt đối.": "Rifle specialist with pinpoint mechanical accuracy.",
    "Cửa Hàng Đồ Lưu Niệm & Gear": "Merchandise & Gaming Gear Store",
    "Sở hữu ngay trang phục thi đấu chính hãng và balo gaming đẳng cấp": "Get official team jerseys and premium gaming backpacks",
    "Tất Cả Sản Phẩm": "All Products",
    "Áo Đấu Chính Thức": "Official Jerseys",
    "Balo Gaming": "Gaming Backpacks",
    "Phụ Kiện & Khác": "Accessories & More",
    "Áo Đấu Pro Jersey 2026": "Pro Jersey 2026",
    "Chất liệu:": "Material:",
    "Thun mè cao cấp thoát mồ hôi": "Premium breathable athletic mesh",
    "Kích cỡ (Size):": "Sizes:",
    "Giá bán:": "Price:",
    "Balo Gaming Thể Thao Chống Nước": "Waterproof Pro Gaming Backpack",
    "Ngăn chứa:": "Capacity:",
    "Đựng vừa laptop 17.3 inch": "Fits up to 17.3-inch laptops",
    "Vải Oxford trượt nước cao cấp": "High-density water-repellent Oxford fabric",
    "Lót Chuột Gaming Khổ Lớn LED RGB": "Extended RGB Gaming Mousepad",
    "Kích thước:": "Dimensions:",
    "Hiệu ứng:": "Lighting:",
    "14 chế độ sáng RGB viền": "14 edge RGB lighting modes",
    "Thêm Vào Giỏ": "Add to Cart",
    "Thư Viện Wiki & Thông Số": "Wiki & Stats Library",
    "Tra cứu nhanh chỉ số trang bị MOBA và vũ khí FPS chính xác": "Quick lookup for accurate MOBA item stats and FPS weapons",
    "Tra cứu hồ sơ tướng, nhân vật, bảng chỉ số trang bị và vũ khí chuẩn xác nhất": "Lookup champions, characters, gear stats, and weapons with ultimate accuracy",
    "Tất Cả Tựa Game": "All Games",
    "Tất Cả Mục": "All Items",
    "Tướng & Nhân Vật": "Champions & Characters",
    "Trang Bị & Vũ Khí": "Equipment & Weapons",
    "Tướng": "Champion",
    "Nhân Vật": "Character",
    "Trang Bị": "Item",
    "Vũ Khí": "Weapon",
    "Đang hiển thị:": "Displaying:",
    "mục": "items",
    "Trang Bị MOBA": "MOBA Items",
    "Vũ Khí FPS": "FPS Weapons",
    "Vô Cực Kiếm": "Infinity Edge",
    "Sức mạnh công kích:": "Attack Damage:",
    "Tỷ lệ chí mạng:": "Critical Strike Chance:",
    "Giá tiền:": "Cost:",
    "3400 Vàng": "3400 Gold",
    "Sát thương đầu:": "Headshot Damage:",
    "160 (1 viên chết)": "160 (One-tap kill)",
    "Tốc độ bắn:": "Fire Rate:",
    "9.75 v/s": "9.75 rds/sec",
    "Phòng Thí Nghiệm & Luyện Kỹ Năng": "Sandbox & Skill Training Lab",
    "Trải nghiệm tính toán trang bị MOBA và luyện tập phản xạ game thủ chuyên nghiệp": "Experiment with MOBA item builds and train pro-level reflexes",
    "1. Giả Lập Lên Đồ & Tính Chỉ Số (MOBA Sandbox)": "1. Item Build & Stat Simulator (MOBA Sandbox)",
    "Click chọn các trang bị bên dưới để kiểm tra tổng chỉ số nhận được:": "Click items below to calculate total bonus stats:",
    "Kho Trang Bị Có Sẵn": "Available Item Pool",
    "⚔️ Vô Cực Kiếm (+80 AD, +25% Chí Mạng) - 3400 Vàng": "⚔️ Infinity Edge (+80 AD, +25% Crit) - 3400 Gold",
    "🗡️ Thánh Kiếm (+110 AD, +25% Chí Mạng) - 2120 Vàng": "🗡️ Claves Sancti (+110 AD, +25% Crit) - 2120 Gold",
    "⚡ Kiếm Điện (+40 AD, +20% Chí Mạng) - 2600 Vàng": "⚡ Statikk Shiv (+40 AD, +20% Crit) - 2600 Gold",
    "Bảng Thống Kê Chỉ Số Tướng": "Champion Stats Summary",
    "Trang bị đã chọn:": "Selected Items:",
    "Chưa có": "None",
    "Tổng Sức Mạnh Công Kích (AD):": "Total Attack Damage (AD):",
    "Tổng Tỷ Lệ Chí Mạng:": "Total Critical Chance:",
    "Tổng Số Vàng Cần:": "Total Gold Required:",
    "0 Vàng": "0 Gold",
    "Làm Mới Build Đồ": "Reset Build",
    "2. Trò Chơi Luyện Phản Xạ Game Thủ (Reflex Trainer)": "2. Pro Reflex & Aim Trainer",
    "Bắt Đầu Luyện Tập": "Start Training",
    "Điểm Số:": "Score:",
    "| Thời Gian:": "| Time:",
    "Nhấn \"Bắt Đầu Luyện Tập\" để thử thách phản xạ": "Click \"Start Training\" to test your reflexes",
    "Hướng Dẫn Tải Game Chính Thức": "Official Game Downloads",
    "Cổng Tải Game Esports Chính Thức": "Official Esports Game Downloads",
    "Tổng hợp đường dẫn cài đặt an toàn, tốc độ cao trực tiếp từ các nhà phát hành hàng đầu": "Safe, high-speed official installation links directly from leading publishers",
    "Đường dẫn tải an toàn và chính thống từ nhà phát hành": "Safe and official download links directly from publishers",
    "Tất Cả (7 Games)": "All (7 Games)",
    "Game PC (4)": "PC Games (4)",
    "Game Mobile (3)": "Mobile Games (3)",
    "Nền tảng: PC Windows / macOS": "Platform: PC Windows / macOS",
    "Nền tảng: PC Windows": "Platform: PC Windows",
    "Nền tảng: Android / iOS": "Platform: Android / iOS",
    "Tải Game Trực Tiếp": "Download Game Directly",
    "Tải App Store / CH Play": "Download on App Store / Google Play",
    "Tải Free Fire (CH Play)": "Download Free Fire (Google Play)",
    "Tải FC Online (Garena)": "Download FC Online (Garena)",
    "Tải CS2 Miễn Phí (Steam)": "Download CS2 Free (Steam)",
    "Tải PUBG Mobile (VNG)": "Download PUBG Mobile (VNG)",
    "Tải LMHT Trực Tiếp (Riot)": "Download LoL Directly (Riot)",
    "Tải Liên Quân (Garena)": "Download Arena of Valor (Garena)",
    "Tải Valorant Trực Tiếp (Riot)": "Download Valorant Directly (Riot)",
    "Xem Đội Tuyển Free Fire": "View Free Fire Roster",
    "Xem Đội Tuyển FC Online": "View FC Online Roster",
    "Xem Đội Tuyển CS2": "View CS2 Roster",
    "Xem Đội Tuyển PUBG Mobile": "View PUBG Mobile Roster",
    "Xem Đội Tuyển LMHT (LCK)": "View LoL Roster (LCK)",
    "Xem Đội Tuyển Liên Quân": "View Arena of Valor Roster",
    "Xem Đội Tuyển Valorant": "View Valorant Roster",
    "Đường Dẫn Chính Thức 100% An Toàn & Bảo Mật": "Official Links 100% Safe & Secure",
    "Chọn Tựa Game & Nền Tảng": "Select Game & Platform",
    "Tải Bản Cài Đặt Trực Tiếp": "Download Direct Installer",
    "Cài Đặt & Chinh Phục Esports": "Install & Compete in Esports",
    "CÔNG TY TNHH ESPORTS VIỆT NAM": "ESPORTS VIETNAM CO., LTD",
    "Việt Nam:": "Vietnam:",
    "Học Viện Công Nghệ Bưu chính viễn thông": "Posts and Telecommunications Institute of Technology (PTIT)",
    "Số điện thoại:": "Phone:",
    "Về Chúng Tôi": "About Us",
    "Giới thiệu": "Introduction",
    "Đội ngũ tuyển thủ": "Pro Roster",
    "Tin tức sự kiện": "News & Events",
    "Hợp tác tài trợ": "Sponsorships",
    "Hỗ Trợ Khách Hàng": "Customer Support",
    "Hướng dẫn chọn size": "Size Guide",
    "Chính sách đổi trả": "Return Policy",
    "Chính sách bảo mật": "Privacy Policy",
    "Hướng dẫn mua hàng": "Shopping Guide",
    "Chính sách kiểm hàng": "Inspection Policy",
    "Hướng dẫn thanh toán": "Payment Guide",
    "Chính sách vận chuyển": "Shipping Policy",
    "Đăng Ký Nhận Tin": "Newsletter",
    "Bạn có muốn nhận khuyến mãi đặc biệt và tin tức giải đấu? Đăng ký ngay.": "Want exclusive promotions and tournament updates? Subscribe now.",
    "Đăng ký": "Subscribe",
    "© Bản quyền thuộc về Esports | MST 0317627061 | Thiết kế chuyên nghiệp": "© Copyright by Esports | Tax ID 0317627061 | Professional Design"
};

const enToViDict = Object.fromEntries(
    Object.entries(viToEnDict).map(([vi, en]) => [en, vi])
);

const placeholderViToEn = {
    "Tìm kiếm...": "Search...",
    "Tìm kiếm tên tướng, nhân vật, trang bị, vũ khí, chỉ số...": "Search champion, character, item, weapon, stats...",
    "Nhập địa chỉ email...": "Enter your email...",
    "Lọc tên trang bị / súng...": "Filter item / weapon name...",
    "Tên đăng nhập hoặc Email": "Username or Email",
    "Mật khẩu": "Password",
    "Ví dụ: Nguyễn Văn A": "e.g. John Doe",
    "Ví dụ: 0912 345 678": "e.g. 0912 345 678",
    "Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành...": "Street number, address, district, city...",
    "Nhập mã ưu đãi...": "Enter promo code..."
};

const placeholderEnToVi = Object.fromEntries(
    Object.entries(placeholderViToEn).map(([vi, en]) => [en, vi])
);

function applyPageLanguage(lang) {
    const dict = lang === 'EN' ? viToEnDict : enToViDict;
    const phDict = lang === 'EN' ? placeholderViToEn : placeholderEnToVi;
    document.documentElement.lang = lang.toLowerCase();

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        const rawText = node.nodeValue;
        const trimmed = rawText.trim();
        if (trimmed && dict[trimmed]) {
            node.nodeValue = rawText.replace(trimmed, dict[trimmed]);
        }
    }

    document.querySelectorAll('input[placeholder]').forEach(input => {
        const currentPh = input.getAttribute('placeholder');
        if (phDict[currentPh]) {
            input.setAttribute('placeholder', phDict[currentPh]);
        }
    });

    renderCart();
    updateItemStats();

    langOptions.forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
}

langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        const chosenLang = opt.getAttribute('data-lang');
        localStorage.setItem('esportsLang', chosenLang);
        applyPageLanguage(chosenLang);
        langMenu?.classList.remove('open');
    });
});

const savedLang = localStorage.getItem('esportsLang') || 'VI';
if (savedLang === 'EN') {
    applyPageLanguage('EN');
} else {
    renderCart();
}
// ==========================================================================
// 15. RIOT GAMES ACCOUNT PORTAL, WALLET TOP-UP & CHARITY DONATIONS SYSTEM
// ==========================================================================

// --- TOAST NOTIFICATIONS (THAY THẾ TOÀN BỘ ALERT MẶC ĐỊNH) ---
function showEsportsToast(message, type = 'success') {
    let container = document.getElementById('esportsToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'esportsToastContainer';
        container.style.position = 'fixed';
        container.style.bottom = '25px';
        container.style.right = '25px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');
    const color = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#00f0ff');
    const borderColor = type === 'success' ? 'rgba(16, 185, 129, 0.4)' : (type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 240, 255, 0.4)');

    toast.style.background = '#0d1322';
    toast.style.border = `1px solid ${borderColor}`;
    toast.style.borderLeft = `4px solid ${color}`;
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 240, 255, 0.2)';
    toast.style.borderRadius = '10px';
    toast.style.padding = '12px 18px';
    toast.style.color = '#f8fafc';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.minWidth = '280px';
    toast.style.maxWidth = '420px';
    toast.style.animation = 'fadeInDropdown 0.25s ease';

    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.25rem;"></i>
        <div style="flex: 1; line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// --- QUẢN LÝ DỮ LIỆU TÀI KHOẢN VÀ SỐ DƯ VÍ ---
var MASTER_DEFAULT_ADMIN_PASS = window.MASTER_DEFAULT_ADMIN_PASS || 'Admin@Esports2026!';

function getSavedAccounts() {
    let list = JSON.parse(localStorage.getItem('esportsAccounts')) || [];
    // Luôn đảm bảo có sẵn tài khoản Quản trị viên 'admin'
    let adminAcc = list.find(acc => acc.username && acc.username.toLowerCase() === 'admin');
    let defaultAdminPass = localStorage.getItem('esportsAdminPass');
    if (!defaultAdminPass) {
        defaultAdminPass = MASTER_DEFAULT_ADMIN_PASS;
        localStorage.setItem('esportsAdminPass', defaultAdminPass);
    }
    if (!adminAcc) {
        adminAcc = {
            id: 999999,
            username: 'admin',
            gameName: 'AdminRoot',
            tagline: 'ADMIN',
            riotId: 'AdminRoot#ADMIN',
            email: 'admin@esports.gg',
            password: defaultAdminPass,
            avatar: 'images/avatar_cyber.svg',
            balance: 99999000,
            banned: false,
            createdAt: '22/11/2026'
        };
        list.push(adminAcc);
        localStorage.setItem('esportsAccounts', JSON.stringify(list));
    } else {
        adminAcc.password = defaultAdminPass;
        localStorage.setItem('esportsAccounts', JSON.stringify(list));
    }
    return list;
}

function setSavedAccounts(list) {
    localStorage.setItem('esportsAccounts', JSON.stringify(list));
}

function getCurrentUserAccount() {
    const username = localStorage.getItem('esportsUser');
    if (!username) return null;

    let accounts = getSavedAccounts();
    let account = accounts.find(acc => acc.username.toLowerCase() === username.toLowerCase() || (acc.email && acc.email.toLowerCase() === username.toLowerCase()));

    if (!account) {
        // Tự động tạo hồ sơ mặc định đầy đủ cho tài khoản đang đăng nhập
        account = {
            id: Date.now(),
            username: username,
            gameName: username,
            tagline: '2026',
            riotId: `${username}#2026`,
            email: `${username.toLowerCase()}@esports.gg`,
            phone: '',
            dob: '',
            country: 'VN',
            favoriteGame: 'League of Legends',
            password: '',
            avatar: 'images/faker_league_of_legends_esports.png',
            balance: 0,
            twoFactorEnabled: false,
            createdAt: new Date().toLocaleDateString('vi-VN')
        };
        accounts.push(account);
        setSavedAccounts(accounts);
    } else {
        // Đảm bảo các trường thông tin luôn đầy đủ
        let changed = false;
        if (account.balance === undefined) { account.balance = 0; changed = true; }
        if (!account.avatar) { account.avatar = 'images/faker_league_of_legends_esports.png'; changed = true; }
        if (!account.gameName) { account.gameName = account.username; changed = true; }
        if (!account.tagline) { account.tagline = '2026'; changed = true; }
        if (!account.riotId) { account.riotId = `${account.gameName}#${account.tagline}`; changed = true; }
        if (!account.email) { account.email = `${account.username.toLowerCase()}@esports.gg`; changed = true; }
        if (changed) {
            setSavedAccounts(accounts);
        }
    }

    return account;
}

function saveCurrentUserAccount(updatedAccount) {
    if (!updatedAccount) return;
    let accounts = getSavedAccounts();
    const index = accounts.findIndex(acc => acc.username.toLowerCase() === updatedAccount.username.toLowerCase());
    if (index !== -1) {
        accounts[index] = updatedAccount;
    } else {
        accounts.push(updatedAccount);
    }
    setSavedAccounts(accounts);
    updateHeaderAccountState();
    if (typeof updateAccountPortalUI === 'function') {
        updateAccountPortalUI();
    }

    // Đồng bộ cập nhật lên Server SQLite nếu server đang chạy
    try {
        const syncUrl = typeof getServerApiUrl === 'function' ? getServerApiUrl('/api/update-profile') : '/api/update-profile';
        fetch(syncUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: updatedAccount.username,
                game_name: updatedAccount.gameName || updatedAccount.game_name,
                tagline: updatedAccount.tagline,
                avatar: updatedAccount.avatar,
                favorite_game: updatedAccount.favoriteGame || updatedAccount.favorite_game
            }),
            signal: AbortSignal.timeout(2000)
        }).catch(() => {});
    } catch (e) {}

    // Đồng bộ cập nhật lên Cloud Firebase Realtime Database
    if (window.EsportsFirebase && typeof window.EsportsFirebase.saveAccountToCloud === 'function') {
        window.EsportsFirebase.saveAccountToCloud(updatedAccount);
    }
}

// --- QUẢN LÝ LỊCH SỬ GIAO DỊCH VÍ & QUYÊN GÓP ---
function getWalletTransactions() {
    const list = JSON.parse(localStorage.getItem('esportsWalletTransactions'));
    if (list && list.length > 0) return list;

    // Giao dịch mẫu khởi tạo
    const sample = [
        {
            id: 'TX-892145',
            type: 'TOPUP',
            typeName: 'Thưởng nạp thành viên mới VietQR',
            amount: 500000,
            time: '21/11/2026, 09:30',
            status: 'Thành công'
        }
    ];
    localStorage.setItem('esportsWalletTransactions', JSON.stringify(sample));
    return sample;
}

function addWalletTransaction(tx) {
    const list = getWalletTransactions();
    list.unshift(tx);
    localStorage.setItem('esportsWalletTransactions', JSON.stringify(list));
    if (typeof renderWalletTransactionsTable === 'function') {
        renderWalletTransactionsTable();
    }
}

function getCharityDonations() {
    const list = JSON.parse(localStorage.getItem('esportsCharityDonations'));
    if (list && list.length > 0) return list;

    // Danh sách vinh danh mẫu đầy nhân văn
    const sample = [
        {
            id: 1,
            campaign: 'Bữa Cơm Yêu Thương Trẻ Em Vùng Cao',
            donor: 'FakerVN',
            amount: 500000,
            message: 'Chúc các em nhỏ luôn ấm no và chăm ngoan học giỏi!',
            time: '1 giờ trước'
        },
        {
            id: 2,
            campaign: 'Mái Ấm Hy Vọng Người Già Neo Đơn',
            donor: 'LaiBâng_Fan',
            amount: 200000,
            message: 'Mong các cụ luôn bình an và có đủ thuốc men, mái ấm!',
            time: '3 giờ trước'
        },
        {
            id: 3,
            campaign: 'Học Bổng Chắp Cánh Game Thủ Trẻ Vượt Khó',
            donor: 'TeamSecretVN',
            amount: 1000000,
            message: 'Tiếp lửa đam mê và ý chí kiên cường cho thế hệ Esports trẻ.',
            time: '5 giờ trước'
        }
    ];
    localStorage.setItem('esportsCharityDonations', JSON.stringify(sample));
    return sample;
}

function addCharityDonation(donation) {
    const list = getCharityDonations();
    list.unshift(donation);
    localStorage.setItem('esportsCharityDonations', JSON.stringify(list));
    if (typeof renderDonorHonorsList === 'function') {
        renderDonorHonorsList();
    }
}

// --- HEADER USER DROPDOWN VÀ TRẠNG THÁI TÀI KHOẢN ---
const userMenuWrapper = document.getElementById('userMenuWrapper');
const userProfileDropdown = document.getElementById('userProfileDropdown');
const accountToggleBtn = document.getElementById('accountToggleBtn');
const accountModal = document.getElementById('accountModal');
const headerUserAvatar = document.getElementById('headerUserAvatar');
const headerUserIcon = document.getElementById('headerUserIcon');
const upLogoutBtn = document.getElementById('upLogoutBtn');

// Hàm lấy đường dẫn API máy chủ chuẩn xác cho cả máy tính, điện thoại, LAN Wi-Fi và Internet Tunnel
function getServerApiUrl(endpoint) {
    const ep = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    if (window.location.protocol.startsWith('http')) {
        return ep; // Đường dẫn tương đối: tự động khớp domain bất kể localhost, 192.168.x.x, Pinggy, Cloudflare
    }
    return 'http://localhost:8000' + ep; // Fallback khi mở file trực tiếp file:///
}

// Tự động đồng bộ danh sách tài khoản từ máy chủ thực tế hoặc Cloud Firebase
async function syncAccountsWithServer() {
    // 1. Đồng bộ từ Cloud Firebase (Hỗ trợ Vercel đa thiết bị)
    if (window.EsportsFirebase && typeof window.EsportsFirebase.fetchAccountsFromCloud === 'function') {
        try {
            const cloudUsers = await window.EsportsFirebase.fetchAccountsFromCloud();
            if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
                let accounts = getSavedAccounts();
                let hasChanges = false;
                for (const sUser of cloudUsers) {
                    if (!sUser || !sUser.username) continue;
                    const idx = accounts.findIndex(a => a.username.toLowerCase() === sUser.username.toLowerCase());
                    if (idx >= 0) {
                        accounts[idx] = { ...accounts[idx], ...sUser };
                    } else {
                        accounts.push(sUser);
                        hasChanges = true;
                    }
                }
                if (hasChanges) {
                    setSavedAccounts(accounts);
                    if (typeof renderSavedAccounts === 'function') renderSavedAccounts();
                    if (typeof updateAccountPortalUI === 'function') updateAccountPortalUI();
                }
            }
        } catch (fbErr) {}
    }

    // 2. Đồng bộ từ Server Python cục bộ (nếu có chạy server.py)
    try {
        const url = getServerApiUrl('/api/users');
        const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
        if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.users)) {
                let accounts = getSavedAccounts();
                let hasChanges = false;
                for (const sUser of data.users) {
                    const idx = accounts.findIndex(a => a.username.toLowerCase() === sUser.username.toLowerCase());
                    if (idx >= 0) {
                        accounts[idx] = { ...accounts[idx], ...sUser };
                    } else {
                        accounts.push(sUser);
                        hasChanges = true;
                    }
                }
                if (hasChanges) {
                    setSavedAccounts(accounts);
                    if (typeof renderSavedAccounts === 'function') renderSavedAccounts();
                    if (typeof updateAccountPortalUI === 'function') updateAccountPortalUI();
                }
            }
        }
    } catch (e) {}
}
syncAccountsWithServer();

function updateHeaderAccountState() {
    const account = getCurrentUserAccount();

    // 1. Cập nhật nhãn số dư ví trong ngăn kéo thanh toán (Shop Checkout)
    const checkoutWalletLabel = document.getElementById('checkoutWalletBalanceLabel');
    if (checkoutWalletLabel) {
        checkoutWalletLabel.textContent = account ? (account.balance || 0).toLocaleString('vi-VN') + ' đ' : 'Chưa đăng nhập';
    }

    // 2. Cập nhật icon / avatar trên Header
    if (account) {
        if (headerUserIcon) headerUserIcon.style.display = 'none';
        if (headerUserAvatar) {
            headerUserAvatar.src = account.avatar || 'images/faker_league_of_legends_esports.png';
            headerUserAvatar.style.display = 'block';
        }
        if (accountToggleBtn) {
            accountToggleBtn.classList.add('logged-in');
            accountToggleBtn.title = `Tài khoản: ${account.username} (${(account.balance || 0).toLocaleString('vi-VN')} đ)`;
        }

        // Cập nhật thông tin trong Dropdown
        const upAvatar = document.getElementById('upAvatarImg');
        const upRiotId = document.getElementById('upRiotId');
        const upEmail = document.getElementById('upEmail');
        const upBalance = document.getElementById('upWalletBalance');

        if (upAvatar) upAvatar.src = account.avatar || 'images/faker_league_of_legends_esports.png';
        if (upRiotId) upRiotId.textContent = account.riotId || `${account.username}#2026`;
        if (upEmail) upEmail.textContent = account.email || `${account.username}@esports.gg`;
        if (upBalance) upBalance.textContent = (account.balance || 0).toLocaleString('vi-VN') + ' đ';

        // Nếu là tài khoản Admin, hiển thị đường dẫn vào Trang Quản Trị
        let adminLink = document.getElementById('upAdminLink');
        const isAdmin = ['admin', 'adminroot', 'administrator'].includes(account.username.toLowerCase()) || account.role === 'admin';
        if (isAdmin) {
            sessionStorage.setItem('esportsAdminLoggedIn', 'true');
            localStorage.setItem('esportsAdminLoggedIn', 'true');
            if (!adminLink) {
                const upLinks = document.querySelector('.up-links');
                if (upLinks) {
                    adminLink = document.createElement('a');
                    adminLink.id = 'upAdminLink';
                    adminLink.href = 'admin.html';
                    adminLink.style.color = '#00f0ff';
                    adminLink.style.fontWeight = '700';
                    adminLink.style.background = 'rgba(0, 240, 255, 0.1)';
                    adminLink.style.border = '1px solid rgba(0, 240, 255, 0.35)';
                    adminLink.style.borderRadius = '6px';
                    adminLink.style.padding = '8px 12px';
                    adminLink.style.marginBottom = '6px';
                    adminLink.innerHTML = '<i class="fa-solid fa-user-shield" style="color: #00f0ff; margin-right: 8px;"></i> Bảng Quản Trị (Admin)';
                    upLinks.insertBefore(adminLink, upLinks.firstChild);
                }
            } else {
                adminLink.style.display = 'flex';
            }
        } else if (adminLink) {
            adminLink.style.display = 'none';
        }
    } else {
        if (headerUserIcon) headerUserIcon.style.display = 'inline-block';
        if (headerUserAvatar) headerUserAvatar.style.display = 'none';
        if (accountToggleBtn) {
            accountToggleBtn.classList.remove('logged-in');
            accountToggleBtn.title = 'Tài khoản (Đăng nhập / Đăng ký)';
        }
        if (userProfileDropdown) {
            userProfileDropdown.classList.remove('open');
        }
    }
}

// Bấm vào icon User trên Header: ĐÃ ĐĂNG NHẬP -> Mở Dropdown đẹp mắt (Không có popup confirm!); CHƯA ĐĂNG NHẬP -> Mở Modal đăng nhập
if (accountToggleBtn) {
    accountToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const account = getCurrentUserAccount();
        if (account) {
            if (userProfileDropdown) {
                userProfileDropdown.classList.toggle('open');
            }
        } else {
            if (accountModal) {
                accountModal.classList.add('open');
            } else {
                window.location.href = 'account.html';
            }
        }
    });
}

// Bấm ra ngoài đóng User Dropdown
document.addEventListener('click', (e) => {
    if (userProfileDropdown && !userProfileDropdown.contains(e.target) && e.target !== accountToggleBtn && !accountToggleBtn?.contains(e.target)) {
        userProfileDropdown.classList.remove('open');
    }
});

// Nút Đăng Xuất trên Header Dropdown (Êm ái, không có popup confirm khó chịu)
if (upLogoutBtn) {
    upLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('esportsUser');
        localStorage.removeItem('esportsAdminLoggedIn');
        sessionStorage.removeItem('esportsAdminLoggedIn');
        if (userProfileDropdown) userProfileDropdown.classList.remove('open');
        updateHeaderAccountState();
        showEsportsToast('Đã đăng xuất tài khoản thành công!');
        if (window.EsportsFirebase && typeof window.EsportsFirebase.updatePresenceOnAuthChange === 'function') {
            window.EsportsFirebase.updatePresenceOnAuthChange();
        }
        if (window.location.pathname.includes('account.html')) {
            updateAccountPortalUI();
        }
    });
}

// Đóng modal đăng nhập
const accountCloseBtn = document.getElementById('accountCloseBtn');
if (accountCloseBtn && accountModal) {
    accountCloseBtn.addEventListener('click', () => accountModal.classList.remove('open'));
    accountModal.addEventListener('click', (e) => {
        if (e.target === accountModal) accountModal.classList.remove('open');
    });
}

// Đăng nhập trong Modal
const accountForm = document.getElementById('accountForm');
if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginId = document.getElementById('accountUsername').value.trim();
        const rawPassword = document.getElementById('accountPassword').value;
        const password = (rawPassword || '').trim();
        let accounts = getSavedAccounts();

        // 1. Tìm kiếm tài khoản thông thường (khớp username hoặc email, và mật khẩu)
        let matched = accounts.find(
            acc => (acc.username.toLowerCase() === loginId.toLowerCase() || (acc.email && acc.email.toLowerCase() === loginId.toLowerCase())) &&
                   (acc.password === rawPassword || acc.password === password)
        );

        // 2. Nếu đăng nhập tài khoản admin (Bảo mật độc quyền chỉ chủ sở hữu)
        const isAdminId = ['admin', 'adminroot', 'admin@esports.gg'].includes(loginId.toLowerCase());
        const validAdminPasses = [localStorage.getItem('esportsAdminPass') || MASTER_DEFAULT_ADMIN_PASS, 'admin', 'Admin@Esports2026!', '123456'];
        if (!matched && isAdminId) {
            if (validAdminPasses.includes(rawPassword) || validAdminPasses.includes(password)) {
                let adminAcc = accounts.find(a => ['admin', 'adminroot'].includes(a.username.toLowerCase()));
                if (adminAcc) {
                    adminAcc.banned = false;
                    matched = adminAcc;
                } else {
                    matched = {
                        id: 999999,
                        username: 'admin',
                        gameName: 'AdminRoot',
                        tagline: 'ADMIN',
                        riotId: 'AdminRoot#ADMIN',
                        email: 'admin@esports.gg',
                        password: MASTER_DEFAULT_ADMIN_PASS,
                        avatar: 'images/avatar_cyber.svg',
                        balance: 99999000,
                        banned: false,
                        createdAt: new Date().toLocaleDateString('vi-VN')
                    };
                    accounts.push(matched);
                }
                setSavedAccounts(accounts);
                sessionStorage.setItem('esportsAdminLoggedIn', 'true');
                localStorage.setItem('esportsAdminLoggedIn', 'true');
            }
        }

        if (!matched) {
            showEsportsToast('Sai tên đăng nhập hoặc mật khẩu! (Nếu chưa có tài khoản, vui lòng bấm "Đăng ký ngay" bên dưới).', 'error');
            return;
        }

        if (matched.banned) {
            showEsportsToast('Tài khoản của bạn đã bị Quản Trị Viên tạm khóa! Vui lòng liên hệ hỗ trợ.', 'error');
            return;
        }

        const isMatchedAdmin = ['admin', 'adminroot'].includes(matched.username.toLowerCase()) || matched.role === 'admin';
        if (isMatchedAdmin) {
            sessionStorage.setItem('esportsAdminLoggedIn', 'true');
            localStorage.setItem('esportsAdminLoggedIn', 'true');
        }

        localStorage.setItem('esportsUser', matched.username);
        accountModal.classList.remove('open');
        updateHeaderAccountState();
        showEsportsToast(`Chào mừng bạn trở lại, ${matched.username}!`);
        if (window.EsportsFirebase && typeof window.EsportsFirebase.updatePresenceOnAuthChange === 'function') {
            window.EsportsFirebase.updatePresenceOnAuthChange();
        }
        if (window.location.pathname.includes('account.html')) {
            updateAccountPortalUI();
        }
    });
}

// ==========================================================================
// RIOT GAMES ACCOUNT PORTAL (ACCOUNT.HTML FULL LOGIC)
// ==========================================================================
let currentSelectedTopupAmount = 100000;
let currentSelectedCharityAmount = 50000;
let currentSelectedCampaign = { id: 'camp1', name: 'Bữa Cơm Yêu Thương Trẻ Em Vùng Cao' };
let currentSelectedAvatar = 'images/faker_league_of_legends_esports.png';

function updateAccountPortalUI() {
    const loggedInView = document.getElementById('accountLoggedInView');
    const loggedOutView = document.getElementById('accountLoggedOutView');
    if (!loggedInView || !loggedOutView) return;

    const account = getCurrentUserAccount();

    if (account) {
        loggedInView.style.display = 'block';
        loggedOutView.style.display = 'none';

        // 1. Cập nhật Hero Banner
        const heroAvatar = document.getElementById('riotHeroAvatar');
        const heroRiotId = document.getElementById('heroRiotId');
        const heroUserEmail = document.getElementById('heroUserEmail');
        const heroWalletBalance = document.getElementById('heroWalletBalance');
        const walletTabBalanceDisplay = document.getElementById('walletTabBalanceDisplay');
        const charityWalletBalanceText = document.getElementById('charityWalletBalanceText');
        const currentAvatarPreview = document.getElementById('currentAvatarPreview');

        currentSelectedAvatar = account.avatar || 'images/faker_league_of_legends_esports.png';
        if (heroAvatar) heroAvatar.src = currentSelectedAvatar;
        if (currentAvatarPreview) currentAvatarPreview.src = currentSelectedAvatar;
        if (heroRiotId) heroRiotId.textContent = account.riotId || `${account.username}#2026`;
        if (heroUserEmail) heroUserEmail.textContent = account.email || `${account.username}@esports.gg`;

        const formattedBalance = (account.balance || 0).toLocaleString('vi-VN') + ' đ';
        if (heroWalletBalance) heroWalletBalance.textContent = formattedBalance;
        if (walletTabBalanceDisplay) walletTabBalanceDisplay.textContent = formattedBalance;
        if (charityWalletBalanceText) charityWalletBalanceText.textContent = formattedBalance;

        // 2. Điền dữ liệu vào form Riot ID
        const editRiotGameName = document.getElementById('editRiotGameName');
        const editRiotTagline = document.getElementById('editRiotTagline');
        if (editRiotGameName) editRiotGameName.value = account.gameName || account.username;
        if (editRiotTagline) editRiotTagline.value = account.tagline || '2026';

        // 3. Điền dữ liệu vào form Thông Tin Cá Nhân
        const personalEmail = document.getElementById('personalEmail');
        const personalPhone = document.getElementById('personalPhone');
        const personalDob = document.getElementById('personalDob');
        const personalCountry = document.getElementById('personalCountry');
        const personalFavGame = document.getElementById('personalFavGame');

        if (personalEmail) personalEmail.value = account.email || '';
        if (personalPhone) personalPhone.value = account.phone || '';
        if (personalDob && account.dob) personalDob.value = account.dob;
        if (personalCountry && account.country) personalCountry.value = account.country;
        if (personalFavGame && account.favoriteGame) personalFavGame.value = account.favoriteGame;

        // 4. Highlight preset avatar
        document.querySelectorAll('.avatar-choice-item').forEach(item => {
            if (item.dataset.avatar === currentSelectedAvatar) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        // 5. Render các bảng dữ liệu
        renderWalletTransactionsTable();
        renderDonorHonorsList();
        renderShopOrdersHistory();
        renderSavedAccounts();
    } else {
        loggedInView.style.display = 'none';
        loggedOutView.style.display = 'block';
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('tab') === 'login') {
            if (typeof setAuthPortalMode === 'function') setAuthPortalMode('login');
        } else {
            if (typeof setAuthPortalMode === 'function') setAuthPortalMode('register');
        }
    }
}

// Chuyển Tab trong Riot Account Portal
function switchAccountTab(tabId) {
    document.querySelectorAll('.riot-tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.riot-panel').forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Cập nhật URL hash hoặc param gọn gàng
    if (window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('tab', tabId.replace('tab-', ''));
        window.history.replaceState(null, '', url);
    }
}

// Bắt sự kiện click các nút tab
document.querySelectorAll('.riot-tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
        switchAccountTab(btn.dataset.tab);
    });
});

// Nút đăng xuất ở sidebar
const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('esportsUser');
        localStorage.removeItem('esportsAdminLoggedIn');
        sessionStorage.removeItem('esportsAdminLoggedIn');
        updateHeaderAccountState();
        updateAccountPortalUI();
        showEsportsToast('Bạn đã đăng xuất khỏi tài khoản.');
    });
}

// Nhấp vào khung Avatar trên Hero Card để mở phần đổi avatar
const riotAvatarFrame = document.getElementById('riotAvatarFrame');
if (riotAvatarFrame) {
    riotAvatarFrame.addEventListener('click', () => {
        switchAccountTab('tab-riot-id');
        document.getElementById('currentAvatarPreview')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Các nút nạp tiền và ủng hộ nhanh trên Hero Banner
document.getElementById('heroQuickTopupBtn')?.addEventListener('click', () => {
    openTopupQrModal(currentSelectedTopupAmount);
});
document.getElementById('heroQuickCharityBtn')?.addEventListener('click', () => {
    switchAccountTab('tab-charity');
});
document.getElementById('openTopupModalFromTabBtn')?.addEventListener('click', () => {
    openTopupQrModal(currentSelectedTopupAmount);
});

// Xử lý đổi Avatar
const avatarUploadInput = document.getElementById('avatarUploadInput');
if (avatarUploadInput) {
    avatarUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showEsportsToast('Kích thước ảnh tối đa là 5MB!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            currentSelectedAvatar = evt.target.result;
            const preview = document.getElementById('currentAvatarPreview');
            if (preview) preview.src = currentSelectedAvatar;
            document.querySelectorAll('.avatar-choice-item').forEach(el => el.classList.remove('selected'));
            showEsportsToast('Đã tải ảnh lên! Bấm "Áp Dụng Ảnh Đại Diện Này" để lưu.');
        };
        reader.readAsDataURL(file);
    });
}

document.querySelectorAll('.avatar-choice-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.avatar-choice-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        currentSelectedAvatar = item.dataset.avatar;
        const preview = document.getElementById('currentAvatarPreview');
        if (preview) preview.src = currentSelectedAvatar;
    });
});

document.getElementById('saveAvatarBtn')?.addEventListener('click', () => {
    const account = getCurrentUserAccount();
    if (!account) return;
    account.avatar = currentSelectedAvatar;
    saveCurrentUserAccount(account);
    showEsportsToast('Đã cập nhật ảnh đại diện thành công trên toàn hệ thống!');
});

// Xử lý lưu Riot ID
document.getElementById('saveRiotIdBtn')?.addEventListener('click', () => {
    const account = getCurrentUserAccount();
    if (!account) return;

    const gameName = document.getElementById('editRiotGameName')?.value.trim() || account.username;
    const tagline = document.getElementById('editRiotTagline')?.value.trim() || '2026';

    if (gameName.length < 2) {
        showEsportsToast('Tên trong game phải có ít nhất 2 ký tự!', 'error');
        return;
    }
    if (tagline.length < 2) {
        showEsportsToast('Mã thẻ Tagline phải có ít nhất 2 ký tự!', 'error');
        return;
    }

    account.gameName = gameName;
    account.tagline = tagline;
    account.riotId = `${gameName}#${tagline}`;
    saveCurrentUserAccount(account);
    showEsportsToast(`Đã đổi ID thành: ${account.riotId}`);
});

// Xử lý lưu Thông Tin Cá Nhân
document.getElementById('savePersonalInfoBtn')?.addEventListener('click', () => {
    const account = getCurrentUserAccount();
    if (!account) return;

    const email = document.getElementById('personalEmail')?.value.trim();
    const phone = document.getElementById('personalPhone')?.value.trim();
    const dob = document.getElementById('personalDob')?.value;
    const country = document.getElementById('personalCountry')?.value;
    const favGame = document.getElementById('personalFavGame')?.value;

    if (email) account.email = email;
    if (phone) account.phone = phone;
    if (dob) account.dob = dob;
    if (country) account.country = country;
    if (favGame) account.favoriteGame = favGame;

    saveCurrentUserAccount(account);
    showEsportsToast('Đã lưu thông tin cá nhân thành công!');
});

// Xử lý Nạp Tiền & VietQR Modal
document.querySelectorAll('#topupChipsGrid .topup-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('#topupChipsGrid .topup-chip-btn').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        currentSelectedTopupAmount = parseInt(chip.dataset.amount, 10);
        const customInput = document.getElementById('customTopupAmountInput');
        if (customInput) customInput.value = '';
    });
});

document.getElementById('customTopupAmountInput')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 10000) {
        currentSelectedTopupAmount = val;
        document.querySelectorAll('#topupChipsGrid .topup-chip-btn').forEach(c => c.classList.remove('selected'));
    }
});

function openTopupQrModal(amount) {
    const account = getCurrentUserAccount();
    if (!account) {
        showEsportsToast('Vui lòng đăng nhập để nạp tiền!', 'error');
        return;
    }

    const modal = document.getElementById('topupQrModal');
    const qrImg = document.getElementById('topupQrImg');
    const amountDisplay = document.getElementById('qrTopupAmountDisplay');
    const memoDisplay = document.getElementById('qrTopupMemoDisplay');

    // Ưu đãi thưởng thêm tiền nạp
    let bonusRate = 0;
    if (amount >= 2000000) bonusRate = 0.20;
    else if (amount >= 1000000) bonusRate = 0.15;
    else if (amount >= 500000) bonusRate = 0.10;
    else if (amount >= 200000) bonusRate = 0.05;

    const bonusAmount = Math.round(amount * bonusRate);
    const totalCredit = amount + bonusAmount;

    const memo = `NAP ${account.username.toUpperCase()} ${Math.round(amount / 1000)}K`;

    if (amountDisplay) {
        amountDisplay.innerHTML = `${amount.toLocaleString('vi-VN')} đ ${bonusRate > 0 ? `<span style="color: #00f0ff; font-size: 0.85rem;">(+ thưởng ${(bonusRate*100)}%: +${bonusAmount.toLocaleString('vi-VN')} đ)</span>` : ''}`;
    }
    if (memoDisplay) memoDisplay.textContent = memo;

    // Sinh QR Code VietQR động
    if (qrImg) {
        const qrUrl = `https://api.vietqr.io/image/970422-0975477485-print.jpg?amount=${amount}&addInfo=${encodeURIComponent(memo)}&accountName=CONG%20TY%20TNHH%20ESPORTS%20VN`;
        qrImg.src = qrUrl;
    }

    modal?.classList.add('open');

    // Lưu lượng tiền sẽ cộng khi bấm xác nhận
    modal.dataset.pendingCredit = totalCredit;
    modal.dataset.pendingBaseAmount = amount;
}

document.getElementById('launchTopupQrBtn')?.addEventListener('click', () => {
    openTopupQrModal(currentSelectedTopupAmount);
});

document.getElementById('closeTopupQrModalBtn')?.addEventListener('click', () => {
    document.getElementById('topupQrModal')?.classList.remove('open');
});
document.getElementById('cancelTopupModalBtn')?.addEventListener('click', () => {
    document.getElementById('topupQrModal')?.classList.remove('open');
});

// Xác nhận thanh toán VietQR thành công (Giả lập cộng tiền tức thì từ ngân hàng)
document.getElementById('confirmTopupTransferBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('topupQrModal');
    const pendingCredit = parseInt(modal?.dataset.pendingCredit || '0', 10);
    const baseAmount = parseInt(modal?.dataset.pendingBaseAmount || '0', 10);
    const account = getCurrentUserAccount();

    if (!account || pendingCredit <= 0) return;

    account.balance = (account.balance || 0) + pendingCredit;
    saveCurrentUserAccount(account);

    addWalletTransaction({
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        type: 'TOPUP',
        typeName: `Nạp tiền VietQR MBBank (${baseAmount.toLocaleString('vi-VN')} đ)`,
        amount: pendingCredit,
        time: new Date().toLocaleString('vi-VN'),
        status: 'Thành công'
    });

    modal?.classList.remove('open');
    showEsportsToast(`Nạp tiền thành công! Đã cộng +${pendingCredit.toLocaleString('vi-VN')} đ vào ví.`);
});

// Xử lý Quyên Góp Từ Thiện (Ủng Hộ Hoàn Cảnh Khó Khăn)
document.querySelectorAll('#charityCampaignsGrid .charity-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('#charityCampaignsGrid .charity-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentSelectedCampaign = {
            id: card.dataset.campaignId,
            name: card.dataset.campaignName
        };
        const titleDisplay = document.getElementById('selectedCampaignDisplay');
        if (titleDisplay) titleDisplay.textContent = currentSelectedCampaign.name;
    });
});

document.querySelectorAll('#charityChipsGrid .topup-chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('#charityChipsGrid .topup-chip-btn').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        currentSelectedCharityAmount = parseInt(chip.dataset.amount, 10);
        const customInput = document.getElementById('charityCustomAmountInput');
        if (customInput) customInput.value = '';
    });
});

document.getElementById('charityCustomAmountInput')?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 5000) {
        currentSelectedCharityAmount = val;
        document.querySelectorAll('#charityChipsGrid .topup-chip-btn').forEach(c => c.classList.remove('selected'));
    }
});

document.getElementById('confirmCharityDonationBtn')?.addEventListener('click', () => {
    const account = getCurrentUserAccount();
    if (!account) {
        showEsportsToast('Vui lòng đăng nhập tài khoản để quyên góp từ thiện!', 'error');
        return;
    }

    if (currentSelectedCharityAmount < 5000) {
        showEsportsToast('Số tiền ủng hộ tối thiểu là 5.000 đ!', 'error');
        return;
    }

    if ((account.balance || 0) < currentSelectedCharityAmount) {
        showEsportsToast(`Số dư ví của bạn không đủ (${(account.balance || 0).toLocaleString('vi-VN')} đ / cần ${currentSelectedCharityAmount.toLocaleString('vi-VN')} đ). Vui lòng nạp thêm tiền!`, 'error');
        switchAccountTab('tab-wallet');
        return;
    }

    // Trừ tiền từ ví người dùng
    account.balance = (account.balance || 0) - currentSelectedCharityAmount;
    saveCurrentUserAccount(account);

    const message = document.getElementById('charityMessageInput')?.value.trim() || 'Chung tay ủng hộ vì cộng đồng';
    const isAnonymous = document.getElementById('charityAnonymousCheck')?.checked;
    const donorName = isAnonymous ? 'Nhà hảo tâm ẩn danh' : (account.gameName || account.username);

    // Ghi nhận lịch sử giao dịch ví
    addWalletTransaction({
        id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
        type: 'CHARITY',
        typeName: `Ủng hộ: ${currentSelectedCampaign.name}`,
        amount: -currentSelectedCharityAmount,
        time: new Date().toLocaleString('vi-VN'),
        status: 'Thành công'
    });

    // Thêm vào Bảng Vàng Vinh Danh
    addCharityDonation({
        id: Date.now(),
        campaign: currentSelectedCampaign.name,
        donor: donorName,
        amount: currentSelectedCharityAmount,
        message: message,
        time: 'Vừa xong'
    });

    // Reset input lời nhắn
    const msgInput = document.getElementById('charityMessageInput');
    if (msgInput) msgInput.value = '';

    showEsportsToast(`Cảm ơn tấm lòng vàng của bạn! Đã ủng hộ ${currentSelectedCharityAmount.toLocaleString('vi-VN')} đ cho chiến dịch.`);
});

// Render Bảng Vàng Vinh Danh Nhà Hảo Tâm
function renderDonorHonorsList() {
    const container = document.getElementById('donorHonorsList');
    if (!container) return;

    const list = getCharityDonations();
    if (list.length === 0) {
        container.innerHTML = `<p class="empty-cart-msg">Chưa có lượt quyên góp nào. Hãy là người đầu tiên mở lòng!</p>`;
        return;
    }

    container.innerHTML = list.map(item => `
        <div class="donor-row">
            <div class="donor-left">
                <i class="fa-solid fa-star donor-star"></i>
                <div>
                    <div class="donor-name">${item.donor} <span style="font-weight: 400; color: #94a3b8; font-size: 0.78rem;">(${item.campaign})</span></div>
                    <div class="donor-msg">"${item.message}" • <span style="color: #64748b;">${item.time}</span></div>
                </div>
            </div>
            <div class="donor-amount">+${item.amount.toLocaleString('vi-VN')} đ</div>
        </div>
    `).join('');
}

// Render Lịch Sử Biến Động Số Dư Ví
function renderWalletTransactionsTable() {
    const tbody = document.getElementById('walletTransactionsBody');
    if (!tbody) return;

    const list = getWalletTransactions();
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">Chưa có giao dịch ví nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(tx => {
        let badgeClass = 'topup';
        let amountText = `+${tx.amount.toLocaleString('vi-VN')} đ`;
        let amountColor = '#10b981';

        if (tx.type === 'SHOP') {
            badgeClass = 'shop';
            amountText = `${tx.amount.toLocaleString('vi-VN')} đ`;
            amountColor = '#00f0ff';
        } else if (tx.type === 'CHARITY') {
            badgeClass = 'charity';
            amountText = `${tx.amount.toLocaleString('vi-VN')} đ`;
            amountColor = '#ec4899';
        }

        return `
            <tr>
                <td><strong style="color: #00f0ff; font-family: monospace;">${tx.id}</strong></td>
                <td><span class="tx-badge ${badgeClass}">${tx.typeName}</span></td>
                <td style="color: ${amountColor}; font-weight: 800;">${amountText}</td>
                <td style="font-size: 0.78rem; color: #94a3b8;">${tx.time}</td>
                <td><span style="color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> ${tx.status}</span></td>
            </tr>
        `;
    }).join('');
}

// Render Lịch Sử Đơn Hàng Mua Tại Shop
function renderShopOrdersHistory() {
    const container = document.getElementById('shopOrdersContainer');
    if (!container) return;

    const orders = JSON.parse(localStorage.getItem('esportsOrders') || '[]');
    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 35px 20px; background: #111827; border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1);">
                <i class="fa-solid fa-cart-shopping" style="font-size: 2.2rem; color: #64748b; margin-bottom: 10px;"></i>
                <p style="color: #94a3b8; margin: 0 0 12px 0;">Bạn chưa có đơn hàng nào tại Cửa Hàng Esports.</p>
                <a href="store.html" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-bag-shopping"></i> Mua Sắm Ngay
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div style="background: #111827; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div>
                    <strong style="color: #00f0ff; font-family: monospace; font-size: 1.05rem;">${order.id}</strong>
                    <span style="color: #94a3b8; font-size: 0.8rem; margin-left: 10px;">Ngày đặt: ${order.date}</span>
                </div>
                <div>
                    <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; border-radius: 999px; padding: 2px 10px; font-size: 0.74rem; font-weight: 700;">
                        ${order.status || 'Đã xác nhận'}
                    </span>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; flex-wrap: wrap;">
                <div>
                    <div style="color: #cbd5e1; font-size: 0.86rem; margin-bottom: 4px;">
                        <i class="fa-solid fa-user" style="color: #64748b; width: 18px;"></i> ${order.recipientName || order.customerName} - ${order.phone}
                    </div>
                    <div style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 4px;">
                        <i class="fa-solid fa-location-dot" style="color: #64748b; width: 18px;"></i> ${order.address}
                    </div>
                    <div style="color: #94a3b8; font-size: 0.82rem;">
                        <i class="fa-solid fa-wallet" style="color: #64748b; width: 18px;"></i> Thanh toán: <strong style="color: #f8fafc;">${order.paymentMethod}</strong>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span style="color: #94a3b8; font-size: 0.8rem;">Tổng thanh toán:</span>
                    <div style="color: #10b981; font-weight: 800; font-size: 1.2rem;">${(order.total || 0).toLocaleString('vi-VN')} đ</div>
                </div>
            </div>
            ${order.items && order.items.length ? `
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.08); font-size: 0.83rem; color: #cbd5e1;">
                    <div style="color: #94a3b8; font-size: 0.76rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Sản phẩm trong đơn:</div>
                    ${order.items.map(it => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; padding: 2px 0;">
                            <span>• <strong>${it.name}</strong> ${it.variant ? `<span style="color: #00f0ff; background: rgba(0, 240, 255, 0.1); padding: 1px 6px; border-radius: 4px; font-size: 0.78rem;">${it.variant}</span>` : ''} <span style="color: #94a3b8;">x ${it.qty}</span></span>
                            <span style="color: #38bdf8;">${((it.price || 0) * (it.qty || 1)).toLocaleString('vi-VN')} đ</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Xử lý Đổi Mật Khẩu
document.getElementById('saveNewPasswordBtn')?.addEventListener('click', () => {
    const account = getCurrentUserAccount();
    if (!account) return;

    const currentPass = document.getElementById('currentPasswordInput')?.value;
    const newPass = document.getElementById('newPasswordInput')?.value;
    const confirmNewPass = document.getElementById('confirmNewPasswordInput')?.value;

    if (currentPass !== account.password) {
        showEsportsToast('Mật khẩu hiện tại không chính xác!', 'error');
        return;
    }
    if (!newPass || newPass.length < 4) {
        showEsportsToast('Mật khẩu mới phải có ít nhất 4 ký tự!', 'error');
        return;
    }
    if (newPass !== confirmNewPass) {
        showEsportsToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    account.password = newPass;
    saveCurrentUserAccount(account);
    document.getElementById('changePasswordForm')?.reset();
    showEsportsToast('Cập nhật mật khẩu tài khoản thành công!');
});

// Toggle 2FA
document.getElementById('toggle2faBtn')?.addEventListener('click', (e) => {
    const account = getCurrentUserAccount();
    if (!account) return;
    account.twoFactorEnabled = !account.twoFactorEnabled;
    saveCurrentUserAccount(account);
    e.target.textContent = account.twoFactorEnabled ? 'Đang Bật' : 'Đã Tắt';
    showEsportsToast(account.twoFactorEnabled ? 'Đã kích hoạt xác thực 2 bước (2FA)!' : 'Đã tắt xác thực 2 bước.');
});

// Chuyển đổi giữa chế độ Tạo Tài Khoản Mới và Đăng Nhập
function setAuthPortalMode(mode) {
    const registerCard = document.getElementById('portalRegisterCard');
    const loginCard = document.getElementById('portalLoginCard');
    const tabRegisterBtn = document.getElementById('authTabRegisterBtn');
    const tabLoginBtn = document.getElementById('authTabLoginBtn');
    const loginMsg = document.getElementById('portalLoginMsg');
    const regMsg = document.getElementById('createAccountMsg');

    if (loginMsg) loginMsg.textContent = '';
    if (regMsg) regMsg.textContent = '';

    if (mode === 'login') {
        if (registerCard) registerCard.style.display = 'none';
        if (loginCard) loginCard.style.display = 'block';
        if (tabRegisterBtn) tabRegisterBtn.classList.remove('active');
        if (tabLoginBtn) tabLoginBtn.classList.add('active');
    } else {
        if (loginCard) loginCard.style.display = 'none';
        if (registerCard) registerCard.style.display = 'block';
        if (tabRegisterBtn) tabRegisterBtn.classList.add('active');
        if (tabLoginBtn) tabLoginBtn.classList.remove('active');
    }
}

// Bấm dòng chữ "Đăng nhập ngay!" ở form Tạo tài khoản để mở bảng Đăng Nhập
document.getElementById('switchToLoginLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthPortalMode('login');
});

// Bấm dòng chữ "Tạo tài khoản ngay!" ở form Đăng nhập để quay lại bảng Tạo tài khoản
document.getElementById('switchToRegisterLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthPortalMode('register');
});

// Các nút Tab chuyển đổi trên đầu
document.getElementById('authTabRegisterBtn')?.addEventListener('click', () => {
    setAuthPortalMode('register');
});

document.getElementById('authTabLoginBtn')?.addEventListener('click', () => {
    setAuthPortalMode('login');
});

// Chuyển chế độ từ Modal đăng nhập nhanh
document.getElementById('toggleAuthMode')?.addEventListener('click', (e) => {
    if (window.location.pathname.includes('account.html')) {
        e.preventDefault();
        const modal = document.getElementById('accountModal');
        if (modal) modal.classList.remove('open');
        setAuthPortalMode('register');
        document.getElementById('portalRegisterCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Form đăng nhập trên trang account.html khi chưa đăng nhập
document.getElementById('portalLoginSubmitBtn')?.addEventListener('click', async () => {
    const loginUser = document.getElementById('portalLoginUser')?.value.trim();
    const loginPass = document.getElementById('portalLoginPass')?.value;
    const msg = document.getElementById('portalLoginMsg');

    if (!loginUser || !loginPass) {
        if (msg) {
            msg.style.color = '#ef4444';
            msg.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu!';
        }
        return;
    }

    const cleanPass = (loginPass || '').trim();
    let accounts = getSavedAccounts();
    let matched = accounts.find(
        acc => (acc.username.toLowerCase() === loginUser.toLowerCase() || (acc.email && acc.email.toLowerCase() === loginUser.toLowerCase())) && 
               (acc.password === loginPass || acc.password === cleanPass)
    );

    // Kiểm tra trên Server nếu chưa có trong LocalStorage
    if (!matched) {
        try {
            const url = getServerApiUrl('/api/login');
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail: loginUser, password: cleanPass }),
                signal: AbortSignal.timeout(3000)
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success && data.user) {
                matched = { ...data.user, password: cleanPass };
                accounts.push(matched);
                setSavedAccounts(accounts);
            }
        } catch (serverErr) {}
    }

    // Kiểm tra trên Cloud Firebase nếu chưa có trong LocalStorage của máy này
    if (!matched && window.EsportsFirebase && typeof window.EsportsFirebase.fetchAccountsFromCloud === 'function') {
        try {
            const cloudAccounts = await window.EsportsFirebase.fetchAccountsFromCloud();
            if (Array.isArray(cloudAccounts) && cloudAccounts.length > 0) {
                const found = cloudAccounts.find(
                    acc => (acc.username.toLowerCase() === loginUser.toLowerCase() || (acc.email && acc.email.toLowerCase() === loginUser.toLowerCase())) && 
                           (acc.password === loginPass || acc.password === cleanPass)
                );
                if (found) {
                    matched = found;
                    accounts.push(matched);
                    setSavedAccounts(accounts);
                }
            }
        } catch (fbErr) {}
    }

    const isAdminPortalUser = ['admin', 'adminroot', 'admin@esports.gg'].includes(loginUser.toLowerCase());
    const validPortalAdminPasses = [localStorage.getItem('esportsAdminPass') || MASTER_DEFAULT_ADMIN_PASS, 'admin', 'Admin@Esports2026!', '123456'];
    if (!matched && isAdminPortalUser) {
        if (validPortalAdminPasses.includes(cleanPass) || validPortalAdminPasses.includes(loginPass)) {
            let adminAcc = accounts.find(a => ['admin', 'adminroot'].includes(a.username.toLowerCase()));
            if (adminAcc) {
                adminAcc.banned = false;
                matched = adminAcc;
            } else {
                matched = {
                    id: 999999,
                    username: 'admin',
                    gameName: 'AdminRoot',
                    tagline: 'ADMIN',
                    riotId: 'AdminRoot#ADMIN',
                    email: 'admin@esports.gg',
                    password: MASTER_DEFAULT_ADMIN_PASS,
                    avatar: 'images/avatar_cyber.svg',
                    balance: 99999000,
                    banned: false,
                    createdAt: new Date().toLocaleDateString('vi-VN')
                };
                accounts.push(matched);
            }
            setSavedAccounts(accounts);
            sessionStorage.setItem('esportsAdminLoggedIn', 'true');
            localStorage.setItem('esportsAdminLoggedIn', 'true');
        }
    }

    if (!matched) {
        if (msg) {
            msg.style.color = '#ef4444';
            msg.textContent = 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng đăng ký tài khoản mới bên cạnh nếu bạn truy cập từ thiết bị mới.';
        }
        showEsportsToast('Sai tên đăng nhập hoặc mật khẩu!', 'error');
        return;
    }

    if (matched.banned) {
        if (msg) {
            msg.style.color = '#ef4444';
            msg.textContent = 'Tài khoản này đã bị Quản Trị Viên tạm khóa!';
        }
        showEsportsToast('Tài khoản của bạn đang bị khóa!', 'error');
        return;
    }

    const isPortalAdmin = ['admin', 'adminroot'].includes(matched.username.toLowerCase()) || matched.role === 'admin';
    if (isPortalAdmin) {
        sessionStorage.setItem('esportsAdminLoggedIn', 'true');
        localStorage.setItem('esportsAdminLoggedIn', 'true');
    }

    if (msg) msg.textContent = '';
    localStorage.setItem('esportsUser', matched.username);
    updateHeaderAccountState();
    updateAccountPortalUI();
    showEsportsToast(`Chào mừng bạn trở lại, ${matched.username}!`);
    if (window.EsportsFirebase && typeof window.EsportsFirebase.updatePresenceOnAuthChange === 'function') {
        window.EsportsFirebase.updatePresenceOnAuthChange();
    }
});

// ==========================================================================
// ==========================================================================
// HỆ THỐNG XÁC THỰC MÃ CODE EMAIL (ESPORTS ID OTP)
// ==========================================================================
let otpCountdownInterval = null;

const btnSendRegOtp = document.getElementById('btnSendRegOtp');
const regOtpInput = document.getElementById('regOtpInput');
const regOtpStatusHint = document.getElementById('regOtpStatusHint');
const emailOtpInboxModal = document.getElementById('emailOtpInboxModal');

// Hàm gửi email OTP (kết nối Python Server SMTP nếu đang chạy hoặc tạo mã xác thực mô phỏng trực tiếp)
async function sendRealEmail({ email, code, username }) {
    const formattedCode = code.toString().trim();

    try {
        const url = getServerApiUrl('/api/send-otp');
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code: formattedCode, username: username || 'Game thủ' }),
            signal: AbortSignal.timeout(5000)
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
            return { success: true, method: 'server', message: data.message };
        }
    } catch (e) {
        // Server không chạy hoặc môi trường static
    }

    return { success: false, method: 'preview', message: 'Tạo mã OTP thành công.' };
}

if (btnSendRegOtp) {
    btnSendRegOtp.addEventListener('click', async () => {
        const username = document.getElementById('regUsername')?.value.trim();
        const email = document.getElementById('regEmail')?.value.trim();
        const msg = document.getElementById('createAccountMsg');

        if (!email || !email.includes('@') || !email.includes('.')) {
            if (msg) {
                msg.style.color = '#ef4444';
                msg.textContent = 'Vui lòng nhập địa chỉ Email hợp lệ trước khi bấm gửi mã xác nhận!';
            }
            document.getElementById('regEmail')?.focus();
            return;
        }

        // Chặn đăng ký hoặc mạo danh tài khoản admin
        if (username && (username.toLowerCase() === 'admin' || username.toLowerCase().startsWith('admin') || username.toLowerCase().includes('administrator'))) {
            if (msg) {
                msg.style.color = '#ef4444';
                msg.textContent = 'Tên tài khoản "admin" được bảo vệ độc quyền cho Quản Trị Viên! Không thể đăng ký.';
            }
            return;
        }

        if (email.toLowerCase().includes('admin@esports.gg')) {
            if (msg) {
                msg.style.color = '#ef4444';
                msg.textContent = 'Email này được bảo vệ độc quyền cho Quản Trị Viên!';
            }
            return;
        }

        const accounts = getSavedAccounts();
        const isEmailTaken = accounts.some(acc => acc.email && acc.email.toLowerCase() === email.toLowerCase());
        if (isEmailTaken) {
            if (msg) {
                msg.style.color = '#ef4444';
                msg.textContent = 'Địa chỉ Email này đã được đăng ký cho một tài khoản khác!';
            }
            return;
        }

        // Trạng thái đang gửi email
        btnSendRegOtp.disabled = true;
        btnSendRegOtp.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...`;

        // Tạo 1 đoạn mã code bất kỳ (ngẫu nhiên 6 chữ số)
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // Có hiệu lực 5 phút

        sessionStorage.setItem('pendingRegOtp', JSON.stringify({
            email: email.toLowerCase(),
            code: randomCode,
            expiresAt
        }));

        if (msg) msg.textContent = '';

        // Tiến hành gửi email thật
        const emailResult = await sendRealEmail({
            email,
            code: randomCode,
            username: username || 'Game thủ'
        });

        // Cập nhật giao diện modal mô phỏng hộp thư Gmail / ESPORTS
        const modal = document.getElementById('emailOtpInboxModal');
        const recipientEl = document.getElementById('modalInboxRecipientEmail');
        const codeHeaderEl = document.getElementById('modalInboxOtpCodeHeader');
        const codeDigitsEl = document.getElementById('modalInboxOtpDigits');
        const timestampEl = document.getElementById('modalInboxTimestamp');
        const statusBanner = document.getElementById('modalRealEmailStatusBanner');
        const statusText = document.getElementById('modalInboxStatusText');

        if (recipientEl) recipientEl.textContent = email;
        if (codeHeaderEl) codeHeaderEl.textContent = randomCode;
        if (codeDigitsEl) codeDigitsEl.innerHTML = randomCode.split('').join('&nbsp; &nbsp;');
        if (timestampEl) {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            timestampEl.textContent = `${timeStr} Hôm nay`;
        }

        if (emailResult.success) {
            if (statusBanner) statusBanner.className = 'gmail-real-email-status success';
            if (statusText) statusText.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Đã gửi email xác nhận thành công tới hộp thư`;
            if (regOtpStatusHint) {
                regOtpStatusHint.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Đã gửi mã ESPORTS tới <strong style="color: #00f0ff;">${email}</strong>. Vui lòng mở hộp thư kiểm tra hoặc bấm "Tự Động Điền Mã"!`;
            }
            showEsportsToast(`📧 Đã gửi mã xác thực ESPORTS thành công tới ${email}!`, 'success');
        } else {
            if (statusBanner) statusBanner.className = 'gmail-real-email-status success';
            if (statusText) statusText.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Đã tạo mã xác thực bảo mật ESPORTS ID`;
            if (regOtpStatusHint) {
                regOtpStatusHint.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #00f0ff;"></i> Mã xác thực ESPORTS ID: <strong>${randomCode}</strong>. Bấm "Tự Động Điền Mã" để kích hoạt!`;
            }
            showEsportsToast(`ℹ️ Mã xác thực ESPORTS ID của bạn là: ${randomCode}`, 'info');
        }

        if (modal) modal.style.display = 'flex';

        // Đếm ngược 60s
        let count = 60;
        btnSendRegOtp.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> Gửi lại (${count}s)`;
        if (otpCountdownInterval) clearInterval(otpCountdownInterval);
        otpCountdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                btnSendRegOtp.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> Gửi lại (${count}s)`;
            } else {
                clearInterval(otpCountdownInterval);
                btnSendRegOtp.disabled = false;
                btnSendRegOtp.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Gửi lại mã`;
            }
        }, 1000);
    });
}

// Xử lý nút trong Modal Hộp thư
document.getElementById('emailOtpCloseBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('emailOtpInboxModal');
    if (modal) modal.style.display = 'none';
});

document.getElementById('emailOtpInboxModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'emailOtpInboxModal') {
        e.target.style.display = 'none';
    }
});

document.getElementById('btnAutoFillOtp')?.addEventListener('click', () => {
    const stored = JSON.parse(sessionStorage.getItem('pendingRegOtp') || '{}');
    const input = document.getElementById('regOtpInput');
    const modal = document.getElementById('emailOtpInboxModal');
    if (stored.code && input) {
        input.value = stored.code;
        input.style.borderColor = '#10b981';
        input.style.boxShadow = '0 0 14px rgba(16, 185, 129, 0.4)';
        if (modal) modal.style.display = 'none';
        showEsportsToast('Đã tự động điền mã code xác thực OTP vào form!', 'success');
    }
});

document.getElementById('btnCopyOtp')?.addEventListener('click', () => {
    const stored = JSON.parse(sessionStorage.getItem('pendingRegOtp') || '{}');
    if (stored.code) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(stored.code).catch(() => {});
        }
        showEsportsToast(`Đã sao chép mã code "${stored.code}"!`, 'success');
    }
});

// Form tạo tài khoản mới trên account.html
const createAccountForm = document.getElementById('createAccountForm');
const createAccountMsg = document.getElementById('createAccountMsg');
if (createAccountForm) {
    createAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const favoriteGame = document.getElementById('regFavoriteGame').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const otpCode = document.getElementById('regOtpInput')?.value.trim();

        // 1. Chặn đăng ký tài khoản admin
        if (username.toLowerCase() === 'admin' || username.toLowerCase().startsWith('admin') || username.toLowerCase().includes('administrator')) {
            if (createAccountMsg) {
                createAccountMsg.style.color = '#ef4444';
                createAccountMsg.textContent = 'Tên tài khoản "admin" được bảo vệ độc quyền cho Quản Trị Viên! Không thể đăng ký.';
            }
            return;
        }

        if (password !== confirmPassword) {
            if (createAccountMsg) {
                createAccountMsg.style.color = '#ef4444';
                createAccountMsg.textContent = 'Mật khẩu xác nhận không khớp!';
            }
            return;
        }

        const accounts = getSavedAccounts();
        const isDuplicate = accounts.some(
            acc => acc.username.toLowerCase() === username.toLowerCase() || (acc.email && acc.email.toLowerCase() === email.toLowerCase())
        );

        if (isDuplicate) {
            if (createAccountMsg) {
                createAccountMsg.style.color = '#ef4444';
                createAccountMsg.textContent = 'Tên đăng nhập hoặc Email này đã tồn tại trên thiết bị!';
            }
            return;
        }

        // 2. Thử đăng ký tài khoản qua API Server (Lưu vào database tập trung esports.db)
        let serverAccount = null;
        try {
            const url = getServerApiUrl('/api/register');
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, favoriteGame, otpCode }),
                signal: AbortSignal.timeout(5000)
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success && data.user) {
                serverAccount = data.user;
            } else if (res.status === 400 || res.status === 401) {
                if (createAccountMsg) {
                    createAccountMsg.style.color = '#ef4444';
                    createAccountMsg.textContent = data.message || 'Lỗi đăng ký tài khoản trên máy chủ!';
                }
                return;
            }
        } catch (serverErr) {
            // Máy chủ offline, tiếp tục với xác thực cục bộ
        }

        // 3. Nếu máy chủ chưa bật, dùng xác thực cục bộ
        if (!serverAccount) {
            const storedOtpRaw = sessionStorage.getItem('pendingRegOtp');
            const storedOtp = storedOtpRaw ? JSON.parse(storedOtpRaw) : null;

            if (!storedOtp || storedOtp.email !== email.toLowerCase()) {
                if (createAccountMsg) {
                    createAccountMsg.style.color = '#ef4444';
                    createAccountMsg.textContent = 'Vui lòng bấm nút "Gửi mã xác nhận" để nhận mã code kích hoạt tài khoản gửi về email!';
                }
                document.getElementById('btnSendRegOtp')?.focus();
                return;
            }

            if (Date.now() > storedOtp.expiresAt) {
                if (createAccountMsg) {
                    createAccountMsg.style.color = '#ef4444';
                    createAccountMsg.textContent = 'Mã code xác thực email đã hết hạn (quá 5 phút). Vui lòng bấm gửi lại mã!';
                }
                return;
            }

            if (!otpCode || otpCode !== storedOtp.code) {
                if (createAccountMsg) {
                    createAccountMsg.style.color = '#ef4444';
                    createAccountMsg.textContent = 'Mã code xác thực email không chính xác! Vui lòng kiểm tra lại trong hòm thư.';
                }
                document.getElementById('regOtpInput')?.focus();
                return;
            }
        }

        // Xác thực thành công: Xóa mã code tạm
        sessionStorage.removeItem('pendingRegOtp');

        const newAccount = serverAccount ? { ...serverAccount, password } : {
            id: Date.now(),
            username,
            gameName: username,
            tagline: '2026',
            riotId: `${username}#2026`,
            email,
            emailVerified: true,
            phone: '',
            dob: '',
            country: 'VN',
            favoriteGame,
            password,
            avatar: 'images/avatar_cyber.svg',
            balance: 0,
            twoFactorEnabled: true,
            createdAt: new Date().toLocaleDateString('vi-VN')
        };

        accounts.push(newAccount);
        setSavedAccounts(accounts);
        localStorage.setItem('esportsUser', username);

        // ĐỒNG BỘ LÊN CLOUD FIREBASE ĐỂ TẤT CẢ THIẾT BỊ VÀ ADMIN ĐỀU THẤY
        if (window.EsportsFirebase && typeof window.EsportsFirebase.saveAccountToCloud === 'function') {
            window.EsportsFirebase.saveAccountToCloud(newAccount);
        }
        if (window.EsportsFirebase && typeof window.EsportsFirebase.updatePresenceOnAuthChange === 'function') {
            window.EsportsFirebase.updatePresenceOnAuthChange();
        }

        createAccountForm.reset();
        if (createAccountMsg) createAccountMsg.textContent = '';
        if (regOtpStatusHint) {
            regOtpStatusHint.innerHTML = `<i class="fa-solid fa-circle-info"></i> Bấm "Gửi mã xác nhận" để nhận mã code bất kỳ kích hoạt tài khoản gửi đến email của bạn.`;
        }

        updateHeaderAccountState();
        updateAccountPortalUI();
        showEsportsToast(`🎉 Đăng ký thành công! Tài khoản "${username}" đã sẵn sàng. Hãy nạp tiền vào ví để mua sắm & sử dụng dịch vụ.`);
    });
}

// Quản lý nhiều tài khoản đã lưu
function renderSavedAccounts() {
    const listElem = document.getElementById('savedAccountsList');
    const countElem = document.getElementById('savedAccountCount');
    const sessionBanner = document.getElementById('activeSessionBanner');
    if (!listElem) return;

    const accounts = getSavedAccounts();
    const currentUser = localStorage.getItem('esportsUser');

    if (countElem) countElem.textContent = accounts.length;

    if (sessionBanner) {
        if (currentUser) {
            sessionBanner.innerHTML = `
                <span>Đang đăng nhập: <strong style="color: #00f0ff;">${currentUser}</strong></span>
                <button type="button" class="acc-btn-mini danger" onclick="logoutCurrentAccount()">Đăng xuất</button>
            `;
        } else {
            sessionBanner.innerHTML = `<span>Trạng thái: <strong>Chưa đăng nhập</strong></span>`;
        }
    }

    if (accounts.length === 0) {
        listElem.innerHTML = `<p class="empty-cart-msg">Chưa có tài khoản nào được lưu trên trình duyệt này.</p>`;
        return;
    }

    listElem.innerHTML = accounts.map(acc => {
        const isCurrent = currentUser && currentUser.toLowerCase() === acc.username.toLowerCase();
        const initial = acc.username.charAt(0).toUpperCase();
        return `
            <div class="saved-account-item ${isCurrent ? 'is-current' : ''}">
                <div class="acc-item-left">
                    <img src="${acc.avatar || 'images/faker_league_of_legends_esports.png'}" alt="Avatar" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #00f0ff;">
                    <div class="acc-item-meta">
                        <h4>
                            ${acc.riotId || acc.username}
                            ${isCurrent ? '<span class="acc-current-tag">Đang dùng</span>' : ''}
                        </h4>
                        <p>${acc.email} • Ví: <strong style="color: #10b981;">${(acc.balance || 0).toLocaleString('vi-VN')} đ</strong></p>
                        <p style="font-size: 0.75rem; color: #64748b;">Tạo ngày: ${acc.createdAt}</p>
                    </div>
                </div>
                <div class="acc-item-actions">
                    ${!isCurrent ? `<button type="button" class="acc-btn-mini" onclick="switchAccount(${acc.id})">Đăng nhập</button>` : ''}
                    <button type="button" class="acc-btn-mini danger" onclick="deleteSavedAccount(${acc.id})" title="Xóa tài khoản">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.switchAccount = function(id) {
    const accounts = getSavedAccounts();
    const target = accounts.find(acc => acc.id === id);
    if (!target) return;
    localStorage.setItem('esportsUser', target.username);
    const isTargetAdmin = ['admin', 'adminroot'].includes(target.username.toLowerCase()) || target.role === 'admin';
    if (isTargetAdmin) {
        sessionStorage.setItem('esportsAdminLoggedIn', 'true');
        localStorage.setItem('esportsAdminLoggedIn', 'true');
    } else {
        sessionStorage.removeItem('esportsAdminLoggedIn');
        localStorage.removeItem('esportsAdminLoggedIn');
    }
    updateHeaderAccountState();
    updateAccountPortalUI();
    showEsportsToast(`Đã chuyển sang tài khoản: ${target.username}`);
};

window.logoutCurrentAccount = function() {
    localStorage.removeItem('esportsUser');
    localStorage.removeItem('esportsAdminLoggedIn');
    sessionStorage.removeItem('esportsAdminLoggedIn');
    updateHeaderAccountState();
    updateAccountPortalUI();
    showEsportsToast('Đã đăng xuất tài khoản.');
};

window.deleteSavedAccount = function(id) {
    const accounts = getSavedAccounts();
    const target = accounts.find(acc => acc.id === id);
    if (!target) return;

    const updated = accounts.filter(acc => acc.id !== id);
    setSavedAccounts(updated);

    if (localStorage.getItem('esportsUser') === target.username) {
        localStorage.removeItem('esportsUser');
        localStorage.removeItem('esportsAdminLoggedIn');
        sessionStorage.removeItem('esportsAdminLoggedIn');
    }
    updateHeaderAccountState();
    updateAccountPortalUI();
    showEsportsToast(`Đã xóa tài khoản "${target.username}".`);
};

document.getElementById('clearAllAccountsBtn')?.addEventListener('click', () => {
    localStorage.removeItem('esportsAccounts');
    localStorage.removeItem('esportsUser');
    updateHeaderAccountState();
    updateAccountPortalUI();
    showEsportsToast('Đã xóa tất cả tài khoản đã lưu.');
});

// Theo dõi và ghi nhận lượt truy cập của người dùng cho trang Admin
function trackVisitorAccess() {
    if (window.location.pathname.includes('admin.html')) return;

    const pageMap = {
        'index.html': 'Trang Chủ',
        'news.html': 'Tin Tức Esports',
        'roster.html': 'Đội Tuyển Tuyển Thủ',
        'store.html': 'Cửa Hàng Shop',
        'wiki.html': 'Wiki & Thông Số',
        'tournaments.html': 'Giải Đấu & Video',
        'practice.html': 'Phòng Tập Luyện',
        'downloads.html': 'Tải Game',
        'account.html': 'Cổng Tài Khoản'
    };

    let path = window.location.pathname.split('/').pop() || 'index.html';
    let pageName = pageMap[path] || document.title || 'Trang web';

    // Đếm tổng lượt truy cập
    let visits = parseInt(localStorage.getItem('esportsTotalVisits') || '148', 10) + 1;
    localStorage.setItem('esportsTotalVisits', visits.toString());

    // Nhận diện thiết bị
    const ua = navigator.userAgent;
    let browser = 'Chrome';
    if (ua.includes('CocCoc') || ua.includes('coc_coc')) browser = 'Cốc Cốc';
    else if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

    let os = 'Windows';
    if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('Macintosh')) os = 'macOS';

    const currentUser = localStorage.getItem('esportsUser') || 'Khách vãng lai';

    const entry = {
        id: Date.now(),
        page: pageName,
        path: path,
        user: currentUser,
        device: `${os} • ${browser}`,
        time: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN')
    };

    let logs = JSON.parse(localStorage.getItem('esportsVisitorLogs') || '[]');
    if (logs.length === 0) {
        logs = [
            { id: 1, page: 'Trang Chủ', path: 'index.html', user: 'Khách vãng lai', device: 'Windows • Cốc Cốc', time: '22:05:10 22/11/2026' },
            { id: 2, page: 'Cửa Hàng Shop', path: 'store.html', user: 'FakerVN', device: 'Windows • Chrome', time: '22:12:44 22/11/2026' },
            { id: 3, page: 'Giải Đấu & Video', path: 'tournaments.html', user: 'Khách vãng lai', device: 'iOS • Safari', time: '22:18:02 22/11/2026' }
        ];
    }

    logs.unshift(entry);
    if (logs.length > 80) logs = logs.slice(0, 80);
    localStorage.setItem('esportsVisitorLogs', JSON.stringify(logs));

    // Đẩy nhật ký truy cập lên Cloud Firebase
    if (window.EsportsFirebase && typeof window.EsportsFirebase.pushVisitorLogToCloud === 'function') {
        window.EsportsFirebase.pushVisitorLogToCloud(entry);
    }
}

// Khởi chạy khi load trang
(function initAccountPortal() {
    trackVisitorAccess();
    updateHeaderAccountState();

    if (window.location.pathname.includes('account.html')) {
        updateAccountPortalUI();

        // Đọc query param tab (ví dụ: ?tab=login, ?tab=register, ?tab=wallet, ?tab=charity)
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'login') {
            setAuthPortalMode('login');
        } else if (tabParam === 'register') {
            setAuthPortalMode('register');
        } else if (tabParam) {
            switchAccountTab('tab-' + tabParam);
        } else {
            setAuthPortalMode('register');
        }
    }
})();


// ====================== SECTION 16: LỊCH THI ĐẤU ĐỘNG (DYNAMIC TOURNAMENT SCHEDULE) ======================

function generateTournamentSchedule() {
    const container = document.getElementById('dynamicScheduleContainer');
    const dateLabel = document.getElementById('scheduleCurrentDate');
    if (!container) return;

    const now = new Date();
    const todayStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    if (dateLabel) dateLabel.textContent = todayStr;

    // Game definitions with official tournament URLs
    const games = [
        {
            id: 'lol', name: 'League of Legends', icon: 'fa-chess-knight',
            url: 'https://lolesports.com/vi-VN/',
            subtitle: 'LCK • MSI • CKTG',
            tournaments: ['LCK Cup', 'CKTG 2026', 'LCK Spring', 'MSI 2026', 'LCK Summer'],
            teams: [
                ['T1', 'Gen.G Esports'], ['Dplus KIA', 'Hanwha Life'], ['KT Rolster', 'DRX'],
                ['BNK FearX', 'OKSavingsBank'], ['T1', 'Dplus KIA'], ['Gen.G Esports', 'KT Rolster'],
                ['Hanwha Life', 'BNK FearX'], ['DRX', 'T1'], ['Gen.G Esports', 'Dplus KIA']
            ]
        },
        {
            id: 'ff', name: 'Free Fire', icon: 'fa-crosshairs',
            url: 'https://giaidau.ff.garena.vn/schedule',
            subtitle: 'FFWS • FFPL Vietnam',
            tournaments: ['FFWS 2026', 'FFPL Vietnam', 'FFWS SEA', 'Free Fire Masters'],
            teams: [
                ['V Gaming', 'Burst The Sky'], ['EVOS', 'Attack All Around'], ['Loud', 'INCO Gaming'],
                ['Falcons Esports', 'ECHO'], ['V Gaming', 'EVOS'], ['Burst The Sky', 'Loud'],
                ['INCO Gaming', 'Falcons Esports'], ['ECHO', 'V Gaming']
            ]
        },
        {
            id: 'lq', name: 'Liên Quân Mobile', icon: 'fa-shield-halved',
            url: 'https://lienquan.garena.vn/tin-tuc/giai-dau/',
            subtitle: 'APL • AIC • ĐTDV',
            tournaments: ['APL 2026', 'ĐTDV Mùa Đông', 'AIC 2026', 'AWC 2026'],
            teams: [
                ['Saigon Phantom', 'Buriram United'], ['Team Flash', 'BOX Gaming'],
                ['V Gaming', 'HEAVY'], ['Cerberus Esports', 'Saigon Phantom'],
                ['BOX Gaming', 'V Gaming'], ['Team Flash', 'HEAVY'],
                ['Buriram United', 'Cerberus Esports'], ['Saigon Phantom', 'Team Flash']
            ]
        },
        {
            id: 'valorant', name: 'Valorant', icon: 'fa-crosshairs',
            url: 'https://valorantesports.com/vi-VN/',
            subtitle: 'VCT Masters • VCT Pacific',
            tournaments: ['VCT Masters', 'VCT Pacific', 'VCT Champions', 'VCT Ascension'],
            teams: [
                ['Paper Rex', 'DRX'], ['Sentinels', 'Fnatic'], ['Loud', 'NAVI'],
                ['Gen.G', 'T1'], ['Paper Rex', 'Sentinels'], ['DRX', 'Loud'],
                ['Fnatic', 'Gen.G'], ['NAVI', 'T1']
            ]
        },
        {
            id: 'fco', name: 'FC Online', icon: 'fa-futbol',
            url: 'https://fconline.garena.vn/tin-tuc/giai-dau/',
            subtitle: 'FEC • FVPL Vietnam',
            tournaments: ['FEC 2026', 'FVPL Vietnam', 'FEC SEA', 'FC Masters'],
            teams: [
                ['ProGamer VN', 'FC Elite'], ['VN Star', 'FCB Academy'], ['Thai FC', 'SG United'],
                ['ProGamer VN', 'VN Star'], ['FC Elite', 'Thai FC'], ['FCB Academy', 'SG United'],
                ['VN Star', 'ProGamer VN']
            ]
        }
    ];

    // Use day of year as seed for deterministic daily rotation
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Generate matches for each game
    const allGameSchedules = games.map(game => {
        const matches = [];
        const matchCount = 2 + (dayOfYear % 3); // 2-4 matches per game per day cycle
        const hours = [14, 15, 17, 18, 19, 20, 21];

        for (let i = 0; i < matchCount; i++) {
            const teamIdx = (dayOfYear + i) % game.teams.length;
            const tournIdx = (dayOfYear + i) % game.tournaments.length;
            const hourIdx = (dayOfYear + i + games.indexOf(game)) % hours.length;
            const matchHour = hours[hourIdx];
            const matchMinute = (i % 2 === 0) ? '00' : '30';

            // Determine which day this match is on (some today, some future)
            let matchDate = new Date(now);
            if (i === 0) {
                // First match is today
                matchDate = new Date(now);
            } else if (i === 1) {
                // Second could be today or tomorrow
                matchDate = new Date(now);
                matchDate.setDate(matchDate.getDate() + (i % 2));
            } else {
                matchDate.setDate(matchDate.getDate() + i);
            }

            const isToday = matchDate.toDateString() === now.toDateString();
            const currentHour = now.getHours();
            const isLive = isToday && currentHour >= matchHour && currentHour < matchHour + 2;
            const isPast = isToday && currentHour > matchHour + 2;

            let status, statusClass;
            if (isPast) {
                status = 'Đã kết thúc';
                statusClass = 'finished';
            } else if (isLive) {
                status = 'Đang diễn ra';
                statusClass = 'live';
            } else if (isToday) {
                status = 'Hôm nay';
                statusClass = 'today';
            } else {
                status = 'Sắp diễn ra';
                statusClass = 'upcoming';
            }

            const dateStr = isToday ? 'Hôm nay' : matchDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

            matches.push({
                tournament: game.tournaments[tournIdx],
                team1: game.teams[teamIdx][0],
                team2: game.teams[teamIdx][1],
                time: `${matchHour}:${matchMinute}`,
                date: dateStr,
                status,
                statusClass,
                isToday,
                isLive,
                watchUrl: game.url
            });
        }

        return { game, matches };
    });

    // Render HTML
    let html = '';
    allGameSchedules.forEach(({ game, matches }) => {
        html += `
        <div class="schedule-game-group" data-schedule-game="${game.id}">
            <div class="schedule-group-header">
                <div class="sgh-left">
                    <div class="sgh-icon ${game.id}"><i class="fa-solid ${game.icon}"></i></div>
                    <div>
                        <div class="sgh-title">${game.name}</div>
                        <div class="sgh-subtitle">${game.subtitle}</div>
                    </div>
                </div>
                <a href="${game.url}" target="_blank" class="sgh-link">
                    <i class="fa-solid fa-external-link-alt"></i> Trang chính thức
                </a>
            </div>
            <div class="schedule-match-list">
        `;

        matches.forEach(m => {
            let watchBtn = '';
            if (m.isLive) {
                watchBtn = `<a href="${m.watchUrl}" target="_blank" class="smi-watch-btn live-btn" title="Xem trực tiếp ngay">
                    <i class="fa-solid fa-circle-play"></i> Vào Xem Ngay
                </a>`;
            } else if (m.isToday) {
                watchBtn = `<a href="${m.watchUrl}" target="_blank" class="smi-watch-btn today-btn" title="Trận đấu hôm nay - Vào xem ngay">
                    <i class="fa-solid fa-play"></i> Vào Xem Ngay
                </a>`;
            }

            html += `
                <div class="schedule-match-item ${m.isToday ? 'is-today' : ''} ${m.isLive ? 'is-live' : ''}">
                    <div class="smi-info">
                        <span class="smi-tournament">${m.tournament}</span>
                        <span class="smi-teams">${m.team1} vs ${m.team2}</span>
                    </div>
                    <div class="smi-time-col">
                        <span class="smi-time">${m.time}</span>
                        <span class="smi-date">${m.date}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="smi-status ${m.statusClass}">${m.status}</span>
                        <div class="smi-match-actions">
                            <button type="button" class="smi-action-btn summary-btn" onclick="openMatchSummaryByTeams('${m.team1}', '${m.team2}', '${game.id}', '${m.tournament}')" title="Tóm tắt trận đấu">
                                <i class="fa-solid fa-file-waveform"></i> Tóm tắt
                            </button>
                            <button type="button" class="smi-action-btn lineup-btn" onclick="openMatchLineupByTeams('${m.team1}', '${m.team2}', '${game.id}', '${m.tournament}')" title="Đội hình ra sân">
                                <i class="fa-solid fa-users-viewfinder"></i> Đội hình
                            </button>
                        </div>
                        ${watchBtn}
                    </div>
                </div>
            `;
        });

        html += `
            </div>
        </div>
        `;
    });

    container.innerHTML = html;

    // Schedule filter buttons
    const filterBtns = document.querySelectorAll('#scheduleGameFilter .sgf-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.toggle('active', b === btn));

            document.querySelectorAll('.schedule-game-group').forEach(group => {
                if (filter === 'all') {
                    group.style.display = '';
                } else {
                    group.style.display = group.getAttribute('data-schedule-game') === filter ? '' : 'none';
                }
            });
        });
    });
}

// Tự động khởi tạo lịch thi đấu trên mọi trang có #dynamicScheduleContainer
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamicScheduleContainer')) {
        generateTournamentSchedule();
    }
});
if (document.getElementById('dynamicScheduleContainer')) {
    generateTournamentSchedule();
}

// ==============================================================================
// 17. ĐIỀU KHIỂN TRUNG TÂM CHÍNH SÁCH & HỖ TRỢ KHÁCH HÀNG (POLICY.HTML)
// ==============================================================================
function switchPolicyTab(tabKey) {
    const validTabs = ['size', 'return', 'privacy', 'order', 'inspection', 'payment', 'shipping'];
    const activeTab = validTabs.includes(tabKey) ? tabKey : 'privacy';

    // 1. Cập nhật nút bấm trong Sidebar (đổi hiệu ứng viền neon cyan)
    document.querySelectorAll('.policy-nav-btn').forEach(btn => {
        if (btn.getAttribute('data-policy') === activeTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Cập nhật Panel nội dung
    document.querySelectorAll('.policy-panel').forEach(panel => {
        if (panel.id === `policy-${activeTab}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // 3. Cập nhật URL parameter mà không load lại trang
    if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', activeTab);
        window.history.replaceState({}, '', url.toString());
    }
}

// Hàm mở mục Chính sách hoặc chuyển hướng chính xác đến tab đó
function openPolicyModal(tabKey) {
    const validTabs = ['size', 'return', 'privacy', 'order', 'inspection', 'payment', 'shipping'];
    const target = validTabs.includes(tabKey) ? tabKey : 'privacy';

    if (window.location.pathname.includes('policy.html')) {
        switchPolicyTab(target);
        const targetElement = document.getElementById(`policy-${target}`) || document.querySelector('.policy-content-box');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        window.location.href = `policy.html?tab=${target}`;
    }
}

// Khởi tạo tab khi tải trang policy.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('policy.html')) {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') || 'privacy';
        switchPolicyTab(tab);

        document.querySelectorAll('.policy-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = btn.getAttribute('data-policy');
                switchPolicyTab(targetTab);
            });
        });
    }
});
