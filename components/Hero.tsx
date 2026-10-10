"use client";

import { useState } from "react";
import AnimatedButton from "./AnimatedButton";

type ScanIssue = { severity: "critical" | "warning" | "minor"; message: string };
type ScanResult = {
  id: string;
  url: string;
  score: number;
  statusCode: number;
  responseTimeMs: number;
  issues: ScanIssue[];
};
type FixStep = { title: string; description: string };
type Fix = { issue: string; severity: string; steps: FixStep[] };

const tagStyles: Record<string, string> = {
  critical: "bg-bad/15 text-bad",
  warning: "bg-warn/15 text-warn",
  minor: "bg-muted/15 text-muted",
};

type FixState = "idle" | "loading" | "need-login" | "need-upgrade" | "ready" | "error";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  const [fixState, setFixState] = useState<FixState>("idle");
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [upgrading, setUpgrading] = useState(false);

  async function handleScan() {
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);
    setFixState("idle");
    setFixes([]);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  }

async function handleSeeFixes() {
  if (!result) return;
  setFixState("loading");

  try {
    const res = await fetch(`/api/scan/${result.id}/fix`);
    const data = await res.json();

    if (res.status === 401) {
      setFixState("need-login");
    } else if (res.status === 402) {
      setFixState("need-upgrade");
    } else if (res.ok) {
      setFixes(data.fixes);
      setFixState("ready");
    } else {
      console.error("Unexpected fix response:", res.status, data);
      setFixState("error");
    }
  } catch (err) {
    console.error("Fix request failed:", err);
    setFixState("error");
  }
}
  async function handleUpgrade() {
    setUpgrading(true);
    await fetch("/api/auth/upgrade", { method: "POST" });
    setUpgrading(false);
    handleSeeFixes(); // retry immediately now that they're paid
  }

  const scoreColor = "text-white";
  return (
    <section className="py-16 md:py-[76px]">
      <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-center">
        <div>
          <div className="flex items-center gap-2.5 mb-5 text-glow font-mono text-[13px]">
            <span className="eyebrow-dot w-[7px] h-[7px] rounded-full bg-glow" />
            Live diagnostic for websites &amp; codebases
          </div>

          <h1 className="text-4xl md:text-[52px] leading-[1.06] font-bold tracking-tight mb-5 max-w-[620px]">
            Find out what&apos;s actually wrong with your site — then fix it,
            step by step.
          </h1>

          <p className="text-[17px] leading-relaxed text-muted max-w-[460px] mb-8">
            Drop in a URL and WebAid reads its vitals across performance,
            security, and SEO, scoring it like a health bar —{" "}
            <span className="font-mono text-brand">100%</span> clean, or
            somewhere short of it.
          </p>

          <div className="flex gap-2.5 max-w-[480px]">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="flex-1 bg-panel border border-line rounded-lg px-4 py-3.5 text-[14px] font-mono focus:outline-none focus:border-brand"
            />
            <AnimatedButton
              onClick={handleScan}
              className="btn-glass font-semibold text-[14.5px] px-[22px] rounded-lg whitespace-nowrap disabled:opacity-60"
            >
              {loading ? "Scanning..." : "Run diagnostic"}
            </AnimatedButton>
          </div>

          {error && <div className="mt-3.5 text-[13px] text-bad">{error}</div>}
          {!error && (
            <div className="mt-3.5 text-[13px] text-muted">
              Unlimited scans. 3 free step-by-step fixes a month.
            </div>
          )}
        </div>

        <div className="bg-panel border border-line rounded-2xl p-6 shadow-[0_0_40px_rgba(41,211,232,0.05)]">
          {result ? (
            <>
              <div className="flex items-baseline justify-between mb-1.5 gap-3">
                <span className="font-mono text-xs text-muted truncate">{result.url}</span>
                <span className={`font-mono text-[34px] font-semibold ${scoreColor} flex-shrink-0`}>
                  {result.score}
                  <sub className="text-[15px] text-muted font-normal">/100</sub>
                </span>
              </div>
              <div className="font-mono text-[11.5px] text-muted mt-5">
                {result.statusCode} · {result.responseTimeMs}ms response time
              </div>
              <div className="font-mono text-[11.5px] mt-1 text-warn">
                {result.issues.length === 0 ? "No issues found" : `${result.issues.length} issue(s) found`}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-mono text-xs text-muted">waiting for a scan</span>
                <span className="font-mono text-[34px] font-semibold text-muted">
                  --<sub className="text-[15px] font-normal">/100</sub>
                </span>
              </div>
              <div className="font-mono text-[11.5px] text-muted mt-5">
                Enter a URL and click Run diagnostic
              </div>
            </>
          )}
        </div>
      </div>

      {result && result.issues.length > 0 && (
        <div className="mt-10 bg-panel border border-line rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-line font-mono text-[12.5px] text-muted flex justify-between">
            <span>ISSUE LOG</span>
            <span>SEVERITY</span>
          </div>
          {result.issues.map((issue, i) => (
            <div key={i} className="flex gap-3.5 px-5 py-4 border-b border-line last:border-none items-start">
              <span className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded mt-0.5 flex-shrink-0 ${tagStyles[issue.severity]}`}>
                {issue.severity.toUpperCase()}
              </span>
              <div className="text-[14px]">{issue.message}</div>
            </div>
          ))}
        </div>
      )}

      {result && result.issues.length > 0 && fixState === "idle" && (
        <div className="mt-5">
          <AnimatedButton
            onClick={handleSeeFixes}
            className="btn-glass font-semibold text-[14px] px-6 py-3 rounded-lg"
          >
            See step-by-step fixes
          </AnimatedButton>
        </div>
      )}

      {fixState === "loading" && (
        <div className="mt-5 text-[13.5px] text-muted">Checking access…</div>
      )}

      {fixState === "need-login" && (
        <div className="mt-5 bg-panel border border-line rounded-xl p-5 text-[13.5px] text-muted">
          Sign in (top right) to unlock step-by-step fixes.
        </div>
      )}

      {fixState === "need-upgrade" && (
        <div className="mt-5 bg-panel border border-branddim rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-[13.5px] text-muted">
            You&apos;ve used your 3 free step-by-step fixes this month. Upgrade to Pro for unlimited fixes.
          </span>
          <AnimatedButton
            onClick={handleUpgrade}
            className="btn-glass font-semibold text-[13.5px] px-5 py-2.5 rounded-lg whitespace-nowrap"
          >
            {upgrading ? "Upgrading..." : "Upgrade to Pro — $19/mo"}
          </AnimatedButton>
        </div>
      )}

      {fixState === "ready" && (
        <div className="mt-5 space-y-5">
          {fixes.map((fix, i) => (
            <div key={i} className="bg-panel border border-line rounded-xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <span className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded ${tagStyles[fix.severity]}`}>
                  {fix.severity.toUpperCase()}
                </span>
                <span className="text-[14.5px] font-medium">{fix.issue}</span>
              </div>
              {fix.steps.map((step, j) => (
                <div key={j} className="flex gap-3.5 mb-4 last:mb-0">
                  <div className="w-[24px] h-[24px] rounded-full bg-panel2 border border-line flex items-center justify-center font-mono text-[11px] text-muted flex-shrink-0">
                    {j + 1}
                  </div>
                  <div>
                    <div className="text-[14px] font-medium mb-0.5">{step.title}</div>
                    <div className="text-[13px] text-muted leading-relaxed">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
