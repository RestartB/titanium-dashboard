import { RateLimiter, RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { RATE_LIMIT_SECRET } from '$env/static/private';

// TODO - use Titanium token for rate limiting

export const apiLimit = new RetryAfterRateLimiter({
  cookie: {
    name: 'api_token',
    secret: RATE_LIMIT_SECRET,
    rate: [6, 's'],
    preflight: true
  }
});

export const guildsLimit = new RateLimiter({
  cookie: {
    name: 'guilds_token',
    secret: RATE_LIMIT_SECRET,
    rate: [1, '2s'],
    preflight: true
  }
});
