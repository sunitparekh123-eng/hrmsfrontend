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
    ChevronRight,
    Building2,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function PayrollHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("2026");

    // Monthly Aggregated Data
    const [historyData] = useState([
        { 
            monthId: "MAY-2026", 
            monthName: "May 2026",
            disbursementDate: "Pending",
            totalPayout: 2180000,
            totalStaff: 120,
            branches: [
                { name: "Indore Hub", payout: 900000, staff: 50 },
                { name: "Bhopal Unit", payout: 680000, staff: 40 },
                { name: "Satna Node", payout: 600000, staff: 30 },
            ],
            status: "Processing",
            method: "N/A"
        },
        { 
            monthId: "APR-2026", 
            monthName: "April 2026",
            disbursementDate: "02 May 2026",
            totalPayout: 2150000,
            totalStaff: 118,
            branches: [
                { name: "Indore Hub", payout: 880000, staff: 48 },
                { name: "Bhopal Unit", payout: 670000, staff: 40 },
                { name: "Satna Node", payout: 600000, staff: 30 },
            ],
            status: "Completed",
            method: "NEFT / RTGS"
        },
        { 
            monthId: "MAR-2026", 
            monthName: "March 2026",
            disbursementDate: "01 Apr 2026",
            totalPayout: 2120000,
            totalStaff: 115,
            branches: [
                { name: "Indore Hub", payout: 860000, staff: 46 },
                { name: "Bhopal Unit", payout: 660000, staff: 39 },
                { name: "Satna Node", payout: 600000, staff: 30 },
            ],
            status: "Completed",
            method: "NEFT / RTGS"
        },
        { 
            monthId: "FEB-2026", 
            monthName: "February 2026",
            disbursementDate: "28 Feb 2026",
            totalPayout: 2080000,
            totalStaff: 112,
            branches: [
                { name: "Indore Hub", payout: 840000, staff: 45 },
                { name: "Bhopal Unit", payout: 650000, staff: 38 },
                { name: "Satna Node", payout: 590000, staff: 29 },
            ],
            status: "Completed",
            method: "Bulk IMPS"
        },
    ]);

    const filteredHistory = historyData.filter(item => {
        const matchesSearch = item.monthName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.monthId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === "All" || item.monthId.includes(selectedYear);
        return matchesSearch && matchesYear;
    });

    const completedHistory = historyData.filter(h => h.status === "Completed");

    return (
        <ProtectedRoute module="PAYROLL" action="READ">
            <div className="space-y-8 pb-20">
                {/* Top Nav */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/payroll">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100 hover:bg-slate-50">
                                <ArrowLeft className="h-4 w-4 text-slate-900" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                                Disbursement Vault
                            </h1>
                            <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">Monthly Consolidated Audit Trail</p>
                        </div>
                    </div>
                    <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-widest px-6 h-11 rounded-xl shadow-xl transition-all hover:translate-y-[-2px]">
                        <FileDown className="h-4 w-4 mr-2" /> Export Master Ledger
                    </Button>
                </div>

                {/* Dynamic Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                    {[
                        { 
                            label: "Total Paid (2026)", 
                            val: `₹${completedHistory.reduce((acc, curr) => acc + curr.totalPayout, 0).toLocaleString()}`, 
                            icon: Wallet, 
                            color: "bg-[#D1FAE5]", 
                            textColor: "text-emerald-900"
                        },
                        { 
                            label: "Avg. Monthly Burn", 
                            val: `₹${completedHistory.length > 0 ? Math.round(completedHistory.reduce((acc, curr) => acc + curr.totalPayout, 0) / completedHistory.length).toLocaleString() : 0}`, 
                            icon: TrendingUp, 
                            color: "bg-[#E0E7FF]", 
                            textColor: "text-indigo-900"
                        },
                        { 
                            label: "Peak Staff Count", 
                            val: `${completedHistory.reduce((acc, curr) => Math.max(acc, curr.totalStaff), 0)} Staff`, 
                            icon: Users, 
                            color: "bg-[#FEF3C7]", 
                            textColor: "text-amber-900"
                        },
                        { 
                            label: "Last Payout Date", 
                            val: completedHistory.length > 0 ? completedHistory[0].disbursementDate : "N/A", 
                            icon: Calendar, 
                            color: "bg-[#FEE2E2]", 
                            textColor: "text-rose-900"
                        },
                    ].map((s, i) => (
                        <Card key={i} className={cn(s.color, "border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between h-36 group hover:shadow-md transition-all")}>
                            <div className="flex items-start justify-between">
                                <div className="bg-white/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                    <s.icon className={cn("h-5 w-5", s.textColor)} />
                                </div>
                            </div>
                            <div>
                                <h4 className={cn("text-2xl font-black italic tracking-tighter uppercase", s.textColor)}>{s.val}</h4>
                                <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{s.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-2 mx-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input 
                            placeholder="Search by Month Name (e.g. April 2026)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 w-full pl-12 rounded-xl bg-slate-50 border-none font-bold text-[11px] focus:ring-2 ring-indigo-100 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="h-12 w-[160px] rounded-xl bg-slate-50 border-none font-black text-[9px] uppercase tracking-widest">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-none shadow-xl rounded-2xl">
                                <SelectItem value="All" className="text-[10px] font-bold uppercase">All Years</SelectItem>
                                <SelectItem value="2026" className="text-[10px] font-bold uppercase">2026</SelectItem>
                                <SelectItem value="2025" className="text-[10px] font-bold uppercase">2025</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="h-12 w-12 rounded-xl bg-slate-50 border-none p-0 hover:bg-slate-100">
                            <Filter className="h-4 w-4 text-slate-900" />
                        </Button>
                    </div>
                </div>

                {/* Consolidated Ledger Table */}
                <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-1 mx-2">
                    <CardHeader className="p-6 pb-4 border-none">
                        <CardTitle className="text-lg font-black italic text-slate-900 uppercase tracking-tighter">Monthly Audit Ledger</CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="pl-8 h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Payroll Month</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Total Disbursement</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400 w-[300px]">Branch Breakdown</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Status & Date</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHistory.map((item) => (
                                <TableRow key={item.monthId} className="group border-b border-dashed border-slate-100 hover:bg-slate-50/30 transition-all h-auto last:border-none">
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-base font-black text-slate-900 italic tracking-tighter uppercase">{item.monthName}</span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{item.monthId}</Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="py-6">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-emerald-600 italic tracking-tighter">₹{item.totalPayout.toLocaleString()}</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Users className="h-3 w-3 text-slate-400" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{item.totalStaff} Staff Paid</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-6 pr-8">
                                        <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            {item.branches.map((b, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-3 w-3 text-slate-400" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{b.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{b.staff} Staff</span>
                                                        <span className="text-[10px] font-black italic text-slate-900 w-16 text-right">₹{(b.payout/1000).toFixed(0)}k</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-6">
                                        <div className="flex flex-col gap-2 items-start">
                                            <Badge className={cn(
                                                "border-none font-black text-[8px] h-6 px-3 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
                                                item.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                {item.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                                                {item.status}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{item.disbursementDate}</span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="pr-8 py-6 text-right align-middle">
                                        <Link href={`/payroll/history/${item.monthId}`}>
                                            <Button 
                                                variant="outline" 
                                                className="h-10 rounded-xl border-slate-200 font-black uppercase text-[8px] tracking-widest px-6 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                View Details <ChevronRight className="h-3.5 w-3.5 ml-2" />
                                            </Button>
                                        </Link>
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
