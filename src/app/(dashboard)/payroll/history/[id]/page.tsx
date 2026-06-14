"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
    ArrowLeft,
    Download,
    FileText,
    Building2,
    Wallet,
    Banknote,
    TrendingDown,
    Activity,
    Search,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api-client";

export default function CycleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const cycleId = resolvedParams.id;

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [loading, setLoading] = useState(true);
    const [cycleName, setCycleName] = useState("Loading...");
    const [transactions, setTransactions] = useState<any[]>([]);

    const branches = ["All Branches", ...Array.from(new Set(transactions.map((t: any) => t.branch).filter(Boolean)))] as string[];

    useEffect(() => {
        const load = async () => {
            try {
                const data = await apiGet<{ cycle: any; rows: any[] }>(`/payroll/ledger/${cycleId}`);
                const cycle = data.cycle;
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                setCycleName(`${(monthNames[cycle.month_index] || cycle.month)?.substring(0, 3).toUpperCase()}-${cycle.year}`);

                const rows = (data.rows || []).map((r: any) => ({
                    id: r.employeeCode || r.id,
                    name: r.name,
                    role: r.designation || '',
                    branch: r.location || 'Unknown',
                    base: r.proratedGross || 0,
                    bonus: (r.bonus || 0) + (r.incentive || 0) + (r.previousArrears || 0),
                    pf: r.pf || 0,
                    pt: r.pt || 0,
                    net: r.net || 0,
                    status: (r.status === 'Paid' || r.status === 'Verified') ? 'Transferred' : 'Pending',
                }));
                setTransactions(rows);
            } catch (e) {
                console.error("Failed to load cycle details:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [cycleId]);

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(t.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.branch.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBranch = selectedBranch === "All Branches" || t.branch === selectedBranch;
        return matchesSearch && matchesBranch;
    });

    const totalBase = filteredTransactions.reduce((acc, curr) => acc + curr.base, 0);
    const totalBonus = filteredTransactions.reduce((acc, curr) => acc + curr.bonus, 0);
    const totalDeductions = filteredTransactions.reduce((acc, curr) => acc + curr.pf + curr.pt, 0);
    const totalNet = filteredTransactions.reduce((acc, curr) => acc + curr.net, 0);

    return (
        <ProtectedRoute module="PAYROLL" action="READ">
            <div className="space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 px-2 pt-4">
                    <div>
                        <Link href="/payroll/history" className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors mb-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <ArrowLeft className="h-3 w-3" /> Back to Vault
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-4">
                            Cycle Audit <span className="text-indigo-500 underline underline-offset-8 decoration-[#D9F99D] decoration-4">{cycleName}</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">Comprehensive Disbursement Breakdown</p>
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                        <Button
                            variant="ghost"
                            className="h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-500 hover:bg-white hover:shadow-sm transition-all"
                        >
                            <FileText className="h-4 w-4 mr-2" /> View Payslips
                        </Button>
                        <Button
                            className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-[0.3em] px-8 h-11 rounded-xl shadow-md transition-all"
                        >
                            <Download className="h-4 w-4 mr-2" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Macro Financial Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                    <Card className="border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between h-36 bg-slate-900 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Wallet className="h-24 w-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Payout</p>
                            <h4 className="text-3xl font-black italic tracking-tighter uppercase text-white flex items-center gap-1">
                                <span className="text-lg text-slate-500">₹</span>{totalNet.toLocaleString()}
                            </h4>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between h-36 bg-[#E0E7FF] group hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                            <div className="bg-white/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                <Activity className="h-5 w-5 text-indigo-900" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black italic tracking-tighter uppercase text-indigo-900 flex items-center gap-1">
                                <span className="text-sm text-indigo-500/50">₹</span>{totalBase.toLocaleString()}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-widest">Base Salary</p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between h-36 bg-[#D1FAE5] group hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                            <div className="bg-white/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                <Banknote className="h-5 w-5 text-emerald-900" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black italic tracking-tighter uppercase text-emerald-900 flex items-center gap-1">
                                <span className="text-sm text-emerald-500/50">₹</span>{totalBonus.toLocaleString()}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-widest">Total Bonuses</p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm rounded-2xl p-6 flex flex-col justify-between h-36 bg-[#FEE2E2] group hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                            <div className="bg-white/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                                <TrendingDown className="h-5 w-5 text-rose-900" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black italic tracking-tighter uppercase text-rose-900 flex items-center gap-1">
                                <span className="text-sm text-rose-500/50">-₹</span>{totalDeductions.toLocaleString()}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-widest">Statutory Deductions</p>
                        </div>
                    </Card>
                </div>

                {/* Micro Employee Level Table */}
                <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-1 mx-2">
                    <CardHeader className="p-6 pb-4 border-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-black italic text-slate-900 uppercase tracking-tighter">Beneficiary Ledger</CardTitle>
                        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <div className="relative min-w-[200px] group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    placeholder="Search Employee, ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 pl-10 pr-4 rounded-xl bg-white border-none shadow-sm font-bold text-[10px] focus:ring-2 ring-indigo-100"
                                />
                            </div>
                            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                <SelectTrigger className="h-10 w-[140px] rounded-xl bg-white border-none shadow-sm font-black text-[9px] uppercase tracking-widest text-slate-900">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-none shadow-xl rounded-2xl">
                                    {branches.map(b => (
                                        <SelectItem key={b} value={b} className="text-[10px] font-bold uppercase">{b}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-10 px-4 rounded-xl border-none bg-white shadow-sm font-black uppercase text-[9px] tracking-widest text-slate-900 hover:bg-slate-100 transition-colors">
                                <Filter className="h-3.5 w-3.5 mr-2" /> Filter
                            </Button>
                        </div>
                    </CardHeader>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-none bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="pl-8 h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Employee Information</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Base Salary</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Additions</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Deductions (PF/PT)</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400">Net Amount</TableHead>
                                <TableHead className="h-16 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((t) => (
                                <TableRow key={t.id} className="group border-b border-dashed border-slate-100 hover:bg-slate-50/30 transition-all h-auto last:border-none">
                                    <TableCell className="pl-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 italic tracking-tight uppercase group-hover:translate-x-1 transition-transform">{t.name}</span>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[7px] h-4 px-1.5 rounded uppercase tracking-widest">{t.id}</Badge>
                                                <div className="flex items-center gap-1 text-[8px] font-bold text-indigo-500 uppercase tracking-widest">
                                                    <Building2 className="h-3 w-3" />
                                                    {t.branch}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-5 text-slate-600 font-bold text-xs">
                                        ₹{t.base.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="py-5">
                                        {t.bonus > 0 ? (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest px-2 h-5 rounded-md shadow-sm">
                                                + ₹{t.bonus.toLocaleString()}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-300 text-xs font-black">-</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="py-5">
                                        {t.pf + t.pt > 0 ? (
                                            <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none font-black text-[8px] uppercase tracking-widest px-2 h-5 rounded-md shadow-sm">
                                                - ₹{(t.pf + t.pt).toLocaleString()}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-300 text-xs font-black">-</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="py-5">
                                        <span className="text-base font-black text-slate-900 italic tracking-tighter">
                                            ₹{t.net.toLocaleString()}
                                        </span>
                                    </TableCell>

                                    <TableCell className="pr-8 py-5 text-right">
                                        <Badge className={cn(
                                            "border-none font-black text-[8px] h-6 px-3 rounded-lg uppercase tracking-widest shadow-sm",
                                            t.status === 'Transferred' ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {t.status}
                                        </Badge>
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
