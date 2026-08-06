/** Shared request guards for the submission endpoints. */

export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

export async function readJson<T>(req: Request): Promise<T | null> {
  if (!req.headers.get('content-type')?.includes('application/json')) return null
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

/**
 * An open form that writes to a public repository will be found and
 * abused. Turnstile is the cheapest thing standing between this endpoint
 * and a bot, so a missing secret fails closed rather than open.
 */
export async function verifyTurnstile(
  secret: string | undefined,
  token: string | undefined,
  req: Request,
): Promise<boolean> {
  if (!secret) {
    console.error('TURNSTILE_SECRET is not set — refusing to accept submissions')
    return false
  }
  if (!token) return false

  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  const ip = req.headers.get('CF-Connecting-IP')
  if (ip) form.append('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    })
    return ((await res.json()) as { success?: boolean }).success === true
  } catch {
    return false
  }
}

/** Per-IP limit backed by Cloudflare's native Rate Limiting binding. */
export async function tooMany(
  limiter: RateLimiter | undefined,
  req: Request,
  bucket: string,
): Promise<boolean> {
  if (!limiter) return false
  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown'
  const outcome = await limiter.limit({ key: `${bucket}:${ip}` })
  return !outcome.success
}
