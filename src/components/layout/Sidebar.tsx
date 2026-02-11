"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Clock,
    CalendarDays,
    Wallet,
    TrendingUp,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Onboarding", href: "/onboarding", icon: UserPlus },
    { name: "Attendance", href: "/attendance", icon: Clock },
    { name: "Leave", href: "/leave", icon: CalendarDays },
    { name: "Payroll", href: "/payroll", icon: Wallet },
    { name: "Performance", href: "/performance", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex h-full w-64 flex-col bg-white border-r border-slate-100 shrink-0">
            <div className="flex h-20 items-center px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.83 8.39L21.78 9.53L16.89 14.47L17.94 21.39L12 18.27L6.06 21.39L7.11 14.47L2.22 9.53L9.17 8.39L12 2Z" fill="black" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 italic underline underline-offset-4 decoration-[#D9F99D]">HRMS</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1.5 px-4 py-8">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300",
                            pathname === item.href
                                ? "bg-[#D9F99D] text-slate-900 shadow-lg shadow-[#D9F99D]/20 translate-x-1"
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn(
                            "mr-3 h-4 w-4 transition-colors stroke-[2.5]",
                            pathname === item.href ? "text-slate-900" : "text-slate-300 group-hover:text-slate-900"
                        )} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <Button variant="ghost" className="w-full justify-start gap-3 h-14 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest px-6 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
                    <LogOut className="h-5 w-5 stroke-[2.5]" />
                    Log Out
                </Button>
            </div>
        </aside>
    );
}

export function MobileSidebar({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col h-full py-10 px-6 bg-white">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-2xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L14.83 8.39L21.78 9.53L16.89 14.47L17.94 21.39L12 18.27L6.06 21.39L7.11 14.47L2.22 9.53L9.17 8.39L12 2Z" fill="white" />
                    </svg>
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900 italic">ANTIGRAVITY</span>
            </div>

            <div className="flex-1 space-y-2">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                            "group flex items-center rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all",
                            pathname === item.href
                                ? "bg-[#D9F99D] text-slate-900 shadow-xl shadow-[#D9F99D]/20 animate-in fade-in slide-in-from-left-4"
                                : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        <item.icon className={cn(
                            "mr-4 h-5 w-5 stroke-[2.5]",
                            pathname === item.href ? "text-slate-900" : "text-slate-300"
                        )} />
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="mt-auto pt-10">
                <Button variant="ghost" className="w-full justify-start gap-4 h-16 rounded-2xl text-rose-500 font-black uppercase text-[10px] tracking-widest px-8 bg-rose-50 border border-rose-100">
                    <LogOut className="h-5 w-5" />
                    Terminate Session
                </Button>
            </div>
        </nav>
    );
}
