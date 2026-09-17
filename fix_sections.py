import sys
import re

def fix_sections(content):
    # Find the sections array: sections: [
    # We'll find the start index of 'sections: ['
    sections_start = content.find('sections: [')
    if sections_start == -1:
        return content
    # Find the matching closing bracket for the sections array
    bracket_count = 1
    i = sections_start + len('sections: [')
    while i < len(content) and bracket_count > 0:
        ch = content[i]
        if ch == '[':
            bracket_count += 1
        elif ch == ']':
            bracket_count -= 1
        i += 1
    if bracket_count != 0:
        # Could not find matching bracket
        return content
    sections_end = i  # index after the closing ']'
    # Extract the sections array content (including the brackets)
    sections_array = content[sections_start:sections_end]
    # Now we need to fix the internal structure: ensure elements are separated by commas
    # We'll split by '},' (closing brace of an element followed by comma) but careful about nested braces.
    # Since we know the structure is simple (no nested arrays/objects inside sections except paragraphs and bullets which are arrays),
    # we can do a simpler fix: ensure that each section object ends with '},' except the last which ends with '}'
    # We'll replace the sections array with a corrected version by parsing it as JSON? Not exactly because of trailing commas and missing quotes.
    # Instead, we'll just fix the two specific issues we know: extra comma lines and missing commas between sections.
    # We'll do a line-by-line fix within the sections array.
    lines = sections_array.split('\n')
    # Find the lines that are section objects.
    # We'll look for lines that start with whitespace and then '{' (the start of a section)
    # and lines that end with '},' or '}'.
    # We'll build a new list of lines.
    new_lines = []
    for line in lines:
        stripped = line.strip()
        # If line is empty or just whitespace, keep as is.
        if not stripped:
            new_lines.append(line)
            continue
        # If line is exactly '},' (whitespace + '},') then it's an extra comma line; we skip it.
        if stripped == '},':
            # Skip this line (do not add)
            continue
        # If line ends with '},' (i.e., stripped ends with '},') then it's a section end with comma; keep.
        # If line ends with '}' (stripped ends with '}') and not '},' then we need to add a comma unless it's the last element.
        # We'll decide later.
        new_lines.append(line)
    # Now we have new_lines without extra comma lines.
    # We need to ensure that between section objects there is a comma.
    # We'll join the lines back and then use regex to add missing commas.
    sections_array_fixed = '\n'.join(new_lines)
    # Pattern: a line that ends with '}' (with possible whitespace) followed by a newline and then whitespace and '{'
    # We want to insert a comma after the '}'.
    # We'll do: replace '}\n' with '},\n' when followed by whitespace and '{'
    sections_array_fixed = re.sub(r'(\s+)\}\n(\s+\{)', r'\1},\n\2', sections_array_fixed)
    # Also ensure that the last section element before the closing ']' does not have a trailing comma.
    # We'll remove a trailing comma before the closing ']' if present.
    sections_array_fixed = re.sub(r',\s*\]', r']', sections_array_fixed)
    # Replace the original sections array with the fixed one.
    new_content = content[:sections_start] + sections_array_fixed + content[sections_end:]
    return new_content

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_sections.py <file.ts>")
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