import { RateLimiter, RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

import type { RequestEvent } from '@sveltejs/kit';
import type { Rate, RateLimiterPlugin } from 'sveltekit-rate-limiter/server';

class TitaniumTokenRateLimiter implements RateLimiterPlugin {
  readonly rate: Rate | Rate[];

  constructor(rate: Rate | Rate[]) {
    this.rate = rate;
  }

  async hash(event: RequestEvent) {
    const token = event.cookies.get('titanium_token');
    if (!token) return false;
    return token;
  }
}

export const apiLimit = new RetryAfterRateLimiter({
  plugins: [new TitaniumTokenRateLimiter([6, 's'])]
});

export const guildsLimit = new RateLimiter({
  plugins: [new TitaniumTokenRateLimiter([1, '2s'])]
});
