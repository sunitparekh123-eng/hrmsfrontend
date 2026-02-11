"use client";

import { useState } from "react";
import {
    TrendingUp,
    Target,
    Star,
    Award,
    Zap,
    MoreHorizontal,
    ArrowUpRight,
    MessageCircle,
    CheckCircle2,
    Flag,
    PieChart,
    Rocket,
    Check,
    RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function PerformancePage() {
    const [objectives, setObjectives] = useState([
        { id: 1, title: "Lead HRMS UI Deployment", progress: 85, owner: "AS", color: "emerald", status: "Active" },
        { id: 2, title: "Statutory Compliance Audit", progress: 42, owner: "MD", color: "amber", status: "Review" },
        { id: 3, title: "Personnel Ingest V 2.0", progress: 100, owner: "RS", color: "blue", status: "Completed" },
        { id: 4, title: "Internal Training Program", progress: 20, owner: "AK", color: "rose", status: "Planning" },
    ]);

    const [appraisalStatus, setAppraisalStatus] = useState([
        { label: 'Self Audit', status: 'Verified', color: 'emerald' },
        { label: 'Peer Review', status: 'Audit Log', color: 'amber' },
        { label: 'Manager Input', status: 'Pending', color: 'slate' },
    ]);

    const incrementProgress = (id: number) => {
        setObjectives(objectives.map(obj =>
            obj.id === id ? { ...obj, progress: Math.min(obj.progress + 10, 100) } : obj
        ));
    };

    const toggleAppraisal = (label: string) => {
        setAppraisalStatus(appraisalStatus.map(s =>
            s.label === label ? { ...s, status: s.status === 'Verified' ? 'Pending' : 'Verified', color: s.status === 'Verified' ? 'slate' : 'emerald' } : s
        ));
    };

    return (
        <div className="space-y-6 md:space-y-10 pb-20 px-2 md:px-0">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                        <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-rose-400 stroke-[2.5]" /> Growth & Appraisal Registry
                    </h1>
                    <p className="text-[9px] md:text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.3em]">Operational Merit Tracking • Objective Alignment</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[9px] md:text-[10px] tracking-widest px-8 h-12 md:h-14 rounded-xl md:rounded-2xl shadow-xl transition-all flex-1 md:flex-none">
                        Define New Goal <Target className="h-5 w-5 ml-3" />
                    </Button>
                </div>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {[
                    { label: 'Strategic Alignment', value: '88%', icon: Target, bg: 'bg-[#D1FAE5]', color: 'text-emerald-600' },
                    { label: 'Recognition Points', value: '1,420', icon: Star, bg: 'bg-[#FEF3C7]', color: 'text-amber-600' },
                    { label: 'Project Velocity', value: 'High', icon: Rocket, bg: 'bg-[#E0E7FF]', color: 'text-blue-600' },
                ].map((m, i) => (
                    <Card key={i} className={`${m.bg} border-none rounded-[2rem] md:rounded-3xl shadow-sm relative overflow-hidden h-40 md:h-45 group`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 md:px-8 pt-6 md:pt-8">
                            <CardTitle className="text-[10px] md:text-[11px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                                <m.icon className="h-4 w-4" /> {m.label}
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-slate-900/20 group-hover:text-slate-900 transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl md:text-5xl font-bold text-slate-900 absolute bottom-4 right-6">{m.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <Card className="xl:col-span-8 border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-2">
                    <CardHeader className="p-10 border-none">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-slate-900 italic underline underline-offset-4 decoration-[#EDE9FE]">Objective Tracking</h3>
                            <Badge className="bg-[#EDE9FE] text-purple-600 border-none font-black text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-xl uppercase">Cycle Q1 2026</Badge>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Active operational goals and key results</p>
                    </CardHeader>
                    <CardContent className="p-0 border-t border-slate-50">
                        <div className="divide-y divide-slate-50">
                            {objectives.map((goal) => (
                                <div key={goal.id} className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-slate-50 transition-colors group">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                                <AvatarFallback className="bg-slate-100 text-[10px] font-bold">{goal.owner}</AvatarFallback>
                                            </Avatar>
                                            <h4 className="text-sm font-bold text-slate-900 italic tracking-tight">{goal.title}</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                <span>Progress Status</span>
                                                <span>{goal.progress}% Protocol Complete</span>
                                            </div>
                                            <Progress value={goal.progress} className="h-2 bg-slate-50" />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => incrementProgress(goal.id)}
                                        variant="ghost"
                                        className="h-14 px-6 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-[#D9F99D] mix-blend-difference hover:bg-slate-900 hover:text-white transition-all transform scale-0 group-hover:scale-100"
                                    >
                                        Update Progress
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="xl:col-span-4 space-y-8">
                    <Card className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group min-h-[350px] border-4 border-[#F8F9FA] shadow-xl">
                        <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                        <div className="relative z-10 space-y-8">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Award className="h-8 w-8 text-[#D9F99D]" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black italic tracking-tighter leading-tight">Merit Recognition Wall</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">Public recognition for personnel surpassing operational targets.</p>
                            </div>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((n) => (
                                    <Avatar key={n} className="h-10 w-10 border-4 border-slate-900">
                                        <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-400">P{n}</AvatarFallback>
                                    </Avatar>
                                ))}
                                <div className="h-10 w-10 rounded-full bg-[#D9F99D] flex items-center justify-center text-slate-900 text-xs font-black">+12</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 italic mb-8 flex items-center gap-3"><Flag className="h-6 w-6 text-indigo-400" /> Appraisal Status</h3>
                        <div className="space-y-6">
                            {appraisalStatus.map((s, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer" onClick={() => toggleAppraisal(s.label)}>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors italic">{s.label}</span>
                                    <Badge className={`bg-${s.color === 'emerald' ? '[#D1FAE5]' : s.color === 'amber' ? '[#FEF3C7]' : 'slate-50'} text-${s.color === 'slate' ? 'slate-400' : s.color + '-600'} border-none font-black text-[8px] uppercase tracking-widest px-3 h-5 rounded-lg transition-all group-hover:px-4`}>
                                        {s.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-10 bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl hover:bg-slate-100">
                            Download Summary
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
