"use client";

import { useState } from "react";
import {
  Users,
  UserMinus,
  Briefcase,
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  Search,
  Share2,
  Calendar,
  FileText,
  CreditCard,
  Shield,
  Monitor,
  Users2,
  Settings2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  return (
    <div className="space-y-6 md:space-y-8 pb-12 bg-[#F8F9FA] min-h-screen">
      {/* Notification Bar */}
      <div className="bg-white rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm border border-slate-100">
        <div className="flex items-start md:items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1 md:mt-0" />
          <p className="text-[10px] md:text-xs font-semibold text-slate-700 leading-relaxed">
            <span className="font-bold">Take Action :</span> The appraisal cycle is around the corner. Let&apos;s get started.
          </p>
        </div>
        <Button className="w-full md:w-auto bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[8px] tracking-widest px-6 h-10 rounded-lg border border-[#D9F99D] shadow-sm">
          Send Reminders
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Employees", value: "289", icon: Users2, bg: "bg-[#E0E7FF]" },
          { title: "On Leave", value: "08", icon: Calendar, bg: "bg-[#D1FAE5]" },
          { title: "Hiring Roles", value: "03", icon: Briefcase, bg: "bg-[#FEE2E2]" },
          { title: "Requests", value: "28", icon: MessageSquare, bg: "bg-[#DBEAFE]" },
        ].map((stat, i) => (
          <Card key={i} className={stat.bg + " border-none rounded-2xl shadow-sm relative overflow-hidden h-32"}>
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-5 pt-5">
              <CardTitle className="text-[8px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-[0.2em]">
                <stat.icon className="h-3.5 w-3.5 stroke-[2.5]" /> {stat.title}
              </CardTitle>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </CardHeader>
            <CardContent className="px-5 pb-5 mt-auto">
              <div className="text-2xl md:text-3xl font-black text-slate-900 absolute bottom-3 right-5">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        {/* News & Updates Section - MOVED UP ON MOBILE */}
        <div className="xl:col-span-4 order-2 xl:order-2 space-y-6 md:space-y-8">
          {/* News & Events Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D]">News & Events</h3>
              <ArrowUpRight className="h-4 w-4 text-slate-300" />
            </div>
            <div className="space-y-4">
              {[
                { date: '03 Aug', title: 'Board Meeting', desc: 'Board Meeting' },
                { date: '29 Aug', title: 'Holiday - India', desc: 'Happy Onam to team - India' },
                { date: '13 Aug', title: 'New Joinee', desc: 'Welcome aboard, Walt Whitman' },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-[6px] font-black text-slate-400 leading-tight uppercase tracking-widest">
                    <span className="text-[10px] text-slate-900">{event.date.split(' ')[0]}</span>
                    {event.date.split(' ')[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-widest">{event.title}</p>
                    <p className="text-[8px] font-bold text-slate-400 mt-0.5 truncate uppercase tracking-tight">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Punch Section */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-[#D9F99D]" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tighter italic">Quick Punch</h3>
                </div>
                {isCheckedIn && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[6px] font-black uppercase text-emerald-400 tracking-widest">Live</span>
                  </div>
                )}
              </div>
              <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic leading-loose">
                {isCheckedIn
                  ? `You checked in at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                  : "Ready to work."}
              </p>
              <Button
                onClick={() => setIsCheckedIn(!isCheckedIn)}
                className={cn(
                  "w-full font-black px-6 rounded-lg h-11 shadow-sm uppercase text-[8px] tracking-[0.3em] transition-all",
                  isCheckedIn
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200/50"
                    : "bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] shadow-[#D9F99D]/20"
                )}
              >
                {isCheckedIn ? "Check Out" : "Check In"}
              </Button>
            </div>
          </div>
        </div>

        {/* Column - Main Visualization and Hiring */}
        <div className="xl:col-span-8 order-1 xl:order-1 space-y-6 md:space-y-8">
          {/* Visualization Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-center relative min-h-[300px]">
            <div className="absolute top-6 left-6">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D]">Locations</h3>
            </div>
            <div className="relative h-40 w-40 md:h-52 md:w-52 mt-8 md:mt-0">
              <div className="absolute top-0 left-5 h-24 w-24 md:h-32 md:w-32 rounded-full bg-[#E0E7FF] opacity-60 flex items-center justify-center text-sm font-bold shadow-inner">122</div>
              <div className="absolute top-12 -left-6 h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#EDE9FE] opacity-80 flex items-center justify-center text-xs font-bold shadow-inner">14</div>
              <div className="absolute bottom-3 left-8 h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#FEE2E2] opacity-90 flex items-center justify-center text-xs font-bold shadow-inner border border-white">27</div>
              <div className="absolute bottom-0 right-0 h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#D1FAE5] opacity-70 flex items-center justify-center text-xs font-bold shadow-inner border border-white">38</div>
            </div>
            <div className="md:absolute md:right-8 md:top-8 flex md:flex-col gap-3 mt-8 md:mt-0">
              {[
                { label: 'Remote', color: 'bg-blue-400' },
                { label: 'India', color: 'bg-orange-400' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">
                  <div className={l.color + " h-1.5 w-1.5 rounded-full shadow-sm"} />
                  {l.label}
                </div>
              ))}
            </div>
            <ArrowUpRight className="absolute bottom-6 right-6 h-4 w-4 text-slate-200" />
          </div>

          {/* Hiring Applications Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h3 className="text-sm font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-4 decoration-[#D9F99D]">Recent Applications</h3>
              <Button className="w-full md:w-auto bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[8px] tracking-widest px-6 h-9 rounded-lg">
                View All
              </Button>
            </div>
            <div className="space-y-5">
              {[
                { name: 'Harper Lee', role: 'Creative Lead', color: 'purple', img: 'HL' },
                { name: 'Francis Degas', role: 'Front End Developer', color: 'green', img: 'FD' },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-slate-50 shadow-sm rounded-lg">
                      <AvatarFallback className="bg-slate-100 text-[8px] font-black uppercase italic">{app.img}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{app.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Level 4 • Branch 01</p>
                    </div>
                  </div>
                  <Badge className={`text-[7px] font-black px-2 py-1 rounded-md border-none whitespace-nowrap uppercase tracking-widest italic ${app.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    app.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                    {app.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
