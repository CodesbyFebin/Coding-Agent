import sys
import re

def fix_file(content):
    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # 1. Remove extra comma lines (lines that are exactly whitespace + '},')
        if re.match(r'^\s*},$', line):
            i += 1
            continue
        
        # 2. Fix literal backslash-n
        if '\\\\n' in line:
            line = line.replace('\\\\n', '\n')
        
        # 3. Check if this line ends with "'," (end of paragraphs/bullets array) 
        # and the next line starts with whitespace and "{"
        if re.search(r"'\],\s*$", line):
            if i + 1 < len(lines):
                next_line = lines[i+1]
                if re.match(r'^\s*\{', next_line):
                    # Insert a line after current line with same indentation and "},"
                    indent = line[:len(line) - len(line.lstrip())]
                    new_lines.append(line)  # current line without trailing comma (but it has comma already)
                    new_lines.append(indent + '},')
                    i += 1  # skip the next line? No, we want to process it next iteration
                    # Actually we don't increment i here because we want the next iteration to process next_line
                    # But we already added current line, so we should increment i to skip the current line (already done by loop)
                    # Wait, we need to not add the next_line now, it will be added in next iteration.
                    pass
            # If no match, we just add the line normally below
        
        new_lines.append(line)
        i += 1
    
    content = '\n'.join(new_lines)
    
    # 4. Fix the faq array - add "faq:" before the opening brace of the faq array
    # Look for pattern: "],\n    {" (closing sections array, then faq array start)
    # We'll do a regex replacement
    content = re.sub(r'(\s*]),\n(\s*)\{', r'\1,\n\2faq: {', content)
    
    # 5. Fix the "},," double comma
    content = content.replace('},,', '},')
    
    return content

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_simple.py <file.ts>")
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