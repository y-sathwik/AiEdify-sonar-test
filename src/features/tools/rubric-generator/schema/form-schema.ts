import { z } from 'zod'

export const formSchema = z.object({
  assignmentType: z.string().min(1, 'Assignment type is required'),
  customAssignmentType: z.string().optional(),
  keyStage: z.string().regex(/^ks[3-5]$/, 'Key stage must be ks3, ks4, or ks5'),
  yearGroup: z.string().regex(/^[7-9]|1[0-3]$/, 'Year group must be between 7 and 13'),
  assessmentType: z.string().min(1, 'Assessment type is required'),
  topic: z.string().min(1, 'Topic is required'),
  criteria: z
    .array(z.string())
    .min(1, 'At least one criterion is required')
    .max(6, 'Maximum 6 criteria allowed'),
  additionalInstructions: z.string().optional(),
  inputMethod: z.enum(['text', 'file']),
  fileUrl: z.string().optional(),
  fileContent: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>
