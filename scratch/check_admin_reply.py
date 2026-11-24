import json

with open(r'C:\Users\tu240\.gemini\antigravity\brain\9d7b49db-1a86-478d-8543-b8d62f41064c\.system_generated\logs\transcript.jsonl', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') in range(680, 700):
            print(f"Step {data.get('step_index')} [{data.get('type')}]:")
            if data.get('content'):
                print(data.get('content')[:500])
                print("-" * 40)
