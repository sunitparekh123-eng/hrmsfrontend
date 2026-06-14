"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export type CRUDAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export const MODULES = [
  'DASHBOARD',
  'EMPLOYEES',
  'ATTENDANCE',
  'PAYROLL',
  'LOANS',
  'LEAVE',
  'PERFORMANCE',
  'LOCATIONS',
  'LETTERS',
  'TOUR_EXPENSES',
  'REPORTS',
  'SETTINGS',
  'ROLE_MGMT'
] as const;

export type ModuleName = typeof MODULES[number];

interface RoleDefinition {
  name: string;
  permissions: Record<ModuleName, CRUDAction[]>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch?: string;
  department?: string;
}

interface RoleContextType {
  user: User | null;
  role: string;
  availableRoles: RoleDefinition[];
  setRole: (role: string) => void;
  hasPermission: (module: ModuleName, action: CRUDAction) => boolean;
  updateRolePermissions: (roleName: string, permissions: Record<ModuleName, CRUDAction[]>) => void;
  createRole: (roleName: string, permissions: Record<ModuleName, CRUDAction[]>) => void;
  deleteRole: (roleName: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const FULL_CRUD: CRUDAction[] = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
const READ_ONLY: CRUDAction[] = ['READ'];
const NO_ACCESS: CRUDAction[] = [];

const initialRoles: RoleDefinition[] = [
  {
    name: 'SUPER_ADMIN',
    permissions: {
      DASHBOARD: FULL_CRUD, EMPLOYEES: FULL_CRUD, ATTENDANCE: FULL_CRUD, PAYROLL: FULL_CRUD, LOANS: FULL_CRUD,
      LEAVE: FULL_CRUD, LOCATIONS: FULL_CRUD, LETTERS: FULL_CRUD, TOUR_EXPENSES: FULL_CRUD,
      REPORTS: FULL_CRUD, SETTINGS: FULL_CRUD, ROLE_MGMT: FULL_CRUD, PERFORMANCE: FULL_CRUD
    }
  },
  {
    name: 'ADMIN',
    permissions: {
      DASHBOARD: FULL_CRUD, EMPLOYEES: FULL_CRUD, ATTENDANCE: FULL_CRUD, PAYROLL: FULL_CRUD, LOANS: FULL_CRUD,
      LEAVE: FULL_CRUD, LOCATIONS: FULL_CRUD, LETTERS: FULL_CRUD, TOUR_EXPENSES: FULL_CRUD,
      REPORTS: FULL_CRUD, SETTINGS: FULL_CRUD, ROLE_MGMT: NO_ACCESS, PERFORMANCE: FULL_CRUD
    }
  },
  {
    name: 'MANAGER',
    permissions: {
      DASHBOARD: READ_ONLY, EMPLOYEES: ['READ', 'UPDATE'], ATTENDANCE: FULL_CRUD, PAYROLL: NO_ACCESS, LOANS: READ_ONLY,
      LEAVE: FULL_CRUD, LOCATIONS: READ_ONLY, LETTERS: NO_ACCESS, TOUR_EXPENSES: FULL_CRUD,
      REPORTS: READ_ONLY, SETTINGS: READ_ONLY, ROLE_MGMT: NO_ACCESS, PERFORMANCE: FULL_CRUD
    }
  },
  {
    name: 'EMPLOYEE',
    permissions: {
      DASHBOARD: READ_ONLY, EMPLOYEES: NO_ACCESS, ATTENDANCE: READ_ONLY, PAYROLL: NO_ACCESS, LOANS: READ_ONLY,
      LEAVE: READ_ONLY, LOCATIONS: NO_ACCESS, LETTERS: NO_ACCESS, TOUR_EXPENSES: READ_ONLY,
      REPORTS: NO_ACCESS, SETTINGS: READ_ONLY, ROLE_MGMT: NO_ACCESS, PERFORMANCE: READ_ONLY
    }
  }
];

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  // Consume user from AuthContext instead of maintaining our own mock user
  const auth = useAuth();
  const user = auth.user;

  const [availableRoles, setAvailableRoles] = useState<RoleDefinition[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hrms_roles_crud');
      if (saved) {
        try {
          const parsed: RoleDefinition[] = JSON.parse(saved);
          // If any role is missing a module key, reset to initialRoles
          const isStale = parsed.some(r =>
            MODULES.some(m => !(m in r.permissions))
          );
          if (isStale) {
            localStorage.removeItem('hrms_roles_crud');
            return initialRoles;
          }
          return parsed;
        } catch {
          return initialRoles;
        }
      }
    }
    return initialRoles;
  });

  useEffect(() => {
    localStorage.setItem('hrms_roles_crud', JSON.stringify(availableRoles));
  }, [availableRoles]);

  // setRole is now a no-op for dev mode role switching — the real role
  // comes from AuthContext. Kept for backward compatibility with the
  // Sidebar's dev role dropdown (will be replaced in Phase 4).
  const setRole = (_newRole: string) => {
    // Intentionally no-op: role is controlled by AuthContext
  };

  const hasPermission = (module: ModuleName, action: CRUDAction) => {
    if (!user) return false;
    const currentRoleDef = availableRoles.find(r => r.name === user.role);
    if (!currentRoleDef) return false;

    const modulePerms = currentRoleDef.permissions[module];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  };

  const updateRolePermissions = (roleName: string, permissions: Record<ModuleName, CRUDAction[]>) => {
    if (roleName === 'SUPER_ADMIN') {
      permissions.ROLE_MGMT = FULL_CRUD;
    }
    setAvailableRoles(prev => prev.map(r =>
      r.name === roleName ? { ...r, permissions } : r
    ));
  };

  const createRole = (roleName: string, permissions: Record<ModuleName, CRUDAction[]>) => {
    if (availableRoles.some(r => r.name === roleName)) return;
    setAvailableRoles(prev => [...prev, { name: roleName, permissions }]);
  };

  const deleteRole = (roleName: string) => {
    if (['SUPER_ADMIN', 'ADMIN'].includes(roleName)) return;
    setAvailableRoles(prev => prev.filter(r => r.name !== roleName));
  };

  return (
    <RoleContext.Provider value={{
      user, role: user?.role || 'EMPLOYEE', availableRoles,
      setRole, hasPermission, updateRolePermissions, createRole, deleteRole
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
