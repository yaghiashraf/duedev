import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Octokit } from "@octokit/rest";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "github" },
  });

  if (!account?.access_token) {
    return NextResponse.json({ error: "GitHub token not found" }, { status: 400 });
  }

  const octokit = new Octokit({ auth: account.access_token });
  const response = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
    type: "owner",
  }).catch(() => null);

  if (!response) {
    return NextResponse.json(
      { error: "GitHub repositories could not be loaded. Reconnect GitHub and try again." },
      { status: 502 }
    );
  }

  const { data } = response;

  const repos = data.map((r) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    owner: r.owner.login,
    private: r.private,
    description: r.description,
    language: r.language,
    updated_at: r.updated_at,
    stargazers_count: r.stargazers_count,
  }));

  return NextResponse.json({ repos });
}
