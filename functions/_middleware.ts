interface Context {
  request: Request
  next: () => Promise<Response>
}

/** Keep one secure, canonical origin even before a browser has cached HSTS. */
export const onRequest = async (ctx: Context): Promise<Response> => {
  const url = new URL(ctx.request.url)
  // Cloudflare normalises Request.url to https at the Worker boundary, so
  // use its forwarding headers to identify an original plain-HTTP request.
  const visitor = ctx.request.headers.get('cf-visitor') ?? ''
  const forwardedProto = ctx.request.headers.get('x-forwarded-proto')
  const needsHttps =
    url.protocol !== 'https:' ||
    forwardedProto === 'http' ||
    visitor.includes('"scheme":"http"')
  const needsApex = url.hostname === 'www.soochi.fyi'

  if (needsHttps || needsApex) {
    url.protocol = 'https:'
    url.hostname = 'soochi.fyi'
    return Response.redirect(url, 308)
  }

  return ctx.next()
}
