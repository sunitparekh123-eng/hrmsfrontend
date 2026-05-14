"use client";

import { cn } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    Filter,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    LayoutGrid,
    List,
    ChevronDown,
    Briefcase,
    Building2,
    ArrowUpRight,
    User,
    Plus,
    UserCheck,
    Clock,
    UserX,
    Check
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

export default function EmployeesPage() {
    const { hasPermission } = useRole();
    const [searchTerm, setSearchTerm] = useState("");
    const [personnel, setPersonnel] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('hrms_employees') || '[]');
        const mockDefaults = [
            { id: "EMP001", name: "Arjun Singh", role: "SUPER_ADMIN", jobTitle: "Senior Developer", dept: "Engineering", email: "arjun.s@antigravity.io", phone: "+91 98765 00001", status: "Active", location: "Indore", color: "blue" },
            { id: "EMP002", name: "Meera Das", role: "MANAGER", jobTitle: "UI Designer", dept: "Design", email: "meera.d@antigravity.io", phone: "+91 98765 00002", status: "Active", location: "Bhopal", color: "emerald" },
            { id: "EMP003", name: "Rahul Sharma", role: "ADMIN", jobTitle: "HR Manager", dept: "Human Resources", email: "rahul.s@antigravity.io", phone: "+91 98765 00003", status: "Active", location: "Satna", color: "blue" },
            { id: "EMP004", name: "Anita Kapoor", role: "MANAGER", jobTitle: "Team Lead", dept: "Engineering", email: "anita.k@antigravity.io", phone: "+91 98765 00004", status: "On Leave", location: "Indore", color: "amber" },
            { id: "EMP005", name: "Kunal Jain", role: "EMPLOYEE", jobTitle: "Product Manager", dept: "Product", email: "kunal.j@antigravity.io", phone: "+91 98765 00005", status: "Active", location: "Bhopal", color: "blue" },
            { id: "EMP006", name: "Suresh Mehra", role: "EMPLOYEE", jobTitle: "Backend Engineer", dept: "Engineering", email: "suresh.m@antigravity.io", phone: "+91 98765 00006", status: "Active", location: "Satna", color: "emerald" },
        ];
        
        const combined = [...stored];
        mockDefaults.forEach(def => {
            if (!combined.some(e => e.id === def.id)) {
                combined.push(def);
            }
        });
        setPersonnel(combined);
    }, []);

    const filteredPersonnel = personnel.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredPersonnel.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPersonnel = filteredPersonnel.slice(startIndex, startIndex + itemsPerPage);

    const toggleStatus = (id: string) => {
        setPersonnel(personnel.map(p => 
            p.id === id ? { ...p, status: p.status === "Active" ? "On Leave" : "Active" } : p
        ));
    };

    const archivePersonnel = (id: string) => {
        setPersonnel(personnel.filter(p => p.id !== id));
    };

    return (
        <ProtectedRoute module="EMPLOYEES" action="READ">
            <div className="space-y-8 pb-20">
                {/* Simple Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2 pt-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-4">Employee List</h1>
                        <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">Manage your team members and their information.</p>
                    </div>

                    {hasPermission('EMPLOYEES', 'CREATE') && (
                        <Link href="/onboarding">
                            <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl shadow-lg transition-all flex items-center gap-3">
                                <Plus className="h-5 w-5 stroke-[3]" /> Add New Employee
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search & Stats Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-2">
                    <div className="lg:col-span-8 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <Input 
                            placeholder="Search by name, ID, or department..." 
                            className="w-full bg-white border-slate-100 pl-14 h-14 rounded-2xl font-bold text-xs shadow-sm focus-visible:ring-1 focus-visible:ring-[#D9F99D]"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="lg:col-span-4 flex items-center justify-between bg-white px-8 h-14 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-center">
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
                            <p className="text-sm font-black italic text-slate-900">{personnel.length}</p>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-100" />
                        <div className="text-center">
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active</p>
                            <p className="text-sm font-black italic text-emerald-500">{personnel.filter(p => p.status === 'Active').length}</p>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-100" />
                        <div className="text-center">
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">On Leave</p>
                            <p className="text-sm font-black italic text-amber-500">{personnel.filter(p => p.status !== 'Active').length}</p>
                        </div>
                    </div>
                </div>

                {/* Main Table View */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mx-2">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                    <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                    <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Job Details</th>
                                    <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-right py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPersonnel.map((emp) => (
                                    <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center font-black italic text-sm shadow-sm border border-white",
                                                    emp.color === 'blue' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
                                                )}>
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <Link href={`/employees/${emp.id}`} className="hover:underline">
                                                        <span className="text-xs font-black text-slate-900 italic uppercase tracking-tighter cursor-pointer">{emp.name}</span>
                                                    </Link>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {emp.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-slate-700 lowercase flex items-center gap-2"><Mail className="h-3 w-3 text-slate-300" /> {emp.email}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2"><Phone className="h-3 w-3 text-slate-300" /> {emp.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{emp.jobTitle || "Team Member"}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3 w-3 text-slate-300" /> {emp.location}</p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <Badge className={cn(
                                                "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg border-none",
                                                emp.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                {emp.status}
                                            </Badge>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                                                        <MoreVertical className="h-4 w-4 text-slate-300" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                                    <Link href={`/employees/${emp.id}`}>
                                                        <DropdownMenuItem className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl cursor-pointer">View Profile</DropdownMenuItem>
                                                    </Link>
                                                    {hasPermission('EMPLOYEES', 'UPDATE') && (
                                                        <DropdownMenuItem onClick={() => toggleStatus(emp.id)} className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl cursor-pointer">Toggle Status</DropdownMenuItem>
                                                    )}
                                                    {hasPermission('EMPLOYEES', 'DELETE') && (
                                                        <DropdownMenuItem onClick={() => archivePersonnel(emp.id)} className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl text-rose-500 cursor-pointer">Remove</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, filteredPersonnel.length)}</span> of <span className="text-slate-900">{filteredPersonnel.length}</span> Employees
                        </p>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="h-9 px-4 rounded-xl border-slate-200 font-black text-[9px] uppercase tracking-widest hover:bg-white disabled:opacity-30 transition-all"
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={cn(
                                            "h-9 w-9 rounded-xl font-black text-[9px] transition-all",
                                            currentPage === i + 1 ? "bg-slate-900 text-white hover:bg-black" : "text-slate-400 hover:bg-white"
                                        )}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="h-9 px-4 rounded-xl border-slate-200 font-black text-[9px] uppercase tracking-widest hover:bg-white disabled:opacity-30 transition-all"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
