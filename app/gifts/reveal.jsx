// Cinematic animal reveal screen.
// Sequence: dark interlude → animated halo + emoji glyph → name → description → CTA

function AnimalGlyph({ animal, phase }) {
  // Painterly halo composition. The "silhouette draw-in" is expressed via
  // animated dashed path strokes around the central glyph.
  const palette = animal.palette;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 360,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 360 360"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {/* Outer dashed ring — slow rotation */}
        <circle
          cx="180" cy="180" r="172"
          fill="none"
          stroke={palette.accent}
          strokeWidth="0.8"
          strokeDasharray="2 8"
          opacity={phase >= 2 ? 0.5 : 0}
          style={{ transition: "opacity 1.4s ease 0.4s", transformOrigin: "180px 180px", animation: "ring-spin 80s linear infinite" }}
        />

        {/* Big atmospheric blob behind — softens the surface */}
        <circle
          cx="180" cy="180" r="120"
          fill={palette.surface}
          opacity={phase >= 1 ? 1 : 0}
          style={{ transition: "opacity 0.8s ease 0.1s, transform 1.2s cubic-bezier(.2,.7,.2,1) 0.1s", transformOrigin: "180px 180px", transform: phase >= 1 ? "scale(1)" : "scale(0.7)" }}
        />

        {/* Stroke-in main ring (the "silhouette draw-in") */}
        <circle
          cx="180" cy="180" r={radius}
          fill="none"
          stroke={palette.accent}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={phase >= 2 ? 0 : circumference}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) 0.4s", transformOrigin: "180px 180px", transform: "rotate(-90deg)" }}
        />

        {/* Inner accent disk */}
        <circle
          cx="180" cy="180" r="100"
          fill={palette.bg}
          opacity={phase >= 2 ? 1 : 0}
          style={{ transition: "opacity 0.6s ease 1.4s" }}
        />

        {/* Soft accent dot orbiting */}
        <g style={{ transformOrigin: "180px 180px", animation: "ring-spin 18s linear infinite" }}>
          <circle cx="180" cy="40" r="4" fill={palette.accent} opacity={phase >= 2 ? 0.9 : 0} style={{ transition: "opacity 0.6s ease 1.4s" }} />
        </g>

        {/* Tiny secondary dot */}
        <g style={{ transformOrigin: "180px 180px", animation: "ring-spin 28s linear infinite reverse" }}>
          <circle cx="180" cy="60" r="2.5" fill={palette.accent} opacity={phase >= 2 ? 0.6 : 0} style={{ transition: "opacity 0.6s ease 1.6s" }} />
        </g>
      </svg>

      {/* Emoji glyph — centerpiece. Fades and scales in after halo strokes. */}
      <div
        style={{
          position: "relative",
          fontSize: 132,
          lineHeight: 1,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "scale(1)" : "scale(0.7)",
          transition: "opacity 0.8s cubic-bezier(.2,.7,.2,1) 1.5s, transform 1s cubic-bezier(.2,1.4,.4,1) 1.5s",
          filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.4))",
        }}
      >
        {animal.emoji}
      </div>

      <style>{`
        @keyframes ring-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function RevealScreen({ animal, userScore, onContinue }) {
  // phase: 0 = dark in, 1 = surface settles, 2 = halo strokes, 3 = glyph + name, 4 = description, 5 = CTA
  const [phase, setPhase] = React.useState(0);
  const palette = animal.palette;

  React.useEffect(() => {
    const timeline = [
      [120,  1],   // bg/surface in
      [800,  2],   // halo stroke
      [2200, 3],   // glyph + name
      [3600, 4],   // description
      [5400, 5],   // cta
    ];
    const timers = timeline.map(([t, p]) => setTimeout(() => setPhase(p), t));
    return () => timers.forEach(clearTimeout);
  }, []);

  const magnitude = Math.sqrt(userScore.x * userScore.x + userScore.y * userScore.y);
  const conf = window.GIFT_DATA.confidenceLabel(magnitude);

  return (
    <div
      className="reveal-screen"
      style={{
        position: "fixed",
        inset: 0,
        background: palette.bg,
        color: palette.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        overflow: "hidden",
        animation: "reveal-bg-in 0.8s cubic-bezier(.4,0,.2,1) both",
      }}
    >
      {/* Subtle atmosphere — soft gradient + grain */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${palette.surface} 0%, ${palette.bg} 70%)`,
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Top eyebrow — confidence */}
      <div
        className="mono"
        style={{
          position: "relative",
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: palette.accent,
          opacity: phase >= 3 ? 0.85 : 0,
          transition: "opacity 0.8s ease 1.6s",
          marginBottom: 24,
        }}
      >
        {conf.tier === "high" && "✦ a clear match ✦"}
        {conf.tier === "mid"  && "✦ leaning strongly ✦"}
        {conf.tier === "low"  && "✦ near the centre ✦"}
      </div>

      {/* Glyph */}
      <AnimalGlyph animal={animal} phase={phase} />

      {/* Name */}
      <div
        style={{
          marginTop: 36,
          textAlign: "center",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.9s cubic-bezier(.2,.7,.2,1) 1.8s, transform 0.9s cubic-bezier(.2,.7,.2,1) 1.8s",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: palette.accent,
            marginBottom: 14,
            opacity: 0.8,
          }}
        >
          {conf.prefix}
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "clamp(56px, 9vw, 132px)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
            margin: 0,
            color: palette.ink,
          }}
        >
          <em style={{ color: palette.accent, fontStyle: "italic" }}>{animal.name}.</em>
        </h1>
      </div>

      {/* Description */}
      <p
        style={{
          maxWidth: 580,
          margin: "32px 32px 0",
          textAlign: "center",
          fontSize: 17.5,
          lineHeight: 1.6,
          color: palette.ink,
          opacity: phase >= 4 ? 0.85 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 1.2s ease 0.0s, transform 1.2s cubic-bezier(.2,.7,.2,1) 0.0s",
        }}
      >
        {animal.description}
      </p>

      {/* CTA */}
      <div
        style={{
          marginTop: 56,
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <button
          onClick={onContinue}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 32px",
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: "0.01em",
            background: palette.accent,
            color: palette.bg,
            border: "none",
            cursor: "pointer",
            borderRadius: 999,
            transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 30px -16px ${palette.accent}aa`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          See your gifts
          <span style={{ display: "inline-block" }}>→</span>
        </button>
      </div>

      {/* Skip — small + subtle */}
      <button
        onClick={onContinue}
        style={{
          position: "absolute",
          top: 28,
          right: 32,
          background: "transparent",
          border: "none",
          color: palette.ink,
          opacity: 0.4,
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
      >
        skip ⤳
      </button>

      <style>{`
        @keyframes reveal-bg-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

window.RevealScreen = RevealScreen;
