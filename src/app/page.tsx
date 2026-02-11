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
      <div className="bg-white rounded-[1.5rem] md:rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-slate-100">
        <div className="flex items-start md:items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 md:mt-0" />
          <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed">
            <span className="font-bold">Take Action :</span> The appraisal cycle is around the corner. Let&apos;s get started.
          </p>
        </div>
        <Button className="w-full md:w-auto bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl border border-[#D9F99D] shadow-sm">
          Send Reminders
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Employees", value: "289", icon: Users2, bg: "bg-[#E0E7FF]" },
          { title: "On Leave", value: "08", icon: Calendar, bg: "bg-[#D1FAE5]" },
          { title: "Hiring Roles", value: "03", icon: Briefcase, bg: "bg-[#FEE2E2]" },
          { title: "Requests", value: "28", icon: MessageSquare, bg: "bg-[#DBEAFE]" },
        ].map((stat, i) => (
          <Card key={i} className={stat.bg + " border-none rounded-[2rem] md:rounded-3xl shadow-sm relative overflow-hidden h-40 md:h-45"}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
              <CardTitle className="text-[10px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-[0.2em]">
                <stat.icon className="h-4 w-4 stroke-[2.5]" /> {stat.title}
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent className="px-6 pb-6 mt-auto">
              <div className="text-4xl md:text-5xl font-black text-slate-900 absolute bottom-4 right-6">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        {/* News & Updates Section - MOVED UP ON MOBILE */}
        <div className="xl:col-span-4 order-2 xl:order-2 space-y-6 md:space-y-8">
          {/* News & Events Section */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg md:text-xl font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-8 decoration-[#D9F99D]">News & Events</h3>
              <ArrowUpRight className="h-5 w-5 text-slate-300" />
            </div>
            <div className="space-y-6">
              {[
                { date: '03 Aug', title: 'Board Meeting', desc: 'Board Meeting' },
                { date: '29 Aug', title: 'Holiday - India', desc: 'Happy Onam to team - India' },
                { date: '13 Aug', title: 'New Joinee', desc: 'Welcome aboard, Walt Whitman' },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-[7px] font-black text-slate-400 leading-tight uppercase tracking-widest">
                    <span className="text-xs text-slate-900">{event.date.split(' ')[0]}</span>
                    {event.date.split(' ')[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-widest">{event.title}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 truncate uppercase tracking-tight">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Punch Section */}
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#D9F99D]" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter italic">Quick Punch</h3>
                </div>
                {isCheckedIn && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Live</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic leading-loose">
                {isCheckedIn
                  ? `Operational session active since ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                  : "Ready for deployment. Mark your presence for the current daily cycle."}
              </p>
              <Button
                onClick={() => setIsCheckedIn(!isCheckedIn)}
                className={cn(
                  "w-full font-black px-10 rounded-xl h-14 shadow-sm uppercase text-[10px] tracking-[0.3em] transition-all",
                  isCheckedIn
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200/50"
                    : "bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] shadow-[#D9F99D]/20"
                )}
              >
                {isCheckedIn ? "Terminate Shift" : "Initiate Shift"}
              </Button>
            </div>
          </div>
        </div>

        {/* Column - Main Visualization and Hiring */}
        <div className="xl:col-span-8 order-1 xl:order-1 space-y-6 md:space-y-8">
          {/* Visualization Section */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-center relative min-h-[350px] md:min-h-[400px]">
            <div className="absolute top-8 left-8 md:top-10 md:left-10">
              <h3 className="text-lg md:text-xl font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-8 decoration-[#D9F99D]">Nodes Center</h3>
            </div>
            <div className="relative h-48 w-48 md:h-64 md:w-64 mt-10 md:mt-0">
              <div className="absolute top-0 left-6 h-32 w-32 md:h-40 md:w-40 rounded-full bg-[#E0E7FF] opacity-60 flex items-center justify-center text-lg font-bold shadow-inner">122</div>
              <div className="absolute top-16 -left-8 h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#EDE9FE] opacity-80 flex items-center justify-center text-sm font-bold shadow-inner">14</div>
              <div className="absolute bottom-4 left-10 h-24 w-24 md:h-32 md:w-32 rounded-full bg-[#FEE2E2] opacity-90 flex items-center justify-center text-sm font-bold shadow-inner border border-white">27</div>
              <div className="absolute bottom-0 right-0 h-24 w-24 md:h-32 md:w-32 rounded-full bg-[#D1FAE5] opacity-70 flex items-center justify-center text-sm font-bold shadow-inner border border-white">38</div>
            </div>
            <div className="md:absolute md:right-10 md:top-12 flex md:flex-col gap-4 mt-10 md:mt-0">
              {[
                { label: 'Remote', color: 'bg-blue-400' },
                { label: 'India', color: 'bg-orange-400' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  <div className={l.color + " h-2 w-2 rounded-full shadow-sm"} />
                  {l.label}
                </div>
              ))}
            </div>
            <ArrowUpRight className="absolute bottom-8 right-8 h-5 w-5 text-slate-200" />
          </div>

          {/* Hiring Applications Section */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
              <h3 className="text-lg md:text-xl font-black text-slate-900 italic uppercase tracking-widest leading-none underline underline-offset-8 decoration-[#D9F99D]">Operational Nodes</h3>
              <Button className="w-full md:w-auto bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[10px] tracking-widest px-8 h-10 rounded-xl">
                Global Share
              </Button>
            </div>
            <div className="space-y-8">
              {[
                { name: 'Harper Lee', role: 'Creative Lead', color: 'purple', img: 'HL' },
                { name: 'Francis Degas', role: 'Front End Developer', color: 'green', img: 'FD' },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-slate-50 shadow-sm rounded-xl md:rounded-2xl">
                      <AvatarFallback className="bg-slate-100 text-[10px] font-black uppercase italic">{app.img}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">{app.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Level 4 • Terminal 01</p>
                    </div>
                  </div>
                  <Badge className={`text-[8px] font-black px-3 py-1.5 rounded-lg border-none whitespace-nowrap uppercase tracking-widest italic ${app.color === 'purple' ? 'bg-purple-100 text-purple-600' :
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
