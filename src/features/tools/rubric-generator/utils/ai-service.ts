import { FormValues } from '@/features/tools/rubric-generator/schema'
import {
  RubricResponse,
  rubricResponseSchema,
} from '@/features/tools/rubric-generator/schema/response-schema'
import { generateAiResponse, AiServiceOptions, AiResponse } from '../../../../utils/ai-service'
import { SYSTEM_PROMPTS } from '@/constants/system-prompt'
import { SCHEMA_DESCRIPTIONS } from '@/constants/schema-descriptions'
import { generateRubricPrompt } from '@/constants/prompts/rubric-generator'
import { z } from 'zod'

/**
 * Creates a rubric using the prompt and AI service.
 */
export async function createRubric(
  input: FormValues,
  options?: AiServiceOptions
): Promise<{
  response: RubricResponse
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  error?: {
    error: string
    code?: string
    status: number
  }
}> {
  console.log('Creating rubric...')
  try {
    // Generate the prompt from the input data
    const userPrompt = generateRubricPrompt(input)
    console.log('Generated prompt:', userPrompt)

    // Call the AI service with the prompt and schema
    const systemPrompt = SYSTEM_PROMPTS.RUBRIC_GENERATOR
    const schemaDescription = SCHEMA_DESCRIPTIONS.RUBRIC_GENERATOR

    // Cast the schema to a more specific ZodType that includes RubricResponse
    const aiResponse: AiResponse<RubricResponse> = await generateAiResponse<RubricResponse>({
      systemPrompt,
      schemaDescription,
      userPrompt,
      // This is safer than 'as any' because we're being specific about the type
      schema: rubricResponseSchema as z.ZodType<RubricResponse>,
      options,
    })

    console.log('Generated rubric:', aiResponse.response)

    return {
      response: aiResponse.response,
      usage: aiResponse.usage,
      error: aiResponse.error,
    }
  } catch (error) {
    console.error('Error creating rubric:', error)
    throw error
  }
}
