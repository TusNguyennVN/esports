import re
import os

html = open('store.html', encoding='utf-8').read()
imgs = re.findall(r'src=["\'](images/products/[^"\']+)["\']', html)
print(f"Total product images in store.html: {len(imgs)}")
for img in sorted(set(imgs)):
    exists = os.path.exists(img)
    sz = os.path.getsize(img) if exists else 0
    print(f"  {img} -> Exists: {exists} ({sz:,} bytes)")
