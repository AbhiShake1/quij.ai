"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" enableSystem={false} forcedTheme="dark">
    <TRPCReactProvider>
      {children}
    </TRPCReactProvider>
  </ThemeProvider>;
}
