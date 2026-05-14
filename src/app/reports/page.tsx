"use client";

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
    Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter underline underline-offset-4 decoration-[#D9F99D] decoration-2">
                        <BarChart3 className="h-6 w-6 text-emerald-500" /> Business Reports
                    </h1>
                    <p className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">Track staff performance and company data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 px-6 rounded-xl border-2 border-slate-50 font-black uppercase text-[9px] tracking-widest text-slate-400 transition-all hover:bg-slate-50">
                        <Calendar className="h-4 w-4 mr-2" /> Select Dates
                    </Button>
                    <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-widest px-8 h-11 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2">
                        <Download className="h-4 w-4 stroke-[3]" /> Download Report
                    </Button>
                </div>
            </div>

            {/* High-level Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Staff Attendance", value: "94.2%", icon: Activity, color: "text-emerald-500", trend: "+2.1% Staff Growth" },
                    { label: "Staff Retention", value: "88%", icon: Users, color: "text-blue-500", trend: "Optimal Range" },
                    { label: "Rules Status", value: "100%", icon: ShieldCheck, color: "text-[#D9F99D]", trend: "Audit Passed" },
                    { label: "Total Salaries", value: "₹4.8M", icon: Briefcase, color: "text-rose-500", trend: "Feb Cycle" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                            <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#D9F99D]/20 transition-colors">
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest italic">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
                    <CardHeader className="p-6 pb-3 border-none flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">Staff Trends</CardTitle>
                            <p className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] italic">Staff attendance over time</p>
                        </div>
                        <Badge className="bg-[#D1FAE5] text-emerald-600 border-none font-black text-[7px] px-3 py-1.5 rounded-lg uppercase tracking-widest">LIVE DATA</Badge>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between p-6 gap-3">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-50 rounded-t-lg relative overflow-hidden h-[220px] flex items-end">
                                    <div 
                                        className="w-full bg-slate-900 group-hover:bg-[#D9F99D] transition-all duration-500 rounded-t-md relative" 
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[7px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">W{i+1}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group h-[220px] flex flex-col justify-between shadow-xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <PieChart className="h-24 w-24" />
                        </div>
                        <div className="space-y-3 relative z-10">
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-[#D9F99D]">Branch Performance</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed italic">Indore branch has 42% of staff.</p>
                        </div>
                        <div className="space-y-1.5 relative z-10">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                <span>Indore Hub</span>
                                <span>42%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#D9F99D] w-[42%]" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-[220px] flex flex-col justify-between">
                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-4 decoration-slate-100">System Errors</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">2 errors found.</p>
                        </div>
                        <Button className="w-full bg-slate-50 text-slate-400 hover:bg-slate-100 font-black uppercase text-[9px] tracking-widest h-11 rounded-xl">Fix Errors</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
