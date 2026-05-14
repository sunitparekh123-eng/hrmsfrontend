"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    CalendarDays,
    Plus,
    ChevronRight,
    History,
    CheckCircle2,
    XCircle,
    Clock,
    Info,
    LayoutDashboard,
    Plane,
    HeartPulse,
    UserMinus,
    ArrowUpRight,
    MoreHorizontal,
    UserCheck,
    UserX,
    MapPin,
    Calendar,
    Search,
    Download,
    User,
    MoreVertical,
    Activity
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeavePage() {
    const [activeTab, setActiveTab] = useState("requests");
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [searchTerm, setSearchTerm] = useState("");
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [pendingStatus, setPendingStatus] = useState("");
    const [adminRemarks, setAdminRemarks] = useState("");

    const [balances, setBalances] = useState({
        cl: 4,
        el: 14,
        pl: 12,
        co: 2
    });

    const [logs, setLogs] = useState([
        { id: 1, personnel: "Arjun Singh", branch: "Indore Hub", appliedOn: "14 May 2026", range: "May 10 - May 12", type: "EL", status: "Approved", color: "emerald", duration: 3, reason: "Family Function", actionBy: "Admin HQ", remarks: "Approved for family event." },
        { id: 2, personnel: "Meera Das", branch: "Bhopal Unit", appliedOn: "15 May 2026", range: "May 15", type: "SL", status: "Pending", color: "amber", duration: 1, reason: "Medical Checkup", actionBy: "---", remarks: "" },
        { id: 3, personnel: "Rahul Sharma", branch: "Indore Hub", appliedOn: "12 May 2026", range: "Dec 24 - Jan 02", type: "CL", status: "Rejected", color: "rose", duration: 9, reason: "Vacation", actionBy: "Admin HQ", remarks: "Staff shortage during this period." },
        { id: 4, personnel: "Anita Kapoor", branch: "Satna Node", appliedOn: "10 May 2026", range: "Nov 02", type: "CO", status: "Approved", color: "emerald", duration: 1, reason: "Personal Work", actionBy: "Admin HQ", remarks: "Verified." },
    ]);

    const openActionDialog = (log: any, status: string) => {
        setSelectedLog(log);
        setPendingStatus(status);
        setIsActionDialogOpen(true);
        setAdminRemarks("");
    };

    const confirmAction = () => {
        if (!selectedLog) return;
        setLogs(prev => prev.map(log => 
            log.id === selectedLog.id ? { 
                ...log, 
                status: pendingStatus, 
                color: pendingStatus === 'Approved' ? 'emerald' : 'rose', 
                actionBy: "Super Admin",
                remarks: adminRemarks || (pendingStatus === 'Approved' ? "Request approved." : "Request rejected.")
            } : log
        ));
        setIsActionDialogOpen(false);
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between px-2">
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-4">Leave Control</h1>
                    <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">Employee Absence Tracking & Approvals</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Tab Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner">
                        <Button 
                            onClick={() => setActiveTab("requests")}
                            variant="ghost" 
                            className={cn(
                                "h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                activeTab === "requests" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"
                            )}
                        >
                            Pending Requests
                        </Button>
                        <Button 
                            onClick={() => setActiveTab("history")}
                            variant="ghost" 
                            className={cn(
                                "h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
                                activeTab === "history" ? "bg-white shadow-sm text-slate-900" : "text-slate-400"
                            )}
                        >
                            Archive History
                        </Button>
                    </div>

                    <Sheet open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                        <SheetTrigger asChild>
                            <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-widest px-8 h-11 rounded-2xl shadow-xl transition-all">
                                <Plus className="h-4 w-4 mr-2" /> New Application
                            </Button>
                        </SheetTrigger>
                        {/* Sheet Content Remains Same as previous implementation for brevity in this replace call */}
                        <SheetContent className="sm:max-w-[540px] border-none shadow-2xl p-0 overflow-y-auto">
                            <div className="h-2 bg-[#D9F99D]" />
                            <div className="p-8 space-y-10">
                                <SheetHeader className="text-left space-y-2">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                        <Plane className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <SheetTitle className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Add New Leave</SheetTitle>
                                    <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                        Enter leave details and duration for admin verification.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Leave Type</Label>
                                                <Select defaultValue="cl">
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-none shadow-xl rounded-xl">
                                                        <SelectItem value="cl" className="text-[10px] font-bold uppercase">Casual Leave (CL)</SelectItem>
                                                        <SelectItem value="el" className="text-[10px] font-bold uppercase">Earned Leave (EL)</SelectItem>
                                                        <SelectItem value="pl" className="text-[10px] font-bold uppercase">Privilege Leave (PL)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Days</Label>
                                                <Input type="number" placeholder="0" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Start Date</Label>
                                                <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">End Date</Label>
                                                <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reason</Label>
                                            <textarea className="w-full h-32 rounded-xl bg-slate-50 border-slate-100 p-4 font-bold text-[11px] outline-none" placeholder="Reason for leave..." />
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter className="flex gap-3 pt-6">
                                    <Button variant="outline" onClick={() => setIsApplyOpen(false)} className="flex-1 h-12 rounded-2xl border-slate-100 font-black uppercase text-[9px] tracking-widest">Cancel</Button>
                                    <Button className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-xl">Submit Request</Button>
                                </SheetFooter>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Leave Balance Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {[
                    { type: 'Earned Leave (EL)', count: balances.el, color: 'bg-[#E0E7FF]', icon: Plane, trend: 'Annual' },
                    { type: 'Privilege Leave (PL)', count: balances.pl, color: 'bg-[#FEE2E2]', icon: HeartPulse, trend: 'Special' },
                    { type: 'Casual Leave (CL)', count: balances.cl, color: 'bg-[#D1FAE5]', icon: UserMinus, trend: 'Personal' },
                    { type: 'Comp Off (CO)', count: balances.co, color: 'bg-[#FEF3C7]', icon: Clock, trend: 'Extra' },
                ].map((tier, i) => (
                    <Card key={i} className={`${tier.color} border-none rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-lg transition-all`}>
                        <div className="flex items-center justify-between">
                            <div className="h-8 w-8 bg-white/50 rounded-lg flex items-center justify-center">
                                <tier.icon className="h-4 w-4 text-slate-600" />
                            </div>
                            <Badge className="bg-white/30 text-slate-900 border-none font-black text-[7px] uppercase tracking-widest px-2 h-5 rounded-md italic">Balance</Badge>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{tier.type}</p>
                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">{tier.count} <span className="text-[9px] uppercase font-bold text-slate-400 not-italic ml-1">Days</span></h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {/* Search & Filters (Common for both tabs but can be specific) */}
                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-2 mx-2">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
                                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                                <select 
                                    className="bg-transparent border-none text-[9px] font-black uppercase outline-none pr-2 h-full"
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                >
                                    <option>All Branches</option>
                                    <option>Indore Hub</option>
                                    <option>Bhopal Unit</option>
                                </select>
                            </div>
                            {activeTab === "history" && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3 h-10 rounded-xl border border-slate-200">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <Input type="date" className="h-full w-24 bg-transparent border-none text-[9px] font-bold uppercase p-0 focus-visible:ring-0" />
                                    <span className="text-[8px] font-black text-slate-300">TO</span>
                                    <Input type="date" className="h-full w-24 bg-transparent border-none text-[9px] font-bold uppercase p-0 focus-visible:ring-0" />
                                </div>
                            )}
                            <div className="relative group min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input 
                                    placeholder="Search Employee..." 
                                    className="h-10 pl-9 pr-4 w-full bg-slate-50 border-none rounded-xl text-[10px] font-bold focus:bg-white transition-all" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-100 font-black text-[9px] uppercase tracking-widest">
                                <Download className="h-4 w-4 mr-2" /> Export
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden mx-2">
                    <CardHeader className="p-8 pb-4 border-none">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black italic uppercase text-slate-900 tracking-tighter underline underline-offset-4 decoration-[#D9F99D]">
                                    {activeTab === "requests" ? "Pending Approval Queue" : "Historical Absence Archive"}
                                </CardTitle>
                                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {activeTab === "requests" ? "Process new applications for the current shift" : "Audit trail of all past leave events"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="text-left py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee & Branch</th>
                                    <th className="text-left py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type & Duration</th>
                                    <th className="text-left py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Leave Range</th>
                                    <th className="text-left py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Reason / Remarks</th>
                                    <th className="text-left py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Action By</th>
                                    <th className="text-left py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-right py-5 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Control</th>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {logs
                                    .filter(log => activeTab === "requests" ? log.status === "Pending" : log.status !== "Pending")
                                    .filter(log => selectedBranch === "All Branches" || log.branch === selectedBranch)
                                    .filter(log => log.personnel.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((row) => (
                                    <TableRow key={row.id} className="group border-none hover:bg-slate-50/30 transition-all border-b border-slate-50 last:border-none">
                                        <td className="py-5 px-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 rounded-lg border border-white shadow-sm">
                                                    <AvatarFallback className="bg-slate-900 text-white text-[8px] font-black">UN</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-slate-900 italic uppercase tracking-tighter">{row.personnel}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            <MapPin className="h-2 w-2" /> {row.branch}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100/50">
                                                            <div className="flex items-center gap-1">
                                                                <div className="h-1 w-1 rounded-full bg-blue-500" />
                                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">EL: 12</span>
                                                            </div>
                                                            <div className="w-[1px] h-2 bg-slate-200" />
                                                            <div className="flex items-center gap-1">
                                                                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">CL: 02</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="w-fit text-[9px] font-black text-slate-600 uppercase tracking-tight italic bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                    {row.type}
                                                </span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{row.duration} Days Total</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-900 italic tracking-tighter">{row.range}</p>
                                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock className="h-2 w-2" /> Applied: {row.appliedOn}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-bold text-slate-500 max-w-[160px] truncate uppercase tracking-widest italic leading-relaxed">
                                                    Reason:"{row.reason}"
                                                </p>
                                                {row.remarks && (
                                                    <p className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded w-fit",
                                                        row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                    )}>
                                                        Admin: {row.remarks}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-slate-300" />
                                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter italic">{row.actionBy}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <Badge className={cn(
                                                "border-none font-black text-[8px] uppercase tracking-widest px-3 h-6 rounded-lg shadow-sm",
                                                row.status === 'Approved' || row.status === 'Verified' ? 'bg-[#D1FAE5] text-emerald-600' :
                                                row.status === 'Pending' ? 'bg-[#FEF3C7] text-amber-600' : 'bg-rose-50 text-rose-600'
                                            )}>
                                                {row.status}
                                            </Badge>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                                        <MoreVertical className="h-4 w-4 text-slate-300" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl p-2 border-slate-100 shadow-xl w-40">
                                                    <DropdownMenuItem 
                                                        onClick={() => openActionDialog(row, 'Approved')}
                                                        className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-emerald-50"
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">Approve</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => openActionDialog(row, 'Rejected')}
                                                        className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-rose-50"
                                                    >
                                                        <UserX className="h-3.5 w-3.5 text-rose-600" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">Reject</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {logs.filter(log => activeTab === "requests" ? log.status === "Pending" : log.status !== "Pending").length === 0 && (
                            <div className="py-20 text-center space-y-3">
                                <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                    <Activity className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-sm font-black uppercase text-slate-400 italic tracking-widest">No entries found</h3>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Try adjusting your filters or search term</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Confirmation Dialog */}
            <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                <DialogContent className="sm:max-w-[425px] border-none shadow-2xl rounded-3xl p-8">
                    <DialogHeader className="space-y-3">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center mb-2",
                            pendingStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        )}>
                            {pendingStatus === 'Approved' ? <UserCheck className="h-6 w-6" /> : <UserX className="h-6 w-6" />}
                        </div>
                        <DialogTitle className="text-xl font-black italic uppercase text-slate-900 tracking-tighter">
                            {pendingStatus === 'Approved' ? 'Confirm Approval' : 'Confirm Rejection'}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Are you sure you want to {pendingStatus.toLowerCase()} leave for <span className="text-slate-900 font-black italic">{selectedLog?.personnel}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Admin Remarks (Optional)</Label>
                            <textarea 
                                value={adminRemarks}
                                onChange={(e) => setAdminRemarks(e.target.value)}
                                placeholder="Add a reason or message for the employee..." 
                                className="w-full min-h-[100px] p-4 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all outline-none border"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:justify-start">
                        <Button 
                            className={cn(
                                "flex-1 h-12 rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-lg transition-all",
                                pendingStatus === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                            )}
                            onClick={confirmAction}
                        >
                            Confirm {pendingStatus}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsActionDialogOpen(false)}
                            className="flex-1 h-12 rounded-2xl border-slate-100 font-black uppercase text-[9px] tracking-widest"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
