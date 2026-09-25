export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

const blockedAgentPattern =
  /(?:Google-InspectionTool|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Bytespider|Google-Extended|Applebot-Extended|Meta-ExternalAgent|Meta-ExternalFetcher|cohere-ai|Diffbot|ImagesiftBot|Omgilibot|YouBot|Amazonbot|AI2Bot|Ai2Bot-Dolma|Timpibot|Webzio-Extended|FacebookBot|FriendlyCrawler|PetalBot|SemrushBot|AhrefsBot|MJ12bot|DotBot|DataForSeoBot|BLEXBot|serpstatbot|[\w.-]*bot\b|crawler|spider|scraper|scrapy|headless|playwright|puppeteer|selenium|webdriver|phantomjs|python-requests|python-httpx|aiohttp|go-http-client|node-fetch|undici|okhttp|libwww-perl|java\/|curl\/|wget\/)/i;

export function isBlockedAgent(userAgent: string): boolean {
  return blockedAgentPattern.test(userAgent);
}

export function getRateLimitScope(pathname: string): "ecg-image" | null {
  return pathname.startsWith("/api/ecg-module-image/") ? "ecg-image" : null;
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    consume(key: string, now = Date.now()): RateLimitResult {
      const current = buckets.get(key);
      const bucket = !current || now >= current.resetAt ? { count: 0, resetAt: now + windowMs } : current;
      bucket.count += 1;
      buckets.set(key, bucket);

      if (buckets.size > 10_000) {
        for (const [bucketKey, value] of buckets) {
          if (now >= value.resetAt) buckets.delete(bucketKey);
        }
      }

      return {
        allowed: bucket.count <= limit,
        limit,
        remaining: Math.max(0, limit - bucket.count),
        resetAt: bucket.resetAt,
      };
    },
  };
}
