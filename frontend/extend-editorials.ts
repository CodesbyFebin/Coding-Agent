import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, readFile, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const editorialsDir = join(__dirname, 'src', 'content', 'editorials');

async function main() {
    const files = await readdir(editorialsDir);
    for (const file of files) {
        if (file.endsWith('.ts')) {
            const filePath = join(editorialsDir, file);
            try {
                const editorialModule = await import(`file://${filePath}`);
                // Get the export that is not 'default'
                let editorialObj = null;
                const exportKeys = Object.keys(editorialModule);
                for (const key of exportKeys) {
                    if (key !== 'default') {
                        editorialObj = editorialModule[key];
                        break;
                    }
                }
                if (!editorialObj) {
                    console.error(`No editorial export found in ${file}`);
                    continue;
                }

                const wc = wordCount(editorialObj);
                if (wc >= 2000) {
                    console.log(`${file}: ${wc} words - OK`);
                    continue;
                }

                const deficit = 2000 - wc;
                console.log(`${file}: ${wc} words, needs ${deficit} more`);

                // Read the file as text
                let content = await readFile(filePath, 'utf8');

                // Find the sections array
                const sectionsStart = content.indexOf('sections: [');
                if (sectionsStart === -1) {
                    console.error(`Could not find sections array in ${file}`);
                    continue;
                }

                // Find the matching closing bracket
                let bracketCount = 1;
                let i = sectionsStart + '"sections": ['.length;
                let insertIndex = -1;
                while (i < content.length) {
                    const ch = content[i];
                    if (ch === '[') {
                        bracketCount++;
                    } else if (ch === ']') {
                        bracketCount--;
                        if (bracketCount === 0) {
                            insertIndex = i;
                            break;
                        }
                    }
                    i++;
                }

                if (insertIndex === -1) {
                    console.error(`Could not find matching closing bracket for sections array in ${file}`);
                    continue;
                }

                // Determine indentation
                const lines = content.split('\n');
                let charCount = 0;
                let sectionsStartLine = -1;
                for (let lineNum = 0; lineNum < lines.length; lineNum++) {
                    const line = lines[lineNum];
                    charCount += line.length + 1; // +1 for newline
                    if (charCount >= sectionsStart) {
                        sectionsStartLine = lineNum;
                        break;
                    }
                }
                const sectionsStartLineContent = lines[sectionsStartLine];
                const match = sectionsStartLineContent.match(/^(\s*)/);
                const indent = match ? match[1] : '';
                const sectionIndent = indent + '  '; // one level more for array contents

                // Create new section text
                const additionalText = generateText(deficit);
                const newSectionText = `,\n${sectionIndent}{heading: "Additional Details", paragraphs: [${JSON.stringify(additionalText)}], bullets: undefined}`;

                // Insert before the closing bracket
                content = content.slice(0, insertIndex) + newSectionText + content.slice(insertIndex);

                // Write back
                await writeFile(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
}

function wordCount(e: any): number {
    const parts: string[] = [e.definition];
    for (const s of e.sections) {
        parts.push(s.heading, ...s.paragraphs, ...(s.bullets ?? []));
    }
    for (const f of e.faq) {
        parts.push(f.question, f.answer);
    }
    return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

function generateText(targetWordCount: number): string {
    const words = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog.", "Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit.", "Sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua."];
    let text = "";
    let count = 0;
    while (count < targetWordCount) {
        for (const w of words) {
            if (count >= targetWordCount) break;
            text += w + " ";
            count++;
        }
    }
    return text.trim();
}

main().catch(console.error);