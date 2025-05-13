import { NextResponse } from 'next/server'
import { createRubric } from '@/features/tools/rubric-generator/utils'
import { formSchema } from '@/features/tools/rubric-generator/schema'
import { z } from 'zod'

export const maxDuration = 300 // 5 minutes timeout

export async function POST(req: Request) {
  try {
    // Get the request body
    const body = await req.json()
    console.log('Received request body:', body)

    try {
      // Validate input using the schema
      const validatedInput = formSchema.parse(body)
      console.log('Validated input:', validatedInput)

      // Generate the rubric
      console.log('Calling rubric generator service...')
      const result = await createRubric(validatedInput, { temperature: 0.7 })
      console.log('createRubric result type:', typeof result)
      console.log('usage:', result.usage)

      // Check if there's an error from the AI service
      if (result.error) {
        return NextResponse.json(
          {
            error: result.error.error,
            code: result.error.code,
            details: 'AI service error',
          },
          { status: result.error.status || 500 }
        )
      }

      // Here you would save to database, but we're skipping that for now

      return NextResponse.json(
        {
          data: result.response,
          usage: result.usage,
        },
        {
          status: 200,
        }
      )
    } catch (validationError) {
      console.error('Validation error:', validationError)
      // Handle Zod validation errors specifically
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid input data',
            details: validationError.errors,
          },
          {
            status: 400,
          }
        )
      }
      throw validationError // Re-throw if it's not a validation error
    }
  } catch (error) {
    console.error('Error generating rubric:', error)

    // Create a meaningful error response
    let errorMessage = 'Failed to generate rubric'
    let errorDetails = null

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      {
        status: 500,
      }
    )
  }
}
