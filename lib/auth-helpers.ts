import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Verify a Firebase ID token WITHOUT the Admin SDK, by validating its RS256
 * signature against Google's public keys (JWKS) plus the standard Firebase
 * issuer/audience claims. This keeps API routes protected using only the public
 * Firebase config — no service account required.
 */
export interface AuthedUser {
  uid: string;
  email?: string;
}

const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

function projectId(): string | undefined {
  return (
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export async function verifyRequest(req: Request): Promise<AuthedUser | null> {
  const pid = projectId();
  if (!pid) return null;

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${pid}`,
      audience: pid,
    });
    if (!payload.sub) return null;
    return { uid: payload.sub, email: payload.email as string | undefined };
  } catch {
    return null;
  }
}
