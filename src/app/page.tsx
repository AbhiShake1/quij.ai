import { api, HydrateClient } from "@/trpc/server";
import { QuizApp } from "@/components/quiz-app"

export default async function Home() {
  return (
    <HydrateClient>
      <main>
        <QuizApp />
      </main>
    </HydrateClient>
  );
}
