"use client";

import { useRole } from "@/context/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
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
    UserX,
    MapPin,
    ShieldCheck,
    Activity,
    UserPlus,
    Settings,
    History,
    Zap,
    Map as MapIcon,
    Globe,
    ChevronRight,
    Plus,
    FileSpreadsheet,
    Navigation,
    RefreshCw,
    Smartphone,
    Camera,
    Timer,
    Info
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

export default function AttendancePage() {
    const { hasPermission } = useRole();
    const [activeTab, setActiveTab] = useState<"live" | "history">("live");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    // Mock Data for Dashboard
    const stats = {
        total: 120,
        present: 98,
        absent: 12,
        late: 10
    };

    const [attendanceLogs, setAttendanceLogs] = useState([
        { 
            id: "EMP001", 
            name: "Arjun Singh", 
            status: "Present", 
            punchIn: "09:05 AM", 
            punchOut: "06:15 PM", 
            location: "Indore Hub", 
            distance: "12m", 
            device: "iPhone 13", 
            shift: "General", 
            hours: "9h 10m", 
            overtime: "0h 10m", 
            photoVerified: true,
            lateFine: 0
        },
        { 
            id: "EMP002", 
            name: "Meera Das", 
            status: "Late", 
            punchIn: "09:45 AM", 
            punchOut: "06:30 PM", 
            location: "Bhopal Unit", 
            distance: "45m", 
            device: "Samsung S22", 
            shift: "Day Shift", 
            hours: "8h 45m", 
            overtime: "0h 0m", 
            photoVerified: true,
            lateFine: 100
        },
        { 
            id: "EMP003", 
            name: "Rahul Sharma", 
            status: "Present", 
            punchIn: "08:55 AM", 
            punchOut: "---", 
            location: "Indore Hub", 
            distance: "8m", 
            device: "Pixel 7", 
            shift: "General", 
            hours: "Ongoing", 
            overtime: "---", 
            photoVerified: true,
            lateFine: 0
        },
        { 
            id: "EMP004", 
            name: "Anita Kapoor", 
            status: "Absent", 
            punchIn: "---", 
            punchOut: "---", 
            location: "---", 
            distance: "---", 
            device: "---", 
            shift: "Night Shift", 
            hours: "0h", 
            overtime: "---", 
            photoVerified: false,
            lateFine: 0
        },
    ]);

    return (
        <ProtectedRoute module="ATTENDANCE" action="READ">
            <div className="space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2 pt-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-4">Attendance Control</h1>
                        <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">Real-time GPS Monitoring & Deep Intelligence</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        <Button 
                            onClick={() => setActiveTab("live")}
                            variant="ghost" 
                            className={cn(
                                "h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                activeTab === "live" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"
                            )}
                        >
                            <Zap className="h-4 w-4 mr-2" /> Live Status
                        </Button>
                        <Button 
                            onClick={() => setActiveTab("history")}
                            variant="ghost" 
                            className={cn(
                                "h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                activeTab === "history" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"
                            )}
                        >
                            <History className="h-4 w-4 mr-2" /> History
                        </Button>
                    </div>
                </div>

                {activeTab === "live" && (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                            {[
                                { label: "Total Staff", value: stats.total, icon: Users2, trend: "Active", color: "bg-[#E0E7FF]", unit: "Staff" },
                                { label: "Present Today", value: stats.present, icon: UserCheck, trend: "82%", color: "bg-[#D1FAE5]", unit: "Online" },
                                { label: "Absent Today", value: stats.absent, icon: UserX, trend: "10%", color: "bg-[#FEE2E2]", unit: "Offline" },
                                { label: "Late Arrivals", value: stats.late, icon: Clock, trend: "8%", color: "bg-[#FEF3C7]", unit: "Delayed" },
                            ].map((s, i) => (
                                <Card key={i} className={`${s.color} border-none rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-lg transition-all`}>
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-8 bg-white/50 rounded-lg flex items-center justify-center">
                                            <s.icon className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <Badge className="bg-white/30 text-slate-900 border-none font-black text-[7px] uppercase tracking-widest px-2 h-5 rounded-md italic">{s.trend}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{s.label}</p>
                                        <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">
                                            {s.value} <span className="text-[9px] uppercase font-bold text-slate-400 not-italic ml-1">{s.unit}</span>
                                        </h3>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Live Monitoring Table */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden mx-2">
                            <CardHeader className="p-8 pb-4 border-none flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase text-slate-900 tracking-tighter">Live Attendance Hub</CardTitle>
                                    <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deep tracking: Shifts, OT, and Device verification</CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 rounded-xl border border-slate-100">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                        <select 
                                            className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest outline-none pr-4 h-10"
                                            value={selectedBranch}
                                            onChange={(e) => setSelectedBranch(e.target.value)}
                                        >
                                            <option value="All Branches">All Branches</option>
                                            <option value="Indore Hub">Indore Hub</option>
                                            <option value="Bhopal Unit">Bhopal Unit</option>
                                            <option value="Satna Node">Satna Node</option>
                                        </select>
                                    </div>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                        <Input 
                                            placeholder="Search Staff..." 
                                            className="h-10 w-48 pl-10 bg-slate-50 border-none rounded-xl font-bold text-[9px] focus-visible:ring-1 focus-visible:ring-[#D9F99D]" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-100 hover:bg-slate-50 transition-all">
                                        <RefreshCw className="h-4 w-4 text-slate-400" />
                                    </Button>
                                    <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-100 font-black text-[9px] uppercase tracking-widest">
                                        <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" /> Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">In/Out & Device</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location & Selfie</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift & Hours</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">OT & Remarks</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceLogs
                                            .filter(log => {
                                                const matchesSearch = log.name.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase());
                                                const matchesBranch = selectedBranch === "All Branches" || log.location === selectedBranch;
                                                return matchesSearch && matchesBranch;
                                            })
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((log) => (
                                            <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                                <td className="py-5 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center font-black italic text-xs text-slate-400 border border-white shadow-sm">
                                                            {log.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-slate-900 italic uppercase tracking-tighter">{log.name}</span>
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{log.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1.5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-slate-700 italic">IN: {log.punchIn}</span>
                                                            <span className="text-[10px] font-black text-slate-400 italic">OUT: {log.punchOut}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-60">
                                                            <Smartphone className="h-2.5 w-2.5 text-slate-400" />
                                                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{log.device}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3 text-rose-400" />
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{log.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {log.photoVerified ? (
                                                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                                                                    <Camera className="h-2.5 w-2.5" />
                                                                    <span className="text-[7px] font-black uppercase">Verified</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-300 px-2 py-0.5 rounded-md">
                                                                    <Camera className="h-2.5 w-2.5" />
                                                                    <span className="text-[7px] font-black uppercase">None</span>
                                                                </div>
                                                            )}
                                                            <span className="text-[8px] font-bold text-slate-400">{log.distance}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1.5">
                                                        <p className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">{log.shift}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <Timer className="h-3 w-3 text-slate-300" />
                                                            <span className="text-[10px] font-bold text-slate-600">{log.hours}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1.5">
                                                        {log.overtime !== "---" && log.overtime !== "0h 0m" ? (
                                                            <Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-600 font-black text-[7px] uppercase h-5 px-2">OT: {log.overtime}</Badge>
                                                        ) : (
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase">No OT</span>
                                                        )}
                                                        {log.lateFine > 0 && (
                                                            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                                                <AlertCircle className="h-2.5 w-2.5" /> Late Fine: ₹{log.lateFine}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <Badge className={cn(
                                                        "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm",
                                                        log.status === 'Present' ? "bg-emerald-50 text-emerald-600" :
                                                        log.status === 'Late' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                                    )}>
                                                        {log.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination Controls */}
                                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                        Showing Page {currentPage} of {Math.ceil(attendanceLogs.length / itemsPerPage)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="h-9 px-4 rounded-xl border-slate-200 font-black text-[9px] uppercase tracking-widest disabled:opacity-30"
                                        >
                                            Prev
                                        </Button>
                                        {[...Array(Math.ceil(attendanceLogs.length / itemsPerPage))].map((_, i) => (
                                            <Button
                                                key={i}
                                                variant={currentPage === i + 1 ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={cn(
                                                    "h-9 w-9 rounded-xl font-black text-[9px] border-slate-200",
                                                    currentPage === i + 1 ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-white"
                                                )}
                                            >
                                                {i + 1}
                                            </Button>
                                        ))}
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(attendanceLogs.length / itemsPerPage), prev + 1))}
                                            disabled={currentPage === Math.ceil(attendanceLogs.length / itemsPerPage)}
                                            className="h-9 px-4 rounded-xl border-slate-200 font-black text-[9px] uppercase tracking-widest disabled:opacity-30"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === "history" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
                        {/* History Search & Filters */}
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white ">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                                <div className="space-y-2">
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Date Picker Group */}
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200 shadow-sm">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            <Input type="date" className="h-full w-28 bg-transparent border-none text-[9px] font-bold uppercase p-0 focus-visible:ring-0" />
                                            <span className="text-[8px] font-black text-slate-300">TO</span>
                                            <Input type="date" className="h-full w-28 bg-transparent border-none text-[9px] font-bold uppercase p-0 focus-visible:ring-0" />
                                        </div>

                                        {/* Branch Select */}
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200 shadow-sm">
                                            <MapPin className="h-3.5 w-3.5 text-rose-400" />
                                            <select className="bg-transparent border-none text-[9px] font-black uppercase outline-none pr-2 h-full">
                                                <option>All Branches</option>
                                                <option>Indore Hub</option>
                                                <option>Bhopal Unit</option>
                                            </select>
                                        </div>

                                        {/* Search Input */}
                                        <div className="relative group min-w-[200px]">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                            <Input 
                                                placeholder="Search Employee..." 
                                                className="h-10 pl-9 pr-4 w-full bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold focus:bg-white transition-all shadow-sm" 
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">
                                            Fetch Data
                                        </Button>
                                        <Button variant="outline" className="h-10 w-10 rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center">
                                            <Download className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* History Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Avg Attendance", value: "94.2%", desc: "Consistency Rate", icon: Activity, color: "emerald", trend: "+2.1%" },
                                { label: "Late Frequency", value: "42", desc: "Total Incidents", icon: AlertCircle, color: "rose", trend: "-5%" },
                                { label: "Active Nodes", value: "118/120", desc: "Resource Utilization", icon: Globe, color: "blue", trend: "Stable" },
                                { label: "Work Hours", value: "2,480", desc: "Total Production", icon: Timer, color: "amber", trend: "+120h" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white p-6 relative overflow-hidden group">
                                    <div className={cn("absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-[0.03] transition-transform group-hover:scale-110", `bg-${stat.color}-500`)} />
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", 
                                                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
                                                stat.color === 'rose' ? "bg-rose-50 text-rose-500" :
                                                stat.color === 'blue' ? "bg-blue-50 text-blue-500" : "bg-amber-50 text-amber-500"
                                            )}>
                                                <stat.icon className="h-5 w-5" />
                                            </div>
                                            <Badge className={cn("font-black text-[7px] uppercase tracking-widest border-none", 
                                                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : 
                                                stat.trend.startsWith('-') ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
                                            )}>{stat.trend}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black italic text-slate-900">{stat.value}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                        </div>
                                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={cn("h-full rounded-full", 
                                                stat.color === 'emerald' ? "bg-emerald-400 w-4/5" :
                                                stat.color === 'rose' ? "bg-rose-400 w-1/4" :
                                                stat.color === 'blue' ? "bg-blue-400 w-full" : "bg-amber-400 w-3/4"
                                            )} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Detailed History Table */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-8 pb-4 border-none flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-black italic uppercase text-slate-900 tracking-tighter">Historical Data Logs</CardTitle>
                                    <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit trail of all attendance events</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">U</div>
                                        ))}
                                        <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[7px] font-black text-[#D9F99D] shadow-sm">+8</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Employee</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">In/Out & Device</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location & Selfie</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift & Hours</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">OT & Remarks</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { date: "14 May 2026", name: "Arjun Singh", id: "EMP001", hub: "Indore HQ", shift: "General", hours: "9h 15m", ot: "15m", status: "Present", in: "09:05 AM", out: "06:20 PM", device: "iPhone 13", photo: true, fine: 0, dist: "12m" },
                                            { date: "14 May 2026", name: "Meera Das", id: "EMP002", hub: "Bhopal Unit", shift: "Day Shift", hours: "8h 30m", ot: "---", status: "Present", in: "09:10 AM", out: "05:40 PM", device: "Samsung S22", photo: true, fine: 0, dist: "45m" },
                                            { date: "13 May 2026", name: "Rahul Sharma", id: "EMP003", hub: "Indore HQ", shift: "General", hours: "10h 45m", ot: "1h 45m", status: "Present", in: "08:50 AM", out: "07:35 PM", device: "Pixel 7", photo: true, fine: 0, dist: "8m" },
                                            { date: "13 May 2026", name: "Anita Kapoor", id: "EMP004", hub: "Satna Node", shift: "Night Shift", hours: "9h 00m", ot: "---", status: "Present", in: "09:00 PM", out: "06:00 AM", device: "OnePlus 11", photo: false, fine: 0, dist: "110m" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                                <td className="py-5 px-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-slate-900 italic uppercase tracking-tighter">{row.name}</span>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{row.date} • {row.id}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1.5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-slate-700 italic">IN: {row.in}</span>
                                                            <span className="text-[10px] font-black text-slate-400 italic">OUT: {row.out}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-60">
                                                            <Smartphone className="h-2.5 w-2.5 text-slate-400" />
                                                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{row.device}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3 text-rose-400" />
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{row.hub}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {row.photo ? (
                                                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                                                                    <Camera className="h-2.5 w-2.5" />
                                                                    <span className="text-[7px] font-black uppercase">Verified</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 bg-slate-50 text-slate-300 px-2 py-0.5 rounded-md">
                                                                    <Camera className="h-2.5 w-2.5" />
                                                                    <span className="text-[7px] font-black uppercase">None</span>
                                                                </div>
                                                            )}
                                                            <span className="text-[8px] font-bold text-slate-400">{row.dist}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1.5">
                                                        <p className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">{row.shift}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <Timer className="h-3 w-3 text-slate-300" />
                                                            <span className="text-[10px] font-bold text-slate-600">{row.hours}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1.5">
                                                        {row.ot !== "---" ? (
                                                            <Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-600 font-black text-[7px] uppercase h-5 px-2">OT: {row.ot}</Badge>
                                                        ) : (
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase">Standard</span>
                                                        )}
                                                        {row.fine > 0 && (
                                                            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                                                <AlertCircle className="h-2.5 w-2.5" /> Fine: ₹{row.fine}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <Badge className={cn(
                                                        "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm",
                                                        row.status === 'Present' ? "bg-emerald-50 text-emerald-600" :
                                                        row.status === 'Late' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                                    )}>
                                                        {row.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing Last 4 Historical Entries</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
