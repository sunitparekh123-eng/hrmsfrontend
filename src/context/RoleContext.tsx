"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CRUDAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export const MODULES = [
  'DASHBOARD',
  'EMPLOYEES',
  'ATTENDANCE',
  'PAYROLL',
  'LEAVE',
  'LOCATIONS',
  'LETTERS',
  'REPORTS',
  'SETTINGS',
  'ROLE_MGMT'
] as const;

export type ModuleName = typeof MODULES[number];

interface RoleDefinition {
  name: string;
  permissions: Record<ModuleName, CRUDAction[]>;
}

interface User {
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
      DASHBOARD: FULL_CRUD, EMPLOYEES: FULL_CRUD, ATTENDANCE: FULL_CRUD, PAYROLL: FULL_CRUD, 
      LEAVE: FULL_CRUD, LOCATIONS: FULL_CRUD, LETTERS: FULL_CRUD, REPORTS: FULL_CRUD, 
      SETTINGS: FULL_CRUD, ROLE_MGMT: FULL_CRUD
    }
  },
  {
    name: 'ADMIN',
    permissions: {
      DASHBOARD: FULL_CRUD, EMPLOYEES: FULL_CRUD, ATTENDANCE: FULL_CRUD, PAYROLL: FULL_CRUD, 
      LEAVE: FULL_CRUD, LOCATIONS: FULL_CRUD, LETTERS: FULL_CRUD, REPORTS: FULL_CRUD, 
      SETTINGS: FULL_CRUD, ROLE_MGMT: NO_ACCESS
    }
  },
  {
    name: 'MANAGER',
    permissions: {
      DASHBOARD: READ_ONLY, EMPLOYEES: ['READ', 'UPDATE'], ATTENDANCE: FULL_CRUD, PAYROLL: NO_ACCESS, 
      LEAVE: FULL_CRUD, LOCATIONS: READ_ONLY, LETTERS: NO_ACCESS, REPORTS: READ_ONLY, 
      SETTINGS: READ_ONLY, ROLE_MGMT: NO_ACCESS
    }
  },
  {
    name: 'EMPLOYEE',
    permissions: {
      DASHBOARD: READ_ONLY, EMPLOYEES: NO_ACCESS, ATTENDANCE: READ_ONLY, PAYROLL: NO_ACCESS, 
      LEAVE: READ_ONLY, LOCATIONS: NO_ACCESS, LETTERS: NO_ACCESS, REPORTS: NO_ACCESS, 
      SETTINGS: READ_ONLY, ROLE_MGMT: NO_ACCESS
    }
  }
];

const mockUser: User = {
  id: 'USR001',
  name: 'John Doe',
  email: 'john.doe@hrms.io',
  role: 'SUPER_ADMIN',
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [availableRoles, setAvailableRoles] = useState<RoleDefinition[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hrms_roles_crud');
      return saved ? JSON.parse(saved) : initialRoles;
    }
    return initialRoles;
  });

  useEffect(() => {
    localStorage.setItem('hrms_roles_crud', JSON.stringify(availableRoles));
  }, [availableRoles]);

  const setRole = (newRole: string) => {
    if (user) setUser({ ...user, role: newRole });
  };

  const hasPermission = (module: ModuleName, action: CRUDAction) => {
    if (!user) return false;
    const currentRoleDef = availableRoles.find(r => r.name === user.role);
    if (!currentRoleDef) return false;

    const modulePerms = currentRoleDef.permissions[module];
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
