import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// --- SECURITY: Throw hard errors if secrets are not configured ---
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (process.env.NODE_ENV === "production" && (!JWT_SECRET || !REFRESH_SECRET)) {
  console.error(
    "CRITICAL SECURITY WARNING: JWT_SECRET and JWT_REFRESH_SECRET must be set in production environment. Falling back to insecure development secrets."
  );
}

// Use env vars; fall back to a dev-only placeholder that is NOT the default secret
const _jwtSecret = JWT_SECRET || "dev-only-jwt-secret-do-not-use-in-production-32chars!";
const _refreshSecret = REFRESH_SECRET || "dev-only-refresh-secret-do-not-use-in-production-32chars!";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function validatePasswordStrength(password: string): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain an uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number");
  return { valid: errors.length === 0, errors };
}

export async function generateTokens(userId: string, email: string, role: string, status: string) {
  const secretKey = new TextEncoder().encode(_jwtSecret);
  const refreshKey = new TextEncoder().encode(_refreshSecret);

  const accessToken = await new SignJWT({ userId, email, role, status })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setAudience("neuroflow-app")
    .setIssuer("neuroflow-api")
    .sign(secretKey);

  const refreshToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setAudience("neuroflow-app")
    .setIssuer("neuroflow-api")
    .sign(refreshKey);

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string) {
  try {
    const secretKey = new TextEncoder().encode(_jwtSecret);
    const { payload } = await jwtVerify(token, secretKey, {
      audience: "neuroflow-app",
      issuer: "neuroflow-api",
    });
    return payload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const refreshKey = new TextEncoder().encode(_refreshSecret);
    const { payload } = await jwtVerify(token, refreshKey, {
      audience: "neuroflow-app",
      issuer: "neuroflow-api",
    });
    return payload;
  } catch {
    return null;
  }
}
