import { NextRequest, NextResponse } from "next/server";
import { runDemoAudit } from "@/lib/demo-audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = (await req.json()) as { repoUrl?: string };

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required." }, { status: 400 });
    }

    const report = await runDemoAudit(repoUrl);
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Preview audit failed." },
      { status: 400 }
    );
  }
}
