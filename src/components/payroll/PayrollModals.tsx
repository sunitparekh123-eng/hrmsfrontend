import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    TrendingUp, Info, Wallet, ArrowUpRight, ChevronRight, 
    ShieldCheck, CreditCard, UserCircle, CalendarCheck, Clock 
} from "lucide-react";

export function GlobalRulesSheet({
    isOpen, onOpenChange,
    selectedEmployee, setSelectedEmployee,
    globalRules, setGlobalRules,
    handleSalaryUpdate, calculateProductionNet
}: any) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
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
                        <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-xl">Save Configuration</Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function DisbursementDialog({
    isOpen, onOpenChange,
    disbursementStep, setDisbursementStep,
    txDetails, setTxDetails,
    ledger, calculateProductionNet,
    handleDisburseAll
}: any) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
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
                                    <p className="text-xl font-black italic text-white tracking-tighter">₹{ledger.reduce((acc: any, curr: any) => acc + calculateProductionNet(curr).gross, 0).toLocaleString()}</p>
                                </div>
                                <div className="text-right border-l border-white/10 pl-6">
                                    <p className="text-[8px] font-black uppercase text-rose-400 tracking-[0.2em] mb-2">Deductions</p>
                                    <p className="text-xl font-black italic text-rose-500 tracking-tighter">
                                        -₹{ledger.reduce((acc: any, curr: any) => {
                                            const res = calculateProductionNet(curr);
                                            return acc + res.pf + res.pt + res.esi + res.lop;
                                        }, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-[9px] font-black uppercase text-[#D9F99D] tracking-[0.3em] mb-2">Net Funds to Disburse</p>
                                <h4 className="text-4xl font-black italic tracking-tighter">₹{ledger.reduce((acc: any, curr: any) => acc + calculateProductionNet(curr).net, 0).toLocaleString()}</h4>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button 
                                onClick={() => setDisbursementStep(2)} 
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3"
                            >
                                Verify & Finalize <ChevronRight className="h-5 w-5" />
                            </Button>
                            <button onClick={() => onOpenChange(false)} className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-600 transition-colors py-2">
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
    );
}

export function EmployeeHistoryDialog({
    isOpen, onOpenChange,
    selectedEmployee
}: any) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                            <UserCircle className="h-8 w-8 text-[#D9F99D]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">{selectedEmployee?.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedEmployee?.company} • Salary History</p>
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
    );
}

export function PayrollPolicyDialog({
    isOpen, onOpenChange,
    globalRules, setGlobalRules
}: any) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-3xl p-8">
                <DialogHeader className="text-left space-y-2">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-rose-500" />
                    </div>
                    <DialogTitle className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Payroll Policies</DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        Define statutory deduction rules for the entire company.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="operations" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-50 rounded-2xl p-1 mb-8">
                        <TabsTrigger value="operations" className="rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Operations</TabsTrigger>
                        <TabsTrigger value="statutory" className="rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Statutory</TabsTrigger>
                    </TabsList>

                    <TabsContent value="operations" className="space-y-6 mt-0">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-3">No Operational Rules</p>
                            <p className="text-[10px] font-bold text-slate-500 italic">Operational penalties have been disabled globally.</p>
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
                    <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-xl">Save All Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
