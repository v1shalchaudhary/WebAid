"use client";

import { useState } from "react";
import AnimatedButton from "./AnimatedButton";

export default function PricingCards() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "need-login">("idle");

  async function handleUpgrade() {
    setStatus("loading");
    const res = await fetch("/api/auth/upgrade", { method: "POST" });

    if (res.status === 401) {
      setStatus("need-login");
      return;
    }
    setStatus("done");
  }

  return (
    <section id="pricing" className="py-16 border-t border-line">
      <h2 className="text-2xl md:text-[26px] font-semibold tracking-tight mb-7">Plans</h2>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-panel border border-line rounded-xl p-6">
          <div className="text-sm text-muted mb-2">Free</div>
          <div className="font-mono text-3xl font-semibold mb-1">
            $0<span className="text-sm text-muted font-normal"> /month</span>
          </div>
          <div className="text-[13.5px] text-muted mb-5">
            Check your vitals, see what&apos;s wrong.
          </div>
          <ul className="text-[13.5px] mb-5">
            {["3 scans a month", "Full vitals & health score", "Issue log with severity"].map(
              (item) => (
                <li key={item} className="py-1.5 border-t border-line first:border-none flex gap-2">
                  <span className="text-good">✓</span> {item}
                </li>
              )
            )}
          </ul>
          <div className="w-full border border-line rounded-lg py-2.5 text-center text-muted text-[14px]">
            You&apos;re already on this plan
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand/10 to-panel border border-branddim rounded-xl p-6">
          <div className="text-sm text-muted mb-2">Pro</div>
          <div className="font-mono text-3xl font-semibold mb-1">
            $19<span className="text-sm text-muted font-normal"> /month</span>
          </div>
          <div className="text-[13.5px] text-muted mb-5">
            Everything, plus the actual fixes.
          </div>
          <ul className="text-[13.5px] mb-5">
            {[
              "Unlimited scans",
              "Step-by-step fix instructions",
              "GitHub & project file uploads",
            ].map((item) => (
              <li key={item} className="py-1.5 border-t border-line first:border-none flex gap-2">
                <span className="text-good">✓</span> {item}
              </li>
            ))}
          </ul>

          {status === "done" ? (
            <div className="w-full bg-good/15 text-good font-semibold rounded-lg py-2.5 text-center text-[14px]">
              You&apos;re on Pro 🎉
            </div>
          ) : status === "need-login" ? (
            <div className="text-[13px] text-bad text-center">Sign in first (top right), then try again.</div>
          ) : (
            <AnimatedButton
              onClick={handleUpgrade}
              className="w-full bg-brand hover:bg-[#8d7fff] text-ink font-semibold rounded-lg py-2.5"
            >
              {status === "loading" ? "Upgrading..." : "Upgrade to Pro"}
            </AnimatedButton>
          )}
        </div>
      </div>
    </section>
  );
}
