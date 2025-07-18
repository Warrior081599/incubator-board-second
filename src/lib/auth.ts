import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignup: { label: "Is Signup", type: "text" }, // Add signup flag
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const isSignup = credentials.isSignup === "true";

        try {
          if (isSignup) {
            // SIGNUP LOGIC
            if (!credentials.name) {
              throw new Error("Name is required for signup");
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (existingUser) {
              throw new Error("User already exists");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create user
            const user = await prisma.user.create({
              data: {
                email: credentials.email,
                password: hashedPassword,
                name: credentials.name,
                role: "USER", // Default role
              },
            });

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          } else {
            // SIGNIN LOGIC
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user || !user.password) {
              throw new Error("Invalid credentials");
            }

            const isValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!isValid) {
              throw new Error("Invalid credentials");
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email || !account?.provider) {
          return false;
        }

        // Skip database operations for credentials provider since we already handled it in authorize
        if (account?.provider === "credentials") {
          return true;
        }

        // Only handle Google OAuth here
        if (account?.provider === "google") {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              lastLogin: new Date(),
            },

            create: {
              email: user.email,
              name: user.name,
              image: user.image || null,
              providerId: account.providerAccountId || null,
              provider: account.provider,
              lastLogin: new Date(),
            },
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
};
