export function DecorativeBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-right warm-amber halo */}
      <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle_at_center,_rgba(224,168,91,0.18),_transparent_70%)] blur-2xl" />
      {/* Bottom-left brown halo */}
      <div className="absolute -bottom-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle_at_center,_rgba(91,58,41,0.14),_transparent_70%)] blur-2xl" />

      {/* Right-side concentric arcs — seigaiha echo */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={`curve-right-${i}`}
            className="absolute border-[1px] border-[color:var(--kohaku-soft)] opacity-[0.18]"
            style={{
              width: `${(i + 1) * 11}%`,
              height: `${(i + 1) * 22}%`,
              top: `${8 + i * 5}%`,
              right: `-${i * 2}%`,
              borderRadius: '50% 0 0 50%',
            }}
          />
        ))}
      </div>

      {/* Left-side concentric arcs */}
      <div className="absolute bottom-0 left-0 w-1/2 h-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={`curve-left-${i}`}
            className="absolute border-[1px] border-[color:var(--kasshoku)] opacity-[0.10]"
            style={{
              width: `${(i + 1) * 11}%`,
              height: `${(i + 1) * 22}%`,
              bottom: `${8 + i * 5}%`,
              left: `-${i * 2}%`,
              borderRadius: '0 50% 50% 0',
            }}
          />
        ))}
      </div>

      {/* Subtle paper grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}
