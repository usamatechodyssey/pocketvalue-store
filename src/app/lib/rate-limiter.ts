import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new Redis client instance.
// This will automatically use the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// environment variables that you have already set.
export const redis = new Redis({ // <-- ADD 'export' HERE
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 5 requests per 10 seconds
export const ratelimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});