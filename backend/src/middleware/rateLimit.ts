import { Elysia } from 'elysia';

interface RateLimitConfig {
  max: number;
  window: number;
}

// Store: IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (
  config: RateLimitConfig = { max: 100, window: 60 }
) => {
  return new Elysia().derive(({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    const record = rateLimitStore.get(ip);

    // Reset if window expired
    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + config.window * 1000,
      });
      return {};
    }

    // Increment count
    record.count++;

    // Check limit
    if (record.count > config.max) {
      set.status = 429;
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(
          (record.resetTime - now) / 1000
        )}s`
      );
    }

    // Set rate limit headers
    set.headers['X-RateLimit-Limit'] = config.max.toString();
    set.headers['X-RateLimit-Remaining'] = (
      config.max - record.count
    ).toString();
    set.headers['X-RateLimit-Reset'] = new Date(record.resetTime).toISOString();

    return {};
  });
};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((record, ip) => {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  });
}, 5 * 60 * 1000);
