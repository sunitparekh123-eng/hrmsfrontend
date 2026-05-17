"use client";

import { useRole, ModuleName } from "@/context/RoleContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Smartphone,
    MapPin,
    Calendar,
    ShieldCheck,
    Briefcase,
    Banknote,
    FileText,
    ArrowLeft,
    Edit3,
    TrendingUp,
    Clock,
    Award,
    Download,
    ExternalLink,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function EmployeeProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { hasPermission } = useRole();
    const [employee, setEmployee] = useState<any>(null);

    useEffect(() => {
        // Find employee from localStorage
        const allEmployees = JSON.parse(localStorage.getItem('hrms_employees') || '[]');
        // If not found in dynamic storage, check static defaults (mock data)
        const mockDefaults = [
            { id: "EMP001", name: "Walt Whitman", email: "walt@hrms.io", phone: "+91 98765 43210", dob: "1990-05-31", doj: "2022-01-15", aadhaar: "1234 5678 9012", pan: "ABCDE1234F", location: "Indore", role: "ADMIN", jobTitle: "HR Manager", dept: "Human Resources", bankName: "HDFC Bank", accountNo: "501002345678", ifsc: "HDFC0001234", pfNo: "PF/IND/001", uan: "100123456789", status: "Active", color: "blue", fixedGross: 35000, pfApplicable: true, pfCeiling: true, esicApplicable: false, paymentMode: "Bank Transfer" },
            { id: "EMP002", name: "Emily Dickinson", email: "emily@hrms.io", phone: "+91 98765 43211", dob: "1992-12-10", doj: "2023-03-01", location: "Bhopal", jobTitle: "Senior Developer", dept: "Engineering", status: "On Leave", color: "amber", fixedGross: 25000, pfApplicable: true, pfCeiling: false, esicApplicable: true, paymentMode: "Bank Transfer" },
        ];
        
        const found = allEmployees.find((e: any) => e.id === params.id) || mockDefaults.find(e => e.id === params.id);
        setEmployee(found);
    }, [params.id]);

    if (!employee) return (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <Activity className="h-12 w-12 text-slate-100 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Searching Node Database...</p>
        </div>
    );

    return (
        <ProtectedRoute module="EMPLOYEES" action="READ">
            <div className="space-y-10 pb-20 max-w-6xl mx-auto px-4 md:px-0">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="h-10 rounded-xl gap-2 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[9px]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Fleet
                    </Button>
                    <div className="flex items-center gap-3">
                        {hasPermission('EMPLOYEES', 'UPDATE') && (
                            <Button className="bg-slate-900 text-white hover:bg-black font-black text-[9px] uppercase tracking-widest px-8 h-10 rounded-xl shadow-xl transition-all flex items-center gap-2">
                                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                            </Button>
                        )}
                        <Button variant="outline" className="h-10 rounded-xl border-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest px-6">
                            <Download className="h-3.5 w-3.5 mr-2" /> ID Card
                        </Button>
                    </div>
                </div>

                {/* Profile Header Card */}
                <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden">
                    <div className="h-32 bg-slate-900 w-full relative">
                        <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                            <div className={cn(
                                "h-full w-full rounded-[2rem] flex items-center justify-center text-3xl font-black italic uppercase",
                                employee.color === 'blue' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
                            )}>
                                {employee.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-20 pb-12 px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">{employee.name}</h1>
                                    <Badge className={cn(
                                        "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-lg border-none",
                                        employee.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {employee.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Briefcase className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{employee.jobTitle || "Protocol Member"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{employee.location} Node</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Joined {employee.doj}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center px-6 py-4 bg-slate-50 rounded-2xl border border-white">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                                    <p className="text-xl font-black italic text-slate-900">94.2%</p>
                                </div>
                                <div className="text-center px-6 py-4 bg-slate-50 rounded-2xl border border-white">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Leave Balance</p>
                                    <p className="text-xl font-black italic text-slate-900">12 Days</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Information Grid */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8">
                                <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                                    <User className="h-4 w-4 text-indigo-500" /> Employee Profile
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-xs font-black text-slate-900">{employee.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-xs font-black text-slate-900">{employee.phone || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Number</p>
                                    <p className="text-xs font-black text-slate-900">{employee.aadhaar || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PAN Number</p>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{employee.pan || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{employee.dept || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Role</p>
                                    <Badge className="bg-slate-900 text-[#D9F99D] font-black text-[8px] uppercase tracking-widest h-6 px-3">
                                        {employee.role || "EMPLOYEE"}
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Financial Details */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8">
                                <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                                    <Banknote className="h-4 w-4 text-emerald-500" /> Bank & PF Details
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bank Name</p>
                                    <p className="text-xs font-black text-slate-900 italic uppercase">{employee.bankName || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Account Number</p>
                                    <p className="text-xs font-black text-slate-900 tracking-widest">{employee.accountNo || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">IFSC Code</p>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{employee.ifsc || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">UAN ID</p>
                                    <p className="text-xs font-black text-slate-900 tracking-widest">{employee.uan || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PF Number</p>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{employee.pfNo || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LIC Policy</p>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{employee.licDetails || "None Configured"}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Compensation & Payouts */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                                    <Banknote className="h-4 w-4 text-emerald-500" /> Salary & Compliance Setup
                                </CardTitle>
                                <Badge className="bg-emerald-50 text-emerald-600 font-black text-[8px] uppercase tracking-widest h-6 px-3 border-none">Synced with Payroll</Badge>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-white">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed CTC (Gross)</p>
                                    <p className="text-xl font-black italic text-slate-900">₹{employee.fixedGross?.toLocaleString() || "35,000"} <span className="text-[9px] font-bold text-slate-400 not-italic">/mo</span></p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-white">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Mode</p>
                                    <p className="text-xl font-black italic text-slate-900">{employee.paymentMode || "Bank Transfer"}</p>
                                </div>
                                <div className="bg-indigo-50 rounded-2xl p-6 border border-white">
                                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Compliance Status</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge className={cn("border-none font-black text-[7px] uppercase tracking-widest px-2", employee.pfApplicable ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500")}>
                                            PF {employee.pfApplicable ? (employee.pfCeiling ? "(Ceiling)" : "(Full)") : "(No)"}
                                        </Badge>
                                        <Badge className={cn("border-none font-black text-[7px] uppercase tracking-widest px-2", employee.esicApplicable ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")}>
                                            ESIC {employee.esicApplicable ? "(Yes)" : "(No)"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Salary Breakdown Engine</p>
                                <div className="space-y-2">
                                    {[
                                        { component: "Basic Salary", amount: (employee.fixedGross || 35000) * 0.40, type: "Earning" },
                                        { component: "HRA (House Rent)", amount: ((employee.fixedGross || 35000) * 0.40) * 0.40, type: "Earning" },
                                        { component: "Other Allowances", amount: (employee.fixedGross || 35000) - ((employee.fixedGross || 35000) * 0.40) - (((employee.fixedGross || 35000) * 0.40) * 0.40), type: "Earning" },
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black italic uppercase text-slate-900 tracking-tighter">{p.component}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="block text-[9px] font-black uppercase text-slate-400">Fixed Amount</span>
                                                    <span className="text-sm font-black italic text-slate-900">₹{p.amount.toLocaleString()}</span>
                                                </div>
                                                <Badge className="bg-emerald-50 text-emerald-600 font-black text-[7px] uppercase tracking-widest h-5 px-2 border-none">
                                                    {p.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Performance & Appraisals */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-10">
                            <CardHeader className="px-0 pt-0 pb-8 border-b border-slate-50 mb-8">
                                <CardTitle className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                                    <TrendingUp className="h-4 w-4 text-indigo-500" /> Performance & Appraisals
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Rating (2025-26)</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center text-amber-400">
                                                <Award className="h-5 w-5 fill-current" />
                                                <Award className="h-5 w-5 fill-current" />
                                                <Award className="h-5 w-5 fill-current" />
                                                <Award className="h-5 w-5 fill-current" />
                                                <Award className="h-5 w-5 text-slate-200" />
                                            </div>
                                            <span className="text-lg font-black italic text-slate-900 ml-2">4.2<span className="text-[10px] text-slate-400 not-italic">/5.0</span></span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Appraisal Date</p>
                                        <p className="text-xs font-black text-slate-900 tracking-widest">15 Jan 2026</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Next Review Cycle</p>
                                        <p className="text-xs font-black text-slate-900 tracking-widest">Jan 2027</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-white space-y-4">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Manager Remarks</p>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                                        "Exceptional performance in Q3 and Q4. Delivered the core module 2 weeks ahead of schedule. Needs to focus slightly more on peer mentoring. Promoted to Senior Role."
                                    </p>
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                        <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-black text-slate-600">JS</div>
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Reviewed by John Smith</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Documentation & Timeline */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Documentation Hub */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
                            <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-50 mb-6">
                                <CardTitle className="text-sm font-black uppercase tracking-widest italic">Documents</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                {['Aadhar Card', 'PAN Card', 'Bank Proof', 'Joining Form'].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-white hover:bg-white hover:border-slate-100 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <FileText className="h-4 w-4 text-slate-300 group-hover:text-slate-900" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{doc}</span>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-200 group-hover:text-slate-900" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Lifecycle Activity */}
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-8">
                            <CardHeader className="px-0 pt-0 pb-6 border-b border-slate-50 mb-6">
                                <CardTitle className="text-sm font-black uppercase tracking-widest italic">Activity Log</CardTitle>
                            </CardHeader>
                            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 h-6 w-6 rounded-lg bg-[#D9F99D] flex items-center justify-center shadow-sm">
                                        <Award className="h-3.5 w-3.5 text-slate-900" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase">Employee Added</p>
                                    <p className="text-[8px] font-bold text-slate-400 mt-1">{employee.doj}</p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center shadow-sm">
                                        <Activity className="h-3.5 w-3.5 text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase">Status Update</p>
                                    <p className="text-[8px] font-bold text-slate-400 mt-1">Status changed to {employee.status}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
