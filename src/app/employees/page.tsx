"use client";

import { useState } from "react";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

export default function EmployeesPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [personnel, setPersonnel] = useState([
        { id: "EMP001", name: "Arjun Singh", role: "Senior Developer", dept: "Engineering", email: "arjun.s@antigravity.io", phone: "+91 98765 00001", status: "Active", location: "Bengaluru", color: "bg-[#E0E7FF]" },
        { id: "EMP002", name: "Meera Das", role: "UI Designer", dept: "Design", email: "meera.d@antigravity.io", phone: "+91 98765 00002", status: "Active", location: "Remote", color: "bg-[#D1FAE5]" },
        { id: "EMP003", name: "Rahul Sharma", role: "HR Manager", dept: "Human Resources", email: "rahul.s@antigravity.io", phone: "+91 98765 00003", status: "Active", location: "Mumbai", color: "bg-[#FEE2E2]" },
        { id: "EMP004", name: "Anita Kapoor", role: "Team Lead", dept: "Engineering", email: "anita.k@antigravity.io", phone: "+91 98765 00004", status: "On Leave", location: "Bengaluru", color: "bg-[#DBEAFE]" },
        { id: "EMP005", name: "Kunal Jain", role: "Product Manager", dept: "Product", email: "kunal.j@antigravity.io", phone: "+91 98765 00005", status: "Active", location: "Delhi", color: "bg-[#EDE9FE]" },
        { id: "EMP006", name: "Suresh Mehra", role: "Backend Engineer", dept: "Engineering", email: "suresh.m@antigravity.io", phone: "+91 98765 00006", status: "Active", location: "Bengaluru", color: "bg-[#E0E7FF]" },
    ]);

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        role: "",
        dept: "",
        email: "",
        location: "Bengaluru"
    });

    const handleAddEmployee = () => {
        if (!newEmployee.name || !newEmployee.role) return;

        const id = `EMP00${personnel.length + 1}`;
        const colors = ["bg-[#E0E7FF]", "bg-[#D1FAE5]", "bg-[#FEE2E2]", "bg-[#DBEAFE]", "bg-[#EDE9FE]"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        setPersonnel([
            { ...newEmployee, id, status: "Active", phone: "+91 00000 00000", color: randomColor },
            ...personnel
        ]);

        setNewEmployee({ name: "", role: "", dept: "", email: "", location: "Bengaluru" });
        setIsOpen(false);
    };

    const [markedFeedback, setMarkedFeedback] = useState<Record<string, string>>({});

    const markAttendance = (id: string, status: string) => {
        setMarkedFeedback({ ...markedFeedback, [id]: status });
        setTimeout(() => {
            setMarkedFeedback(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }, 3000);
    };

    const toggleStatus = (id: string) => {
        setPersonnel(personnel.map(p =>
            p.id === id ? { ...p, status: p.status === "Active" ? "On Leave" : "Active" } : p
        ));
    };

    const archivePersonnel = (id: string) => {
        setPersonnel(personnel.filter(p => p.id !== id));
    };

    const filteredPersonnel = personnel.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-10 pb-20 px-2 md:px-0">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                        <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-400 stroke-[2.5]" /> Identity Registry
                    </h1>
                    <p className="text-[9px] md:text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.3em]">Global Personnel Directory • Secure Interface</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[10px] tracking-widest px-8 md:px-10 h-14 rounded-2xl md:rounded-[1.5rem] shadow-xl hover:translate-y-[-2px] transition-all">
                            <UserPlus className="h-5 w-5 mr-3 stroke-[3]" /> Add Employees
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-6 md:p-10 bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-black italic underline underline-offset-8 decoration-[#D9F99D]">Register Node</DialogTitle>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Integrate new personnel into the registry</p>
                        </DialogHeader>
                        <div className="grid gap-4 md:gap-6 py-6 md:py-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</Label>
                                <Input
                                    placeholder="Name"
                                    className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 border-none px-6 font-bold text-xs"
                                    value={newEmployee.name}
                                    onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Strategic Role</Label>
                                    <Input
                                        placeholder="Role"
                                        className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 border-none px-6 font-bold text-xs"
                                        value={newEmployee.role}
                                        onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operational Dept</Label>
                                    <Input
                                        placeholder="Dept"
                                        className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 border-none px-6 font-bold text-xs"
                                        value={newEmployee.dept}
                                        onChange={e => setNewEmployee({ ...newEmployee, dept: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Registry Email</Label>
                                <Input
                                    placeholder="name@antigravity.io"
                                    className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 border-none px-6 font-bold text-xs"
                                    value={newEmployee.email}
                                    onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleAddEmployee}
                                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-black transition-all"
                            >
                                Deploy Personnel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-2 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative w-full group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <Input
                            placeholder="Query node..."
                            className="h-12 md:h-14 pl-14 bg-transparent border-none transition-all focus-visible:ring-0 rounded-xl md:rounded-3xl text-xs font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4 pr-6">
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                view === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                            )}
                            onClick={() => setView("grid")}
                        >
                            Grid
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-10 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                            )}
                            onClick={() => setView("list")}
                        >
                            List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content List/Grid */}
            <div className={view === "grid" ? "grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
                {filteredPersonnel.map((emp) => (
                    view === "grid" ? (
                        <Card key={emp.id} className="group hover:translate-y-[-8px] transition-all duration-500 border-none shadow-sm bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden p-2 flex flex-col min-h-[30rem] md:h-[34.5rem]">
                            <CardHeader className="flex flex-row items-center justify-between pb-0 px-6 md:px-8 pt-6 md:pt-8 border-none">
                                <Badge className={cn(
                                    "border-none font-black text-[9px] uppercase tracking-widest px-3 h-5 rounded-lg shadow-sm",
                                    emp.status === "Active" ? "bg-[#D1FAE5] text-emerald-600" : "bg-[#FEF3C7] text-amber-600"
                                )}>
                                    {emp.status}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl border border-transparent hover:border-slate-50 transition-all">
                                            <MoreVertical className="h-4 w-4 text-slate-300" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                        <DropdownMenuItem className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl cursor-pointer">View Profile</DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => toggleStatus(emp.id)}
                                            className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl cursor-pointer"
                                        >
                                            Toggle Status
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-50" />
                                        <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 p-2 italic">Presence Audit</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => markAttendance(emp.id, "Present")}
                                            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50"
                                        >
                                            <UserCheck className="h-4 w-4 text-emerald-500" />
                                            <span className="font-bold text-[9px] uppercase tracking-widest">Mark Present</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => markAttendance(emp.id, "Late")}
                                            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-amber-50"
                                        >
                                            <Clock className="h-4 w-4 text-amber-500" />
                                            <span className="font-bold text-[9px] uppercase tracking-widest">Mark Late</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => markAttendance(emp.id, "Absent")}
                                            className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-rose-50"
                                        >
                                            <UserX className="h-4 w-4 text-rose-500" />
                                            <span className="font-bold text-[9px] uppercase tracking-widest">Mark Absent</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-slate-50" />
                                        <DropdownMenuItem
                                            onClick={() => archivePersonnel(emp.id)}
                                            className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl text-rose-500 cursor-pointer"
                                        >
                                            Remove Employee
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center text-center space-y-6 px-6 md:px-10 pb-10 pt-4 flex-1">
                                <div className={cn("h-28 w-28 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center p-2 relative shadow-inner", emp.color)}>
                                    <Avatar className="h-full w-full rounded-[1.5rem] md:rounded-[2.1rem] border-4 border-white shadow-xl">
                                        <AvatarFallback className="text-xl md:text-2xl font-black bg-white text-slate-900 uppercase italic">
                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {markedFeedback[emp.id] ? (
                                        <div className="absolute inset-0 bg-white/90 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center mb-2",
                                                markedFeedback[emp.id] === "Present" ? "bg-emerald-100 text-emerald-600" :
                                                    markedFeedback[emp.id] === "Late" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                                            )}>
                                                <Check className="h-6 w-6 stroke-[3]" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900 italic">{markedFeedback[emp.id]} LOGGED</span>
                                        </div>
                                    ) : (
                                        <div className="absolute -bottom-1 -right-1 h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all cursor-pointer border border-slate-50" onClick={() => toggleStatus(emp.id)}>
                                            <ArrowUpRight className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight uppercase tracking-widest italic">{emp.name}</h3>
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 italic">
                                        <Briefcase className="h-3 w-3 text-indigo-400" /> {emp.role}
                                    </p>
                                </div>

                                <div className="w-full pt-6 space-y-4 border-t border-dashed border-slate-100 text-left mt-auto pb-2">
                                    <div className="flex items-center gap-3 text-[9px] font-black uppercase text-slate-500 tracking-tight italic">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <Mail className="h-3.5 w-3.5 text-slate-300" />
                                        </div>
                                        <span className="truncate">{emp.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[9px] font-black uppercase text-slate-500 tracking-tight italic">
                                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center">
                                                <Building2 className="h-3.5 w-3.5 text-slate-300" />
                                            </div>
                                            <span>{emp.dept?.split(' ')[0] || "N/A"}</span>
                                        </div>
                                        <Badge className="bg-slate-900 text-white border-none px-3 h-5 rounded-lg text-[7px] font-black tracking-widest shadow-md">
                                            {emp.location}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card key={emp.id} className="hover:shadow-lg transition-all duration-300 border-none shadow-sm group bg-white rounded-[2rem] overflow-hidden p-2">
                            <CardContent className="p-4 md:p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <Avatar className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border-4 border-slate-50 shadow-sm">
                                        <AvatarFallback className="font-black text-slate-400 uppercase">{emp.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-black text-xs md:text-sm uppercase tracking-widest italic text-slate-900">{emp.name}</p>
                                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{emp.id} • {emp.role}</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Strategic Node</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-slate-700">{emp.dept}</p>
                                </div>
                                <div className="flex items-center gap-3 md:gap-6">
                                    <Badge className={cn(
                                        "border-none font-black text-[8px] md:text-[9px] uppercase px-3 md:px-4 h-6 md:h-7 tracking-widest rounded-lg md:rounded-xl",
                                        emp.status === "Active" ? "bg-[#D1FAE5] text-emerald-600" : "bg-[#FEF3C7] text-amber-600"
                                    )}>
                                        {emp.status}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all">
                                                <MoreVertical className="h-4 w-4 text-slate-300" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                            <DropdownMenuItem onClick={() => toggleStatus(emp.id)} className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl cursor-pointer">Toggle Status</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => archivePersonnel(emp.id)} className="font-bold text-[9px] uppercase tracking-widest p-2.5 rounded-xl text-rose-500 cursor-pointer">Remove Employee</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    )
                ))}
            </div>

            {/* Footer / Pagination Decorative */}
            <div className="flex flex-col items-center justify-center pt-10 md:pt-16 space-y-6">
                <div className="h-0.5 w-48 md:w-64 bg-slate-100 rounded-full relative overflow-hidden">
                    <div className="h-full bg-[#D9F99D] w-1/3" />
                </div>
                <Button variant="ghost" className="gap-4 h-12 md:h-14 px-8 md:px-12 rounded-2xl text-slate-300 hover:text-slate-900 font-bold uppercase tracking-[0.4em] text-[9px] md:text-[10px] transition-all">
                    All Nodes Synchronized <ChevronDown className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
