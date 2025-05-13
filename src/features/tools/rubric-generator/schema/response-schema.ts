import { z } from 'zod'

// Define schema for each level of the rubric (internal, not exported)
const rubricLevelSchema = z.object({
  score: z.number(),
  description: z.string(),
  feedback: z.string(),
})

// Create default empty level for fallback
const defaultLevel = {
  score: 0,
  description: '',
  feedback: '',
}

// Define a levels schema that handles both required and optional cases (internal)
const levelsSchema = z.object({
  exceptional: rubricLevelSchema.optional().default(defaultLevel),
  advanced: rubricLevelSchema.optional().default(defaultLevel),
  proficient: rubricLevelSchema.optional().default(defaultLevel),
  basic: rubricLevelSchema.optional().default(defaultLevel),
  emerging: rubricLevelSchema.optional().default(defaultLevel),
})

// Define schema for criteria in the rubric (internal)
const rubricCriterionSchema = z.object({
  name: z.string(),
  levels: levelsSchema,
})

// Define schema for rubric metadata (internal)
const rubricMetadataSchema = z.object({
  subject: z.string(),
  topic: z.string(),
  assessmentType: z.string(),
  assessor: z.string(),
  keyStage: z.string(),
  level: z.number(),
})

// Define schema for the entire rubric data (internal)
const rubricDataSchema = z.object({
  id: z.string(),
  version: z.string(),
  createdAt: z.string(),
  metadata: rubricMetadataSchema,
  rubric: z.object({
    criteria: z.array(rubricCriterionSchema),
  }),
})

// The overall response schema (this one needs to be exported)
export const rubricResponseSchema = z.object({
  data: rubricDataSchema,
})

// Type for the response (this needs to be exported)
export type RubricResponse = z.infer<typeof rubricResponseSchema>
