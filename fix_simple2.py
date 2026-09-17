import sys
import re

def fix_file(content):
    # First, let's identify the sections array and faq array positions
    lines = content.split('\n')
    
    # Step 1: Remove extra comma lines (lines that are exactly whitespace + '},')
    # But only if they appear in the sections array context
    new_lines = []
    for line in lines:
        if re.match(r'^\s*},$', line):
            continue
        new_lines.append(line)
    
    lines = new_lines
    
    # Step 2: Add missing '},' between section objects
    # Pattern: a line ending with "'," (end of paragraphs/bullets array) 
    # followed by a line starting with whitespace and "{"
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        # Check if this line ends with "'," (apostrophe, bracket, comma)
        if re.search(r"'\],\s*$", line):
            if i + 1 < len(lines):
                next_line = lines[i+1]
                if re.match(r'^\s*\{', next_line):
                    # Insert a line after current line with same indentation and "},"
                    indent = line[:len(line) - len(line.lstrip())]
                    new_lines.append(indent + '},')
        i += 1
    
    lines = new_lines
    
    # Step 3: Fix the faq array - find the closing of sections array and add "faq:" before the faq array
    # The sections array ends with "]," and then the next non-empty line starts with "{"
    # Actually, after our fix, the sections array should end with "]," and then we have the faq array starting with "{"
    # We need to insert "faq:" before that "{"
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        # Check if this line ends with "]," (closing of sections array)
        if line.rstrip().endswith('],'):
            # Look ahead for the next non-empty line
            j = i + 1
            while j < len(lines) and lines[j].strip() == '':
                new_lines.append(lines[j])
                j += 1
            if j < len(lines):
                next_line = lines[j]
                # If the next non-empty line starts with "{", we need to insert "faq:" before it
                if next_line.lstrip().startswith('{'):
                    indent = next_line[:len(next_line) - len(next_line.lstrip())]
                    # Replace the next line
                    lines[j] = indent + 'faq: ' + next_line.lstrip()
                    # We'll add it in the next iteration
        i += 1
    
    # Actually we modified lines in place, so we need to re-read lines
    # Let's just rejoin and do the faq fix with regex
    content = '\n'.join(lines)
    
    # Step 4: Fix faq array with regex (more reliable)
    # Pattern: "]," followed by newline, whitespace, "{"
    # Replace with "]," + newline + whitespace + "faq: {"
    content = re.sub(r'(\s*]),\n(\s*)\{', r'\1,\n\2faq: {', content)
    
    # Step 5: Fix the "},," double comma
    content = content.replace('},,', '},')
    
    # Step 6: Fix literal backslash-n in the Additional Details section
    # The Additional Details section has literal backslash-n characters in the text
    # We need to replace them with actual newlines
    # But we should only do this in the Additional Details section to avoid breaking em-dashes
    # The Additional Details section is identified by "Additional Details"
    # We'll find the Additional Details section and replace backslash-n there
    # Pattern: paragraphs: [ ... "text with \\n" ... ]
    # We'll do a targeted replacement: find the Additional Details section and replace \\n with \n
    # First, find the Additional Details section
    start = content.find('Additional Details')
    if start != -1:
        # Find the paragraphs array for this section
        # Look for "paragraphs: [" after the Additional Details
        para_start = content.find('paragraphs: [', start)
        if para_start != -1:
            # Find the matching closing bracket for this array
            bracket_count = 0
            i = para_start + len('paragraphs: [')
            while i < len(content):
                ch = content[i]
                if ch == '[':
                    bracket_count += 1
                elif ch == ']':
                    bracket_count -= 1
                    if bracket_count == 0:
                        para_end = i
                        break
                i += 1
            else:
                para_end = len(content)
            # Replace backslash-n with newline in this range
            before = content[:para_start]
            middle = content[para_start:para_end]
            after = content[para_end:]
            middle = middle.replace('\\\\n', '\n')
            content = before + middle + after
    
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