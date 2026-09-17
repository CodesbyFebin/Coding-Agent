import sys
import re

def fix_file(content):
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        # Pattern 1: line ends with "'," (apostrophe, bracket, comma) and next line starts with whitespace and '{'
        if re.search(r"'\],\s*$", line):
            if i + 1 < len(lines):
                next_line = lines[i+1]
                if re.match(r'^\s*\{', next_line):
                    # Insert a line after current line with same indentation and "},"
                    indent = line[:len(line) - len(line.lstrip())]
                    lines.insert(i+1, indent + '},')
                    i += 1  # skip over inserted line
        # Pattern 2: line is exactly whitespace + "{," (opening brace with comma)
        if re.match(r'^\s*\{\s*,\s*$', line):
            # Remove the trailing comma
            line = line.rstrip()
            if line.endswith(','):
                line = line[:-1]
            lines[i] = line
        i += 1
    return '\n'.join(lines)

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_sections6.py <file.ts>")
        sys.exit(1)
    filepath = sys.argv[1]
    with open(filepath, 'r') as f:
        content = f.read()
    fixed = fix_file(content)
    with open(filepath, 'w') as f:
        f.write(fixed)
    print(f"Fixed {filepath}")

if __name__ == '__main__':
    main()
