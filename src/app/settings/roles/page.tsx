"use client";

import { useRole, ModuleName, CRUDAction, MODULES } from "@/context/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState } from "react";
import {
    Shield,
    Plus,
    Trash2,
    Check,
    X,
    Lock,
    Edit3,
    ShieldCheck,
    PlusCircle,
    Eye,
    RotateCcw,
    XCircle,
    Settings2,
    Save,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CRUD_HEADERS: { label: string, key: CRUDAction, icon: any }[] = [
    { label: "Create", key: 'CREATE', icon: PlusCircle },
    { label: "Read", key: 'READ', icon: Eye },
    { label: "Update", key: 'UPDATE', icon: RotateCcw },
    { label: "Delete", key: 'DELETE', icon: XCircle },
];

export default function RolesPage() {
    const { availableRoles, createRole, updateRolePermissions, deleteRole } = useRole();
    const [isAdding, setIsAdding] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [matrix, setMatrix] = useState<Record<ModuleName, CRUDAction[]>>({} as any);
    const [editingRole, setEditingRole] = useState<string | null>(null);

    const handleCreateRole = () => {
        if (newRoleName.trim()) {
            const initialMatrix = {} as Record<ModuleName, CRUDAction[]>;
            MODULES.forEach(m => initialMatrix[m] = []);
            createRole(newRoleName.toUpperCase().replace(/\s+/g, '_'), { ...initialMatrix, ...matrix });
            setNewRoleName("");
            setMatrix({} as any);
            setIsAdding(false);
        }
    };

    const handleUpdatePermissions = (roleName: string) => {
        updateRolePermissions(roleName, matrix);
        setEditingRole(null);
    };

    const toggleCRUD = (module: ModuleName, action: CRUDAction) => {
        setMatrix(prev => {
            const current = prev[module] || [];
            const next = current.includes(action) 
                ? current.filter(a => a !== action)
                : [...current, action];
            return { ...prev, [module]: next };
        });
    };

    return (
        <ProtectedRoute module="ROLE_MGMT" action="READ">
            <div className="space-y-10 pb-20 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">
                            <ShieldCheck className="h-7 w-7 text-slate-900 stroke-[2.5]" /> Role Permissions
                        </h1>
                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 mt-6 uppercase tracking-[0.3em]">Manage what different users can see and do.</p>
                    </div>
                    {!isAdding && !editingRole && (
                        <Button 
                            onClick={() => { 
                                setIsAdding(true); 
                                const empty = {} as any;
                                MODULES.forEach(m => empty[m] = []);
                                setMatrix(empty);
                            }}
                            className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black text-[9px] uppercase tracking-widest px-8 h-11 rounded-xl shadow-xl transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Add New Role
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Role Selection List */}
                    <div className="lg:col-span-4 space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Available Roles</label>
                        {availableRoles.map((roleDef) => (
                            <div 
                                key={roleDef.name}
                                onClick={() => {
                                    setEditingRole(roleDef.name);
                                    setMatrix(roleDef.permissions);
                                    setIsAdding(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2",
                                    editingRole === roleDef.name 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-xl translate-x-2" 
                                        : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <Lock className={cn("h-4 w-4", editingRole === roleDef.name ? "text-[#D9F99D]" : "text-slate-300")} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{roleDef.name.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {['SUPER_ADMIN', 'ADMIN'].includes(roleDef.name) ? null : (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={(e) => { e.stopPropagation(); deleteRole(roleDef.name); }}
                                            className="h-7 w-7 rounded-lg hover:bg-rose-500 hover:text-white"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    <ChevronRight className="h-4 w-4 opacity-30" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Matrix Table Card */}
                    <div className="lg:col-span-8">
                        {(isAdding || editingRole) ? (
                            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in slide-in-from-right-4">
                                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-black uppercase italic tracking-tighter text-slate-900">
                                                {isAdding ? 'Create New Role' : `Edit Role: ${editingRole?.replace(/_/g, ' ') || ''}`}
                                            </CardTitle>
                                            <CardDescription className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                Select what actions are allowed for this role.
                                            </CardDescription>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingRole(null); }} className="rounded-xl">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    {isAdding && (
                                        <div className="mt-8">
                                            <Input 
                                                value={newRoleName} 
                                                onChange={(e) => setNewRoleName(e.target.value)} 
                                                placeholder="Enter role name (e.g. Sales Manager)" 
                                                className="h-12 rounded-xl bg-slate-50 border-none font-black text-xs uppercase tracking-widest px-6 shadow-inner"
                                            />
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-slate-50">
                                                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-10 h-14">App Section</TableHead>
                                                {CRUD_HEADERS.map(header => (
                                                    <TableHead key={header.key} className="text-center w-24 p-0">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <header.icon className="h-3.5 w-3.5 text-slate-300" />
                                                            <span className="text-[7px] font-black uppercase tracking-[0.2em]">{header.label}</span>
                                                        </div>
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {MODULES.map((module) => (
                                                <TableRow key={module} className="hover:bg-slate-50/50 border-slate-50 group">
                                                    <TableCell className="px-10 py-5">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 group-hover:text-slate-900 transition-colors">
                                                            {module.replace('_', ' ')}
                                                        </p>
                                                    </TableCell>
                                                    {CRUD_HEADERS.map(header => (
                                                        <TableCell key={header.key} className="text-center p-0">
                                                            <div 
                                                                onClick={() => toggleCRUD(module, header.key)}
                                                                className={cn(
                                                                    "h-9 w-9 rounded-xl mx-auto flex items-center justify-center transition-all cursor-pointer border-2",
                                                                    matrix[module]?.includes(header.key) 
                                                                        ? "bg-slate-900 border-slate-900 text-[#D9F99D] shadow-lg shadow-slate-100" 
                                                                        : "bg-white border-slate-100 text-transparent hover:border-slate-300"
                                                                )}
                                                            >
                                                                <Check className="h-4 w-4 stroke-[4]" />
                                                            </div>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="p-10 border-t border-slate-50">
                                        <Button 
                                            onClick={isAdding ? handleCreateRole : () => handleUpdatePermissions(editingRole!)}
                                            className="w-full h-14 bg-slate-900 text-white hover:bg-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                                        >
                                            <Save className="h-4 w-4 text-[#D9F99D]" />
                                            {isAdding ? 'Create Role' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full min-h-[500px] rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-20 text-center">
                                <Settings2 className="h-12 w-12 text-slate-100 mb-6" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 leading-relaxed">
                                    No role selected. <br /> <span className="text-slate-200">Select a role on the left to edit its permissions.</span>
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
