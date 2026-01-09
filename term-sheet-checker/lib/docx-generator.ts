// Word Document Generator for SAFE Documents
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
} from 'docx';

export interface DocxSection {
  type: 'heading' | 'subheading' | 'paragraph' | 'divider' | 'label-value' | 'list-item';
  content?: string;
  label?: string;
  value?: string;
  bold?: boolean;
  centered?: boolean;
}

// Parse plain text document into sections for Word generation
function parseTextToSections(text: string): DocxSection[] {
  const sections: DocxSection[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      continue;
    }

    // Main title (surrounded by ===)
    if (trimmed.match(/^={10,}$/)) {
      // Check if next non-empty line is a title
      const nextLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '' && !lines[j].match(/^={10,}$/)) {
        nextLines.push(lines[j].trim());
        j++;
      }
      if (nextLines.length > 0) {
        sections.push({
          type: 'heading',
          content: nextLines.join(' '),
          centered: true,
        });
        i = j; // Skip past the title and closing ===
      }
      continue;
    }

    // Section divider (---)
    if (trimmed.match(/^-{10,}$/)) {
      // Check if next non-empty line is a section header
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      if (j < lines.length && !lines[j].trim().match(/^-{10,}$/)) {
        const headerLine = lines[j].trim();
        // Check for closing divider
        let k = j + 1;
        while (k < lines.length && lines[k].trim() === '') k++;
        if (k < lines.length && lines[k].trim().match(/^-{10,}$/)) {
          sections.push({ type: 'divider' });
          sections.push({
            type: 'subheading',
            content: headerLine,
            centered: true,
          });
          i = k; // Skip past header and closing divider
          continue;
        }
      }
      sections.push({ type: 'divider' });
      continue;
    }

    // Label: Value format (like COMPANY: name)
    const labelMatch = trimmed.match(/^([A-Z][A-Z\s]+):\s*(.+)$/);
    if (labelMatch) {
      sections.push({
        type: 'label-value',
        label: labelMatch[1],
        value: labelMatch[2],
      });
      continue;
    }

    // Numbered list items
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      sections.push({
        type: 'list-item',
        content: `${numberedMatch[1]}. ${numberedMatch[2]}`,
        bold: true,
      });
      continue;
    }

    // Lettered list items
    const letteredMatch = trimmed.match(/^\(([a-z])\)\s+(.+)$/);
    if (letteredMatch) {
      sections.push({
        type: 'list-item',
        content: `(${letteredMatch[1]}) ${letteredMatch[2]}`,
      });
      continue;
    }

    // All caps line (likely a section header within content)
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 5 && !trimmed.match(/^\[.*\]$/)) {
      sections.push({
        type: 'subheading',
        content: trimmed,
      });
      continue;
    }

    // Regular paragraph
    sections.push({
      type: 'paragraph',
      content: trimmed,
    });
  }

  return sections;
}

// Generate Word document from plain text
export async function generateWordDocument(textContent: string, title: string): Promise<Blob> {
  const sections = parseTextToSections(textContent);

  const children: Paragraph[] = [];

  for (const section of sections) {
    switch (section.type) {
      case 'heading':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content || '',
                bold: true,
                size: 32, // 16pt
                font: 'Times New Roman',
              }),
            ],
            alignment: section.centered ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { before: 400, after: 200 },
          })
        );
        break;

      case 'subheading':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content || '',
                bold: true,
                size: 24, // 12pt
                font: 'Times New Roman',
                allCaps: true,
              }),
            ],
            alignment: section.centered ? AlignmentType.CENTER : AlignmentType.LEFT,
            spacing: { before: 300, after: 150 },
          })
        );
        break;

      case 'divider':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '',
              }),
            ],
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: '000000',
              },
            },
            spacing: { before: 200, after: 200 },
          })
        );
        break;

      case 'label-value':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${section.label}: `,
                bold: true,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
              new TextRun({
                text: section.value || '',
                size: 22,
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 100, after: 100 },
          })
        );
        break;

      case 'list-item':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content || '',
                bold: section.bold,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
            indent: { left: 360 }, // 0.25 inch indent
            spacing: { before: 100, after: 100 },
          })
        );
        break;

      case 'paragraph':
      default:
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content || '',
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: 100, after: 100 },
            alignment: AlignmentType.JUSTIFIED,
          })
        );
        break;
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
