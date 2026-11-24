with open('assets/js/admin.js', 'r', encoding='utf-8') as f:
    admin_content = f.read()

with open('assets/js/script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

import re
funcs_in_script = set(re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', script_content))
funcs_in_admin = set(re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', admin_content))

shared = set()
for func in funcs_in_script:
    if func not in funcs_in_admin and re.search(r'\b' + func + r'\b', admin_content):
        shared.add(func)

print('Functions from script.js called in admin.js:', shared)
