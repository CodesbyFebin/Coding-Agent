import sys
filepath = sys.argv[1]
with open(filepath, 'r') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    print(f'{i+1:3}: {repr(line.rstrip())}')