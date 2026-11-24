with open('assets/js/data/news-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line for k in ['image:', 'fallbackImage:', 'title:']):
        print(f'{i+1}: {line.strip()}')
