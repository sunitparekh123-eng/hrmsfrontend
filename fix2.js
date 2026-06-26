const fs = require("fs");
let content = fs.readFileSync("src/app/(dashboard)/onboarding/page.tsx", "utf8");

content = content.replace(
    /let result: any;\s*if \(isEditing\) {/g,
    `const payload = buildPayload();\n            let result: any;\n            \n            if (isEditing) {`
);

fs.writeFileSync("src/app/(dashboard)/onboarding/page.tsx", content);
console.log("Fixed payload!");
