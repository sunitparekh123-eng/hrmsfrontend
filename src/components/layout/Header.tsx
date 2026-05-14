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
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between px-4 md:px-8 bg-transparent">
            {/* Left side: Greeting & Mobile Trigger */}
            <div className="flex items-center gap-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 bg-white rounded-lg shadow-sm">
                            <Menu className="h-4 w-4 text-slate-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80 border-none">
                        <MobileSidebar isOpen={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
                    </SheetContent>
                </Sheet>

                <div className="flex flex-col">
                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">Good Morning</h1>
                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">19 Aug 2023</p>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-3 md:gap-4">
                <div className="relative group hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-40 md:w-64 bg-white border-none pl-10 h-9 text-[10px] font-semibold rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-[#D9F99D] transition-all"
                    />
                </div>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 bg-white rounded-lg shadow-sm hover:bg-slate-50">
                    <Bell className="h-3.5 w-3.5 text-slate-600" />
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 border border-white" />
                </Button>
                <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-lg">
                    AS
                </div>
            </div>
        </header>
    );
}
