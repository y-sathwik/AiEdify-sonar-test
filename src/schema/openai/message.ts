import { z } from 'zod'

export const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
})

export type Message = z.infer<typeof messageSchema>
