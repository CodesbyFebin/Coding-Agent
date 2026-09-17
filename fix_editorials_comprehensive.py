#!/usr/bin/env python3
"""
Comprehensive fix for all editorial files.
Issues to fix:
1. Missing }, between section objects in sections array
2. Malformed "Additional Details" section inserted by extend-editorials.ts
3. Unicode characters (em-dashes, smart quotes) causing TS1127 errors
4. Inconsistent quote styles (double vs single quotes)
"""

import os
import re
import json

editorials_dir = "/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials"

def sanitize_unicode(text):
    """Replace unicode characters with ASCII equivalents."""
    replacements = {
        '\u2014': ' -- ',   # em-dash
        '\u2013': ' - ',    # en-dash
        '\u2018': "'",      # left single quote
        '\u2019': "'",      # right single quote
        '\u201c': '"',      # left double quote
        '\u201d': '"',      # right double quote
        '\u2026': '...',    # ellipsis
        '\u00a0': ' ',      # non-breaking space
        '\u2010': '-',      # hyphen
        '\u2011': '-',      # non-breaking hyphen
        '\u2212': '-',      # minus sign
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def fix_editorial_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # First, sanitize unicode characters in the entire file
    content = sanitize_unicode(content)
    
    # Find the sections array
    sections_match = re.search(r'sections\s*:\s*\[', content)
    if not sections_match:
        return False, "No sections array found"
    
    sections_start = sections_match.start()
    
    # Find the end of sections array by bracket counting
    bracket_count = 0
    in_string = False
    escape_next = False
    quote_char = None
    sections_end = -1
    
    i = sections_start
    while i < len(content):
        ch = content[i]
        
        if escape_next:
            escape_next = False
        elif ch == '\\':
            escape_next = True
        elif not in_string and (ch == '"' or ch == "'"):
            in_string = True
            quote_char = ch
        elif in_string and ch == quote_char:
            in_string = False
            quote_char = None
        elif not in_string:
            if ch == '[' or ch == '{':
                bracket_count += 1
            elif ch == ']' or ch == '}':
                bracket_count -= 1
                if bracket_count == 0:
                    sections_end = i
                    break
        i += 1
    
    if sections_end == -1:
        return False, "Could not find end of sections array"
    
    # Extract sections array content
    sections_content = content[sections_start:sections_end + 1]
    
    # Parse and rebuild the sections array properly
    # First, let's find all section objects
    # We'll use a more robust approach: parse as JSON-like after fixing quotes
    
    # Replace the sections array with a properly formatted one
    # First, extract the individual sections
    
    # Find all section objects (heading: ... paragraphs: [...] ...)
    section_pattern = r'\{\s*(heading|"heading")\s*:'
    section_starts = [(m.start(), m.group()) for m in re.finditer(section_pattern, sections_content)]
    
    if len(section_starts) < 2:
        return False, "Less than 2 sections found"
    
    # Extract each section
    sections = []
    for idx, (start_pos, _) in enumerate(section_starts):
        end_pos = section_starts[idx + 1][0] if idx + 1 < len(section_starts) else len(sections_content)
        section_text = sections_content[start_pos:end_pos]
        
        # Clean up the section text
        section_text = section_text.strip()
        # Remove trailing comma if present
        if section_text.endswith(','):
            section_text = section_text[:-1]
        # Remove trailing '},' if present (from previous broken fix)
        section_text = re.sub(r'\}\s*,\s*$', '}', section_text)
        sections.append(section_text)
    
    # Now rebuild the sections array
    new_sections = 'sections: [\n'
    for idx, section in enumerate(sections):
        # Clean up the section
        section = section.strip()
        # Ensure it ends with }
        if not section.endswith('}'):
            # Find the last }
            last_brace = section.rfind('}')
            if last_brace != -1:
                section = section[:last_brace + 1]
        
        # Add proper indentation
        indented = '\n'.join('    ' + line for line in section.split('\n'))
        if idx < len(sections) - 1:
            new_sections += indented + ',\n'
        else:
            new_sections += indented + '\n'
    new_sections += '  ]'
    
    # Replace the sections array in content
    new_content = content[:sections_start] + new_sections + content[sections_end + 1:]
    
    # Now fix the faq and sources arrays if they have similar issues
    # Fix any remaining "Additional Details" malformed sections
    # The extend script added: ,{heading: "Additional Details", paragraphs: [...], bullets: undefined}
    # This might be malformed - let's clean it up
    
    # Fix any trailing commas before ] or }
    new_content = re.sub(r',\s*\]', ']', new_content)
    new_content = re.sub(r',\s*\}', '}', new_content)
    
    # Fix double commas
    new_content = re.sub(r',\s*,', ',', new_content)
    
    # Ensure consistent single quotes for keys (TypeScript prefers this)
    # But we'll keep the existing style and just fix syntax errors
    
    if new_content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, "Fixed"
    return False, "No changes needed"

# Process all .ts files
fixed_count = 0
for filename in sorted(os.listdir(editorials_dir)):
    if filename.endswith('.ts') and not filename.endswith('-bak.ts') and not filename.endswith('-check.ts'):
        filepath = os.path.join(editorials_dir, filename)
        fixed, msg = fix_editorial_file(filepath)
        if fixed:
            fixed_count += 1
        print(f"{filename}: {msg}")

print(f"\nDone! Fixed {fixed_count} files.")