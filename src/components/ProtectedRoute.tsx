"use client";

import { useRole, ModuleName, CRUDAction } from "@/context/RoleContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  module?: ModuleName;
  action?: CRUDAction;
}

export function ProtectedRoute({ children, allowedRoles, module, action }: ProtectedRouteProps) {
  const { role, hasPermission } = useRole();
  const router = useRouter();

  const isAllowed = () => {
    if (module && action) {
      return hasPermission(module, action);
    }
    if (allowedRoles) {
      return allowedRoles.includes(role);
    }
    return true;
  };

  useEffect(() => {
    if (!isAllowed()) {
      router.push("/");
    }
  }, [role, allowedRoles, module, action, router]);

  if (!isAllowed()) {
    return null;
  }

  return <>{children}</>;
}
