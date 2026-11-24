import os, json, urllib.request, ssl

ctx = ssl._create_unverified_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

out_dir = os.path.join('images', 'lq_items')
os.makedirs(out_dir, exist_ok=True)

with open('scratch/lq_items_parsed.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Map desired slug to item name in lq_items_parsed.json
wanted = {
    # Công (Vật lý)
    'thanh_kiem': 'Thánh kiếm',
    'nanh_fenrir': 'Nanh Fenrir',
    'kiem_muramasa': 'Kiếm Muramasa',
    'phuc_hop_kiem': 'Phức hợp kiếm',
    'thuong_longinus': 'Thương Longinus',
    'kiem_fafnir': 'Kiếm Fafnir',
    'song_dao_bao_tap': 'Song đao bão táp',
    'quy_kiem': 'Quỷ Kiếm',
    'vuot_hung_tan': 'Vuốt Hung Tàn',
    'cung_ta_ma': 'Cung tà ma',
    'thuong_xuyen_pha': 'Thương Xuyên Phá',
    'liem_doat_menh': 'Liềm Đoạt Mệnh',
    'dao_truy_hon': 'Đao Truy Hồn',
    'guom_sam_set': 'Gươm sấm sét',
    'guom_uriel': 'Gươm Uriel',
    'xa_nhat_cung': 'Xạ Nhật Cung',
    'diet_than_cung': 'Diệt thần cung',
    'chuy_bang_suong': 'Chùy băng sương',

    # Phép
    'vuong_mien_hecate': 'Vương miện Hecate',
    'truong_bung_no': 'Trượng bùng nổ',
    'truong_hon_mang': 'Trượng hỗn mang',
    'sach_truy_hon': 'Sách Truy Hồn',
    'sach_thanh': 'Sách thánh',
    'qua_cau_bang_suong': 'Quả cầu băng sương',
    'mat_na_berith': 'Mặt nạ Berith',
    'truong_bang': 'Trượng băng',
    'thap_tu_kiem': 'Thập Tự Kiếm',
    'quyen_truong_rhea': 'Quyền trượng Rhea',
    'guom_tan_the': 'Gươm tận thế',
    'cau_chiem_tinh': 'Cầu chiêm tinh',

    # Thủ
    'giap_gaia': 'Giáp Gaia',
    'khien_huyen_thoai': 'Khiên huyền thoại',
    'ao_choang_bang_gia': 'Áo choàng băng giá',
    'giap_ho_menh': 'Giáp hộ mệnh',
    'huan_chuong_troy': 'Huân chương Troy',
    'giap_thong_kho': 'Giáp thống khổ',
    'khien_that_truyen': 'Khiên thất truyền',
    'nham_thuan': 'Nham thuẫn',
    'phu_chu_truong_sinh': 'Phù chú trường sinh',
    'ao_choang_than_ra': 'Áo choàng thần Ra',
    'giap_cuong_no': 'Giáp cuồng nộ',

    # Tốc độ / Giày
    'giay_kien_cuong': 'Giày kiên cường',
    'giay_ho_ve': 'Giày hộ vệ',
    'giay_phu_thuy': 'Giày phù thủy',
    'giay_thuat_si': 'Giày thuật sĩ',
    'giay_du_muc': 'Giày du mục',
    'giay_hermes': 'Giày Hermes',

    # Đi rừng
    'kiem_truy_hon_rung': 'Kiếm truy hồn',
    'riu_leviathan': 'Rìu Leviathan',
    'guom_loki': 'Gươm Loki'
}

# Also rune urls from bang-ngoc
runes_wanted = {
    'ngoc_do_iii': 'https://lienquan.garena.vn/wp-content/uploads/2024/05/3cf57bafb768ddec440476a5c58ad2e35dbaa42b575ae1.png',
    'ngoc_tim_iii': 'https://lienquan.garena.vn/wp-content/uploads/2024/05/40af8a62234d3cd119663d62b21816e15dbaa5eda06491.png',
    'ngoc_xanh_iii': 'https://lienquan.garena.vn/wp-content/uploads/2024/05/6da9d4a9710dd6767b2fb01946b034aa5dbaa92a495731.png',
    'phu_hieu_ma_chu': 'https://lienquan.garena.vn/wp-content/uploads/2024/07/icon-gameplay-badges.png',
    'phu_hieu_dau_khi': 'https://lienquan.garena.vn/wp-content/uploads/2024/07/icon-gameplay-runes.png',
    'phu_hieu_than_quang': 'https://lienquan.garena.vn/wp-content/uploads/2024/07/icon-gameplay-items.png',
    'bang_ngoc_90': 'https://lienquan.garena.vn/wp-content/uploads/2024/05/3cf57bafb768ddec440476a5c58ad2e35dbaa42b575ae1.png'
}

downloaded = 0
for slug, item_name in wanted.items():
    matched = next((x for x in items if x['name'].lower() == item_name.lower()), None)
    if not matched:
        print(f'Not found: {item_name}')
        continue
    url = matched['img']
    ext = os.path.splitext(url.split('?')[0])[1] or '.png'
    file_path = os.path.join(out_dir, f'{slug}{ext}')
    try:
        req = urllib.request.Request(url, headers=headers)
        data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
        with open(file_path, 'wb') as f_out:
            f_out.write(data)
        downloaded += 1
        print(f'Downloaded: {slug} ({len(data)} bytes)')
    except Exception as e:
        print(f'Failed {slug} ({url}): {e}')

for slug, url in runes_wanted.items():
    file_path = os.path.join(out_dir, f'{slug}.png')
    try:
        req = urllib.request.Request(url, headers=headers)
        data = urllib.request.urlopen(req, context=ctx, timeout=8).read()
        with open(file_path, 'wb') as f_out:
            f_out.write(data)
        downloaded += 1
        print(f'Downloaded rune: {slug} ({len(data)} bytes)')
    except Exception as e:
        print(f'Failed rune {slug}: {e}')

print(f'\nTotal downloaded: {downloaded}')
