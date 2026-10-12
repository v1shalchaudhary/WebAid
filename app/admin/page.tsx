"use client";

import { useCallback, useEffect, useState } from "react";
import ScanBackground from "@/components/ScanBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedButton from "@/components/AnimatedButton";

type Row = {
  id: string;
  email: string;
  isPaid: number;
  createdAt: string;
  scanCount: number;
  fixesThisMonth: number;
};
async function fetchUsers(): Promise<Row[] | null> {
  const res = await fetch("/api/admin/users");
  return res.ok ? await res.json() : null;
}
export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");

    const load = useCallback(async () => {
    const data = await fetchUsers();
    if (data) {
      setRows(data);
      setStatus("ok");
    } else {
      setStatus("denied");
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchUsers().then((data) => {
      if (!active) return;
      if (data) {
        setRows(data);
        setStatus("ok");
      } else {
        setStatus("denied");
      }
    });
    window.addEventListener("auth-changed", load);
    return () => {
      active = false;
      window.removeEventListener("auth-changed", load);
    };
  }, [load]);

  async function togglePro(row: Row) {
    await fetch(`/api/admin/users/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid: !row.isPaid }),
    });
    load();
  }

  return (
    <>
      <ScanBackground />
      <div className="max-w-[1080px] mx-auto px-7 relative z-10">
        <Header />
        <main className="py-14">
                    <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
            <a
              href="/api/admin/backup"
              className="btn-glass font-semibold text-[13.5px] px-4 py-2 rounded-lg"
            >
              Download backup
            </a>
          </div>

          {status === "loading" && <div className="text-[14px] text-muted">Loading…</div>}
          {status === "denied" && (
            <div className="text-[14px] text-bad">Not authorized. Sign in with an admin account.</div>
          )}

          {status === "ok" && (
            <div className="bg-panel border border-line rounded-xl overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.8fr_0.9fr_1fr] gap-4 px-5 py-3.5 border-b border-line font-mono text-[12px] text-muted">
                  <span>EMAIL</span>
                  <span>PLAN</span>
                  <span>SCANS</span>
                  <span>FIXES (MONTH)</span>
                  <span>JOINED</span>
                  <span />
                </div>
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.8fr_0.9fr_1fr] gap-4 px-5 py-3.5 border-b border-line last:border-none items-center text-[13.5px]"
                  >
                    <span className="font-mono truncate">{r.email}</span>
                    <span className={r.isPaid ? "text-brand" : "text-muted"}>{r.isPaid ? "Pro" : "Free"}</span>
                    <span>{r.scanCount}</span>
                    <span>{r.fixesThisMonth}</span>
                    <span className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                    <AnimatedButton
                      onClick={() => togglePro(r)}
                      className="border border-line rounded-lg px-3 py-1.5 text-[13px] text-muted hover:text-white"
                    >
                      {r.isPaid ? "Revoke Pro" : "Grant Pro"}
                    </AnimatedButton>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
