const { readdir, readFile, writeFile } = require('fs/promises');
const { join } = require('path');

const editorialsDir = join(process.cwd(), 'frontend', 'src', 'content', 'editorials');

async function main() {
    try {
        const files = await readdir(editorialsDir);
        for (const file of files) {
            if (file.endsWith('.ts')) {
                const filePath = join(editorialsDir, file);
                try {
                    let content = await readFile(filePath, 'utf8');

                    // We look for the pattern: a line that is exactly whitespace + '},' (the extra comma line)
                    const lines = content.split('\n');
                    let newLines: string[] = [];
                    let i = 0;
                    while (i < lines.length) {
                        const line = lines[i];
                        // If we find a line that is just whitespace followed by '},', we skip it (remove the extra comma line)
                        if (/^\s*},$/.test(line)) {
                            // Skip this line (do not add to newLines)
                            i++;
                            continue;
                        }
                        // If we find a line that ends with whitespace and '}' (the closing brace of a section) and the next line is the extra comma line (which we removed),
                        // we need to add a comma to this line.
                        // But note: after removing the extra comma line, the next line might be the new section line.
                        // We'll handle the section closing brace separately.
                        newLines.push(line);
                        i++;
                    }
                    content = newLines.join('\n');

                    // Now we need to fix the sections array:
                    // We want to ensure that the sections array has proper commas between elements and a closing bracket.
                    // We'll do a more robust fix: find the sections array and rebuild it.
                    // However, for simplicity, we can just fix the specific pattern we introduced:
                    // We added a section at the end of the sections array, but we left the array malformed.

                    // Let's find the index of 'sections: ['
                    const sectionsStart = content.indexOf('sections: [');
                    if (sectionsStart === -1) {
                        continue;
                    }
                    // Find the matching closing bracket for the sections array (taking into account nested brackets)
                    let bracketCount = 1;
                    let j = sectionsStart + 'sections: ['.length;
                    let sectionsEnd = -1;
                    while (j < content.length) {
                        const ch = content[j];
                        if (ch === '[') {
                            bracketCount++;
                        } else if (ch === ']') {
                            bracketCount--;
                            if (bracketCount === 0) {
                                sectionsEnd = j;
                                break;
                            }
                        }
                        j++;
                    }
                    if (sectionsEnd === -1) {
                        console.error(`Could not find matching closing bracket for sections array in ${file}`);
                        continue;
                    }

                    // Extract the sections array content (without the outer brackets)
                    const sectionsArrayContent = content.slice(sectionsStart + 'sections: ['.length, sectionsEnd);
                    // Split the array content by lines to see the elements
                    // We know that the original sections (before our addition) are valid.
                    // Our addition appended a malformed element at the end.
                    // We'll split by '},' (closing brace of an element followed by comma) but note that the last element might not have a comma.
                    // Instead, we can parse by looking for objects.

                    // Given the complexity, and since we only added one element at the end, we can assume that the array content ends with:
                    //   ... , { ... }   (where the last element is our new section but without proper formatting)
                    // We'll instead replace the entire sections array with a corrected version by re-parsing the file as AST? Too heavy.

                    // Alternative: we can just fix the file by ensuring that the last two lines of the sections array are correct.
                    // We know that the last element we added is the one with heading "Additional Details".
                    // We can look for that string and then fix the braces and brackets around it.

                    const additionalDetailsIndex = content.indexOf('{heading: "Additional Details"');
                    if (additionalDetailsIndex === -1) {
                        // We didn't add this section? skip
                        continue;
                    }

                    // We know that the line containing '{heading: "Additional Details"' is part of the sections array.
                    // We want to make sure that:
                    //   - The line before this (if it's a section element) ends with '},'
                    //   - The line of this element ends with '}' (not '}]')
                    //   - The line after this element is the closing bracket of the sections array (with possible comma for the next property)

                    // Let's work with lines again.
                    const lines2 = content.split('\n');
                    // Find the line index of the additional details line
                    let adjLineIndex = -1;
                    for (let idx = 0; idx < lines2.length; idx++) {
                        if (lines2[idx].includes('{heading: "Additional Details"')) {
                            adjLineIndex = idx;
                            break;
                        }
                    }
                    if (adjLineIndex === -1) {
                        continue;
                    }

                    // Now, we expect that the line before adjLineIndex is the closing brace of the previous section element.
                    // We want to ensure that line ends with '},' (if it is not the first element).
                    // But note: if the sections array had zero elements before? unlikely.
                    // We'll check the line before adjLineIndex.
                    if (adjLineIndex > 0) {
                        const prevLine = lines2[adjLineIndex - 1];
                        // If the prev line ends with '}' (and not '},'), we add a comma.
                        if (prevLine.trimEnd().endsWith('}') && !prevLine.trimEnd().endsWith('},')) {
                            lines2[adjLineIndex - 1] = prevLine.trimEnd() + ',';
                        }
                    }

                    // Now, we want to ensure that the adjLineIndex line ends with '}' (and not '}]' or something else).
                    let adjLine = lines2[adjLineIndex];
                    // Remove any trailing whitespace and then check the ending.
                    adjLine = adjLine.trimEnd();
                    if (adjLine.endsWith('}]')) {
                        // Remove the last two characters (the ']' and the '}')? Actually, we want to keep the '}' and remove the ']'
                        // But note: the line might be:     {heading: "Additional Details", paragraphs: [...] }] 
                        // We want to change it to:     {heading: "Additional Details", paragraphs: [...] }
                        adjLine = adjLine.slice(0, -2); // remove the last two characters
                        lines2[adjLineIndex] = adjLine;
                    } else if (adjLine.endsWith('}')) {
                        // good
                    } else {
                        // unexpected
                        console.error(`Unexpected line format for additional details in ${file}: ${lines2[adjLineIndex]}`);
                    }

                    // Now, we need to ensure that after the adjLineIndex line, the next line is the closing bracket of the sections array.
                    // Currently, the line after adjLineIndex might be something else (like the faq line) if we removed the extra bracket.
                    // We want to insert a line that contains the closing bracket of the sections array (with the same indentation as the sections array line)
                    // after the adjLineIndex line, but before the next property (which is likely faq).

                    // Find the line that contains the closing bracket of the sections array.
                    // We know that the sections array started at some line. We can find the line index of the opening bracket.
                    let sectionsOpenLineIndex = -1;
                    for (let idx = 0; idx < lines2.length; idx++) {
                        if (lines2[idx].includes('sections: [')) {
                            sectionsOpenLineIndex = idx;
                            break;
                        }
                    }
                    if (sectionsOpenLineIndex === -1) {
                        continue;
                    }
                    // We expect the closing bracket to be at some line after the sectionsOpenLineIndex.
                    // We'll look for a line that contains only whitespace and ']' (or '],' if there is a next property).
                    let sectionsCloseLineIndex = -1;
                    for (let idx = sectionsOpenLineIndex + 1; idx < lines2.length; idx++) {
                        const trimmed = lines2[idx].trim();
                        if (trimmed === ']' || trimmed.startsWith(']')) {
                            sectionsCloseLineIndex = idx;
                            break;
                        }
                    }
                    if (sectionsCloseLineIndex === -1) {
                        // We'll insert the closing bracket line after the adjLineIndex line.
                        // But we need to know the indentation of the sections array.
                        // Get the indentation of the line that contains 'sections: ['
                        const sectionsOpenLine = lines2[sectionsOpenLineIndex];
                        const match = sectionsOpenLine.match(/^(\s*)/);
                        const indent = match ? match[1] : '';
                        // Insert a new line after adjLineIndex: indent + '],'
                        lines2.splice(adjLineIndex + 1, 0, indent + '],');
                    } else {
                        // We have a closing bracket line. We want to ensure it is exactly the closing bracket (and maybe a comma for the next property).
                        // We want to remove any extra content that might be after the ']' (like an extra '}' from our mistake).
                        let closeLine = lines2[sectionsCloseLineIndex];
                        // If the line contains more than just whitespace and ']' (or '],'), we want to trim it to just that.
                        // But note: the line might be:     ],   // and then nothing else, or with a comma.
                        // We want to keep the comma if it exists (because it separates the sections array from the next property).
                        // We'll split the line into: the part up to and including the ']', and then the rest.
                        const bracketMatch = closeLine.match(/^(\s*)(\])(.*)$/);
                        if (bracketMatch) {
                            const indent = bracketMatch[1];
                            const rest = bracketMatch[3];
                            // We want to keep the indent and the ']' and then the rest (which should be empty or a comma and maybe whitespace).
                            // But we want to ensure that there is no extra '}' before the ']'.
                            // We'll just set the line to indent + ']' + rest.
                            lines2[sectionsCloseLineIndex] = indent + ']' + rest;
                        }
                    }

                    content = lines2.join('\n');
                    await writeFile(filePath, content, 'utf8');
                    console.log(`Fixed sections array in ${file}`);
                } catch (err) {
                    console.error(`Error processing ${file}:`, err);
                }
            }
        }
        console.log('All editorial files processed.');
    } catch (err) {
        console.error('Error reading editorials directory:', err);
    }
}

main().catch(console.error);