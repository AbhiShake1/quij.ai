import { HydrateClient } from "@/trpc/server";
import { generateObject } from "ai"
import { google } from '@ai-sdk/google';
import { QuizApp } from "@/components/quiz-app"
import { questionsSchema } from "@/schemas/question=schema";

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <Delegator />
      </main>
    </HydrateClient>
  );
}

async function Delegator() {
  const lang = "flutter"
  const res = await generateObject({
    model: google("gemini-1.5-pro"),
    prompt: `ask me ${lang} questions for senior role in top tech company`,
    system: `You are a staff engineer at a top tech company. You are tasked with asking questions to the interviewee. You must ask questions about ${lang} and you must not use anything else. You must ask MCQs.`,
    schema: questionsSchema,
  })

  console.log(res.object)

  return <QuizApp questions={res.object} />
}
