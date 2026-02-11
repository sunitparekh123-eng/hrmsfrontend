"use client";

import { useState } from "react";
import {
    Wallet,
    ArrowUpRight,
    History,
    Download,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    Briefcase,
    TrendingUp,
    FileText,
    ArrowDownRight,
    PieChart,
    Banknote,
    MoreHorizontal,
    Check
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

export default function PayrollPage() {
    const [ledger, setLedger] = useState([
        { id: 1, name: "Arjun Singh", fixed: "₹1,42,000", variable: "₹12,000", status: "Verified", color: "emerald" },
        { id: 2, name: "Meera Das", fixed: "₹92,000", variable: "₹4,500", status: "Verified", color: "emerald" },
        { id: 3, name: "Rahul Sharma", fixed: "₹1,10,000", variable: "---", status: "Pending Audit", color: "amber" },
        { id: 4, name: "Anita Kapoor", fixed: "₹1,25,000", variable: "₹15,000", status: "Verified", color: "emerald" },
    ]);

    const updateStatus = (id: number, status: string, color: string) => {
        setLedger(ledger.map(row => row.id === id ? { ...row, status, color } : row));
    };

    return (
        <div className="space-y-6 md:space-y-10 pb-20 px-2 md:px-0">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                        <Wallet className="h-6 w-6 md:h-8 md:w-8 text-indigo-400 stroke-[2.5]" /> Disbursement & Compliance
                    </h1>
                    <p className="text-[9px] md:text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.3em]">Financial Integrity Registry • Payroll Cycle</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl border-2 md:border-4 border-slate-50 font-black uppercase text-[9px] md:text-[10px] tracking-widest text-slate-400 transition-all hover:bg-slate-50">
                        <History className="h-5 w-5 mr-3" /> Past Archives
                    </Button>
                    <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] px-8 md:px-10 h-12 md:h-14 rounded-xl md:rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all flex-1 md:flex-none">
                        Initiate Cycle <ArrowUpRight className="h-5 w-5 ml-3" />
                    </Button>
                </div>
            </div>

            {/* Compliance High-level metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {[
                    { label: 'Strategic Payout', value: '₹4.2M', trend: '+12%', icon: Banknote, bg: 'bg-[#D9F99D]' },
                    { label: 'EPF Protocol', value: '₹284K', trend: 'Verified', icon: ShieldCheck, bg: 'bg-[#E0E7FF]' },
                    { label: 'Statutory ESIC', value: '₹42K', trend: 'Audit Log', icon: CreditCard, bg: 'bg-[#FEE2E2]' },
                    { label: 'TDS Withholding', value: '₹312K', trend: 'Compliance', icon: PieChart, bg: 'bg-[#D1FAE5]' },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} border-none rounded-[2rem] md:rounded-3xl shadow-sm relative overflow-hidden h-40 md:h-45 group`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 md:px-8 pt-6 md:pt-8">
                            <CardTitle className="text-[10px] md:text-[11px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                                <stat.icon className="h-4 w-4" /> {stat.label}
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-slate-900/20 group-hover:text-slate-900 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl md:text-5xl font-bold text-slate-900 absolute bottom-4 right-6">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Active Ledger Table */}
            <Card className="border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-2">
                <CardHeader className="p-10 border-none pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-black italic text-slate-900 underline underline-offset-8 decoration-[#D1FAE5] decoration-4">Financial Ledger</h3>
                        <Badge className="bg-[#D1FAE5] text-emerald-600 border-none font-black text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-2xl uppercase shadow-sm">Cycle Feb 2026</Badge>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-6 italic">Active disbursement units ready for rollout</p>
                </CardHeader>
                <CardContent className="p-0 mt-8">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-2 border-slate-50 hover:bg-transparent">
                                <TableHead className="pl-12 h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Personnel Node</TableHead>
                                <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Fixed Yield</TableHead>
                                <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Variable Delta</TableHead>
                                <TableHead className="h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Registry Status</TableHead>
                                <TableHead className="pr-12 text-right h-20 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Protocol Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledger.map((row) => (
                                <TableRow key={row.id} className="border-none hover:bg-slate-50/50 transition-all h-28 group border-b border-dashed border-slate-50 last:border-none">
                                    <TableCell className="pl-12">
                                        <p className="font-black text-slate-900 italic text-base tracking-tight group-hover:translate-x-1 transition-transform">{row.name}</p>
                                    </TableCell>
                                    <TableCell className="text-sm font-black text-slate-900">{row.fixed}</TableCell>
                                    <TableCell className="text-sm font-black text-rose-500 italic">{row.variable}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`bg-${row.color === 'emerald' ? '[#D1FAE5]' : '[#FEF3C7]'} text-${row.color === 'emerald' ? 'emerald' : 'amber'}-600 border-none font-black text-[9px] uppercase tracking-widest px-4 h-7 rounded-xl shadow-sm`}>
                                                {row.status}
                                            </Badge>
                                            {row.status === "Pending Audit" && (
                                                <Button
                                                    onClick={() => updateStatus(row.id, "Verified", "emerald")}
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] shadow-sm transform scale-0 group-hover:scale-100 transition-all duration-300"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-12 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus(row.id, "Verified", "emerald")}
                                                    className="font-bold text-[9px] uppercase tracking-widest p-2 rounded-xl cursor-pointer"
                                                >
                                                    Release Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus(row.id, "Pending Audit", "amber")}
                                                    className="font-bold text-[9px] uppercase tracking-widest p-2 rounded-xl cursor-pointer"
                                                >
                                                    Flag for Audit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="font-bold text-[9px] uppercase tracking-widest p-2 rounded-xl text-rose-500 cursor-pointer">
                                                    Void Disbursement
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

            {/* Compliance Decorative section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-8 bg-slate-50 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between border-2 border-slate-100 shadow-sm">
                    <div className="space-y-6 max-w-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100">
                                <ShieldCheck className="h-8 w-8 text-[#D9F99D]" />
                            </div>
                            <h3 className="text-2xl font-black italic tracking-tighter">Statutory Compliance Shield</h3>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">All PF/ESI filings for the current operational cycle are mapped and ready for ingest. System auto-audit is at 100% integrity.</p>
                        <div className="flex gap-4">
                            <Badge className="bg-slate-900 text-white border-none text-[8px] font-black px-3 h-6 uppercase tracking-widest">ESI 2.0 READY</Badge>
                            <Badge className="bg-slate-900 text-white border-none text-[8px] font-black px-3 h-6 uppercase tracking-widest">PF 12% COMPLIANT</Badge>
                        </div>
                    </div>
                    <Button className="bg-[#D9F99D] text-slate-900 font-bold px-12 h-16 rounded-[1.5rem] mt-10 md:mt-0 shadow-lg hover:bg-[#c8ea8a] transition-all uppercase tracking-widest text-xs italic">Review Audit Log</Button>
                </div>
                <Card className="md:col-span-4 bg-white rounded-[3rem] border-none shadow-sm p-10 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#E0E7FF] rounded-full opacity-40" />
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900 italic flex items-center gap-2"><CreditCard className="h-6 w-6 text-blue-400" /> Auto-Disburse</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose italic">Scheduled rollout is active for midnight Feb 28. Status: READY.</p>
                    </div>
                    <div className="pt-8 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-200">System Lock: 04:22:11</span>
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </Card>
            </div>
        </div>
    );
}
