const fs = require("fs");
let content = fs.readFileSync("src/app/(dashboard)/onboarding/page.tsx", "utf8");

content = content.replace(
    /role: emp\.role \|\| "EMPLOYEE",/g,
    `role: emp.role ? emp.role.toUpperCase() : "EMPLOYEE",`
);

fs.writeFileSync("src/app/(dashboard)/onboarding/page.tsx", content);
console.log("Fixed role issue!");
