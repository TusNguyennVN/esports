import re

lines = open('assets/js/script.js', encoding='utf-8').readlines()
unsafe = []
for i, l in enumerate(lines):
    m = re.search(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)\.addEventListener', l)
    if m:
        unsafe.append((i + 1, m.group(1), l.strip()))

print(f"Found {len(unsafe)} direct document.getElementById(...).addEventListener in script.js:")
for line_no, el_id, code in unsafe:
    print(f"  Line {line_no} [{el_id}]: {code[:70]}")
