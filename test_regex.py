import re
with open('frontend/src/content/editorials/independent-verification.ts', 'r') as f:
    content = f.read()
# Find sections array
start = content.find('sections: [')
if start == -1:
    print("Not found")
    exit(0)
# Find matching closing bracket
bracket_count = 0
i = start + len('sections: [')
while i < len(content):
    ch = content[i]
    if ch == '[':
        bracket_count += 1
    elif ch == ']':
        bracket_count -= 1
        if bracket_count == 0:
            end = i  # position of the closing ']'
            break
    i += 1
else:
    print("No matching bracket")
    exit(0)
sections_content = content[start+len('sections: ['):end]
print("Sections content length:", len(sections_content))
# Now apply regex to sections_content
# Pattern: (\\s*\\],)\\n(\\s*\\{)
# We want to replace with: \\1\\n\\1  },\\2   ??? Let's think.
# Actually we want to change:
#      ],
#    {
# to:
#      ]
#    },
#    {
# So we insert a line after the '],' line that contains the same indentation and '},'
# and we remove the comma from the '],' line.
# So we replace: (\\s*)\\],\\n(\\s*\\{) with \\1\\]\\n\\1  },\\2
pattern = r'(\\s*)\\],\\n(\\s*\\{)'
replacement = r'\\1\\]\\n\\1  },\\2'
new_sections = re.sub(pattern, replacement, sections_content)
# Now we also need to handle the last section: it should not have a trailing comma after the closing brace.
# But we'll do that later.
# Replace the sections content in the original content
new_content = content[:start+len('sections: [')] + new_sections + content[end:]
# Write to a test file
with open('frontend/src/content/editorials/independent-verification.ts.test', 'w') as f:
    f.write(new_content)
print("Done")
