import AnimatedButton from "./AnimatedButton";

export default function Hero() {
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
            Drop in a URL, a GitHub repo, or a project file. SiteVitals reads
            its vitals across performance, security, accessibility and code
            quality, and scores it like a health bar —{" "}
            <span className="font-mono text-brand">100%</span> clean, or
            somewhere short of it.
          </p>

          <div className="flex gap-2.5 max-w-[480px]">
            <input
              type="text"
              placeholder="https://yoursite.com or github.com/you/repo"
              className="flex-1 bg-panel border border-line rounded-lg px-4 py-3.5 text-[14px] font-mono focus:outline-none focus:border-brand"
            />
            <AnimatedButton className="bg-brand hover:bg-[#8d7fff] text-ink font-semibold text-[14.5px] px-[22px] rounded-lg whitespace-nowrap">
              Run diagnostic
            </AnimatedButton>
          </div>

          <div className="mt-3.5 text-[13px] text-muted">
            3 free scans a month. No card required.
          </div>
        </div>

        <div className="bg-panel border border-line rounded-2xl p-6 shadow-[0_0_40px_rgba(41,211,232,0.05)]">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="font-mono text-xs text-muted">yoursite.com</span>
            <span className="font-mono text-[34px] font-semibold text-warn">
              62<sub className="text-[15px] text-muted font-normal">/100</sub>
            </span>
          </div>
          <svg
            viewBox="0 0 320 90"
            preserveAspectRatio="none"
            className="w-full h-[90px] my-1.5"
          >
            <polyline
              points="0,60 30,60 40,20 50,75 60,60 100,60 110,35 118,60 160,60 170,15 180,70 190,60 230,60 240,30 250,60 320,60"
              fill="none"
              stroke="#7C6CFF"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex justify-between font-mono text-[11.5px] text-muted">
            <span>SCANNED 4S AGO</span>
            <span className="text-warn">3 CRITICAL · 7 WARNINGS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
