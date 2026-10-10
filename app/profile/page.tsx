"use client";

import { useCallback, useEffect, useState } from "react";
import ScanBackground from "@/components/ScanBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedButton from "@/components/AnimatedButton";

type Me = {
  user: { id: string; email: string; isPaid: boolean; isAdmin: boolean } | null;
  usage?: { fixesUsed: number; fixesLimit: number; unlimited: boolean };
};
type ScanRow = { id: string; url: string; score: number; createdAt: string };

function scoreColor(score: number) {
  return score >= 80 ? "text-good" : score >= 50 ? "text-warn" : "text-bad";
}

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [scans, setScans] = useState<ScanRow[]>([]);

  const load = useCallback(async () => {
    const meData: Me = await fetch("/api/auth/me").then((r) => r.json());
    setMe(meData);
    if (meData.user) {
      const res = await fetch("/api/scan");
      setScans(res.ok ? await res.json() : []);
    } else {
      setScans([]);
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("auth-changed", load);
    return () => window.removeEventListener("auth-changed", load);
  }, [load]);

  async function upgrade() {
    await fetch("/api/auth/upgrade", { method: "POST" });
    load();
  }

  const user = me?.user;
  const usage = me?.usage;
  const plan = user?.isAdmin ? "Admin" : user?.isPaid ? "Pro" : "Free";
  const used = usage?.fixesUsed ?? 0;
  const limit = usage?.fixesLimit ?? 3;
  const pct = Math.min(100, (used / limit) * 100);
  const full = !usage?.unlimited && used >= limit;
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ScanBackground />
      <div className="max-w-[1080px] mx-auto px-7 relative z-10">
        <Header />
        <main className="py-14 max-w-[680px]">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Your profile</h1>

          {me === null ? (
            <div className="text-[14px] text-muted">Loading…</div>
          ) : !user ? (
            <div className="text-[14px] text-muted">Sign in (top right) to see your profile.</div>
          ) : (
            <>
              <div className="bg-panel border border-line rounded-xl p-6 mb-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[13px] text-muted mb-1">Signed in as</div>
                  <div className="font-mono text-[15px]">{user.email}</div>
                </div>
                <span className="font-mono text-[12px] font-semibold px-3 py-1 rounded bg-brand/15 text-brand">
                  {plan.toUpperCase()}
                </span>
              </div>

              <div className="bg-panel border border-line rounded-xl p-6 mb-5">
                <div className="text-[15px] font-medium mb-1">Step-by-step fixes</div>
                {usage?.unlimited ? (
                  <div className="text-[13.5px] text-muted">Unlimited on your plan.</div>
                ) : (
                  <>
                    <div className="text-[13.5px] text-muted mb-4">
                      {used} of {limit} free fixes used this month · resets {resetDate}
                    </div>
                    <div className="h-2 rounded-full bg-panel2 overflow-hidden mb-5">
                      <div
                        className={`h-full rounded-full ${full ? "bg-bad" : "bg-brand"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <AnimatedButton
                      onClick={upgrade}
                      className="bg-brand hover:bg-[#8d7fff] text-ink font-semibold text-[14px] px-5 py-2.5 rounded-lg"
                    >
                      Upgrade to Pro
                    </AnimatedButton>
                  </>
                )}
                <div className="text-[12.5px] text-muted mt-4">
                  Scans and health scores are always unlimited.
                </div>
              </div>

              <div className="bg-panel border border-line rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-line font-mono text-[12.5px] text-muted">
                  RECENT SCANS
                </div>
                {scans.length === 0 ? (
                  <div className="px-5 py-4 text-[13.5px] text-muted">
                    No scans yet. Scans made while signed in show up here.
                  </div>
                ) : (
                  scans.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-line last:border-none"
                    >
                      <span className="font-mono text-[13px] truncate">{s.url}</span>
                      <span className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-[12px] text-muted">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`font-mono text-[14px] font-semibold ${scoreColor(s.score)}`}>
                          {s.score}
                        </span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

