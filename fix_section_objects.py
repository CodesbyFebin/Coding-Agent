#!/usr/bin/env python3
"""
Fix the section objects by adding missing }, after each section's inner arrays close.
The issue: each section object ends with ] (paragraphs or bullets) but is missing the } to close the object.
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
    
    # The pattern: a section ends with ] (closing paragraphs or bullets) followed by optional whitespace and then { (next section)
    # We need to insert }, between them
    # Pattern: ]\s*(?=\s*\{)
    # But we need to be careful not to match inside nested arrays
    
    # Better approach: iterate through the content and track bracket depth
    result = []
    i = 0
    brace_depth = 0  # Tracks { }
    bracket_depth = 0  # Tracks [ ]
    in_string = False
    escape_next = False
    quote_char = None
    
    while i < len(sections_content):
        ch = sections_content[i]
        
        if escape_next:
            escape_next = False
            result.append(ch)
        elif ch == '\\':
            escape_next = True
            result.append(ch)
        elif not in_string and (ch == '"' or ch == "'"):
            in_string = True
            quote_char = ch
            result.append(ch)
        elif in_string and ch == quote_char:
            in_string = False
            quote_char = None
            result.append(ch)
        elif not in_string:
            if ch == '{':
                brace_depth += 1
                result.append(ch)
            elif ch == '}':
                brace_depth -= 1
                result.append(ch)
            elif ch == '[':
                bracket_depth += 1
                result.append(ch)
            elif ch == ']':
                bracket_depth -= 1
                result.append(ch)
                # Check if we just closed a top-level array inside a section object
                # If we're at depth 1 for braces (inside a section object) and depth 0 for brackets (just closed paragraphs/bullets)
                # and the next non-whitespace is { (start of next section)
                if brace_depth == 1 and bracket_depth == 0:
                    # Look ahead for next non-whitespace
                    j = i + 1
                    while j < len(sections_content) and sections_content[j] in ' \t\n\r':
                        j += 1
                    if j < len(sections_content) and sections_content[j] == '{':
                        # Add the missing }, before the next section
                        result.append('},\n')
            else:
                result.append(ch)
        else:
            result.append(ch)
        i += 1
    
    fixed_sections = ''.join(result)
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