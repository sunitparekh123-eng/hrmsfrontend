"use client";

import { useState } from "react";
import {
    UserPlus,
    ChevronRight,
    ArrowLeft,
    Upload,
    CheckCircle,
    FileText,
    ShieldCheck,
    Briefcase,
    Mail,
    Smartphone,
    MapPin,
    Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const steps = ["Basic Identity", "Operational Role", "Documentation", "Verify & Finish"];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header section with icon */}
            <div className="flex flex-col items-center text-center space-y-4 pt-8">
                <div className="h-16 w-16 bg-[#D1FAE5] rounded-[2rem] flex items-center justify-center shadow-sm">
                    <UserPlus className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Personnel Recruitment</h1>
                    <p className="text-sm font-medium text-slate-400 mt-2 italic">Standard deployment sequence for newly joined units.</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="relative flex justify-between items-center px-12">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                {steps.map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                        <div className={cn(
                            "h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm border-4 border-[#F8F9FA]",
                            currentStep >= i ? "bg-[#D9F99D] text-slate-900" : "bg-white text-slate-300"
                        )}>
                            {currentStep > i ? <CheckCircle className="h-5 w-5" /> : i + 1}
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            currentStep >= i ? "text-slate-900" : "text-slate-300"
                        )}>{step}</span>
                    </div>
                ))}
            </div>

            {/* Main Form Content */}
            <Card className="border-none shadow-sm rounded-[3rem] bg-white p-6 md:p-10">
                <CardHeader className="px-0 pt-0 pb-10 border-b border-dashed border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-900 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">{steps[currentStep]}</CardTitle>
                            <CardDescription className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-wider">Step {currentStep + 1} of 4</CardDescription>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                            <Star className="h-5 w-5 text-[#D9F99D] fill-[#D9F99D]" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 py-12 min-h-[400px]">
                    {currentStep === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                { label: 'Operational Display Name', id: 'name', placeholder: 'Walt Whitman', icon: UserPlus },
                                { label: 'Primary Communications Hash', id: 'email', placeholder: 'walt@antigravity.io', icon: Mail },
                                { label: 'Direct Mobile Vector', id: 'phone', placeholder: '+91 999 888 7777', icon: Smartphone },
                                { label: 'Physical Coordinate (Base)', id: 'address', placeholder: 'Sector 4, Space-Time Loop', icon: MapPin },
                            ].map((field) => (
                                <div key={field.id} className="space-y-3">
                                    <Label htmlFor={field.id} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <field.icon className="h-3.5 w-3.5" /> {field.label}
                                    </Label>
                                    <Input id={field.id} placeholder={field.placeholder} className="h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-sm focus-visible:ring-2 focus-visible:ring-[#D9F99D] transition-all" />
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-10">
                            <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center space-y-6 bg-slate-50/30 hover:bg-[#D9F99D]/5 hover:border-[#D9F99D] transition-all group flex flex-col items-center">
                                <div className="h-20 w-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                    <Upload className="h-10 w-10 text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-bold text-slate-900 italic">Drop Identity Protocols here</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aadhar • PAN • Offer Letter (PDF/PNG)</p>
                                </div>
                                <Button className="bg-[#D9F99D] text-slate-900 font-bold hover:bg-[#c8ea8a] px-10 rounded-xl h-12 shadow-sm">Select Files</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['Govt Identity', 'Tax Registry', 'Joining Kit'].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl group hover:border-[#D9F99D] shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-slate-300 group-hover:text-[#D9F99D]" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{doc}</span>
                                        </div>
                                        <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[8px] h-5">PENDING</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="flex flex-col items-center justify-center space-y-6 text-center h-full">
                            <div className="h-24 w-24 bg-[#E0E7FF] rounded-full flex items-center justify-center">
                                <Briefcase className="h-10 w-10 text-blue-600" />
                            </div>
                            <p className="text-lg font-bold text-slate-900 italic">Workforce Allocation Profile</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-sm">Assign departments, reporting managers, and temporal shift schedules.</p>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex flex-col items-center justify-center space-y-8 text-center h-full">
                            <div className="animate-bounce">
                                <ShieldCheck className="h-20 w-20 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900">Final Verification</h3>
                                <p className="text-sm font-medium text-slate-400 italic">System integrity check passed. Personnel ready for registry ingestion.</p>
                            </div>
                            <div className="p-8 bg-[#D1FAE5]/60 rounded-3xl border border-emerald-100 text-left max-w-md w-full">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Registration Summary</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Registry Name:</span> <span className="font-bold text-slate-900 uppercase tracking-tight italic">Walt Whitman</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Operational Node:</span> <span className="font-bold text-slate-900">Creative Lead</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-slate-500 font-bold">Shift ID:</span> <span className="font-bold text-slate-900">G-001 (General)</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="px-0 pb-0 pt-10 border-t border-slate-100 flex justify-between items-center bg-transparent">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="h-14 px-8 rounded-2xl gap-3 text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest text-[11px] transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" /> Go Back
                    </Button>
                    <Button
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        className="h-14 px-12 rounded-[1.5rem] bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-black transition-all flex items-center gap-3"
                    >
                        {currentStep === steps.length - 1 ? "Complete Registry" : "Advance Protocol"} <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
