import urllib.request
import ssl
import json
import os

ctx = ssl._create_unverified_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://teamflash.gg/'
}

data = json.load(open('scratch/teamflash_raw.json', encoding='utf-8'))
os.makedirs('images/products', exist_ok=True)

downloaded = {}
for p in data['products']:
    handle = p['handle']
    images = p.get('images', [])
    downloaded[handle] = []
    for idx, img in enumerate(images[:2]):  # download up to 2 images per product
        src = img['src']
        ext = os.path.splitext(src.split('?')[0])[-1] or '.jpg'
        filename = f"{handle}_{idx+1}{ext}"
        filepath = os.path.join('images/products', filename)
        print(f"Downloading {src} -> {filepath}...")
        try:
            req = urllib.request.Request(src, headers=headers)
            with urllib.request.urlopen(req, timeout=15, context=ctx) as res:
                content = res.read()
                with open(filepath, 'wb') as f:
                    f.write(content)
                downloaded[handle].append(filename)
                print(f"  OK ({len(content)} bytes)")
        except Exception as e:
            print(f"  Error downloading {src}: {e}")

with open('scratch/downloaded_images.json', 'w', encoding='utf-8') as f:
    json.dump(downloaded, f, ensure_ascii=False, indent=2)

print("Finished downloading teamflash images!")
