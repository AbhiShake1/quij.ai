import dynamic from "next/dynamic";
import { fetchAccessToken } from "@humeai/voice";
import { env } from "@/env";

const Chat = dynamic(() => import("@/components/hume/chat"), {
  ssr: false,
});

async function getHumeAccessToken() {
  "use server";

  const accessToken = await fetchAccessToken({
    apiKey: env.HUME_API_KEY,
    secretKey: env.HUME_SECRET_KEY,
  });

  if (accessToken === 'undefined') {
    return null;
  }

  return accessToken ?? null;
}

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div className={"grow flex flex-col"}>
      <Chat accessToken={accessToken} />
    </div>
  );
}
