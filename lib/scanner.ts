import * as cheerio from "cheerio";

export type Issue = {
  severity: "critical" | "warning" | "minor";
  message: string;
};

export type ScanResult = {
  score: number;
  issues: Issue[];
};

export function runChecks(
  finalUrl: string,
  statusCode: number,
  responseTimeMs: number,
  html: string
): ScanResult {
  const issues: Issue[] = [];
  let score = 100;

  if (responseTimeMs > 2000) {
    issues.push({ severity: "warning", message: "Site takes over 2 seconds to respond" });
    score -= 15;
  }

  if (statusCode >= 400) {
    issues.push({ severity: "critical", message: `Site returned an error status: ${statusCode}` });
    score -= 40;
  }

  if (!finalUrl.startsWith("https://")) {
    issues.push({ severity: "critical", message: "Site is not using HTTPS — traffic isn't encrypted" });
    score -= 25;
  }

  const $ = cheerio.load(html);

  const title = $("title").text().trim();
  if (!title) {
    issues.push({ severity: "warning", message: "Page is missing a <title> tag — hurts SEO" });
    score -= 10;
  }

  const metaDescription = $('meta[name="description"]').attr("content");
  if (!metaDescription) {
    issues.push({ severity: "warning", message: "Page is missing a meta description — hurts SEO" });
    score -= 10;
  }

  const imagesWithoutAlt = $("img:not([alt])").length;
  if (imagesWithoutAlt > 0) {
    issues.push({
      severity: "minor",
      message: `${imagesWithoutAlt} image(s) missing alt text — hurts accessibility`,
    });
    score -= Math.min(10, imagesWithoutAlt * 2);
  }

  score = Math.max(0, Math.min(100, score));
  return { score, issues };
}