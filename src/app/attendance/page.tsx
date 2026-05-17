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
    const [activeTab, setActiveTab] = useState<"live" | "history" | "monthly">("monthly");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [selectedStatus, setSelectedStatus] = useState<"All" | "Present" | "Absent" | "Late">("All");

    // Dynamic Calendar State
    const [currentDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // Helper to get days in month
    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    // Map State
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedMapLog, setSelectedMapLog] = useState<any>(null);

    const openMap = (log: any) => {
        setSelectedMapLog(log);
        setIsMapOpen(true);
    };
    
    // Manual Attendance State
    const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
    const [manualEmpId, setManualEmpId] = useState("");
    const [manualDate, setManualDate] = useState("");
    const [manualStatus, setManualStatus] = useState("Present");
    const [manualReason, setManualReason] = useState("");
    
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

                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={() => setIsManualEntryOpen(true)}
                            className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-widest px-6 h-11 rounded-2xl shadow-md transition-all hover:translate-y-[-2px]"
                        >
                            <UserPlus className="h-4 w-4 mr-2 text-[#D9F99D]" /> Manual Entry
                        </Button>
                        <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <Button 
                                onClick={() => setActiveTab("live")}
                                variant="ghost" 
                                className={cn(
                                    "h-10 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                    activeTab === "live" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                <Zap className="h-4 w-4 mr-2" /> Live Status
                            </Button>
                            <Button 
                                onClick={() => setActiveTab("history")}
                                variant="ghost" 
                                className={cn(
                                    "h-10 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                    activeTab === "history" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                <History className="h-4 w-4 mr-2" /> History
                            </Button>
                            <Button 
                                onClick={() => setActiveTab("monthly")}
                                variant="ghost" 
                                className={cn(
                                    "h-10 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                    activeTab === "monthly" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-900"
                                )}
                            >
                                <Calendar className="h-4 w-4 mr-2" /> Monthly Grid
                            </Button>
                        </div>
                    </div>
                </div>

                {activeTab === "live" && (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                            {[
                                { label: "Total Staff", value: stats.total, icon: Users2, trend: "Active", color: "bg-[#E0E7FF]", unit: "Staff", statusFilter: "All" },
                                { label: "Present Today", value: stats.present, icon: UserCheck, trend: "82%", color: "bg-[#D1FAE5]", unit: "Online", statusFilter: "Present" },
                                { label: "Absent Today", value: stats.absent, icon: UserX, trend: "10%", color: "bg-[#FEE2E2]", unit: "Offline", statusFilter: "Absent" },
                                { label: "Late Arrivals", value: stats.late, icon: Clock, trend: "8%", color: "bg-[#FEF3C7]", unit: "Delayed", statusFilter: "Late" },
                            ].map((s, i) => (
                                <Card 
                                    key={i} 
                                    onClick={() => {
                                        setSelectedStatus(s.statusFilter as "All" | "Present" | "Absent" | "Late");
                                        setCurrentPage(1);
                                    }}
                                    className={cn(
                                        s.color,
                                        "border-none rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-lg transition-all cursor-pointer",
                                        selectedStatus === s.statusFilter ? "scale-[1.02] shadow-md" : "hover:scale-[1.02]"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-8 bg-white/50 rounded-lg flex items-center justify-center">
                                            <s.icon className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedStatus === s.statusFilter && (
                                                <div className="h-2 w-2 rounded-full bg-slate-900 shadow-sm" />
                                            )}
                                            <Badge className="bg-white/30 text-slate-900 border-none font-black text-[7px] uppercase tracking-widest px-2 h-5 rounded-md italic">{s.trend}</Badge>
                                        </div>
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
                                    <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Staff Tracking</CardDescription>
                                </div>
                                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-none w-full xl:w-auto">
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 shrink-0 rounded-xl border border-slate-100">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                        <select 
                                            className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest outline-none pr-2 h-10 cursor-pointer"
                                            value={selectedBranch}
                                            onChange={(e) => setSelectedBranch(e.target.value)}
                                        >
                                            <option value="All Branches">All Branches</option>
                                            <option value="Indore Hub">Indore Hub</option>
                                            <option value="Bhopal Unit">Bhopal Unit</option>
                                            <option value="Satna Node">Satna Node</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 shrink-0 rounded-xl border border-slate-100">
                                        <Filter className="h-3.5 w-3.5 text-slate-400" />
                                        <select 
                                            className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest outline-none pr-2 h-10 cursor-pointer"
                                            value={selectedStatus}
                                            onChange={(e) => {
                                                setSelectedStatus(e.target.value as any);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Late">Late</option>
                                        </select>
                                    </div>
                                    <div className="relative group shrink-0">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                        <Input 
                                            placeholder="Search Staff..." 
                                            className="h-10 w-36 pl-9 bg-slate-50 border-none rounded-xl font-bold text-[9px] focus-visible:ring-1 focus-visible:ring-[#D9F99D]" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" className="h-10 w-10 p-0 shrink-0 rounded-xl border-slate-100 hover:bg-slate-50 transition-all">
                                        <RefreshCw className="h-4 w-4 text-slate-400" />
                                    </Button>
                                    <Button variant="outline" className="h-10 px-4 shrink-0 rounded-xl border-slate-100 font-black text-[9px] uppercase tracking-widest">
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
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Remarks</th>
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceLogs
                                            .filter(log => {
                                                const matchesSearch = log.name.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase());
                                                const matchesBranch = selectedBranch === "All Branches" || log.location === selectedBranch;
                                                const matchesStatus = selectedStatus === "All" || log.status === selectedStatus;
                                                return matchesSearch && matchesBranch && matchesStatus;
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
                                                        <div className="flex items-center gap-2 group/loc">
                                                            <MapPin className="h-3 w-3 text-rose-400" />
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{log.location}</span>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-6 w-6 rounded-md bg-blue-50/50 hover:bg-blue-100 transition-colors ml-1"
                                                                onClick={() => openMap(log)}
                                                                title="View on Map"
                                                            >
                                                                <MapIcon className="h-3.5 w-3.5 text-blue-500" />
                                                            </Button>
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
                                                        <span className="text-[9px] font-bold text-slate-400 italic">No special remarks</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="flex items-center gap-2 group/status">
                                                        <Badge className={cn(
                                                            "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
                                                            log.status === 'Present' ? "bg-emerald-50 text-emerald-600" :
                                                            log.status === 'Late' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                                        )}
                                                        onClick={() => {
                                                            setManualEmpId(log.id);
                                                            setIsManualEntryOpen(true);
                                                        }}>
                                                            {log.status}
                                                        </Badge>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-6 w-6 rounded-md opacity-0 group-hover/status:opacity-100 transition-opacity"
                                                            onClick={() => {
                                                                setManualEmpId(log.id);
                                                                setIsManualEntryOpen(true);
                                                            }}
                                                        >
                                                            <Settings className="h-3 w-3 text-slate-400" />
                                                        </Button>
                                                    </div>
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
                                        {[...Array(Math.ceil(attendanceLogs.filter(log => (selectedStatus === "All" || log.status === selectedStatus) && (selectedBranch === "All Branches" || log.location === selectedBranch) && (log.name.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase()))).length / itemsPerPage) || 1)].map((_, i) => (
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
                                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(attendanceLogs.filter(log => (selectedStatus === "All" || log.status === selectedStatus) && (selectedBranch === "All Branches" || log.location === selectedBranch) && (log.name.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase()))).length / itemsPerPage) || 1, prev + 1))}
                                            disabled={currentPage === (Math.ceil(attendanceLogs.filter(log => (selectedStatus === "All" || log.status === selectedStatus) && (selectedBranch === "All Branches" || log.location === selectedBranch) && (log.name.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toLowerCase().includes(searchTerm.toLowerCase()))).length / itemsPerPage) || 1)}
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
                                            <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Remarks</th>
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
                                                        <span className="text-[9px] font-bold text-slate-400 italic">No special remarks</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="flex items-center gap-2 group/status">
                                                        <Badge className={cn(
                                                            "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
                                                            row.status === 'Present' ? "bg-emerald-50 text-emerald-600" :
                                                            row.status === 'Late' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                                        )}
                                                        onClick={() => {
                                                            setManualEmpId(row.id);
                                                            setIsManualEntryOpen(true);
                                                        }}>
                                                            {row.status}
                                                        </Badge>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-6 w-6 rounded-md opacity-0 group-hover/status:opacity-100 transition-opacity"
                                                            onClick={() => {
                                                                setManualEmpId(row.id);
                                                                setIsManualEntryOpen(true);
                                                            }}
                                                        >
                                                            <Settings className="h-3 w-3 text-slate-400" />
                                                        </Button>
                                                    </div>
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

                {activeTab === "monthly" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-8 pb-6 border-b border-slate-50 flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-xl font-black italic uppercase text-slate-900 tracking-tighter">Monthly Attendance</CardTitle>
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                            <select 
                                                value={selectedMonth} 
                                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                                className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 outline-none cursor-pointer"
                                            >
                                                {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                            </select>
                                            <span className="text-slate-300">/</span>
                                            <select 
                                                value={selectedYear} 
                                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                                className="bg-transparent border-none text-[10px] font-black uppercase text-slate-700 outline-none cursor-pointer"
                                            >
                                                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                                        {daysInSelectedMonth} Days in {monthNames[selectedMonth]} {selectedYear} <br/>
                                        <span className="text-emerald-500">Payable Days</span> = Present + Paid Leave + Weekly Off + Holiday
                                    </CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-4">
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" className="h-11 px-6 rounded-2xl border-slate-200 text-slate-600 font-black text-[9px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-500" /> Declare Holiday
                                        </Button>
                                        <Button className="h-11 px-8 rounded-2xl bg-slate-900 hover:bg-black text-[#D9F99D] font-black text-[9px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 hover:translate-y-[-2px]">
                                            <RefreshCw className="h-4 w-4" /> Sync To Payroll
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div><span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Present</span></div>
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div><span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Absent/LWP</span></div>
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div><span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Leave</span></div>
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-slate-300"></div><span className="text-[8px] font-black uppercase tracking-widest text-slate-500">WOff</span></div>
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div><span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Holiday</span></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto pb-4">
                                <Table className="w-max min-w-full">
                                    <TableHeader>
                                        <tr className="bg-white border-b border-slate-100">
                                            <th className="text-left py-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-white z-20 w-56 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] border-r border-slate-50">
                                                Employee Details
                                            </th>
                                            <th className="text-center py-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[90px] bg-emerald-50/30 border-r border-slate-50">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-emerald-600">Payable</span>
                                                </div>
                                            </th>
                                            <th className="text-center py-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest min-w-[90px] bg-rose-50/30 border-r border-slate-50">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-rose-600">LWP</span>
                                                </div>
                                            </th>
                                            {[...Array(daysInSelectedMonth)].map((_, i) => {
                                                const dateObj = new Date(selectedYear, selectedMonth, i + 1);
                                                const isToday = 
                                                    dateObj.getDate() === currentDate.getDate() && 
                                                    dateObj.getMonth() === currentDate.getMonth() && 
                                                    dateObj.getFullYear() === currentDate.getFullYear();
                                                
                                                return (
                                                    <th key={i} className={cn("text-center py-4 px-1 min-w-[32px] transition-all", isToday ? "bg-indigo-50 border-b-2 border-b-indigo-500" : "")}>
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className={cn("text-[9px] font-black", isToday ? "text-indigo-700" : "text-slate-900")}>
                                                                {String(i + 1).padStart(2, '0')}
                                                            </span>
                                                            <span className={cn("text-[6px] font-bold uppercase", isToday ? "text-indigo-500" : "text-slate-400")}>
                                                                {dayNames[dateObj.getDay()]}
                                                            </span>
                                                        </div>
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { id: "EMP001", name: "Sandeep Chouhan", role: "Manager", salary: 85000, present: 23, woff: 4, leave: 0, holiday: 1, absent: 3, grid: "PPPPWPPPPPWPPPPPAAPPPWPPPHPLWP" },
                                            { id: "EMP002", name: "Birju Sharma", role: "Developer", salary: 65000, present: 25, woff: 5, leave: 0, holiday: 1, absent: 0, grid: "PPPPWPPPPPWPPPPPWPPPPPWPPPHWPP" },
                                            { id: "EMP003", name: "Ashwin", role: "Designer", salary: 45000, present: 20, woff: 4, leave: 0, holiday: 1, absent: 6, grid: "PPAAWPPPPPWPAAAAWPPPPPWPPPHWPP" },
                                            { id: "EMP004", name: "Shravan Muniya", role: "Analyst", salary: 55000, present: 23, woff: 4, leave: 1, holiday: 1, absent: 2, grid: "PPPPWPPPPPWPPPPPWPAAPWWPPPHWPP" },
                                        ].map((emp, idx) => {
                                            const payable = emp.present + emp.woff + emp.leave + emp.holiday;
                                            const dailyRate = Math.round(emp.salary / daysInSelectedMonth);
                                            return (
                                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                                    <td className="py-3 px-6 sticky left-0 bg-white group-hover:bg-slate-50/50 transition-colors z-10 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] border-r border-slate-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center font-black italic text-[10px] text-white shadow-md">
                                                                {emp.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-slate-900 italic uppercase tracking-tighter truncate w-32">{emp.name}</span>
                                                                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{emp.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center border-r border-slate-50 bg-emerald-50/10">
                                                        <div className="flex flex-col items-center justify-center gap-0.5" title={`Estimated Month Payout: ₹${(payable * dailyRate).toLocaleString('en-IN')} \n(${payable} Days x ₹${dailyRate}/day)`}>
                                                            <Badge className="bg-emerald-500 text-white font-black text-[10px] h-6 px-3 rounded-md shadow-sm hover:bg-emerald-600 cursor-help">{payable}</Badge>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center border-r border-slate-50 bg-rose-50/10">
                                                        <div title={`Total Salary Deduction: ₹${(emp.absent * dailyRate).toLocaleString('en-IN')} \n(${emp.absent} Days x ₹${dailyRate}/day)`}>
                                                            <Badge className={cn("font-black text-[10px] h-6 px-3 rounded-md shadow-sm cursor-help", emp.absent > 0 ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}>{emp.absent}</Badge>
                                                        </div>
                                                    </td>
                                                    {[...Array(daysInSelectedMonth)].map((_, dayIdx) => {
                                                        const status = emp.grid[dayIdx] || 'W'; // mock fallback if array is short
                                                        const dateObj = new Date(selectedYear, selectedMonth, dayIdx + 1);
                                                        const isToday = 
                                                            dateObj.getDate() === currentDate.getDate() && 
                                                            dateObj.getMonth() === currentDate.getMonth() && 
                                                            dateObj.getFullYear() === currentDate.getFullYear();
                                                        
                                                        const earnedToday = status === 'A' ? 0 : dailyRate;
                                                        const statusText = status === 'P' ? 'Present' : status === 'A' ? 'Absent (LWP)' : status === 'W' ? 'Weekly Off' : status === 'H' ? 'Holiday' : 'Paid Leave';
                                                        
                                                        return (
                                                            <td key={dayIdx} className={cn("py-3 px-1 text-center transition-all", isToday ? "bg-indigo-50/30" : "")}>
                                                                <div 
                                                                    title={`${dayIdx + 1} ${monthNames[selectedMonth]} - ${statusText} \nPayout: ₹${earnedToday.toLocaleString('en-IN')}`}
                                                                    className={cn(
                                                                        "h-6 w-6 mx-auto rounded-md flex items-center justify-center text-[8px] font-black transition-transform hover:scale-110 cursor-help shadow-sm border",
                                                                        status === 'P' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                        status === 'A' ? "bg-rose-500 text-white shadow-rose-200 border-rose-600" :
                                                                        status === 'H' ? "bg-blue-500 text-white shadow-blue-200 border-blue-600" :
                                                                        status === 'L' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                                        "bg-slate-100 text-slate-400 border-slate-200 opacity-60"
                                                                    )}
                                                                >
                                                                    {status}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Manual Attendance Entry Dialog */}
            <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-0 overflow-hidden bg-white border-none shadow-2xl">
                    <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <ShieldCheck className="h-24 w-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                                <UserCheck className="h-7 w-7 text-[#D9F99D]" />
                            </div>
                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">Manual Override</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                Admin Privileged Action
                            </DialogDescription>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Employee ID</Label>
                            <Input 
                                placeholder="e.g. EMP005" 
                                value={manualEmpId}
                                onChange={(e) => setManualEmpId(e.target.value)}
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold text-xs uppercase"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date</Label>
                                <Input 
                                    type="date"
                                    value={manualDate}
                                    onChange={(e) => setManualDate(e.target.value)}
                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold text-xs uppercase"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</Label>
                                <select 
                                    value={manualStatus}
                                    onChange={(e) => setManualStatus(e.target.value)}
                                    className="h-12 w-full px-3 rounded-xl bg-slate-50 border-none font-bold text-[10px] uppercase outline-none focus:ring-2 ring-indigo-100"
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Half Day">Half Day</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Authorized Reason & Log</Label>
                            <textarea 
                                placeholder="Provide detailed reason for manual entry..." 
                                value={manualReason}
                                onChange={(e) => setManualReason(e.target.value)}
                                className="w-full h-24 p-4 rounded-xl bg-slate-50 border-none font-bold text-xs resize-none outline-none focus:ring-2 ring-indigo-100"
                            />
                        </div>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Info className="h-3 w-3" /> Logged as Admin
                        </span>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setIsManualEntryOpen(false)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-xl hover:bg-slate-200">Cancel</Button>
                            <Button onClick={() => setIsManualEntryOpen(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[9px] tracking-widest rounded-xl px-6 shadow-md transition-all hover:translate-y-[-2px]">Submit</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Google Map Dialog */}
            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 bg-white absolute top-0 left-0 right-0 z-10 shadow-sm opacity-95">
                        <DialogTitle className="text-xl font-black italic uppercase text-slate-900 tracking-tighter flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-rose-500" /> {selectedMapLog?.name}'s Punch Location
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Recorded from: {selectedMapLog?.location}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full h-[400px] bg-slate-100 relative pt-24">
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 backdrop-blur-md z-20">
                            <div className="h-16 w-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4">
                                <MapIcon className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 italic tracking-tighter uppercase mb-1">Google Maps API Required</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-[250px] text-center leading-relaxed">
                                Connect your Google Cloud Console API Key in the backend to render the live map iframe here.
                            </p>
                            <Button 
                                className="mt-6 h-10 px-6 rounded-xl bg-slate-900 text-[#D9F99D] hover:bg-black font-black text-[9px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-2"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMapLog?.location || '')}`, '_blank')}
                            >
                                Open in External Google Maps <ArrowUpRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </ProtectedRoute>
    );
}
