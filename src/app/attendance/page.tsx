"use client";

import { useState } from "react";
import {
    Clock,
    Calendar,
    Search,
    Filter,
    Download,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MoreHorizontal,
    LayoutGrid,
    Users2,
    Check,
    UserCheck,
    Ban,
    UserX
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export default function AttendancePage() {
    const [view, setView] = useState<"audit" | "roster">("audit");
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [employees, setEmployees] = useState([
        { id: "EMP-012", name: "Arjun Singh", status: "Present", entry: "09:05 AM", exit: "06:15 PM", shift: "General G-01", color: "emerald" },
        { id: "EMP-045", name: "Meera Das", status: "Late", entry: "09:45 AM", exit: "06:45 PM", shift: "General G-01", color: "amber" },
        { id: "EMP-089", name: "EMP-089", status: "On-Duty", nameFull: "Rahul Sharma", entry: "08:55 AM", exit: "---", shift: "Field Node X", color: "blue" },
        { id: "EMP-032", name: "Anita Kapoor", status: "Present", entry: "09:00 AM", exit: "06:05 PM", shift: "Night N-02", color: "emerald" },
        { id: "EMP-102", name: "Kunal Jain", status: "Absent", entry: "---", exit: "---", shift: "General G-01", color: "rose" },
    ]);

    const [isOverrideOpen, setIsOverrideOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState("");
    const [overrideStatus, setOverrideStatus] = useState("Present");
    const [overrideTime, setOverrideTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

    const markAttendance = (id: string, newStatus: string, color: string, time?: string) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, status: newStatus, color, entry: time || emp.entry } : emp
        ));
    };

    const handleManualOverride = () => {
        const emp = employees.find(e => e.id === selectedEmp || e.name === selectedEmp);
        if (emp) {
            const color = overrideStatus === "Present" ? "emerald" : overrideStatus === "Late" ? "amber" : "rose";
            markAttendance(emp.id, overrideStatus, color, overrideTime);
            setIsOverrideOpen(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header (Simplified) */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 italic">
                            <Clock className="h-8 w-8 text-orange-400 stroke-[2.5]" /> Presence Audit & Roster
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.3em]">Operational Presence Dashboard • Daily Cycle</p>
                    </div>
                    {isCheckedIn && (
                        <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px] tracking-widest px-4 h-8 rounded-xl animate-pulse">
                            ACTIVE SESSION: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => setIsCheckedIn(!isCheckedIn)}
                        className={cn(
                            "h-14 px-10 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl transition-all hover:translate-y-[-2px]",
                            isCheckedIn
                                ? "bg-rose-500 text-white hover:bg-rose-600"
                                : "bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a]"
                        )}
                    >
                        {isCheckedIn ? "Terminate Shift (Punch Out)" : "Initiate Shift (Punch In)"}
                        <ArrowUpRight className="h-5 w-5 ml-3" />
                    </Button>
                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                        <Button
                            variant={view === "audit" ? "default" : "ghost"}
                            onClick={() => setView("audit")}
                            className={`h-10 px-6 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${view === "audit" ? "bg-slate-900 text-white" : "text-slate-400"}`}
                        >
                            Daily Audit
                        </Button>
                        <Button
                            variant={view === "roster" ? "default" : "ghost"}
                            onClick={() => setView("roster")}
                            className={`h-10 px-6 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${view === "roster" ? "bg-slate-900 text-white" : "text-slate-400"}`}
                        >
                            Shift Roster
                        </Button>
                    </div>

                    <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[10px] tracking-widest px-8 h-14 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all">
                                <UserPlus className="h-5 w-5 mr-3" /> Manual Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-10 border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Manual Override</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                    Admin Presence Protocol • Bypassing standard registry
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-8 py-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Personnel Node (ID/Name)</Label>
                                    <Input
                                        placeholder="EMP-XXX or Name"
                                        value={selectedEmp}
                                        onChange={(e) => setSelectedEmp(e.target.value)}
                                        className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-xs focus-visible:ring-2 focus-visible:ring-[#D9F99D] shadow-inner"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status Phase</Label>
                                        <select
                                            value={overrideStatus}
                                            onChange={(e) => setOverrideStatus(e.target.value)}
                                            className="w-full h-14 bg-slate-50 border-none rounded-2xl font-bold text-xs focus-visible:ring-2 focus-visible:ring-[#D9F99D] px-4 shadow-inner appearance-none outline-none"
                                        >
                                            <option>Present</option>
                                            <option>Late</option>
                                            <option>Absent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Sync</Label>
                                        <Input
                                            value={overrideTime}
                                            onChange={(e) => setOverrideTime(e.target.value)}
                                            className="h-14 bg-slate-50 border-none rounded-2xl font-bold text-xs focus-visible:ring-2 focus-visible:ring-[#D9F99D] shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleManualOverride}
                                    className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[10px] tracking-widest w-full h-14 rounded-2xl shadow-xl transition-all"
                                >
                                    Verify & Log Entry
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {[
                    { label: 'Personnel Present', value: '2,401', icon: CheckCircle2, bg: 'bg-[#D1FAE5]', color: 'text-emerald-600' },
                    { label: 'Delayed Entry', value: '142', icon: Clock, bg: 'bg-[#FEF3C7]', color: 'text-amber-600' },
                    { label: 'Unverified Absence', value: '24', icon: XCircle, bg: 'bg-[#FEE2E2]', color: 'text-rose-600' },
                    { label: 'Unit Coverage', value: '98%', icon: LayoutGrid, bg: 'bg-[#E0E7FF]', color: 'text-blue-600' },
                ].map((m, i) => (
                    <Card key={i} className={`${m.bg} border-none rounded-[2rem] md:rounded-3xl shadow-sm relative overflow-hidden h-40 md:h-45 group`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 md:px-8 pt-6 md:pt-8">
                            <CardTitle className="text-[10px] md:text-[11px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                                <m.icon className="h-4 w-4" /> {m.label}
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-slate-900/20 group-hover:text-slate-900 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl md:text-5xl font-bold text-slate-900 absolute bottom-4 right-6">{m.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="border-none shadow-sm rounded-3xl md:rounded-[3.5rem] bg-white overflow-hidden p-2">
                <CardHeader className="p-6 md:p-12 pb-6 border-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                        <div>
                            <CardTitle className="text-xl md:text-2xl font-black italic text-slate-900 underline underline-offset-8 decoration-[#D9F99D] decoration-4 uppercase tracking-tighter">Operational Ledger</CardTitle>
                            <CardDescription className="text-[10px] md:text-xs font-bold text-slate-400 mt-6 md:mt-8 uppercase tracking-[0.3em] italic">Verified Registry • Live presence data</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="relative group flex-1">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <Input placeholder="Query personnel..." className="h-12 md:h-14 w-full sm:w-72 pl-14 bg-slate-50 border-none rounded-xl md:rounded-2xl font-bold text-xs focus-visible:ring-2 focus-visible:ring-[#D9F99D] shadow-inner" />
                            </div>
                            <Button variant="outline" className="h-12 md:h-14 px-8 rounded-xl md:rounded-2xl border-2 md:border-4 border-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                                <Download className="h-5 w-5 mr-3" /> Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 md:p-0 md:mt-8">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 border-slate-50 hover:bg-transparent">
                                    <TableHead className="pl-12 h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Personnel Node</TableHead>
                                    <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Registry Status</TableHead>
                                    <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Entry Phase</TableHead>
                                    <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Exit Phase</TableHead>
                                    <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Shift Protocol</TableHead>
                                    <TableHead className="pr-12 text-right h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((row) => (
                                    <TableRow key={row.id} className="group border-none hover:bg-slate-50/50 transition-all h-28 border-b border-dashed border-slate-50 last:border-none">
                                        <TableCell className="pl-12">
                                            <div className="flex items-center gap-5">
                                                <Avatar className="h-12 w-12 border-4 border-white shadow-md">
                                                    <AvatarFallback className="bg-slate-100 font-black text-[10px] text-slate-400">
                                                        {(row.nameFull || row.name).split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-base font-black text-slate-900 italic tracking-tight group-hover:translate-x-1 transition-transform">{row.nameFull || row.name}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">{row.id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Badge className={cn(
                                                    "border-none font-black text-[9px] uppercase tracking-widest px-4 h-7 rounded-xl shadow-sm",
                                                    row.color === 'emerald' ? 'bg-[#D1FAE5] text-emerald-600' :
                                                        row.color === 'amber' ? 'bg-[#FEF3C7] text-amber-600' :
                                                            row.color === 'blue' ? 'bg-[#DBEAFE] text-blue-600' : 'bg-[#FEE2E2] text-rose-600'
                                                )}>
                                                    {row.status}
                                                </Badge>
                                                {row.status !== "Present" && (
                                                    <Button
                                                        onClick={() => markAttendance(row.id, "Present", "emerald")}
                                                        size="icon"
                                                        className="h-7 w-7 rounded-lg bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] shadow-sm transform scale-0 group-hover:scale-100 transition-all duration-300"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-black text-slate-700 italic">{row.entry}</TableCell>
                                        <TableCell className="text-sm font-black text-slate-700 italic">{row.exit}</TableCell>
                                        <TableCell className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic bg-slate-50/50 px-3 py-1.5 rounded-lg inline-block">{row.shift}</TableCell>
                                        <TableCell className="pr-12 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                                    <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 p-2 italic">Mark Attendance</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                    <DropdownMenuItem
                                                        onClick={() => markAttendance(row.id, "Present", "emerald")}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50 group/item"
                                                    >
                                                        <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                            <UserCheck className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Mark Present</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => markAttendance(row.id, "Late", "amber")}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-amber-50"
                                                    >
                                                        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                                            <Clock className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Mark Late</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => markAttendance(row.id, "Absent", "rose")}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-rose-50"
                                                    >
                                                        <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                                                            <UserX className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Mark Absent</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-6 md:hidden pb-6">
                        {employees.map((row) => (
                            <div key={row.id} className="bg-slate-50/50 rounded-2xl p-6 space-y-4 border border-slate-100/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-slate-100 font-black text-[9px] text-slate-400">
                                                {(row.nameFull || row.name).split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 italic tracking-tight">{row.nameFull || row.name}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">{row.id}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm transition-all border border-slate-100">
                                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                            <DropdownMenuItem onClick={() => markAttendance(row.id, "Present", "emerald")} className="text-[10px] font-bold uppercase p-2.5 rounded-xl">Present</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => markAttendance(row.id, "Late", "amber")} className="text-[10px] font-bold uppercase p-2.5 rounded-xl">Late</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => markAttendance(row.id, "Absent", "rose")} className="text-[10px] font-bold uppercase p-2.5 rounded-xl">Absent</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Temporal Phase</p>
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn(
                                                "border-none font-black text-[8px] uppercase tracking-widest px-2 h-5 rounded-md",
                                                row.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                                    row.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                                        row.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
                                            )}>
                                                {row.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Shift Code</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{row.shift}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Entry</p>
                                        <p className="text-xs font-black text-slate-900 italic">{row.entry}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Exit</p>
                                        <p className="text-xs font-black text-slate-900 italic">{row.exit}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Decorative Shift Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                    <div className="relative space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Users2 className="h-6 w-6 text-[#D9F99D]" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tighter italic">Operational Coverage</h3>
                        </div>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest italic">Node deployment is at 94% of strategic requirements. General shift G-01 is currently over-saturated, consider workload redirection.</p>
                        <Button className="bg-[#D9F99D] text-slate-900 font-bold hover:bg-[#c8ea8a] px-10 rounded-xl h-12 shadow-sm uppercase text-[10px] tracking-widest ">Optimize Roaster</Button>
                    </div>
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900 italic flex items-center gap-3"><AlertCircle className="h-6 w-6 text-amber-500" /> Roster Conflict Protocol</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">3 personnel units have overlapping field nodes with Night shift N-02. Verify compliance logs immediately.</p>
                    </div>
                    <Button variant="link" className="p-0 h-auto self-start text-xs font-black text-rose-500 uppercase tracking-[0.2em] underline underline-offset-4 mt-6">Audit Conflict Logs</Button>
                </div>
            </div>
        </div>
    );
}
