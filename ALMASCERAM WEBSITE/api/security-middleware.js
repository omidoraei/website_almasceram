// Serverless Security Middleware & Rate Limiter for Almas Ceram API
const rateLimitMap = new Map();

export function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';");
}

export function checkRateLimit(req, res, maxRequests = 15, windowMs = 15000) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp) || { count: 0, firstRequest: now };

  if (now - clientData.firstRequest > windowMs) {
    rateLimitMap.set(clientIp, { count: 1, firstRequest: now });
    return false; // Allowed
  }

  clientData.count += 1;
  rateLimitMap.set(clientIp, clientData);

  if (clientData.count > maxRequests) {
    res.status(429).json({
      error: 'تعداد درخواست‌های بیش از حد مجاز. لطفاً ۱۵ ثانیه صبر کرده و مجدداً تلاش نمایید.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
    return true; // Blocked
  }

  return false; // Allowed
}
