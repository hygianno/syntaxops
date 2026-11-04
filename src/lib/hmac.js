import crypto from "crypto";

/**
 * Generates a deterministic cryptographic HMAC-SHA256 verification hash
 * binding student identity, course slug, and completion timestamp.
 */
export function generateVerificationHash({ userEmail, courseSlug, completedAt }) {
  const secret = process.env.REPORT_SIGNING_SECRET || "syntaxops_default_pow_signing_secret_2026";
  const payload = `${userEmail.toLowerCase()}:${courseSlug}:${new Date(completedAt).toISOString()}`;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Formats a 64-character hex hash into readable credential blocks
 * e.g. SYNTAX-A1B2-C3D4-E5F6
 */
export function formatCredentialId(hash) {
  if (!hash) return "SYNTAX-UNVERIFIED";
  const clean = hash.toUpperCase().replace(/[^A-F0-9]/g, "");
  return `SYNTAX-${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
}
