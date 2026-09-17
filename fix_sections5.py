import sys
import re

def fix_file(content):
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        # Match line that ends with "'," (single quote, bracket, comma) and optional whitespace after?
        # Actually we want to capture the line that ends with "']," (apostrophe, bracket, comma)
        # and maybe whitespace after the comma? Usually no whitespace after comma before newline.
        # We'll use regex: r"^(\s*)'\]\,?\s*$" but we need to ensure we have the comma.
        # We'll match if the line, after stripping, ends with "'," and the next line starts with whitespace and "{"
        stripped = line.strip()
        if stripped.endswith("',") and "'" in stripped and stripped.index("'") < len(stripped)-2 and stripped.strip().endswith("',"):
            # Check next line
            if i + 1 < len(lines):
                next_line = lines[i+1]
                if next_line.lstrip().startswith('{'):
                    # We found the pattern.
                    # Remove the trailing comma from the current line.
                    # The line may have whitespace after the comma? We'll keep the whitespace before the quote.
                    # We want to keep everything up to and including the apostrophe and bracket, but remove the comma.
                    # Actually the line ends with "'," so we can remove the last character.
                    if line.endswith(','):
                        line = line[:-1]  # remove the trailing comma
                    # Now insert a new line after this line with same indentation and "},"
                    indent = line[:len(line) - len(line.lstrip())]
                    lines.insert(i+1, indent + '},')
                    # We have inserted a line, so we need to skip over it in the next iteration.
                    i += 1  # because we will increment i again below
        i += 1
    return '\n'.join(lines)

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_sections5.py <file.ts>")
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