import sys
import re

def fix_file(content):
    # Step 1: Replace literal backslash-n with actual newline
    content = content.replace('\\\\n', '\n')
    # Step 2: Fix double comma after Additional Details section
    # We look for '},,' and replace with '},'
    content = content.replace('},,', '},')
    # Step 3: Ensure there is a 'faq:' before the faq array
    # Pattern: after the sections array we have '],' then newline and spaces then '{' (starting faq array)
    # We need to insert 'faq:' before that '{'
    # We'll find the pattern: '\\],\\s*\\n\\s*{' and replace with '\\],\\n\\s*faq: {'
    # But we need to keep the indentation.
    # We'll do a line-based approach.
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        # Look for line that ends with '],' (possible with trailing spaces)
        if line.rstrip().endswith('],'):
            # Check next line exists and starts with spaces and then '{'
            if i + 1 < len(lines):
                next_line = lines[i+1]
                stripped_next = next_line.lstrip()
                if stripped_next.startswith('{'):
                    # We need to insert 'faq:' before the '{'
                    # Keep the indentation of the next line
                    indent = next_line[:len(next_line) - len(next_line.lstrip())]
                    # Replace the next line with indent + 'faq: ' + the rest after the leading '{'? Actually we want to keep the '{' after 'faq: '
                    # So we set next_line = indent + 'faq: ' + stripped_next
                    lines[i+1] = indent + 'faq: ' + stripped_next
                    # Note: we do not skip i because we will increment below
        i += 1
    return '\n'.join(lines)

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_independent.py <file.ts>")
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
