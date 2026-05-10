// Quiz screen — narrative quest. Opening narration → 12 scenes → reveal.

function ProgressBar({ current, total }) {
  const pct = ((current) / total) * 100;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ height: 2, background: "var(--line)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: "var(--accent)", transition: "width .55s cubic-bezier(.2,.7,.2,1)" }} />
      </div>
    </div>
  );
}

// Atmospheric layered shapes that drift between acts.
function ActAtmosphere({ act }) {
  // Three palettes for three acts — soft, never jarring.
  const palettes = {
    1: { a: "#F4EDE0", b: "#E8DDC8", c: "#DCCFB5", accent: "#E8C8B8", mood: "dawn"   },
    2: { a: "#EDE3D1", b: "#DCCFB5", c: "#C9B98E", accent: "#B85537", mood: "midday" },
    3: { a: "#3F362D", b: "#5A4D3F", c: "#241B14", accent: "#B85537", mood: "dusk"   },
  };
  const p = palettes[act] || palettes[1];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", transition: "all 1.2s ease" }}>
      {/* Soft graded background tint */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 80% 20%, ${p.b} 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, ${p.c} 0%, transparent 50%)`,
          opacity: 0.55,
          transition: "all 1.4s ease",
        }}
      />
      {/* Right-side ornament: drifts with act */}
      <svg
        viewBox="0 0 400 700"
        style={{
          position: "absolute",
          right: -40,
          top: "50%",
          transform: "translateY(-50%)",
          height: "90%",
          width: 400,
          opacity: 0.85,
          transition: "all 1.4s ease",
        }}
        aria-hidden="true"
      >
        <g style={{ transform: `translate(${(act - 1) * 14}px, ${(act - 1) * -10}px)`, transition: "transform 1.6s cubic-bezier(.2,.7,.2,1)" }}>
          <circle cx="280" cy="180" r="140" fill={p.b} opacity="0.85" />
          <circle cx="220" cy="420" r="100" fill={p.accent} opacity={act === 3 ? 0.95 : 0.85} />
          <circle cx="320" cy="560" r="44" fill="#1A1612" opacity={act === 3 ? 0.7 : 0.95} />
          <circle cx="160" cy="120" r="22" fill="#1A1612" opacity="0.55" />
          <circle cx="80"  cy="330" r="6"  fill={p.accent} />
          <circle cx="60"  cy="530" r="4"  fill="#1A1612" opacity="0.6" />
          <circle cx="240" cy="300" r="200" fill="none" stroke="#1A1612" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.18" />
        </g>
      </svg>
    </div>
  );
}

function NarrationOverlay({ text, onContinue }) {
  return (
    <div
      className="screen"
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "var(--cream)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "60px 32px",
      }}
    >
      <div style={{ maxWidth: 720, textAlign: "center" }}>
        <div className="eyebrow reveal" style={{ marginBottom: 22, animationDelay: "0.05s", color: "var(--accent)" }}>
          ◇ a quest begins ◇
        </div>
        <p
          className="serif reveal"
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.3,
            color: "var(--ink)",
            margin: 0,
            animationDelay: "0.25s",
          }}
        >
          <em style={{ fontStyle: "italic" }}>"{text}"</em>
        </p>
        <div className="reveal" style={{ marginTop: 56, animationDelay: "1.4s" }}>
          <button className="btn" onClick={onContinue}>
            Begin the journey
            <span className="arrow">→</span>
          </button>
        </div>
        <div className="reveal" style={{ marginTop: 24, animationDelay: "1.6s" }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            12 scenes · choose freely
          </span>
        </div>
      </div>
    </div>
  );
}

function QuizScreen({ onComplete, onBack, onStepChange }) {
  const QUESTIONS = window.GIFT_DATA.QUESTIONS;
  const OPENING = window.GIFT_DATA.OPENING_NARRATION;
  const [showNarration, setShowNarration] = React.useState(true);
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [direction, setDirection] = React.useState("forward");
  const [exiting, setExiting] = React.useState(false);

  const question = QUESTIONS[idx];

  React.useEffect(() => {
    if (onStepChange) onStepChange(idx + 1);
  }, [idx]);

  function selectOption(opt) {
    if (exiting) return;
    setExiting(true);
    setDirection("forward");
    const newAnswers = [...answers.slice(0, idx), { dx: opt.dx, dy: opt.dy, label: opt.label }];
    setTimeout(() => {
      setAnswers(newAnswers);
      if (idx + 1 >= QUESTIONS.length) {
        onComplete(newAnswers);
      } else {
        setIdx(idx + 1);
        setExiting(false);
      }
    }, 320);
  }

  function back() {
    if (exiting) return;
    if (idx === 0) {
      onBack();
      return;
    }
    setExiting(true);
    setDirection("back");
    setTimeout(() => {
      setIdx(idx - 1);
      setExiting(false);
    }, 320);
  }

  const slideClass = exiting
    ? (direction === "forward" ? "q-exit-fwd" : "q-exit-back")
    : "q-enter";

  const act = question.act;
  const isAct3 = act === 3;

  return (
    <div
      className="screen"
      style={{
        minHeight: "calc(100vh - 100px)",
        position: "relative",
        background: isAct3 ? "#241B14" : "transparent",
        color: isAct3 ? "var(--cream)" : "var(--ink)",
        transition: "background 1.2s ease, color 1.2s ease",
      }}
    >
      <ActAtmosphere act={act} />

      <div className="container" style={{ paddingTop: 20, paddingBottom: 60, position: "relative", zIndex: 2 }}>
        {/* Top bar — progress, act marker, scene marker */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 56 }}>
          <button
            onClick={back}
            className="back-btn"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: isAct3 ? "rgba(244,237,224,0.55)" : "var(--muted)",
              padding: "6px 0",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ display: "inline-block", transition: "transform .25s" }}>←</span>
            {idx === 0 ? "Back to start" : "Previous"}
          </button>
          <div style={{ flex: 1, opacity: isAct3 ? 0.7 : 1 }}>
            <ProgressBar current={idx} total={QUESTIONS.length} />
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--accent)" }}>act {String(act).padStart(2, "0")}</span>
            <span style={{ opacity: 0.5, margin: "0 8px" }}>·</span>
            <span>scene {String(idx + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Question card */}
        <div style={{ maxWidth: 760, position: "relative", minHeight: 480 }}>
          <div key={idx} className={slideClass}>
            <div className="eyebrow" style={{ marginBottom: 14, color: "var(--accent)" }}>
              {question.scene}
            </div>

            <p
              className="serif"
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                fontStyle: "italic",
                margin: 0,
                opacity: 0.75,
                maxWidth: 600,
                marginBottom: 30,
                color: isAct3 ? "rgba(244,237,224,0.8)" : "var(--ink-2)",
                animation: "setup-in .7s cubic-bezier(.2,.7,.2,1) 0.05s both",
              }}
            >
              {question.setup}
            </p>

            <h2
              className="title"
              style={{
                marginBottom: 38,
                maxWidth: 680,
                color: "inherit",
                animation: "setup-in .65s cubic-bezier(.2,.7,.2,1) 0.15s both",
              }}
            >
              {question.q}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: question.options.length === 2 ? "1fr 1fr" : "1fr 1fr",
                gap: 14,
              }}
              className="opt-grid"
              data-cols={question.options.length}
            >
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  className="opt-card"
                  data-act={act}
                  onClick={() => selectOption(opt)}
                  style={{
                    textAlign: "left",
                    padding: "20px 22px",
                    border: `1px solid ${isAct3 ? "rgba(244,237,224,0.18)" : "var(--line)"}`,
                    background: isAct3 ? "rgba(244,237,224,0.04)" : "rgba(255,255,255,0.5)",
                    color: "inherit",
                    borderRadius: 16,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    fontSize: 15.5,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    transition: "all .25s cubic-bezier(.2,.7,.2,1)",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    animation: `opt-in .55s cubic-bezier(.2,.7,.2,1) ${0.25 + i * 0.07}s both`,
                  }}
                >
                  <span
                    className="opt-letter"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      color: isAct3 ? "rgba(244,237,224,0.5)" : "var(--muted)",
                      paddingTop: 4,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showNarration && (
        <NarrationOverlay text={OPENING} onContinue={() => setShowNarration(false)} />
      )}

      <style>{`
        .opt-card[data-act="1"]:hover, .opt-card[data-act="2"]:hover {
          background: var(--ink) !important;
          color: var(--cream) !important;
          border-color: var(--ink) !important;
          transform: translateY(-3px);
          box-shadow: 0 14px 30px -22px rgba(26,22,18,0.6);
        }
        .opt-card[data-act="3"]:hover {
          background: var(--accent) !important;
          color: var(--cream) !important;
          border-color: var(--accent) !important;
          transform: translateY(-3px);
          box-shadow: 0 14px 30px -16px rgba(184,85,55,0.6);
        }
        .opt-card:hover .opt-letter { color: var(--accent) !important; }
        .back-btn:hover { color: var(--ink) !important; }
        .back-btn:hover span { transform: translateX(-3px); }

        .q-enter    { animation: q-enter .5s cubic-bezier(.2,.7,.2,1) both; }
        .q-exit-fwd { animation: q-exit-fwd .32s cubic-bezier(.5,.1,.9,.4) both; }
        .q-exit-back{ animation: q-exit-back .32s cubic-bezier(.5,.1,.9,.4) both; }

        @keyframes q-enter {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes q-exit-fwd { to { opacity: 0; transform: translateX(-40px); } }
        @keyframes q-exit-back { to { opacity: 0; transform: translateX(40px); } }
        @keyframes opt-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes setup-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 0.75; transform: translateY(0); }
        }
        .opt-grid[data-cols="2"] { grid-template-columns: 1fr 1fr; }
        @media (max-width: 720px) {
          .opt-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

window.QuizScreen = QuizScreen;
