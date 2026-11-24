import urllib.request
import urllib.parse
import ssl
import json
import re
import os

ctx = ssl._create_unverified_context()

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
}

url_candidates = [
    'https://teamflash.gg/products.json?limit=250',
    'https://teamflash.gg/collections/all/products.json?limit=250',
    'https://teamflash.gg/collections/all.json',
    'https://teamflash.gg/collections/all',
]

result = {"products": []}

for url in url_candidates:
    print(f"Trying {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15, context=ctx) as res:
            content_type = res.headers.get('Content-Type', '')
            raw_data = res.read().decode('utf-8', errors='ignore')
            print(f"Status: {res.status}, Type: {content_type}, Length: {len(raw_data)}")
            
            if 'application/json' in content_type or url.endswith('.json') or 'products.json' in url:
                try:
                    data = json.loads(raw_data)
                    prods = data.get('products') or (data.get('collection', {}).get('products') if isinstance(data, dict) else None)
                    if prods and len(prods) > 0:
                        print(f"Successfully retrieved {len(prods)} products via JSON API!")
                        result["products"] = prods
                        result["source"] = url
                        break
                except Exception as e:
                    print("JSON parse error:", e)
            else:
                with open('scratch/teamflash_all.html', 'w', encoding='utf-8') as hf:
                    hf.write(raw_data)
                print(f"Saved scratch/teamflash_all.html ({len(raw_data)} chars).")
                result["source"] = url
                result["html_saved"] = True
                break
    except Exception as e:
        print(f"Error fetching {url}: {e}")

with open('scratch/teamflash_raw.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Finished!")
