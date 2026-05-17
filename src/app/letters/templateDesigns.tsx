"use client";
import React from "react";

/* ─────────────────────────────────────────────
   SHARED CONTENT BLOCKS (per template id)
───────────────────────────────────────────── */
export const getLetterBody = (templateId: string) => {
  switch (templateId) {
    case "TMP001":
      return {
        title: "JOB OFFER LETTER",
        accentColor: "#16a34a",
        body: (
          <>
            <p>Dear <strong>[Employee_Name]</strong>,</p>
            <p style={{ marginTop: 12 }}>
              We are delighted to extend this formal offer of employment for the position of{" "}
              <strong>[Job_Title]</strong> at <strong>Triptay Logistics</strong>, effective{" "}
              <strong>[Start_Date]</strong>.
            </p>
            <p style={{ marginTop: 12 }}>
              After careful evaluation, we believe your expertise aligns perfectly with our vision.
              Please review the compensation details below and revert with your acceptance by{" "}
              <strong>[Acceptance_Deadline]</strong>.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Component</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e2e8f0" }}>Monthly (₹)</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e2e8f0" }}>Annual (₹)</th>
                </tr>
              </thead>
              <tbody>
                {[["Basic Salary","24,000","2,88,000"],["HRA","12,000","1,44,000"],["Special Allowance","4,000","48,000"]].map(([c,m,a])=>(
                  <tr key={c}>
                    <td style={{ padding:"7px 12px", border:"1px solid #e2e8f0" }}>{c}</td>
                    <td style={{ padding:"7px 12px", border:"1px solid #e2e8f0", textAlign:"right" }}>{m}</td>
                    <td style={{ padding:"7px 12px", border:"1px solid #e2e8f0", textAlign:"right" }}>{a}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700, background: "#f0fdf4" }}>
                  <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0" }}>Total CTC</td>
                  <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"right", color:"#16a34a" }}>40,000</td>
                  <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"right", color:"#16a34a" }}>4,80,000</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 16 }}>
              This offer is contingent upon successful verification of your credentials and satisfactory background check.
            </p>
            <p style={{ marginTop: 12 }}>We look forward to welcoming you aboard!</p>
          </>
        ),
      };
    case "TMP002":
      return {
        title: "APPOINTMENT LETTER",
        accentColor: "#2563eb",
        body: (
          <>
            <p>Dear <strong>[Employee_Name]</strong>,</p>
            <p style={{ marginTop: 12 }}>
              Further to your acceptance of our offer, we are pleased to formally appoint you as{" "}
              <strong>[Job_Title]</strong> at Triptay Logistics, with effect from{" "}
              <strong>[Date_of_Joining]</strong>, at our <strong>[Office_Location]</strong> office.
            </p>
            <p style={{ marginTop: 12 }}>
              You will be on a probationary period of <strong>6 months</strong>, during which your
              performance will be evaluated. Your employment is subject to the terms and conditions
              set out in the HR Policy Manual.
            </p>
            <p style={{ marginTop: 12 }}>
              Your reporting manager will be <strong>[Manager_Name]</strong>, and your working hours
              shall be <strong>09:00 AM – 06:00 PM, Monday to Saturday</strong>.
            </p>
            <p style={{ marginTop: 12 }}>
              Please report to the HR department on your joining date with all original documents for
              verification. We are excited to have you join our growing team!
            </p>
          </>
        ),
      };
    case "TMP003":
      return {
        title: "WARNING LETTER",
        accentColor: "#dc2626",
        body: (
          <>
            <p>Dear <strong>[Employee_Name]</strong>,</p>
            <p style={{ marginTop: 12 }}>
              This letter serves as an <strong>official written warning</strong> regarding your
              conduct on <strong>[Incident_Date]</strong>. It has been reported that you have{" "}
              <strong>[Description_of_Misconduct]</strong>, which is a direct violation of company
              policy under Section <strong>[Policy_Number]</strong> of our Employee Code of Conduct.
            </p>
            <p style={{ marginTop: 12 }}>
              Triptay Logistics maintains a zero-tolerance policy toward behaviour that disrupts
              workplace harmony or operational standards. Your conduct is unacceptable and cannot be
              overlooked.
            </p>
            <p style={{ marginTop: 12 }}>
              You are hereby directed to demonstrate immediate and sustained improvement. Should
              similar misconduct recur, the company reserves the right to take <strong>further
              disciplinary action, including suspension or termination</strong> of your employment.
            </p>
            <p style={{ marginTop: 12 }}>
              A copy of this warning letter shall be placed in your official personnel file.
            </p>
          </>
        ),
      };
    case "TMP004":
      return {
        title: "NOTICE OF NON-PERFORMANCE",
        accentColor: "#d97706",
        body: (
          <>
            <p>Dear <strong>[Employee_Name]</strong>,</p>
            <p style={{ marginTop: 12 }}>
              This letter is to formally notify you that your performance as{" "}
              <strong>[Job_Title]</strong> has consistently fallen below the standards expected by
              Triptay Logistics during the review period ending <strong>[Review_Period_End]</strong>.
            </p>
            <p style={{ marginTop: 12 }}>
              Key Performance Indicators (KPIs) where your performance has been found lacking:
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 24, fontSize: 11, lineHeight: 1.8 }}>
              <li>Target vs. Achievement: <strong>[KPI_1_Detail]</strong></li>
              <li>Quality of Deliverables: <strong>[KPI_2_Detail]</strong></li>
              <li>Attendance & Punctuality: <strong>[KPI_3_Detail]</strong></li>
            </ul>
            <p style={{ marginTop: 12 }}>
              You are hereby placed on a <strong>30-Day Performance Improvement Plan (PIP)</strong>{" "}
              effective <strong>[PIP_Start_Date]</strong>. Your manager will schedule a meeting to
              define clear, measurable deliverables for this period.
            </p>
            <p style={{ marginTop: 12 }}>
              Failure to demonstrate adequate improvement by <strong>[PIP_End_Date]</strong> may
              result in termination of your employment.
            </p>
          </>
        ),
      };
    case "TMP005":
      return {
        title: "NOTICE CONCERNING ABSENTEEISM",
        accentColor: "#7c3aed",
        body: (
          <>
            <p>Dear <strong>[Employee_Name]</strong>,</p>
            <p style={{ marginTop: 12 }}>
              This letter formally addresses your <strong>unauthorized and unexplained absences</strong>{" "}
              from duty. As per our records, you have been absent on the following dates without
              prior approval or valid notification:
            </p>
            <div style={{ background: "#fdf4ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "12px 16px", marginTop: 12, fontSize: 11 }}>
              <strong>[Absence_Dates_List]</strong>
            </div>
            <p style={{ marginTop: 12 }}>
              Unplanned absenteeism severely disrupts team workflow and operational efficiency at
              Triptay Logistics. As per our attendance policy, <strong>[Policy_Reference]</strong>,
              employees are required to notify their manager and HR at least 1 hour before their
              shift in case of unavoidable absence.
            </p>
            <p style={{ marginTop: 12 }}>
              You are required to submit a written explanation within <strong>48 hours</strong> of
              receiving this notice. Failure to do so, or continuation of such behaviour, will be
              treated as <strong>absconding from duty</strong>, leading to termination of service.
            </p>
          </>
        ),
      };
    default:
      return { title: "", accentColor: "#1e293b", body: null };
  }
};

/* ─────────────────────────────────────────────
   VARIANT 1 – Standard Corporate
   (navy top bar, two-col header, serif body)
───────────────────────────────────────────── */
export const Variant1: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { title, accentColor, body } = getLetterBody(templateId);
  return (
    <div style={{ fontFamily:"'Times New Roman', Times, serif", color:"#1e293b", width:794, minHeight:1123, padding:0, background:"#fff", position:"relative", boxSizing:"border-box" }}>
      {/* Navy top bar */}
      <div style={{ background:"#0f172a", height:14, width:"100%" }} />
      <div style={{ padding:"40px 60px 60px" }}>
        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:"2px solid #0f172a", paddingBottom:20, marginBottom:32 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-0.5px", textTransform:"uppercase", color:"#0f172a" }}>TRIPTAY LOGISTICS</div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"3px", textTransform:"uppercase", color:"#64748b", marginTop:4 }}>Human Resources Department</div>
          </div>
          <div style={{ textAlign:"right", fontSize:10, fontWeight:600, color:"#475569", lineHeight:1.8 }}>
            <div>Ref: TL/HR/2026/{templateId}</div>
            <div>Date: [Date]</div>
            <div>Page: 1 of 1</div>
          </div>
        </div>
        {/* Letter title */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <span style={{ fontSize:15, fontWeight:900, textTransform:"uppercase", letterSpacing:"2px", color: accentColor, textDecoration:"underline", textUnderlineOffset:4 }}>{title}</span>
        </div>
        {/* Recipient */}
        <div style={{ fontSize:11, lineHeight:1.9, marginBottom:20 }}>
          <div><strong>To,</strong></div>
          <div>[Employee_Name]</div>
          <div>[Designation], [Department]</div>
          <div>Triptay Logistics – [Office_Location]</div>
        </div>
        {/* Body */}
        <div style={{ fontSize:11, lineHeight:1.9 }}>{body}</div>
        {/* Signature */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:60, paddingTop:40, borderTop:"1px solid #e2e8f0" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:120, borderTop:"2px solid #0f172a", marginBottom:6 }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Authorised Signatory</div>
            <div style={{ fontSize:9, color:"#64748b" }}>HR Manager</div>
          </div>
          <div style={{ textAlign:"center", opacity:0.3 }}>
            <div style={{ width:120, borderTop:"2px solid #0f172a", marginBottom:6 }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Employee Signature</div>
            <div style={{ fontSize:9, color:"#64748b" }}>[Employee_Name]</div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ position:"absolute", bottom:20, left:60, right:60, fontSize:8, color:"#94a3b8", textAlign:"center", borderTop:"1px solid #f1f5f9", paddingTop:10 }}>
          Triptay Logistics Pvt. Ltd. | Indore Hub, MP | hr@triptay.com | +91-XXXXX XXXXX
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VARIANT 2 – Modern Minimalist
   (centered logo, light gray, sans-serif)
───────────────────────────────────────────── */
export const Variant2: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { title, accentColor, body } = getLetterBody(templateId);
  return (
    <div style={{ fontFamily:"'Helvetica Neue', Arial, sans-serif", color:"#334155", width:794, minHeight:1123, background:"#FAFAFA", boxSizing:"border-box", position:"relative" }}>
      {/* Top accent strip */}
      <div style={{ height:6, background: accentColor, width:"100%" }} />
      <div style={{ padding:"48px 64px 80px" }}>
        {/* Centered header */}
        <div style={{ textAlign:"center", borderBottom:"1px solid #e2e8f0", paddingBottom:32, marginBottom:36 }}>
          <div style={{ fontSize:28, fontWeight:300, letterSpacing:"8px", textTransform:"uppercase", color:"#1e293b" }}>TRIPTAY</div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"4px", textTransform:"uppercase", color:"#94a3b8", marginTop:4 }}>LOGISTICS · HUMAN RESOURCES</div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:20, fontSize:9, color:"#64748b", fontWeight:600 }}>
            <span>Ref: TL/HR/2026/{templateId}</span>
            <span>Date: [Date]</span>
          </div>
        </div>
        {/* Title pill */}
        <div style={{ display:"inline-block", background:"#f1f5f9", borderRadius:4, padding:"4px 14px", fontSize:10, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", color: accentColor, marginBottom:24 }}>
          {title}
        </div>
        {/* Recipient block */}
        <div style={{ fontSize:11, lineHeight:1.8, marginBottom:24, color:"#475569" }}>
          <div>To,</div>
          <div style={{ fontWeight:700, color:"#1e293b" }}>[Employee_Name]</div>
          <div>[Designation] · [Department]</div>
          <div>Triptay Logistics, [Office_Location]</div>
        </div>
        <div style={{ fontSize:11, lineHeight:1.9 }}>{body}</div>
        {/* Signature */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:56 }}>
          <div>
            <div style={{ width:110, borderBottom:"1px solid #1e293b", marginBottom:6 }} />
            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:"#1e293b" }}>Authorised Signatory</div>
            <div style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>For Triptay Logistics</div>
          </div>
          <div style={{ opacity:0.25 }}>
            <div style={{ width:110, borderBottom:"1px solid #1e293b", marginBottom:6 }} />
            <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px" }}>Employee Signature</div>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:24, left:64, right:64, textAlign:"center", fontSize:8, color:"#cbd5e1" }}>
          TRIPTAY LOGISTICS PVT. LTD. · INDORE HUB · HR@TRIPTAY.COM
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VARIANT 3 – Premium Executive
   (dark navy full-bleed header, white text)
───────────────────────────────────────────── */
export const Variant3: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { title, accentColor, body } = getLetterBody(templateId);
  return (
    <div style={{ fontFamily:"Georgia, 'Times New Roman', serif", color:"#1e293b", width:794, minHeight:1123, background:"#fff", boxSizing:"border-box", position:"relative" }}>
      {/* Full bleed dark header */}
      <div style={{ background:"#0f172a", padding:"40px 60px 36px", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:"-0.5px", textTransform:"uppercase" }}>TRIPTAY LOGISTICS</div>
            <div style={{ fontSize:9, fontWeight:700, color: accentColor, letterSpacing:"4px", textTransform:"uppercase", marginTop:6 }}>Human Resources · Premium Division</div>
          </div>
          <div style={{ textAlign:"right", fontSize:10, color:"#94a3b8", lineHeight:1.8 }}>
            <div style={{ color:"#fff", fontWeight:700 }}>Ref: TL/HR/2026/{templateId}</div>
            <div>Date: [Date]</div>
          </div>
        </div>
        {/* Title band */}
        <div style={{ marginTop:28, background: accentColor, display:"inline-block", padding:"6px 20px", borderRadius:2 }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:"3px", textTransform:"uppercase", color:"#fff" }}>{title}</span>
        </div>
      </div>
      <div style={{ padding:"40px 60px 80px" }}>
        {/* Recipient */}
        <div style={{ fontSize:11, lineHeight:1.9, marginBottom:24, borderLeft:`3px solid ${accentColor}`, paddingLeft:16 }}>
          <div>To,</div>
          <div style={{ fontWeight:700 }}>[Employee_Name]</div>
          <div>[Designation], [Department]</div>
          <div>Triptay Logistics – [Office_Location]</div>
        </div>
        <div style={{ fontSize:11, lineHeight:1.9 }}>{body}</div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:60 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:130, borderTop:`2px solid ${accentColor}`, marginBottom:8 }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px", color: accentColor }}>Authorised Signatory</div>
          </div>
          <div style={{ textAlign:"center", opacity:0.2 }}>
            <div style={{ width:130, borderTop:"2px solid #1e293b", marginBottom:8 }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Employee Signature</div>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#0f172a", padding:"10px 60px", fontSize:8, color:"#475569", display:"flex", justifyContent:"space-between" }}>
        <span style={{ color:"#64748b" }}>Triptay Logistics Pvt. Ltd.</span>
        <span style={{ color:"#64748b" }}>hr@triptay.com · +91-XXXXX XXXXX</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VARIANT 4 – Creative Edge
   (thick left accent bar, bold title treatment)
───────────────────────────────────────────── */
export const Variant4: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { title, accentColor, body } = getLetterBody(templateId);
  return (
    <div style={{ fontFamily:"'Arial', sans-serif", color:"#1e293b", width:794, minHeight:1123, background:"#fff", boxSizing:"border-box", borderLeft:`20px solid ${accentColor}`, position:"relative" }}>
      <div style={{ padding:"48px 56px 80px" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:"5px", textTransform:"uppercase", color:"#94a3b8" }}>TRIPTAY LOGISTICS</div>
            <div style={{ fontSize:36, fontWeight:900, letterSpacing:"-2px", textTransform:"uppercase", color:"#0f172a", lineHeight:1, marginTop:6 }}>{title.split(" ").slice(0,2).join(" ")}</div>
            <div style={{ fontSize:36, fontWeight:900, letterSpacing:"-2px", textTransform:"uppercase", color: accentColor, lineHeight:1 }}>{title.split(" ").slice(2).join(" ")}</div>
          </div>
          <div style={{ textAlign:"right", fontSize:9, color:"#64748b", lineHeight:1.9, marginTop:4 }}>
            <div style={{ fontWeight:700 }}>TL/HR/2026/{templateId}</div>
            <div>[Date]</div>
          </div>
        </div>
        <div style={{ height:3, background: accentColor, margin:"20px 0 32px", borderRadius:2 }} />
        {/* Recipient */}
        <div style={{ fontSize:11, lineHeight:1.8, marginBottom:24 }}>
          <div style={{ fontWeight:700, fontSize:12 }}>[Employee_Name]</div>
          <div style={{ color:"#64748b" }}>[Designation] · [Department]</div>
          <div style={{ color:"#64748b" }}>Triptay Logistics, [Office_Location]</div>
        </div>
        <div style={{ fontSize:11, lineHeight:1.9 }}>{body}</div>
        {/* Signature */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:60 }}>
          <div>
            <div style={{ width:120, borderBottom:`3px solid ${accentColor}`, marginBottom:8 }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px", color: accentColor }}>Authorised Signatory</div>
          </div>
          <div style={{ opacity:0.2 }}>
            <div style={{ width:120, borderBottom:"3px solid #1e293b", marginBottom:8 }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Employee Signature</div>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:20, left:56, right:56, fontSize:8, color:"#cbd5e1", textAlign:"center" }}>
          TRIPTAY LOGISTICS PVT. LTD. · INDORE HUB · HR@TRIPTAY.COM
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VARIANT 5 – Classic Formal
   (double-border frame, old-world letterhead)
───────────────────────────────────────────── */
export const Variant5: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { title, accentColor, body } = getLetterBody(templateId);
  return (
    <div style={{ fontFamily:"'Times New Roman', Times, serif", color:"#1e293b", width:794, minHeight:1123, background:"#fffdf7", boxSizing:"border-box", position:"relative", border:"6px double #1e293b", padding:"16px" }}>
      <div style={{ border:"1px solid #1e293b", minHeight:"calc(1123px - 44px)", padding:"40px 52px 80px", position:"relative" }}>
        {/* Ornamental header */}
        <div style={{ textAlign:"center", borderBottom:"3px double #1e293b", paddingBottom:28, marginBottom:32 }}>
          <div style={{ fontSize:10, letterSpacing:"6px", textTransform:"uppercase", color:"#94a3b8", fontWeight:700 }}>★ ★ ★</div>
          <div style={{ fontSize:26, fontWeight:900, letterSpacing:"4px", textTransform:"uppercase", color:"#1e293b", marginTop:8 }}>TRIPTAY LOGISTICS</div>
          <div style={{ fontSize:9, letterSpacing:"3px", textTransform:"uppercase", color:"#64748b", marginTop:4 }}>Established 2018 · Indore, Madhya Pradesh</div>
          <div style={{ fontSize:9, letterSpacing:"2px", textTransform:"uppercase", color:"#94a3b8", marginTop:4 }}>Human Resources Department</div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, fontSize:9, color:"#64748b" }}>
            <span>Ref: TL/HR/2026/{templateId}</span>
            <span>Date: [Date]</span>
          </div>
        </div>
        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-block", borderTop:"1px solid #1e293b", borderBottom:"1px solid #1e293b", padding:"6px 0", width:"80%" }}>
            <span style={{ fontSize:14, fontWeight:900, letterSpacing:"4px", textTransform:"uppercase", color: accentColor }}>{title}</span>
          </div>
        </div>
        {/* Recipient */}
        <div style={{ fontSize:11, lineHeight:1.9, marginBottom:20 }}>
          <div>To,</div>
          <div style={{ fontWeight:700 }}>[Employee_Name]</div>
          <div>[Designation], [Department]</div>
          <div>Triptay Logistics, [Office_Location]</div>
        </div>
        <div style={{ fontSize:11, lineHeight:2 }}>{body}</div>
        {/* Signatures */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:60, borderTop:"1px solid #1e293b", paddingTop:20 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:120, borderBottom:"1px solid #1e293b", marginBottom:8, marginLeft:"auto", marginRight:"auto" }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Authorised Signatory</div>
            <div style={{ fontSize:9, color:"#64748b" }}>For Triptay Logistics Pvt. Ltd.</div>
          </div>
          <div style={{ textAlign:"center", opacity:0.25 }}>
            <div style={{ width:120, borderBottom:"1px solid #1e293b", marginBottom:8, marginLeft:"auto", marginRight:"auto" }} />
            <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"1px" }}>Employee Signature</div>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:14, left:52, right:52, textAlign:"center", fontSize:8, color:"#94a3b8", borderTop:"1px dotted #e2e8f0", paddingTop:8 }}>
          ★ Triptay Logistics Pvt. Ltd. · CIN: UXXXXX2018PTC123456 · hr@triptay.com · +91-XXXXX XXXXX ★
        </div>
      </div>
    </div>
  );
};
