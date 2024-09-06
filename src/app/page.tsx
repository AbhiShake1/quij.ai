import { HydrateClient } from "@/trpc/server";
import { QuizApp } from "@/components/quiz-app"
import { z } from "zod";
import { questionsSchema } from "@/schemas/question=schema";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

export default async function Home({ searchParams }: { searchParams: { q: string } }) {
  const topic = searchParams['q']
  let questions: z.infer<typeof questionsSchema> | undefined

  if (topic) {
    const res = await generateObject({
      model: google("gemini-1.5-flash"),
      prompt: `ask me ${topic} questions for senior role in top tech company`,
      system: `You are a staff engineer at a top tech company. You are tasked with asking questions to the interviewee. You must ask questions about ${topic} and you must not use anything else. You must ask MCQs. There can be 1 to 4 correct answers and 4 options for each question`,
      schema: questionsSchema,
    })
    questions = res.object
  }

  return (
    <HydrateClient>
      <main>
        <QuizApp questions={questions} />
      </main>
    </HydrateClient>
  );
}
