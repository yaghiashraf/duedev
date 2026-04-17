import Anthropic from "@anthropic-ai/sdk";
import { Octokit } from "@octokit/rest";
import { prisma } from "./prisma";

// Lazy-initialize to avoid instantiation during Next.js build phase
function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

type AiProvider = "anthropic" | "groq";

function getAiProvider(): AiProvider {
  const configured = process.env.AI_PROVIDER?.toLowerCase();
  if (configured === "groq" || configured === "anthropic") return configured;
  return process.env.GROQ_API_KEY ? "groq" : "anthropic";
}

interface RepoFile {
  path: string;
  content: string;
}

interface AuditFinding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  description: string;
  file?: string;
  recommendation: string;
}

interface AuditReport {
  riskScore: number;
  summary: string;
  findings: AuditFinding[];
  securityScore: number;
  codeQualityScore: number;
  scalabilityScore: number;
  dependencyScore: number;
  techDebtHours: number;
  techDebtCost: number;
  acquisitionRisk: string;
  recommendedPriceAdjustment: string;
  strengths: string[];
  redFlags: string[];
  hiddenCosts: string[];
}

async function fetchRepoContents(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<RepoFile[]> {
  const files: RepoFile[] = [];
  const MAX_FILES = 60;
  const MAX_FILE_SIZE = 50000; // 50KB per file

  // Priority file patterns to analyze
  const PRIORITY_PATTERNS = [
    /package\.json$/,
    /requirements\.txt$/,
    /Dockerfile$/,
    /\.env\.example$/,
    /\.(ts|tsx|js|jsx|py|go|rb|php)$/,
    /auth\./i,
    /middleware/i,
    /api\//i,
    /database\./i,
    /db\./i,
    /prisma/i,
    /schema/i,
    /config\./i,
    /security/i,
  ];

  async function traverseDir(path: string, depth: number = 0): Promise<void> {
    if (files.length >= MAX_FILES || depth > 4) return;

    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      if (!Array.isArray(data)) return;

      // Sort: priority files first
      const sorted = data.sort((a, b) => {
        const aPriority = PRIORITY_PATTERNS.some((p) => p.test(a.path)) ? 0 : 1;
        const bPriority = PRIORITY_PATTERNS.some((p) => p.test(b.path)) ? 0 : 1;
        return aPriority - bPriority;
      });

      for (const item of sorted) {
        if (files.length >= MAX_FILES) break;

        const skip = ["node_modules", ".git", "dist", "build", ".next", "vendor", "__pycache__", ".venv", "venv"];
        if (skip.some((s) => item.path.includes(s))) continue;

        if (item.type === "file") {
          const isPriority = PRIORITY_PATTERNS.some((p) => p.test(item.path));
          if (!isPriority && depth > 2) continue;

          try {
            const { data: fileData } = await octokit.repos.getContent({
              owner, repo, path: item.path,
            });
            if ("content" in fileData && fileData.content) {
              const content = Buffer.from(fileData.content, "base64").toString("utf-8");
              if (content.length <= MAX_FILE_SIZE) {
                files.push({ path: item.path, content });
              }
            }
          } catch {}
        } else if (item.type === "dir") {
          await traverseDir(item.path, depth + 1);
        }
      }
    } catch {}
  }

  await traverseDir("");
  return files;
}

function detectHardcodedSecrets(files: RepoFile[]): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const secretPatterns = [
    { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: "Stripe Live Key" },
    { pattern: /sk_test_[a-zA-Z0-9]{24,}/g, name: "Stripe Test Key" },
    { pattern: /AKIA[0-9A-Z]{16}/g, name: "AWS Access Key" },
    { pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/g, name: "Private Key" },
    { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: "GitHub Personal Token" },
    { pattern: /xoxb-[0-9]{11,13}-[0-9]{11,13}-[a-zA-Z0-9]{24}/g, name: "Slack Bot Token" },
    { pattern: /AIza[0-9A-Za-z-_]{35}/g, name: "Google API Key" },
    { pattern: /[a-zA-Z0-9_-]*[Pp]assword[a-zA-Z0-9_-]*\s*=\s*["'][^"']{8,}/g, name: "Hardcoded Password" },
    { pattern: /[a-zA-Z0-9_-]*[Ss]ecret[a-zA-Z0-9_-]*\s*=\s*["'][^"']{8,}/g, name: "Hardcoded Secret" },
    { pattern: /mongodb\+srv:\/\/[^:]+:[^@]+@/g, name: "MongoDB Connection String" },
    { pattern: /postgres:\/\/[^:]+:[^@]+@/g, name: "PostgreSQL Connection String" },
  ];

  for (const file of files) {
    if (file.path.includes(".env") || file.path.includes("example")) continue;
    for (const { pattern, name } of secretPatterns) {
      if (pattern.test(file.content)) {
        findings.push({
          severity: "critical",
          category: "Security",
          title: `Hardcoded ${name} detected`,
          description: `A ${name} appears to be hardcoded directly in the source file \`${file.path}\`. This is publicly visible to anyone with repository access.`,
          file: file.path,
          recommendation: `Move this credential to environment variables immediately. Rotate the key as it may already be compromised.`,
        });
      }
    }
  }
  return findings;
}

function detectDependencyIssues(files: RepoFile[]): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const packageJson = files.find((f) => f.path === "package.json");
  const requirements = files.find((f) => f.path === "requirements.txt");

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson.content);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      const knownOld: Record<string, string> = {
        "node-fetch": "2",
        "moment": "any",
        "request": "any",
        "express": "4",
      };

      for (const [dep, reason] of Object.entries(knownOld)) {
        if (deps[dep]) {
          findings.push({
            severity: "medium",
            category: "Dependencies",
            title: `Outdated package: ${dep}`,
            description: `The package \`${dep}\` is considered legacy. ${reason === "any" ? "It is no longer actively maintained." : `Version ${deps[dep]} is outdated.`}`,
            file: "package.json",
            recommendation: `Consider replacing with a modern alternative.`,
          });
        }
      }

      if (!pkg.engines) {
        findings.push({
          severity: "low",
          category: "Configuration",
          title: "No Node.js engine version specified",
          description: "package.json does not specify a required Node.js version. This can cause runtime inconsistencies across environments.",
          file: "package.json",
          recommendation: 'Add an "engines" field to package.json specifying the Node.js version.',
        });
      }
    } catch {}
  }

  if (!packageJson && !requirements) {
    findings.push({
      severity: "medium",
      category: "Configuration",
      title: "No dependency manifest found",
      description: "Could not find package.json or requirements.txt at the repository root.",
      recommendation: "Ensure dependency manifests are committed to the repository root.",
    });
  }

  return findings;
}

function detectAuthIssues(files: RepoFile[]): AuditFinding[] {
  const findings: AuditFinding[] = [];

  const authFiles = files.filter((f) =>
    /auth|login|session|jwt|token|middleware/i.test(f.path)
  );

  if (authFiles.length === 0) {
    const hasApiRoutes = files.some((f) => f.path.includes("api/") || f.path.includes("routes/"));
    if (hasApiRoutes) {
      findings.push({
        severity: "high",
        category: "Security",
        title: "No authentication layer detected",
        description: "API routes were found but no authentication/middleware files could be located. Endpoints may be publicly accessible.",
        recommendation: "Implement authentication middleware on all non-public API routes.",
      });
    }
  }

  for (const file of authFiles) {
    if (/Math\.random\(\)/.test(file.content)) {
      findings.push({
        severity: "critical",
        category: "Security",
        title: "Insecure random number generation in auth context",
        description: `\`Math.random()\` is not cryptographically secure and should not be used for token generation in \`${file.path}\`.`,
        file: file.path,
        recommendation: "Use `crypto.randomBytes()` or `crypto.getRandomValues()` for security tokens.",
      });
    }

    if (/md5\(|MD5\(/i.test(file.content)) {
      findings.push({
        severity: "high",
        category: "Security",
        title: "MD5 used for hashing",
        description: `MD5 is cryptographically broken and must not be used for passwords or security tokens in \`${file.path}\`.`,
        file: file.path,
        recommendation: "Use bcrypt, argon2, or scrypt for password hashing.",
      });
    }
  }

  return findings;
}

async function runClaudeAnalysis(
  files: RepoFile[],
  auditType: "SELLER" | "BUYER" | "MONITOR",
  repoName: string
): Promise<AuditReport> {
  const filesSummary = files
    .slice(0, 40)
    .map((f) => `### ${f.path}\n\`\`\`\n${f.content.slice(0, 3000)}\n\`\`\``)
    .join("\n\n");

  const staticFindings = [
    ...detectHardcodedSecrets(files),
    ...detectDependencyIssues(files),
    ...detectAuthIssues(files),
  ];

  const prompt = buildAuditPrompt(repoName, auditType, staticFindings, filesSummary);

  const response = await getAnthropicClient().messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const claudeReport = parseAuditReport(text);

  return mergeStaticFindings(claudeReport, staticFindings);
}

function buildAuditPrompt(
  repoName: string,
  auditType: "SELLER" | "BUYER" | "MONITOR",
  staticFindings: AuditFinding[],
  filesSummary: string
) {
  return `You are a senior software engineer and acquisition specialist performing a technical due diligence audit on a SaaS codebase called "${repoName}".

Audit type: ${auditType === "BUYER" ? "BUYER due diligence (for someone considering acquiring this product)" : "SELLER report (to prove codebase quality to potential buyers)"}

Static analysis has already detected these issues:
${JSON.stringify(staticFindings, null, 2)}

Now analyze these repository files and produce a comprehensive JSON audit report:

${filesSummary}

Respond ONLY with a valid JSON object matching this exact structure:
{
  "riskScore": <0-100, where 0=no risk, 100=catastrophic risk>,
  "summary": "<2-3 sentence executive summary of the codebase>",
  "securityScore": <0-100, higher=better>,
  "codeQualityScore": <0-100, higher=better>,
  "scalabilityScore": <0-100, higher=better>,
  "dependencyScore": <0-100, higher=better>,
  "techDebtHours": <estimated hours to address all technical debt>,
  "techDebtCost": <estimated cost in USD at $150/hr to fix all issues>,
  "acquisitionRisk": "<LOW | MEDIUM | HIGH | CRITICAL> with one sentence reason",
  "recommendedPriceAdjustment": "<e.g. 'Reduce asking price by 15% due to...' or 'Price is justified, codebase is clean'>",
  "findings": [
    {
      "severity": "<critical|high|medium|low|info>",
      "category": "<Security|Performance|Code Quality|Dependencies|Architecture|Scalability>",
      "title": "<concise title>",
      "description": "<plain English description of the issue and its business impact>",
      "file": "<file path if applicable>",
      "recommendation": "<specific actionable fix>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "redFlags": ["<red flag 1 if any>"],
  "hiddenCosts": ["<e.g. '$200/month in extra DB costs at 5K users'>"]
}

Be thorough, honest, and business-focused. Frame technical issues in terms of business risk and cost.`;
}

function parseAuditReport(text: string): AuditReport {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse AI audit response");

  return JSON.parse(jsonMatch[0]) as AuditReport;
}

function mergeStaticFindings(report: AuditReport, staticFindings: AuditFinding[]): AuditReport {
  report.findings = [
    ...staticFindings,
    ...(report.findings || []),
  ].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return order[a.severity] - order[b.severity];
  });

  return report;
}

async function runGroqAnalysis(
  files: RepoFile[],
  auditType: "SELLER" | "BUYER" | "MONITOR",
  repoName: string
): Promise<AuditReport> {
  const filesSummary = files
    .slice(0, 40)
    .map((f) => `### ${f.path}\n\`\`\`\n${f.content.slice(0, 3000)}\n\`\`\``)
    .join("\n\n");

  const staticFindings = [
    ...detectHardcodedSecrets(files),
    ...detectDependencyIssues(files),
    ...detectAuthIssues(files),
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: buildAuditPrompt(repoName, auditType, staticFindings, filesSummary),
        },
      ],
      max_completion_tokens: 4096,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq audit analysis failed: ${errorText.slice(0, 240)}`);
  }

  const payload = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content ?? "";
  return mergeStaticFindings(parseAuditReport(text), staticFindings);
}

async function runAiAnalysis(
  files: RepoFile[],
  auditType: "SELLER" | "BUYER" | "MONITOR",
  repoName: string
): Promise<AuditReport> {
  const provider = getAiProvider();
  if (provider === "groq") {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is required for Groq audit analysis.");
    return runGroqAnalysis(files, auditType, repoName);
  }

  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is required for Anthropic audit analysis.");
  return runClaudeAnalysis(files, auditType, repoName);
}

export async function runAudit(auditId: string, accessToken: string): Promise<void> {
  const audit = await prisma.audit.findUnique({ where: { id: auditId } });
  if (!audit) throw new Error("Audit not found");

  await prisma.audit.update({
    where: { id: auditId },
    data: { status: "RUNNING" },
  });

  try {
    const octokit = new Octokit({ auth: accessToken });
    const files = await fetchRepoContents(octokit, audit.repoOwner, audit.repoName);

    if (files.length === 0) {
      throw new Error("Could not fetch repository contents. Check repository access.");
    }

    const report = await runAiAnalysis(
      files,
      audit.auditType as "SELLER" | "BUYER" | "MONITOR",
      audit.repoName
    );

    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "COMPLETE",
        riskScore: report.riskScore,
        findings: report.findings as object[],
        reportData: report as object,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: "FAILED",
        reportData: { error: error instanceof Error ? error.message : "Unknown error" } as object,
      },
    });
    throw error;
  }
}
