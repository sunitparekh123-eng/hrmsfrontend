"use client";

import { RoleProvider } from "@/context/RoleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
    </ThemeProvider>
  );
}
