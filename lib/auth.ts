import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { getPrivateAuditConfigurationStatus } from "./runtime-config";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const configuredAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
const privateAuditConfig = getPrivateAuditConfigurationStatus();
const isPrivateAuthConfigured = privateAuditConfig.ready;
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
  return privateAuditConfig;
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
