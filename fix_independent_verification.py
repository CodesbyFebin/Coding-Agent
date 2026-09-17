#!/usr/bin/env python3
"""
Fix the independent-verification.ts file which has a malformed Additional Details section
and missing comma before faq.
"""

import os
import re

editorials_dir = "/Users/cyberteck/Desktop/Coding Agent/frontend/src/content/editorials"

def fix_independent_verification(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix 1: Remove the malformed Additional Details section
    # Pattern: { heading: "Additional Details", paragraphs: [...], bullets: undefined }
    content = re.sub(r',?\s*\{\s*heading:\s*"Additional Details"[^}]*bullets:\s*undefined\s*\}\s*', '', content)
    
    # Fix 2: Ensure there's a comma before faq
    content = re.sub(r'\]\s*(?=\s*faq:)', '],', content)
    
    # Fix 3: Ensure there's a comma before sources
    content = re.sub(r'\]\s*(?=\s*sources:)', '],', content)
    
    # Fix 4: Fix any trailing commas
    content = re.sub(r',\s*\]', ']', content)
    content = re.sub(r',\s*,', ',', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "Fixed"
    return False, "No changes needed"

filepath = os.path.join(editorials_dir, 'independent-verification.ts')
fixed, msg = fix_independent_verification(filepath)
print(f"independent-verification.ts: {msg}")

print("Done!")