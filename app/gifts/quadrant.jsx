// Quadrant graph — designed, not charty.
// Coordinate space: x in [-5, 5], y in [-5, 5]
// SVG: 600x600 viewBox

function QuadrantGraph({ userScore, matches, allGifts, userDotColor, userLabel }) {
  const dotColor = userDotColor || "var(--ink)";
  const label = userLabel || "YOU · THOMAS";
  const SIZE = 600;
  const PAD = 90;        // padding inside SVG for labels
  const GRID = SIZE - PAD * 2;
  const ORIGIN = SIZE / 2;

  // Map data coord (-5..5) to svg coord
  const toSvg = (v, axis) => {
    if (axis === "x") return ORIGIN + (v / 5) * (GRID / 2);
    if (axis === "y") return ORIGIN - (v / 5) * (GRID / 2); // y inverted: positive up
    return v;
  };

  const matchIds = new Set(matches.map((m) => m.id));

  return (
    <div
      className="quadrant-wrap"
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        position: "relative",
        aspectRatio: "1 / 1",
      }}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Soft frame */}
        <rect
          x={PAD}
          y={PAD}
          width={GRID}
          height={GRID}
          fill="rgba(255,255,255,0.35)"
          stroke="var(--line)"
          strokeWidth="1"
          rx="8"
        />

        {/* Quadrant tints — TL: curator (cream), TR: adventurer (warm), BL: keeper (clay), BR: builder (cream-2) */}
        <g opacity="0.55">
          <rect x={PAD} y={PAD} width={GRID/2} height={GRID/2} fill="#EDE3D1" />
          <rect x={ORIGIN} y={PAD} width={GRID/2} height={GRID/2} fill="#E8C8B8" />
          <rect x={PAD} y={ORIGIN} width={GRID/2} height={GRID/2} fill="#DCCFB5" />
          <rect x={ORIGIN} y={ORIGIN} width={GRID/2} height={GRID/2} fill="#EDE3D1" />
        </g>

        {/* Grid lines (5 per side) */}
        <g stroke="var(--line)" strokeWidth="0.5" opacity="0.45">
          {[1,2,3,4].map((i) => {
            const off = (GRID / 5) * i;
            return (
              <g key={i}>
                <line x1={PAD + off} y1={PAD} x2={PAD + off} y2={PAD + GRID} />
                <line x1={PAD} y1={PAD + off} x2={PAD + GRID} y2={PAD + off} />
              </g>
            );
          })}
        </g>

        {/* Center axes — heavier */}
        <line x1={PAD} y1={ORIGIN} x2={PAD + GRID} y2={ORIGIN} stroke="var(--ink)" strokeWidth="1" opacity="0.55" />
        <line x1={ORIGIN} y1={PAD} x2={ORIGIN} y2={PAD + GRID} stroke="var(--ink)" strokeWidth="1" opacity="0.55" />

        {/* Quadrant labels */}
        <g fontFamily="var(--serif)" fontSize="20" fill="var(--ink)" opacity="0.85" textAnchor="middle">
          <text x={PAD + GRID*0.25} y={PAD + 30} fontStyle="italic">The Curator</text>
          <text x={PAD + GRID*0.75} y={PAD + 30} fontStyle="italic">The Adventurer</text>
          <text x={PAD + GRID*0.25} y={PAD + GRID - 15} fontStyle="italic">The Keeper</text>
          <text x={PAD + GRID*0.75} y={PAD + GRID - 15} fontStyle="italic">The Builder</text>
        </g>

        {/* Axis end labels (mono) */}
        <g fontFamily="var(--mono)" fontSize="10" fill="var(--ink-2)" letterSpacing="2" textAnchor="middle">
          <text x={ORIGIN} y={PAD - 22}>AESTHETIC</text>
          <text x={ORIGIN} y={PAD + GRID + 32}>FUNCTIONAL</text>
        </g>
        <g fontFamily="var(--mono)" fontSize="10" fill="var(--ink-2)" letterSpacing="2">
          <text x={PAD - 18} y={ORIGIN + 4} textAnchor="end">SENTIMENTAL</text>
          <text x={PAD + GRID + 18} y={ORIGIN + 4}>EXPERIENTIAL</text>
        </g>

        {/* All gift dots */}
        <g>
          {allGifts.map((g, i) => {
            const cx = toSvg(g.x, "x");
            const cy = toSvg(g.y, "y");
            const isMatch = matchIds.has(g.id);
            return (
              <g key={g.id} className="gift-dot" style={{ animation: `dot-in .5s cubic-bezier(.2,.8,.2,1) ${0.4 + i * 0.04}s both` }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isMatch ? 8 : 4}
                  fill={isMatch ? "var(--accent)" : "var(--ink-2)"}
                  opacity={isMatch ? 1 : 0.4}
                />
                {isMatch && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1"
                    opacity="0.4"
                  >
                    <animate attributeName="r" from="10" to="20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Match labels */}
        <g fontFamily="var(--sans)" fontSize="11" fill="var(--ink)" fontWeight="500">
          {matches.map((g, i) => {
            const cx = toSvg(g.x, "x");
            const cy = toSvg(g.y, "y");
            // try to put label to the right by default, fall back left if too far right
            const right = cx < ORIGIN + 80;
            return (
              <g key={g.id} className="match-label" style={{ animation: `dot-in .5s cubic-bezier(.2,.8,.2,1) ${1.4 + i * 0.15}s both` }}>
                <line
                  x1={cx + (right ? 10 : -10)} y1={cy}
                  x2={cx + (right ? 26 : -26)} y2={cy - 12}
                  stroke="var(--accent)" strokeWidth="0.8"
                />
                <text
                  x={cx + (right ? 28 : -28)}
                  y={cy - 14}
                  textAnchor={right ? "start" : "end"}
                >
                  {g.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* User marker — drops in last */}
        <g className="user-marker" style={{ animation: `user-drop 1s cubic-bezier(.2,1.6,.4,1) 1.8s both`, transformOrigin: `${toSvg(userScore.x, "x")}px ${toSvg(userScore.y, "y")}px` }}>
          <circle
            cx={toSvg(userScore.x, "x")}
            cy={toSvg(userScore.y, "y")}
            r="22"
            fill={dotColor}
            opacity="0.18"
          >
            <animate attributeName="r" from="22" to="36" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.18" to="0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle
            cx={toSvg(userScore.x, "x")}
            cy={toSvg(userScore.y, "y")}
            r="11"
            fill="var(--cream)"
            stroke={dotColor}
            strokeWidth="2.5"
          />
          <circle
            cx={toSvg(userScore.x, "x")}
            cy={toSvg(userScore.y, "y")}
            r="4"
            fill={dotColor}
          />
          <text
            x={toSvg(userScore.x, "x")}
            y={toSvg(userScore.y, "y") + 32}
            fontFamily="var(--sans)"
            fontWeight="500"
            fontSize="11"
            textAnchor="middle"
            fill="var(--ink)"
          >
            {label}
          </text>
        </g>
      </svg>

      <style>{`
        @keyframes dot-in {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes user-drop {
          0%   { opacity: 0; transform: translateY(-30px) scale(0.6); }
          70%  { opacity: 1; transform: translateY(4px)   scale(1.1); }
          100% { opacity: 1; transform: translateY(0)     scale(1); }
        }
        .gift-dot { transform-origin: center; transform-box: fill-box; }
        .match-label { transform-origin: center; transform-box: fill-box; }
      `}</style>
    </div>
  );
}

window.QuadrantGraph = QuadrantGraph;
