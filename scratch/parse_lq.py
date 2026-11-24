import json

with open('scratch/lq_items_parsed.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

for it in items:
    name = it['name'].lower()
    if any(k in name for k in ['trượng', 'sách', 'băng sương', 'tận thế', 'berith', 'gươm', 'thập tự', 'ngọc', 'hỗn mang', 'bùng nổ']):
        print(f"{it['name']}: {it['img']}")
