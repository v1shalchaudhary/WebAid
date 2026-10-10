"use client";

import { useState } from "react";
import AnimatedButton from "./AnimatedButton";

type Mode = "login" | "signup";

type PasswordRule = {
  label: string;
  test: (pw: string) => boolean;
};

const rules: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
];

export default function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; isPaid: boolean }) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passedRules = rules.filter((r) => r.test(password)).length;
  const pulseSpeed =
    password.length === 0 ? 3.2 : 3.2 - (passedRules / rules.length) * 2.2; // faster "heartbeat" as password gets stronger

  async function handleSubmit() {
    setError("");

    if (mode === "signup" && passedRules < rules.length) {
      setError("Password doesn't meet all the requirements below yet.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      onSuccess({ id: data.id, email: data.email, isPaid: !!data.isPaid });
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4">
      <div className="w-full max-w-[420px] bg-panel border border-line rounded-2xl p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 text-[14.5px] font-medium">
          <button
            onClick={() => setMode("login")}
            className={mode === "login" ? "text-white" : "text-muted hover:text-white"}
          >
            Log in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={mode === "signup" ? "text-white" : "text-muted hover:text-white"}
          >
            Sign up
          </button>
        </div>

        {/* Heart-rate pulse line — speeds up as password gets stronger */}
        <svg viewBox="0 0 400 60" className="w-full h-[44px] mb-5" preserveAspectRatio="none">
          <polyline
            points="0,30 60,30 75,8 90,52 105,30 180,30 195,12 210,48 225,30 300,30 315,8 330,52 345,30 400,30"
            fill="none"
            stroke="#E4E4E7"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            style={{
              strokeDasharray: "0.28 1",
              animation: `pulse-travel ${pulseSpeed}s linear infinite`,
            }}
          />
        </svg>
        <style>{`
          @keyframes pulse-travel {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -1; }
          }
        `}</style>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-panel2 border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-brand"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-panel2 border border-line rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-brand"
          />
        </div>

        {mode === "signup" && (
          <ul className="mt-3 space-y-1">
            {rules.map((rule) => {
              const passed = rule.test(password);
              return (
                <li
                  key={rule.label}
                  className={`text-[12.5px] flex items-center gap-2 ${
                    passed ? "text-good" : "text-muted"
                  }`}
                >
                  <span>{passed ? "✓" : "○"}</span> {rule.label}
                </li>
              );
            })}
          </ul>
        )}

        {error && <div className="mt-3 text-[13px] text-bad">{error}</div>}

        <AnimatedButton
          onClick={handleSubmit}
          className="w-full mt-5 btn-glass font-semibold text-[14.5px] py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </AnimatedButton>
      </div>
    </div>
  );
}
