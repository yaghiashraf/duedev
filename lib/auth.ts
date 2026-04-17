import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const configuredAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
const isPrivateAuthConfigured = Boolean(
  githubClientId &&
  githubClientSecret &&
  configuredAuthSecret &&
  process.env.DATABASE_URL
);
const authSecret =
  configuredAuthSecret ??
  (!isPrivateAuthConfigured ? "duedev-auth-disabled" : undefined);

export const authOptions: NextAuthOptions = {
  adapter: isPrivateAuthConfigured ? PrismaAdapter(prisma) as NextAuthOptions["adapter"] : undefined,
  secret: authSecret,
  providers: isPrivateAuthConfigured
    ? [
        GithubProvider({
          clientId: githubClientId!,
          clientSecret: githubClientSecret!,
          authorization: {
            params: {
              scope: "read:user user:email repo",
            },
          },
        }),
      ]
    : [],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export function getAuthConfigurationStatus() {
  const missing = [
    ["GITHUB_CLIENT_ID", githubClientId],
    ["GITHUB_CLIENT_SECRET", githubClientSecret],
    ["NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET],
    ["DATABASE_URL", process.env.DATABASE_URL],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  return {
    ready: missing.length === 0,
    missing,
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
