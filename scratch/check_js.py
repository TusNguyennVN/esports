with open('assets/js/admin.js', 'r', encoding='utf-8') as f:
    content = f.read()

stack = []
pairs = {')': '(', ']': '[', '}': '{'}
in_string = None
escape = False
in_comment = False
in_multiline_comment = False

line_num = 1
col_num = 0
errors = []

i = 0
n = len(content)
while i < n:
    c = content[i]
    col_num += 1
    if c == '\n':
        line_num += 1
        col_num = 0

    if in_comment:
        if c == '\n':
            in_comment = False
        i += 1
        continue

    if in_multiline_comment:
        if c == '*' and i + 1 < n and content[i+1] == '/':
            in_multiline_comment = False
            i += 2
            continue
        i += 1
        continue

    if in_string:
        if escape:
            escape = False
        elif c == '\\':
            escape = True
        elif c == in_string:
            in_string = None
        i += 1
        continue

    if c == '/' and i + 1 < n:
        if content[i+1] == '/':
            in_comment = True
            i += 2
            continue
        elif content[i+1] == '*':
            in_multiline_comment = True
            i += 2
            continue

    if c in ('"', "'", '`'):
        in_string = c
        i += 1
        continue

    if c in '({[':
        stack.append((c, line_num, col_num))
    elif c in ')}]':
        if not stack:
            errors.append(f'Unexpected {c} at line {line_num}:{col_num}')
        else:
            top, l, col = stack.pop()
            if pairs[c] != top:
                errors.append(f'Mismatched {c} at line {line_num}:{col_num}, expected closing for {top} from line {l}:{col}')
    i += 1

if stack:
    for top, l, col in stack[-5:]:
        errors.append(f'Unclosed {top} from line {l}:{col}')

print('ADMIN.JS ERRORS count:', len(errors))
for e in errors[:10]:
    print(e)
