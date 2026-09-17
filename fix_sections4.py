import sys
import re

def fix_sections(content):
    # Step 1: Remove extra comma lines (lines that are only whitespace and '},')
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if re.match(r'^\s*},$', line):
            # Skip this line
            continue
        new_lines.append(line)
    content = '\n'.join(new_lines)
    lines = content.split('\n')
    
    # Step 2: Insert missing '},' lines between array endings and next section
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line looks like the end of an array (whitespace, then ']', optional comma, then whitespace)
        if re.match(r'^\s*\](?:,)?\s*$', line):
            # Check if there is a next line and it starts with whitespace and then '{'
            if i + 1 < len(lines):
                next_line = lines[i+1]
                if re.match(r'^\s*\{', next_line):
                    # We need to insert a line after the current line that has the same indentation and contains '},'
                    indent = line[:len(line) - len(line.lstrip())]  # leading whitespace
                    # Insert the line: indent + '},'
                    lines.insert(i+1, indent + '},')
                    # We have added a line, so we need to skip over it in the next iteration
                    i += 1  # because we will increment i again below
        i += 1
    return '\n'.join(lines)

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_sections4.py <file.ts>")
        sys.exit(1)
    filepath = sys.argv[1]
    with open(filepath, 'r') as f:
        content = f.read()
    fixed = fix_sections(content)
    with open(filepath, 'w') as f:
        f.write(fixed)
    print(f"Fixed {filepath}")

if __name__ == '__main__':
    main()