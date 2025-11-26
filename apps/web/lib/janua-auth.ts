/**
 * Janua Authentication Integration for MADFAM Site
 *
 * Provides NextAuth-compatible authentication using Janua as the identity provider.
 * This enables unified authentication across the MADFAM ecosystem.
 */

import { jwtVerify } from 'jose';
import type { JWT as NextAuthJWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/lib/prisma-types';

// Janua configuration from environment
const JANUA_API_URL = process.env.JANUA_API_URL || 'http://janua-api:8001';
const JANUA_JWT_SECRET = process.env.JANUA_JWT_SECRET || 'dev-shared-janua-secret-32chars';
// Cookie name for potential future use
// const JANUA_COOKIE_NAME = process.env.JANUA_COOKIE_NAME || 'janua-session';

/**
 * Janua user structure from API response
 */
export interface JanuaUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  org_id?: string;
  roles: string[];
  permissions: string[];
  is_active: boolean;
  created_at: string;
}

/**
 * Janua token response structure
 */
export interface JanuaTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Janua JWT payload structure
 */
export interface JanuaJWTPayload {
  sub: string;
  email: string;
  org_id?: string;
  roles: string[];
  permissions: string[];
  iss: string;
  iat: number;
  exp: number;
}

/**
 * Authenticate with Janua API
 */
async function authenticateWithJanua(
  email: string,
  password: string
): Promise<{ user: JanuaUser; tokens: JanuaTokenResponse } | null> {
  try {
    const response = await fetch(`${JANUA_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error('Janua auth failed:', response.status);
      return null;
    }

    const data = await response.json();

    // Get user profile
    const userResponse = await fetch(`${JANUA_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to get Janua user profile');
      return null;
    }

    const user = await userResponse.json();

    return {
      user,
      tokens: data,
    };
  } catch (error) {
    console.error('Janua authentication error:', error);
    return null;
  }
}

/**
 * Verify a Janua JWT token
 */
export async function verifyJanuaToken(token: string): Promise<JanuaJWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JANUA_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'janua',
    });

    return payload as unknown as JanuaJWTPayload;
  } catch (error) {
    console.error('Janua token verification failed:', error);
    return null;
  }
}

/**
 * Refresh Janua tokens
 */
async function refreshJanuaTokens(refreshToken: string): Promise<JanuaTokenResponse | null> {
  try {
    const response = await fetch(`${JANUA_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Janua token refresh error:', error);
    return null;
  }
}

/**
 * Map Janua roles to MADFAM Site roles
 */
function mapJanuaRoles(januaRoles: string[]): UserRole {
  // Map Janua roles to MADFAM Site UserRole
  if (januaRoles.includes('admin') || januaRoles.includes('super_admin')) {
    return UserRole.ADMIN;
  }
  if (januaRoles.includes('editor') || januaRoles.includes('write')) {
    return UserRole.EDITOR;
  }
  return UserRole.VIEWER;
}

/**
 * Janua Credentials Provider for NextAuth
 */
export const JanuaCredentialsProvider = CredentialsProvider({
  id: 'janua',
  name: 'Janua',
  credentials: {
    email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    const result = await authenticateWithJanua(credentials.email, credentials.password);

    if (!result) {
      return null;
    }

    const { user, tokens } = result;

    // Return user object compatible with NextAuth
    return {
      id: user.id,
      email: user.email,
      name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
      role: mapJanuaRoles(user.roles),
      januaAccessToken: tokens.access_token,
      januaRefreshToken: tokens.refresh_token,
      januaTokenExpiry: Date.now() + tokens.expires_in * 1000,
      orgId: user.org_id,
      permissions: user.permissions,
    };
  },
});

/**
 * Janua JWT callback for NextAuth
 * Handles token refresh and Janua-specific data
 *
 * This is a helper function called from auth.ts jwt callback when provider is 'janua'
 */
export async function januaJwtCallback(
  token: NextAuthJWT,
  user:
    | {
        id: string;
        role: UserRole;
        januaAccessToken: string;
        januaRefreshToken: string;
        januaTokenExpiry: number;
        orgId?: string;
        permissions: string[];
      }
    | undefined
): Promise<NextAuthJWT> {
  // Initial sign in
  if (user) {
    return {
      ...token,
      id: user.id,
      role: user.role,
      januaAccessToken: user.januaAccessToken,
      januaRefreshToken: user.januaRefreshToken,
      januaTokenExpiry: user.januaTokenExpiry,
      orgId: user.orgId,
      permissions: user.permissions,
      authProvider: 'janua',
    };
  }

  // Check if Janua token needs refresh (5 min buffer)
  if (token.januaTokenExpiry && Date.now() > (token.januaTokenExpiry as number) - 5 * 60 * 1000) {
    const refreshed = await refreshJanuaTokens(token.januaRefreshToken as string);

    if (refreshed) {
      token.januaAccessToken = refreshed.access_token;
      token.januaRefreshToken = refreshed.refresh_token;
      token.januaTokenExpiry = Date.now() + refreshed.expires_in * 1000;
    } else {
      // Token refresh failed - user needs to re-authenticate
      token.error = 'RefreshAccessTokenError';
    }
  }

  return token;
}

/**
 * Janua session callback for NextAuth
 *
 * This is a helper function called from auth.ts session callback when provider is 'janua'
 */
export function januaSessionCallback(
  session: { user?: { id?: string; role?: UserRole; orgId?: string; permissions?: string[] } },
  token: NextAuthJWT
): typeof session & { januaAccessToken?: string; authProvider?: string; error?: string } {
  if (session?.user) {
    session.user.id = token.id as string;
    session.user.role = token.role as UserRole;
    session.user.orgId = token.orgId as string | undefined;
    session.user.permissions = token.permissions as string[] | undefined;
  }

  // Include Janua access token for API calls
  return {
    ...session,
    januaAccessToken: token.januaAccessToken as string | undefined,
    authProvider: token.authProvider as string | undefined,
    error: token.error as string | undefined,
  };
}

// Type augmentation for NextAuth with Janua fields
// Note: Full User, Session and JWT augmentations are in auth.ts to avoid conflicts
