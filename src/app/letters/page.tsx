"use client";

import { useState } from "react";
import { 
    FileType, 
    FileText, 
    Download, 
    Eye, 
    Edit3, 
    Plus, 
    CheckCircle2, 
    Search,
    Clock,
    FileSignature,
    ArrowUpRight,
    Send,
    Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";

const templates = [
    { id: "TMP001", name: "Offer Letter", category: "Onboarding", status: "Active", lastUpdated: "Feb 12, 2026", type: "PDF/DOCX" },
    { id: "TMP002", name: "Appointment Letter", category: "Onboarding", status: "Active", lastUpdated: "Jan 05, 2026", type: "PDF" },
    { id: "TMP003", name: "Warning Letter", category: "Disciplinary", status: "Active", lastUpdated: "Dec 12, 2025", type: "PDF" },
    { id: "TMP004", name: "Non-performance Letter", category: "Disciplinary", status: "Active", lastUpdated: "Feb 14, 2026", type: "PDF/DOCX" },
    { id: "TMP005", name: "Absenteeism Letter", category: "Disciplinary", status: "Active", lastUpdated: "Feb 15, 2026", type: "PDF" },
];

export default function LettersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter underline underline-offset-4 decoration-[#D9F99D] decoration-2">
                        <FileType className="h-6 w-6 text-rose-500" /> Letters & Docs
                    </h1>
                    <p className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">Create and manage official letters and documents.</p>
                </div>
                <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-widest px-8 h-11 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2">
                    <Plus className="h-4 w-4 stroke-[3]" /> Create Template
                </Button>
            </div>

            {/* Template Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                    { label: "Active Templates", value: "12 Templates", icon: FileSignature, bg: "bg-white" },
                    { label: "Total Documents", value: "2,401 Docs", icon: FileText, bg: "bg-white" },
                    { label: "Compliance Status", value: "100% Compliant", icon: CheckCircle2, bg: "bg-[#D9F99D]" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} border-none rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-md transition-all`}>
                        <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#D9F99D]/20 transition-colors">
                            <stat.icon className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Template Grid */}
            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
                <CardHeader className="p-6 pb-3 border-none">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <CardTitle className="text-lg font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">Template List</CardTitle>
                            <CardDescription className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] italic">All official document templates</CardDescription>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                            <Input 
                                placeholder="Search templates..." 
                                className="h-10 w-64 pl-12 bg-slate-50 border-none rounded-xl font-bold text-[10px] focus-visible:ring-1 focus-visible:ring-[#D9F99D] shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((template) => (
                            <Card key={template.id} className="border-2 border-slate-50 rounded-2xl p-5 hover:border-[#D9F99D] hover:bg-slate-50/50 transition-all group relative overflow-hidden">
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="space-y-3">
                                        <Badge className={cn(
                                            "border-none font-black text-[7px] uppercase tracking-widest px-2.5 h-4.5 rounded-md",
                                            template.status === 'Active' ? 'bg-[#D1FAE5] text-emerald-600' : 'bg-[#FEF3C7] text-amber-600'
                                        )}>
                                            {template.status}
                                        </Badge>
                                        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform">{template.name}</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="space-y-0.5">
                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase">{template.category}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">ID</p>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase">{template.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-white border-2 border-slate-50 hover:bg-[#D9F99D] hover:border-[#D9F99D] transition-all" onClick={() => setSelectedTemplate(template)}>
                                            <Eye className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-white border-2 border-slate-50 hover:bg-slate-900 hover:border-slate-900 transition-all">
                                            <Edit3 className="h-4 w-4 text-slate-400 group-hover:text-white" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                                    <FileText className="h-24 w-24" />
                                </div>
                                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-3 relative z-10">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic flex items-center gap-2">
                                        <Clock className="h-2.5 w-2.5" /> Last Updated: {template.lastUpdated}
                                    </p>
                                    <Button onClick={() => setSelectedTemplate(template)} variant="link" className="text-rose-500 font-black uppercase text-[8px] tracking-widest p-0 h-auto">Generate <ArrowUpRight className="h-2.5 w-2.5 ml-1" /></Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Preview Dialog (Mock) */}
            <Dialog open={!!selectedTemplate} onOpenChange={(val) => !val && setSelectedTemplate(null)}>
                <DialogContent className="max-w-6xl sm:max-w-6xl w-[95vw] h-[90vh] rounded-2xl p-0 overflow-hidden border-none shadow-2xl [&>button]:text-white [&>button]:top-6 [&>button]:right-6 [&>button]:z-50 [&>button]:bg-white/10 [&>button]:rounded-full [&>button]:p-1">
                    <div className="flex h-full w-full">
                        <div className="flex-1 bg-slate-50 p-4 sm:p-8 overflow-auto custom-scrollbar relative">
                            <div className="bg-white p-8 sm:p-12 shadow-2xl rounded-sm w-[794px] min-h-[1123px] shrink-0 font-serif text-slate-800 flex flex-col relative mx-auto">
                                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">TRIPTAY LOGISTICS</h2>
                                        <p className="text-[8px] font-bold uppercase tracking-widest mt-1.5">Office: Indore Hub</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold uppercase">Ref: TL/OFF/2026/102</p>
                                        <p className="text-[10px] font-bold uppercase mt-0.5">Date: Feb 15, 2026</p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 mt-10">
                                    {selectedTemplate?.id === 'TMP001' && (
                                        <div className="space-y-4">
                                            <p className="font-bold text-base text-center underline underline-offset-4 mb-8">JOB OFFER LETTER</p>
                                            <p className="text-xs leading-relaxed">
                                                Dear <strong>[Employee_Name]</strong>,<br /><br />
                                                We are thrilled to offer you the position of <strong>[Job_Title]</strong> at Triptay Logistics. We believe that your skills and experience will be an excellent match for our company.
                                                <br /><br />
                                                As discussed, your starting date will be <strong>[Date]</strong>. Please find the details of your compensation package below.
                                            </p>
                                            <div className="bg-slate-50 p-6 rounded-xl space-y-3 mt-6">
                                                <p className="text-[8px] font-black uppercase tracking-widest border-b border-slate-200 pb-1.5">Compensation Overview</p>
                                                <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                                                    <span>Basic Salary:</span> <span className="text-right">₹ 24,000 / mo</span>
                                                    <span>HRA (Rent):</span> <span className="text-right">₹ 12,000 / mo</span>
                                                    <span>Special Allowance:</span> <span className="text-right">₹ 4,000 / mo</span>
                                                    <span className="text-emerald-600 pt-2 border-t border-slate-200">Total Gross:</span> 
                                                    <span className="text-emerald-600 text-right pt-2 border-t border-slate-200">₹ 40,000 / mo</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTemplate?.id === 'TMP002' && (
                                        <div className="space-y-4">
                                            <p className="font-bold text-base text-center underline underline-offset-4 mb-8">APPOINTMENT LETTER</p>
                                            <p className="text-xs leading-relaxed">
                                                Dear <strong>[Employee_Name]</strong>,<br /><br />
                                                Further to your acceptance of our offer, we are pleased to appoint you as <strong>[Job_Title]</strong> at Triptay Logistics, effective from <strong>[Date]</strong>.
                                                <br /><br />
                                                You will be on probation for a period of 6 months. Your employment will be governed by the standard policies and guidelines of the organization, which may be amended from time to time.
                                                <br /><br />
                                                We welcome you to the team and wish you a long and successful career with us.
                                            </p>
                                        </div>
                                    )}

                                    {selectedTemplate?.id === 'TMP003' && (
                                        <div className="space-y-4">
                                            <p className="font-bold text-base text-center underline underline-offset-4 mb-8 text-rose-600">WARNING LETTER</p>
                                            <p className="text-xs leading-relaxed">
                                                Dear <strong>[Employee_Name]</strong>,<br /><br />
                                                This letter serves as an official warning regarding your recent conduct on <strong>[Date]</strong>. 
                                                It has been brought to our attention that you have violated company policy regarding standard operational procedures.
                                                <br /><br />
                                                At Triptay Logistics, we maintain strict adherence to our professional guidelines. We expect immediate improvement in this matter. 
                                                Failure to rectify this behavior may result in further disciplinary action, up to and including termination of employment.
                                                <br /><br />
                                                A copy of this letter will be placed in your official personnel file.
                                            </p>
                                        </div>
                                    )}

                                    {selectedTemplate?.id === 'TMP004' && (
                                        <div className="space-y-4">
                                            <p className="font-bold text-base text-center underline underline-offset-4 mb-8 text-amber-600">NOTICE OF NON-PERFORMANCE</p>
                                            <p className="text-xs leading-relaxed">
                                                Dear <strong>[Employee_Name]</strong>,<br /><br />
                                                The purpose of this letter is to formally notify you that your performance as a <strong>[Job_Title]</strong> has fallen below the acceptable standards of Triptay Logistics.
                                                <br /><br />
                                                During the recent review cycle ending on <strong>[Date]</strong>, your key performance indicators were significantly below target. 
                                                You are being placed on a 30-day Performance Improvement Plan (PIP). Your manager will schedule a meeting to define strict deliverables.
                                                <br /><br />
                                                If immediate and sustained improvement is not observed within this period, the company will be forced to take further action.
                                            </p>
                                        </div>
                                    )}

                                    {selectedTemplate?.id === 'TMP005' && (
                                        <div className="space-y-4">
                                            <p className="font-bold text-base text-center underline underline-offset-4 mb-8 text-rose-600">NOTICE CONCERNING ABSENTEEISM</p>
                                            <p className="text-xs leading-relaxed">
                                                Dear <strong>[Employee_Name]</strong>,<br /><br />
                                                This letter is to formally address your unauthorized absences from work. Our records indicate that you have been absent without prior approval or valid notification on multiple occasions, most recently on <strong>[Date]</strong>.
                                                <br /><br />
                                                Unplanned absenteeism severely disrupts our operational workflows at Triptay Logistics. You are hereby required to provide a valid explanation for your absences within 48 hours of receiving this notice.
                                                <br /><br />
                                                Please be advised that continued unauthorized absence will be considered as absconding from duty, leading to immediate termination of your employment contract.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-12 flex justify-between">
                                    <div className="space-y-1.5 text-center">
                                        <div className="h-0.5 bg-slate-900 w-32 mx-auto" />
                                        <p className="text-[8px] font-black uppercase">Authorized Signatory</p>
                                    </div>
                                    <div className="space-y-1.5 text-center opacity-20">
                                        <div className="h-0.5 bg-slate-900 w-32 mx-auto" />
                                        <p className="text-[8px] font-black uppercase">Employee Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-80 bg-slate-900 p-8 flex flex-col justify-between text-white border-l border-white/5 overflow-y-auto">
                            <div className="space-y-6">
                                <h3 className="text-lg font-black uppercase italic tracking-tighter text-[#D9F99D] pr-8">Settings</h3>
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Select Employee</p>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-[10px] font-bold outline-none text-slate-300">
                                            <option>Search...</option>
                                            <option>Arjun Singh</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 border-t border-white/10 pt-4">
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Dynamic Fields</p>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                                            <div className="flex justify-between items-center text-[9px] font-bold">
                                                <span className="text-slate-400">[Employee_Name]</span>
                                                <span className="text-[#D9F99D] uppercase">Auto</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[9px] font-bold">
                                                <span className="text-slate-400">[Job_Title]</span>
                                                <span className="text-[#D9F99D] uppercase">Auto</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[9px] font-bold">
                                                <span className="text-slate-400">[Date]</span>
                                                <span className="text-[#D9F99D] uppercase">Auto</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 border-t border-white/10 pt-4">
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Format</p>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <Button className="bg-[#D9F99D] text-slate-900 font-black text-[8px] h-9 rounded-lg">PDF</Button>
                                            <Button className="bg-white/5 text-white border border-white/10 font-black text-[8px] h-9 rounded-lg hover:bg-white/10">DOCX</Button>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-[#D9F99D] focus:ring-[#D9F99D] h-3 w-3" />
                                            <span className="text-[9px] font-bold uppercase text-slate-300 group-hover:text-white transition-colors">Enable Email Auto-Send</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 pt-6 mt-auto border-t border-white/10">
                                <Button className="w-full bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[9px] tracking-widest h-11 rounded-xl shadow-xl">
                                    <Mail className="h-3.5 w-3.5 mr-2" /> Email & Download
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white font-black uppercase text-[9px] tracking-widest h-11 rounded-xl">
                                    <Download className="h-3.5 w-3.5 mr-2" /> Download Only
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
