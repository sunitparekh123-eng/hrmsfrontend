"use client";
import { cn } from "@/lib/utils";

import { useRole } from "@/context/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
    Check,
    FileSpreadsheet,
    Plus,
    Info,
    Search, 
    Filter, 
    Clock, 
    FileDown, 
    LayoutList, 
    CalendarCheck,
    AlertCircle,
    UserCircle,
    ChevronRight
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
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { 
    GlobalRulesSheet, 
    DisbursementDialog, 
    EmployeeHistoryDialog, 
    PayrollPolicyDialog 
} from "@/components/payroll/PayrollModals";

export default function PayrollPage() {
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
    const [isPastOpen, setIsPastOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [disbursementStep, setDisbursementStep] = useState(1);
    const [txDetails, setTxDetails] = useState({
        mode: "NEFT/RTGS",
        reference: `PAY-BATCH-${new Date().getTime().toString().slice(-6)}`,
        authorizedBy: "HR Manager",
        remarks: "Monthly Payroll Release"
    });

    const [globalRules, setGlobalRules] = useState({
        pfEmployer: 12,
        pfEmployee: 12,
        hraPercent: 40,
        defaultPT: 200,
        cycle: "MAY 2026"
    });

    const [pastCycles, setPastCycles] = useState([
        { month: "APR 2026", totalPayout: "₹4,82,400", employees: 4, date: "02 Apr 2026" },
        { month: "MAR 2026", totalPayout: "₹4,75,200", employees: 4, date: "01 Mar 2026" },
        { month: "FEB 2026", totalPayout: "₹4,90,000", employees: 4, date: "28 Feb 2026" },
    ]);
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [branches] = useState(["All Branches", "MP Branch", "Mumbai HQ", "Delhi Regional", "Bangalore Tech"]);

    const [ledger, setLedger] = useState([
        { 
            id: 1, 
            employeeCode: "1",
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
            status: "Verified",
        },
        { 
            id: 2, 
            employeeCode: "2",
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
            status: "Draft",
        },
        { 
            id: 8, 
            employeeCode: "8",
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
            status: "Verified",
        },
        { 
            id: 39, 
            employeeCode: "39",
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
            status: "Paid",
        }
    ]);

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

        const grossDeductions = pf + esi + pt + (row.loanDeduction || 0);
        const net = totalEarnings - grossDeductions;

        // Employer Contribution
        const pfEmployer = pf; // simplified, matches employee side in their sheet
        const esiEmployer = row.esicApplicable ? Math.ceil(totalEarnings * 0.0325) : 0;
        const totalMonthlyCTC = totalEarnings + pfEmployer + esiEmployer;

        return {
            basic, hra, other, proratedGross, totalEarnings,
            pf, esi, pt, grossDeductions, net,
            pfEmployer, esiEmployer, totalMonthlyCTC
        };
    };

    const calculateNet = (row: any) => calculateProductionNet(row).net;

    const handleSalaryUpdate = (id: number, field: string, value: any) => {
        setLedger(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
    };

    const handleExportCSV = () => {
        const headers = ["Employee Code", "Employee Name", "Location", "Company", "Gross Salary", "Designation", "PF Applicable", "PF Ceiling", "ESIC Applicable", "Days In Month", "Payable Days", "Absent Days", "Basic", "HRA", "Other Allowance", "Previous Month Arrears", "Bonus", "Incentive", "Gross Earnings", "Provident Fund", "ESIC", "Professional Tax", "Advance/Loan/TDS", "Other Deduction", "Gross Deductions", "Net Salary", "PF Employer", "ESIC Employer", "Total Monthly CTC"];
        const rows = ledger.map(emp => {
            const res = calculateProductionNet(emp);
            const daysInMonth = 28;
            const payable = daysInMonth - emp.absentDays;
            return [
                emp.employeeCode, emp.name, emp.location, emp.company, emp.fixedGross, emp.designation, 
                emp.pfApplicable ? "Yes" : "No", emp.pfCeiling ? "Yes" : "No", emp.esicApplicable ? "Yes" : "No", 
                daysInMonth, payable, emp.absentDays, 
                res.basic, res.hra, res.other, emp.previousArrears, emp.bonus, emp.incentive, res.totalEarnings,
                res.pf, res.esi, res.pt, emp.loanDeduction, 0, res.grossDeductions, res.net,
                res.pfEmployer, res.esiEmployer, res.totalMonthlyCTC
            ];
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Payroll_Export_${globalRules.cycle.replace(" ", "_")}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const filteredLedger = ledger.filter(emp => {
        const matchesBranch = selectedBranch === "All Branches" || emp.location === selectedBranch;
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.employeeCode.toString().includes(searchQuery);
        const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
        return matchesBranch && matchesSearch && matchesStatus;
    });

    const toggleRow = (id: number) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkPay = () => {
        setLedger(prev => prev.map(emp => selectedRows.includes(emp.id) ? { ...emp, status: "Paid" } : emp));
        setSelectedRows([]);
    };

    const handleDisburseAll = () => {
        const total = ledger.reduce((acc, curr) => acc + calculateNet(curr), 0);
        const newPastRecord = {
            id: txDetails.reference,
            month: globalRules.cycle,
            totalPayout: `₹${total.toLocaleString()}`,
            employees: ledger.length,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            method: txDetails.mode,
            authorizedBy: txDetails.authorizedBy
        };
        
        setPastCycles(prev => [newPastRecord, ...prev]);
        setLedger(prev => prev.map(emp => ({ ...emp, status: "Paid" })));
        setIsSendDialogOpen(false);
        setDisbursementStep(1);
    };

    const generatePayslip = (row: any) => {
        const doc = new jsPDF();
        const pNet = calculateProductionNet(row);

        // Branding
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("NODE HRMS", 20, 25);
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`P AY R O L L   S L I P   •   ${globalRules.cycle}`, 20, 32);

        // Employee Info
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Employee: ${row.name} (${row.employeeCode})`, 20, 50);
        doc.text(`Designation: ${row.designation}`, 20, 57);
        doc.text(`Location: ${row.location} | Company: ${row.company}`, 20, 64);

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['Description', 'Earnings', 'Deductions']],
            body: [
                ['Basic Salary', `Rs. ${pNet.basic.toLocaleString()}`, '-'],
                ['HRA', `Rs. ${pNet.hra.toLocaleString()}`, '-'],
                ['Other Allowances', `Rs. ${pNet.other.toLocaleString()}`, '-'],
                ['Bonus / Arrears', `Rs. ${(row.bonus + row.previousArrears).toLocaleString()}`, '-'],
                ['Provident Fund (PF)', '-', `Rs. ${pNet.pf.toLocaleString()}`],
                ['Professional Tax (PT)', '-', `Rs. ${pNet.pt.toLocaleString()}`],
                ['ESI (Employees State Insurance)', '-', `Rs. ${pNet.esi.toLocaleString()}`],
                ['Loan/Advance Deduction', '-', `Rs. ${row.loanDeduction.toLocaleString()}`],
            ],
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42], fontSize: 10 },
            styles: { fontSize: 9 },
            foot: [['TOTAL', `Rs. ${pNet.totalEarnings.toLocaleString()}`, `Rs. ${pNet.grossDeductions.toLocaleString()}`]],
            footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 150;
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`NET PAYABLE: Rs. ${pNet.net.toLocaleString()}`, 20, finalY + 20);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text("Note: This is a computer-generated document and does not require a signature.", 20, finalY + 40);

        doc.save(`${row.name.replace(" ", "_")}_Payslip_${globalRules.cycle.replace(" ", "")}.pdf`);
    };

    return (
        <ProtectedRoute module="PAYROLL" action="READ">
            <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter underline underline-offset-4 decoration-[#D9F99D] decoration-2">
                        <Wallet className="h-6 w-6 text-indigo-400 stroke-[2.5]" /> Salary Payments
                    </h1>
                    <p className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">Payment Records • Salary Processing</p>
                </div>
                <div className="flex items-center gap-3">
                    

                    <Link href="/payroll/analytics">
                        <Button 
                            variant="outline" 
                            className="h-10 px-6 rounded-xl border-2 border-slate-50 font-black uppercase text-[9px] tracking-widest text-slate-400 transition-all hover:bg-slate-50"
                        >
                            <PieChart className="h-4 w-4 mr-2" /> Analytics
                        </Button>
                    </Link>
                    <Link href="/payroll/history">
                        <Button 
                            variant="outline" 
                            className="h-10 px-6 rounded-xl border-2 border-slate-50 font-black uppercase text-[9px] tracking-widest text-slate-400 transition-all hover:bg-slate-50"
                        >
                            <History className="h-4 w-4 mr-2" /> Global History
                        </Button>
                    </Link>
                    <Button 
                        variant="outline"
                        onClick={() => setIsPolicyOpen(true)}
                        className="h-10 px-6 rounded-xl border-2 border-slate-50 font-black uppercase text-[9px] tracking-widest text-slate-400 transition-all hover:bg-slate-50"
                    >
                        <AlertCircle className="h-4 w-4 mr-2 text-rose-500" /> Payroll Policies
                    </Button>
                    <Button 
                        onClick={() => setIsSendDialogOpen(true)}
                        className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[9px] tracking-[0.3em] px-8 h-11 rounded-2xl  hover:translate-y-[-2px] transition-all"
                    >
                        Finalize Disbursement <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

           

            {/* Smart Search & Advanced Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 p-2 rounded-3xl backdrop-blur-sm border border-slate-50">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                        placeholder="Search employee by name, ID or node..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 w-full pl-12 rounded-2xl bg-white border-none shadow-sm font-bold text-[11px] focus:ring-2 ring-indigo-100"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="h-12 w-[180px] rounded-xl border-2 border-slate-50 font-black uppercase text-[9px] tracking-widest text-slate-900 bg-white shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-none shadow-2xl rounded-2xl">
                            {branches.map(b => (
                                <SelectItem key={b} value={b} className="font-bold text-[10px] uppercase">{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-12 w-[160px] rounded-2xl bg-white border-none shadow-sm font-black text-[9px] uppercase tracking-widest">
                            <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-none shadow-xl rounded-2xl">
                            <SelectItem value="ALL" className="text-[10px] font-bold uppercase">All Status</SelectItem>
                            <SelectItem value="Verified" className="text-[10px] font-bold uppercase">Verified</SelectItem>
                            <SelectItem value="Pending Audit" className="text-[10px] font-bold uppercase">Pending Audit</SelectItem>
                            <SelectItem value="Paid" className="text-[10px] font-bold uppercase">Paid Records</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button 
                        variant="outline" 
                        onClick={handleExportCSV}
                        className="h-12 px-6 rounded-2xl bg-white border-none shadow-sm font-black text-[9px] uppercase tracking-widest text-slate-900"
                    >
                        <FileDown className="h-4 w-4 mr-2 text-indigo-500" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Selected Batch Actions */}
            {selectedRows.length > 0 && (
                <div className="bg-indigo-600 p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">
                        {selectedRows.length} Employees Selected for Batch Action
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={handleBulkPay} className="h-9 rounded-xl bg-white text-indigo-600 font-black text-[9px] uppercase tracking-widest px-6 hover:bg-indigo-50">Mark as Paid</Button>
                        <Button onClick={() => setSelectedRows([])} variant="ghost" className="h-9 rounded-xl text-white font-black text-[9px] uppercase tracking-widest hover:bg-white/10">Cancel</Button>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">

                <Card className="border-none bg-slate-900 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <TrendingUp className="h-20 w-20" />
                    </div>
                    <div className="space-y-3 relative z-10">
                        <h3 className="text-sm font-black uppercase italic tracking-tighter text-[#D9F99D]">Salary Rules</h3>
                        <div className="flex gap-1.5">
                            <Badge className="bg-white/10 text-white border-white/20 font-black text-[7px] h-5 px-2 rounded-md uppercase tracking-widest">PF: 12%</Badge>
                            <Badge className="bg-white/10 text-white border-white/20 font-black text-[7px] h-5 px-2 rounded-md uppercase tracking-widest">PT: SLAB</Badge>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1 italic">Salary calculation is active.</p>
                    </div>
                    <Button onClick={() => setIsConfigOpen(true)} variant="link" className="text-[#D9F99D] font-black uppercase text-[8px] tracking-widest p-0 self-start mt-4 relative z-10 hover:no-underline">Global Rules</Button>
                </Card>

            </div>

            {/* Active Ledger */}
            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
                <CardHeader className="p-6 pb-3 border-none">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <CardTitle className="text-lg font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">Monthly Salary List</CardTitle>
                            <CardDescription className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] italic">Branch salary details</CardDescription>
                        </div>
                        <Badge className="bg-slate-900 text-white border-none font-black text-[8px] tracking-[0.2em] px-4 py-2 rounded-xl uppercase">Cycle: FEB 2026</Badge>
                    </div>
                </CardHeader>
                <CardContent className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="w-[50px] pl-6">
                                    <Checkbox 
                                        checked={selectedRows.length === filteredLedger.length && filteredLedger.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedRows(filteredLedger.map(e => e.id));
                                            else setSelectedRows([]);
                                        }}
                                        className="border-slate-200"
                                    />
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Details</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prorated Gross</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deductions</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statutory</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Payable</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                <TableHead className="text-right pr-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLedger.map((row) => {
                                const pNet = calculateProductionNet(row);
                                return (
                                <TableRow key={row.id} className="group border-none hover:bg-slate-50/50 transition-all h-20 border-b border-dashed border-slate-50 last:border-none">
                                    <TableCell className="pl-6">
                                        <Checkbox 
                                            checked={selectedRows.includes(row.id)}
                                            onCheckedChange={() => toggleRow(row.id)}
                                            className="border-slate-200"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase group-hover:translate-x-1 transition-transform">{row.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{row.designation}</Badge>
                                                <Badge className="bg-indigo-50 text-indigo-500 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{row.location}</Badge>
                                                <span className="text-[7px] font-bold text-rose-500 uppercase tracking-widest">{row.absentDays > 0 ? `${row.absentDays} LWP` : 'Full Present'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-slate-900">
                                        <div className="flex flex-col">
                                            <span>₹{pNet.totalEarnings.toLocaleString()}</span>
                                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Base CTC: ₹{row.fixedGross.toLocaleString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-bold text-slate-600">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-rose-500 font-black">₹{pNet.grossDeductions.toLocaleString()}</span>
                                            <span className="text-[7px] uppercase tracking-widest text-slate-400">Total Deducted</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {row.pfApplicable && <Badge className="bg-slate-900 text-white border-none font-black text-[7px] h-5 px-2 rounded-md uppercase tracking-widest">PF</Badge>}
                                            {row.esicApplicable && <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] h-5 px-2 rounded-md uppercase tracking-widest">ESI</Badge>}
                                            {!row.pfApplicable && !row.esicApplicable && <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[7px] h-5 px-2 rounded-md uppercase tracking-widest">NONE</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-emerald-600 italic">₹{pNet.net.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "border-none font-black text-[8px] uppercase tracking-widest px-3 h-6 rounded-lg shadow-sm",
                                            row.status === 'Paid' ? 'bg-[#D1FAE5] text-emerald-600' : 
                                            row.status === 'Verified' ? 'bg-blue-50 text-blue-600' : 'bg-[#FEF3C7] text-amber-600'
                                        )}>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 w-8 rounded-lg border-slate-100 p-0 hover:bg-slate-50"
                                                onClick={() => {
                                                    setSelectedEmployee(row);
                                                    setIsConfigOpen(true);
                                                }}
                                            >
                                                <LayoutList className="h-4 w-4 text-slate-400" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 w-8 rounded-lg border-slate-100 p-0 hover:bg-slate-50"
                                                onClick={() => {
                                                    setSelectedEmployee(row);
                                                    setIsHistoryOpen(true);
                                                }}
                                            >
                                                <History className="h-4 w-4 text-slate-400" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => generatePayslip(row)}
                                                className="h-8 rounded-lg border-slate-100 font-black uppercase text-[7px] tracking-widest px-3 hover:bg-[#D9F99D] hover:text-slate-900 hover:border-[#D9F99D] transition-all"
                                            >
                                                <Download className="h-3 w-3 mr-1.5" /> PDF
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Custom Rules Protocol */}
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <ShieldCheck className="h-32 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <TrendingUp className="h-5 w-5 text-[#D9F99D]" />
                            </div>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter">Tax Rules</h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose italic">Professional Tax for Madhya Pradesh branch.</p>
                        <div className="flex gap-3">
                            <Badge className="bg-white text-slate-900 border-none font-black text-[7px] h-5 px-3 rounded-lg uppercase tracking-widest shadow-sm">SLAB_1: ₹0</Badge>
                            <Badge className="bg-white text-slate-900 border-none font-black text-[7px] h-5 px-3 rounded-lg uppercase tracking-widest shadow-sm">SLAB_2: ₹2500/Y</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-start md:items-end space-y-4">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Manual Changes Enabled</p>
                        <Button 
                            onClick={() => setIsPolicyOpen(true)}
                            className="bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest px-8 h-11 rounded-xl shadow-xl hover:translate-y-[-2px] transition-all"
                        >
                            Edit Deductions
                        </Button>
                    </div>
                </div>
            </div>

            {/* Exported Modals */}
            <GlobalRulesSheet
                isOpen={isConfigOpen}
                onOpenChange={setIsConfigOpen}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                globalRules={globalRules}
                setGlobalRules={setGlobalRules}
                handleSalaryUpdate={handleSalaryUpdate}
                calculateProductionNet={calculateProductionNet}
            />

            <DisbursementDialog
                isOpen={isSendDialogOpen}
                onOpenChange={setIsSendDialogOpen}
                disbursementStep={disbursementStep}
                setDisbursementStep={setDisbursementStep}
                txDetails={txDetails}
                setTxDetails={setTxDetails}
                ledger={ledger}
                calculateProductionNet={calculateProductionNet}
                handleDisburseAll={handleDisburseAll}
            />

            <EmployeeHistoryDialog
                isOpen={isHistoryOpen}
                onOpenChange={setIsHistoryOpen}
                selectedEmployee={selectedEmployee}
            />

            <PayrollPolicyDialog
                isOpen={isPolicyOpen}
                onOpenChange={setIsPolicyOpen}
                globalRules={globalRules}
                setGlobalRules={setGlobalRules}
            />

            {/* Floating Batch Action Bar */}
            {selectedRows.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-slate-900 shadow-2xl rounded-3xl p-3 flex items-center gap-6 border border-white/10 backdrop-blur-xl">
                        <div className="pl-4 pr-6 border-r border-white/10">
                            <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-0.5">Selected</p>
                            <h5 className="text-sm font-black italic text-[#D9F99D] tracking-tighter uppercase">{selectedRows.length} Employees</h5>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                onClick={handleBulkPay}
                                className="h-10 rounded-xl bg-white text-slate-900 font-black uppercase text-[8px] tracking-widest px-6 hover:bg-[#D9F99D] transition-all"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Mark as Paid
                            </Button>
                            <Button 
                                variant="outline"
                                className="h-10 rounded-xl bg-white/5 border-white/10 text-white font-black uppercase text-[8px] tracking-widest px-6 hover:bg-white/10 transition-all"
                            >
                                <Download className="h-3.5 w-3.5 mr-2" /> Download All
                            </Button>
                            <Button 
                                onClick={() => setSelectedRows([])}
                                variant="ghost"
                                className="h-10 rounded-xl text-slate-400 font-black uppercase text-[8px] tracking-widest px-4 hover:text-white"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </ProtectedRoute>
    );
}

