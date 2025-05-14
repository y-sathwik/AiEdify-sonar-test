/**
 * Extracts text content from a DOCX file using mammoth
 *
 * @param fileBuffer - The buffer of the DOCX file
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromDOCX(fileBuffer: ArrayBuffer): Promise<string> {
  try {
    // We'll use dynamic import to avoid build errors if the package isn't installed
    const mammoth = await import('mammoth')

    // Extract text from the DOCX
    const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer })

    // Return the text content
    return result.value ?? ''
  } catch (error) {
    console.error('Error extracting text from DOCX:', error)
    throw new Error('Failed to extract text from DOCX file')
  }
}
