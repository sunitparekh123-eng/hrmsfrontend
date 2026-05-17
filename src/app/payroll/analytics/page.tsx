"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
    Wallet, 
    Banknote, 
    Users, 
    Search,
    Filter,
    Download,
    CalendarDays,
    Activity,
    ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Shared Math Logic from Main Payroll Sheet
const calculateProductionNet = (row: any) => {
    const daysInMonth = 28; // Extracted from client sheet
    const payableDays = daysInMonth - (row.absentDays || 0);

    // Fixed Structure
    const fixedBasic = Math.round(row.fixedGross * 0.40);
    const fixedHra = Math.round(fixedBasic * 0.40);
    const fixedOther = row.fixedGross - fixedBasic - fixedHra;

    // Prorated Structure
    const basic = Math.round((fixedBasic / daysInMonth) * payableDays);
    const hra = Math.round((fixedHra / daysInMonth) * payableDays);
    const other = Math.round((fixedOther / daysInMonth) * payableDays);

    const proratedGross = basic + hra + other;
    const totalEarnings = proratedGross + (row.previousArrears || 0) + (row.bonus || 0) + (row.incentive || 0);

    // Deductions
    let pf = 0;
    if (row.pfApplicable) {
        const pfBasic = row.pfCeiling ? Math.min(basic, 15000) : basic;
        pf = Math.round(pfBasic * 0.12);
    }

    let esi = 0;
    if (row.esicApplicable) {
        esi = Math.ceil(totalEarnings * 0.0075);
    }

    let pt = 0;
    if (proratedGross > 33333) pt = 208;
    else if (proratedGross > 25000) pt = 167;
    else if (proratedGross > 15000) pt = 125;

    const grossDeductions = pf + esi + pt + (row.loanDeduction || 0) + (row.otherDeduction || 0);
    const net = totalEarnings - grossDeductions;

    // Employer Contribution
    const pfEmployer = pf;
    const esiEmployer = row.esicApplicable ? Math.ceil(totalEarnings * 0.0325) : 0;
    const totalMonthlyCTC = totalEarnings + pfEmployer + esiEmployer;

    return {
        basic,
        hra,
        other,
        proratedGross,
        totalEarnings,
        pf,
        esi,
        pt,
        grossDeductions,
        net,
        pfEmployer,
        esiEmployer,
        totalMonthlyCTC
    };
};

// Exact Client Excel Ledger Mock Data
const employees = [
    { 
        id: 1, 
        employeeCode: "EMP001",
        name: "SWAPNIL JAISWAL", 
        location: "Indore",
        company: "BP Marketing",
        designation: "Accounts Head",
        fixedGross: 35000, 
        pfApplicable: false,
        pfCeiling: false,
        esicApplicable: false,
        absentDays: 0,
        bonus: 0,
        previousArrears: 0,
        incentive: 0,
        loanDeduction: 0, 
        otherDeduction: 0,
        status: "Verified",
    },
    { 
        id: 2, 
        employeeCode: "EMP002",
        name: "SIMRAN KATARIYA", 
        location: "Indore",
        company: "BP Marketing",
        designation: "Sr . Commercial exe",
        fixedGross: 25000, 
        pfApplicable: true,
        pfCeiling: true,
        esicApplicable: false,
        absentDays: 0,
        bonus: 0,
        previousArrears: 0,
        incentive: 0,
        loanDeduction: 1415, 
        otherDeduction: 0,
        status: "Draft",
    },
    { 
        id: 8, 
        employeeCode: "EMP008",
        name: "SANDEEP CHOUHAN", 
        location: "Indore",
        company: "BP Marketing",
        designation: "Supervisor",
        fixedGross: 13100, 
        pfApplicable: true,
        pfCeiling: true,
        esicApplicable: false,
        absentDays: 3,
        bonus: 0,
        previousArrears: 0,
        incentive: 0,
        loanDeduction: 0, 
        otherDeduction: 0,
        status: "Verified",
    },
    { 
        id: 39, 
        employeeCode: "EMP039",
        name: "SHRAVAN MUNIYA", 
        location: "Ratlam",
        company: "Apaar Logistics",
        designation: "SR.SUPERVISOR",
        fixedGross: 16000, 
        pfApplicable: true,
        pfCeiling: true,
        esicApplicable: true,
        absentDays: 0,
        bonus: 0,
        previousArrears: 0,
        incentive: 0,
        loanDeduction: 0, 
        otherDeduction: 0,
        status: "Paid",
    },
    { 
        id: 3, 
        employeeCode: "EMP003",
        name: "SAGAR BAKSHE", 
        location: "Indore",
        company: "BP Marketing",
        designation: "Depot Manager",
        fixedGross: 40000, 
        pfApplicable: true,
        pfCeiling: true,
        esicApplicable: false,
        absentDays: 0,
        bonus: 0,
        previousArrears: 0,
        incentive: 0,
        loanDeduction: 0, 
        otherDeduction: 0,
        status: "Verified",
    },
    { 
        id: 4, 
        employeeCode: "EMP004",
        name: "ABHISHEK KURIL", 
        location: "Indore",
        company: "BP Marketing",
        designation: "Commercial Exe",
        fixedGross: 18499, 
        pfApplicable: true,
        pfCeiling: true,
        esicApplicable: false,
        absentDays: 0,
        bonus: 0,
        previousArrears: 0,
        incentive: 0,
        loanDeduction: 0, 
        otherDeduction: 0,
        status: "Draft",
    }
];

export default function PayrollAnalyticsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const TOTAL_MONTH_DAYS = 28; // Standard Excel Billing Cycle Days

    // Calculations based on 100% accurate client Excel math
    const processedData = employees.map(emp => {
        const res = calculateProductionNet(emp);
        const payableDays = TOTAL_MONTH_DAYS - emp.absentDays;
        
        // Dynamic Company Cost / Day = Prorated Total Monthly CTC divided by cycle days
        const dailyCost = Math.round(res.totalMonthlyCTC / TOTAL_MONTH_DAYS);
        
        // Earned Liability (Payout to pay employee till today)
        const earnedTillDate = res.net;
        
        // Projected Monthly Liability (Full Cost to Company)
        const projectedMonthly = res.totalMonthlyCTC;

        return {
            ...emp,
            dailyCost,
            earnedTillDate,
            projectedMonthly,
            payableDays,
            fixedGross: emp.fixedGross
        };
    });

    const totalDailyCompanyCost = processedData.reduce((acc, curr) => acc + curr.dailyCost, 0);
    const totalEarnedTillDate = processedData.reduce((acc, curr) => acc + curr.earnedTillDate, 0);
    const totalProjectedLiability = processedData.reduce((acc, curr) => acc + curr.projectedMonthly, 0);

    const filteredData = processedData.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ProtectedRoute module="PAYROLL" action="READ">
            <div className="space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2 pt-4">
                    <div>
                        <Link href="/payroll" className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors mb-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <ArrowLeft className="h-3 w-3" /> Back to Payroll
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-4">Financial Analytics</h1>
                        <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">Deep Cost Tracking & Real-time Liabilities</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                        <Button 
                            variant="ghost" 
                            className="h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-500 hover:bg-white hover:shadow-sm transition-all"
                        >
                            <CalendarDays className="h-4 w-4 mr-2" /> FEB 2026
                        </Button>
                        <Button 
                            className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-[0.3em] px-6 h-11 rounded-xl shadow-md hover:translate-y-[-2px] transition-all"
                        >
                            <Download className="h-4 w-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* Top Level Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                    {[
                        { label: "Company Cost / Day", value: totalDailyCompanyCost, icon: Activity, trend: "Daily Burn", color: "bg-[#E0E7FF]", unit: "₹" },
                        { label: "Generated Payout (Till Today)", value: totalEarnedTillDate, icon: Banknote, trend: "+ Accurate", color: "bg-[#D1FAE5]", unit: "₹" },
                        { label: "Projected Monthly Liability", value: totalProjectedLiability, icon: Wallet, trend: "Pending Liability", color: "bg-[#FEE2E2]", unit: "₹" },
                        { label: "Active Resources", value: employees.length, icon: Users, trend: "Workforce", color: "bg-[#FEF3C7]", unit: "Staff" },
                    ].map((s, i) => (
                        <Card 
                            key={i} 
                            className={cn(
                                s.color,
                                "border-none rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-lg transition-all"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="bg-white/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                    <s.icon className="h-5 w-5 text-slate-900" />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 opacity-60">
                                    {s.trend}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter flex items-end gap-2">
                                    {s.unit === '₹' && <span className="text-sm mb-1 text-slate-500">₹</span>}
                                    {s.value.toLocaleString()}
                                    <span className="text-[10px] mb-1.5 font-bold uppercase tracking-widest text-slate-500">{s.unit !== '₹' ? s.unit : ''}</span>
                                </h3>
                                <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{s.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Detailed Analytics Table */}
                <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1 mx-2">
                    <CardHeader className="p-6 pb-3 border-none flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <CardTitle className="text-lg font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">Deep Cost Breakdown</CardTitle>
                            <CardDescription className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] italic">Per Employee Cost & Liability Metrics</CardDescription>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <div className="relative min-w-[200px] group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <Input 
                                    placeholder="Search Employee..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 pl-10 pr-4 rounded-xl bg-white border-none shadow-sm font-bold text-[10px] focus:ring-2 ring-indigo-100"
                                />
                            </div>
                            <Button variant="outline" className="h-10 px-4 rounded-xl border-none bg-white shadow-sm font-black uppercase text-[9px] tracking-widest text-slate-900 hover:bg-slate-100 transition-colors">
                                <Filter className="h-3.5 w-3.5 mr-2" /> Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-4 p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Details</TableHead>
                                    <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Gross</TableHead>
                                    <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cost / Day</TableHead>
                                    <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Days Active</TableHead>
                                    <TableHead className="pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Earned Liability</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((emp) => (
                                    <TableRow key={emp.id} className="group border-b border-dashed border-slate-100 hover:bg-slate-50/50 transition-all h-20 last:border-none">
                                        <TableCell className="pl-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 italic tracking-tight uppercase group-hover:translate-x-1 transition-transform">{emp.name}</span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{emp.employeeCode}</Badge>
                                                    <Badge className="bg-indigo-50 text-indigo-500 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{emp.designation}</Badge>
                                                    <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{emp.location}</Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-black text-slate-900">₹{emp.fixedGross.toLocaleString()}</span>
                                            <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Base CTC</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none font-black text-[9px] uppercase tracking-widest px-3 h-6 rounded-lg shadow-sm">
                                                ₹{emp.dailyCost.toLocaleString()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-black text-slate-900">{emp.payableDays} <span className="text-slate-400">/ {TOTAL_MONTH_DAYS}</span></span>
                                                <div className="h-1.5 w-full max-w-[80px] bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-[#D9F99D] rounded-full" 
                                                        style={{ width: `${(emp.payableDays / TOTAL_MONTH_DAYS) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-emerald-600 italic">₹{emp.earnedTillDate.toLocaleString()}</span>
                                                <span className="text-[7px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Till Today</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
