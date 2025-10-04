"use client";

import { ToastProvider } from "@/components/ui/Toast";
import type { PropsWithChildren } from "react";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SWRConfig value={swrConfig}>
      <ToastProvider>{children}</ToastProvider>
    </SWRConfig>
  );
}
