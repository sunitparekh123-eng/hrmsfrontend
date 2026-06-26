const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/onboarding/page.tsx', 'utf8');

const importSearch = 'import { apiGet, apiPost } from "@/lib/api-client";';
const importReplace = 'import { apiGet, apiPost, apiPatch, apiPut } from "@/lib/api-client";';
content = content.replace(importSearch, importReplace);

const useEffectSearch = `    useEffect(() => {
        let cancelled = false;
        async function fetchLookups() {
            try {
                const [co, of] = await Promise.all([
                    apiGet<CompanyItem[]>("/companies"),
                    apiGet<OfficeItem[]>("/offices"),
                ]);
                if (!cancelled) {
                    setCompanies(co);
                    setOffices(of);
                    // Set defaults to first item if available
                    if (co.length > 0) {
                        setFormData((prev) => ({ ...prev, company: co[0].id.toString() }));
                    }
                    if (of.length > 0) {
                        setFormData((prev) => ({ ...prev, location: of[0].id.toString() }));
                    }
                }
            } catch {
                // silently keep defaults
            } finally {
                if (!cancelled) setLoadingLookups(false);
            }
        }
        fetchLookups();
        return () => { cancelled = true; };
    }, []);`;

const useEffectReplace = `    useEffect(() => {
        let cancelled = false;
        async function fetchLookups() {
            try {
                const [co, of] = await Promise.all([
                    apiGet<CompanyItem[]>("/companies"),
                    apiGet<OfficeItem[]>("/offices"),
                ]);
                if (!cancelled) {
                    setCompanies(co);
                    setOffices(of);
                    if (!editId) {
                        if (co.length > 0) {
                            setFormData((prev) => ({ ...prev, company: co[0].id.toString() }));
                        }
                        if (of.length > 0) {
                            setFormData((prev) => ({ ...prev, location: of[0].id.toString() }));
                        }
                    } else {
                        try {
                            const [emp, salaryResponse]: any = await Promise.all([
                                apiGet(\`/employees/\${editId}\`),
                                apiGet(\`/employees/\${editId}/salary\`).catch(() => ({ current: null }))
                            ]);
                            const currentSalary = salaryResponse?.current || {};

                            setFormData((prev) => ({
                                ...prev,
                                name: emp.name || "",
                                email: emp.email || "",
                                phone: emp.phone || "",
                                dob: emp.date_of_birth ? emp.date_of_birth.split("T")[0] : "",
                                gender: emp.gender || "male",
                                address: emp.address || "",
                                aadhaar: emp.aadhaar_number || "",
                                role: emp.role || "EMPLOYEE",
                                jobTitle: emp.designation || "",
                                dept: emp.department || "",
                                doj: emp.date_of_joining ? emp.date_of_joining.split("T")[0] : "",
                                company: emp.company_id ? emp.company_id.toString() : "",
                                location: of.find((o: any) => o.name === emp.location)?.id?.toString() || "",
                                fixedGross: currentSalary.fixed_gross?.toString() || emp.fixed_gross?.toString() || "",
                                bankName: emp.bank_name || "",
                                accountNo: emp.bank_account_number || "",
                                ifsc: emp.ifsc_code || "",
                                paymentMode: emp.payment_mode || "Bank Transfer",
                                pfApplicable: currentSalary.pf_applicable ?? emp.pf_applicable ? "Yes" : "No",
                                pfCeiling: currentSalary.pf_ceiling ?? emp.pf_ceiling ? "Yes" : "No",
                                esicApplicable: currentSalary.esic_applicable ?? emp.esic_applicable ? "Yes" : "No",
                                pfContributionMode: currentSalary.pf_contribution_mode ?? emp.pf_contribution_mode || "shared",
                                pfEmployeeRate: currentSalary.pf_employee_rate?.toString() || "0.12",
                                pfEmployerRate: currentSalary.pf_employer_rate?.toString() || "0.12",
                                esicContributionMode: currentSalary.esic_contribution_mode ?? emp.esic_contribution_mode || "shared",
                                esicEmployeeRate: currentSalary.esic_employee_rate?.toString() || "0.0075",
                                esicEmployerRate: currentSalary.esic_employer_rate?.toString() || "0.0325",
                                pfNo: emp.pf_number || "",
                                uan: emp.uan || "",
                                pan: emp.pan_number || "",
                                licDetails: emp.lic_details || "",
                                emergencyName: emp.emergency_contact_name || "",
                                emergencyRelation: emp.emergency_contact_relation || "",
                                shiftStartTime: emp.shift_start_time ? emp.shift_start_time.substring(0, 5) : "10:00",
                                shiftEndTime: emp.shift_end_time ? emp.shift_end_time.substring(0, 5) : "19:00",
                                halfDayLateMinutes: emp.half_day_late_minutes?.toString() || "60",
                                ptApplicable: currentSalary.pt_applicable ?? emp.pt_applicable ? "Yes" : "No",
                                effectiveWorkDays: currentSalary.effective_work_days?.toString() || "26",
                            }));
                        } catch (err) {
                            console.error("Failed to fetch employee for editing", err);
                        }
                    }
                }
            } catch {
                // silently keep defaults
            } finally {
                if (!cancelled) setLoadingLookups(false);
            }
        }
        fetchLookups();
        return () => { cancelled = true; };
    }, [editId]);`;
content = content.replace(useEffectSearch, useEffectReplace);

const submitSearch = `            if (isEditing) {
                // Only send fields that are editable, remove email as it might be immutable in this form or already existing
                // (Backend updateEmployee will ignore role and emp_code anyway)
                result = await apiPatch<any>(\`/employees/\${editId}\`, payload);
            } else {
                result = await apiPost<{ emp_code: string; name: string; email: string; id: number }>("/auth/register", payload);
            }`;
            
const submitReplace = `            if (isEditing) {
                result = await apiPatch<any>(\`/employees/\${editId}\`, payload);
                try { await apiPut(\`/employees/\${editId}/salary\`, payload); } catch (e) { console.warn(e); }
                try { await apiPatch(\`/employees/\${editId}/role\`, { role: payload.role }); } catch (e) { console.warn(e); }
            } else {
                result = await apiPost<{ emp_code: string; name: string; email: string; id: number }>("/auth/register", payload);
            }`;
content = content.replace(submitSearch, submitReplace);

const finishSearch = `            setCreatedEmployee({
                id: result.id,
                emp_code: result.emp_code,
                name: result.name,
                email: result.email,
            });`;
            
const finishReplace = `            if (isEditing) {
                router.push(\`/employees/\${editId}\`);
                return;
            }

            setCreatedEmployee({
                id: result.id,
                emp_code: result.emp_code,
                name: result.name,
                email: result.email,
            });`;
content = content.replace(finishSearch, finishReplace);

fs.writeFileSync('src/app/(dashboard)/onboarding/page.tsx', content);
console.log('File patched successfully');
