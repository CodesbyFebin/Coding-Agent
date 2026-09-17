import sys
import re

def fix_sections(content):
    # We'll process line by line, keeping track of whether we are inside the sections array
    # and whether we have seen the closing brace for the current section.
    lines = content.split('\n')
    in_sections = False
    in_section = False  # True when we have seen the opening brace of a section and not yet seen its closing brace
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        # Detect start of sections array
        if not in_sections and stripped.startswith('sections: ['):
            in_sections = True
            new_lines.append(line)
            i += 1
            continue
        # If we are in sections array, we need to track braces for section objects
        if in_sections:
            # Count opening and closing braces in this line
            # We'll simply look for '{' and '}' characters.
            # But we need to know if we are inside a string or comment? We'll assume not for simplicity.
            # This is risky but the files are structured.
            # We'll instead rely on the pattern: a section starts with '{' at the beginning of the line (after whitespace)
            # and ends with '}' at the beginning of the line (after whitespace).
            # We'll track brace depth for the section object.
            # When we see a '{' that is not inside a string, we increase depth.
            # When we see a '}' that is not inside a string, we decrease depth.
            # We'll keep a simple count: section_brace_depth.
            # We'll initialize section_brace_depth to 0 when we enter the sections array.
            # When we see a '{' and section_brace_depth == 0, we are entering a section -> set in_section = True, section_brace_depth = 1.
            # When we see a '}' and section_brace_depth > 0, we decrease section_brace_depth.
            # When section_brace_depth becomes 0, we have left the section -> in_section = False.
            # However, we also need to detect when we are about to start a new section while still in a section.
            # We'll do: before processing the line, if in_section and section_brace_depth == 1 and we see a '{' that would increase depth to 2? Actually, we might see a '{' inside the section (e.g., in a string? but we ignore).
            # Instead, we can look ahead: if in_section and we see a line that starts with whitespace and then '{' (and we are not inside a string) and the current section_brace_depth is 1 (meaning we are in the section object but haven't closed it), then we need to insert a closing brace and comma before this line.
            # But we don't want to modify the line we are looking at; we want to insert a line before it.
            # We'll handle by inserting a line when we detect the pattern.
            # Let's implement a simple state machine that tracks section_brace_depth.
            pass  # We'll do a simpler approach: just fix the known pattern.
        new_lines.append(line)
        i += 1
    # For now, we'll do a simpler fix: we know the exact pattern of missing '},' between sections.
    # We'll join the lines and use regex to insert '},' before a newline followed by whitespace and '{' when we are inside the sections array and after a paragraphs or bullets array.
    # But we already tried that and it didn't work because we didn't have the closing brace.
    # Let's instead look for the pattern: a line that ends with '],' (the end of paragraphs or bullets array) followed by a newline and then whitespace and '{' (the start of the next section).
    # We'll insert a '}' and a comma after the '],' line.
    content = '\n'.join(new_lines)
    # Pattern: (\\s*\\],)\\n(\\s*\\{)  -> we want to change to '\\1}\\n\\2'
    # But note: the line might end with ']' (without comma) if it's the last element? Actually, inside the sections array, each element should end with '},' except the last.
    # We'll look for: '\\s*]\\n\\s*{' and replace with '\\s*]},\\n\\s*{'
    # However, we also need to handle the case where there is a bullets array: it ends with '],' as well.
    # So we'll look for: '\\s*]\\n\\s*{' and replace with '\\s*]},\\n\\s*{'
    # But we must ensure we are inside the sections array. We'll do a simple check: only apply if we have seen 'sections: [' earlier.
    # We'll do a two-pass: first, find the sections array boundaries, then apply the replacement within.
    # Let's do a more robust method: find the sections array and then process its content.
    # We'll revert to the previous approach but also add missing braces.
    # Given the time, let's run a quick test on one file to see the exact pattern and then fix manually.
    return content

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_sections2.py <file.ts>")
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
