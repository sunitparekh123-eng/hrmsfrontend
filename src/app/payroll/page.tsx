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

export default function PayrollPage() {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isLoanOpen, setIsLoanOpen] = useState(false);
    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
    const [isPastOpen, setIsPastOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isPolicyOpen, setIsPolicyOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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
        cycle: "MAY 2026",
        otRate: 150, // Per Hour
        lateLimit: 3, // 3 lates = 0.5 day LOP
        lateDeductionRate: 0.5,
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
            name: "Arjun Singh", 
            branch: "Mumbai HQ",
            base: 120000, 
            hra: 15000, 
            allowance: 7000,
            conveyance: 5000,
            medical: 2000,
            otHours: 10,
            lateMarks: 1,
            bonus: 2000,
            pfType: "Full PF", 
            loanBalance: 0, 
            loanDeduction: 0, 
            absentDays: 0,
            status: "Verified",
            node: "Node V.1"
        },
        { 
            id: 2, 
            name: "Meera Das", 
            branch: "Delhi Regional",
            base: 85000, 
            hra: 5000, 
            allowance: 2000,
            conveyance: 3000,
            medical: 1000,
            otHours: 5,
            lateMarks: 4,
            bonus: 0,
            pfType: "No PF", 
            loanBalance: 50000, 
            loanDeduction: 5000, 
            absentDays: 2,
            status: "Verified",
            node: "Node V.2"
        },
        { 
            id: 3, 
            name: "Rahul Sharma", 
            branch: "MP Branch",
            base: 95000, 
            hra: 10000, 
            allowance: 5000,
            conveyance: 5000,
            medical: 2000,
            otHours: 0,
            lateMarks: 0,
            bonus: 0,
            pfType: "Partial PF", 
            loanBalance: 0, 
            loanDeduction: 0, 
            absentDays: 0,
            status: "Draft",
            node: "Node V.1"
        },
        { 
            id: 4, 
            name: "Anita Kapoor", 
            branch: "MP Branch",
            base: 115000, 
            hra: 12000, 
            allowance: 6000,
            conveyance: 4000,
            medical: 2000,
            otHours: 2,
            lateMarks: 0,
            bonus: 5000,
            pfType: "Full PF", 
            loanBalance: 0, 
            loanDeduction: 0, 
            absentDays: 0,
            status: "Paid",
            node: "Node V.3"
        }
    ]);

    const calculateProductionNet = (row: any) => {
        const totalDays = 31;
        const gross = row.base + row.hra + row.allowance + row.conveyance + row.medical;
        
        const lop = (gross / totalDays) * row.absentDays;
        const otPay = row.otHours * globalRules.otRate;
        const latePenalty = Math.floor(row.lateMarks / globalRules.lateLimit) * (gross / totalDays * globalRules.lateDeductionRate);
        
        let pt = 0;
        if (gross > 25000) pt = 208;
        else if (gross > 15000) pt = 125;
        
        const pfBasis = row.pfType === "Full PF" ? row.base : Math.min(row.base, 15000);
        let pf = 0;
        if (row.pfType !== "No PF") {
            const rate = row.pfType === "Partial PF" ? 0.06 : 0.12;
            pf = pfBasis * rate;
        }

        const esi = gross <= 21000 ? gross * 0.0075 : 0;

        return {
            gross,
            lop: Math.round(lop),
            otPay: Math.round(otPay),
            latePenalty: Math.round(latePenalty),
            bonus: row.bonus || 0,
            pf: Math.round(pf),
            pt,
            esi: Math.round(esi),
            net: Math.round(gross + otPay + (row.bonus || 0) - lop - latePenalty - pf - pt - esi - row.loanDeduction)
        };
    };

    const calculateNet = (row: any) => calculateProductionNet(row).net;

    const handleSalaryUpdate = (id: number, field: string, value: any) => {
        setLedger(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
    };

    const handleExportCSV = () => {
        const headers = ["Employee", "Node", "Gross", "OT Pay", "Bonus", "LOP", "Late Penalty", "PF", "PT", "ESI", "Loan", "Net Payable"];
        const rows = ledger.map(emp => {
            const res = calculateProductionNet(emp);
            return [
                emp.name, emp.node, res.gross, res.otPay, res.bonus, res.lop, res.latePenalty, res.pf, res.pt, res.esi, emp.loanDeduction, res.net
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
        const matchesBranch = selectedBranch === "All Branches" || emp.branch === selectedBranch;
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toString().includes(searchQuery);
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
        const gross = pNet.gross;
        const pf = pNet.pf;
        const net = pNet.net;
        const pt = pNet.pt;
        const lop = pNet.lop;
        const esi = pNet.esi;

        // Branding
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("NODE HRMS", 20, 25);
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text("P AY R O L L   S L I P   •   M A Y   2 0 2 6", 20, 32);

        // Employee Info
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Employee: ${row.name}`, 20, 50);
        doc.text(`Designation: ${row.node}`, 20, 57);
        doc.text(`Branch: Indore Hub`, 20, 64);

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['Description', 'Earnings', 'Deductions']],
            body: [
                ['Basic Salary', `Rs. ${row.base.toLocaleString()}`, '-'],
                ['HRA', `Rs. ${row.hra.toLocaleString()}`, '-'],
                ['Allowances (Spl/Conv/Med)', `Rs. ${(row.allowance + row.conveyance + row.medical).toLocaleString()}`, '-'],
                ['Loss of Pay (LOP)', '-', `Rs. ${lop.toLocaleString()}`],
                ['Provident Fund (PF)', '-', `Rs. ${pf.toLocaleString()}`],
                ['Professional Tax (PT)', '-', `Rs. ${pt.toLocaleString()}`],
                ['ESI (Employees State Insurance)', '-', `Rs. ${esi.toLocaleString()}`],
                ['Loan/Advance Deduction', '-', `Rs. ${row.loanDeduction.toLocaleString()}`],
            ],
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42], fontSize: 10 },
            styles: { fontSize: 9 },
            foot: [['TOTAL', `Rs. ${gross.toLocaleString()}`, `Rs. ${(pf + pt + esi + lop + row.loanDeduction).toLocaleString()}`]],
            footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 150;
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`NET PAYABLE: Rs. ${net.toLocaleString()}`, 20, finalY + 20);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text("Note: This is a computer-generated document and does not require a signature.", 20, finalY + 40);

        doc.save(`${row.name.replace(" ", "_")}_Payslip_May2026.pdf`);
    };

    const handleFileUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsUploading(false);
                        setLedger(prevLedger => prevLedger.map(emp => ({
                            ...emp,
                            status: "Verified",
                            absentDays: Math.floor(Math.random() * 3)
                        })));
                    }, 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
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

            {/* Quick Actions & Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="border-none bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <FileSpreadsheet className="h-16 w-16" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Upload Salary List</h3>
                    <p className="text-xl font-black italic uppercase text-slate-900 tracking-tighter mb-4 leading-none">Excel Processing</p>
                    
                    {isUploading ? (
                        <div className="space-y-3 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase text-indigo-500 tracking-widest animate-pulse">Parsing Records...</span>
                                <span className="text-[9px] font-black text-slate-900">{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <input 
                                type="file" 
                                id="salary-upload" 
                                className="hidden" 
                                onChange={handleFileUpload}
                                accept=".csv,.xlsx,.xls"
                            />
                            <label 
                                htmlFor="salary-upload"
                                className="inline-flex items-center gap-2 bg-white border border-slate-100 shadow-sm text-slate-900 px-5 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5 text-indigo-500" /> Select Excel File
                            </label>
                        </div>
                    )}
                </Card>

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

                <Card className="border-none bg-[#D1FAE5] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="h-9 w-9 rounded-xl bg-white/50 flex items-center justify-center">
                            <Banknote className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter text-slate-900">Employee Loans</h3>
                        <p className="text-[9px] font-bold text-emerald-700/60 uppercase tracking-widest leading-loose">Manage advances and loans.</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 italic">08 Active Loans</span>
                        <Button onClick={() => setIsLoanOpen(true)} size="icon" className="h-8 w-8 rounded-lg bg-slate-900 text-white shadow-xl hover:scale-110 transition-transform">
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>
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
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Gross</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">OT / Late / Bonus</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">PF Rule</TableHead>
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
                                                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{row.node}</Badge>
                                                <Badge className="bg-indigo-50 text-indigo-500 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{row.branch}</Badge>
                                                <span className="text-[7px] font-bold text-rose-500 uppercase tracking-widest">{row.absentDays > 0 ? `${row.absentDays} Absent` : 'Full Attendance'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-slate-900">
                                        <div className="flex flex-col">
                                            <span>₹{pNet.gross.toLocaleString()}</span>
                                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Base CTC</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-bold text-slate-600">
                                        <div className="flex gap-2">
                                            <span className="text-emerald-600">+{pNet.otPay} (OT)</span>
                                            <span className="text-rose-500">-{pNet.latePenalty} (L)</span>
                                            <span className="text-blue-500">+{pNet.bonus} (B)</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-slate-50 text-slate-900 border-none font-black text-[7px] h-6 px-3 rounded-lg uppercase tracking-widest">
                                            {row.pfType}
                                        </Badge>
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

            {/* Salary Configuration Sheet */}
            <Sheet open={isConfigOpen} onOpenChange={(open) => {
                setIsConfigOpen(open);
                if (!open) setSelectedEmployee(null);
            }}>
                <SheetContent className="sm:max-w-[540px] border-none shadow-2xl p-0 overflow-y-auto">
                    <div className="h-2 bg-[#D9F99D]" />
                    <div className="p-8 space-y-10">
                        <SheetHeader className="text-left space-y-2">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-indigo-500" />
                            </div>
                            <SheetTitle className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">
                                {selectedEmployee ? `Configure: ${selectedEmployee.name}` : "Global Salary Rules"}
                            </SheetTitle>
                            <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                Define CTC components, PF rules, and Tax overrides for this employee.
                            </SheetDescription>
                        </SheetHeader>

                        {selectedEmployee ? (
                            <div className="grid gap-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Earnings Breakdown</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Basic Salary</Label>
                                            <Input 
                                                type="number" 
                                                value={selectedEmployee.base}
                                                onChange={(e) => handleSalaryUpdate(selectedEmployee.id, 'base', parseInt(e.target.value) || 0)}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">HRA Allowance</Label>
                                            <Input 
                                                type="number" 
                                                value={selectedEmployee.hra}
                                                onChange={(e) => handleSalaryUpdate(selectedEmployee.id, 'hra', parseInt(e.target.value) || 0)}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Special</Label>
                                            <Input 
                                                type="number" 
                                                value={selectedEmployee.allowance}
                                                onChange={(e) => handleSalaryUpdate(selectedEmployee.id, 'allowance', parseInt(e.target.value) || 0)}
                                                className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold text-[10px]" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Conv.</Label>
                                            <Input 
                                                type="number" 
                                                value={selectedEmployee.conveyance}
                                                onChange={(e) => handleSalaryUpdate(selectedEmployee.id, 'conveyance', parseInt(e.target.value) || 0)}
                                                className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold text-[10px]" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Medical</Label>
                                            <Input 
                                                type="number" 
                                                value={selectedEmployee.medical}
                                                onChange={(e) => handleSalaryUpdate(selectedEmployee.id, 'medical', parseInt(e.target.value) || 0)}
                                                className="h-10 rounded-xl bg-slate-50 border-slate-100 font-bold text-[10px]" 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2 pt-4 border-t border-slate-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Attendance & Compliance</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Absent Days</Label>
                                            <Input 
                                                type="number" 
                                                value={selectedEmployee.absentDays}
                                                onChange={(e) => handleSalaryUpdate(selectedEmployee.id, 'absentDays', parseInt(e.target.value) || 0)}
                                                className="h-12 rounded-xl bg-orange-50/50 border-orange-100 font-bold text-[11px]" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">PF Logic</Label>
                                            <Select 
                                                value={selectedEmployee.pfType}
                                                onValueChange={(val) => handleSalaryUpdate(selectedEmployee.id, 'pfType', val)}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-none shadow-xl rounded-xl">
                                                    <SelectItem value="Full PF" className="text-[10px] font-bold uppercase">Full (Override Ceiling)</SelectItem>
                                                    <SelectItem value="Partial PF" className="text-[10px] font-bold uppercase">Standard (15k Cap)</SelectItem>
                                                    <SelectItem value="No PF" className="text-[10px] font-bold uppercase">No PF</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 rounded-[2rem] bg-slate-950 text-white shadow-2xl relative overflow-hidden border border-white/5">
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <TrendingUp className="h-20 w-20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 relative z-10">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.3em] mb-1">LOP Deduction</p>
                                            <h4 className="text-lg font-black text-rose-400 tracking-tighter italic">₹{calculateProductionNet(selectedEmployee).lop.toLocaleString()}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black uppercase text-[#D9F99D] tracking-[0.3em] mb-1">Net In-Hand</p>
                                            <h4 className="text-3xl font-black italic tracking-tighter text-white">₹{calculateProductionNet(selectedEmployee).net.toLocaleString()}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                                        <Info className="h-5 w-5 text-amber-500 shrink-0" />
                                        <p className="text-[9px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
                                            Warning: These rules will apply to all employees who don't have custom overrides.
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Employer PF %</Label>
                                                <Input 
                                                    type="number" 
                                                    value={globalRules.pfEmployer}
                                                    onChange={(e) => setGlobalRules({...globalRules, pfEmployer: parseInt(e.target.value) || 0})}
                                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Employee PF %</Label>
                                                <Input 
                                                    type="number" 
                                                    value={globalRules.pfEmployee}
                                                    onChange={(e) => setGlobalRules({...globalRules, pfEmployee: parseInt(e.target.value) || 0})}
                                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">HRA % of Basic</Label>
                                                <Input 
                                                    type="number" 
                                                    value={globalRules.hraPercent}
                                                    onChange={(e) => setGlobalRules({...globalRules, hraPercent: parseInt(e.target.value) || 0})}
                                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Monthly Cycle</Label>
                                                <Input 
                                                    value={globalRules.cycle}
                                                    onChange={(e) => setGlobalRules({...globalRules, cycle: e.target.value})}
                                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <SheetFooter className="pt-6">
                            <Button onClick={() => setIsConfigOpen(false)} className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-xl">Save Configuration</Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Loan Management Dialog */}
            <Dialog open={isLoanOpen} onOpenChange={setIsLoanOpen}>
                <DialogContent className="sm:max-w-[425px] border-none shadow-2xl rounded-3xl p-8">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center mb-2">
                            <Banknote className="h-6 w-6 text-emerald-600" />
                        </div>
                        <DialogTitle className="text-xl font-black italic uppercase text-slate-900 tracking-tighter">Advance & Loan Request</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Issue a new advance payment or loan to an employee.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Employee</Label>
                            <Select>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]">
                                    <SelectValue placeholder="Choose Employee" />
                                </SelectTrigger>
                                <SelectContent className="border-none shadow-xl rounded-xl">
                                    {ledger.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id.toString()} className="text-[10px] font-bold uppercase">{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Loan Amount</Label>
                            <Input 
                                type="number" 
                                placeholder="₹ 0.00"
                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Monthly Deduction (EMI)</Label>
                            <Input 
                                type="number" 
                                placeholder="₹ 0.00"
                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:justify-start pt-4">
                        <Button onClick={() => setIsLoanOpen(false)} className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-xl">Disburse Loan</Button>
                        <Button variant="outline" onClick={() => setIsLoanOpen(false)} className="flex-1 h-12 rounded-2xl border-slate-100 font-black uppercase text-[9px] tracking-widest">Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send Salaries Confirmation Dialog Overhaul */}
            <Dialog open={isSendDialogOpen} onOpenChange={(open) => {
                setIsSendDialogOpen(open);
                if(!open) setDisbursementStep(1);
            }}>
                <DialogContent className="sm:max-w-[480px] border-none shadow-2xl rounded-[2.5rem] p-10 overflow-hidden">
                    {disbursementStep === 1 ? (
                        <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                            <div className="h-16 w-16 rounded-[1.2rem] bg-[#D9F99D] flex items-center justify-center mx-auto mb-6 shadow-xl group">
                                <Wallet className="h-8 w-8 text-slate-900 group-hover:scale-110 transition-transform" />
                            </div>
                            <DialogHeader className="text-center space-y-3">
                                <DialogTitle className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter mx-auto">Review Cycle</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-loose mx-auto">
                                    Confirming payout for <span className="text-slate-900 font-black italic">{ledger.length} Staff Members</span>
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="my-8 p-8 rounded-[2rem] bg-slate-950 text-white relative overflow-hidden border border-white/5 shadow-2xl">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <ArrowUpRight className="h-16 w-16" />
                                </div>
                                <div className="grid grid-cols-2 gap-6 text-left relative z-10">
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Total Gross</p>
                                        <p className="text-xl font-black italic text-white tracking-tighter">₹{ledger.reduce((acc, curr) => acc + calculateProductionNet(curr).gross, 0).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right border-l border-white/10 pl-6">
                                        <p className="text-[8px] font-black uppercase text-rose-400 tracking-[0.2em] mb-2">Deductions</p>
                                        <p className="text-xl font-black italic text-rose-500 tracking-tighter">
                                            -₹{ledger.reduce((acc, curr) => {
                                                const res = calculateProductionNet(curr);
                                                return acc + res.pf + res.pt + res.esi + res.lop + res.latePenalty;
                                            }, 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-[9px] font-black uppercase text-[#D9F99D] tracking-[0.3em] mb-2">Net Funds to Disburse</p>
                                    <h4 className="text-4xl font-black italic tracking-tighter">₹{ledger.reduce((acc, curr) => acc + calculateProductionNet(curr).net, 0).toLocaleString()}</h4>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button 
                                    onClick={() => setDisbursementStep(2)} 
                                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3"
                                >
                                    Verify & Finalize <ChevronRight className="h-5 w-5" />
                                </Button>
                                <button onClick={() => setIsSendDialogOpen(false)} className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-600 transition-colors py-2">
                                    No, Cancel Transaction
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                            <div className="h-16 w-16 rounded-[1.2rem] bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="h-8 w-8 text-indigo-600" />
                            </div>
                            <DialogHeader className="text-center space-y-3 mb-8">
                                <DialogTitle className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter mx-auto">Audit Details</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-loose mx-auto text-center">
                                    Mandatory fields for production ledger audit
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-5 mb-10">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Mode</Label>
                                    <Select value={txDetails.mode} onValueChange={(v) => setTxDetails({...txDetails, mode: v})}>
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-[11px] px-6">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-none rounded-xl shadow-2xl">
                                            <SelectItem value="NEFT/RTGS" className="font-bold text-xs uppercase italic">NEFT / RTGS (Manual)</SelectItem>
                                            <SelectItem value="Bulk UPI" className="font-bold text-xs uppercase italic">Bulk UPI Transfer</SelectItem>
                                            <SelectItem value="Manual/Cash" className="font-bold text-xs uppercase italic">Manual Disbursement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Reference / Batch ID</Label>
                                    <Input 
                                        value={txDetails.reference}
                                        onChange={(e) => setTxDetails({...txDetails, reference: e.target.value})}
                                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-[11px] px-6" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Authorized By</Label>
                                    <Input 
                                        value={txDetails.authorizedBy}
                                        onChange={(e) => setTxDetails({...txDetails, authorizedBy: e.target.value})}
                                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-[11px] px-6" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button 
                                    onClick={handleDisburseAll} 
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <CreditCard className="h-5 w-5" /> Release Funds Now
                                </Button>
                                <button onClick={() => setDisbursementStep(1)} className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-600 transition-colors py-2">
                                    Back to Summary
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Employee Specific Salary History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                <UserCircle className="h-8 w-8 text-[#D9F99D]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">{selectedEmployee?.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedEmployee?.node} • Salary History</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Total Paid YTD</p>
                                <p className="text-sm font-black italic text-[#D9F99D]">₹4,50,000</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Avg. Net Pay</p>
                                <p className="text-sm font-black italic text-white">₹1,12,500</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Leaves Taken</p>
                                <p className="text-sm font-black italic text-rose-400">12 Days</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Recent Payouts</p>
                        <div className="space-y-3">
                            {[
                                { month: "APR 2026", amount: "₹1,27,400", status: "Paid" },
                                { month: "MAR 2026", amount: "₹1,15,200", status: "Paid" },
                                { month: "FEB 2026", amount: "₹1,27,400", status: "Paid" },
                            ].map((h, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                                    <div className="flex items-center gap-3">
                                        <CalendarCheck className="h-4 w-4 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-900 uppercase">{h.month}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black italic text-slate-900">{h.amount}</span>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] h-5 px-2 rounded-lg">{h.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Global Payroll Policy Dialog */}
            <Dialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
                <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-3xl p-8">
                    <DialogHeader className="text-left space-y-2">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-rose-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Payroll Policies</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Define overtime rates and deduction rules for the entire company.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="operations" className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-50 rounded-2xl p-1 mb-8">
                            <TabsTrigger value="operations" className="rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Operations</TabsTrigger>
                            <TabsTrigger value="statutory" className="rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Statutory</TabsTrigger>
                        </TabsList>

                        <TabsContent value="operations" className="space-y-6 mt-0">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Overtime (OT) Rate / Hour</Label>
                                <Input 
                                    type="number" 
                                    value={globalRules.otRate}
                                    onChange={(e) => setGlobalRules({...globalRules, otRate: parseInt(e.target.value) || 0})}
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Late Mark Limit</Label>
                                    <Input 
                                        type="number" 
                                        value={globalRules.lateLimit}
                                        onChange={(e) => setGlobalRules({...globalRules, lateLimit: parseInt(e.target.value) || 0})}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Deduction (Days)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.5"
                                        value={globalRules.lateDeductionRate}
                                        onChange={(e) => setGlobalRules({...globalRules, lateDeductionRate: parseFloat(e.target.value) || 0})}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="statutory" className="space-y-6 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Employer PF %</Label>
                                    <Input 
                                        type="number" 
                                        value={globalRules.pfEmployer}
                                        onChange={(e) => setGlobalRules({...globalRules, pfEmployer: parseInt(e.target.value) || 0})}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Employee PF %</Label>
                                    <Input 
                                        type="number" 
                                        value={globalRules.pfEmployee}
                                        onChange={(e) => setGlobalRules({...globalRules, pfEmployee: parseInt(e.target.value) || 0})}
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]" 
                                    />
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-3">Professional Tax Slabs (MP)</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-slate-500 italic">Up to ₹1.5L / Yr</span>
                                        <span className="text-slate-900">₹0</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-slate-500 italic">Above ₹1.5L / Yr</span>
                                        <span className="text-slate-900">₹2,500 / Yr</span>
                                    </div>
                                </div>
                                <Button variant="link" className="h-auto p-0 mt-3 text-[8px] font-black uppercase tracking-widest text-indigo-500">Update Slabs</Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-8">
                        <Button onClick={() => setIsPolicyOpen(false)} className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-xl">Save All Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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

