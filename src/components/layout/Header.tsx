"use client";

import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebar } from "./Sidebar";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between px-4 md:px-12 bg-transparent">
            {/* Left side: Greeting & Mobile Trigger */}
            <div className="flex items-center gap-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 bg-white rounded-xl shadow-sm">
                            <Menu className="h-5 w-5 text-slate-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80 border-none">
                        <MobileSidebar isOpen={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
                    </SheetContent>
                </Sheet>

                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Good Morning</h1>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">19 Aug 2023</p>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-3 md:gap-6">
                <div className="relative group hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-40 md:w-72 bg-white border-none pl-10 h-10 text-xs font-semibold rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-[#D9F99D] transition-all"
                    />
                </div>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 bg-white rounded-xl shadow-sm hover:bg-slate-50">
                    <Bell className="h-4 w-4 text-slate-600" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
                </Button>
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                    AS
                </div>
            </div>
        </header>
    );
}
