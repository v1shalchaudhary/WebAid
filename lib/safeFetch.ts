import dns from "dns/promises";
import net from "net";

// Errors with a message that is safe to show to the user.
export class ScanUrlError extends Error {}

const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 10_000;
const MAX_BYTES = 2 * 1024 * 1024; // read at most 2 MB of a page

export function normalizeUrl(input: string): URL {
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ScanUrlError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ScanUrlError("Only http and https URLs can be scanned.");
  }
  if (url.username || url.password) {
    throw new ScanUrlError("URLs containing a username or password aren't allowed.");
  }
  return url;
}

function isPrivateIPv4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, includes cloud metadata 169.254.169.254
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    a >= 224 // multicast and reserved
  );
}

function isPrivateIPv6(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === "::1" || v === "::") return true;
  if (v.startsWith("fc") || v.startsWith("fd")) return true; // unique local
  if (/^fe[89ab]/.test(v)) return true; // link-local
  if (v.startsWith("::ffff:")) {
    const mapped = v.slice(7);
    return net.isIPv4(mapped) ? isPrivateIPv4(mapped) : true;
  }
  return false;
}

async function assertPublicHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new ScanUrlError("That address points to a private network and can't be scanned.");
  }

  const addresses = net.isIP(host)
    ? [{ address: host }]
    : await dns.lookup(host, { all: true });

  for (const { address } of addresses) {
    const isPrivate = net.isIPv4(address) ? isPrivateIPv4(address) : isPrivateIPv6(address);
    if (isPrivate) {
      throw new ScanUrlError("That address points to a private network and can't be scanned.");
    }
  }
}

async function readCapped(response: Response, maxBytes: number): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

// Fetches a page the safe way: every hop (including redirects) is checked
// against private addresses, with a timeout and a size cap.
export async function safeFetch(startUrl: URL) {
  const started = Date.now();
  let current = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicHost(current.hostname);

    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel();
      current = new URL(location, current);
      if (current.protocol !== "http:" && current.protocol !== "https:") {
        throw new ScanUrlError("The site redirected to an unsupported address.");
      }
      continue;
    }

    const responseTimeMs = Date.now() - started;
    const html = await readCapped(response, MAX_BYTES);
    return { finalUrl: current.toString(), statusCode: response.status, responseTimeMs, html };
  }

  throw new ScanUrlError("The site redirected too many times.");
}
