"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthYearPickerProps {
    month: number;        // 0-11
    year: number;
    onChange: (month: number, year: number) => void;
}

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthYearPicker({ month, year, onChange }: MonthYearPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewYear, setViewYear] = useState(year);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Sync view year when picker opens
    useEffect(() => {
        if (isOpen) setViewYear(year);
    }, [isOpen, year]);

    const handleSelectMonth = (m: number) => {
        onChange(m, viewYear);
        setIsOpen(false);
    };

    const prevYear = () => setViewYear(y => y - 1);
    const nextYear = () => setViewYear(y => y + 1);

    const today = new Date();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

    return (
        <div ref={containerRef} className="relative inline-flex">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100",
                    "hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-200"
                )}
            >
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-tight">
                    {monthAbbr[month]}
                </span>
                <span className="text-slate-300 text-[10px]">/</span>
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-tight">
                    {year}
                </span>
                {isCurrentMonth && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="Current month" />
                )}
            </button>

            {/* Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-[260px] animate-in fade-in zoom-in-95 duration-150">
                    {/* Year Navigation */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <button
                            type="button"
                            onClick={prevYear}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            {viewYear}
                        </span>
                        <button
                            type="button"
                            onClick={nextYear}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Month Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {monthNames.map((name, idx) => {
                            const isSelected = idx === month && viewYear === year;
                            const isCurrent = idx === today.getMonth() && viewYear === today.getFullYear();
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectMonth(idx)}
                                    className={cn(
                                        "py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                                        "hover:bg-indigo-50 hover:text-indigo-700",
                                        isSelected
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:text-white"
                                            : isCurrent
                                                ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                                                : "text-slate-600 bg-slate-50"
                                    )}
                                >
                                    {name.substring(0, 3)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                const now = new Date();
                                onChange(now.getMonth(), now.getFullYear());
                                setIsOpen(false);
                            }}
                            className="flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                            Current Month
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
