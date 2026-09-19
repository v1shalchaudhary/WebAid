export default function ScanBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -inset-0.5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,108,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,108,255,0.05) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
        }}
      />
      <div
        className="scan-beam absolute left-[-20%] top-[-40%] w-[140%] h-[90%] mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(41,211,232,0.10) 48%, rgba(124,108,255,0.16) 50%, rgba(41,211,232,0.10) 52%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,108,255,0.10), transparent 60%)",
        }}
      />
    </div>
  );
}
