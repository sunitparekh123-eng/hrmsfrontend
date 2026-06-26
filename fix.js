const fs = require("fs");
let content = fs.readFileSync("src/app/(dashboard)/onboarding/page.tsx", "utf8");

content = content.replace(
    /pfApplicable: currentSalary\.pf_applicable \?\? emp\.pf_applicable \? "Yes" : "No",/g,
    `pfApplicable: (currentSalary.pf_applicable ?? emp.pf_applicable) ? "Yes" : "No",`
);

content = content.replace(
    /pfCeiling: currentSalary\.pf_ceiling \?\? emp\.pf_ceiling \? "Yes" : "No",/g,
    `pfCeiling: (currentSalary.pf_ceiling ?? emp.pf_ceiling) ? "Yes" : "No",`
);

content = content.replace(
    /esicApplicable: currentSalary\.esic_applicable \?\? emp\.esic_applicable \? "Yes" : "No",/g,
    `esicApplicable: (currentSalary.esic_applicable ?? emp.esic_applicable) ? "Yes" : "No",`
);

content = content.replace(
    /pfContributionMode: currentSalary\.pf_contribution_mode \?\? emp\.pf_contribution_mode \|\| "shared",/g,
    `pfContributionMode: (currentSalary.pf_contribution_mode ?? emp.pf_contribution_mode) || "shared",`
);

content = content.replace(
    /esicContributionMode: currentSalary\.esic_contribution_mode \?\? emp\.esic_contribution_mode \|\| "shared",/g,
    `esicContributionMode: (currentSalary.esic_contribution_mode ?? emp.esic_contribution_mode) || "shared",`
);

content = content.replace(
    /ptApplicable: currentSalary\.pt_applicable \?\? emp\.pt_applicable \? "Yes" : "No",/g,
    `ptApplicable: (currentSalary.pt_applicable ?? emp.pt_applicable) ? "Yes" : "No",`
);


fs.writeFileSync("src/app/(dashboard)/onboarding/page.tsx", content);
console.log("Fixed for real!");
