// Landing screen — hero with abstract organic blob composition

function HeroBlob() {
  // Layered overlapping organic shapes. All inline SVG, no clipart feel.
  return (
    <svg viewBox="0 0 600 600" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden="true">
      <defs>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Soft sage/clay back blob */}
      <path
        className="blob-1"
        d="M 320 80 C 440 70 530 160 540 280 C 550 400 470 500 360 530 C 250 560 130 510 90 400 C 50 290 110 170 220 110 C 260 90 290 82 320 80 Z"
        fill="#DCCFB5"
        opacity="0.85"
      />

      {/* Cream blob */}
      <path
        className="blob-2"
        d="M 200 200 C 300 160 410 200 460 290 C 510 380 460 480 360 500 C 260 520 160 470 130 380 C 100 290 130 230 200 200 Z"
        fill="#F4EDE0"
      />

      {/* Terracotta accent disk */}
      <circle className="disk" cx="380" cy="240" r="120" fill="#B85537" />

      {/* Ink accent — small */}
      <circle className="dot-ink" cx="200" cy="380" r="32" fill="#1A1612" />

      {/* Outline ring */}
      <circle className="ring" cx="280" cy="320" r="170" fill="none" stroke="#1A1612" strokeWidth="1.2" strokeDasharray="2 6" opacity="0.5" />

      {/* Tiny accent dots */}
      <circle cx="120" cy="180" r="4" fill="#B85537" className="float-dot" />
      <circle cx="500" cy="430" r="6" fill="#1A1612" className="float-dot d2" />
      <circle cx="460" cy="120" r="3" fill="#1A1612" className="float-dot d3" />

      <style>{`
        .blob-1 { transform-origin: 50% 50%; animation: drift1 14s ease-in-out infinite alternate; }
        .blob-2 { transform-origin: 50% 50%; animation: drift2 11s ease-in-out infinite alternate; }
        .disk   { transform-origin: 380px 240px; animation: pulse 6s ease-in-out infinite; }
        .dot-ink { animation: bob 5s ease-in-out infinite; }
        .ring   { transform-origin: 280px 320px; animation: spin 60s linear infinite; }
        .float-dot { animation: bob 4s ease-in-out infinite; }
        .float-dot.d2 { animation-duration: 6s; animation-delay: -2s; }
        .float-dot.d3 { animation-duration: 5s; animation-delay: -1s; }
        @keyframes drift1 { 0% { transform: translate(0,0) rotate(0deg); } 100% { transform: translate(-8px,4px) rotate(2deg); } }
        @keyframes drift2 { 0% { transform: translate(0,0) rotate(0deg); } 100% { transform: translate(6px,-4px) rotate(-1.5deg); } }
        @keyframes pulse  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes bob    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}

function BudgetSelector({ value, onChange }) {
  const tiers = window.GIFT_DATA.PRICE_TIERS;
  return (
    <div style={{ width: "100%" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        Budget · select one
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
        }}
      >
        {tiers.map((t) => {
          const selected = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="budget-pill"
              data-selected={selected}
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: 14,
                padding: "16px 12px",
                borderRadius: 14,
                cursor: "pointer",
                border: selected ? "1px solid var(--ink)" : "1px solid var(--line)",
                background: selected ? "var(--ink)" : "rgba(255,255,255,0.4)",
                color: selected ? "var(--cream)" : "var(--ink-2)",
                transition: "all .25s cubic-bezier(.2,.7,.2,1)",
                position: "relative",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <style>{`
        .budget-pill:hover[data-selected="false"] {
          border-color: var(--ink) !important;
          background: var(--clay) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

function Landing({ onStart }) {
  const [budget, setBudget] = React.useState(null);
  const name = window.GIFT_DATA.RECIPIENT_NAME;

  return (
    <div className="screen" style={{ minHeight: "calc(100vh - 100px)" }}>
      <div className="container" style={{ paddingTop: 30, paddingBottom: 80 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
          className="landing-grid"
        >
          {/* Left — copy */}
          <div>
            <div className="reveal" style={{ animationDelay: "0.05s" }}>
              <span className="eyebrow">A gift quiz · for one specific person</span>
            </div>

            <h1
              className="display reveal"
              style={{ marginTop: 18, animationDelay: "0.15s" }}
            >
              Let's find the<br />
              perfect gift for<br />
              <em>{name}.</em>
            </h1>

            <p
              className="reveal"
              style={{
                marginTop: 28,
                fontSize: 19,
                lineHeight: 1.55,
                color: "var(--ink-2)",
                maxWidth: 480,
                animationDelay: "0.3s",
              }}
            >
              Twelve quick questions. Honest matches from a curated list — and if
              you'd rather not buy anything, a few things you could{" "}
              <em style={{ fontFamily: "var(--serif)", fontSize: 22 }}>do</em>{" "}
              instead.
            </p>

            <div
              className="reveal"
              style={{ marginTop: 44, maxWidth: 480, animationDelay: "0.45s" }}
            >
              <BudgetSelector value={budget} onChange={setBudget} />
            </div>

            <div
              className="reveal"
              style={{
                marginTop: 36,
                display: "flex",
                gap: 20,
                alignItems: "center",
                flexWrap: "wrap",
                animationDelay: "0.6s",
              }}
            >
              <button
                className="btn"
                onClick={() => onStart(budget)}
                disabled={!budget}
              >
                Find their gift
                <span className="arrow">→</span>
              </button>
              <span className="mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                ~ 3 min · 12 questions
              </span>
            </div>
          </div>

          {/* Right — hero blob */}
          <div
            className="reveal"
            style={{
              animationDelay: "0.25s",
              position: "relative",
            }}
          >
            <HeroBlob />

            {/* floating spec card */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: -10,
                background: "var(--cream)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "14px 18px",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-2)",
                boxShadow: "0 20px 40px -28px rgba(26,22,18,0.4)",
                animation: "reveal .8s cubic-bezier(.2,.7,.2,1) .9s both",
              }}
            >
              <div style={{ color: "var(--accent)", marginBottom: 4 }}>● recipient</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, textTransform: "none", letterSpacing: 0, color: "var(--ink)" }}>
                {name}, 26
              </div>
              <div style={{ marginTop: 4, fontSize: 10 }}>Downey, ca · runner</div>
            </div>
          </div>
        </div>

        {/* Bottom info strip */}
        <div
          className="reveal"
          style={{
            marginTop: 90,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 30,
            paddingTop: 32,
            borderTop: "1px solid var(--line)",
            animationDelay: "0.75s",
          }}
        >
          {[
            ["01", "Curated matches", "Twenty-four hand-picked gifts plotted on a personality grid."],
            ["02", "Action gifts",    "Free, personal alternatives — for when stuff isn't the answer."],
            ["03", "Talk it out",     "Have an idea? Run it by an advisor that knows him."],
          ].map(([n, t, b]) => (
            <div key={n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--accent)", paddingTop: 4 }}>{n}</span>
              <div>
                <div className="serif" style={{ fontSize: 22, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .landing-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}

window.Landing = Landing;
