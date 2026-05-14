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
    LogOut,
    MapPin,
    BarChart3,
    FileType,
    UserCircle,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRole, ModuleName } from "@/context/RoleContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const navigation: { name: string, href: string, icon: any, module: ModuleName }[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, module: 'DASHBOARD' },
    { name: "Employees", href: "/employees", icon: Users, module: 'EMPLOYEES' },
    { name: "Onboarding", href: "/onboarding", icon: UserPlus, module: 'EMPLOYEES' }, // Shared with employees module for now
    { name: "Attendance", href: "/attendance", icon: Clock, module: 'ATTENDANCE' },
    { name: "Locations", href: "/locations", icon: MapPin, module: 'LOCATIONS' },
    { name: "Leave", href: "/leave", icon: CalendarDays, module: 'LEAVE' },
    { name: "Payroll", href: "/payroll", icon: Wallet, module: 'PAYROLL' },
    { name: "Letters", href: "/letters", icon: FileType, module: 'LETTERS' },
    { name: "Reports", href: "/reports", icon: BarChart3, module: 'REPORTS' },
    { name: "Settings", href: "/settings", icon: Settings, module: 'SETTINGS' },
    { name: "Role Mgmt", href: "/settings/roles", icon: Shield, module: 'ROLE_MGMT' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { role, setRole, hasPermission } = useRole();

    const filteredNavigation = navigation.filter(item => hasPermission(item.module, 'READ'));

    return (
        <aside className="hidden lg:flex h-full w-64 flex-col bg-white border-r border-slate-100 shrink-0">
            <div className="flex h-14 items-center px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-6 w-6 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.83 8.39L21.78 9.53L16.89 14.47L17.94 21.39L12 18.27L6.06 21.39L7.11 14.47L2.22 9.53L9.17 8.39L12 2Z" fill="black" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900 italic underline underline-offset-4 decoration-[#D9F99D]">HRMS</span>
                </Link>
            </div>

            <div className="px-4 py-3 mt-2">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <UserCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Current Access</span>
                    </div>
                    <Select value={role} onValueChange={(v) => setRole(v)}>
                        <SelectTrigger className="h-8 border-none bg-white shadow-sm text-[8px] font-black uppercase tracking-widest rounded-lg">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="SUPER_ADMIN" className="text-[8px] font-black uppercase">Super Admin</SelectItem>
                            <SelectItem value="ADMIN" className="text-[8px] font-black uppercase">Admin</SelectItem>
                            <SelectItem value="MANAGER" className="text-[8px] font-black uppercase">Manager</SelectItem>
                            <SelectItem value="EMPLOYEE" className="text-[8px] font-black uppercase">Employee</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-2">
                {filteredNavigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                            pathname === item.href
                                ? "bg-[#D9F99D] text-slate-900 shadow-md shadow-[#D9F99D]/20 translate-x-1"
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn(
                            "mr-3 h-3.5 w-3.5 transition-colors stroke-[2.5]",
                            pathname === item.href ? "text-slate-900" : "text-slate-300 group-hover:text-slate-900"
                        )} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <Button variant="ghost" className="w-full justify-start gap-3 h-10 rounded-xl text-slate-400 font-black uppercase text-[9px] tracking-widest px-4 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
                    <LogOut className="h-4 w-4 stroke-[2.5]" />
                    Log Out
                </Button>
            </div>
        </aside>
    );
}

export function MobileSidebar({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const pathname = usePathname();
    const { role, hasPermission } = useRole();

    const filteredNavigation = navigation.filter(item => hasPermission(item.module, 'READ'));

    return (
        <nav className="flex flex-col h-full py-10 px-6 bg-white">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="h-10 w-10 flex items-center justify-center bg-slate-900 rounded-2xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L14.83 8.39L21.78 9.53L16.89 14.47L17.94 21.39L12 18.27L6.06 21.39L7.11 14.47L2.22 9.53L9.17 8.39L12 2Z" fill="white" />
                    </svg>
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900 italic">HRMS</span>
            </div>

            <div className="flex-1 space-y-2">
                {filteredNavigation.map((item) => (
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
                    Logout
                </Button>
            </div>
        </nav>
    );
}
