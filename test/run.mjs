import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const fixtures = path.dirname(fileURLToPath(import.meta.url)) + "/fixtures";
const oxlint = path.resolve(fixtures, "../../node_modules/.bin/oxlint");

function lint(file) {
  try {
    execFileSync(oxlint, ["-c", ".oxlintrc.json", file], {
      cwd: fixtures,
      encoding: "utf8",
    });
    return { ok: true, out: "" };
  } catch (err) {
    return { ok: false, out: String(err.stdout ?? "") };
  }
}

let failed = false;

const bad = lint("bad.ts");
if (bad.ok || !bad.out.includes("Comment wall: 4 consecutive")) {
  console.error("FAIL: bad.ts should report a 4-line comment wall\n" + bad.out);
  failed = true;
}

const good = lint("good.ts");
if (!good.ok) {
  console.error("FAIL: good.ts should pass\n" + good.out);
  failed = true;
}

if (failed) process.exit(1);
console.log("ok: bad.ts flagged, good.ts clean");
