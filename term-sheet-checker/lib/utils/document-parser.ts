// =============================================================================
// DOCUMENT PARSER UTILITY
// Extracts text from PDF and Word documents
// =============================================================================

/**
 * Extract text from a PDF file via server-side API
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/extract-pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to extract text from PDF');
    }

    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to parse PDF file');
  }
}

/**
 * Extract text from any supported document type
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (fileName.endsWith('.pdf') || mimeType === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (
    fileName.endsWith('.docx') ||
    fileName.endsWith('.doc') ||
    mimeType.includes('word') ||
    mimeType.includes('officedocument')
  ) {
    throw new Error(
      'Word documents are not yet supported. Please copy/paste the text directly, or export as PDF first.'
    );
  } else if (fileName.endsWith('.txt') || mimeType.includes('text/plain')) {
    return await file.text();
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or text file, or copy/paste the text directly.');
  }
}
