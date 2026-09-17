#!/usr/bin/env python3
"""
Fix the remaining 4 files that have unclosed section objects.
The issue: last section object missing closing } before the sections array closes.
Pattern: paragraphs: [...]]  -> should be paragraphs: [...]},\n  ]
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

def fix_unclosed_section(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Find the pattern: paragraphs: [...] followed by ]] (or ] ]) then faq/sources
    # The issue is the last section object is missing its closing }
    
    # Find the sections array and the faq/sources that follows
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
    
    # Look at the content between sections and faq/sources
    between = content[sections_start:next_section]
    
    # The problem: the last section ends with paragraphs: [...]] instead of paragraphs: [...]}  ],
    # Fix: replace the last ]] before faq/sources with ]},\n  ]
    
    # Find the last occurrence of ']]' in the between section that's not inside a string
    # Actually, let's be more precise - find the last 'paragraphs:' array closing
    
    # Simple fix: find the pattern where a paragraphs array closes followed immediately by ] (closing sections)
    # without a } in between
    
    # Pattern: ]]\s*(?=faq:|sources:)
    # Replace with: ]},\n  ]
    
    fixed = re.sub(r'\]\]\s*(?=\s*(?:faq|sources):)', ']},\n  ]', content)
    
    if fixed != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        return True, "Fixed unclosed section"
    
    # Alternative pattern: ]\s*]\s*(?=faq:|sources:)
    fixed2 = re.sub(r'\]\s*\]\s*(?=\s*(?:faq|sources):)', ']},\n  ]', content)
    if fixed2 != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed2)
        return True, "Fixed unclosed section (alt pattern)"
    
    return False, "No fix applied"

for filename in problem_files:
    filepath = os.path.join(editorials_dir, filename)
    fixed, msg = fix_unclosed_section(filepath)
    print(f"{filename}: {msg}")

print("Done!")