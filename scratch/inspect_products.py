import json

data = json.load(open('scratch/teamflash_raw.json', encoding='utf-8'))
for i, p in enumerate(data['products']):
    print(f"\n=== {i+1}. {p['title']} ===")
    print("Handle:", p.get('handle'))
    print("Options:", [(o['name'], o['values']) for o in p.get('options', [])])
    variants = p.get('variants', [])
    if variants:
        min_p = min(float(v.get('price', 0)) for v in variants)
        max_p = max(float(v.get('price', 0)) for v in variants)
        print(f"Price range: {min_p:,.0f} - {max_p:,.0f} đ")
        for v in variants:
            print(f"  - {v.get('title')}: {float(v.get('price', 0)):,.0f} đ (available: {v.get('available')})")
    print("Images count:", len(p.get('images', [])))
    for img in p.get('images', [])[:2]:
        print("  Img:", img.get('src'))
