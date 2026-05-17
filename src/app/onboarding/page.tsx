"use client";

import { useState } from "react";
import {
    UserPlus,
    ChevronRight,
    ArrowLeft,
    Upload,
    CheckCircle,
    FileText,
    ShieldCheck,
    Briefcase,
    Mail,
    Smartphone,
    MapPin,
    Star,
    Banknote,
    Fingerprint,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const steps = ["Personal Info", "Job Details", "Salary & Bank", "Documentation", "Review"];

export default function OnboardingPage() {
    const { availableRoles } = useRole();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        doj: "",
        aadhaar: "",
        pan: "",
        location: "Indore",
        role: "EMPLOYEE",
        dept: "",
        jobTitle: "",
        bankName: "",
        accountNo: "",
        ifsc: "",
        pfNo: "",
        uan: "",
        licDetails: "",
        fixedGross: "",
        company: "BP Marketing",
        paymentMode: "Bank Transfer",
        pfApplicable: "Yes",
        pfCeiling: "Yes",
        esicApplicable: "Yes"
    });

    const updateField = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFinish = () => {
        // Save to localStorage for demo persistence
        const existing = JSON.parse(localStorage.getItem('hrms_employees') || '[]');
        const newEmployee = {
            ...formData,
            id: `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            status: "Active",
            color: "emerald"
        };
        localStorage.setItem('hrms_employees', JSON.stringify([...existing, newEmployee]));
        router.push('/employees');
    };

    return (
        <ProtectedRoute module="EMPLOYEES" action="CREATE">
            <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4 md:px-0">
                {/* Header section with icon */}
                <div className="flex flex-col items-center text-center space-y-3 pt-6">
                    <div className="h-14 w-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-xl">
                        <UserPlus className="h-7 w-7 text-[#D9F99D]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-8 decoration-[#D9F99D] decoration-2">Add New Employee</h1>
                        <p className="text-[9px] font-black text-slate-400 mt-6 uppercase tracking-[0.3em]">Fill in the details to add a new person to the team.</p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="relative flex justify-between items-center px-6 md:px-12">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 z-0" />
                    {steps.map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={cn(
                                "h-10 w-10 md:h-11 md:w-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border-4",
                                currentStep >= i ? "bg-slate-900 border-white text-[#D9F99D] shadow-lg" : "bg-white border-slate-50 text-slate-200"
                            )}>
                                {currentStep > i ? <CheckCircle className="h-5 w-5" /> : i + 1}
                            </div>
                            <span className={cn(
                                "text-[7px] md:text-[8px] font-black uppercase tracking-widest hidden md:block",
                                currentStep >= i ? "text-slate-900" : "text-slate-300"
                            )}>{step}</span>
                        </div>
                    ))}
                </div>

                {/* Main Form Content */}
                <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-6 md:p-12">
                    <CardHeader className="px-0 pt-0 pb-10 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">{steps[currentStep]}</CardTitle>
                                <CardDescription className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</CardDescription>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-slate-200" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-0 py-10 min-h-[400px]">
                        {currentStep === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Full Name</Label>
                                    <Input placeholder="e.g. Walt Whitman" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.name} onChange={e => updateField('name', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Email Address</Label>
                                    <Input placeholder="walt@hrms.io" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs lowercase" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Date of Birth</Label>
                                    <Input type="date" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs" value={formData.dob} onChange={e => updateField('dob', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Date of Joining</Label>
                                    <Input type="date" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs" value={formData.doj} onChange={e => updateField('doj', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Aadhaar Number</Label>
                                    <Input placeholder="0000 0000 0000" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs tracking-widest" value={formData.aadhaar} onChange={e => updateField('aadhaar', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">PAN Number</Label>
                                    <Input placeholder="ABCDE1234F" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.pan} onChange={e => updateField('pan', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Entity</Label>
                                    <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none" value={formData.company} onChange={e => updateField('company', e.target.value)}>
                                        <option value="BP Marketing">BP Marketing</option>
                                        <option value="Apaar Logistics">Apaar Logistics</option>
                                        <option value="AE">AE</option>
                                        <option value="PJ">PJ</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Location</Label>
                                    <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none" value={formData.location} onChange={e => updateField('location', e.target.value)}>
                                        <option value="Indore">Indore</option>
                                        <option value="Bhopal">Bhopal</option>
                                        <option value="Satna">Satna</option>
                                        <option value="Ratlam">Ratlam</option>
                                        <option value="Aagra">Aagra</option>
                                        <option value="Bilaspur">Bilaspur</option>
                                        <option value="Reengus">Reengus</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</Label>
                                    <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none" value={formData.role} onChange={e => updateField('role', e.target.value)}>
                                        {availableRoles.map(r => (
                                            <option key={r.name} value={r.name}>{r.name.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</Label>
                                    <Input placeholder="e.g. Senior Manager" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</Label>
                                    <Input placeholder="e.g. Operations" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.dept} onChange={e => updateField('dept', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</Label>
                                    <Input placeholder="+91 00000 00000" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Monthly Fixed Gross (CTC)</Label>
                                    <Input type="number" placeholder="e.g. 85000" className="h-12 bg-emerald-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest text-emerald-900" value={formData.fixedGross} onChange={e => updateField('fixedGross', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Name</Label>
                                    <Input placeholder="e.g. HDFC Bank" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.bankName} onChange={e => updateField('bankName', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Number</Label>
                                    <Input placeholder="0000 0000 0000" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs tracking-widest" value={formData.accountNo} onChange={e => updateField('accountNo', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IFSC Code</Label>
                                    <Input placeholder="HDFC0001234" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.ifsc} onChange={e => updateField('ifsc', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Mode</Label>
                                    <select className="w-full h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none" value={formData.paymentMode} onChange={e => updateField('paymentMode', e.target.value)}>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="Cash">Cash</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">PF Applicable</Label>
                                    <select className="w-full h-12 bg-indigo-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none text-indigo-900" value={formData.pfApplicable} onChange={e => updateField('pfApplicable', e.target.value)}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">PF Ceiling Limit</Label>
                                    <select className="w-full h-12 bg-indigo-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none text-indigo-900" value={formData.pfCeiling} onChange={e => updateField('pfCeiling', e.target.value)}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">ESIC Applicable</Label>
                                    <select className="w-full h-12 bg-blue-50 border-none rounded-xl px-5 font-black text-[10px] uppercase tracking-widest outline-none text-blue-900" value={formData.esicApplicable} onChange={e => updateField('esicApplicable', e.target.value)}>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PF Number</Label>
                                    <Input placeholder="PF/IND/001" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.pfNo} onChange={e => updateField('pfNo', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UAN ID</Label>
                                    <Input placeholder="1000 0000 0000" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs tracking-widest" value={formData.uan} onChange={e => updateField('uan', e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIC Policy</Label>
                                    <Input placeholder="e.g. Policy No: 12345" className="h-12 bg-slate-50 border-none rounded-xl px-5 font-black text-xs uppercase tracking-widest" value={formData.licDetails} onChange={e => updateField('licDetails', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-16 text-center space-y-6 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200 transition-all group flex flex-col items-center">
                                    <div className="h-16 w-16 bg-white rounded-[1.2rem] shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-slate-900 italic uppercase">Upload Documents</h3>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Aadhar • PAN • Bank Proof • Photos</p>
                                    </div>
                                    <Button className="bg-slate-900 text-white font-black hover:bg-black px-12 h-12 rounded-xl shadow-xl uppercase text-[10px] tracking-widest">Select Files</Button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {['Aadhar', 'PAN', 'Passbook', 'Photo'].map((doc, i) => (
                                        <div key={i} className="flex flex-col items-center gap-4 p-6 bg-white border-2 border-slate-50 rounded-2xl group hover:border-slate-900 shadow-sm transition-all text-center">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                                                <FileText className="h-5 w-5 text-slate-200 group-hover:text-[#D9F99D]" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">{doc}</span>
                                            <Badge className="bg-slate-50 text-slate-300 border-none font-black text-[7px] h-5 tracking-widest px-3">PENDING</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="flex flex-col items-center justify-center space-y-10 text-center py-10 animate-in fade-in zoom-in-95">
                                <div className="h-20 w-20 bg-[#D9F99D] rounded-[2rem] flex items-center justify-center shadow-xl shadow-[#D9F99D]/20 animate-bounce">
                                    <CheckCircle className="h-10 w-10 text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Review & Finish</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check everything before adding the employee.</p>
                                </div>
                                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                    <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white pb-3">Personal Details</p>
                                        <div className="space-y-4">
                                            <div><p className="text-[7px] font-black text-slate-400 uppercase">Full Name</p><p className="text-sm font-black italic uppercase text-slate-900">{formData.name || "N/A"}</p></div>
                                            <div><p className="text-[7px] font-black text-slate-400 uppercase">Aadhaar Number</p><p className="text-sm font-black text-slate-900">{formData.aadhaar || "N/A"}</p></div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white pb-3">Job Details</p>
                                        <div className="space-y-4">
                                            <div><p className="text-[7px] font-black text-slate-400 uppercase">Company Entity</p><p className="text-sm font-black italic uppercase text-slate-900">{formData.company}</p></div>
                                            <div><p className="text-[7px] font-black text-slate-400 uppercase">Office Location</p><p className="text-sm font-black italic uppercase text-slate-900">{formData.location}</p></div>
                                            <div><p className="text-[7px] font-black text-slate-400 uppercase">Role</p><p className="text-sm font-black text-slate-900 uppercase tracking-widest">{formData.role}</p></div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6 md:col-span-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-white pb-3">Compensation & Compliance</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div><p className="text-[7px] font-black text-emerald-500 uppercase">Monthly Fixed CTC</p><p className="text-sm font-black text-emerald-600 uppercase tracking-widest">₹{formData.fixedGross ? Number(formData.fixedGross).toLocaleString('en-IN') : "0"}</p></div>
                                            <div><p className="text-[7px] font-black text-slate-400 uppercase">Payment Mode</p><p className="text-sm font-black text-slate-900 uppercase tracking-widest">{formData.paymentMode}</p></div>
                                            <div><p className="text-[7px] font-black text-indigo-400 uppercase">PF Applicable</p><p className="text-sm font-black text-indigo-600 uppercase tracking-widest">{formData.pfApplicable}</p></div>
                                            <div><p className="text-[7px] font-black text-blue-400 uppercase">ESIC Applicable</p><p className="text-sm font-black text-blue-600 uppercase tracking-widest">{formData.esicApplicable}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="px-0 pb-0 pt-10 border-t border-slate-50 flex justify-between items-center bg-transparent">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="h-12 px-8 rounded-xl gap-3 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[9px] transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" /> Go Back
                        </Button>
                        <Button
                            onClick={() => {
                                if (currentStep === steps.length - 1) {
                                    handleFinish();
                                } else {
                                    setCurrentStep(currentStep + 1);
                                }
                            }}
                            className="h-12 px-12 rounded-xl bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center gap-3"
                        >
                            {currentStep === steps.length - 1 ? "Add Employee" : "Next Step"} <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
