import urllib.request, ssl, re

ctx = ssl._create_unverified_context()
req2 = urllib.request.Request('https://lienquan.garena.vn/hoc-vien/bang-ngoc/', headers={'User-Agent': 'Mozilla/5.0'})
html2 = urllib.request.urlopen(req2, context=ctx, timeout=8).read().decode('utf-8')
imgs2 = re.findall(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\']', html2)

for src, alt in imgs2:
    if 'III' in alt:
        print(f'{alt}: {src}')
