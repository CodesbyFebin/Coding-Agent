import sys
import re

def fix_newline(content):
    # Replace literal backslash-n with actual newline, but only in the pattern we care about: '},\n    {'
    # We'll do a more general replacement: replace '\\n' with '\n' but only outside strings? Too complex.
    # Instead we'll target the specific pattern.
    # We'll use regex to find '},' followed by backslash-n then spaces and '{'
    pattern = r'}(\\s*)\\\\n(\\s*){'
    # We need to keep the spaces before and after the newline.
    # We'll replace with '}', then the first space group, then actual newline, then second space group, then '{'
    def repl(match):
        # match.group(1) is spaces before the backslash-n? Actually pattern: '}' then (\\s*) then \\\\n then (\\s*) then '{'
        # So group1 is spaces between '}' and the backslash-n? Actually there is no space between '}' and backslash-n in our example: we have '},\\n' so after '}' there is a comma then backslash-n.
        # Oops we missed the comma. Let's adjust.
        # The pattern we saw: '},\\n    {'
        # So we need to capture the comma as well.
        # Let's do: '}(,)(\\s*)\\\\n(\\s*){'
        pass
    # Let's do a simpler approach: just replace the literal string '},\\n    {' with '},\n    {'
    # But we need to preserve the exact number of spaces.
    # We'll do: replace '},\\n' with '},\n' and keep the rest.
    # Actually we can replace '},\\n' with '},\n' globally? Might be safe because the only place we have backslash-n is there.
    content = content.replace('},\\\\n', '},\n')
    return content

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_newline.py <file.ts>")
        sys.exit(1)
    filepath = sys.argv[1]
    with open(filepath, 'r') as f:
        content = f.read()
    fixed = fix_newline(content)
    with open(filepath, 'w') as f:
        f.write(fixed)
    print(f"Fixed newline in {filepath}")

if __name__ == '__main__':
    main()
