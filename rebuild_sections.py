#!/usr/bin/env python3
"""
Rebuild the sections array for the 4 problematic files that still have
missing }, between section objects.
"""

import os
import re

editorials_dir = "/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials"

problem_files = [
    'ai-coding-agents.ts',
    'dpdp-compliance.ts', 
    'local-llm-coding.ts',
    'model-context-protocol.ts'
]

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

def rebuild_sections_array(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # First sanitize unicode in the entire file
    content = sanitize_unicode(content)
    
    # Find the sections array start
    sections_match = re.search(r'sections\s*:\s*\[', content)
    if not sections_match:
        return False, "No sections array"
    
    sections_start = sections_match.start()
    
    # Find faq or sources after sections
    faq_pos = content.find('faq:', sections_start)
    sources_pos = content.find('sources:', sections_start)
    
    next_section = min(p for p in [faq_pos, sources_pos] if p != -1) if (faq_pos != -1 or sources_pos != -1) else -1
    
    if next_section == -1:
        return False, "No faq or sources found after sections"
    
    # Extract everything between sections: [ and faq/sources:
    before_sections = content[:sections_start]
    sections_and_after = content[sections_start:next_section]
    after_sections = content[next_section:]
    
    # Now parse the sections array content
    # Remove "sections: [" prefix
    sections_content = sections_and_after[len('sections: ['):]
    
    # The sections content should end with "  ]" - remove it
    if sections_content.endswith('  ]'):
        sections_content = sections_content[:-3]
    elif sections_content.endswith(']'):
        sections_content = sections_content[:-1]
    
    # Find all section objects by looking for "heading" patterns
    # Pattern matches: heading: or "heading": or 'heading':
    section_pattern = r'(?:^|\n)\s*\{\s*(?:["\']?heading["\']?)\s*:'
    section_starts = [(m.start(), m.end()) for m in re.finditer(section_pattern, sections_content)]
    
    if len(section_starts) < 1:
        return False, f"No sections found"
    
    # Extract each section
    sections = []
    for idx, (start_pos, end_pos) in enumerate(section_starts):
        end_pos = section_starts[idx + 1][0] if idx + 1 < len(section_starts) else len(sections_content)
        section_text = sections_content[start_pos:end_pos]
        
        # Clean up: remove trailing commas, fix indentation
        section_text = section_text.strip()
        # Remove trailing comma
        if section_text.endswith(','):
            section_text = section_text[:-1]
        sections.append(section_text)
    
    # Rebuild the sections array
    new_sections = 'sections: [\n'
    for idx, section in enumerate(sections):
        # Ensure each section ends with }
        section = section.strip()
        if not section.endswith('}'):
            last_brace = section.rfind('}')
            if last_brace != -1:
                section = section[:last_brace + 1]
        
        # Add proper indentation (4 spaces)
        indented = '\n'.join('    ' + line for line in section.split('\n'))
        if idx < len(sections) - 1:
            new_sections += indented + ',\n'
        else:
            new_sections += indented + '\n'
    new_sections += '  ]'
    
    # Combine everything
    new_content = before_sections + new_sections + after_sections
    
    # Fix any remaining syntax issues
    new_content = re.sub(r',\s*\]', ']', new_content)
    new_content = re.sub(r',\s*\}', '}', new_content)
    new_content = re.sub(r',\s*,', ',', new_content)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, f"Fixed - rebuilt {len(sections)} sections"
    return False, "No changes needed"

for filename in problem_files:
    filepath = os.path.join(editorials_dir, filename)
    fixed, msg = rebuild_sections_array(filepath)
    print(f"{filename}: {msg}")

print("Done!")