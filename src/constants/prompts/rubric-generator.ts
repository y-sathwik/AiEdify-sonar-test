import { FormValues } from '@/features/tools/rubric-generator/schema'

/**
 * Generate a prompt for rubric generation based on user input
 */
export const generateRubricPrompt = (input: FormValues): string => {
  // Get document content from the fileContent field if available
  // Otherwise use an empty string
  const documentContent = input.fileContent ?? ''

  // Truncate document content to a reasonable length (max 3000 chars)
  // to avoid exceeding token limits
  const maxContentLength = 3000
  const truncatedContent =
    documentContent.length > maxContentLength
      ? documentContent.substring(0, maxContentLength) + '...'
      : documentContent

  // Extract the document content section to avoid nested template literals
  const documentContentSection = truncatedContent ? `Document Content:\n${truncatedContent}` : ''

  return `Create an assessment rubric with the following details:

Assignment Details:
- Type: ${input.assignmentType}
- Topic: ${input.topic}
${input.customAssignmentType ? `- Custom Type: ${input.customAssignmentType}` : ''}
- Key Stage: ${input.keyStage}
- Year Group: ${input.yearGroup}
- Assessment Type: ${input.assessmentType}
${input.fileUrl ? `- Document URL: ${input.fileUrl}` : ''}

Required Criteria: ${input.criteria.join(', ')}

${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ''}

${documentContentSection}`
}
