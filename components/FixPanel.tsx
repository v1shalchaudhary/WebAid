import AnimatedButton from "./AnimatedButton";

const steps = [
  {
    title: "Move the Stripe key to an environment variable",
    desc: "Never ship secret keys inside code that reaches the browser. Store it server-side and read it at request time.",
  },
  {
    title: "Rotate the exposed key immediately",
    desc: "Once a key has been public, treat it as compromised. Generate a new one from your Stripe dashboard.",
  },
  {
    title: "Add a redirect rule for HTTP → HTTPS",
    desc: "Configure your host or reverse proxy to force every request onto a secure connection.",
  },
];

export default function FixPanel() {
  return (
    <section className="py-16 border-t border-line">
      <div className="flex items-baseline justify-between mb-7 gap-5 flex-wrap">
        <h2 className="text-2xl md:text-[26px] font-semibold tracking-tight">
          The fix
        </h2>
        <span className="font-mono text-[13px] text-muted">
          unlocks with a plan
        </span>
      </div>

      <div className="relative bg-panel border border-line rounded-xl p-7 overflow-hidden">
        <div className="blur-[5px] opacity-55 select-none pointer-events-none">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-3.5 mb-5 last:mb-0">
              <div className="w-[26px] h-[26px] rounded-full bg-panel2 border border-line flex items-center justify-center font-mono text-xs text-muted flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <div className="text-[14.5px] font-medium mb-0.5">
                  {s.title}
                </div>
                <div className="text-[13px] text-muted leading-relaxed max-w-[480px]">
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 bg-gradient-to-b from-ink/20 to-ink/95">
          <svg
            className="w-[34px] h-[34px] mb-3.5 text-brand"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="5"
              y="11"
              width="14"
              height="9"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M8 11V7a4 4 0 0 1 8 0v4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-[17px] font-semibold mb-1.5">
            Unlock step-by-step fixes
          </div>
          <p className="text-[13.5px] text-muted max-w-[340px] mb-4 leading-relaxed">
            Seeing what&apos;s wrong is free. Fixing it — with exact steps for
            your code — needs a plan.
          </p>
          <AnimatedButton className="bg-brand hover:bg-[#8d7fff] text-ink font-semibold text-[14px] px-[22px] py-[11px] rounded-lg">
            See plans
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
