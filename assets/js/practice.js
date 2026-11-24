/**
 * ESPORTS MOBA PRACTICE ROOM & COMBAT DAMAGE SIMULATOR (PRACTICE.JS)
 * Quản lý 2 Tab MOBA (LMHT & Liên Quân Mobile)
 * Tích hợp toàn bộ trang bị cơ bản chính thức từ Garena Liên Quân Mobile & Riot Games LMHT
 * Fix lỗi hoạt ảnh, hiển thị video preview và hiệu ứng chiến đấu chiêu thức trực quan.
 */

(function () {
    'use strict';

    // ==========================================================
    // 1. KHO TRANG BỊ & NGỌC / PHÙ HIỆU CHUẨN XÁC CHO 2 GAME
    // ==========================================================

    const LOL_ITEMS = [
        // Sát thương Vật Lý (AD)
        { id: 'ie', name: 'Vô Cực Kiếm', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3031.png', category: 'ad', ad: 80, ap: 0, crit: 25, critDmg: 35, cost: 3400, desc: '+80 Sát thương, +25% Chí mạng. Đòn chí mạng gây thêm 35% sát thương.' },
        { id: 'shieldbow', name: 'Nỏ Tử Thủ', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/6673.png', category: 'ad', ad: 50, ap: 0, crit: 20, lifesteal: 7, cost: 3000, desc: '+50 Sát thương, +20% Chí mạng, +7% Hút máu. Tạo lá chắn khi thấp máu.' },
        { id: 'pd', name: 'Ma Vũ Song Kiếm', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3046.png', category: 'ad', ad: 65, ap: 0, crit: 25, as: 35, cost: 2800, desc: '+65 Sát thương, +25% Chí mạng, +35% Tốc đánh, tăng tốc chạy.' },
        { id: 'bt', name: 'Huyết Kiếm', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3072.png', category: 'ad', ad: 80, ap: 0, crit: 0, lifesteal: 15, cost: 3400, desc: '+80 Sát thương, +15% Hút máu. Tăng thêm sát thương khi trên 70% máu.' },
        { id: 'ldr', name: 'Nỏ Thần Dominik', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3036.png', category: 'ad', ad: 40, ap: 0, crit: 25, armorPen: 35, cost: 3000, desc: '+40 Sát thương, +25% Chí mạng, +35% Xuyên giáp mục tiêu.' },
        { id: 'bc', name: 'Rìu Đen', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3071.png', category: 'ad', ad: 55, ap: 0, hp: 400, cdr: 20, cost: 3000, desc: '+55 Sát thương, +400 Máu, +20 Điểm hồi kỹ năng. Bào mòn 24% giáp kẻ địch.' },
        { id: 'triforce', name: 'Tam Hợp Kiếm', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3078.png', category: 'ad', ad: 45, as: 33, hp: 300, cdr: 20, cost: 3333, desc: '+45 AD, +300 Máu, +33% Tốc đánh, +20 Hồi chiêu. Đòn đánh sau chiêu +200% AD.' },
        { id: 'botrk', name: 'Gươm Vua Vô Danh', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3153.png', category: 'ad', ad: 50, as: 25, lifesteal: 10, cost: 3200, desc: '+50 Sát thương, +25% Tốc đánh, +10% Hút máu. Đòn đánh gây 9% máu mục tiêu.' },

        // Sức mạnh Phép Thuật (AP)
        { id: 'rabadon', name: 'Mũ Phù Thủy Rabadon', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3089.png', category: 'ap', ad: 0, ap: 140, bonusApPct: 35, cost: 3600, desc: '+140 Sức mạnh phép thuật. Gia tăng thêm 35% tổng SMPT toàn thân.' },
        { id: 'luden', name: 'Súng Cương Thi Luden', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/6653.png', category: 'ap', ad: 0, ap: 90, magicPen: 10, cdr: 20, cost: 3000, desc: '+90 SMPT, +20 Hồi chiêu, +10 Xuyên kháng phép. Kỹ năng giật tia năng lượng nổ diện rộng.' },
        { id: 'zhonya', name: 'Đồng Hồ Cát Zhonya', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3157.png', category: 'ap', ad: 0, ap: 80, armor: 45, cdr: 15, cost: 3250, desc: '+80 SMPT, +45 Giáp, +15 Hồi chiêu. Hóa vàng bất tử trong 2.5 giây.' },
        { id: 'shadowflame', name: 'Ngọn Lửa Hắc Hóa', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/4645.png', category: 'ap', ad: 0, ap: 110, magicPen: 12, cost: 3200, desc: '+110 SMPT, +12 Xuyên kháng phép. Sát thương phép chí mạng lên kẻ địch dưới 35% máu.' },
        { id: 'void', name: 'Trượng Hư Vô', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3135.png', category: 'ap', ad: 0, ap: 70, magicPenPct: 40, cost: 3000, desc: '+70 SMPT, +40% Xuyên kháng phép mục tiêu.' },
        { id: 'lichbane', name: 'Kiếm Tai Ương', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3100.png', category: 'ap', ad: 0, ap: 100, cdr: 15, cost: 3100, desc: '+100 SMPT, +15 Hồi chiêu. Đòn đánh sau chiêu gây thêm 75% AD + 50% AP phép.' },

        // Phòng Thủ & Máu
        { id: 'thornmail', name: 'Giáp Gai', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3075.png', category: 'def', armor: 70, hp: 350, cost: 2700, desc: '+70 Giáp, +350 Máu. Phản lại sát thương phép và tạo vết thương sâu khi bị đánh.' },
        { id: 'spirit', name: 'Giáp Tâm Linh', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3065.png', category: 'def', mr: 60, hp: 450, cdr: 10, cost: 2900, desc: '+60 Kháng phép, +450 Máu, +10 Hồi chiêu. Tăng 25% toàn bộ hồi máu & tạo lá chắn.' },
        { id: 'frozenheart', name: 'Tim Băng', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3110.png', category: 'def', armor: 70, cdr: 20, cost: 2500, desc: '+70 Giáp, +20 Hồi chiêu. Giảm 20% tốc độ đánh của kẻ địch xung quanh.' },

        // Giày & Tốc độ
        { id: 'berserker', name: 'Giày Cuồng Nộ', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3006.png', category: 'speed', as: 35, cost: 1100, desc: '+35% Tốc đánh, +45 Tốc độ di chuyển.' },
        { id: 'sorcerer', name: 'Giày Pháp Sư', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3020.png', category: 'speed', flatMagicPen: 18, cost: 1100, desc: '+18 Xuyên kháng phép, +45 Tốc độ di chuyển.' },
        { id: 'plated', name: 'Giày Thép Gai', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3047.png', category: 'speed', armor: 20, cost: 1100, desc: '+20 Giáp, giảm 12% sát thương đòn đánh tay nhận vào.' },
        { id: 'mercury', name: 'Giày Thủy Ngân', icon: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/item/3111.png', category: 'speed', mr: 25, cost: 1100, desc: '+25 Kháng phép, +30% Kháng hiệu ứng khống chế.' }
    ];

    const LOL_RUNES = [
        { id: 'electrocute', name: 'Sốc Điện', icon: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png', burstDmg: 200, adScale: 0.25, apScale: 0.15, desc: 'Đánh trúng 3 đòn riêng biệt gây thêm 200 (+25% AD / +15% AP) sát thương thích ứng.' },
        { id: 'conqueror', name: 'Chinh Phục', icon: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png', bonusAD: 35, bonusAP: 55, lifesteal: 8, desc: 'Tích cộng dồn tăng tối đa 35 AD / 55 AP và hồi 8% sát thương gây ra.' },
        { id: 'darkharvest', name: 'Thu Thập Hắc Ám', icon: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png', burstDmg: 160, adScale: 0.2, apScale: 0.1, desc: 'Sát thương lên mục tiêu dưới 50% máu kích nổ 160 sát thương linh hồn kết liễu.' },
        { id: 'lethaltempo', name: 'Nhịp Độ Chết Người', icon: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png', bonusAS: 45, desc: 'Tăng vọt 45% tốc độ đánh và gia tăng tầm đánh khi tấn công tướng liên tục.' },
        { id: 'arcanecomet', name: 'Thiên Thạch Bí Ẩn', icon: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png', burstDmg: 120, apScale: 0.2, desc: 'Tung chiêu phóng một thiên thạch giáng xuống mục tiêu gây sát thương phép.' },
        { id: 'firststrike', name: 'Đòn Phủ Đầu', icon: 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png', bonusDmgPct: 8, desc: 'Khởi đầu giao tranh gây thêm 8% sát thương chuẩn lên mục tiêu trong 3 giây.' }
    ];

    // ==========================================================
    // TOÀN BỘ TRANG BỊ CHÍNH THỨC TỪ GARENA LIÊN QUÂN MOBILE
    // https://lienquan.garena.vn/hoc-vien/trang-bi/
    // ==========================================================

    const LQ_ITEMS = [
        // --- 1. CÔNG VẬT LÝ ---
        { id: 'thanhkiem', name: 'Thánh Kiếm', icon: 'images/lq_items/thanh_kiem.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icon48a62735ee508f6a920e823fafd9b21159eebea8e613f1.png', category: 'ad', ad: 100, ap: 0, crit: 25, critDmg: 50, cost: 2120, desc: '+100 Công vật lý, +25% Tỷ lệ chí mạng. Sát thương chí mạng tăng thêm 50%.' },
        { id: 'nanhfenrir', name: 'Nanh Fenrir', icon: 'images/lq_items/nanh_fenrir.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/7ccbeb5a9d92d6616b38fb9f8a6d697f583eb0099ad9e1.png', category: 'ad', ad: 200, ap: 0, crit: 0, cost: 2950, desc: '+200 Công vật lý. Tăng 30% sát thương lên mục tiêu dưới 50% máu.' },
        { id: 'kiemmuramasa', name: 'Kiếm Muramasa', icon: 'images/lq_items/kiem_muramasa.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icone607457dda37172782dc9180e3cd036a59eebe79887cd1.png', category: 'ad', ad: 75, ap: 0, cdr: 10, armorPenPct: 40, cost: 2020, desc: '+75 Công vật lý, +10% Giảm hồi chiêu, +40% Xuyên giáp mục tiêu.' },
        { id: 'phuchopkiem', name: 'Phức Hợp Kiếm', icon: 'images/lq_items/phuc_hop_kiem.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/2ed0a1b9762b0eaed6ef8c26f69fabb0583eaf5e888731.png', category: 'ad', ad: 70, as: 15, lifesteal: 10, cdr: 10, hp: 400, cost: 2150, desc: '+70 Công vật lý, +15% Tốc đánh, +10% Hút máu, +400 Máu. Đòn đánh sau chiêu +100% AD.' },
        { id: 'thuonglonginus', name: 'Thương Longinus', icon: 'images/lq_items/thuong_longinus.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/e31c3c90f650c04ebdb29ea2ca200265583eacda186ed1.png', category: 'ad', ad: 80, cdr: 15, hp: 500, flatArmorPen: 250, cost: 2060, desc: '+80 Công vật lý, +15% Giảm hồi chiêu, +500 Máu. Phá vỡ 250 giáp của kẻ địch.' },
        { id: 'kiemfafnir', name: 'Kiếm Fafnir', icon: 'images/lq_items/kiem_fafnir.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/96fd7b63339a3f0e510781f375eb356d583ead06b76221.png', category: 'ad', ad: 60, as: 30, lifesteal: 10, cost: 2040, desc: '+60 Công vật lý, +30% Tốc đánh, +10% Hút máu. Đòn đánh gây thêm 8% máu mục tiêu.' },
        { id: 'songdaobaotap', name: 'Song Đao Bão Táp', icon: 'images/lq_items/song_dao_bao_tap.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/42d4233ea5d7ed2db0af6ae09c5686d9583eafd6a6f201.png', category: 'ad', ad: 100, as: 35, crit: 20, cost: 2050, desc: '+100 Công vật lý, +35% Tốc đánh, +20% Chí mạng.' },
        { id: 'quykiem', name: 'Quỷ Kiếm', icon: 'images/lq_items/quy_kiem.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/dac326474d6d7eb4b8f77074edb8b8cf583eaefc61eff1.png', category: 'ad', ad: 100, lifesteal: 25, cost: 1740, desc: '+100 Công vật lý, +25% Hút máu cực khủng.' },
        { id: 'vuothungtan', name: 'Vuốt Hung Tàn', icon: 'images/lq_items/vuot_hung_tan.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/c65bf282a71890970ac6880b773460945965d91139a151.png', category: 'ad', ad: 90, as: 20, crit: 15, cost: 2070, desc: '+90 Công vật lý, +20% Tốc đánh, +15% Chí mạng. Tích tầng tăng 50% tốc đánh.' },
        { id: 'cungtama', name: 'Cung Tà Ma', icon: 'images/lq_items/cung_ta_ma.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/iconcaa38dc0fdd84ce09ed77e83e1cfb2eb5ef414c91c8131.png', category: 'ad', ad: 90, crit: 10, lifesteal: 10, cost: 2200, desc: '+90 Công vật lý, +10% Chí mạng, +10% Hút máu. Kích hoạt tăng 60% hút máu trong 3s.' },
        { id: 'thuongxuyenpha', name: 'Thương Xuyên Phá', icon: 'images/lq_items/thuong_xuyen_pha.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/b3d3556b6bd3eaf5e90b966647b6d8a75976bb54845d91.png', category: 'ad', ad: 110, flatArmorPen: 190, cost: 2020, desc: '+110 Công vật lý, +190 Xuyên giáp, tăng tốc chạy khi rời giao tranh.' },
        { id: 'liemdoatmenh', name: 'Liềm Đoạt Mệnh', icon: 'images/lq_items/liem_doat_menh.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/6e4830c854d7f71dd8ad51b25d9abffd5965d8cb4027d1.png', category: 'ad', ad: 60, cdr: 5, cost: 2000, desc: '+60 Công vật lý, +5% Giảm hồi chiêu. Miễn tử trong 1 giây khi chịu sát thương chí tử.' },
        { id: 'daotruyhon', name: 'Đao Truy Hồn', icon: 'images/lq_items/dao_truy_hon.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icon39afcfcf7b6f28bebbf64b598f7f586b59f0056b0a4811.png', category: 'ad', ad: 100, cdr: 10, hp: 500, cost: 1800, desc: '+100 Công vật lý, +10% Giảm hồi chiêu, +500 Máu. Giảm 50% hồi phục của mục tiêu.' },
        { id: 'guomsamset', name: 'Gươm Sấm Sét', icon: 'images/lq_items/guom_sam_set.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/f2ae054a4509ca5bfbf6c1246d6a0e7d583eaf9d711da1.png', category: 'ad', ad: 50, as: 35, crit: 20, cost: 1780, desc: '+50 Công vật lý, +35% Tốc đánh, +20% Chí mạng. Giật sét 150 (+20% AD) lan mục tiêu.' },
        { id: 'guomuriel', name: 'Gươm Uriel', icon: 'images/lq_items/guom_uriel.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icone8e8d84ac94fa585c3a9661cce80fbf159eebe5b292891.png', category: 'ad', ad: 65, hp: 600, mr: 180, cost: 2020, desc: '+65 Công vật lý, +600 Máu, +180 Giáp phép. Tạo lá chắn phép khi thấp máu.' },
        { id: 'xanhatcung', name: 'Xạ Nhật Cung', icon: 'images/lq_items/xa_nhat_cung.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icon6bc7c27ebfd950b0fe16493db552c983658d55e7787b81.png', category: 'ad', ad: 90, crit: 15, as: 15, cost: 2200, desc: '+90 Công vật lý, +15% Chí mạng. Kích hoạt tăng tầm đánh xa cho xạ thủ.' },
        { id: 'dietthancung', name: 'Diệt Thần Cung', icon: 'images/lq_items/diet_than_cung.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/11/diet-than-cung.png', category: 'ad', ad: 50, as: 30, crit: 10, armorPenPct: 20, cost: 2980, desc: '+50 Công vật lý, +30% Tốc đánh, +10% Chí mạng, +20% Xuyên giáp (gấp đôi với tướng đánh xa).' },
        { id: 'chuybangsuong', name: 'Chùy Băng Sương', icon: 'images/lq_items/chuy_bang_suong.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2025/07/Chuy-bang-suong.png', category: 'ad', ad: 80, hp: 1000, cost: 2080, desc: '+80 Công vật lý, +1000 Máu. Đòn đánh làm chậm 25% tốc chạy của mục tiêu.' },

        // --- 2. PHÉP THUẬT ---
        { id: 'truongbungno', name: 'Trượng Bùng Nổ', icon: 'images/lq_items/truong_bung_no.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/3cdbf8caaf2dc260fd962f5d31c074c5583eb2abdcb021.png', category: 'ap', ad: 0, ap: 240, cost: 2100, desc: '+240 Công phép. Kỹ năng trúng đích gây vụ nổ 100 (+40% công phép).' },
        { id: 'vuongmienhecate', name: 'Vương Miện Hecate', icon: 'images/lq_items/vuong_mien_hecate.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/29845a83cf9ddd3d17e0fcd07aabe61e583eb2e7b1a651.png', category: 'ap', ad: 0, ap: 240, bonusApPct: 35, cost: 2410, desc: '+240 Công phép. Tăng thêm 35% tổng công phép toàn thân.' },
        { id: 'truonghonmang', name: 'Trượng Hỗn Mang', icon: 'images/lq_items/truong_hon_mang.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/iconb1d589bb71a28a6cb2c3f9f5bbb2e5a05976f9dd872e81.png', category: 'ap', ad: 0, ap: 180, cdr: 10, magicPenPct: 40, cost: 2050, desc: '+180 Công phép, +10% Giảm hồi chiêu, +40% Xuyên giáp phép.' },
        { id: 'sachtruyhon', name: 'Sách Truy Hồn', icon: 'images/lq_items/sach_truy_hon.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/c9420fcfd346612dd10cfc7cc3ca9b575965da11b6b361.png', category: 'ap', ad: 0, ap: 240, hp: 500, cdr: 5, cost: 2000, desc: '+240 Công phép, +500 Máu. Giảm 50% khả năng hồi phục của mục tiêu.' },
        { id: 'sachthanh', name: 'Sách Thánh', icon: 'images/lq_items/sach_thanh.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/13b087b42ee35a7138a782d260cff7c9583eb099e321d1.png', category: 'ap', ad: 0, ap: 400, hp: 1400, cost: 2990, desc: '+400 Công phép, +1400 Máu tối đa cực khủng.' },
        { id: 'quacaubangsuong', name: 'Quả Cầu Băng Sương', icon: 'images/lq_items/qua_cau_bang_suong.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/iconf30f58d64f6de018d472a24497b8e8475ef414dc8c8931.png', category: 'ap', ad: 0, ap: 240, hp: 500, cost: 2200, desc: '+240 Công phép, +500 Máu. Bất tử trong 1.5 giây.' },
        { id: 'matnaberith', name: 'Mặt Nạ Berith', icon: 'images/lq_items/mat_na_berith.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/722dfa95e17bc0ae4fca1370b39db24e583eb4a552d901.png', category: 'ap', ad: 0, ap: 140, cdr: 10, armor: 225, cost: 2160, desc: '+140 Công phép, +10% Giảm hồi chiêu, +225 Giáp. Thiêu đốt 4% máu mục tiêu.' },
        { id: 'truongbang', name: 'Trượng Băng', icon: 'images/lq_items/truong_bang.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/18a94ba7877043520ad478e08bc4b0bc583eb43f03b4d1.png', category: 'ap', ad: 0, ap: 140, hp: 850, cost: 1780, desc: '+140 Công phép, +850 Máu. Làm chậm 20% tốc chạy kẻ địch trúng chiêu.' },
        { id: 'thaptukiem', name: 'Thập Tự Kiếm', icon: 'images/lq_items/thap_tu_kiem.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icona69219340114945bffc9ee0648b76df659eebed145bd21.png', category: 'ap', ad: 0, ap: 180, as: 20, cost: 1970, desc: '+180 Công phép, +20% Tốc đánh. Đòn đánh kế gây thêm sát thương phép.' },
        { id: 'quyentruongrhea', name: 'Quyền Trượng Rhea', icon: 'images/lq_items/quyen_truong_rhea.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/2eabc8620f02b21582e3b88ea1f95f40583eb3ad4c2941.png', category: 'ap', ad: 0, ap: 140, cdr: 10, lifesteal: 25, cost: 2220, desc: '+140 Công phép, +10% Giảm hồi chiêu, +25% Hút máu phép. Nhận khiên khi thấp máu.' },
        { id: 'guomtanthe', name: 'Gươm Tận Thế', icon: 'images/lq_items/guom_tan_the.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/fae96e865899f2e3e2cda185b58aee12583eafaae4a281.png', category: 'ap', ad: 0, ap: 160, cdr: 10, cost: 2190, desc: '+160 Công phép, +10% Giảm hồi chiêu. Đòn đánh sau chiêu gây thêm 80% công phép.' },
        { id: 'cauchiemtinh', name: 'Cầu Chiêm Tinh', icon: 'images/lq_items/cau_chiem_tinh.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/11/cau-chiem-tinh.png', category: 'ap', ad: 0, ap: 200, hp: 600, magicPenPct: 20, cost: 2150, desc: '+200 Công phép, +600 Máu, +20% Xuyên giáp phép mục tiêu.' },

        // --- 3. PHÒNG THỦ & MÁU ---
        { id: 'giapgaia', name: 'Giáp Gaia', icon: 'images/lq_items/giap_gaia.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/9f2d442bf8b0f7597bd23de1af9c1ba9583eb6859264b1.png', category: 'def', ad: 0, ap: 0, mr: 240, hp: 1200, cost: 1960, desc: '+240 Giáp phép, +1200 Máu. Hồi 8% máu liên tục khi chịu sát thương.' },
        { id: 'khienhuyenthoai', name: 'Khiên Huyền Thoại', icon: 'images/lq_items/khien_huyen_thoai.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/22878b0202ea24b883044a9c642d5536583eb618cf2971.png', category: 'def', ad: 0, ap: 0, armor: 360, cdr: 20, cost: 2180, desc: '+360 Giáp, +20% Giảm hồi chiêu. Giảm 30% tốc đánh của kẻ địch đánh vào.' },
        { id: 'aochoangbang', name: 'Áo Choàng Băng Giá', icon: 'images/lq_items/ao_choang_bang_gia.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icon55eaf54151e5f99b1442aceb380cb3cf58536633305011.png', category: 'def', ad: 0, ap: 0, armor: 250, hp: 800, cdr: 10, cost: 2020, desc: '+250 Giáp, +800 Máu, +10% Giảm hồi chiêu. Đòn đánh sau chiêu nổ sát thương làm chậm.' },
        { id: 'giaphomenh', name: 'Giáp Hộ Mệnh', icon: 'images/lq_items/giap_ho_menh.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icon6b6c892834f3b9840bec892627dbeedb5b87c72793cd01.png', category: 'def', ad: 0, ap: 0, armor: 120, cost: 2400, desc: '+120 Giáp. Hồi sinh với 2000 máu sau 2 giây khi gục ngã.' },
        { id: 'huanchuongtroy', name: 'Huân Chương Troy', icon: 'images/lq_items/huan_chuong_troy.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/7c7e5cbc16a0a12b0363ffec0dd4bbe0583eb735ebea21.png', category: 'def', ad: 0, ap: 0, mr: 360, hp: 1000, cdr: 10, cost: 2220, desc: '+360 Giáp phép, +1000 Máu, +10% Giảm hồi chiêu. Tạo lớp bảo hộ phép thuật hấp thụ sát thương.' },
        { id: 'giapthongkho', name: 'Giáp Thống Khổ', icon: 'images/lq_items/giap_thong_kho.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/1daf820a0922c35d2b4dfe54082d35f2583eb43c655ad1.png', category: 'def', ad: 0, ap: 0, armor: 300, hp: 1200, cost: 1940, desc: '+300 Giáp, +1200 Máu. Phản lại 15% sát thương vật lý gánh chịu.' },
        { id: 'khienthattruyen', name: 'Khiên Thất Truyền', icon: 'images/lq_items/khien_that_truyen.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/098ae164502918650b6334ce885d7d71583eb5aa4f7e31.png', category: 'def', ad: 0, ap: 0, armor: 275, hp: 1200, cost: 2180, desc: '+275 Giáp, +1200 Máu. Giảm 30% tốc đánh và 15% tốc chạy của kẻ địch ở gần.' },
        { id: 'nhamthuan', name: 'Nham Thuẫn', icon: 'images/lq_items/nham_thuan.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icone5253595746abc893db9abe7568410315ef414f03aac11.png', category: 'def', ad: 0, ap: 0, armor: 240, mr: 240, hp: 1200, cost: 2120, desc: '+240 Giáp, +240 Giáp phép, +1200 Máu. Kích hoạt nhận khiên khổng lồ theo 30% lượng máu tối đa.' },
        { id: 'phuchutruongsinh', name: 'Phù Chú Trường Sinh', icon: 'images/lq_items/phu_chu_truong_sinh.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/icond155d1aa807b4022dd22a16cfa171d5f5853665105cd41.png', category: 'def', ad: 0, ap: 0, hp: 2000, cost: 2220, desc: '+2000 Máu tối đa. Hồi 4% máu mỗi giây khi rời giao tranh.' },
        { id: 'aochoangthanra', name: 'Áo Choàng Thần Ra', icon: 'images/lq_items/ao_choang_than_ra.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/iconc412f57b9e56e33473ff1a7c87f64c3c5c8b6e31b77f71.png', category: 'def', ad: 0, ap: 0, armor: 225, hp: 1000, cost: 1900, desc: '+225 Giáp, +1000 Máu. Thiêu đốt kẻ địch xung quanh 100 (+2% máu) sát thương phép mỗi giây.' },
        { id: 'giapcuongno', name: 'Giáp Cuồng Nộ', icon: 'images/lq_items/giap_cuong_no.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/f1221bb1919f19d0ffd7aa3b9d521248583eb5022028c1.png', category: 'def', ad: 30, armor: 220, hp: 1000, cost: 1950, desc: '+30 Công vật lý, +220 Giáp, +1000 Máu. Tăng 2% sát thương và tốc chạy mỗi khi bị đánh (tối đa 10%).' },

        // --- 4. GIÀY & TỐC ĐỘ ---
        { id: 'giaykiencuong', name: 'Giày Kiên Cường', icon: 'images/lq_items/giay_kien_cuong.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/3a856551539a716067add52f8fc65bc65875f0c7db9e51.png', category: 'speed', mr: 110, cost: 700, desc: '+110 Giáp phép, +60 Tốc chạy, +35% Kháng hiệu ứng khống chế.' },
        { id: 'giayhove', name: 'Giày Hộ Vệ', icon: 'images/lq_items/giay_ho_ve.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/0b2a528cdd009437b1635def58e353675875f09318ffd1.png', category: 'speed', armor: 110, cost: 730, desc: '+110 Giáp, +60 Tốc chạy, giảm 15% sát thương đòn đánh tay nhận vào.' },
        { id: 'giayphuthuy', name: 'Giày Phù Thủy', icon: 'images/lq_items/giay_phu_thuy.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/85bfb0396118e0b32f1e3f4b34911d235875f11c6208c1.png', category: 'speed', flatMagicPen: 75, cost: 790, desc: '+75 Xuyên giáp phép, +60 Tốc chạy.' },
        { id: 'giaythuatsi', name: 'Giày Thuật Sĩ', icon: 'images/lq_items/giay_thuat_si.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/114e22fe9d424beb6fe4aca5c456c5c35875f0f2d82ec1.png', category: 'speed', cdr: 15, cost: 710, desc: '+15% Giảm hồi chiêu, +60 Tốc chạy.' },
        { id: 'giaydumuc', name: 'Giày Du Mục', icon: 'images/lq_items/giay_du_muc.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/3ff001f7078fc0b3f77e9ec7b283e2735875f14d9d0a31.png', category: 'speed', as: 25, cost: 790, desc: '+25% Tốc đánh, +60 Tốc chạy.' },
        { id: 'giayhermes', name: 'Giày Hermes', icon: 'images/lq_items/giay_hermes.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/b86b4a1e5a5c3801f0c11fd76a8cbe0c5875f18bcc5ec1.png', category: 'speed', cost: 790, desc: '+60 Tốc chạy, tăng thêm 60 tốc chạy khi rời khỏi giao tranh.' },

        // --- 5. ĐI RỪNG ---
        { id: 'kiemtruyhon_r', name: 'Kiếm Truy Hồn (Rừng)', icon: 'images/lq_items/kiem_truy_hon_rung.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/962f75587871dfe385b2eed0071fd80f5875efc662a801.png', category: 'jungle', ad: 90, cdr: 15, cost: 1750, desc: '+90 Công vật lý, +15% Giảm hồi chiêu. Tăng sát thương lên quái rừng và tích điểm công.' },
        { id: 'riuleviathan', name: 'Rìu Leviathan (Rừng)', icon: 'images/lq_items/riu_leviathan.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/5cbcea0c03cb8fbcffef6706943b59095875ef42bc1b91.png', category: 'jungle', hp: 750, armor: 150, cost: 1850, desc: '+750 Máu, +150 Giáp. Thiêu đốt quái rừng và kẻ địch ở gần.' },
        { id: 'guomloki', name: 'Gươm Loki (Rừng)', icon: 'images/lq_items/guom_loki.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/e0c0df64d8c799425e512a41035121625875eeb337a461.png', category: 'jungle', ap: 140, cdr: 10, cost: 1780, desc: '+140 Công phép, +10% Giảm hồi chiêu. Đòn đánh sau chiêu cường hóa sát thương phép.' }
    ];

    const LQ_RUNES = [
        { id: 'machu', name: 'Phù hiệu Ma Chú', icon: 'images/lq_items/phu_hieu_ma_chu.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/07/icon-gameplay-badges.png', burstDmg: 320, adScale: 0.3, apScale: 0.25, desc: 'Đánh trúng 3 chiêu/đòn liên tiếp kích nổ ma chú gây 320 (+30% Công) sát thương diện rộng.' },
        { id: 'daukhi', name: 'Phù hiệu Đấu Khí', icon: 'images/lq_items/phu_hieu_dau_khi.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/07/icon-gameplay-runes.png', bonusAD: 50, lifesteal: 10, desc: 'Tích 10 tầng đấu khí khi giao tranh nhận ngay 50 Công vật lý và hồi phục máu.' },
        { id: 'thanguang', name: 'Phù hiệu Thần Quang', icon: 'images/lq_items/phu_hieu_than_quang.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/07/icon-gameplay-items.png', burstDmg: 240, apScale: 0.35, desc: 'Đòn đánh hoặc chiêu đầu tiên giáng sấm sét gây sát thương phép bùng nổ.' },
        { id: 'bangngoc90', name: 'Bảng Ngọc 90 Chuẩn', icon: 'images/lq_items/bang_ngoc_90.png', onlineIcon: 'https://lienquan.garena.vn/wp-content/uploads/2024/05/3cf57bafb768ddec440476a5c58ad2e35dbaa42b575ae1.png', bonusAD: 45, flatArmorPen: 64, crit: 10, desc: 'Full Ngọc Cấp 3: +45 Công vật lý, +64 Xuyên giáp, +10% Chí mạng.' }
    ];

    // ==========================================================
    // 2. STATE HIỆN TẠI CỦA PHÒNG LUYỆN TẬP
    // ==========================================================

    const state = {
        game: 'lol',              // 'lol' hoặc 'lq'
        heroId: 'ahri',           // Mặc định ban đầu
        skillIndex: 0,            // Kỹ năng đang chọn (0: Nội tại, 1: Q, 2: W, 3: E, 4: R)
        equippedItems: [],        // Tối đa 6 trang bị
        selectedRune: null,       // Ngọc / phù hiệu đang chọn
        dummyArmor: 50,           // Giáp bia đỡ đạn
        dummyMR: 40,              // Kháng phép bia đỡ đạn
        catalogFilter: 'all',     // 'all', 'ad', 'ap', 'def', 'speed', 'jungle'
        baseStats: {
            ad: 75,
            ap: 0,
            hp: 1950,
            armor: 55,
            mr: 42,
            as: 0.85,
            crit: 0,
            cdr: 0
        }
    };

    // Biến quản lý vòng lặp vẽ hiệu ứng hoạt ảnh Canvas
    let canvasAnimationId = null;
    let canvasParticles = [];

    // ==========================================================
    // 3. KHỞI TẠO & GẮN SỰ KIỆN GIAO DIỆN
    // ==========================================================

    function initMobaPractice() {
        const lolTabBtn = document.getElementById('tabMobaLol');
        const lqTabBtn = document.getElementById('tabMobaLq');

        if (lolTabBtn) {
            lolTabBtn.addEventListener('click', () => switchGame('lol'));
        }
        if (lqTabBtn) {
            lqTabBtn.addEventListener('click', () => switchGame('lq'));
        }

        // Nút mở modal đổi tướng
        document.getElementById('openHeroPickerBtn')?.addEventListener('click', openHeroPicker);
        document.getElementById('closeHeroPickerBtn')?.addEventListener('click', closeHeroPicker);
        document.getElementById('heroSearchInput')?.addEventListener('input', filterHeroPickerGrid);

        // Nút lọc catalog trang bị
        document.querySelectorAll('.catalog-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.catalog-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.catalogFilter = btn.dataset.filter || 'all';
                renderItemCatalog();
            });
        });

        // Sliders bia đỡ đạn
        const armorRange = document.getElementById('dummyArmorRange');
        const mrRange = document.getElementById('dummyMRRange');
        if (armorRange) {
            armorRange.addEventListener('input', (e) => {
                state.dummyArmor = parseInt(e.target.value) || 0;
                const v = document.getElementById('dummyArmorVal');
                if (v) v.textContent = state.dummyArmor;
                updateStatsAndDamage();
            });
        }
        if (mrRange) {
            mrRange.addEventListener('input', (e) => {
                state.dummyMR = parseInt(e.target.value) || 0;
                const v = document.getElementById('dummyMRVal');
                if (v) v.textContent = state.dummyMR;
                updateStatsAndDamage();
            });
        }

        // Các nút tấn công bia tập
        document.getElementById('btnAttackNormal')?.addEventListener('click', () => executeCombatTest('normal'));
        document.getElementById('btnAttackCrit')?.addEventListener('click', () => executeCombatTest('crit'));
        document.getElementById('btnAttackSkill')?.addEventListener('click', () => executeCombatTest('skill'));
        document.getElementById('btnAttackCombo')?.addEventListener('click', () => executeCombatTest('combo'));

        // Nút reset build đồ
        document.getElementById('resetMobaBuildBtn')?.addEventListener('click', () => {
            state.equippedItems = [];
            renderEquippedSlots();
            updateStatsAndDamage();
        });

        // Bật mặc định LOL
        switchGame('lol');
    }

    // ==========================================================
    // 4. CHUYỂN ĐỔI GAME GIỮA LMHT VÀ LIÊN QUÂN
    // ==========================================================

    function switchGame(gameCode) {
        state.game = gameCode;
        state.equippedItems = [];
        state.catalogFilter = 'all';

        // Reset nút lọc tab catalog
        document.querySelectorAll('.catalog-tab-btn').forEach((b, i) => {
            if (i === 0) b.classList.add('active');
            else b.classList.remove('active');
        });

        const lolTab = document.getElementById('tabMobaLol');
        const lqTab = document.getElementById('tabMobaLq');

        if (gameCode === 'lol') {
            lolTab?.classList.add('active-lol');
            lqTab?.classList.remove('active-lq');
            state.heroId = 'ahri'; // Mặc định Ahri
            state.selectedRune = LOL_RUNES[0];
        } else {
            lqTab?.classList.add('active-lq');
            lolTab?.classList.remove('active-lol');
            state.heroId = 'florentino'; // Mặc định Florentino
            state.selectedRune = LQ_RUNES[0];
        }

        renderHeroProfile();
        renderSkillsShowcase();
        renderRunesSelector();
        renderEquippedSlots();
        renderItemCatalog();
        renderPresetBuilds();
        updateStatsAndDamage();
    }

    // ==========================================================
    // 5. HIỂN THỊ THÔNG TIN VÀ CHIÊU THỨC TƯỚNG & HOẠT ẢNH VIDEO
    // ==========================================================

    function getHeroData(heroId) {
        if (!window.wikiDatabase) return null;
        return window.wikiDatabase[heroId] || null;
    }

    function renderHeroProfile() {
        const hero = getHeroData(state.heroId);
        if (!hero) return;

        const avatarImg = document.getElementById('mobaHeroAvatar');
        const nameElem = document.getElementById('mobaHeroName');
        const subElem = document.getElementById('mobaHeroSubtitle');
        const roleElem = document.getElementById('mobaHeroRole');
        const laneElem = document.getElementById('mobaHeroLane');

        if (avatarImg) avatarImg.src = hero.image || '';
        if (nameElem) nameElem.textContent = hero.name || 'Tướng';
        if (subElem) subElem.textContent = hero.subtitle || '';
        if (roleElem) roleElem.textContent = hero.role || 'Đấu Sĩ';
        if (laneElem) laneElem.textContent = hero.lane || 'Đường Giữa';

        // Base stats tùy theo tướng
        if (hero.role && (hero.role.includes('Pháp Sư') || hero.role.includes('Mage'))) {
            state.baseStats = { ad: 65, ap: 0, hp: 1850, armor: 48, mr: 40, as: 0.72, crit: 0, cdr: 0 };
        } else if (hero.role && (hero.role.includes('Xạ Thủ') || hero.role.includes('Marksman'))) {
            state.baseStats = { ad: 85, ap: 0, hp: 1750, armor: 45, mr: 38, as: 0.95, crit: 0, cdr: 0 };
        } else if (hero.role && (hero.role.includes('Sát Thủ') || hero.role.includes('Assassin'))) {
            state.baseStats = { ad: 95, ap: 0, hp: 1900, armor: 52, mr: 42, as: 0.88, crit: 0, cdr: 0 };
        } else {
            state.baseStats = { ad: 90, ap: 0, hp: 2200, armor: 65, mr: 50, as: 0.82, crit: 0, cdr: 0 };
        }
    }

    function renderSkillsShowcase() {
        const hero = getHeroData(state.heroId);
        if (!hero || !Array.isArray(hero.abilities) || hero.abilities.length === 0) return;

        const navContainer = document.getElementById('skillIconsNav');
        if (!navContainer) return;

        navContainer.innerHTML = '';
        state.skillIndex = Math.min(state.skillIndex, hero.abilities.length - 1);

        hero.abilities.forEach((ab, idx) => {
            const btn = document.createElement('button');
            btn.className = `skill-btn ${idx === state.skillIndex ? 'active' : ''}`;
            btn.setAttribute('type', 'button');

            let keyLabel = 'Nội tại';
            if (state.game === 'lol') {
                const keys = ['NỘI TẠI', 'Q', 'W', 'E', 'R'];
                keyLabel = keys[idx] || `CHIÊU ${idx}`;
            } else {
                const keys = ['NỘI TẠI', 'CHIÊU 1', 'CHIÊU 2', 'CHIÊU 3'];
                keyLabel = keys[idx] || `CHIÊU ${idx}`;
            }

            btn.innerHTML = `
                <div class="skill-icon-frame">
                    <img src="${ab.icon || ''}" alt="${ab.name || ''}" onerror="this.onerror=null; this.src='https://via.placeholder.com/60/0a1428/00f0ff?text=Skill';">
                </div>
                <span class="skill-key-badge">${keyLabel}</span>
            `;

            btn.addEventListener('click', () => {
                state.skillIndex = idx;
                document.querySelectorAll('.skill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateActiveSkillDetail();
            });

            navContainer.appendChild(btn);
        });

        updateActiveSkillDetail();
    }

    function updateActiveSkillDetail() {
        const hero = getHeroData(state.heroId);
        if (!hero || !hero.abilities || !hero.abilities[state.skillIndex]) return;

        const ab = hero.abilities[state.skillIndex];
        const videoElement = document.getElementById('skillVideoPlayer');
        const placeholder = document.getElementById('skillVideoPlaceholder');
        const canvas = document.getElementById('skillBattleCanvas');

        // Gắn video preview (các clip mp4 từ Riot Games của LMHT)
        if (ab.videoMp4 && ab.videoMp4.trim() !== '') {
            stopBattleCanvasAnimation();
            if (canvas) canvas.style.display = 'none';
            if (placeholder) placeholder.style.display = 'none';
            if (videoElement) {
                videoElement.style.display = 'block';
                videoElement.src = ab.videoMp4;
                videoElement.poster = ab.thumb || hero.image || '';
                videoElement.load();
                videoElement.play().catch(() => {});
            }
        } else {
            // Đối với tướng không có sẵn video mp4 (như Liên Quân):
            // Khởi chạy hoạt ảnh chiến đấu Canvas 60FPS sống động
            if (videoElement) {
                videoElement.style.display = 'none';
                videoElement.pause();
            }
            if (placeholder) {
                placeholder.style.display = 'flex';
                placeholder.innerHTML = `
                    <div style="background-image: url('${hero.image}'); background-size: cover; background-position: center; width: 100%; height: 100%; position: absolute; opacity: 0.35; filter: blur(2px);"></div>
                    <div style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <img src="${ab.icon || ''}" style="width: 76px; height: 76px; border-radius: 14px; border: 2px solid #00f0ff; box-shadow: 0 0 25px rgba(0,240,255,0.7); animation: pulseGlow 2s infinite ease-in-out;" alt="" onerror="this.src='images/lienquan_icon.png'">
                        <h4 style="color: #fff; margin: 0; font-size: 1.35rem; font-weight: 800; letter-spacing: 1px; text-shadow: 0 0 10px #00f0ff;">${ab.name || ''}</h4>
                        <span style="color: #00f0ff; font-size: 0.88rem; font-weight: 700; background: rgba(0,240,255,0.15); border: 1px solid rgba(0,240,255,0.4); padding: 4px 14px; border-radius: 20px;">
                            <i class="fa-solid fa-bolt"></i> Hiệu Ứng Chiến Đấu Chiêu Thức
                        </span>
                    </div>
                `;
            }
            startBattleCanvasAnimation();
        }

        // Tên chiêu và mô tả
        const nameElem = document.getElementById('skillDetailName');
        const typeElem = document.getElementById('skillDetailType');
        const descElem = document.getElementById('skillDetailDesc');

        let keyText = state.game === 'lol' ? ['NỘI TẠI', 'KỸ NĂNG PHÍM Q', 'KỸ NĂNG PHÍM W', 'KỸ NĂNG PHÍM E', 'CHIÊU CUỐI PHÍM R'][state.skillIndex] || 'KỸ NĂNG'
                                           : ['NỘI TẠI', 'CHIÊU 1', 'CHIÊU 2', 'CHIÊU 3 (ULTI)'][state.skillIndex] || 'KỸ NĂNG';

        if (nameElem) nameElem.textContent = ab.name || 'Kỹ Năng';
        if (typeElem) typeElem.textContent = keyText;
        if (descElem) descElem.textContent = ab.desc || 'Chưa có thông tin mô tả chiêu thức.';

        updateSkillDamagePill();
    }

    // ==========================================================
    // HOẠT ẢNH CHIẾN ĐẤU CANVAS CHO KỸ NĂNG
    // ==========================================================

    function startBattleCanvasAnimation() {
        const canvas = document.getElementById('skillBattleCanvas');
        if (!canvas) return;
        canvas.style.display = 'block';

        const wrapper = canvas.parentElement;
        canvas.width = wrapper.clientWidth || 500;
        canvas.height = wrapper.clientHeight || 280;

        const ctx = canvas.getContext('2d');
        canvasParticles = [];

        // Khởi tạo các hạt năng lượng lơ lửng
        for (let i = 0; i < 35; i++) {
            canvasParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 0.5,
                color: state.game === 'lq' ? (Math.random() > 0.5 ? '#ff4757' : '#ffa502') : '#00f0ff',
                alpha: Math.random() * 0.7 + 0.3
            });
        }

        if (canvasAnimationId) cancelAnimationFrame(canvasAnimationId);

        let pulseTick = 0;
        function loop() {
            pulseTick += 0.05;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vòng sóng năng lượng lan tỏa
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const ringRadius = 55 + Math.sin(pulseTick) * 12;

            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = state.game === 'lq' ? 'rgba(255, 71, 87, 0.45)' : 'rgba(0, 240, 255, 0.45)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Vẽ các hạt năng lượng chuyển động
            canvasParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            });

            canvasAnimationId = requestAnimationFrame(loop);
        }
        loop();
    }

    function stopBattleCanvasAnimation() {
        if (canvasAnimationId) {
            cancelAnimationFrame(canvasAnimationId);
            canvasAnimationId = null;
        }
    }

    function triggerSkillFlashEffect() {
        const wrapper = document.querySelector('.skill-video-wrapper');
        if (wrapper) {
            wrapper.classList.remove('skill-cast-pulse');
            void wrapper.offsetWidth;
            wrapper.classList.add('skill-cast-pulse');
        }
    }

    function calculateCurrentSkillDamage() {
        const stats = computeCurrentStats();
        const hero = getHeroData(state.heroId);
        const isMage = hero?.role?.includes('Pháp Sư') || hero?.role?.includes('Mage');

        let baseDmg = 120 + state.skillIndex * 90;
        let scaleDmg = 0;
        let dmgType = 'magic';

        if (state.skillIndex === 0) {
            baseDmg = 60;
            scaleDmg = isMage ? stats.totalAP * 0.25 : stats.totalAD * 0.3;
            dmgType = isMage ? 'magic' : 'phys';
        } else if (state.skillIndex === 4 || (state.game === 'lq' && state.skillIndex === 3)) {
            baseDmg = 380;
            scaleDmg = isMage ? stats.totalAP * 0.95 : stats.totalAD * 1.35;
            dmgType = isMage ? 'magic' : 'phys';
        } else {
            scaleDmg = isMage ? stats.totalAP * 0.75 : stats.totalAD * 0.9;
            dmgType = isMage ? 'magic' : 'phys';
        }

        const rawTotal = Math.round(baseDmg + scaleDmg);
        return {
            baseDmg,
            scaleDmg: Math.round(scaleDmg),
            rawTotal,
            dmgType
        };
    }

    function updateSkillDamagePill() {
        const dmgInfo = calculateCurrentSkillDamage();
        const pill = document.getElementById('skillDamageScalePill');
        if (!pill) return;

        const typeColor = dmgInfo.dmgType === 'magic' ? '#38bdf8' : '#ef4444';
        const typeName = dmgInfo.dmgType === 'magic' ? 'Phép' : 'Vật Lý';

        pill.innerHTML = `
            <span><i class="fa-solid fa-calculator" style="color: #00f0ff;"></i> Sát thương dự tính:</span>
            <strong style="color: ${typeColor};" class="damage-scale-val">${dmgInfo.rawTotal.toLocaleString('vi-VN')} ST ${typeName}</strong>
            <span style="font-size: 0.78rem; color: #94a3b8;">(${dmgInfo.baseDmg} Cơ bản + ${dmgInfo.scaleDmg} từ Đồ)</span>
        `;
    }

    // ==========================================================
    // 6. RENDER LẮP TRANG BỊ & NGỌC / PHÙ HIỆU (AN TOÀN TUYỆT ĐỐI)
    // ==========================================================

    function getItemsList() {
        return state.game === 'lol' ? LOL_ITEMS : LQ_ITEMS;
    }

    function getRunesList() {
        return state.game === 'lol' ? LOL_RUNES : LQ_RUNES;
    }

    function renderEquippedSlots() {
        const grid = document.getElementById('itemSlotsGrid');
        if (!grid) return;

        grid.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const item = state.equippedItems[i];
            const slot = document.createElement('div');
            slot.className = `item-slot ${item ? 'filled' : ''}`;
            slot.title = item ? `${item.name}\n${item.desc}` : `Ô trang bị ${i + 1} (Trống)`;

            if (item) {
                const local = item.icon || '';
                const online = item.onlineIcon || local;
                slot.innerHTML = `
                    <img src="${local}" alt="${item.name}" onerror="if(this.src!=='${online}'){this.src='${online}';}else{this.style.display='none';this.nextElementSibling.style.display='flex';}">
                    <div class="item-img-fallback">${item.name.substring(0, 4)}</div>
                    <button type="button" class="slot-remove-btn" title="Tháo trang bị"><i class="fa-solid fa-xmark"></i></button>
                `;
                slot.querySelector('.slot-remove-btn')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    unequipItem(i);
                });
            } else {
                slot.innerHTML = `<span class="slot-placeholder"><i class="fa-solid fa-plus"></i></span>`;
            }

            grid.appendChild(slot);
        }
    }

    function equipItem(item) {
        if (state.equippedItems.length >= 6) {
            alert('Bạn đã lắp đủ 6 trang bị tối đa! Hãy click vào ô đồ để tháo bớt một món trước.');
            return;
        }
        state.equippedItems.push(item);
        renderEquippedSlots();
        updateStatsAndDamage();
    }

    function unequipItem(slotIndex) {
        state.equippedItems.splice(slotIndex, 1);
        renderEquippedSlots();
        updateStatsAndDamage();
    }

    function renderItemCatalog() {
        const catalogGrid = document.getElementById('itemsGridCatalog');
        if (!catalogGrid) return;

        catalogGrid.innerHTML = '';
        const items = getItemsList();
        const filtered = items.filter(it => {
            if (state.catalogFilter === 'all') return true;
            return it.category === state.catalogFilter;
        });

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'catalog-item-card';
            card.title = `${item.name} (${item.cost} Vàng)\n${item.desc}`;
            
            const local = item.icon || '';
            const online = item.onlineIcon || local;

            card.innerHTML = `
                <div style="position: relative; width: 44px; height: 44px; margin-bottom: 6px;">
                    <img src="${local}" alt="${item.name}" style="width: 100%; height: 100%; border-radius: 6px; object-fit: cover;" onerror="if(this.src!=='${online}'){this.src='${online}';}else{this.style.display='none';this.nextElementSibling.style.display='flex';}">
                    <div class="item-img-fallback">${item.name.substring(0, 3)}</div>
                </div>
                <span class="catalog-item-name">${item.name}</span>
                <span class="catalog-item-stats">${item.cost} Vàng</span>
            `;
            card.addEventListener('click', () => equipItem(item));
            catalogGrid.appendChild(card);
        });
    }

    function renderRunesSelector() {
        const runesList = getRunesList();
        const container = document.getElementById('runesListContainer');
        if (!container) return;

        container.innerHTML = '';
        runesList.forEach(rune => {
            const chip = document.createElement('div');
            chip.className = `rune-chip ${state.selectedRune?.id === rune.id ? 'active' : ''}`;
            chip.title = rune.desc;

            const local = rune.icon || '';
            const online = rune.onlineIcon || local;

            chip.innerHTML = `
                <img src="${local}" alt="${rune.name}" onerror="if(this.src!=='${online}'){this.src='${online}';}else{this.style.display='none';this.nextElementSibling.style.display='inline-block';}">
                <i class="fa-solid fa-gem" style="display:none; color:#00f0ff;"></i>
                <span>${rune.name}</span>
            `;
            chip.addEventListener('click', () => {
                state.selectedRune = rune;
                document.querySelectorAll('.rune-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                updateStatsAndDamage();
            });
            container.appendChild(chip);
        });
    }

    function renderPresetBuilds() {
        const presetContainer = document.getElementById('quickPresetsRow');
        if (!presetContainer) return;

        presetContainer.innerHTML = `
            <span style="font-size: 0.8rem; color: #94a3b8; align-self: center;">Build Gợi Ý:</span>
            <button type="button" class="btn-preset" data-preset="burst">🔥 Dồn Sát Thương</button>
            <button type="button" class="btn-preset" data-preset="crit">⚡ Xạ Thủ Chí Mạng</button>
            <button type="button" class="btn-preset" data-preset="fighter">🛡️ Đấu Sĩ Bền Bỉ</button>
        `;

        presetContainer.querySelectorAll('.btn-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.preset;
                applyPresetBuild(type);
            });
        });
    }

    function applyPresetBuild(type) {
        const items = getItemsList();
        state.equippedItems = [];

        if (state.game === 'lol') {
            if (type === 'burst') {
                const ids = ['luden', 'shadowflame', 'rabadon', 'void', 'zhonya', 'lichbane'];
                ids.forEach(id => { const it = items.find(x => x.id === id); if (it) state.equippedItems.push(it); });
            } else if (type === 'crit') {
                const ids = ['ie', 'shieldbow', 'pd', 'ldr', 'bt', 'botrk'];
                ids.forEach(id => { const it = items.find(x => x.id === id); if (it) state.equippedItems.push(it); });
            } else {
                const ids = ['triforce', 'bc', 'thornmail', 'spirit', 'botrk', 'plated'];
                ids.forEach(id => { const it = items.find(x => x.id === id); if (it) state.equippedItems.push(it); });
            }
        } else {
            if (type === 'burst') {
                const ids = ['truongbungno', 'vuongmienhecate', 'truonghonmang', 'sachtruyhon', 'sachthanh', 'quacaubangsuong'];
                ids.forEach(id => { const it = items.find(x => x.id === id); if (it) state.equippedItems.push(it); });
            } else if (type === 'crit') {
                const ids = ['thanhkiem', 'songdaobaotap', 'kiemmuramasa', 'nanhfenrir', 'kiemfafnir', 'phuchopkiem'];
                ids.forEach(id => { const it = items.find(x => x.id === id); if (it) state.equippedItems.push(it); });
            } else {
                const ids = ['phuchopkiem', 'thuonglonginus', 'giapgaia', 'aochoangbang', 'khienhuyenthoai', 'giaphomenh'];
                ids.forEach(id => { const it = items.find(x => x.id === id); if (it) state.equippedItems.push(it); });
            }
        }

        renderEquippedSlots();
        updateStatsAndDamage();
    }

    // ==========================================================
    // 7. TÍNH TOÁN TOÀN BỘ CHỈ SỐ & SÁT THƯƠNG THỰC TẾ
    // ==========================================================

    function computeCurrentStats() {
        let totalAD = state.baseStats.ad;
        let rawAP = state.baseStats.ap;
        let bonusApPct = 0;
        let totalHP = state.baseStats.hp;
        let totalArmor = state.baseStats.armor;
        let totalMR = state.baseStats.mr;
        let totalCrit = state.baseStats.crit;
        let critDmg = 200;
        let totalCDR = state.baseStats.cdr;
        let totalLifesteal = 0;
        let armorPenPct = 0;
        let flatArmorPen = 0;
        let magicPenPct = 0;
        let flatMagicPen = 0;
        let totalCost = 0;

        state.equippedItems.forEach(it => {
            if (it.ad) totalAD += it.ad;
            if (it.ap) rawAP += it.ap;
            if (it.bonusApPct) bonusApPct += it.bonusApPct;
            if (it.hp) totalHP += it.hp;
            if (it.armor) totalArmor += it.armor;
            if (it.mr) totalMR += it.mr;
            if (it.crit) totalCrit += it.crit;
            if (it.critDmg) critDmg += it.critDmg;
            if (it.cdr) totalCDR += it.cdr;
            if (it.lifesteal) totalLifesteal += it.lifesteal;
            if (it.armorPen) armorPenPct += it.armorPen;
            if (it.armorPenPct) armorPenPct += it.armorPenPct;
            if (it.flatArmorPen) flatArmorPen += it.flatArmorPen;
            if (it.magicPen) flatMagicPen += it.magicPen;
            if (it.flatMagicPen) flatMagicPen += it.flatMagicPen;
            if (it.magicPenPct) magicPenPct += it.magicPenPct;
            if (it.cost) totalCost += it.cost;
        });

        if (state.selectedRune) {
            const r = state.selectedRune;
            if (r.bonusAD) totalAD += r.bonusAD;
            if (r.bonusAP) rawAP += r.bonusAP;
            if (r.lifesteal) totalLifesteal += r.lifesteal;
            if (r.flatArmorPen) flatArmorPen += r.flatArmorPen;
            if (r.crit) totalCrit += r.crit;
        }

        const totalAP = Math.round(rawAP * (1 + bonusApPct / 100));
        totalCrit = Math.min(100, totalCrit);
        totalCDR = Math.min(40, totalCDR);

        return {
            totalAD: Math.round(totalAD),
            totalAP,
            totalHP,
            totalArmor,
            totalMR,
            totalCrit,
            critDmg,
            totalCDR,
            totalLifesteal,
            armorPenPct,
            flatArmorPen,
            magicPenPct,
            flatMagicPen,
            totalCost
        };
    }

    function calculateTargetDamage(rawDmg, dmgType, stats) {
        let effDef = 0;
        if (dmgType === 'phys') {
            const penPct = Math.min(80, stats.armorPenPct) / 100;
            effDef = Math.max(0, state.dummyArmor * (1 - penPct) - stats.flatArmorPen);
        } else if (dmgType === 'magic') {
            const penPct = Math.min(80, stats.magicPenPct) / 100;
            effDef = Math.max(0, state.dummyMR * (1 - penPct) - stats.flatMagicPen);
        } else {
            return rawDmg;
        }

        const reduction = effDef / (100 + effDef);
        const actualDmg = rawDmg * (1 - reduction);
        return Math.max(1, Math.round(actualDmg));
    }

    function updateStatsAndDamage() {
        const stats = computeCurrentStats();

        const elTotalAD = document.getElementById('statTotalAD');
        const elTotalAP = document.getElementById('statTotalAP');
        const elTotalHP = document.getElementById('statTotalHP');
        const elTotalArmor = document.getElementById('statTotalArmor');
        const elTotalMR = document.getElementById('statTotalMR');
        const elTotalCrit = document.getElementById('statTotalCrit');
        const elTotalCDR = document.getElementById('statTotalCDR');
        const elTotalCost = document.getElementById('statTotalCost');

        if (elTotalAD) elTotalAD.textContent = stats.totalAD;
        if (elTotalAP) elTotalAP.textContent = stats.totalAP;
        if (elTotalHP) elTotalHP.textContent = stats.totalHP;
        if (elTotalArmor) elTotalArmor.textContent = stats.totalArmor;
        if (elTotalMR) elTotalMR.textContent = stats.totalMR;
        if (elTotalCrit) elTotalCrit.textContent = stats.totalCrit + '%';
        if (elTotalCDR) elTotalCDR.textContent = stats.totalCDR + '%';
        if (elTotalCost) elTotalCost.textContent = stats.totalCost.toLocaleString('vi-VN') + ' Vàng';

        const rawNormal = stats.totalAD;
        const actualNormal = calculateTargetDamage(rawNormal, 'phys', stats);

        const rawCrit = Math.round(stats.totalAD * (stats.critDmg / 100));
        const actualCrit = calculateTargetDamage(rawCrit, 'phys', stats);

        const skillInfo = calculateCurrentSkillDamage();
        const actualSkill = calculateTargetDamage(skillInfo.rawTotal, skillInfo.dmgType, stats);

        let comboRaw = 0;
        const hero = getHeroData(state.heroId);
        const isMage = hero?.role?.includes('Pháp Sư') || hero?.role?.includes('Mage');

        if (isMage) {
            comboRaw = (350 + stats.totalAP * 0.95) + (260 + stats.totalAP * 0.75) + (220 + stats.totalAP * 0.6) + stats.totalAD * 1.5;
        } else {
            comboRaw = (450 + stats.totalAD * 1.4) + (320 + stats.totalAD * 1.0) + (280 + stats.totalAD * 0.8) + actualCrit + actualNormal;
        }
        if (state.selectedRune?.burstDmg) {
            comboRaw += state.selectedRune.burstDmg;
        }

        const actualCombo = calculateTargetDamage(Math.round(comboRaw), isMage ? 'magic' : 'phys', stats);

        const elDmgNormal = document.getElementById('dmgMetricNormal');
        const elDmgCrit = document.getElementById('dmgMetricCrit');
        const elDmgSkill = document.getElementById('dmgMetricSkill');
        const elDmgCombo = document.getElementById('dmgMetricCombo');

        if (elDmgNormal) elDmgNormal.textContent = actualNormal.toLocaleString('vi-VN');
        if (elDmgCrit) elDmgCrit.textContent = actualCrit.toLocaleString('vi-VN');
        if (elDmgSkill) elDmgSkill.textContent = actualSkill.toLocaleString('vi-VN');
        if (elDmgCombo) elDmgCombo.textContent = actualCombo.toLocaleString('vi-VN');

        updateSkillDamagePill();
    }

    // ==========================================================
    // 8. SIMULATOR TẤN CÔNG BIA ĐỠ ĐẠN (FLOATING DAMAGE NUMBERS)
    // ==========================================================

    function executeCombatTest(type) {
        const stats = computeCurrentStats();
        const dummy = document.getElementById('combatDummyFigure');
        const arena = document.getElementById('combatDummyArena');
        if (!dummy || !arena) return;

        // Kích hoạt hoạt ảnh chớp sáng chiêu thức
        triggerSkillFlashEffect();

        // Rung giật bia đỡ đạn
        dummy.classList.remove('hit');
        void dummy.offsetWidth;
        dummy.classList.add('hit');

        let amount = 0;
        let dmgClass = 'phys';
        let label = '';

        if (type === 'normal') {
            amount = calculateTargetDamage(stats.totalAD, 'phys', stats);
            dmgClass = 'phys';
            label = `${amount}`;
        } else if (type === 'crit') {
            const rawCrit = Math.round(stats.totalAD * (stats.critDmg / 100));
            amount = calculateTargetDamage(rawCrit, 'phys', stats);
            dmgClass = 'crit';
            label = `💥 CHÍ MẠNG! ${amount.toLocaleString('vi-VN')}`;
        } else if (type === 'skill') {
            const skillInfo = calculateCurrentSkillDamage();
            amount = calculateTargetDamage(skillInfo.rawTotal, skillInfo.dmgType, stats);
            dmgClass = skillInfo.dmgType;
            label = `✨ ${amount.toLocaleString('vi-VN')}`;
        } else if (type === 'combo') {
            executeMultiHitComboSequence();
            return;
        }

        spawnFloatingDamage(label, dmgClass);
    }

    function executeMultiHitComboSequence() {
        const hits = [
            { type: 'skill', delay: 0 },
            { type: 'normal', delay: 200 },
            { type: 'skill', delay: 450 },
            { type: 'crit', delay: 700 }
        ];

        hits.forEach(h => {
            setTimeout(() => {
                executeCombatTest(h.type);
            }, h.delay);
        });
    }

    function spawnFloatingDamage(text, styleClass) {
        const arena = document.getElementById('combatDummyArena');
        if (!arena) return;

        const floatElem = document.createElement('div');
        floatElem.className = `floating-damage ${styleClass}`;
        floatElem.textContent = text;

        const randomX = (Math.random() - 0.5) * 120;
        const randomY = -40 + (Math.random() - 0.5) * 30;

        floatElem.style.left = `calc(50% + ${randomX}px)`;
        floatElem.style.top = `calc(50% + ${randomY}px)`;

        arena.appendChild(floatElem);

        setTimeout(() => {
            floatElem.remove();
        }, 900);
    }

    // ==========================================================
    // 9. MODAL CHỌN VÀ TÌM KIẾM TƯỚNG (CHAMPION PICKER)
    // ==========================================================

    function openHeroPicker() {
        const modal = document.getElementById('heroPickerModal');
        if (!modal) return;
        modal.classList.add('open');
        renderHeroPickerGrid();
    }

    function closeHeroPicker() {
        document.getElementById('heroPickerModal')?.classList.remove('open');
    }

    function renderHeroPickerGrid() {
        const grid = document.getElementById('pickerHeroGrid');
        if (!grid || !window.wikiDatabase) return;

        grid.innerHTML = '';
        const searchVal = (document.getElementById('heroSearchInput')?.value || '').toLowerCase().trim();

        Object.keys(window.wikiDatabase).forEach(key => {
            const h = window.wikiDatabase[key];
            if (!h || h.type !== 'champion') return;
            if (h.game !== state.game) return;

            if (searchVal && !h.name.toLowerCase().includes(searchVal)) {
                return;
            }

            const item = document.createElement('div');
            item.className = 'picker-hero-item';
            item.innerHTML = `
                <img src="${h.image || ''}" alt="${h.name}" onerror="this.src='images/lienquan_icon.png'">
                <div class="picker-hero-name">${h.name}</div>
                <div class="picker-hero-role">${h.role || ''}</div>
            `;

            item.addEventListener('click', () => {
                state.heroId = h.id || key;
                closeHeroPicker();
                renderHeroProfile();
                renderSkillsShowcase();
                updateStatsAndDamage();
            });

            grid.appendChild(item);
        });
    }

    function filterHeroPickerGrid() {
        renderHeroPickerGrid();
    }

    // ==========================================================
    // 10. TỰ ĐỘNG KHỞI CHẠY KHI TẢI TRANG
    // ==========================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobaPractice);
    } else {
        initMobaPractice();
    }

    window.initMobaPractice = initMobaPractice;

})();
