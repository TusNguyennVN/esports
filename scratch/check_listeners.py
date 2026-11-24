with open('assets/js/script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines, 1):
    if '.addEventListener(' in line:
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('*'):
            continue
        # Check if has ?. or document.addEventListener or window.addEventListener
        if '?.' in line or 'document.addEventListener' in line or 'window.addEventListener' in line:
            continue
        # Look backwards up to 3 lines to see if there is an if check
        has_if = False
        for back in range(1, 4):
            prev = lines[idx - 1 - back].strip()
            if prev.startswith('if (') or prev.startswith('if('):
                has_if = True
                break
        if not has_if:
            print(f'Line {idx}: {stripped}')
