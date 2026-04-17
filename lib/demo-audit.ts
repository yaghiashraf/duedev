export interface DemoFinding {
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  description: string;
  file?: string;
  recommendation: string;
}

export interface DemoAuditReport {
  repo: {
    owner: string;
    name: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
    updatedAt: string | null;
  };
  riskScore: number;
  summary: string;
  securityScore: number;
  codeQualityScore: number;
  scalabilityScore: number;
  dependencyScore: number;
  techDebtHours: number;
  techDebtCost: number;
  acquisitionRisk: string;
  recommendedPriceAdjustment: string;
  filesAnalyzed: number;
  findings: DemoFinding[];
  strengths: string[];
  redFlags: string[];
  hiddenCosts: string[];
}

interface RepoFile {
  path: string;
  content: string;
}

interface GitHubContentItem {
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
  size?: number;
  download_url?: string | null;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string | null;
}

const MAX_FILES = 70;
const MAX_FILE_SIZE = 70_000;

const priorityPatterns = [
  /package\.json$/,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /requirements\.txt$/,
  /pyproject\.toml$/,
  /go\.mod$/,
  /Dockerfile$/,
  /\.github\/workflows\//,
  /\.env\.example$/,
  /\.(ts|tsx|js|jsx|py|go|rb|php|sql|prisma)$/,
  /middleware/i,
  /auth/i,
  /api\//i,
  /routes?\//i,
  /schema/i,
  /config/i,
];

const skippedPathSegments = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  "vendor",
  "__pycache__",
  ".venv",
  "venv",
  "public",
];

function parseGitHubRepo(input: string) {
  const trimmed = input.trim();
  const shortMatch = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], name: shortMatch[2].replace(/\.git$/, "") };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Enter a GitHub URL like https://github.com/acme/app or owner/repo.");
  }

  if (url.hostname !== "github.com") {
    throw new Error("Only public GitHub repositories are supported for the preview audit.");
  }

  const [owner, name] = url.pathname.replace(/^\/+/, "").split("/");
  if (!owner || !name) {
    throw new Error("Enter a GitHub repository URL with an owner and repo name.");
  }

  return { owner, name: name.replace(/\.git$/, "") };
}

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "duedev-preview-audit",
    },
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    throw new Error("Repository not found, private, or unavailable through the public GitHub API.");
  }

  if (response.status === 403) {
    throw new Error("GitHub rate limit reached. Try again later or sign in for a full audit.");
  }

  if (!response.ok) {
    throw new Error("GitHub could not return repository data right now.");
  }

  return response.json() as Promise<T>;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "duedev-preview-audit" },
    next: { revalidate: 60 },
  });
  if (!response.ok) return "";
  return response.text();
}

function shouldSkipPath(path: string) {
  return skippedPathSegments.some((segment) => path.split("/").includes(segment));
}

function isPriorityFile(path: string) {
  return priorityPatterns.some((pattern) => pattern.test(path));
}

async function fetchRepoFiles(owner: string, repo: string): Promise<RepoFile[]> {
  const files: RepoFile[] = [];

  async function traverse(path = "", depth = 0): Promise<void> {
    if (files.length >= MAX_FILES || depth > 4) return;

    const encodedPath = path ? `/${path.split("/").map(encodeURIComponent).join("/")}` : "";
    const data = await fetchGitHubJson<GitHubContentItem[] | GitHubContentItem>(
      `/repos/${owner}/${repo}/contents${encodedPath}`
    );

    if (!Array.isArray(data)) return;

    const sorted = [...data].sort((a, b) => Number(!isPriorityFile(a.path)) - Number(!isPriorityFile(b.path)));

    for (const item of sorted) {
      if (files.length >= MAX_FILES || shouldSkipPath(item.path)) continue;

      if (item.type === "dir") {
        await traverse(item.path, depth + 1);
        continue;
      }

      if (item.type !== "file" || !item.download_url) continue;
      if (!isPriorityFile(item.path) && depth > 1) continue;
      if ((item.size ?? 0) > MAX_FILE_SIZE) {
        if (/(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(item.path)) {
          files.push({ path: item.path, content: "" });
        }
        continue;
      }

      const content = await fetchText(item.download_url);
      if (content) files.push({ path: item.path, content });
    }
  }

  await traverse();
  return files;
}

function addFinding(findings: DemoFinding[], finding: DemoFinding) {
  const duplicate = findings.some(
    (item) => item.title === finding.title && item.file === finding.file
  );
  if (!duplicate) findings.push(finding);
}

function analyzeFiles(files: RepoFile[]) {
  const findings: DemoFinding[] = [];
  const strengths: string[] = [];
  const redFlags: string[] = [];
  const hiddenCosts: string[] = [];

  const packageJson = files.find((file) => file.path === "package.json");
  const lockFile = files.find((file) => /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(file.path));
  const envExample = files.find((file) => /\.env\.example$|\.env\.sample$/.test(file.path));
  const workflows = files.filter((file) => file.path.startsWith(".github/workflows/"));
  const tests = files.filter((file) => /\.(test|spec)\.(ts|tsx|js|jsx|py)$|__tests__\//.test(file.path));
  const apiFiles = files.filter((file) => /api\/|routes?\//i.test(file.path));
  const authFiles = files.filter((file) => /auth|session|jwt|token|middleware/i.test(file.path));
  const dbFiles = files.filter((file) => /schema\.prisma|migrations?|database|db\./i.test(file.path));

  const secretPatterns = [
    { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: "Stripe live key" },
    { pattern: /AKIA[0-9A-Z]{16}/g, name: "AWS access key" },
    { pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/g, name: "private key" },
    { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: "GitHub token" },
    { pattern: /mongodb\+srv:\/\/[^:]+:[^@]+@/g, name: "MongoDB credential" },
    { pattern: /postgres(?:ql)?:\/\/[^:]+:[^@]+@/g, name: "Postgres credential" },
    { pattern: /(?:password|secret|api[_-]?key)\s*=\s*["'][^"']{12,}/gi, name: "hardcoded credential" },
  ];

  for (const file of files) {
    if (/\.env\.example$|\.env\.sample$|README/i.test(file.path)) continue;

    for (const { pattern, name } of secretPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(file.content)) {
        addFinding(findings, {
          severity: "critical",
          category: "Security",
          title: `Possible ${name} committed`,
          description: `The preview scanner found a pattern that looks like a ${name}. A buyer will treat exposed credentials as an immediate acquisition risk.`,
          file: file.path,
          recommendation: "Move credentials to environment variables, rotate the exposed value, and add secret scanning in CI.",
        });
      }
    }

    if (/eval\(|new Function\(/.test(file.content)) {
      addFinding(findings, {
        severity: "high",
        category: "Security",
        title: "Dynamic code execution detected",
        description: "Runtime code execution can become a remote execution path if user-controlled input reaches it.",
        file: file.path,
        recommendation: "Replace dynamic execution with explicit parsing or a constrained rule engine.",
      });
    }

    const executableRandomUse = file.content
      .split("\n")
      .some((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("description:") || trimmed.startsWith("recommendation:") || trimmed.startsWith("title:")) {
          return false;
        }
        if (trimmed.includes("Math\\.random") || trimmed.includes("`Math.random()`") || trimmed.includes("\\`Math.random()\\`")) {
          return false;
        }
        return /\bMath\.random\(\)/.test(trimmed);
      });

    if (
      executableRandomUse &&
      /token|password|session|auth|secret/i.test(file.content)
    ) {
      addFinding(findings, {
        severity: "high",
        category: "Security",
        title: "Weak randomness in security-sensitive code",
        description: "Security tokens need cryptographic randomness. Predictable tokens can break account and repo access boundaries.",
        file: file.path,
        recommendation: "Use crypto.randomUUID, crypto.getRandomValues, or Node crypto APIs for token generation.",
      });
    }
  }

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson.content) as {
        scripts?: Record<string, string>;
        engines?: Record<string, string>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (!pkg.engines?.node) {
        addFinding(findings, {
          severity: "medium",
          category: "Configuration",
          title: "Node runtime is not pinned",
          description: "Without an engine version, installs can pass locally and fail during deployment or handoff.",
          file: "package.json",
          recommendation: "Add package.json engines.node and keep it aligned with the deployment platform.",
        });
      }

      if (!pkg.scripts?.test && tests.length === 0) {
        addFinding(findings, {
          severity: "medium",
          category: "Code Quality",
          title: "No automated test path found",
          description: "A buyer has no quick way to validate behavior before changing infrastructure, dependencies, or payment logic.",
          file: "package.json",
          recommendation: "Add at least smoke tests for auth, billing, and the core audit/report flow.",
        });
      }

      if (!pkg.scripts?.lint) {
        addFinding(findings, {
          severity: "low",
          category: "Code Quality",
          title: "No lint command found",
          description: "Missing lint automation raises maintenance cost because code quality checks become manual.",
          file: "package.json",
          recommendation: "Add a lint script and run it in CI.",
        });
      }

      for (const dep of ["request", "moment", "node-fetch"]) {
        if (deps[dep]) {
          addFinding(findings, {
            severity: "medium",
            category: "Dependencies",
            title: `Legacy package in dependency graph: ${dep}`,
            description: `${dep} is commonly replaced in modern production apps and can increase update risk.`,
            file: "package.json",
            recommendation: "Review whether this dependency is still needed and replace it with a maintained alternative.",
          });
        }
      }

      strengths.push("Dependency manifest found at the repo root");
      if (pkg.scripts?.build) strengths.push("Build command is defined");
      if (pkg.scripts?.lint) strengths.push("Lint command is defined");
      if (pkg.scripts?.test || tests.length > 0) strengths.push("Automated tests are present");
      if (pkg.engines?.node) strengths.push(`Node runtime pinned to ${pkg.engines.node}`);
    } catch {
      addFinding(findings, {
        severity: "high",
        category: "Configuration",
        title: "package.json could not be parsed",
        description: "A malformed package manifest blocks repeatable installs and makes the app difficult to operate.",
        file: "package.json",
        recommendation: "Fix package.json syntax and verify a clean install from the lockfile.",
      });
    }
  } else {
    addFinding(findings, {
      severity: "medium",
      category: "Configuration",
      title: "No package manifest found",
      description: "The preview scanner could not find a package.json, requirements.txt, pyproject.toml, or go.mod at expected paths.",
      recommendation: "Keep the runtime manifest at the repository root so buyers can reproduce the app.",
    });
  }

  if (!lockFile && packageJson) {
    addFinding(findings, {
      severity: "medium",
      category: "Dependencies",
      title: "No JavaScript lockfile found",
      description: "Unpinned transitive dependencies can create different production builds between buyer, seller, and Vercel.",
      recommendation: "Commit package-lock.json, pnpm-lock.yaml, or yarn.lock and install from it in CI.",
    });
  } else if (lockFile) {
    strengths.push("Lockfile present for repeatable installs");
  }

  if (!envExample) {
    addFinding(findings, {
      severity: "low",
      category: "Operations",
      title: "No environment example file found",
      description: "Missing environment documentation slows buyer handoff and increases deployment mistakes.",
      recommendation: "Add .env.example with required keys and safe placeholder values.",
    });
  } else {
    strengths.push("Environment variables are documented with an example file");
  }

  if (apiFiles.length > 0 && authFiles.length === 0) {
    addFinding(findings, {
      severity: "high",
      category: "Security",
      title: "API surface found without an obvious auth layer",
      description: "API routes were detected but no auth, session, or middleware files were found in the sampled code.",
      recommendation: "Add route-level authorization checks and document which endpoints are intentionally public.",
    });
  } else if (authFiles.length > 0) {
    strengths.push("Authentication or middleware code is present");
  }

  if (workflows.length === 0) {
    addFinding(findings, {
      severity: "low",
      category: "Operations",
      title: "No GitHub Actions workflow found",
      description: "A buyer cannot see an automated build, lint, or test gate before acquiring the repository.",
      recommendation: "Add CI that runs install, lint, tests, and build on every pull request.",
    });
  } else {
    strengths.push("GitHub Actions workflow is present");
  }

  if (dbFiles.length > 0) {
    strengths.push("Database schema or migration files are committed");
  }

  const criticalCount = findings.filter((finding) => finding.severity === "critical").length;
  const highCount = findings.filter((finding) => finding.severity === "high").length;
  const mediumCount = findings.filter((finding) => finding.severity === "medium").length;
  const lowCount = findings.filter((finding) => finding.severity === "low").length;

  if (criticalCount > 0) redFlags.push("Credentials or critical security patterns need review before any transaction.");
  if (highCount > 0) redFlags.push("High-severity issues should become closing conditions or price adjustments.");
  if (tests.length === 0) hiddenCosts.push("Budget 1-2 engineering days to add smoke tests around the revenue-critical paths.");
  if (!envExample) hiddenCosts.push("Budget handoff time to reconstruct production environment requirements.");

  const rawRisk = Math.min(95, Math.max(8, 12 + criticalCount * 25 + highCount * 15 + mediumCount * 8 + lowCount * 3 - strengths.length * 3));
  const riskScore =
    criticalCount > 0 ? Math.max(rawRisk, 75) :
    highCount > 0 ? Math.max(rawRisk, 50) :
    rawRisk;
  const techDebtHours = Math.max(4, criticalCount * 8 + highCount * 5 + mediumCount * 3 + lowCount + Math.max(0, 10 - strengths.length));
  const qualityPenalty = mediumCount * 8 + lowCount * 4 + (tests.length === 0 ? 18 : 0);
  const securityPenalty = criticalCount * 35 + highCount * 18;

  return {
    findings: findings.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return order[a.severity] - order[b.severity];
    }),
    strengths: Array.from(new Set(strengths)).slice(0, 6),
    redFlags: Array.from(new Set(redFlags)).slice(0, 4),
    hiddenCosts: Array.from(new Set(hiddenCosts)).slice(0, 4),
    riskScore,
    securityScore: Math.max(10, 100 - securityPenalty),
    codeQualityScore: Math.max(20, 100 - qualityPenalty),
    scalabilityScore: dbFiles.length > 0 ? 76 : 62,
    dependencyScore: Math.max(25, 92 - mediumCount * 10 - Number(!lockFile) * 18),
    techDebtHours,
    techDebtCost: techDebtHours * 150,
  };
}

function summarizeRisk(riskScore: number, findings: DemoFinding[]) {
  const topFinding = findings[0];
  if (riskScore >= 75) return `CRITICAL: ${topFinding?.title ?? "multiple blockers"} should be resolved before acquisition.`;
  if (riskScore >= 50) return `HIGH: ${topFinding?.title ?? "several material issues"} should affect diligence and pricing.`;
  if (riskScore >= 25) return "MEDIUM: The repository has manageable issues that should be scoped before close.";
  return "LOW: The sampled files show no major blockers, though a full authenticated audit is still recommended.";
}

export async function runDemoAudit(input: string): Promise<DemoAuditReport> {
  const { owner, name } = parseGitHubRepo(input);
  const repo = await fetchGitHubJson<GitHubRepo>(`/repos/${owner}/${name}`);
  const files = await fetchRepoFiles(owner, name);

  if (files.length === 0) {
    throw new Error("No analyzable source files were found in this public repository.");
  }

  const analysis = analyzeFiles(files);
  const summary =
    analysis.findings.length === 0
      ? `${repo.full_name} has a clean preview scan across ${files.length} sampled files. The full audit should still validate private configuration, production secrets, and runtime behavior.`
      : `${repo.full_name} was preview-scanned across ${files.length} files. The main diligence focus is ${analysis.findings[0].title.toLowerCase()}.`;

  return {
    repo: {
      owner,
      name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    },
    riskScore: analysis.riskScore,
    summary,
    securityScore: analysis.securityScore,
    codeQualityScore: analysis.codeQualityScore,
    scalabilityScore: analysis.scalabilityScore,
    dependencyScore: analysis.dependencyScore,
    techDebtHours: analysis.techDebtHours,
    techDebtCost: analysis.techDebtCost,
    acquisitionRisk: summarizeRisk(analysis.riskScore, analysis.findings),
    recommendedPriceAdjustment:
      analysis.riskScore >= 50
        ? `Use the top findings to negotiate a holdback or price reduction tied to ${analysis.techDebtHours} estimated remediation hours.`
        : "No preview-level price reduction is obvious. Ask for a full audit before final diligence.",
    filesAnalyzed: files.length,
    findings: analysis.findings,
    strengths: analysis.strengths,
    redFlags: analysis.redFlags,
    hiddenCosts: analysis.hiddenCosts,
  };
}
