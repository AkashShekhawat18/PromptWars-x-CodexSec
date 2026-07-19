import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;
let authRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "60 s"), // 60 req/min for general API
    analytics: true,
    prefix: "rl_api",
  });
  authRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 req/min for auth (anti-brute-force)
    analytics: true,
    prefix: "rl_auth",
  });
}

// In-memory fallback for local development
const memoryCache = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(identifier: string, isAuth = false) {
  const limiter = isAuth ? authRatelimit : ratelimit;
  const maxRequests = isAuth ? 5 : 60;
  const windowMs = 60_000;

  if (limiter) {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    return { success, limit, remaining, reset };
  }

  // In-memory fallback
  const now = Date.now();
  let record = memoryCache.get(identifier);

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
  }

  record.count++;
  memoryCache.set(identifier, record);

  // Auto-clean stale records every 1000 entries to prevent memory leak
  if (memoryCache.size > 1000) {
    for (const [key, val] of memoryCache.entries()) {
      if (now > val.resetAt) memoryCache.delete(key);
    }
  }

  return {
    success: record.count <= maxRequests,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - record.count),
    reset: record.resetAt,
  };
}
