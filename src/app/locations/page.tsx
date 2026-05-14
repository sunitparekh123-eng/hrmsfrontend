"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
    MapPin, 
    Plus, 
    Users, 
    ArrowUpRight, 
    Building2, 
    MoreVertical, 
    Search,
    Clock,
    Activity,
    Shield,
    Globe,
    Navigation,
    Phone,
    User,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const branches = [
    { id: "LOC001", name: "Indore Hub", location: "Madhya Pradesh", employees: 122, attendance: "94%", activeNodes: 12, status: "Operational", color: "bg-blue-400" },
    { id: "LOC002", name: "Bhopal Terminal", location: "Madhya Pradesh", employees: 85, attendance: "88%", activeNodes: 8, status: "Operational", color: "bg-orange-400" },
    { id: "LOC003", name: "Satna Unit", location: "Madhya Pradesh", employees: 45, attendance: "92%", activeNodes: 5, status: "Operational", color: "bg-emerald-400" },
    { id: "LOC004", name: "Jabalpur Node", location: "Madhya Pradesh", employees: 37, attendance: "85%", activeNodes: 4, status: "Operational", color: "bg-purple-400" },
];

export default function LocationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <div className="space-y-8 md:space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline underline-offset-4 decoration-[#D9F99D] decoration-2 flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-blue-500" /> Our Locations
                    </h1>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] pt-2">Manage all your branches and offices here.</p>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-slate-900 text-white hover:bg-black font-black uppercase text-[9px] tracking-[0.3em] px-8 h-11 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2">
                            <Plus className="h-4 w-4 stroke-[3]" /> Add New Location
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[540px] border-none shadow-2xl p-0 overflow-y-auto">
                        <div className="h-2 bg-[#D9F99D]" />
                        <div className="p-8 space-y-10">
                            <SheetHeader className="text-left space-y-2">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <Globe className="h-6 w-6 text-blue-500" />
                                </div>
                                <SheetTitle className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Add New Branch</SheetTitle>
                                <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                    Enter branch details and location coordinates for geo-attendance.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-8">
                                {/* Basic Info Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Basic Details</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Branch Name</Label>
                                            <Input id="name" placeholder="Indore HQ" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="code" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Location Code</Label>
                                            <Input id="code" placeholder="LOC-IND" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">City / Region</Label>
                                        <Input id="region" placeholder="Indore, Madhya Pradesh" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                    </div>
                                </div>

                                {/* Geo-Location Section */}
                                <div className="space-y-6 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Navigation className="h-3.5 w-3.5 text-blue-500" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Location Details (GPS)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="lat" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Latitude</Label>
                                            <Input id="lat" placeholder="22.7196" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="long" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Longitude</Label>
                                            <Input id="long" placeholder="75.8577" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="radius" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Range / Radius (Meters)</Label>
                                        <Select defaultValue="50">
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px]">
                                                <SelectValue placeholder="Select radius" />
                                            </SelectTrigger>
                                            <SelectContent className="border-none shadow-xl rounded-xl">
                                                <SelectItem value="25" className="text-[10px] font-bold uppercase tracking-widest">25 Meters</SelectItem>
                                                <SelectItem value="50" className="text-[10px] font-bold uppercase tracking-widest">50 Meters (Recommended)</SelectItem>
                                                <SelectItem value="100" className="text-[10px] font-bold uppercase tracking-widest">100 Meters</SelectItem>
                                                <SelectItem value="200" className="text-[10px] font-bold uppercase tracking-widest">200 Meters (Large Warehouse)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Management Info Section */}
                                <div className="space-y-6 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Contact Person</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="manager" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Hub Manager</Label>
                                            <Input id="manager" placeholder="Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Number</Label>
                                            <Input id="phone" placeholder="+91 XXXXX XXXXX" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-[11px] focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <SheetFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
                                <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="flex-1 h-12 rounded-2xl border-slate-100 font-black uppercase text-[9px] tracking-widest hover:bg-slate-50 transition-all">
                                    Cancel
                                </Button>
                                <Button className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Save Branch
                                </Button>
                            </SheetFooter>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Locations", value: "04", icon: Building2, trend: "+1 month" },
                    { label: "Total Staff", value: "289", icon: Users, trend: "92% utilized" },
                    { label: "Branches", value: "01", icon: Shield, trend: "State-wide" },
                    { label: "System Status", value: "Optimal", icon: Activity, trend: "No downtime" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-[#D9F99D]/20 transition-colors">
                                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </div>
                            <span className="text-[7px] font-black uppercase text-emerald-500 tracking-widest">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mt-0.5">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                    <Input 
                        placeholder="Search for a location..." 
                        className="h-10 pl-12 bg-transparent border-none focus-visible:ring-0 font-bold text-[10px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {branches.map((branch) => (
                    <Card key={branch.id} className="border-none bg-white rounded-2xl p-1 overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <Badge className="bg-[#D1FAE5] text-emerald-600 border-none font-black text-[7px] uppercase px-2.5 h-4.5 rounded-md tracking-widest mb-2">
                                            {branch.status}
                                        </Badge>
                                        <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase italic tracking-tighter underline underline-offset-4 decoration-slate-100 group-hover:decoration-[#D9F99D] transition-all">
                                            {branch.name}
                                        </h3>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pt-1.5">
                                            <MapPin className="h-2.5 w-2.5" /> {branch.location}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 border border-slate-50">
                                        <MoreVertical className="h-4 w-4 text-slate-300" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-4">
                                    <div className="space-y-0.5">
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Employees</p>
                                        <p className="text-lg font-black text-slate-900">{branch.employees}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                                        <p className="text-lg font-black text-emerald-600">{branch.attendance}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Active Units</p>
                                        <p className="text-lg font-black text-blue-600">{branch.activeNodes}</p>
                                    </div>
                                </div>

                                <div className="pt-6 flex items-center gap-3">
                                    <Link href={`/locations/${branch.id}`} className="flex-1">
                                        <Button className="w-full bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[8px] tracking-widest h-10 rounded-lg shadow-sm">
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="h-10 w-10 rounded-lg border-slate-100 hover:bg-slate-50">
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full md:w-40 space-y-4">
                                <div className={cn("h-full min-h-[120px] rounded-2xl relative overflow-hidden p-5 flex flex-col justify-between", branch.color + " bg-opacity-20")}>
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <Building2 className="h-16 w-16 text-slate-900" />
                                    </div>
                                    <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest relative z-10">Location ID</p>
                                    <h4 className="text-lg font-black text-slate-900 relative z-10">{branch.id}</h4>
                                    
                                    <div className="flex -space-x-2 pt-3 relative z-10">
                                        {[1, 2, 3].map((i) => (
                                            <Avatar key={i} className="h-7 w-7 border-2 border-white rounded-md shadow-sm">
                                                <AvatarFallback className="bg-white text-[7px] font-black">UN</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        <div className="h-7 w-7 rounded-md bg-white/50 backdrop-blur-sm flex items-center justify-center text-[7px] font-black text-slate-600 border-2 border-white">
                                            +12
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

