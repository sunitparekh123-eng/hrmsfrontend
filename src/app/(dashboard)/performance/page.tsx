"use client";

import { useState, useEffect, useCallback } from "react";
import {
    TrendingUp,
    Target,
    Star,
    Award,
    Zap,
    MoreHorizontal,
    ArrowUpRight,
    MessageCircle,
    CheckCircle2,
    Flag,
    PieChart,
    Rocket,
    Check,
    RotateCcw,
    Loader2,
    Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiGet, apiPost, apiPatch } from "@/lib/api-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type Objective = {
    id: number;
    title: string;
    description?: string;
    category: string;
    weight: number;
    progress: number;
    status: string;
    target_date?: string;
    color: string;
};

type Review = {
    id: number;
    review_period: string;
    rating: string;
    scores?: Record<string, number>;
    comments?: string;
    reviewed_by_name?: string;
    reviewed_at?: string;
};

const CATEGORY_COLORS: Record<string, string> = {
    delivery: "emerald",
    quality: "blue",
    learning: "amber",
    leadership: "rose",
    other: "slate",
};

const STATUS_LABELS: Record<string, string> = {
    not_started: "Planning",
    in_progress: "Active",
    completed: "Completed",
    overdue: "Overdue",
};

const STATUS_BADGE: Record<string, string> = {
    emerald: "bg-[#D1FAE5] text-emerald-600",
    amber: "bg-[#FEF3C7] text-amber-600",
    blue: "bg-[#E0E7FF] text-blue-600",
    rose: "bg-[#FFE4E6] text-rose-600",
    slate: "bg-slate-50 text-slate-400",
};

const RATING_LABELS: Record<string, string> = {
    excellent: "Outstanding",
    good: "Exceeds",
    average: "Meets",
    below_average: "Needs Improvement",
    poor: "Unsatisfactory",
};

const RATING_COLORS: Record<string, string> = {
    excellent: "emerald",
    good: "blue",
    average: "amber",
    below_average: "rose",
    poor: "slate",
};

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function PerformancePage() {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [createForm, setCreateForm] = useState({ title: "", description: "", category: "delivery", weight: 5, target_date: "" });
    const [updateForm, setUpdateForm] = useState<{ id: number; progress: number; status: string }>({ id: 0, progress: 0, status: "in_progress" });

    const fetchObjectives = useCallback(async () => {
        try {
            const data = await apiGet<any>("/performance/objectives");
            const rows = (data.data || data.rows || data || []).map((r: any) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                category: r.category || "other",
                weight: r.weight || 1,
                progress: r.progress || 0,
                status: r.status || "not_started",
                target_date: r.target_date,
                color: CATEGORY_COLORS[r.category] || "slate",
            }));
            setObjectives(rows);
        } catch (_) { }
    }, []);

    const fetchReviews = useCallback(async () => {
        try {
            const data = await apiGet<any>("/performance/reviews");
            const rows = (data.data || data.rows || data || []).map((r: any) => ({
                id: r.id,
                review_period: r.review_period || "—",
                rating: r.rating || "average",
                scores: r.scores,
                comments: r.comments,
                reviewed_by_name: r.reviewed_by?.name || r.reviewer?.name || "—",
                reviewed_at: r.reviewed_at || r.created_at,
            }));
            setReviews(rows);
        } catch (_) { }
    }, []);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchObjectives(), fetchReviews()]).finally(() => setLoading(false));
    }, [fetchObjectives, fetchReviews]);

    const handleCreate = async () => {
        if (!createForm.title.trim()) return;
        setSubmitting(true);
        try {
            await apiPost("/performance/objectives", {
                title: createForm.title,
                description: createForm.description,
                category: createForm.category,
                weight: createForm.weight,
                target_date: createForm.target_date || undefined,
            });
            setShowCreate(false);
            setCreateForm({ title: "", description: "", category: "delivery", weight: 5, target_date: "" });
            await fetchObjectives();
        } catch (_) { } finally { setSubmitting(false); }
    };

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            await apiPatch(`/performance/objectives/${updateForm.id}`, {
                progress: updateForm.progress,
                status: updateForm.status,
            });
            setShowUpdate(false);
            await fetchObjectives();
        } catch (_) { } finally { setSubmitting(false); }
    };

    const openUpdateDialog = (obj: Objective) => {
        setUpdateForm({ id: obj.id, progress: obj.progress, status: obj.status });
        setShowUpdate(true);
    };

    const completedCount = objectives.filter(o => o.status === "completed").length;
    const avgProgress = objectives.length > 0 ? Math.round(objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length) : 0;
    const activeCount = objectives.filter(o => o.status === "in_progress").length;

    return (
        <ProtectedRoute module="PERFORMANCE" action="READ">
            <div className="space-y-6 md:space-y-10 pb-20 px-2 md:px-0">
                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-4 italic underline underline-offset-8 decoration-[#D9F99D] decoration-4">
                            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-rose-400 stroke-[2.5]" /> Growth & Appraisal Registry
                        </h1>
                        <p className="text-[9px] md:text-xs font-bold text-slate-400 mt-6 uppercase tracking-[0.3em]">Operational Merit Tracking • Objective Alignment</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setShowCreate(true)}
                            disabled={submitting}
                            className="bg-[#D9F99D] text-slate-900 hover:bg-[#c8ea8a] font-black uppercase text-[9px] md:text-[10px] tracking-widest px-8 h-12 md:h-14 rounded-xl md:rounded-2xl shadow-xl transition-all flex-1 md:flex-none"
                        >
                            Define New Goal <Target className="h-5 w-5 ml-3" />
                        </Button>
                    </div>
                </div>

                {/* Performance Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {[
                        { label: 'Strategic Alignment', value: `${avgProgress}%`, icon: Target, bg: 'bg-[#D1FAE5]', color: 'text-emerald-600' },
                        { label: 'Active Objectives', value: `${activeCount}`, icon: Star, bg: 'bg-[#FEF3C7]', color: 'text-amber-600' },
                        { label: 'Completed Goals', value: `${completedCount}`, icon: Rocket, bg: 'bg-[#E0E7FF]', color: 'text-blue-600' },
                    ].map((m, i) => (
                        <Card key={i} className={`${m.bg} border-none rounded-[2rem] md:rounded-3xl shadow-sm relative overflow-hidden h-40 md:h-45 group`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 md:px-8 pt-6 md:pt-8">
                                <CardTitle className="text-[10px] md:text-[11px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-wide">
                                    <m.icon className="h-4 w-4" /> {m.label}
                                </CardTitle>
                                <ArrowUpRight className="h-4 w-4 text-slate-900/20 group-hover:text-slate-900 transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl md:text-5xl font-bold text-slate-900 absolute bottom-4 right-6">{m.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    <Card className="xl:col-span-8 border-none shadow-sm rounded-[3.5rem] bg-white overflow-hidden p-2">
                        <CardHeader className="p-10 border-none">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-slate-900 italic underline underline-offset-4 decoration-[#EDE9FE]">Objective Tracking</h3>
                                <Badge className="bg-[#EDE9FE] text-purple-600 border-none font-black text-[9px] tracking-[0.2em] px-4 py-1.5 rounded-xl uppercase">Cycle Q1 2026</Badge>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Active operational goals and key results</p>
                        </CardHeader>
                        <CardContent className="p-0 border-t border-slate-50">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                                </div>
                            ) : objectives.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No objectives defined yet</p>
                                    <Button onClick={() => setShowCreate(true)} className="mt-4 bg-[#D9F99D] text-slate-900 font-black uppercase text-[9px] tracking-widest h-10 px-6 rounded-xl">
                                        <Plus className="h-4 w-4 mr-2" /> Define First Goal
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {objectives.map((goal) => (
                                        <div key={goal.id} className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-slate-50 transition-colors group">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                                        <AvatarFallback className="bg-slate-100 text-[10px] font-bold">ME</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 italic tracking-tight">{goal.title}</h4>
                                                        {goal.description && (
                                                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{goal.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                        <div className="flex items-center gap-3">
                                                            <span>Progress Status</span>
                                                            <Badge className={`${STATUS_BADGE[goal.color] || "bg-slate-50 text-slate-400"} border-none font-black text-[7px] uppercase tracking-widest px-2 h-4 rounded-md`}>
                                                                {STATUS_LABELS[goal.status] || capitalize(goal.status)}
                                                            </Badge>
                                                        </div>
                                                        <span>{goal.progress}% Protocol Complete</span>
                                                    </div>
                                                    <Progress value={goal.progress} className="h-2 bg-slate-50" />
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => openUpdateDialog(goal)}
                                                variant="ghost"
                                                className="h-14 px-6 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-[#D9F99D] mix-blend-difference hover:bg-slate-900 hover:text-white transition-all transform scale-0 group-hover:scale-100"
                                            >
                                                Update Progress
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="xl:col-span-4 space-y-8">
                        <Card className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group min-h-[350px] border-4 border-[#F8F9FA] shadow-xl">
                            <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity" />
                            <div className="relative z-10 space-y-8">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Award className="h-8 w-8 text-[#D9F99D]" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black italic tracking-tighter leading-tight">Merit Recognition Wall</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">Public recognition for personnel surpassing operational targets.</p>
                                </div>
                                <div className="flex -space-x-3">
                                    {reviews.length > 0 ? (
                                        <>
                                            {reviews.slice(0, 4).map((r, n) => (
                                                <Avatar key={n} className="h-10 w-10 border-4 border-slate-900">
                                                    <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-400">
                                                        {r.reviewed_by_name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "P"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                            {reviews.length > 4 && (
                                                <div className="h-10 w-10 rounded-full bg-[#D9F99D] flex items-center justify-center text-slate-900 text-xs font-black">+{reviews.length - 4}</div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {[1, 2, 3, 4].map((n) => (
                                                <Avatar key={n} className="h-10 w-10 border-4 border-slate-900">
                                                    <AvatarFallback className="bg-slate-800 text-[10px] font-bold text-slate-400">P{n}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                            <div className="h-10 w-10 rounded-full bg-[#D9F99D] flex items-center justify-center text-slate-900 text-xs font-black">+12</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 italic mb-8 flex items-center gap-3"><Flag className="h-6 w-6 text-indigo-400" /> Appraisal Status</h3>
                            {reviews.length === 0 ? (
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center py-8">No reviews yet</p>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((r, i) => {
                                        const ratingColor = RATING_COLORS[r.rating] || "slate";
                                        return (
                                            <div key={r.id || i} className="flex justify-between items-center group">
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors italic">{r.review_period}</span>
                                                <Badge className={`${STATUS_BADGE[ratingColor] || "bg-slate-50 text-slate-400"} border-none font-black text-[8px] uppercase tracking-widest px-3 h-5 rounded-lg transition-all group-hover:px-4`}>
                                                    {RATING_LABELS[r.rating] || capitalize(r.rating)}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <Button className="w-full mt-10 bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl hover:bg-slate-100">
                                Download Summary
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Create Goal Dialog */}
                <Dialog open={showCreate} onOpenChange={setShowCreate}>
                    <DialogContent className="sm:max-w-[480px] border-none shadow-2xl rounded-[2.5rem] p-8 overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold italic">Define New Goal</DialogTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create a new performance objective</CardDescription>
                        </DialogHeader>
                        <div className="space-y-5 mt-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                                <Input
                                    value={createForm.title}
                                    onChange={(e) => setCreateForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="Enter objective title"
                                    className="h-10 rounded-xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                                <Input
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Brief description (optional)"
                                    className="h-10 rounded-xl border-slate-200"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                                    <select
                                        value={createForm.category}
                                        onChange={(e) => setCreateForm(p => ({ ...p, category: e.target.value }))}
                                        className="w-full h-10 bg-white border border-slate-200 rounded-xl text-xs font-bold px-3"
                                    >
                                        <option value="delivery">Delivery</option>
                                        <option value="quality">Quality</option>
                                        <option value="learning">Learning</option>
                                        <option value="leadership">Leadership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Weight (0-10)</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={10}
                                        value={createForm.weight}
                                        onChange={(e) => setCreateForm(p => ({ ...p, weight: Number(e.target.value) }))}
                                        className="h-10 rounded-xl border-slate-200"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Date</label>
                                <Input
                                    type="date"
                                    value={createForm.target_date}
                                    onChange={(e) => setCreateForm(p => ({ ...p, target_date: e.target.value }))}
                                    className="h-10 rounded-xl border-slate-200"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-3 pt-4">
                            <Button onClick={() => setShowCreate(false)} variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={submitting || !createForm.title.trim()}
                                className="h-10 px-6 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Save Goal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Update Progress Dialog */}
                <Dialog open={showUpdate} onOpenChange={setShowUpdate}>
                    <DialogContent className="sm:max-w-[400px] border-none shadow-2xl rounded-[2.5rem] p-8 overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold italic">Update Progress</DialogTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adjust progress and status</CardDescription>
                        </DialogHeader>
                        <div className="space-y-5 mt-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Progress ({updateForm.progress}%)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={updateForm.progress}
                                        onChange={(e) => setUpdateForm(p => ({ ...p, progress: Number(e.target.value) }))}
                                        className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                    />
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={updateForm.progress}
                                        onChange={(e) => setUpdateForm(p => ({ ...p, progress: Number(e.target.value) }))}
                                        className="w-16 h-9 rounded-lg border-slate-200 text-center text-xs font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                                <select
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm(p => ({ ...p, status: e.target.value }))}
                                    className="w-full h-10 bg-white border border-slate-200 rounded-xl text-xs font-bold px-3"
                                >
                                    <option value="not_started">Planning / Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="gap-3 pt-4">
                            <Button onClick={() => setShowUpdate(false)} variant="ghost" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                disabled={submitting}
                                className="h-10 px-6 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Save Progress
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </ProtectedRoute>
    );
}
