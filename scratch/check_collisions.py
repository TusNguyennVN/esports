import re

with open('assets/js/admin.js', 'r', encoding='utf-8') as f:
    admin_content = f.read()

with open('assets/js/script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

admin_consts = set(re.findall(r'^(?:const|let|var)\s+([a-zA-Z0-9_]+)', admin_content, re.MULTILINE))
script_consts = set(re.findall(r'^(?:const|let|var)\s+([a-zA-Z0-9_]+)', script_content, re.MULTILINE))

collisions = admin_consts.intersection(script_consts)
print('Colliding identifiers:', collisions)
