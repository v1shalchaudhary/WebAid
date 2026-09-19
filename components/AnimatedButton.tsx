"use client";

import { useState } from "react";

type Ripple = { id: number; x: number; y: number; size: number };

export default function AnimatedButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [flash, setFlash] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const id = Date.now();

    setRipples((prev) => [
      ...prev,
      {
        id,
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
        size,
      },
    ]);
    setFlash(true);

    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 620);
    setTimeout(() => setFlash(false), 350);

    onClick?.();
  }

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden transition-transform duration-150 active:scale-95 ${
        flash
          ? "shadow-[0_0_0_3px_rgba(124,108,255,0.35),0_0_24px_rgba(41,211,232,0.35)]"
          : ""
      } ${className}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple absolute rounded-full bg-white/55 pointer-events-none"
          style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
        />
      ))}
    </button>
  );
}
