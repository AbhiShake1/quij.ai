import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { questionsSchema } from "@/schemas/question=schema";

export const quizRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ lang: z.string() }))
    .query(async ({ input: { lang } }) => {
      const res = await generateObject({
        model: google("gemini-1.5-flash"),
        prompt: `ask me ${lang} questions for senior role in top tech company`,
        system: `You are a staff engineer at a top tech company. You are tasked with asking questions to the interviewee. You must ask questions about ${lang} and you must not use anything else. You must ask MCQs.`,
        schema: questionsSchema,
      })
      return res.object
    })
});
