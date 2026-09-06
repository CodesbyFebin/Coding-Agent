import re

SRC = '/Users/cyberteck/.zcode/tmp/paste-attachments/2026-09-06/pasted-text-20260906-121240-fc3df71a.txt'
TARGETS = {
    'agentic-engineering': 'agentic-engineering.ts',
    'task-graphs': 'task-graphs.ts',
    'agent-state-machines': 'agent-state-machines.ts',
    'parallel-subagents': 'parallel-subagents.ts',
    'human-approval-gates': 'human-approval-gates.ts',
}

src = open(SRC, encoding='utf-8').read()

for slug, fname in TARGETS.items():
    marker = '// Add to ' + slug
    objs = []
    pos = 0
    while True:
        i = src.find(marker, pos)
        if i < 0:
            break
        fb = src.find('```typescript', i)
        if fb < 0:
            break
        bstart = src.find('\n', fb) + 1
        bend = src.find('```', bstart)
        block = src[bstart:bend].strip()
        pos = bend + 3
        block = re.sub(r'^//[^\n]*\n', '', block)
        block = block.strip()
        if block.startswith('{'):
            objs.append(block)
    joined = ',\n'.join(objs)
    path = 'src/content/editorials/' + fname
    s = open(path, encoding='utf-8').read()
    m = '  ],\n  "faq": ['
    assert m in s, path
    s = s.replace(m, ',\n' + joined + '\n  ],\n  "faq": [', 1)
    open(path, 'w', encoding='utf-8').write(s)
    print(slug, 'sections added:', len(objs))
