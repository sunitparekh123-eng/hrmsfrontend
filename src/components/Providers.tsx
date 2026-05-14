"use client";

import { RoleProvider } from "@/context/RoleContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      {children}
    </RoleProvider>
  );
}
