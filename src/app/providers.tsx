// src/app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, App as AntdApp } from "antd";
import {queryClient} from "@/lib/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
