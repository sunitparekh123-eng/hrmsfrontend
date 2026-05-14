"use client";
import { cn } from "@/lib/utils";

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
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">
                        <SettingsIcon className="h-7 w-7 text-slate-400 stroke-[2.5]" /> Settings
                    </h1>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 mt-6 uppercase tracking-[0.3em]">Manage your account and system settings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-2 rounded-xl border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#D9F99D] mix-blend-difference">Admin</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-10">
                <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm inline-flex">
                    <TabsList className="bg-transparent h-auto p-0 border-none gap-1.5">
                        {[
                            { value: 'profile', label: 'My Profile', icon: User },
                            { value: 'notifications', label: 'Notifications', icon: Bell },
                            { value: 'security', label: 'Security', icon: Shield },
                            { value: 'system', label: 'System', icon: SettingsIcon },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="data-[state=active]:bg-[#D9F99D] data-[state=active]:text-slate-900 px-6 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest gap-2"
                            >
                                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-1.5">
                        <div className="h-40 bg-[#E0E7FF] rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
                            <div className="absolute bottom-6 right-10">
                                <Button variant="ghost" className="bg-white/40 hover:bg-white/60 text-indigo-900 font-bold text-[9px] uppercase tracking-widest h-9 px-5 rounded-lg backdrop-blur-md transition-all">
                                    Change Cover
                                </Button>
                            </div>
                        </div>
                        <CardHeader className="relative pt-0 px-8">
                            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                                <Avatar className="h-32 w-32 border-8 border-white shadow-xl rounded-3xl">
                                    <AvatarFallback className="text-3xl font-black bg-slate-100 text-slate-900 italic">JD</AvatarFallback>
                                </Avatar>
                                <div className="pb-4 space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">John Doe</h2>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                        <Star className="h-3.5 w-3.5 text-[#D9F99D] fill-[#D9F99D]" /> HR Director • Triptay
                                    </p>
                                </div>
                                <div className="md:ml-auto pb-4">
                                    <Button className="h-10 px-6 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 font-bold text-[9px] uppercase tracking-widest border border-slate-100 transition-all">Verify Profile</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-12 pt-16 px-10">
                            <div className="grid gap-12 md:grid-cols-2">
                                {[
                                    { label: 'Display Name', id: 'displayName', value: 'John Doe', type: 'text' },
                                    { label: 'Email Address', id: 'email', value: 'john.doe@antigravity.io', type: 'email', readonly: true },
                                    { label: 'Phone Number', id: 'phone', value: '+91 98765 43210', type: 'tel' },
                                    { label: 'Time Zone', id: 'timezone', value: 'GMT +5:30 (IST)', type: 'text' },
                                ].map((field) => (
                                    <div key={field.id} className="space-y-3">
                                        <Label htmlFor={field.id} className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{field.label}</Label>
                                        <Input
                                            id={field.id}
                                            defaultValue={field.value}
                                            readOnly={field.readonly}
                                            className={cn(
                                                "h-11 rounded-xl border-none font-bold text-xs px-6 transition-all",
                                                field.readonly ? "bg-slate-50 text-slate-300" : "bg-slate-50/50 hover:bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#D9F99D]"
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="bio" className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">About You</Label>
                                <textarea
                                    id="bio"
                                    className="flex min-h-[120px] w-full rounded-2xl border-none bg-slate-50/50 p-5 text-xs font-bold ring-offset-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9F99D] transition-all"
                                    defaultValue="Senior HR Specialist with expertise in team management and scaling operations."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="px-8 pb-10 pt-4 flex justify-end gap-4 bg-transparent">
                            <Button variant="ghost" className="h-11 px-8 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all">Cancel</Button>
                            <Button className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black text-[9px] uppercase tracking-widest px-10 h-11 rounded-xl shadow-xl hover:translate-y-[-2px] transition-all">
                                <Save className="mr-3 h-4 w-4 stroke-[3]" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-1.5">
                        <CardHeader className="p-8 border-none">
                            <CardTitle className="text-xl font-black italic text-slate-900 underline underline-offset-8 decoration-[#FEF3C7] decoration-2 uppercase tracking-tighter">Manage Notifications</CardTitle>
                            <p className="text-[8px] font-bold text-slate-400 mt-6 uppercase tracking-[0.2em]">Choose what updates you want to receive.</p>
                        </CardHeader>
                        <CardContent className="p-0 border-t border-slate-50 mt-2">
                            {[
                                { title: "Leave Requests", desc: "Real-time alerts for incoming time-off requests.", default: true },
                                { title: "Performance Reviews", desc: "Automated prompts for periodic review completion.", default: true },
                                { title: "Salary Updates", desc: "Critical alerts when payment cycles are ready.", default: false },
                                { title: "Daily Attendance Reports", desc: "Consolidated morning reports on team availability.", default: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all border-b last:border-none border-slate-50">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900 italic tracking-tight">{item.title}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked={item.default} className="data-[state=checked]:bg-[#D9F99D] data-[state=checked]:border-transparent" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden p-8">
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-xl font-black italic text-slate-900 underline underline-offset-8 decoration-[#FEE2E2] decoration-2 uppercase tracking-tighter">Change Password</h3>
                                <p className="text-[8px] font-bold text-slate-400 mt-6 uppercase tracking-widest">Update your password regularly for better security.</p>
                            </div>
                            <div className="grid gap-6 max-w-xl">
                                {[
                                    { label: 'Current Password', id: 'curPass' },
                                    { label: 'New Password', id: 'newPass' },
                                ].map((s) => (
                                    <div key={s.id} className="space-y-3">
                                        <Label htmlFor={s.id} className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">{s.label}</Label>
                                        <Input id={s.id} type="password" placeholder="••••••••" className="h-11 rounded-xl bg-slate-50 border-none px-6 font-black" />
                                    </div>
                                ))}
                                <Button className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-[0.2em] px-8 h-11 rounded-xl w-fit shadow-xl hover:bg-black transition-all">Update Password</Button>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-[#FEE2E2]/60 rounded-3xl p-1.5 border-4 border-white shadow-xl group">
                        <Card className="border-none shadow-sm bg-white rounded-2xl p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-200 group-hover:rotate-6 transition-transform">
                                        <Lock className="h-7 w-7 stroke-[2.5]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-rose-950 italic tracking-tighter uppercase">Two-Factor Authentication</h3>
                                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-[0.2em]">Add an extra layer of security.</p>
                                    </div>
                                </div>
                                <Button className="h-11 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[9px] uppercase tracking-widest shadow-xl transition-all">Enable 2FA</Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="system" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-sm rounded-3xl bg-white p-8 space-y-8">
                            <div>
                                <h3 className="text-lg font-black italic tracking-tighter uppercase flex items-center gap-3"><Globe className="h-5 w-5 text-indigo-400" /> Region & Language</h3>
                                <p className="text-[8px] font-bold text-slate-300 mt-2 uppercase tracking-widest italic">Language and currency settings</p>
                            </div>
                            <div className="space-y-5">
                                {[
                                    { label: 'Language', value: 'English (India)' },
                                    { label: 'Currency', value: 'INR (₹)' },
                                ].map((l, i) => (
                                    <div key={i} className="space-y-2">
                                        <Label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">{l.label}</Label>
                                        <Input defaultValue={l.value} className="h-11 border-none bg-slate-50 rounded-lg font-bold text-xs px-6" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9F99D] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-[#D9F99D]" />
                                        </div>
                                        <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D9F99D]">Current Plan</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-3xl font-black tracking-tighter italic">Enterprise Pro</p>
                                        <div className="flex items-center gap-2 pt-1">
                                            <Badge className="bg-[#D9F99D] text-slate-900 text-[7px] font-black px-2 h-4 uppercase">UNLIMITED STAFF</Badge>
                                            <Badge variant="outline" className="border-white/20 text-white text-[7px] font-black px-2 h-4 uppercase">PRIORITY SUPPORT</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="link" className="p-0 h-auto font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mt-8 self-start underline-offset-8 text-[9px]">Billing History</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="bg-[#D9F99D] rounded-3xl p-1.5 border-4 border-white shadow-xl group">
                        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-8">
                                <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                    <HelpCircle className="h-7 w-7 text-slate-900" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase underline underline-offset-8 decoration-[#D9F99D] decoration-2">Help & Support</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">24/7 priority support is active.</p>
                                </div>
                            </div>
                            <Button className="h-12 px-10 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-black text-[9px] uppercase tracking-widest shadow-xl transition-all">Contact Support</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

