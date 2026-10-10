// Best-effort client IP. Behind a hosting proxy (Railway, Render, etc.) the
// proxy sets x-forwarded-for; locally it's usually missing.
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
