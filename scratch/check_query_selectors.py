import re

for filename in ['assets/js/script.js', 'assets/js/admin.js']:
    lines = open(filename, encoding='utf-8').readlines()
    unsafe = []
    for i, l in enumerate(lines):
        m = re.search(r'document\.querySelector\([\'"]([^\'"]+)[\'"]\)\.addEventListener', l)
        if m:
            unsafe.append((i + 1, m.group(1), l.strip()))
    print(f"File {filename}: {len(unsafe)} direct querySelector.addEventListener")
    for line_no, el_id, code in unsafe:
        print(f"  Line {line_no} [{el_id}]: {code[:70]}")
