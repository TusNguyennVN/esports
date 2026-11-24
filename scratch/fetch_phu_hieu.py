import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
req = urllib.request.Request('https://lienquan.garena.vn/hoc-vien/phu-hieu/', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, context=ctx, timeout=8).read().decode('utf-8')

# find all img tags, background-images, or data
all_imgs = re.findall(r'src=["']([^"']+)["']', html)
print("all src:", len(all_imgs))
for s in all_imgs:
    if 'upload' in s or 'phu-hieu' in s or 'badge' in s:
        print(" ", s)

# look for Ma Chú, Đấu Khí, Thần Quang
for name in ['Ma chú', 'Đấu khí', 'Thần quang', 'Ma Chú', 'Đấu Khí', 'Thần Quang']:
    pos = html.find(name)
    if pos != -1:
        print(f"Found {name}:", html[pos-50:pos+150])
