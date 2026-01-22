// =============================================================================
// API ROUTE - POST /api/extract-pdf
// Accepts PDF file upload and returns extracted text
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

// PDF magic bytes: %PDF- (0x25 0x50 0x44 0x46 0x2D)
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2D];

/**
 * Validate that a file is actually a PDF by checking magic bytes.
 * This prevents file type spoofing where a malicious file is renamed to .pdf
 */
function isValidPdfFile(buffer: ArrayBuffer): boolean {
  const header = new Uint8Array(buffer.slice(0, 5));
  return PDF_MAGIC_BYTES.every((byte, i) => header[i] === byte);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    // Check file type by MIME and extension (basic check)
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();

    // Validate PDF magic bytes to prevent file type spoofing
    if (!isValidPdfFile(arrayBuffer)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PDF file. The file appears to be corrupted or is not a real PDF.' },
        { status: 400 }
      );
    }

    // Extract text using pdf-parse
    // pdf-parse v1.1.1 has a simple default export
    const pdf = (await import('pdf-parse')).default;
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

    return NextResponse.json({
      success: true,
      text: data.text,
      pages: data.numpages
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract text from PDF'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
