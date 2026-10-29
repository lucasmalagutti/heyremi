export function parseCookies(req, res, next) {
  req.cookies = {};
  const header = req.headers.cookie;
  if (header) {
    for (const part of header.split(";")) {
      const separator = part.indexOf("=");
      if (separator > 0) {
        const name = part.slice(0, separator).trim();
        const value = part.slice(separator + 1).trim();
        req.cookies[name] = decodeURIComponent(value);
      }
    }
  }
  next();
}

export function setCookie(res, name, value, options = {}) {
  const attributes = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge) attributes.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  if (options.httpOnly) attributes.push("HttpOnly");
  if (options.sameSite) attributes.push(`SameSite=${options.sameSite}`);
  if (options.secure) attributes.push("Secure");
  res.append("Set-Cookie", attributes.join("; "));
}

export function clearCookie(res, name) {
  res.append("Set-Cookie", `${name}=; Max-Age=0; HttpOnly; SameSite=Lax`);
}
