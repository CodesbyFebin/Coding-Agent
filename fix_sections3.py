import sys
import re

def fix_file(content):
    lines = content.split('\n')
    n = len(lines)
    i = 0
    # state: 0 = outside sections array, 1 = inside sections array but outside section object, 2 = inside section object
    state = 0
    # We'll also track the indentation of the current line when needed.
    new_lines = []
    while i < n:
        line = lines[i]
        stripped = line.strip()
        
        # Detect start of sections array
        if state == 0 and 'sections: [' in line:
            state = 1
            new_lines.append(line)
            i += 1
            continue
        
        # If we are in the sections array
        if state == 1:
            # Look for the start of a section object
            if stripped.startswith('{'):
                state = 2
                new_lines.append(line)
                i += 1
                continue
            # Otherwise, just copy the line
            new_lines.append(line)
            i += 1
            continue
        
        # If we are inside a section object
        if state == 2:
            # Check if we see the end of the section object (a line that is just '}')
            if stripped == '}':
                state = 1
                new_lines.append(line)
                i += 1
                continue
            
            # Check if we see an array property line that ends with ']' (with or without comma)
            # and the next line starts with '{' (indicating the start of the next section object)
            if re.search(r'\\]\\s*,?\\s*$', stripped):
                # Peek at the next line if it exists
                if i + 1 < n:
                    next_stripped = lines[i+1].strip()
                    if next_stripped.startswith('{'):
                        # We found the pattern: array line then next section starts.
                        # Remove any trailing comma from the current line.
                        if line.rstrip().endswith(','):
                            line = line.rstrip()[:-1]  # remove the trailing comma
                        # Now, we want to insert a line after the current line that has the same indentation
                        # and contains "},".
                        indent = line[:len(line) - len(line.lstrip())]  # leading whitespace
                        new_lines.append(line)  # the array line without the trailing comma
                        new_lines.append(indent + '},')
                        # Note: we do not increment i here because we have not consumed the next line.
                        # We will process the next line in the next iteration.
                        i += 1
                        continue
            # If we didn't match the above, just copy the line.
            new_lines.append(line)
            i += 1
            continue
    
    # Join the lines back
    return '\n'.join(new_lines)

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_sections3.py <file.ts>")
        sys.exit(1)
    filepath = sys.argv[1]
    with open(filepath, 'r') as f:
        content = f.read()
    fixed = fix_file(content)
    with open(filepath, 'w') as f:
        f.write(fixed)
    print(f"Fixed {filepath}")

if __name__ == '__main__':
    main()