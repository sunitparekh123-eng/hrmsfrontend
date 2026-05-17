"use client";

import { useState } from "react";
import {
  Users,
  Briefcase,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Building2,
  AlertCircle,
  ShieldCheck,
  IndianRupee,
  Activity,
  FileCheck,
  CheckCircle2,
  Users2,
  Sparkles,
  Layers,
  Percent,
  Coins,
  Scale,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

// Shared client Math Logic from Payroll Engine
const calculateProductionNet = (row: any) => {
    const daysInMonth = 28;
    const payableDays = daysInMonth - (row.absentDays || 0);

    const fixedBasic = Math.round(row.fixedGross * 0.40);
    const fixedHra = Math.round(fixedBasic * 0.40);
    const fixedOther = row.fixedGross - fixedBasic - fixedHra;

    const basic = Math.round((fixedBasic / daysInMonth) * payableDays);
    const hra = Math.round((fixedHra / daysInMonth) * payableDays);
    const other = Math.round((fixedOther / daysInMonth) * payableDays);

    const proratedGross = basic + hra + other;
    const totalEarnings = proratedGross + (row.previousArrears || 0) + (row.bonus || 0) + (row.incentive || 0);

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

    const pfEmployer = pf;
    const esiEmployer = row.esicApplicable ? Math.ceil(totalEarnings * 0.0325) : 0;
    const totalMonthlyCTC = totalEarnings + pfEmployer + esiEmployer;

    return {
        proratedGross,
        totalEarnings,
        pf,
        esi,
        pt,
        grossDeductions,
        net,
        pfEmployer,
        esiEmployer,
        totalMonthlyCTC,
        payableDays
    };
};

// Exact Client Excel Ledger Mock Data
const employeeLedger = [
    { id: 1, name: "SWAPNIL JAISWAL", location: "Indore", company: "BP Marketing", designation: "Accounts Head", fixedGross: 35000, pfApplicable: false, pfCeiling: false, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Verified" },
    { id: 2, name: "SIMRAN KATARIYA", location: "Indore", company: "BP Marketing", designation: "Sr . Commercial exe", fixedGross: 25000, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 1415, otherDeduction: 0, status: "Draft" },
    { id: 8, name: "SANDEEP CHOUHAN", location: "Indore", company: "BP Marketing", designation: "Supervisor", fixedGross: 13100, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 3, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Verified" },
    { id: 39, name: "SHRAVAN MUNIYA", location: "Ratlam", company: "Apaar Logistics", designation: "SR.SUPERVISOR", fixedGross: 16000, pfApplicable: true, pfCeiling: true, esicApplicable: true, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Paid" },
    { id: 3, name: "SAGAR BAKSHE", location: "Indore", company: "BP Marketing", designation: "Depot Manager", fixedGross: 40000, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Verified" },
    { id: 4, name: "ABHISHEK KURIL", location: "Indore", company: "BP Marketing", designation: "Commercial Exe", fixedGross: 18499, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Draft" }
];

export default function DashboardPage() {
  // Dynamic calculations for the executive dashboard
  const processedData = employeeLedger.map(emp => ({
    ...emp,
    math: calculateProductionNet(emp)
  }));

  const totalStaff = processedData.length;
  const totalCTC = processedData.reduce((acc, curr) => acc + curr.math.totalMonthlyCTC, 0);
  const totalNetSalaries = processedData.reduce((acc, curr) => acc + curr.math.net, 0);
  
  // Total Cycle working days is totalStaff * 28 days
  const totalCycleDays = totalStaff * 28;
  const totalAbsentDays = processedData.reduce((acc, curr) => acc + curr.absentDays, 0);
  const overallAttendanceRate = Math.round(((totalCycleDays - totalAbsentDays) / totalCycleDays) * 1000) / 10;

  // Status breakdown count
  const draftCount = processedData.filter(e => e.status === "Draft").length;
  const verifiedCount = processedData.filter(e => e.status === "Verified").length;
  const paidCount = processedData.filter(e => e.status === "Paid").length;

  // Statutory Totals
  const totalPF = processedData.reduce((acc, curr) => acc + curr.math.pf, 0);
  const totalESI = processedData.reduce((acc, curr) => acc + curr.math.esi, 0);
  const totalPT = processedData.reduce((acc, curr) => acc + curr.math.pt, 0);
  const grandStatutoryLiability = totalPF + totalESI + totalPT;

  // Loan Recoveries
  const totalActiveLoans = processedData.reduce((acc, curr) => acc + curr.loanDeduction, 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-16 bg-[#F8F9FA] min-h-screen">
      
      {/* Executive Command Notification Bar */}
      <div className="bg-white rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm border border-slate-100">
        <div className="flex items-start md:items-center gap-3">
          <div className="h-6 w-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-[10px] md:text-xs font-semibold text-slate-700 leading-relaxed uppercase tracking-wider">
            <span className="font-black text-indigo-600">Executive Alert :</span> {draftCount} Payroll Drafts pending review for FEB 2026 Cycle. Review to initiate disbursements.
          </p>
        </div>
        <Link href="/payroll" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[8px] tracking-widest px-6 h-10 rounded-lg border border-[#D9F99D] shadow-sm">
            Review Payroll
          </Button>
        </Link>
      </div>

      {/* Strategic Business KPI Metrics (Calculated Live) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Monthly CTC Budget", value: `₹${Math.round(totalCTC).toLocaleString()}`, icon: IndianRupee, bg: "bg-[#E0E7FF]", trend: "+4.2% Growth", desc: "Total Employee + Statutory Cost" },
          { title: "Active Workforce Count", value: `${totalStaff} Staff`, icon: Users2, bg: "bg-[#D1FAE5]", trend: "Full Capacity", desc: "Currently Active on Ledger" },
          { title: "Overall Attendance Rate", value: `${overallAttendanceRate}%`, icon: Activity, bg: "bg-[#FEF3C7]", trend: "Optimal Efficiency", desc: "Based on Leaves & Active LWP" },
          { title: "Net Disbursable Salaries", value: `₹${Math.round(totalNetSalaries).toLocaleString()}`, icon: Briefcase, bg: "bg-[#DBEAFE]", trend: "February Cycle", desc: "Actual Net Salary Disbursable" },
        ].map((stat, i) => (
          <Card key={i} className={cn(stat.bg, "border-none rounded-2xl shadow-sm relative overflow-hidden h-36 flex flex-col justify-between p-5 hover:shadow-md transition-shadow group")}>
            <div className="flex items-start justify-between">
              <div className="bg-white/50 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <stat.icon className="h-4 w-4 text-slate-900 stroke-[2.5]" />
              </div>
              <span className="text-[7.5px] font-black uppercase text-slate-500 opacity-60 tracking-wider select-none">{stat.trend}</span>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</h3>
              <p className="text-[8.5px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Deep Analytics & Visualization Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Side: Advanced Analytical Charts */}
        <div className="xl:col-span-8 space-y-6 md:space-y-8">
          
          {/* Chart 1: CTC Trajectory & Monthly Cost Burn (Custom CSS Bar Chart) */}
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
            <CardHeader className="p-6 pb-2 border-none flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-widest">Company Cost Trajectory (Monthly CTC)</CardTitle>
                <p className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-wider">Historical monthly budget growth from November 2025 to February 2026.</p>
              </div>
              <Badge className="bg-[#D1FAE5] text-emerald-600 border-none font-black text-[7px] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Live Audit
              </Badge>
            </CardHeader>
            <CardContent className="h-[260px] flex items-end justify-between p-6 gap-6 pt-10">
              {[
                { month: "NOV 2025", cost: 145000, height: 75 },
                { month: "DEC 2025", cost: 152000, height: 82 },
                { month: "JAN 2026", cost: 158000, height: 89 },
                { month: "FEB 2026 (Active)", cost: totalCTC, height: 100, active: true }
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                  {/* Dynamic Tooltip */}
                  <div className="absolute -top-6 bg-slate-900 text-white font-black text-[8px] py-1 px-2.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none tracking-widest">
                    ₹{Math.round(item.cost).toLocaleString()}
                  </div>
                  
                  {/* Custom Styled Bar */}
                  <div className="w-full bg-slate-50 border border-slate-100/50 rounded-t-xl relative overflow-hidden h-[160px] flex items-end">
                    <div 
                      className={cn(
                        "w-full transition-all duration-700 rounded-t-lg relative",
                        item.active 
                          ? "bg-gradient-to-t from-indigo-500 to-[#D9F99D] group-hover:from-indigo-600 group-hover:to-[#D9F99D]" 
                          : "bg-slate-300 group-hover:bg-[#D9F99D]"
                      )}
                      style={{ height: `${item.height}%` }}
                    >
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[7px] font-black text-slate-900 uppercase tracking-widest opacity-90">
                        {Math.round(item.cost / 1000)}k
                      </div>
                    </div>
                  </div>
                  <span className={cn("text-[8px] font-black uppercase tracking-wider", item.active ? "text-indigo-600" : "text-slate-400")}>
                    {item.month}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* New Section 1: Real-time Disbursement & Payout Ledger Table */}
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
            <CardHeader className="p-6 pb-2 border-none">
              <CardTitle className="text-sm font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-widest">Disbursement & Payout Ledger</CardTitle>
              <CardDescription className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-wider">Exact live payout values for all employees in February billing cycle.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="pl-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Employee Details</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fixed Gross</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Prorated Earned</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Deductions</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                    <TableHead className="pr-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Net Payable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.map((emp) => (
                    <TableRow key={emp.id} className="border-b border-dashed border-slate-50 last:border-none h-14 hover:bg-slate-50/55 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{emp.name}</span>
                          <span className="text-[7.5px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{emp.designation} | {emp.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] font-black text-slate-700">₹{emp.fixedGross.toLocaleString()}</TableCell>
                      <TableCell className="text-[10px] font-bold text-slate-600">₹{emp.math.proratedGross.toLocaleString()}</TableCell>
                      <TableCell className="text-[10px] font-bold text-rose-500">₹{emp.math.grossDeductions.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-black text-[7px] tracking-widest px-2 h-4 rounded uppercase",
                          emp.status === "Paid" ? "bg-emerald-50 text-emerald-600" :
                          emp.status === "Verified" ? "bg-indigo-50 text-indigo-600" :
                          "bg-amber-50 text-amber-500"
                        )}>
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right text-[11px] font-black text-emerald-600 italic">₹{emp.math.net.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Chart 2: Statutory Burden Distribution (Horizontal Stack Chart) */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Statutory Liability Allocation</h3>
                <p className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-wider">How statutory government dues (₹{Math.round(grandStatutoryLiability).toLocaleString()}) are split.</p>
              </div>
              <Layers className="h-4 w-4 text-indigo-500" />
            </div>

            {(() => {
              const pfPct = Math.round((totalPF / grandStatutoryLiability) * 100) || 0;
              const esiPct = Math.round((totalESI / grandStatutoryLiability) * 100) || 0;
              const ptPct = 100 - pfPct - esiPct;

              return (
                <div className="space-y-6">
                  {/* Dynamic Stack Bar */}
                  <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
                    <div style={{ width: `${pfPct}%` }} className="bg-indigo-500 h-full transition-all duration-500" title="Provident Fund" />
                    <div style={{ width: `${esiPct}%` }} className="bg-emerald-500 h-full transition-all duration-500" title="ESIC" />
                    <div style={{ width: `${ptPct}%` }} className="bg-amber-500 h-full transition-all duration-500" title="Professional Tax" />
                  </div>

                  {/* Legends with Live Aggregated Values */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-start gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Provident Fund (PF)</span>
                        <span className="text-xs font-black text-slate-900 mt-0.5 block">₹{totalPF.toLocaleString()} <span className="text-[8.5px] font-bold text-slate-400">({pfPct}%)</span></span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">ESIC Contribution</span>
                        <span className="text-xs font-black text-slate-900 mt-0.5 block">₹{totalESI.toLocaleString()} <span className="text-[8.5px] font-bold text-slate-400">({esiPct}%)</span></span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Professional Tax (PT)</span>
                        <span className="text-xs font-black text-slate-900 mt-0.5 block">₹{totalPT.toLocaleString()} <span className="text-[8.5px] font-bold text-slate-400">({ptPct}%)</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>

          {/* Tour Expenses & Travel Audit */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Tour Expenses & Travel Audit</h3>
                <p className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-wider">Operational travel claims, reimbursements and budget approvals.</p>
              </div>
              <Plane className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 flex flex-col justify-between h-20">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Claims</span>
                <span className="text-base font-black text-slate-900">6 Claims</span>
              </div>
              <div className="bg-[#D1FAE5]/60 p-3 rounded-xl border border-[#D1FAE5] flex flex-col justify-between h-20">
                <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Approved Outgoings</span>
                <span className="text-base font-black text-emerald-800">₹44,350</span>
              </div>
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/50 flex flex-col justify-between h-20">
                <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Pending Audit</span>
                <span className="text-base font-black text-amber-800">₹30,800</span>
              </div>
            </div>

            {/* List of Recent Tour Claims */}
            <div className="space-y-3.5">
              {[
                { name: "Meera Rao", dept: "Finance", route: "Indore → Hyderabad", amt: 21000, status: "Pending" },
                { name: "Arjun Singh", dept: "Sales", route: "Indore → Mumbai", amt: 14250, status: "Approved" },
                { name: "Priya Sharma", dept: "Operations", route: "Mumbai → Delhi", amt: 9800, status: "Pending" }
              ].map((claim, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 last:border-none pb-3 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                      <Plane className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{claim.name}</span>
                        <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">· {claim.dept}</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-0.5 uppercase tracking-wide">{claim.route}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-900 block">₹{claim.amt.toLocaleString()}</span>
                    <Badge className={cn(
                      "border-none font-black text-[6.5px] tracking-widest px-1.5 h-3.5 rounded mt-0.5 uppercase inline-flex items-center",
                      claim.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-500"
                    )}>
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Operational Control & Audit Trail */}
        <div className="xl:col-span-4 space-y-6 md:space-y-8">
          
          {/* New Section 2: Active Governance & Global Compliance Rules Card */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Active Governance Rules</h3>
              <Scale className="h-4 w-4 text-indigo-500" />
            </div>
            
            <div className="space-y-3.5">
              {[
                { label: "Billing Cycle duration", val: "28 Days", desc: "Feb standard cycles" },
                { label: "EPF Contribution Rate", val: "12.0%", desc: "Capped at INR 15k basic" },
                { label: "ESIC Contribution Rate", val: "0.75% / 3.25%", desc: "Employee / Employer split" },
                { label: "Professional Tax model", val: "MP Slabs", desc: "INR 208 / 167 / 125 slabs" },
                { label: "Basic CTC Split Rate", val: "40.0%", desc: "Fixed 40% of fixed gross" }
              ].map((rule, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 last:border-none pb-2 last:pb-0">
                  <div>
                    <span className="text-[8.5px] font-black uppercase text-slate-700 tracking-wider block">{rule.label}</span>
                    <span className="text-[7.5px] text-slate-400 block mt-0.5 uppercase tracking-tight">{rule.desc}</span>
                  </div>
                  <Badge className="bg-slate-100 text-slate-800 border-none font-black text-[8px] tracking-wider uppercase h-5.5 px-2 rounded-md shrink-0">
                    {rule.val}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* New Section 3: Active Loans & Deductions Recovery Card */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Active Loan Recoveries</h3>
              <Coins className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider">Active Recovery</Badge>
                    <h4 className="text-xs font-black uppercase tracking-tight mt-2 text-slate-900">SIMRAN KATARIYA</h4>
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sr . Commercial exe</p>
                  </div>
                  <span className="text-[11px] font-black text-amber-600">₹{totalActiveLoans.toLocaleString()}</span>
                </div>
                
                <div className="space-y-1.5 mt-3">
                  <div className="flex justify-between text-[7px] font-bold uppercase text-slate-400 tracking-wider">
                    <span>Monthly Installment</span>
                    <span>100% Deducted</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Hub Allocation & Operations Split */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Hub Allocation</h3>
              <Building2 className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="space-y-4">
              {/* Indore Hub Progress */}
              {(() => {
                const indoreStaff = processedData.filter(e => e.location === "Indore");
                const headcount = indoreStaff.length;
                const pct = Math.round((headcount / totalStaff) * 100);
                const branchCTC = indoreStaff.reduce((acc, c) => acc + c.math.totalMonthlyCTC, 0);

                return (
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100/50">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-700 tracking-wider">
                      <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Indore HQ Hub</span>
                      <span>{pct}% Staff</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      <span>{headcount} active resources</span>
                      <span>₹{Math.round(branchCTC).toLocaleString()} CTC Budget</span>
                    </div>
                  </div>
                );
              })()}

              {/* Ratlam Depot Progress */}
              {(() => {
                const ratlamStaff = processedData.filter(e => e.location === "Ratlam");
                const headcount = ratlamStaff.length;
                const pct = Math.round((headcount / totalStaff) * 100);
                const branchCTC = ratlamStaff.reduce((acc, c) => acc + c.math.totalMonthlyCTC, 0);

                return (
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100/50">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-700 tracking-wider">
                      <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ratlam Depot</span>
                      <span>{pct}% Staff</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                      <span>{headcount} active resources</span>
                      <span>₹{Math.round(branchCTC).toLocaleString()} CTC Budget</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>

          {/* Executive Audit Integrity Check */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Compliance Audit</h3>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>

            <div className="space-y-4">
              {[
                { title: "PF Statutory Slabs Passed", desc: "12% Contribution correctly capped.", status: true },
                { title: "ESIC Slabs Computed", desc: "0.75% Deducted on gross limits.", status: true },
                { title: "PT MP slabs Verified", desc: "Slabs mapped: ₹208 / ₹167 / ₹125.", status: true },
                { title: "Attendance & LWP synced", desc: "Leaves checked against attendance log.", status: true },
                { title: "Advance & Loans valid", desc: "No overlapping deductions active.", status: true }
              ].map((check, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 fill-current" />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-black text-slate-900 uppercase tracking-wider">{check.title}</p>
                    <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">{check.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Real-time System Feed & Audit Trail */}
          <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-5 border-b border-dashed border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D] decoration-2">Recent Activities</h3>
              <Activity className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="space-y-4">
              {[
                { msg: "SWAPNIL JAISWAL salary marked verified for February cycle.", time: "10 mins ago" },
                { msg: "SHRAVAN MUNIYA salary processed & NEFT payout successful.", time: "42 mins ago" },
                { msg: "Professional Tax (PT) MP slab formulas auto-applied.", time: "2 hours ago" },
                { msg: "PF ceiling limits verified for 5 statutory active staff.", time: "3 hours ago" }
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-2.5 pb-2 border-b border-dashed border-slate-100 last:border-none last:pb-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{act.msg}</p>
                    <span className="text-[7px] text-slate-400 uppercase tracking-widest font-black block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
