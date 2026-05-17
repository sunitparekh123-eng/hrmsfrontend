"use client";

import { useState } from "react";
import {
  Landmark, Plus, Search, Filter, CheckCircle2, Clock, XCircle,
  IndianRupee, CalendarDays, User, ArrowUpRight, Download,
  TrendingDown, Percent, CreditCard, Activity, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogTitle, DialogFooter, DialogDescription, DialogHeader
} from "@/components/ui/dialog";

const cn = (...c: string[]) => c.filter(Boolean).join(" ");

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Closed: "bg-slate-100 text-slate-500",
  Rejected: "bg-rose-50 text-rose-600",
};

const statusIcon: Record<string, any> = {
  Active: Activity,
  Pending: Clock,
  Closed: CheckCircle2,
  Rejected: XCircle,
};

type LoanPayment = {
  id: string;
  date: string;
  amount: number;
  method: string;
  recordedBy: string;
  notes: string;
};

type Loan = {
  id: string;
  employee: string;
  dept: string;
  type: string;
  principal: number;
  interestRate: number;
  tenureMonths: number;
  emi: number;
  totalPaid: number;
  status: string;
  appliedOn: string;
  disbursedOn?: string;
  nextEmiDate?: string;
  payments?: LoanPayment[];
  branch?: string;
};

const MOCK_LOANS: Loan[] = [
  { id: "LN001", employee: "Rajesh Kumar", dept: "Engineering", type: "Personal Loan", principal: 250000, interestRate: 8.5, tenureMonths: 24, emi: 11364, totalPaid: 136368, status: "Active", appliedOn: "Jan 10, 2025", disbursedOn: "Jan 15, 2025", nextEmiDate: "Jun 01, 2026", branch: "Mumbai" },
  { id: "LN002", employee: "Anita Sharma", dept: "HR", type: "Medical Emergency", principal: 100000, interestRate: 0, tenureMonths: 10, emi: 10000, totalPaid: 30000, status: "Active", appliedOn: "Feb 20, 2026", disbursedOn: "Feb 22, 2026", nextEmiDate: "Jun 01, 2026", branch: "Delhi" },
  { id: "LN003", employee: "Vikas Singh", dept: "Sales", type: "Vehicle Loan", principal: 500000, interestRate: 9.0, tenureMonths: 36, emi: 15900, totalPaid: 572400, status: "Closed", appliedOn: "Mar 12, 2023", disbursedOn: "Mar 15, 2023", branch: "Bangalore" },
  { id: "LN004", employee: "Priya Desai", dept: "Marketing", type: "Home Advance", principal: 150000, interestRate: 5.0, tenureMonths: 12, emi: 12841, totalPaid: 0, status: "Pending", appliedOn: "May 14, 2026", branch: "Mumbai" },
  { id: "LN005", employee: "Arjun Verma", dept: "Operations", type: "Personal Loan", principal: 300000, interestRate: 8.5, tenureMonths: 24, emi: 13637, totalPaid: 0, status: "Rejected", appliedOn: "May 01, 2026", branch: "Delhi" },
];

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [activeTab, setActiveTab] = useState<"directory"|"policies">("directory");
  
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Loan | null>(null);

  // Manual EMI state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "", date: new Date().toISOString().split('T')[0], method: "Bank Transfer", notes: ""
  });

  const [form, setForm] = useState({
    employee: "", dept: "Unassigned", type: "Personal Loan", principal: "", interestRate: "12", tenureMonths: "10",
    dateOfLoan: new Date().toISOString().split('T')[0],
    deductFrom: "", createdDate: new Date().toISOString().split('T')[0],
    loanTypeOption: "Reducing Interest EMI", loanAccountNo: "", perquisiteRate: "0", remarks: ""
  });

  const getCalculatedEMI = () => {
    const p = Number(form.principal) || 0;
    const r = Number(form.interestRate) || 0;
    const t = Number(form.tenureMonths) || 1;
    if (p === 0) return 0;
    if (r === 0) return p / t;
    const monthlyRate = r / 12 / 100;
    return (p * monthlyRate * Math.pow(1 + monthlyRate, t)) / (Math.pow(1 + monthlyRate, t) - 1);
  };
  
  const calculatedEmi = getCalculatedEMI();
  const totalInterest = (calculatedEmi * (Number(form.tenureMonths) || 1)) - (Number(form.principal) || 0);

  const getClosingDate = () => {
    if (!form.deductFrom || !form.tenureMonths) return "N/A";
    const date = new Date(form.deductFrom);
    date.setMonth(date.getMonth() + (Number(form.tenureMonths) || 1) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const filtered = loans.filter(l => {
    const matchSearch = l.employee.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    const matchBranch = filterBranch === "All" || l.branch === filterBranch;
    return matchSearch && matchStatus && matchBranch;
  });

  const totalDisbursed = loans.filter(l => ["Active", "Closed"].includes(l.status)).reduce((acc, curr) => acc + curr.principal, 0);
  const activePrincipal = loans.filter(l => l.status === "Active").reduce((acc, curr) => acc + curr.principal, 0);
  const recoveredAmount = loans.reduce((acc, curr) => acc + curr.totalPaid, 0);
  const activeCount = loans.filter(l => l.status === "Active").length;

  const handleApply = () => {
    const principal = Number(form.principal) || 0;
    const rate = Number(form.interestRate) || 0;
    const tenure = Number(form.tenureMonths) || 1;
    // Simple EMI calc for demo purposes
    const monthlyRate = rate / 12 / 100;
    const emi = monthlyRate === 0 
      ? principal / tenure 
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);

    const newLoan: Loan = {
      id: `LN00${loans.length + 1}`,
      employee: form.employee || "Unknown User",
      dept: form.dept,
      type: form.loanTypeOption,
      principal,
      interestRate: rate,
      tenureMonths: tenure,
      emi: Math.round(emi),
      totalPaid: 0,
      status: "Pending",
      appliedOn: form.dateOfLoan
    };
    setLoans([newLoan, ...loans]);
    setShowAdd(false);
    setForm({ employee: "", dept: "Unassigned", type: "Personal Loan", principal: "", interestRate: "12", tenureMonths: "10", dateOfLoan: new Date().toISOString().split('T')[0], deductFrom: "", createdDate: new Date().toISOString().split('T')[0], loanTypeOption: "Reducing Interest EMI", loanAccountNo: "", perquisiteRate: "0", remarks: "" });
  };

  const handleStatusChange = (newStatus: "Active" | "Rejected") => {
    if (!selected) return;
    setLoans(prev => prev.map(l => l.id === selected.id ? { ...l, status: newStatus, disbursedOn: newStatus === "Active" ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : undefined } : l));
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const openPaymentDialog = () => {
    if (!selected) return;
    const totalPayable = selected.emi * selected.tenureMonths;
    const remaining = totalPayable - selected.totalPaid;
    setPaymentForm({
      amount: String(Math.min(selected.emi, remaining)),
      date: new Date().toISOString().split('T')[0],
      method: "Bank Transfer",
      notes: "Manual EMI adjustment"
    });
    setShowPaymentDialog(true);
  };

  const handleRecordEMI = () => {
    if (!selected) return;
    const amountToPay = Number(paymentForm.amount) || 0;
    if (amountToPay <= 0) return;
    
    const totalPayable = selected.emi * selected.tenureMonths;
    const newTotalPaid = selected.totalPaid + amountToPay;
    const newStatus = newTotalPaid >= totalPayable ? "Closed" : selected.status;
    
    const newPayment: LoanPayment = {
      id: `PMT${Date.now()}`,
      date: paymentForm.date,
      amount: amountToPay,
      method: paymentForm.method,
      recordedBy: "Admin User",
      notes: paymentForm.notes
    };

    setLoans(prev => prev.map(l => l.id === selected.id ? { 
      ...l, totalPaid: newTotalPaid, status: newStatus, payments: [...(l.payments || []), newPayment] 
    } : l));
    
    setSelected(prev => prev ? { 
      ...prev, totalPaid: newTotalPaid, status: newStatus, payments: [...(prev.payments || []), newPayment] 
    } : null);
    
    setShowPaymentDialog(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter underline underline-offset-4 decoration-[#D9F99D] decoration-2">
            <Landmark className="h-6 w-6 text-rose-500" /> Employee Loans
          </h1>
          <p className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">
            Manage salary advances, emergency funds, and personal loans.
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-widest px-8 h-11 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Grant Advance / Loan
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Loans",       value: activeCount,                                suffix: "Accounts", icon: Activity,     bg: "bg-white"       },
          { label: "Total Disbursed",    value: `₹ ${totalDisbursed.toLocaleString()}`,     suffix: "",         icon: Landmark,     bg: "bg-white"       },
          { label: "Outstanding Amt",    value: `₹ ${(activePrincipal - recoveredAmount > 0 ? activePrincipal - recoveredAmount : 0).toLocaleString()}`, suffix: "", icon: TrendingDown, bg: "bg-[#D9F99D]"  },
          { label: "Recovered via EMI",  value: `₹ ${recoveredAmount.toLocaleString()}`,    suffix: "",         icon: CheckCircle2, bg: "bg-white"       },
        ].map((s, i) => (
          <Card key={i} className={`${s.bg} border-none rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-all`}>
            <div className="h-8 w-8 bg-slate-100 rounded-xl flex items-center justify-center">
              <s.icon className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{s.label}</p>
              <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                {s.value} <span className="text-xs font-bold text-slate-400">{s.suffix}</span>
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2">
        {(["directory","policies"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 h-9 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all",
              activeTab === tab
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-100"
            )}
          >
            {tab === "directory" ? "Loan Directory" : "Lending Policies"}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      {activeTab === "directory" && (
        <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
          <CardHeader className="p-6 pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">
                  Loan Portfolio
                </CardTitle>
                <CardDescription className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-[0.3em] italic">
                  {filtered.length} matching records
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {["All","Active","Pending","Closed","Rejected"].map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={cn(
                        "px-3 h-8 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all",
                        filterStatus === s ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      )}
                    >{s}</button>
                  ))}
                </div>
                <select
                  value={filterBranch}
                  onChange={e => setFilterBranch(e.target.value)}
                  className="h-8 bg-slate-50 border-none rounded-lg font-black text-[9px] uppercase tracking-widest px-3 outline-none focus:ring-1 focus:ring-[#D9F99D] text-slate-600"
                >
                  <option value="All">All Branches</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                  <Input
                    placeholder="Search ID / Name…"
                    className="h-9 w-52 pl-9 bg-slate-50 border-none rounded-xl font-bold text-[10px] focus-visible:ring-1 focus-visible:ring-[#D9F99D]"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-3">
              {filtered.map(loan => {
                const Icon = statusIcon[loan.status] || CheckCircle2;
                return (
                  <div
                    key={loan.id}
                    onClick={() => setSelected(loan)}
                    className="flex items-center justify-between rounded-2xl border-2 border-slate-50 p-4 hover:border-[#D9F99D] hover:bg-slate-50/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-[#D9F99D]/20 transition-colors shrink-0">
                        <IndianRupee className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{loan.employee}</span>
                          <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">{loan.dept}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 mt-0.5">{loan.type} · {loan.interestRate}% P.A.</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[7px] font-black text-slate-400 uppercase flex items-center gap-1">
                            <CalendarDays className="h-2.5 w-2.5" />{loan.tenureMonths} Months
                          </span>
                          <span className="text-[7px] font-black text-slate-400 uppercase flex items-center gap-1">
                            <CreditCard className="h-2.5 w-2.5" />EMI: ₹ {loan.emi.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5 shrink-0">
                      {loan.status === "Active" && (
                        <div className="hidden sm:block text-right pr-4 border-r border-slate-100">
                          <p className="text-[9px] font-black text-slate-900 uppercase">₹ {loan.totalPaid.toLocaleString()} Paid</p>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-[#84cc16]" style={{ width: `${Math.min(100, (loan.totalPaid / (loan.emi * loan.tenureMonths)) * 100)}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900">₹ {loan.principal.toLocaleString()}</p>
                        <p className="text-[7px] font-bold text-slate-300 uppercase">{loan.id}</p>
                      </div>
                      <Badge className={cn("border-none font-black text-[7px] uppercase tracking-widest px-2 py-1 rounded-lg flex items-center gap-1", statusStyle[loan.status])}>
                        <Icon className="h-2.5 w-2.5" /> {loan.status}
                      </Badge>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-200 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-300">
                  <Landmark className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-black uppercase tracking-widest">No loans found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "policies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Interest Rates */}
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all">
             <CardHeader className="p-5 pb-2 bg-slate-50/50 flex flex-row items-center gap-3">
               <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                 <Percent className="h-4 w-4 text-slate-900" />
               </div>
               <div>
                 <CardTitle className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Interest Rates</CardTitle>
                 <CardDescription className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fixed rates per loan type</CardDescription>
               </div>
             </CardHeader>
             <CardContent className="p-5 space-y-3">
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Medical Emergency</p>
                 <Badge className="bg-emerald-50 text-emerald-600 font-black text-[9px]">0% P.A.</Badge>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Home Advance</p>
                 <Badge className="bg-amber-50 text-amber-600 font-black text-[9px]">8% P.A.</Badge>
               </div>
               <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Personal / Vehicle</p>
                 <Badge className="bg-rose-50 text-rose-600 font-black text-[9px]">12% P.A.</Badge>
               </div>
               <Button variant="outline" className="w-full mt-2 h-8 rounded-lg font-black uppercase text-[8px] tracking-widest">Edit Rates</Button>
             </CardContent>
           </Card>

           {/* Borrowing Limits */}
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all">
             <CardHeader className="p-5 pb-2 bg-slate-50/50 flex flex-row items-center gap-3">
               <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                 <IndianRupee className="h-4 w-4 text-slate-900" />
               </div>
               <div>
                 <CardTitle className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Borrowing Limits</CardTitle>
                 <CardDescription className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Maximum cap by employee tier</CardDescription>
               </div>
             </CardHeader>
             <CardContent className="p-5 space-y-3">
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">L1 (Junior Staff)</p>
                 <p className="font-black text-slate-900 text-sm">₹ 1,00,000</p>
               </div>
               <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">L2 (Managers)</p>
                 <p className="font-black text-slate-900 text-sm">₹ 5,00,000</p>
               </div>
               <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">L3 (Directors/VP)</p>
                 <p className="font-black text-slate-900 text-sm">₹ 15,00,000</p>
               </div>
               <Button variant="outline" className="w-full mt-2 h-8 rounded-lg font-black uppercase text-[8px] tracking-widest">Update Limits</Button>
             </CardContent>
           </Card>

           {/* Eligibility Rules */}
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all">
             <CardHeader className="p-5 pb-2 bg-slate-50/50 flex flex-row items-center gap-3">
               <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                 <User className="h-4 w-4 text-slate-900" />
               </div>
               <div>
                 <CardTitle className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Eligibility & Tenure</CardTitle>
                 <CardDescription className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Who can apply and repayment rules</CardDescription>
               </div>
             </CardHeader>
             <CardContent className="p-5 space-y-4">
               <div>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Minimum Service Period</p>
                 <p className="text-xs font-bold text-slate-500">Employee must complete 12 months in the company.</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Active Loan Limit</p>
                 <p className="text-xs font-bold text-slate-500">Only 1 active loan permitted at a time.</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Max Repayment Tenure</p>
                 <p className="text-xs font-bold text-slate-500">36 Months (3 Years) absolute maximum.</p>
               </div>
               <Button variant="outline" className="w-full mt-2 h-8 rounded-lg font-black uppercase text-[8px] tracking-widest">Edit Criteria</Button>
             </CardContent>
           </Card>

           {/* Workflows */}
           <Card className="border-none shadow-sm rounded-2xl bg-[#0f172a] text-white overflow-hidden group hover:shadow-md transition-all">
             <CardHeader className="p-5 pb-2 border-b border-white/10 flex flex-row items-center gap-3">
               <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                 <CheckCircle2 className="h-4 w-4 text-[#D9F99D]" />
               </div>
               <div>
                 <CardTitle className="text-sm font-black uppercase italic tracking-tighter text-[#D9F99D]">Approval Workflows</CardTitle>
                 <CardDescription className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Authorization matrix</CardDescription>
               </div>
             </CardHeader>
             <CardContent className="p-5 space-y-4">
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-300">Under ₹ 1,00,000</p>
                 <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Reporting Manager
                 </p>
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-300">₹ 1,00,000 to ₹ 5,00,000</p>
                 <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> HR Head + Finance Manager
                 </p>
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-300">Above ₹ 5,00,000</p>
                 <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Board of Directors / VP
                 </p>
               </div>
               <Button className="w-full mt-2 h-8 rounded-lg font-black uppercase text-[8px] tracking-widest bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a]">Configure Matrix</Button>
             </CardContent>
           </Card>
        </div>
      )}

      {/* ── Detail Dialog ── */}
      <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
        <DialogContent
          className="rounded-2xl p-0 overflow-hidden border-none shadow-2xl [&>button]:top-5 [&>button]:right-5 [&>button]:z-50 [&>button]:text-white [&>button]:bg-white/10 [&>button]:rounded-full [&>button]:p-1"
          style={{ maxWidth: 640, width: '95vw' }}
        >
          <DialogTitle className="sr-only">Loan Details</DialogTitle>
          {selected && (() => {
            const Icon = statusIcon[selected.status] || CheckCircle2;
            const totalPayable = selected.emi * selected.tenureMonths;
            const progress = selected.status === "Active" || selected.status === "Closed" ? Math.min(100, (selected.totalPaid / totalPayable) * 100) : 0;
            
            return (
              <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#0f172a] p-7 shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>{selected.id}</p>
                      <h3 className="text-lg font-black uppercase italic tracking-tighter mt-1" style={{ color: '#D9F99D' }}>{selected.employee}</h3>
                      <p className="text-[9px] font-bold mt-1" style={{ color: '#cbd5e1' }}>{selected.dept} · {selected.type}</p>
                    </div>
                    <Badge className={cn("border-none font-black text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-1.5", statusStyle[selected.status])}>
                      <Icon className="h-3 w-3" /> {selected.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Principal</p>
                      <p className="text-[14px] font-black mt-1" style={{ color: '#f8fafc' }}>₹ {selected.principal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>EMI</p>
                      <p className="text-[14px] font-black mt-1" style={{ color: '#D9F99D' }}>₹ {selected.emi.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Tenure</p>
                      <p className="text-[14px] font-black mt-1" style={{ color: '#f8fafc' }}>{selected.tenureMonths} mo @ {selected.interestRate}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Progress (if active/closed) */}
                  {(selected.status === "Active" || selected.status === "Closed") && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                      <div className="flex justify-between items-end mb-2">
                         <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recovery Progress</p>
                           <p className="text-sm font-black text-slate-900 mt-0.5">₹ {selected.totalPaid.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">/ ₹ {totalPayable.toLocaleString()}</span></p>
                         </div>
                         <p className="text-xs font-black text-emerald-600">{progress.toFixed(1)}%</p>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Applied On</span>
                        <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-400"/> {selected.appliedOn}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Disbursed On</span>
                        <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-400"/> {selected.disbursedOn || "N/A"}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Next EMI Date</span>
                        <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5"><Clock className="h-3 w-3 text-amber-500"/> {selected.nextEmiDate || "N/A"}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Total Interest Payable</span>
                        <p className="text-[11px] font-bold text-slate-900">₹ {(totalPayable - selected.principal).toLocaleString()}</p>
                     </div>
                  </div>
                  
                  {/* Payment History */}
                  {(selected.payments && selected.payments.length > 0) && (
                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Payment History</h4>
                      <div className="space-y-3">
                        {selected.payments.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                               <p className="text-xs font-black text-slate-900">₹ {p.amount.toLocaleString()} <span className="text-[8px] text-slate-400 uppercase tracking-widest ml-2">via {p.method}</span></p>
                               <p className="text-[9px] font-bold text-slate-500 mt-1">{p.notes}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black text-slate-900">{p.date}</p>
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">By {p.recordedBy}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
                
                {/* Actions */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex gap-2 shrink-0">
                  {selected.status === "Pending" && (
                    <>
                      <Button onClick={() => handleStatusChange("Active")} className="flex-1 bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[9px] tracking-widest h-11 rounded-xl">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approve & Disburse
                      </Button>
                      <Button onClick={() => handleStatusChange("Rejected")} className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-black uppercase text-[9px] tracking-widest h-11 rounded-xl border-none">
                        <XCircle className="h-3.5 w-3.5 mr-2" /> Reject
                      </Button>
                    </>
                  )}
                  {selected.status === "Active" && (
                    <Button onClick={openPaymentDialog} variant="outline" className="flex-1 font-black uppercase text-[9px] tracking-widest h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                      <CreditCard className="h-3.5 w-3.5 mr-2" /> Record Manual EMI
                    </Button>
                  )}
                  <Button variant="outline" className="font-black uppercase text-[9px] tracking-widest h-11 rounded-xl border-slate-100 text-slate-500 hover:bg-slate-50">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ── Add Dialog (Detailed Calculator) ── */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent
          className="rounded-2xl p-0 overflow-hidden border-none shadow-2xl [&>button]:top-5 [&>button]:right-5 [&>button]:z-50 [&>button]:text-white [&>button]:bg-white/10 [&>button]:rounded-full [&>button]:p-1"
          style={{ maxWidth: 850, width: '95vw' }}
        >
          <DialogTitle className="sr-only">Loan Details Calculator</DialogTitle>
          <div className="flex flex-col max-h-[90vh]">
            <div className="bg-[#0f172a] px-7 py-6 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter" style={{ color: '#D9F99D' }}>Loan Details Setup</h3>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-1" style={{ color: '#94a3b8' }}>Configure new loan application</p>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50 space-y-8">
              
              {/* Top Meta */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Employee Name</label>
                     <Input placeholder="e.g. Rahul Mehta" value={form.employee} onChange={e => setForm(prev => ({ ...prev, employee: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs" />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Date of Loan</label>
                     <Input type="date" value={form.dateOfLoan} onChange={e => setForm(prev => ({ ...prev, dateOfLoan: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs" />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Deduct From</label>
                     <Input type="date" value={form.deductFrom} onChange={e => setForm(prev => ({ ...prev, deductFrom: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs" />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Created Date</label>
                     <Input type="date" value={form.createdDate} disabled className="h-9 bg-slate-100 border-none rounded-lg font-bold text-xs text-slate-400" />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Loan Type</label>
                     <select value={form.loanTypeOption} onChange={e => setForm(prev => ({ ...prev, loanTypeOption: e.target.value }))} className="w-full h-9 bg-white border border-slate-200 rounded-lg font-bold text-xs px-3">
                        <option>Reducing Interest EMI</option>
                        <option>Flat Rate EMI</option>
                        <option>Interest Only</option>
                     </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0 text-right">Amount (₹)</label>
                     <Input type="number" value={form.principal} onChange={e => setForm(prev => ({ ...prev, principal: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs" />
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0 text-right">Interest Rate</label>
                     <div className="relative w-full">
                       <Input type="number" value={form.interestRate} onChange={e => setForm(prev => ({ ...prev, interestRate: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs pr-12" />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase">(% p.a)</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0 text-right">No of Installments</label>
                     <div className="relative w-full">
                       <Input type="number" value={form.tenureMonths} onChange={e => setForm(prev => ({ ...prev, tenureMonths: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs pr-20" />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase">(In Months)</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0 text-right">Loan Account No</label>
                     <Input value={form.loanAccountNo} onChange={e => setForm(prev => ({ ...prev, loanAccountNo: e.target.value }))} className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs" />
                  </div>
                </div>
              </div>

              {/* Installment Details */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Installment Details</h4>
                <div className="grid grid-cols-3 gap-6">
                   <div className="flex items-center gap-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32">Monthly Installment</label>
                     <div className="h-9 flex-1 bg-white border border-slate-200 rounded-lg font-bold text-xs flex items-center px-3 text-slate-900">
                       {Math.round(calculatedEmi || 0).toLocaleString()}
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-24">Principal Bal.</label>
                     <div className="h-9 flex-1 bg-white border border-slate-200 rounded-lg font-bold text-xs flex items-center px-3 text-slate-900">
                       {(Number(form.principal) || 0).toLocaleString()}
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-24">Interest Bal.</label>
                     <div className="h-9 flex-1 bg-white border border-slate-200 rounded-lg font-bold text-xs flex items-center px-3 text-slate-900">
                       {Math.round(totalInterest > 0 ? totalInterest : 0).toLocaleString()}
                     </div>
                   </div>
                </div>
              </div>

              {/* Other Information */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Other Information</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-40 flex items-center gap-2">
                         <input type="checkbox" className="accent-slate-900" />
                         Demand Promissory Note
                       </label>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Perquisite Rate</label>
                       <Input type="number" value={form.perquisiteRate} onChange={e => setForm(prev => ({...prev, perquisiteRate: e.target.value}))} className="h-9 w-24 bg-white border-slate-200 rounded-lg font-bold text-xs" />
                     </div>
                     <div className="flex items-center gap-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0">Est. Closing Month</label>
                       <div className="h-9 w-32 bg-emerald-50 border border-emerald-100 rounded-lg font-black text-xs flex items-center px-3 text-emerald-700">
                         {getClosingDate()}
                       </div>
                     </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-4">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-32 shrink-0 mt-2">Remarks</label>
                   <Input 
                     placeholder="e.g. Deduction will start from the salary of March 26" 
                     value={form.remarks} 
                     onChange={e => setForm(prev => ({...prev, remarks: e.target.value}))}
                     className="h-9 bg-white border-slate-200 rounded-lg font-bold text-xs w-full" 
                   />
                </div>
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <Button onClick={() => setShowAdd(false)} variant="outline" className="font-black uppercase text-[10px] tracking-widest h-10 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 px-6">
                Cancel
              </Button>
              <Button onClick={handleApply} disabled={!form.employee || !form.principal} className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[10px] tracking-widest h-10 rounded-lg px-8 shadow-md">
                Save Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Manual Payment Dialog ── */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl p-6 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 italic uppercase underline underline-offset-4 decoration-[#D9F99D]">
              Record Manual Payment
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Amount (₹)</label>
               <Input 
                 type="number"
                 value={paymentForm.amount} 
                 onChange={e => setPaymentForm(prev => ({...prev, amount: e.target.value}))}
                 className="h-10 bg-slate-50 border-none rounded-xl font-bold text-xs focus-visible:ring-1 focus-visible:ring-[#D9F99D]"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Payment Date</label>
               <Input 
                 type="date"
                 value={paymentForm.date} 
                 onChange={e => setPaymentForm(prev => ({...prev, date: e.target.value}))}
                 className="h-10 bg-slate-50 border-none rounded-xl font-bold text-xs focus-visible:ring-1 focus-visible:ring-[#D9F99D]"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Payment Method</label>
               <select 
                 value={paymentForm.method} 
                 onChange={e => setPaymentForm(prev => ({...prev, method: e.target.value}))}
                 className="w-full h-10 bg-slate-50 border-none rounded-xl font-bold text-xs px-3 outline-none focus:ring-1 focus:ring-[#D9F99D]"
               >
                 <option>Bank Transfer</option>
                 <option>Cash</option>
                 <option>Cheque</option>
                 <option>Salary Adjustment</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reason / Notes</label>
               <Input 
                 placeholder="e.g. Employee requested early settlement"
                 value={paymentForm.notes} 
                 onChange={e => setPaymentForm(prev => ({...prev, notes: e.target.value}))}
                 className="h-10 bg-slate-50 border-none rounded-xl font-bold text-xs focus-visible:ring-1 focus-visible:ring-[#D9F99D]"
               />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowPaymentDialog(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Cancel</Button>
            <Button onClick={handleRecordEMI} className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase text-[10px] tracking-widest shadow-md">
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
