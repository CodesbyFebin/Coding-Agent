#!/usr/bin/env python3
"""
Fix the section objects by adding missing }, after each section's inner arrays close.
The issue: each section ends with ] (closing paragraphs or bullets) but is missing the } to close the object.
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

def fix_section_objects(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Find the sections array
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
    
    # Process the sections content
    before = content[:sections_start]
    sections_content = content[sections_start:next_section]
    after = content[next_section:]
    
    # Fix: after each ] that closes paragraphs/bullets of a section, add }, if next non-whitespace is {
    # Pattern: ] followed by whitespace and then { (start of next section object)
    # Replace with: ],\n    }
    
    lines = sections_content.split('\n')
    fixed_lines = []
    
    for i, line in enumerate(lines):
        fixed_lines.append(line)
        # Check if this line ends with ] (closing paragraphs or bullets array)
        stripped = line.rstrip()
        if stripped.endswith(']'):
            # Look ahead to next non-empty line
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines):
                next_line = lines[j].strip()
                # If next line starts with { (new section object)
                if next_line.startswith('{'):
                    # Add the closing } and comma for the current section object
                    # The current line has the closing ], we need to add }, after it
                    fixed_lines[-1] = line + '},\n'
    
    fixed_sections = '\n'.join(fixed_lines)
    new_content = before + fixed_sections + after
    
    # Also fix any trailing commas
    new_content = re.sub(r',\s*\]', ']', new_content)
    new_content = re.sub(r',\s*,', ',', new_content)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, "Fixed section objects"
    return False, "No changes needed"

for filename in problem_files:
    filepath = os.path.join(editorials_dir, filename)
    fixed, msg = fix_section_objects(filepath)
    print(f"{filename}: {msg}")

print("Done!")