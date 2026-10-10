"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AnimatedButton from "./AnimatedButton";
import AuthModal from "./AuthModal";

type User = { id: string; email: string; isPaid: boolean; isAdmin: boolean };

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="pt-7">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
          <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M2 12h4l2 7 4-14 2 7h8"
              stroke="#E4E4E7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          WebAid
        </Link>

        <nav className="hidden md:flex gap-7 text-[14.5px] text-muted">
          <Link href="/#pricing" className="hover:text-white">Pricing</Link>
          {user && <Link href="/profile" className="hover:text-white">Profile</Link>}
          {user?.isAdmin && <Link href="/admin" className="hover:text-white">Admin</Link>}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-[13.5px] text-muted font-mono truncate max-w-[160px]">
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
          <Link
            href="/"
            className="btn-glass font-semibold text-[14.5px] px-[18px] py-[10px] rounded-[7px]"
          >
            Scan your site
          </Link>
        </div>
      </div>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
       onSuccess={async () => {
         const res = await fetch("/api/auth/me");
         const data = await res.json();
         setUser(data.user ?? null);
         setShowModal(false);
         window.dispatchEvent(new Event("auth-changed"));
         if (data.user?.isAdmin) window.location.href = "/admin";
       }}
        />
      )}
    </header>
  );
}
