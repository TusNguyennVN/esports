with open('assets/js/data/wiki-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('florentino: {')
end = text.find('nakroth: {', start)
lines = text[start:end].split('\n')
for line in lines:
    if any(k in line for k in ['abilities', 'skills', 'spells', 'videoMp4', 'thumb', 'icon', 'desc']):
        print(line[:120])
