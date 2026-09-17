#!/usr/bin/env python3
"""
Fix the remaining issues:
1. Missing comma between sections array and faq/sources
2. Remove backup and check files that have errors
"""

import os
import re

editorials_dir = "/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials"

def fix_missing_comma(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix: ]faq: -> ],\n  faq:
    # Fix: ]sources: -> ],\n  sources:
    content = re.sub(r'\]\s*(?=\s*(?:faq|sources):)', '],', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "Fixed missing comma"
    return False, "No changes needed"

# Also remove backup and check files
backup_files = [
    'independent-verification-bak.ts',
    'independent-verification-check.ts'
]

for fname in backup_files:
    fpath = os.path.join(editorials_dir, fname)
    if os.path.exists(fpath):
        os.remove(fpath)
        print(f"Removed {fname}")

problem_files = [
    'ai-coding-agents.ts',
    'dpdp-compliance.ts', 
    'local-llm-coding.ts',
    'model-context-protocol.ts'
]

for filename in problem_files:
    filepath = os.path.join(editorials_dir, filename)
    fixed, msg = fix_missing_comma(filepath)
    print(f"{filename}: {msg}")

print("Done!")