"use client";

import { ReactNode } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export default function CacheProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider
      options={{
        key: "rtl",
        stylisPlugins: [prefixer, rtlPlugin],
        prepend: true,
      }}
    >
      {children}
    </AppRouterCacheProvider>
  );
}
