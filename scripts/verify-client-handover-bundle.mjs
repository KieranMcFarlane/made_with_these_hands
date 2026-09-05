#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("handover/client");
const allowedFiles = new Set([
  "AGENTS.md",
  "CLIENT_ISOLATION.md",
  "LIVE_OWNER_DEMO.md",
  "OWNER_ACCEPTANCE.md",
  "README.md",
  "RELEASE_CHECKLIST.md",
  "RESEND_DOMAIN_VERIFICATION.md",
  "config.toml"
]);
const forbiddenNames = /(^|\/)(\.env(?:\..*)?|.*\.(?:pem|key|p12|pfx)|id_rsa|credentials\.json)$/i;
const forbiddenContent = [
  /(?:DIRECTUS|NAKANO|COMPONENT_FACTORY|RESEND)_[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|API_KEY)\s*=\s*["']?[^\s"'<]+/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:postgres(?:ql)?|mysql):\/\/[^\s:@/]+:[^\s@/]+@/i,
  /authorization\s*[:=]\s*["']?bearer\s+[a-z0-9._~+\/-]{16,}/i
];

const entries = await fs.readdir(root, { withFileTypes: true });
const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
const unexpected = files.filter((file) => !allowedFiles.has(file));
const missing = [...allowedFiles].filter((file) => !files.includes(file)).sort();
const findings = [];

for (const file of files) {
  const relative = file;
  if (forbiddenNames.test(relative)) findings.push(`${relative}: forbidden credential filename`);
  const body = await fs.readFile(path.join(root, file), "utf8");
  if (forbiddenContent.some((pattern) => pattern.test(body))) findings.push(`${relative}: possible embedded credential`);
}

const ok = !unexpected.length && !missing.length && !findings.length;
console.log(JSON.stringify({ ok, root: "handover/client", files, missing, unexpected, findings, secretsPrinted: false }, null, 2));
if (!ok) process.exitCode = 1;
