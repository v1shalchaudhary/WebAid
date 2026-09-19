type Severity = "CRITICAL" | "WARNING" | "MINOR";

type Issue = {
  severity: Severity;
  title: string;
  desc: string;
  where: string;
};

const issues: Issue[] = [
  {
    severity: "CRITICAL",
    title: "API keys exposed in client-side bundle",
    desc: "A Stripe secret key was found readable in your main.js file. Anyone can extract it.",
    where: "main.js:214",
  },
  {
    severity: "CRITICAL",
    title: "Missing HTTPS redirect",
    desc: "HTTP requests aren't forced to HTTPS, leaving visitors open to interception.",
    where: "server config",
  },
  {
    severity: "WARNING",
    title: "Largest image isn't compressed",
    desc: "hero-banner.png is 4.1MB and loads uncompressed, slowing your homepage down.",
    where: "index.html",
  },
  {
    severity: "MINOR",
    title: "Three images missing alt text",
    desc: "Screen readers can't describe these images to visually impaired visitors.",
    where: "gallery.html",
  },
];

const tagStyles: Record<Severity, string> = {
  CRITICAL: "bg-bad/15 text-bad",
  WARNING: "bg-warn/15 text-warn",
  MINOR: "bg-muted/15 text-muted",
};

export default function IssueLog() {
  return (
    <section id="log" className="py-16 border-t border-line">
      <div className="flex items-baseline justify-between mb-7 gap-5 flex-wrap">
        <h2 className="text-2xl md:text-[26px] font-semibold tracking-tight">
          What we found
        </h2>
        <span className="font-mono text-[13px] text-muted">
          {issues.length} issues · sorted by severity
        </span>
      </div>

      <div className="bg-panel border border-line rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-line font-mono text-[12.5px] text-muted flex justify-between">
          <span>ISSUE LOG</span>
          <span>SEVERITY</span>
        </div>

        {issues.map((issue) => (
          <div
            key={issue.title}
            className="flex gap-3.5 px-5 py-4 border-b border-line last:border-none items-start"
          >
            <span
              className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded mt-0.5 flex-shrink-0 ${tagStyles[issue.severity]}`}
            >
              {issue.severity}
            </span>
            <div>
              <div className="text-[14.5px] font-medium mb-0.5">
                {issue.title}
              </div>
              <div className="text-[13.5px] text-muted leading-relaxed">
                {issue.desc}
              </div>
            </div>
            <span className="font-mono text-xs text-muted ml-auto pt-0.5 whitespace-nowrap">
              {issue.where}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
