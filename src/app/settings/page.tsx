"use client";

import {
    User,
    Settings as SettingsIcon,
    Bell,
    Lock,
    Shield,
    Globe,
    Smartphone,
    Save,
    HelpCircle,
    CreditCard,
    ArrowUpRight,
    Star
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                        <SettingsIcon className="h-8 w-8 text-slate-400 stroke-[2.5]" /> Registry Configuration
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.3em]">System Preferences • Access Protocols</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#D9F99D] mix-blend-difference">Admin Authority Active</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-10">
                <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm inline-flex">
                    <TabsList className="bg-transparent h-auto p-0 border-none gap-2">
                        {[
                            { value: 'profile', label: 'Personal Node', icon: User },
                            { value: 'notifications', label: 'Direct Dispatch', icon: Bell },
                            { value: 'security', label: 'Shield Protocol', icon: Shield },
                            { value: 'system', label: 'Core System', icon: SettingsIcon },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900 px-8 py-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest gap-2"
                            >
                                <tab.icon className="h-4 w-4" /> {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-2">
                        <div className="h-48 bg-[#E0E7FF] rounded-[3rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
                            <div className="absolute bottom-6 right-10">
                                <Button variant="ghost" className="bg-white/40 hover:bg-white/60 text-indigo-900 font-bold text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl backdrop-blur-md transition-all">
                                    Update Banner
                                </Button>
                            </div>
                        </div>
                        <CardHeader className="relative pt-0 px-10">
                            <div className="flex flex-col md:flex-row md:items-end gap-8 -mt-20">
                                <Avatar className="h-40 w-40 border-[12px] border-white shadow-2xl rounded-[3rem]">
                                    <AvatarFallback className="text-4xl font-black bg-slate-100 text-slate-900 italic">JD</AvatarFallback>
                                </Avatar>
                                <div className="pb-4 space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">John Doe</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                        <Star className="h-3.5 w-3.5 text-[#D9F99D] fill-[#D9F99D]" /> Global HR Director • Antigravity
                                    </p>
                                </div>
                                <div className="md:ml-auto pb-4">
                                    <Button className="h-12 px-8 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest border border-slate-100 transition-all">Identity Audit</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-12 pt-16 px-10">
                            <div className="grid gap-12 md:grid-cols-2">
                                {[
                                    { label: 'Public Display Alias', id: 'displayName', value: 'John Doe', type: 'text' },
                                    { label: 'Primary Network Hash', id: 'email', value: 'john.doe@antigravity.io', type: 'email', readonly: true },
                                    { label: 'Communications Vector', id: 'phone', value: '+91 98765 43210', type: 'tel' },
                                    { label: 'Temporal Temporal Zone', id: 'timezone', value: 'GMT +5:30 (IST)', type: 'text' },
                                ].map((field) => (
                                    <div key={field.id} className="space-y-4">
                                        <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{field.label}</Label>
                                        <Input
                                            id={field.id}
                                            defaultValue={field.value}
                                            readOnly={field.readonly}
                                            className={cn(
                                                "h-14 rounded-2xl border-none font-bold text-xs px-6 transition-all",
                                                field.readonly ? "bg-slate-50 text-slate-300" : "bg-slate-50/50 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#D9F99D]"
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Identity Registry Summary</Label>
                                <textarea
                                    id="bio"
                                    className="flex min-h-[140px] w-full rounded-[2rem] border-none bg-slate-50/50 p-6 text-xs font-bold ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D] transition-all"
                                    defaultValue="Senior HR Strategist specializing in deep organizational scaling and cultural engineering for high-performance teams."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="px-10 pb-12 pt-6 flex justify-end gap-6 bg-transparent">
                            <Button variant="ghost" className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all">Discard Registry</Button>
                            <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black text-[10px] uppercase tracking-widest px-12 h-14 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all">
                                <Save className="mr-3 h-4 w-4 stroke-[3]" /> Commit Integration
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-2">
                        <CardHeader className="p-10 border-none">
                            <CardTitle className="text-2xl font-black italic text-slate-900 underline underline-offset-8 decoration-[#FEF3C7] decoration-4">Operational Dispatch</CardTitle>
                            <p className="text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.2em]">Manage Personnel Alert Vectors</p>
                        </CardHeader>
                        <CardContent className="p-0 border-t border-slate-50 mt-4">
                            {[
                                { title: "Leave Protocol Entry", desc: "Real-time alerts for incoming time-off requests.", default: true },
                                { title: "Appraisal Cycle Initiation", desc: "Automated prompts for quarterly appraisal completion.", default: true },
                                { title: "Disbursement Integrity", desc: "Critical alerts when disbursement cycles are ready.", default: false },
                                { title: "Daily Presence Meta-Data", desc: "Consolidated morning reports on team availability.", default: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-10 hover:bg-slate-50 transition-all border-b last:border-none border-slate-50">
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-slate-900 italic tracking-tight">{item.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked={item.default} className="data-[state=checked]:bg-[#D9F99D] data-[state=checked]:border-transparent scale-125" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-10">
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-black italic text-slate-900 underline underline-offset-8 decoration-[#FEE2E2] decoration-4">Key Rotation Profile</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest">Temporal Rotation Protocol Recommended</p>
                            </div>
                            <div className="grid gap-8 max-w-xl">
                                {[
                                    { label: 'Active Personnel Key', id: 'curPass' },
                                    { label: 'New Generation Hash', id: 'newPass' },
                                ].map((s) => (
                                    <div key={s.id} className="space-y-4">
                                        <Label htmlFor={s.id} className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">{s.label}</Label>
                                        <Input id={s.id} type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-black" />
                                    </div>
                                ))}
                                <Button className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 h-14 rounded-2xl w-fit shadow-xl hover:bg-black transition-all">Rotate Identity Key</Button>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-[#FEE2E2]/60 rounded-[4rem] p-3 border-4 border-white shadow-xl group">
                        <Card className="border-none shadow-sm bg-white rounded-[3.5rem] p-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                                <div className="flex items-center gap-8">
                                    <div className="h-20 w-20 rounded-[2rem] bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-200 group-hover:rotate-12 transition-transform">
                                        <Lock className="h-10 w-10 stroke-[2.5]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-rose-950 italic tracking-tighter">Dual-Factor Hardening</h3>
                                        <p className="text-[11px] font-bold text-rose-400 uppercase tracking-[0.2em]">Military-grade account encryption</p>
                                    </div>
                                </div>
                                <Button className="h-16 px-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100 transition-all">Activate Shield</Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="system" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card className="border-none shadow-sm rounded-[3.5rem] bg-white p-12 space-y-10">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3"><Globe className="h-6 w-6 text-indigo-400" /> Operational Locale</h3>
                                <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest italic">Temporal and Regional Standards</p>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Protocol Dialect', value: 'English (India)' },
                                    { label: 'Fiat Monetary Unit', value: 'INR (₹)' },
                                ].map((l, i) => (
                                    <div key={i} className="space-y-3">
                                        <Label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{l.label}</Label>
                                        <Input defaultValue={l.value} className="h-12 border-none bg-slate-50 rounded-xl font-bold text-xs px-6" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm rounded-[3.5rem] bg-slate-900 text-white p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9F99D] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                            <CreditCard className="h-6 w-6 text-[#D9F99D]" />
                                        </div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D9F99D]">Registry Tier</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-4xl font-black tracking-tighter italic">Enterprise Pro</p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <Badge className="bg-[#D9F99D] text-slate-900 text-[8px] font-black px-2 h-5 uppercase">INFINITE PERSONNEL</Badge>
                                            <Badge variant="outline" className="border-white/20 text-white text-[8px] font-black px-2 h-5 uppercase">HIGH-NODE PRIORITY</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="link" className="p-0 h-auto font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mt-12 self-start underline-offset-8">Audit Disbursement Archives</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="bg-[#D9F99D] rounded-[4rem] p-3 border-4 border-white shadow-xl group">
                        <div className="bg-slate-900 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-10">
                                <div className="h-20 w-20 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                    <HelpCircle className="h-10 w-10 text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase underline underline-offset-8 decoration-[#D9F99D] decoration-4">Strategic Support Node</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">24/7 Priority Integration Concierge Active</p>
                                </div>
                            </div>
                            <Button className="h-16 px-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">Critical Ticket Request</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
