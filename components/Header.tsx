"use client";

import { useEffect, useState } from "react";
import AnimatedButton from "./AnimatedButton";
import AuthModal from "./AuthModal";

type User = { id: string; email: string; isPaid: boolean };

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <header className="pt-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
          <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12h4l2 7 4-14 2 7h8"
              stroke="#7C6CFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          SiteVitals
        </div>

        <nav className="hidden md:flex gap-7 text-[14.5px] text-muted">
          <a href="#vitals" className="hover:text-white">How it works</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#log" className="hover:text-white">Sample scan</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-[13.5px] text-muted font-mono truncate max-w-[140px]">
                {user.email}
              </span>
              <AnimatedButton
                onClick={handleSignOut}
                className="text-[14.5px] text-muted hover:text-white"
              >
                Sign out
              </AnimatedButton>
            </>
          ) : (
            <AnimatedButton
              onClick={() => setShowModal(true)}
              className="text-[14.5px] text-muted hover:text-white"
            >
              Sign in
            </AnimatedButton>
          )}
          <AnimatedButton className="bg-brand hover:bg-[#8d7fff] text-ink font-semibold text-[14.5px] px-[18px] py-[10px] rounded-[7px]">
            Scan your site
          </AnimatedButton>
        </div>
      </div>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setShowModal(false);
          }}
        />
      )}
    </header>
  );
}
