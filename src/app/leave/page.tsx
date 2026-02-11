"use client";

import { useState } from "react";
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
    UserX
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LeavePage() {
    const [logs, setLogs] = useState([
        { id: 1, range: "Feb 10 - Feb 12", type: "Strategic", status: "Verified", icon: Plane, color: "emerald", compliance: 100 },
        { id: 2, range: "Jan 15", type: "Bio-Sync", status: "Audit Log", icon: HeartPulse, color: "amber", compliance: 85 },
        { id: 3, range: "Dec 24 - Jan 02", type: "Temporal", status: "Archived", icon: UserMinus, color: "slate", compliance: 100 },
        { id: 4, range: "Nov 02", type: "Bio-Sync", status: "Verified", icon: HeartPulse, color: "emerald", compliance: 100 },
    ]);

    const updateStatus = (id: number, status: string, color: string) => {
        setLogs(logs.map(log => log.id === id ? { ...log, status, color } : log));
    };

    return (
        <div className="space-y-6 md:space-y-10 pb-20 px-2 md:px-0">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                        <CalendarDays className="h-6 w-6 md:h-8 md:w-8 text-indigo-400 stroke-[2.5]" /> Leave Protocol Dashboard
                    </h1>
                    <p className="text-[9px] md:text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.3em]">Absence Management • Temporal Balancing</p>
                </div>
                <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[10px] tracking-widest px-10 h-14 rounded-2xl md:rounded-[1.5rem] shadow-xl hover:translate-y-[-2px] transition-all flex-1 md:flex-none">
                    <Plus className="h-5 w-5 mr-2 stroke-[3]" /> Deploy Request
                </Button>
            </div>

            {/* Balance Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[
                    { type: 'Strategic Leave', count: '14', total: '24', color: 'bg-[#E0E7FF]', icon: Plane, label: 'Annual Entitlement' },
                    { type: 'Bio-Sync Recovery', count: '06', total: '12', color: 'bg-[#FEE2E2]', icon: HeartPulse, label: 'Medical Allocation' },
                    { type: 'Temporal Flex', count: '04', total: '08', color: 'bg-[#D1FAE5]', icon: UserMinus, label: 'Casual Availability' },
                ].map((tier, i) => (
                    <Card key={i} className={`${tier.color} border-none rounded-[2rem] md:rounded-3xl shadow-sm relative overflow-hidden h-40 md:h-45 group`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 md:px-8 pt-6 md:pt-8">
                            <CardTitle className="text-[10px] md:text-[11px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                                <tier.icon className="h-4 w-4" /> {tier.type}
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-slate-900/20 group-hover:text-slate-900 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="absolute bottom-4 right-6 text-right">
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 leading-none">{tier.count}</div>
                                <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-1">/ {tier.total} TOTAL</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Temporal Ledger Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <Card className="xl:col-span-8 border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-2">
                    <CardHeader className="p-10 border-none">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-slate-900 italic underline underline-offset-4 decoration-slate-100">Temporal Ledger</h3>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <History className="h-4 w-4 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Absence Logs</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-slate-50 hover:bg-transparent">
                                    <TableHead className="pl-10 h-16 font-bold text-[10px] uppercase tracking-widest text-slate-400">Time Range</TableHead>
                                    <TableHead className="h-16 font-bold text-[10px] uppercase tracking-widest text-slate-400">Protocol Type</TableHead>
                                    <TableHead className="h-16 font-bold text-[10px] uppercase tracking-widest text-slate-400">Registry Status</TableHead>
                                    <TableHead className="h-16 font-bold text-[10px] uppercase tracking-widest text-slate-400">Compliance</TableHead>
                                    <TableHead className="pr-10 text-right h-16 font-bold text-[10px] uppercase tracking-widest text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((row) => (
                                    <TableRow key={row.id} className="border-none hover:bg-slate-50 transition-colors h-20 group">
                                        <TableCell className="pl-10">
                                            <p className="text-sm font-bold text-slate-900 italic tracking-tight underline underline-offset-4 decoration-slate-50 group-hover:decoration-[#D9F99D]">{row.range}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center">
                                                    <row.icon className="h-3.5 w-3.5 text-slate-400" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`bg-${row.color === 'emerald' ? '[#D1FAE5]' : row.color === 'amber' ? '[#FEF3C7]' : row.color === 'rose' ? '[#FEE2E2]' : '[#F1F5F9]'} text-${row.color === 'slate' ? 'slate' : row.color}-600 border-none font-bold text-[8px] uppercase tracking-[0.2em] px-3 h-5 rounded-lg transition-all`}>
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#D9F99D] transition-all" style={{ width: `${row.compliance}%` }} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-10 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(row.id, "Verified", "emerald")}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50"
                                                    >
                                                        <UserCheck className="h-4 w-4 text-emerald-600" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Approve Protocol</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(row.id, "Audit Log", "amber")}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-amber-50"
                                                    >
                                                        <Clock className="h-4 w-4 text-amber-600" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Review Audit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => updateStatus(row.id, "Rejected", "rose")}
                                                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-rose-50"
                                                    >
                                                        <UserX className="h-4 w-4 text-rose-600" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Reject Protocol</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group min-h-[300px] flex flex-col justify-between border-4 border-[#F8F9FA] shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9F99D] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-2xl font-black italic tracking-tighter leading-tight flex items-center gap-3"><Plane className="h-8 w-8 text-[#D9F99D]" /> Departure Forecast</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-4 italic">Operational coverage will drop to 82% during next fiscal week due to planned departures.</p>
                        </div>
                        <Button className="bg-[#D9F99D] text-slate-900 font-bold hover:bg-[#c8ea8a] px-10 rounded-2xl h-14 shadow-lg uppercase text-[10px] tracking-[0.2em] relative z-10 mt-10">Sync Calendars</Button>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#FEE2E2] flex items-center justify-center">
                                <HeartPulse className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 italic">Policy Audit</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Rollover Cap', value: '45 Units' },
                                { label: 'Min Distance', value: '7 Periods' },
                                { label: 'Emergency Override', value: 'ACTIVE' },
                            ].map((p, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-none">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{p.label}</span>
                                    <span className="text-xs font-black text-slate-700 italic tracking-tighter">{p.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
