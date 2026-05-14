"use client";

import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { 
    MapPin, 
    ArrowLeft, 
    Users, 
    Activity, 
    Shield, 
    Building2, 
    Calendar,
    Search,
    Download,
    Timer,
    Navigation,
    User,
    Phone,
    MoreVertical,
    AlertCircle,
    TrendingUp,
    Camera,
    Smartphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableHeader } from "@/components/ui/table";

export default function LocationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    // Mock Data for a single branch
    const branchData = {
        id: id as string,
        name: "Indore Hub",
        location: "Indore, Madhya Pradesh",
        code: "LOC-IND-01",
        manager: "Vikram Singh",
        contact: "+91 98765 43210",
        status: "Operational",
        totalEmployees: 122,
        attendanceRate: "94.2%",
        activeUnits: 12,
        lateIncidents: 8,
        geo: {
            lat: "22.7196",
            long: "75.8577",
            radius: "50m"
        },
        recentLogs: [
            { id: "EMP001", name: "Arjun Singh", in: "09:05 AM", status: "Present", device: "iPhone 13", photo: true },
            { id: "EMP042", name: "Meera Das", in: "09:45 AM", status: "Late", device: "Samsung S22", photo: true },
            { id: "EMP108", name: "Rahul Sharma", in: "08:55 AM", status: "Present", device: "Pixel 7", photo: true },
            { id: "EMP215", name: "Anita Kapoor", in: "---", status: "Absent", device: "---", photo: false },
        ]
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
                >
                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-2">
                        {branchData.name} <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] uppercase tracking-widest">{branchData.status}</Badge>
                    </h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pt-1">
                        <MapPin className="h-3 w-3" /> {branchData.location} • ID: {branchData.id}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Stats & Logs */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Total Staff", value: branchData.totalEmployees, icon: Users, color: "blue", trend: "+12 new" },
                            { label: "Attendance", value: branchData.attendanceRate, icon: Activity, color: "emerald", trend: "High" },
                            { label: "Active Units", value: branchData.activeUnits, icon: Shield, color: "rose", trend: "Optimal" },
                        ].map((stat, i) => (
                            <Card key={i} className="border-none bg-white rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
                                <div className={cn("absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full opacity-[0.03]", `bg-${stat.color}-500`)} />
                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", 
                                            stat.color === 'blue' ? "bg-blue-50 text-blue-500" :
                                            stat.color === 'emerald' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                                        )}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{stat.trend}</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                        <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mt-1">{stat.value}</h3>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Branch Activity / Performance Chart Placeholder */}
                    <Card className="border-none bg-white rounded-[2.5rem] p-1 shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-4 border-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-black italic uppercase text-slate-900 tracking-tighter">Operational Analytics</CardTitle>
                                    <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">7-Day Attendance & Production Trends</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-slate-900 text-[#D9F99D] border-none font-black text-[7px] uppercase px-3 h-6 rounded-lg shadow-sm tracking-widest flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3" /> Growth: +4.2%
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="h-64 w-full bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="flex items-center gap-6 relative z-10">
                                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                                        <div key={i} className="flex flex-col items-center gap-3">
                                            <div 
                                                className="w-10 bg-slate-900 rounded-t-xl transition-all duration-1000 group-hover:bg-[#D9F99D]" 
                                                style={{ height: `${h * 1.5}px` }} 
                                            />
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Day {i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0,transparent_100%)] pointer-events-none" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branch Logs Table */}
                    <Card className="border-none bg-white rounded-[2.5rem] shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-4 border-none flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black italic uppercase text-slate-900 tracking-tighter underline underline-offset-4 decoration-[#D9F99D]">Live Status Table</CardTitle>
                                <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Current Shift Attendance Log</CardDescription>
                            </div>
                            <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-100 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50">
                                <Download className="h-4 w-4 mr-2" /> Export Logs
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Clock In</th>
                                        <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Device</th>
                                        <th className="text-left py-5 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {branchData.recentLogs.map((log, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 rounded-lg shadow-sm border border-white">
                                                        <AvatarFallback className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter">AS</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-slate-900 italic uppercase tracking-tighter">{log.name}</span>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{log.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-2">
                                                    <Timer className="h-3 w-3 text-slate-300" />
                                                    <span className="text-[10px] font-black text-slate-700 tracking-tighter italic">{log.in}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{log.device}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <Badge className={cn(
                                                    "font-black text-[8px] uppercase tracking-widest px-3 h-6 rounded-lg shadow-sm border-none",
                                                    log.status === 'Present' ? "bg-emerald-50 text-emerald-600" :
                                                    log.status === 'Late' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                                )}>
                                                    {log.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
                                <Button variant="ghost" className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-widest">
                                    Load All Logs (122 Total)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings & Details */}
                <div className="space-y-8">
                    {/* Branch Details Card */}
                    <Card className="border-none bg-white rounded-[2.5rem] shadow-sm overflow-hidden p-8 space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-sm font-black italic uppercase text-slate-900 tracking-tighter">Branch Configuration</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Static information and technical parameters for this node.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                                    <Navigation className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Geo-Fence Coordinates</p>
                                    <p className="text-[11px] font-bold text-slate-900 tracking-widest font-mono">LAT: {branchData.geo.lat}</p>
                                    <p className="text-[11px] font-bold text-slate-900 tracking-widest font-mono">LONG: {branchData.geo.long}</p>
                                    <Badge className="bg-slate-900 text-white border-none font-black text-[7px] uppercase px-2 h-4 mt-2">Radius: {branchData.geo.radius}</Badge>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Branch Manager</p>
                                    <p className="text-sm font-black text-slate-900 italic tracking-tighter uppercase">{branchData.manager}</p>
                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2 pt-1 uppercase">
                                        <Phone className="h-3 w-3" /> {branchData.contact}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] transition-all">
                                Edit Configuration
                            </Button>
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-rose-100 text-rose-500 font-black text-[9px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:border-rose-200 transition-all">
                                Suspend Hub
                            </Button>
                        </div>
                    </Card>

                    {/* Operational Alerts */}
                    <Card className="border-none bg-[#FEF2F2] rounded-[2.5rem] shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-3 text-rose-600">
                            <AlertCircle className="h-5 w-5" />
                            <h3 className="text-sm font-black uppercase italic tracking-tighter">Active Alerts</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                "3 Employees punched from non-whitelisted devices.",
                                "Attendance rate dropped below 90% yesterday.",
                                "Hub manager license expiring in 4 days."
                            ].map((alert, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-rose-100/50">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase">{alert}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
