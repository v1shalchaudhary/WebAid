import AnimatedButton from "./AnimatedButton";

export default function Header() {
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
          <a href="#vitals" className="hover:text-white">
            How it works
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="#log" className="hover:text-white">
            Sample scan
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <AnimatedButton className="text-[14.5px] text-muted hover:text-white">
            Sign in
          </AnimatedButton>
          <AnimatedButton className="bg-brand hover:bg-[#8d7fff] text-ink font-semibold text-[14.5px] px-[18px] py-[10px] rounded-[7px]">
            Scan your site
          </AnimatedButton>
        </div>
      </div>
    </header>
  );
}
