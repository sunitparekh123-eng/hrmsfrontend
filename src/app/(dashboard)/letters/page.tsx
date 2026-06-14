"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileType, FileText, Download, Eye,
  CheckCircle2, Search, Clock, FileSignature, ArrowUpRight, Mail,
  Loader2, AlertCircle, Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Variant1, Variant2, Variant3, Variant4, Variant5 } from "./templateDesigns";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiGet, apiPost } from "@/lib/api-client";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

type Template = {
  id: string;
  name: string;
  category: string;
  status: string;
  lastUpdated: string;
  type: string;
};

const TEMPLATES: Template[] = [
  { id: "TMP001", name: "Offer Letter",           category: "Onboarding",   status: "Active", lastUpdated: "Feb 12, 2026", type: "offer" },
  { id: "TMP002", name: "Appointment Letter",      category: "Onboarding",   status: "Active", lastUpdated: "Jan 05, 2026", type: "appointment" },
  { id: "TMP003", name: "Warning Letter",          category: "Disciplinary", status: "Active", lastUpdated: "Dec 12, 2025", type: "offer" },
  { id: "TMP004", name: "Non-performance Letter",  category: "Disciplinary", status: "Active", lastUpdated: "Feb 14, 2026", type: "offer" },
  { id: "TMP005", name: "Absenteeism Letter",      category: "Disciplinary", status: "Active", lastUpdated: "Feb 15, 2026", type: "offer" },
];

const variantMeta = [
  { id: 1, label: "Standard Corporate",  desc: "Navy bar · Serif · Two-col header"    },
  { id: 2, label: "Modern Minimalist",   desc: "Centered logo · Light gray · Sans"    },
  { id: 3, label: "Premium Executive",   desc: "Dark navy bleed · Accent title band"  },
  { id: 4, label: "Creative Edge",       desc: "Bold side bar · Big type treatment"   },
  { id: 5, label: "Classic Formal",      desc: "Double-border frame · Old-world look" },
];

const VariantMap: Record<number, React.FC<{ templateId: string }>> = {
  1: Variant1, 2: Variant2, 3: Variant3, 4: Variant4, 5: Variant5,
};

const TYPE_LABEL_MAP: Record<string, string> = {
  offer: "Offer Letter",
  appointment: "Appointment Letter",
  promotion: "Promotion Letter",
  transfer: "Transfer Letter",
  resignation: "Resignation Letter",
  experience: "Experience Letter",
  relieving: "Relieving Letter",
};

type EmployeeOption = {
  id: number;
  name: string;
  emp_code: string;
  department?: string;
};

export default function LettersPage() {
  const [searchTerm,       setSearchTerm]       = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedVariant,  setSelectedVariant]  = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [emailEnabled,     setEmailEnabled]     = useState(true);

  // API state
  const [loading,         setLoading]         = useState(true);
  const [employees,       setEmployees]       = useState<EmployeeOption[]>([]);
  const [letters,         setLetters]         = useState<any[]>([]);
  const [issuing,         setIssuing]         = useState(false);
  const [issueError,      setIssueError]      = useState("");
  const [issueSuccess,    setIssueSuccess]    = useState("");

  const fetchLetters = useCallback(async () => {
    try {
      const data = await apiGet<any>("/letters");
      const rows = data.data || data.rows || data || [];
      setLetters(rows);
    } catch {
      // Letters fetch is non-critical for the template gallery
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await apiGet<any>("/employees", { limit: "200" });
      const rows = data.data || data.rows || data || [];
      setEmployees(rows.map((e: any) => ({
        id: e.id,
        name: e.name,
        emp_code: e.emp_code,
        department: e.department,
      })));
    } catch {
      // Non-critical
    }
  }, []);

  useEffect(() => {
    fetchLetters();
    fetchEmployees();
  }, [fetchLetters, fetchEmployees]);

  const filtered = TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PreviewComponent = selectedTemplate ? VariantMap[selectedVariant] : null;

  const issuedCount = letters.filter((l: any) => l.status === "issued" || l.status === "acknowledged").length;
  const ackCount = letters.filter((l: any) => l.status === "acknowledged").length;
  const compliancePct = letters.length > 0 ? Math.round((ackCount / Math.max(issuedCount, 1)) * 100) : 100;

  const handleIssue = async (format: "pdf" | "docx") => {
    if (!selectedEmployee || !selectedTemplate) {
      setIssueError("Please select an employee.");
      return;
    }
    setIssuing(true);
    setIssueError("");
    setIssueSuccess("");

    try {
      const employeeId = parseInt(selectedEmployee, 10);
      await apiPost("/letters/issue", {
        employee_id: employeeId,
        type: selectedTemplate.type,
        title: selectedTemplate.name,
        content: `Generated ${format.toUpperCase()} from template ${selectedTemplate.id} – ${selectedTemplate.name}`,
      });
      setIssueSuccess(`Letter issued successfully as ${format.toUpperCase()}.`);
      await fetchLetters();
    } catch (err: any) {
      setIssueError(err?.message || "Failed to issue letter.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <ProtectedRoute module="LETTERS" action="READ">
    <div className="space-y-10 pb-20">

      {/* ── Page Header ── */}
      <div className="px-2">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-3 italic uppercase tracking-tighter underline underline-offset-4 decoration-[#D9F99D] decoration-2">
          <FileType className="h-6 w-6 text-rose-500" /> Letters & Docs
        </h1>
        <p className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">
          Create and manage official letters and documents.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Active Templates",  value: `${TEMPLATES.length} Templates`,  icon: FileSignature, bg: "bg-white"     },
          { label: "Letters Issued",    value: `${issuedCount} Letters`,           icon: Send,          bg: "bg-white"     },
          { label: "Compliance",        value: `${compliancePct}% Acknowledged`,   icon: CheckCircle2,  bg: "bg-[#D9F99D]" },
        ].map((stat, i) => (
          <Card key={i} className={`${stat.bg} border-none rounded-2xl p-6 shadow-sm flex flex-col justify-between h-36 group hover:shadow-md transition-all`}>
            <div className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#D9F99D]/20 transition-colors">
              <stat.icon className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Template Grid ── */}
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden p-1">
        <CardHeader className="p-6 pb-3 border-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-lg font-black italic text-slate-900 underline underline-offset-4 decoration-[#D9F99D] decoration-2 uppercase tracking-tighter">
                Template List
              </CardTitle>
              <CardDescription className="text-[8px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] italic">
                All official document templates
              </CardDescription>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
              <Input
                placeholder="Search templates..."
                className="h-10 w-64 pl-12 bg-slate-50 border-none rounded-xl font-bold text-[10px] focus-visible:ring-1 focus-visible:ring-[#D9F99D] shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((template) => (
                <Card key={template.id} className="border-2 border-slate-50 rounded-2xl p-5 hover:border-[#D9F99D] hover:bg-slate-50/50 transition-all group relative overflow-hidden">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-3">
                      <Badge className={cn(
                        "border-none font-black text-[7px] uppercase tracking-widest px-2.5 h-4.5 rounded-md",
                        template.status === "Active" ? "bg-[#D1FAE5] text-emerald-600" : "bg-[#FEF3C7] text-amber-600"
                      )}>
                        {template.status}
                      </Badge>
                      <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase">{template.category}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">ID</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase">{template.id}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost" size="icon"
                      className="h-9 w-9 rounded-lg bg-white border-2 border-slate-50 hover:bg-[#D9F99D] hover:border-[#D9F99D] transition-all"
                      onClick={() => { setSelectedTemplate(template); setSelectedVariant(1); setIssueError(""); setIssueSuccess(""); }}
                    >
                      <Eye className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                  <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                    <FileText className="h-24 w-24" />
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-3 relative z-10">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic flex items-center gap-2">
                      <Clock className="h-2.5 w-2.5" /> Last Updated: {template.lastUpdated}
                    </p>
                    <Button
                      onClick={() => { setSelectedTemplate(template); setSelectedVariant(1); setIssueError(""); setIssueSuccess(""); }}
                      variant="link"
                      className="text-rose-500 font-black uppercase text-[8px] tracking-widest p-0 h-auto"
                    >
                      Generate <ArrowUpRight className="h-2.5 w-2.5 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Generate Dialog ── */}
      <Dialog open={!!selectedTemplate} onOpenChange={(val) => !val && setSelectedTemplate(null)}>
        <DialogContent
          className="rounded-2xl p-0 overflow-hidden border-none shadow-2xl [&>button]:text-white [&>button]:top-5 [&>button]:right-5 [&>button]:z-50 [&>button]:bg-white/10 [&>button]:rounded-full [&>button]:p-1"
          style={{ width: '98vw', maxWidth: 1600, height: '95vh' }}
        >
          {/* Hidden title for screen-reader accessibility (Radix requirement) */}
          <DialogTitle className="sr-only">
            {selectedTemplate?.name ?? "Document Generator"}
          </DialogTitle>
          <div className="flex h-full w-full overflow-hidden">

            {/* ── A4 Preview ── */}
            <div className="flex-1 min-w-0 bg-slate-300 overflow-auto flex items-start justify-center p-8">
              <div className="shrink-0 shadow-2xl" style={{ width: 794 }}>
                {PreviewComponent && selectedTemplate && (
                  <PreviewComponent templateId={selectedTemplate.id} />
                )}
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div style={{ width: 320, minWidth: 320, background: '#0f172a', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Title */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.5px', color: '#d9f99d', margin: 0 }}>
                    {selectedTemplate?.name}
                  </h3>
                  <p style={{ fontSize: 8, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>
                    {selectedTemplate?.id} · {selectedTemplate?.category}
                  </p>
                </div>

                {/* Variant Picker */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 7, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>Design Variant</p>
                  {variantMeta.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      style={{
                        width: '100%', textAlign: 'left', borderRadius: 12, padding: '10px 12px',
                        border: selectedVariant === v.id ? '1px solid #d9f99d' : '1px solid rgba(255,255,255,0.1)',
                        background: selectedVariant === v.id ? 'rgba(217,249,157,0.1)' : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: selectedVariant === v.id ? '#d9f99d' : '#e2e8f0' }}>{v.label}</div>
                      <div style={{ fontSize: 8, fontWeight: 600, color: selectedVariant === v.id ? '#a3e635' : '#94a3b8', marginTop: 2 }}>{v.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Employee */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 7, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>Select Employee</p>
                  <select
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, height: 40, padding: '0 12px', fontSize: 10, fontWeight: 700, color: '#e2e8f0', outline: 'none' }}
                    value={selectedEmployee}
                    onChange={(e) => { setSelectedEmployee(e.target.value); setIssueError(""); setIssueSuccess(""); }}
                  >
                    <option value="" style={{ background: '#1e293b', color: '#64748b' }}>Select an employee…</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id} style={{ background: '#1e293b', color: '#e2e8f0' }}>
                        {emp.name} ({emp.emp_code}){emp.department ? ` – ${emp.department}` : ""}
                      </option>
                    ))}
                  </select>
                  {employees.length === 0 && !loading && (
                    <p style={{ fontSize: 7, fontWeight: 600, color: '#64748b', margin: 0 }}>No employees loaded</p>
                  )}
                </div>

                {/* Dynamic Fields */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 7, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>Dynamic Fields</p>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {["[Employee_Name]","[Job_Title]","[Date]","[Department]","[Office_Location]"].map(f => (
                      <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8' }}>{f}</span>
                        <span style={{ fontSize: 7, fontWeight: 900, color: '#d9f99d', textTransform: 'uppercase' }}>Auto</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 7, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>Output Format</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <button style={{ background: '#d9f99d', color: '#0f172a', fontWeight: 900, fontSize: 8, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>PDF</button>
                    <button style={{ background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontWeight: 900, fontSize: 8, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>DOCX</button>
                  </div>
                </div>

                {/* Email toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    style={{ accentColor: '#d9f99d', width: 12, height: 12 }}
                  />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>Enable Email Auto-Send</span>
                </div>

                {/* Status Messages */}
                {issueError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', borderRadius: 8, padding: '8px 12px' }}>
                    <AlertCircle style={{ width: 12, height: 12, color: '#fca5a5', flexShrink: 0 }} />
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#fca5a5' }}>{issueError}</span>
                  </div>
                )}
                {issueSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', borderRadius: 8, padding: '8px 12px' }}>
                    <CheckCircle2 style={{ width: 12, height: 12, color: '#86efac', flexShrink: 0 }} />
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#86efac' }}>{issueSuccess}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  disabled={issuing || !selectedEmployee}
                  onClick={() => handleIssue("pdf")}
                  style={{
                    width: '100%', background: '#d9f99d', color: '#0f172a', fontWeight: 900, fontSize: 9, height: 44,
                    borderRadius: 12, border: 'none', cursor: issuing || !selectedEmployee ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: issuing || !selectedEmployee ? 0.5 : 1,
                  }}
                >
                  {issuing ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Issuing…</>
                  ) : (
                    <><Mail style={{ width: 14, height: 14 }} /> Email & Download</>
                  )}
                </button>
                <button
                  disabled={issuing || !selectedEmployee}
                  onClick={() => handleIssue("docx")}
                  style={{
                    width: '100%', background: 'transparent', color: '#e2e8f0', fontWeight: 900, fontSize: 9, height: 44,
                    borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', cursor: issuing || !selectedEmployee ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: issuing || !selectedEmployee ? 0.5 : 1,
                  }}
                >
                  <Download style={{ width: 14, height: 14 }} /> Download Only
                </button>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
}
