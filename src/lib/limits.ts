import { RateLimiter, RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';
import { RATE_LIMIT_SECRET } from '$env/static/private';

export const apiLimit = new RetryAfterRateLimiter({
	cookie: {
		name: 'api_token',
		secret: RATE_LIMIT_SECRET,
		rate: [4, 's'],
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
