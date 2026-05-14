"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
    Wallet, 
    ArrowLeft, 
    Search, 
    Filter, 
    FileDown, 
    Calendar,
    History as HistoryIcon,
    ArrowUpRight,
    TrendingUp,
    Users,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

export default function PayrollHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [branches] = useState(["All Branches", "MP Branch", "Mumbai HQ", "Delhi Regional", "Bangalore Tech"]);

    // Extensive mock data for history
    const [historyData, setHistoryData] = useState([
        { id: "PAY-001", month: "APR 2026", branch: "MP Branch", totalPayout: 482400, employees: 4, date: "2026-04-02", status: "Completed", method: "Bank Transfer" },
        { id: "PAY-002", month: "MAR 2026", branch: "Mumbai HQ", totalPayout: 475200, employees: 4, date: "2026-03-01", status: "Completed", method: "Bank Transfer" },
        { id: "PAY-003", month: "FEB 2026", branch: "Delhi Regional", totalPayout: 490000, employees: 4, date: "2026-02-28", status: "Completed", method: "Bulk IMPS" },
        { id: "PAY-004", month: "JAN 2026", branch: "MP Branch", totalPayout: 460000, employees: 3, date: "2026-01-30", status: "Completed", method: "Bank Transfer" },
        { id: "PAY-005", month: "DEC 2025", branch: "Mumbai HQ", totalPayout: 510000, employees: 5, date: "2025-12-28", status: "Completed", method: "Bank Transfer" },
        { id: "PAY-006", month: "NOV 2025", branch: "All Branches", totalPayout: 485000, employees: 4, date: "2025-11-30", status: "Completed", method: "Manual" },
    ]);

    const filteredHistory = historyData.filter(item => {
        const matchesBranch = selectedBranch === "All Branches" || item.branch === selectedBranch || item.branch === "All Branches";
        const matchesSearch = item.month.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDateFrom = !dateFrom || new Date(item.date) >= new Date(dateFrom);
        const matchesDateTo = !dateTo || new Date(item.date) <= new Date(dateTo);
        return matchesSearch && matchesDateFrom && matchesDateTo && matchesBranch;
    });

    return (
        <ProtectedRoute module="PAYROLL" action="READ">
            <div className="space-y-8 pb-20">
                {/* Top Nav */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/payroll">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100 hover:bg-slate-50">
                                <ArrowLeft className="h-4 w-4 text-slate-900" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter">
                                <HistoryIcon className="h-6 w-6 text-indigo-500" /> Disbursement Vault
                            </h1>
                            <p className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-[0.4em]">Complete Historical Audit Trail</p>
                        </div>
                    </div>
                    <Button className="bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest px-6 h-10 rounded-xl shadow-xl">
                        <FileDown className="h-4 w-4 mr-2" /> Export Master Ledger
                    </Button>
                </div>

                {/* Dynamic Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    {[
                        { 
                            label: "Total Paid", 
                            val: `₹${filteredHistory.reduce((acc, curr) => acc + curr.totalPayout, 0).toLocaleString()}`, 
                            icon: Wallet, 
                            color: "text-emerald-500", 
                            bg: "bg-emerald-50" 
                        },
                        { 
                            label: "Avg. Monthly Burn", 
                            val: `₹${filteredHistory.length > 0 ? Math.round(filteredHistory.reduce((acc, curr) => acc + curr.totalPayout, 0) / filteredHistory.length).toLocaleString() : 0}`, 
                            icon: TrendingUp, 
                            color: "text-blue-500", 
                            bg: "bg-blue-50" 
                        },
                        { 
                            label: "Max Staff Disbursed", 
                            val: `${filteredHistory.reduce((acc, curr) => Math.max(acc, curr.employees), 0)} Employees`, 
                            icon: Users, 
                            color: "text-indigo-500", 
                            bg: "bg-indigo-50" 
                        },
                        { 
                            label: "Last Payout", 
                            val: filteredHistory.length > 0 ? new Date(Math.max(...filteredHistory.map(h => new Date(h.date).getTime()))).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A", 
                            icon: Calendar, 
                            color: "text-amber-500", 
                            bg: "bg-amber-50" 
                        },
                    ].map((s, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-2xl p-6 bg-white overflow-hidden relative">
                            <div className={cn("absolute -right-4 -top-4 opacity-10", s.bg)}>
                                <s.icon className="h-24 w-24" />
                            </div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <h4 className={cn("text-xl font-black italic tracking-tighter uppercase", s.color)}>{s.val}</h4>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-slate-50 flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <Input 
                            placeholder="Search by ID or Month (e.g. APR 2026)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 w-full pl-12 rounded-2xl bg-white border-none shadow-sm font-bold text-[11px] focus:ring-2 ring-indigo-100"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="h-12 w-[160px] rounded-2xl bg-white border-none shadow-sm font-black text-[9px] uppercase tracking-widest">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-none shadow-xl rounded-2xl">
                                {branches.map(b => (
                                    <SelectItem key={b} value={b} className="text-[10px] font-bold uppercase">{b}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center bg-white rounded-2xl px-4 h-12 shadow-sm gap-3">
                            <span className="text-[8px] font-black uppercase text-slate-400">From</span>
                            <input 
                                type="date" 
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold outline-none cursor-pointer" 
                            />
                        </div>
                        <div className="flex items-center bg-white rounded-2xl px-4 h-12 shadow-sm gap-3">
                            <span className="text-[8px] font-black uppercase text-slate-400">To</span>
                            <input 
                                type="date" 
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold outline-none cursor-pointer" 
                            />
                        </div>
                        <Button variant="outline" className="h-12 w-12 rounded-2xl bg-white border-none shadow-sm p-0">
                            <Filter className="h-4 w-4 text-slate-900" />
                        </Button>
                    </div>
                </div>

                {/* Ledger Table */}
                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-1">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="pl-8 h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Cycle ID</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Branch</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Payroll Month</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Disbursement Date</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Funds Released</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Count</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Mode</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHistory.map((item) => (
                                <TableRow key={item.id} className="group border-none hover:bg-slate-50/50 transition-all h-20 border-b border-dashed border-slate-50 last:border-none">
                                    <TableCell className="pl-8">
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg tracking-widest">{item.id}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[8px] h-5 px-2 rounded uppercase tracking-widest">{item.branch}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase">{item.month}</p>
                                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Financial Cycle</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-slate-900 italic">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                    <TableCell className="text-sm font-black text-slate-900">₹{item.totalPayout.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Users className="h-3.5 w-3.5 text-slate-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900">{item.employees} Staff</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-slate-50 text-slate-600 border-none font-black text-[7px] h-6 px-3 rounded-lg uppercase tracking-widest">
                                            {item.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-8 text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-9 rounded-xl border-slate-100 font-black uppercase text-[8px] tracking-widest px-5 hover:bg-slate-900 hover:text-white transition-all"
                                        >
                                            Audit Details <ChevronRight className="h-3.5 w-3.5 ml-2" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
