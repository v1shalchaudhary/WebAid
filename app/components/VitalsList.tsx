type Status = "good" | "warn" | "bad";

type Vital = {
  name: string;
  score: number;
  detail: string;
  status: Status;
};

const vitals: Vital[] = [
  { name: "Performance", score: 58, detail: "3.4s load time", status: "warn" },
  { name: "Security", score: 34, detail: "2 exposed headers", status: "bad" },
  { name: "Accessibility", score: 88, detail: "4 minor issues", status: "good" },
  { name: "SEO", score: 71, detail: "missing meta tags", status: "warn" },
  { name: "Code quality", score: 80, detail: "low complexity", status: "good" },
];

const colorMap: Record<Status, { text: string; bg: string }> = {
  good: { text: "text-good", bg: "bg-good" },
  warn: { text: "text-warn", bg: "bg-warn" },
  bad: { text: "text-bad", bg: "bg-bad" },
};

export default function VitalsList() {
  return (
    <section id="vitals" className="py-16 border-t border-line">
      <div className="flex items-baseline justify-between mb-7 gap-5 flex-wrap">
        <h2 className="text-2xl md:text-[26px] font-semibold tracking-tight">
          Vitals
        </h2>
        <span className="font-mono text-[13px] text-muted">
          yoursite.com — scanned just now
        </span>
      </div>

      {vitals.map((v) => (
        <div
          key={v.name}
          className="grid grid-cols-[100px_1fr_50px] sm:grid-cols-[170px_1fr_90px_70px] items-center gap-4 py-4 border-b border-line last:border-none"
        >
          <div className="text-[15px] font-medium">{v.name}</div>
          <div className="h-2 rounded-full bg-panel2 overflow-hidden">
            <div
              className={`h-full rounded-full ${colorMap[v.status].bg}`}
              style={{ width: `${v.score}%` }}
            />
          </div>
          <div className="hidden sm:block font-mono text-[12.5px] text-muted text-right">
            {v.detail}
          </div>
          <div
            className={`font-mono text-[15px] font-semibold text-right ${colorMap[v.status].text}`}
          >
            {v.score}
          </div>
        </div>
      ))}
    </section>
  );
}
