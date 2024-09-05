import { z } from "zod"

export const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswers: z.array(z.number()).min(1).max(4),
})

export const questionsSchema = z.array(
  questionSchema
)
