import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/lib/prisma-types';
import { JanuaCredentialsProvider, januaJwtCallback, januaSessionCallback } from './janua-auth';
import { prisma } from './prisma';
import { generateCsrfToken } from './security';

// Check if Janua auth is enabled (default: true for unified auth)
const JANUA_ENABLED = process.env.JANUA_ENABLED !== 'false';

/**
 * NextAuth configuration
 * Using PrismaAdapter for database persistence with proper typing
 */
export const authOptions: NextAuthOptions = {
  // PrismaAdapter returns a compatible adapter, but TypeScript needs help understanding this
  // The adapter conforms to the NextAuth Adapter interface
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [
    // Janua authentication (primary - unified MADFAM auth)
    ...(JANUA_ENABLED ? [JanuaCredentialsProvider] : []),
    // Local credentials (fallback for development/migration)
    CredentialsProvider({
      id: 'local',
      name: 'Local',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: UserRole[user.role as keyof typeof UserRole],
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, account }) {
      // Handle Janua authentication
      if (user && account?.provider === 'janua') {
        const januaUser = user as typeof user & {
          januaAccessToken: string;
          januaRefreshToken: string;
          januaTokenExpiry: number;
          orgId?: string;
          permissions: string[];
        };
        const januaToken = await januaJwtCallback(token, {
          id: januaUser.id,
          role: januaUser.role,
          januaAccessToken: januaUser.januaAccessToken,
          januaRefreshToken: januaUser.januaRefreshToken,
          januaTokenExpiry: januaUser.januaTokenExpiry,
          orgId: januaUser.orgId,
          permissions: januaUser.permissions,
        });
        // Generate CSRF token
        if (!januaToken.csrfToken || trigger === 'signIn') {
          januaToken.csrfToken = generateCsrfToken();
        }
        return januaToken;
      }

      // Handle local authentication
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role || UserRole.VIEWER;
        token.authProvider = 'local';
      }

      // Generate CSRF token on sign in or if not present
      if (!token.csrfToken || trigger === 'signIn') {
        token.csrfToken = generateCsrfToken();
      }

      return token;
    },
    async session({ session, token }) {
      // Handle Janua session
      if (token.authProvider === 'janua') {
        const januaSession = januaSessionCallback(session, token);
        return {
          ...januaSession,
          csrfToken: token.csrfToken as string,
        } as typeof session;
      }

      // Handle local session
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }

      // Add CSRF token to session
      session.csrfToken = token.csrfToken as string;
      session.authProvider = token.authProvider as string;

      return session;
    },
  },
};

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    role: UserRole;
    // Janua-specific fields (optional for local auth)
    januaAccessToken?: string;
    januaRefreshToken?: string;
    januaTokenExpiry?: number;
    orgId?: string;
    permissions?: string[];
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      orgId?: string;
      permissions?: string[];
    };
    csrfToken: string;
    authProvider?: string;
    januaAccessToken?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    csrfToken: string;
    authProvider?: string;
    // Janua-specific fields
    januaAccessToken?: string;
    januaRefreshToken?: string;
    januaTokenExpiry?: number;
    orgId?: string;
    permissions?: string[];
    error?: string;
  }
}
