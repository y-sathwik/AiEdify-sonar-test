import { extractTextFromPDF } from './pdf-parser'
import { extractTextFromDOCX } from './docx-parser'

/**
 * Extracts text from a file based on its type
 * @param file - The file to extract text from
 * @returns A promise that resolves to the extracted text
 * @internal Used only internally within this module
 */
async function extractTextFromFile(file: File): Promise<string> {
  try {
    const fileBuffer = await file.arrayBuffer()
    const fileType = file.type

    if (fileType === 'application/pdf') {
      return extractTextFromPDF(fileBuffer)
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      return extractTextFromDOCX(fileBuffer)
    } else {
      throw new Error(`Unsupported file type: ${fileType}`)
    }
  } catch (error) {
    console.error('Error extracting text from file:', error)
    throw error
  }
}

/**
 * Handles file upload and text extraction
 * @param file - The uploaded file
 * @returns A promise that resolves to the extracted text and filename
 */
export async function handleDocumentUpload(file: File): Promise<{
  text: string
  filename: string
}> {
  try {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ]

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF or Word document.')
    }

    // Extract text from the file
    const extractedText = await extractTextFromFile(file)

    return {
      text: extractedText,
      filename: file.name,
    }
  } catch (error) {
    console.error('Error handling document upload:', error)
    throw error
  }
}
