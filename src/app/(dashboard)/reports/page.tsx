"use client";

import { useState } from "react";
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    ArrowUpRight, 
    Download, 
    Calendar, 
    PieChart, 
    Activity,
    ShieldCheck,
    Briefcase,
    Search,
    Filter,
    CheckCircle2,
    Building2,
    IndianRupee,
    FileSpreadsheet,
    FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Share client math logic from main payroll
const calculateProductionNet = (row: any) => {
    const daysInMonth = 28; // Extracted from client sheet
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
        totalMonthlyCTC,
        payableDays
    };
};

// Raw client Excel Ledger
const employeeLedger = [
    { id: 1, employeeCode: "EMP001", name: "SWAPNIL JAISWAL", location: "Indore", company: "BP Marketing", designation: "Accounts Head", fixedGross: 35000, pfApplicable: false, pfCeiling: false, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Verified" },
    { id: 2, employeeCode: "EMP002", name: "SIMRAN KATARIYA", location: "Indore", company: "BP Marketing", designation: "Sr . Commercial exe", fixedGross: 25000, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 1415, otherDeduction: 0, status: "Draft" },
    { id: 8, employeeCode: "EMP008", name: "SANDEEP CHOUHAN", location: "Indore", company: "BP Marketing", designation: "Supervisor", fixedGross: 13100, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 3, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Verified" },
    { id: 39, employeeCode: "EMP039", name: "SHRAVAN MUNIYA", location: "Ratlam", company: "Apaar Logistics", designation: "SR.SUPERVISOR", fixedGross: 16000, pfApplicable: true, pfCeiling: true, esicApplicable: true, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Paid" },
    { id: 3, employeeCode: "EMP003", name: "SAGAR BAKSHE", location: "Indore", company: "BP Marketing", designation: "Depot Manager", fixedGross: 40000, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Verified" },
    { id: 4, employeeCode: "EMP004", name: "ABHISHEK KURIL", location: "Indore", company: "BP Marketing", designation: "Commercial Exe", fixedGross: 18499, pfApplicable: true, pfCeiling: true, esicApplicable: false, absentDays: 0, bonus: 0, previousArrears: 0, incentive: 0, loanDeduction: 0, otherDeduction: 0, status: "Draft" }
];

type ReportType = "payroll" | "attendance" | "statutory" | "branch";

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState<ReportType>("payroll");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("All");
    const [selectedCycle, setSelectedCycle] = useState("FEB 2026");

    // Processed client employee data
    const processedData = employeeLedger.map(emp => {
        const math = calculateProductionNet(emp);
        return {
            ...emp,
            math
        };
    });

    // Filtering data
    const filteredEmployees = processedData.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBranch = selectedBranch === "All" || emp.location === selectedBranch;
        return matchesSearch && matchesBranch;
    });

    // Dynamic stats aggregation
    const totalStaff = processedData.length;
    const totalGrossPayout = processedData.reduce((acc, curr) => acc + curr.math.proratedGross, 0);
    const totalNetPayout = processedData.reduce((acc, curr) => acc + curr.math.net, 0);
    const averageAttendance = Math.round(
        (processedData.reduce((acc, curr) => acc + (28 - curr.absentDays), 0) / (totalStaff * 28)) * 100
    );
    const totalDeductions = processedData.reduce((acc, curr) => acc + curr.math.grossDeductions, 0);

    // Export Reports to Excel
    const handleExportExcel = () => {
        let sheetData: any[] = [];
        let filename = `HRMS_Report_${selectedReport}_${selectedCycle}.xlsx`;

        if (selectedReport === "payroll") {
            sheetData = filteredEmployees.map(emp => ({
                "Employee Code": emp.employeeCode,
                "Name": emp.name,
                "Designation": emp.designation,
                "Location/Branch": emp.location,
                "Company": emp.company,
                "Base CTC (₹)": emp.fixedGross,
                "Prorated Gross (₹)": emp.math.proratedGross,
                "Total Earnings (+Arrears/Bonus) (₹)": emp.math.totalEarnings,
                "Statutory Deductions (₹)": emp.math.grossDeductions,
                "Net In-Hand Payable (₹)": emp.math.net,
                "Status": emp.status
            }));
        } else if (selectedReport === "attendance") {
            sheetData = filteredEmployees.map(emp => ({
                "Employee Code": emp.employeeCode,
                "Name": emp.name,
                "Designation": emp.designation,
                "Location/Branch": emp.location,
                "Total Billing Days": 28,
                "Absent Days (LWP)": emp.absentDays,
                "Payable Days": emp.math.payableDays,
                "Attendance Rate (%)": Math.round((emp.math.payableDays / 28) * 100),
                "Status": emp.status
            }));
        } else if (selectedReport === "statutory") {
            sheetData = filteredEmployees.map(emp => ({
                "Employee Code": emp.employeeCode,
                "Name": emp.name,
                "Employee PF Contribution (₹)": emp.math.pf,
                "Employer PF Contribution (₹)": emp.math.pfEmployer,
                "Employee ESI (₹)": emp.math.esi,
                "Employer ESI (₹)": emp.math.esiEmployer,
                "Professional Tax (PT) (₹)": emp.math.pt,
                "Loan/Advance Deductions (₹)": emp.loanDeduction,
                "Other Deductions (₹)": emp.otherDeduction,
                "Employer Total Monthly Liability (₹)": emp.math.totalMonthlyCTC
            }));
        } else if (selectedReport === "branch") {
            // Aggregate branch metrics
            const locations = ["Indore", "Ratlam"];
            sheetData = locations.map(loc => {
                const branchStaff = processedData.filter(e => e.location === loc);
                const headcount = branchStaff.length;
                const baseGrossSum = branchStaff.reduce((acc, c) => acc + c.fixedGross, 0);
                const netPayoutSum = branchStaff.reduce((acc, c) => acc + c.math.net, 0);
                const pfLiabilitySum = branchStaff.reduce((acc, c) => acc + c.math.pfEmployer, 0);

                return {
                    "Branch / Hub Location": loc,
                    "Total Headcount": headcount,
                    "Total Fixed Salaries (Base CTC)": baseGrossSum,
                    "Total In-Hand Disbursed (Net)": netPayoutSum,
                    "Total Employer PF Liability": pfLiabilitySum,
                    "Average In-hand Salary": Math.round(netPayoutSum / headcount)
                };
            });
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, "Business Report");
        XLSX.writeFile(wb, filename);
    };

    // Export Reports to PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("HRMS BUSINESS REPORT CENTER", 14, 18);
        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");
        doc.text(`Report Type: ${selectedReport.toUpperCase()} | Cycle: ${selectedCycle}`, 14, 25);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        let headers: string[] = [];
        let body: any[] = [];

        if (selectedReport === "payroll") {
            headers = ["Code", "Employee Name", "Branch", "Base CTC", "Gross", "Deductions", "Net Pay"];
            body = filteredEmployees.map(emp => [
                emp.employeeCode,
                emp.name,
                emp.location,
                `INR ${emp.fixedGross.toLocaleString()}`,
                `INR ${emp.math.proratedGross.toLocaleString()}`,
                `INR ${emp.math.grossDeductions.toLocaleString()}`,
                `INR ${emp.math.net.toLocaleString()}`
            ]);
        } else if (selectedReport === "attendance") {
            headers = ["Code", "Employee Name", "Designation", "LWP Days", "Active Days", "Rate %"];
            body = filteredEmployees.map(emp => [
                emp.employeeCode,
                emp.name,
                emp.designation,
                emp.absentDays,
                emp.math.payableDays,
                `${Math.round((emp.math.payableDays / 28) * 100)}%`
            ]);
        } else if (selectedReport === "statutory") {
            headers = ["Name", "EE PF", "ER PF", "EE ESI", "ER ESI", "PT", "Net Liability"];
            body = filteredEmployees.map(emp => [
                emp.name,
                `INR ${emp.math.pf}`,
                `INR ${emp.math.pfEmployer}`,
                `INR ${emp.math.esi}`,
                `INR ${emp.math.esiEmployer}`,
                `INR ${emp.math.pt}`,
                `INR ${emp.math.totalMonthlyCTC.toLocaleString()}`
            ]);
        } else if (selectedReport === "branch") {
            headers = ["Branch Location", "Headcount", "Total CTC", "Disbursed Net", "Avg Net Pay"];
            const locations = ["Indore", "Ratlam"];
            body = locations.map(loc => {
                const branchStaff = processedData.filter(e => e.location === loc);
                const headcount = branchStaff.length;
                const baseGrossSum = branchStaff.reduce((acc, c) => acc + c.fixedGross, 0);
                const netPayoutSum = branchStaff.reduce((acc, c) => acc + c.math.net, 0);
                return [
                    loc,
                    headcount,
                    `INR ${baseGrossSum.toLocaleString()}`,
                    `INR ${netPayoutSum.toLocaleString()}`,
                    `INR ${Math.round(netPayoutSum / headcount).toLocaleString()}`
                ];
            });
        }

        autoTable(doc, {
            head: [headers],
            body: body,
            startY: 38,
            theme: "striped",
            styles: { fontSize: 8, font: "Helvetica", fontStyle: "normal" },
            headStyles: { fillColor: [15, 23, 42] }
        });

        doc.save(`HRMS_Report_${selectedReport}_${selectedCycle}.pdf`);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                        <BarChart3 className="h-7 w-7 text-indigo-500" /> Business Reports
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] leading-loose">Detailed compliance analytics, workforce performance & complete financial data.</p>
                </div>
                
                {/* Global Controls */}
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                    <div className="flex items-center gap-1.5 px-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <select 
                            value={selectedCycle} 
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider text-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="FEB 2026">FEB 2026</option>
                            <option value="MAR 2026">MAR 2026</option>
                            <option value="APR 2026">APR 2026</option>
                        </select>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <Button 
                        onClick={handleExportExcel}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[8px] tracking-widest px-4 h-9 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                        <FileSpreadsheet className="h-3.5 w-3.5" /> XLS Export
                    </Button>
                    <Button 
                        onClick={handleExportPDF}
                        className="bg-slate-900 hover:bg-black text-white font-black uppercase text-[8px] tracking-widest px-4 h-9 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                        <FileText className="h-3.5 w-3.5" /> PDF Export
                    </Button>
                </div>
            </div>

            {/* Top Summaries Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {[
                    { label: "Attendance Efficiency", value: `${averageAttendance}%`, icon: Activity, color: "bg-[#E0E7FF] text-indigo-600", note: "Optimal Attendance Rate" },
                    { label: "Statutory Deductions", value: `₹${totalDeductions.toLocaleString()}`, icon: ShieldCheck, color: "bg-[#FEF3C7] text-amber-600", note: "Total Government Liabilities" },
                    { label: "Net Disbursed Salaries", value: `₹${totalNetPayout.toLocaleString()}`, icon: IndianRupee, color: "bg-[#D1FAE5] text-emerald-600", note: "Direct In-hand Payroll releases" },
                    { label: "Workforce Count", value: `${totalStaff} Staff`, icon: Users, color: "bg-[#FEE2E2] text-rose-600", note: "Active Employees in Ledger" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none rounded-2xl p-6 shadow-sm bg-white flex flex-col justify-between h-36 group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center font-bold", stat.color)}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[7.5px] font-black uppercase text-slate-400 tracking-widest select-none">{stat.note}</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mt-1">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Interactive Selector Tabs & Detailed Table Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start px-2">
                
                {/* Reports Sidebar Selectors */}
                <div className="lg:col-span-3 space-y-3">
                    <p className="text-[8.5px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Available Reports</p>
                    <div className="flex flex-col gap-2">
                        {[
                            { id: "payroll", label: "Payroll & CTC breakdown", desc: "Detailed CTC, Gross, Deductions and Net payable." },
                            { id: "attendance", label: "Attendance & LWP Log", desc: "Leaves, working days, active billing hours." },
                            { id: "statutory", label: "Statutory & Deductions", desc: "Employee & Employer PF/ESI liabilities breakdown." },
                            { id: "branch", label: "Branch Operations split", desc: "CTC distribution, salaries and headcounts per branch." }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedReport(tab.id as ReportType)}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl transition-all border outline-none flex flex-col gap-1.5",
                                    selectedReport === tab.id 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.01]" 
                                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-wider",
                                    selectedReport === tab.id ? "text-[#D9F99D]" : "text-slate-900"
                                )}>
                                    {tab.label}
                                </span>
                                <span className={cn(
                                    "text-[8.5px] font-medium leading-relaxed",
                                    selectedReport === tab.id ? "text-slate-300" : "text-slate-400"
                                )}>
                                    {tab.desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Table Viewer Area */}
                <Card className="lg:col-span-9 border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
                    <CardHeader className="p-6 pb-4 border-none flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <CardTitle className="text-base font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">
                                {selectedReport === "payroll" && "Payroll CTC Details Ledger"}
                                {selectedReport === "attendance" && "Attendance & LWP Statistics"}
                                {selectedReport === "statutory" && "Statutory Deductions & Liabilities"}
                                {selectedReport === "branch" && "Branch CTC Allocation & Headcounts"}
                            </CardTitle>
                            <CardDescription className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.25em] italic">
                                Dynamic live calculation from March Excel records
                            </CardDescription>
                        </div>

                        {/* Search and Filters inside table */}
                        {selectedReport !== "branch" && (
                            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                                <div className="relative min-w-[160px] group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <Input 
                                        placeholder="Search Employee..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 pl-9 pr-3 rounded-xl bg-white border-none shadow-sm font-bold text-[9px] focus:ring-2 ring-indigo-100"
                                    />
                                </div>
                                <select 
                                    value={selectedBranch} 
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    className="h-9 px-3 rounded-xl bg-white border-none shadow-sm font-black uppercase text-[8px] tracking-wider text-slate-700 focus:outline-none cursor-pointer"
                                >
                                    <option value="All">All Hubs</option>
                                    <option value="Indore">Indore Hub</option>
                                    <option value="Ratlam">Ratlam Depot</option>
                                </select>
                            </div>
                        )}
                    </CardHeader>
                    
                    <CardContent className="p-0">
                        <Table>
                            {/* Dynamically switching Table Columns based on report type */}
                            {selectedReport === "payroll" && (
                                <>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Designation</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Base gross ctc</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Prorated Gross</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statutory</TableHead>
                                            <TableHead className="pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Net Payable</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEmployees.map((emp) => (
                                            <TableRow key={emp.id} className="border-b border-dashed border-slate-50 last:border-none h-16 hover:bg-slate-50/40 transition-colors">
                                                <TableCell className="pl-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{emp.name}</span>
                                                        <span className="text-[7.5px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{emp.employeeCode} | {emp.company}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[7px] h-4.5 px-2 rounded-md uppercase tracking-widest">{emp.designation}</Badge>
                                                </TableCell>
                                                <TableCell className="text-xs font-black text-slate-900">₹{emp.fixedGross.toLocaleString()}</TableCell>
                                                <TableCell className="text-xs font-bold text-slate-600">₹{emp.math.proratedGross.toLocaleString()}</TableCell>
                                                <TableCell className="text-[10px] font-bold text-rose-500">₹{emp.math.grossDeductions.toLocaleString()}</TableCell>
                                                <TableCell className="pr-6 text-right text-xs font-black text-emerald-600 italic">₹{emp.math.net.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </>
                            )}

                            {selectedReport === "attendance" && (
                                <>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Details</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total cycle days</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Absent Days (LWP)</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Payable Days</TableHead>
                                            <TableHead className="pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Attendance rate</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEmployees.map((emp) => {
                                            const attendanceRate = Math.round((emp.math.payableDays / 28) * 100);
                                            return (
                                                <TableRow key={emp.id} className="border-b border-dashed border-slate-50 last:border-none h-16 hover:bg-slate-50/40 transition-colors">
                                                    <TableCell className="pl-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{emp.name}</span>
                                                            <span className="text-[7.5px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{emp.designation} | {emp.location}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-black text-slate-900">28 Days</TableCell>
                                                    <TableCell className="text-xs font-black text-rose-500">{emp.absentDays} Days</TableCell>
                                                    <TableCell className="text-xs font-black text-slate-600">{emp.math.payableDays} Days</TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <Badge className={cn(
                                                            "border-none font-black text-[8px] uppercase tracking-widest px-2.5 h-5 rounded-md shadow-sm",
                                                            attendanceRate > 90 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                                                        )}>
                                                            {attendanceRate}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </>
                            )}

                            {selectedReport === "statutory" && (
                                <>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">PF EE / ER</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ESI EE / ER</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Prof Tax (PT)</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Other Deductions</TableHead>
                                            <TableHead className="pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total CTC Cost</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEmployees.map((emp) => (
                                            <TableRow key={emp.id} className="border-b border-dashed border-slate-50 last:border-none h-16 hover:bg-slate-50/40 transition-colors">
                                                <TableCell className="pl-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{emp.name}</span>
                                                        <span className="text-[7.5px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{emp.employeeCode}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-black text-slate-900">₹{emp.math.pf.toLocaleString()} <span className="text-slate-400 font-medium">EE</span></span>
                                                        <span className="text-[7.5px] text-slate-500 font-bold">₹{emp.math.pfEmployer.toLocaleString()} <span className="text-slate-400 font-medium">ER</span></span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] font-black text-slate-900">₹{emp.math.esi.toLocaleString()} <span className="text-slate-400 font-medium">EE</span></span>
                                                        <span className="text-[7.5px] text-slate-500 font-bold">₹{emp.math.esiEmployer.toLocaleString()} <span className="text-slate-400 font-medium">ER</span></span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold text-slate-600">₹{emp.math.pt.toLocaleString()}</TableCell>
                                                <TableCell className="text-xs font-bold text-rose-500">₹{(emp.loanDeduction + emp.otherDeduction).toLocaleString()}</TableCell>
                                                <TableCell className="pr-6 text-right text-xs font-black text-indigo-600 italic">₹{emp.math.totalMonthlyCTC.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </>
                            )}

                            {selectedReport === "branch" && (
                                <>
                                    <TableHeader>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Branch Location</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Headcount</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Gross Budget</TableHead>
                                            <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Statutory Liabilities</TableHead>
                                            <TableHead className="pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Avg net pay</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {["Indore", "Ratlam"].map((loc, idx) => {
                                            const branchStaff = processedData.filter(e => e.location === loc);
                                            const headcount = branchStaff.length;
                                            const baseGrossSum = branchStaff.reduce((acc, c) => acc + c.fixedGross, 0);
                                            const netPayoutSum = branchStaff.reduce((acc, c) => acc + c.math.net, 0);
                                            const pfLiabilitySum = branchStaff.reduce((acc, c) => acc + c.math.pfEmployer, 0);

                                            return (
                                                <TableRow key={idx} className="border-b border-dashed border-slate-50 last:border-none h-16 hover:bg-slate-50/40 transition-colors">
                                                    <TableCell className="pl-6">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4 text-indigo-500" />
                                                            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{loc} Hub / Depot</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-black text-slate-900">{headcount} Staff</TableCell>
                                                    <TableCell className="text-xs font-black text-slate-600">₹{baseGrossSum.toLocaleString()}</TableCell>
                                                    <TableCell className="text-xs font-black text-amber-600">₹{pfLiabilitySum.toLocaleString()}</TableCell>
                                                    <TableCell className="pr-6 text-right text-xs font-black text-emerald-600 italic">₹{Math.round(netPayoutSum / headcount).toLocaleString()}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </>
                            )}
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
