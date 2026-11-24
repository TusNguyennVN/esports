import re

with open('assets/js/practice.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

with open('practice.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

ids_in_js = set(re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", js_text))
ids_in_html = set(re.findall(r'id=["\']([^"\']+)["\']', html_text))

missing = []
for id_name in sorted(ids_in_js):
    if id_name not in ids_in_html:
        missing.append(id_name)

print('IDs in practice.js:', len(ids_in_js))
print('Missing IDs in practice.html:', missing)
