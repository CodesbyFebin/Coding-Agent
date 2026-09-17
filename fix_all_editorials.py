#!/usr/bin/env python3
"""
Fix all editorial files by adding missing }, between section objects.
The extend-editorials.ts script removed the closing braces between sections.
"""

import os
import re

editorials_dir = "/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix pattern: section ending with ] followed by { (start of next section)
    # We need to add }, between them
    # Pattern: ]\n    {  -> ]\n    },
    # But need to be careful about the faq and sources arrays too
    
    # More precise: Find sections array content and fix it
    # The sections array starts with "sections: [" and ends before "faq:" or "sources:"
    
    # Find the sections array
    sections_start = content.find('sections: [')
    if sections_start == -1:
        return False, "No sections array found"
    
    # Find the end of sections array - look for the next top-level property
    # It should be either "faq:" or "sources:" at the same indentation level
    search_start = sections_start
    bracket_count = 0
    in_string = False
    escape_next = False
    sections_end = -1
    
    i = sections_start
    while i < len(content):
        ch = content[i]
        
        if escape_next:
            escape_next = False
        elif ch == '\\':
            escape_next = True
        elif ch == '"' and not escape_next:
            in_string = not in_string
        elif not in_string:
            if ch == '[' or ch == '{':
                bracket_count += 1
            elif ch == ']' or ch == '}':
                bracket_count -= 1
                if bracket_count == 0:
                    # Found the closing of sections array
                    sections_end = i
                    break
        i += 1
    
    if sections_end == -1:
        return False, "Could not find end of sections array"
    
    # Extract the sections array content
    sections_content = content[sections_start:sections_end + 1]
    
    # Fix the sections content: add }, between section objects
    # Pattern: ]\n    {  -> ]\n    },
    # But only when it's at the section level (2 spaces indent for array items, 4 spaces for section properties)
    
    lines = sections_content.split('\n')
    fixed_lines = []
    in_section = False
    section_brace_level = 0
    
    for i, line in enumerate(lines):
        fixed_lines.append(line)
        
        # Check if this line ends a section (closing ] of paragraphs or bullets)
        # and next line starts a new section (heading:)
        stripped = line.strip()
        if i + 1 < len(lines):
            next_line = lines[i + 1].strip()
            # If current line ends with ] and next line starts with { (and it's a section object)
            if stripped.endswith(']') and next_line == '{':
                # Check if this is a section-level closing (not nested deeper)
                # Section objects are at indent level of 4 spaces (inside sections array)
                if line.startswith('        ]'):  # 8 spaces = array item content level
                    fixed_lines.append('        },')  # Add closing brace and comma for section object
    
    fixed_sections = '\n'.join(fixed_lines)
    
    # Replace the sections array in the content
    new_content = content[:sections_start] + fixed_sections + content[sections_end + 1:]
    
    if new_content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, "Fixed"
    return False, "No changes needed"

# Process all .ts files
for filename in sorted(os.listdir(editorials_dir)):
    if filename.endswith('.ts') and not filename.endswith('-bak.ts') and not filename.endswith('-check.ts'):
        filepath = os.path.join(editorials_dir, filename)
        fixed, msg = fix_file(filepath)
        print(f"{filename}: {msg}")

print("Done!")