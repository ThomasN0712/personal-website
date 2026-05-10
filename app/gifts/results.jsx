// Results screen v2 — animal-aware reveal, claims, confidence-aware ordering

function AnimalIcon({ animal, size = 48 }) {
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "50%",
        background: animal.palette.bg,
        color: animal.palette.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.55,
        flexShrink: 0,
        boxShadow: `0 8px 18px -10px ${animal.palette.bg}`,
      }}
    >
      {animal.emoji}
    </div>
  );
}

function ClaimModal({ gift, onClose, onConfirm }) {
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function submit(e) {
    e && e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    onConfirm(name);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(26,22,18,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "modal-fade .25s ease both",
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: "var(--cream)",
          borderRadius: 22,
          padding: 32,
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)",
          animation: "modal-pop .35s cubic-bezier(.2,.9,.3,1) both",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: 12, color: "var(--accent)" }}>Claim a gift</div>
        <h3 className="serif" style={{ fontSize: 30, lineHeight: 1.15, margin: 0 }}>
          Let Thomas know <em style={{ color: "var(--accent)" }}>this one's spoken for.</em>
        </h3>
        <p style={{ marginTop: 14, fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
          You're claiming <strong>{gift.name}</strong>. Friends can still also claim it — coordinate as needed.
        </p>

        <label style={{ display: "block", marginTop: 22 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>
            Your name (optional)
          </span>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Taylor"
            style={{
              display: "block",
              marginTop: 8,
              width: "100%",
              padding: "12px 16px",
              fontFamily: "var(--sans)",
              fontSize: 16,
              color: "var(--ink)",
              background: "rgba(255,255,255,0.6)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--ink)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "var(--line)"; }}
          />
        </label>

        <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={submitting}>
            Claim it
            <span className="arrow">→</span>
          </button>
        </div>
      </form>
      <style>{`
        @keyframes modal-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modal-pop {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function GiftCard({ gift, rank, delay, claimCount, onClaim }) {
  const claimed = claimCount > 0;

  const placeholderTone =
    gift.y > 0 && gift.x < 0 ? "#E8C8B8"
    : gift.y > 0 && gift.x >= 0 ? "#DCCFB5"
    : gift.y <= 0 && gift.x < 0 ? "#EDE3D1"
    : "#E8DDC8";

  return (
    <article
      className="gift-card"
      data-claimed={claimed}
      style={{
        background: "var(--cream)",
        border: "1px solid var(--line)",
        borderRadius: 20,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s, border-color .25s",
        animation: `card-up .65s cubic-bezier(.2,.7,.2,1) ${delay}s both`,
        position: "relative",
        opacity: claimCount >= 2 ? 0.78 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--muted)" }}>
          MATCH · {String(rank + 1).padStart(2, "0")}
        </div>
        <div className="chip" style={{ background: placeholderTone, borderColor: "transparent" }}>
          {gift.priceTier}
        </div>
      </div>

      {/* Visual placeholder — abstract */}
      <div
        style={{
          height: 150,
          borderRadius: 14,
          background: placeholderTone,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 200 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <circle cx={50 + (rank * 30) % 100} cy={66 + (rank * 18) % 30} r="44" fill="#B85537" opacity="0.85" />
          <circle cx={130 - (rank * 14) % 30} cy={86} r="28" fill="#1A1612" opacity="0.85" />
          <circle cx={170} cy={36} r="10" fill="#1A1612" opacity="0.6" />
        </svg>
        <div
          className="mono"
          style={{
            position: "absolute", bottom: 10, right: 12,
            fontSize: 9, letterSpacing: "0.15em",
            color: "var(--ink-2)",
            background: "rgba(244,237,224,0.7)",
            padding: "3px 8px", borderRadius: 999,
          }}
        >
          PRODUCT IMAGE
        </div>

        {claimed && (
          <div
            style={{
              position: "absolute", top: 10, left: 12,
              background: "var(--ink)",
              color: "var(--cream)",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "5px 10px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              animation: "claim-in .4s cubic-bezier(.2,1.3,.4,1) both",
            }}
          >
            🎁 {claimCount > 1 ? `Taken · ${claimCount}` : "Taken"}
          </div>
        )}
      </div>

      <div>
        <h3 className="serif" style={{ fontSize: 26, lineHeight: 1.1, margin: 0 }}>
          {gift.name}
        </h3>
        <p style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
          {gift.description}
        </p>

        {claimCount >= 2 && (
          <div
            style={{
              marginTop: 10,
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            popular pick — coordinate with friends
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 14,
          borderTop: "1px solid var(--line)",
          gap: 10,
        }}
      >
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase" }}>
          {gift.storeName}
        </div>
        <button
          onClick={() => onClaim(gift)}
          className="claim-btn"
          style={{
            border: "none",
            background: claimed ? "transparent" : "var(--accent)",
            color: claimed ? "var(--accent)" : "var(--cream)",
            fontFamily: "var(--sans)",
            fontWeight: 500,
            fontSize: 13,
            padding: claimed ? "8px 14px" : "10px 16px",
            borderRadius: 999,
            cursor: "pointer",
            transition: "all .25s",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: claimed ? "1px solid var(--accent)" : "none",
          }}
        >
          {claimed ? "Also claim this" : "I'll get this 🎁"}
        </button>
      </div>
    </article>
  );
}

function ActionGifts() {
  const items = window.GIFT_DATA.ACTION_GIFTS;
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}
      className="action-grid"
    >
      {items.map((a, i) => (
        <div
          key={i}
          className="action-card"
          style={{
            background: "var(--clay)",
            borderRadius: 18,
            padding: 24,
            display: "flex", flexDirection: "column", gap: 12,
            transition: "transform .3s",
            animation: `card-up .55s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.1}s both`,
          }}
        >
          <div style={{ fontSize: 28, lineHeight: 1 }}>{a.emoji}</div>
          <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>{a.title}</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-2)" }}>{a.body}</div>
        </div>
      ))}
      <style>{`
        .action-card:hover { transform: translateY(-3px); }
        @media (max-width: 820px) {
          .action-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ eyebrow, title, kicker }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <h2 className="title" style={{ maxWidth: 720 }}>{title}</h2>
        {kicker && (
          <div className="mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {kicker}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ userScore, animal, onRestart, budget }) {
  const allGifts = window.GIFT_DATA.GIFTS;
  const name = window.GIFT_DATA.RECIPIENT_NAME;

  // Claims state — re-load on every claim so all cards refresh
  const [claims, setClaims] = React.useState(() => window.GIFT_DATA.loadClaims());
  const [matches, setMatches] = React.useState([]);
  const [modalGift, setModalGift] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    setMatches(window.GIFT_DATA.getTopMatches(userScore.x, userScore.y, budget, claims, 3));
  }, [claims, userScore.x, userScore.y, budget]);

  function openClaim(gift) {
    setModalGift(gift);
  }

  function confirmClaim(name) {
    if (!modalGift) return;
    window.GIFT_DATA.addClaim(modalGift.id, name);
    setClaims(window.GIFT_DATA.loadClaims());
    setToast(`Claimed: ${modalGift.name}${name && name.trim() ? ` · thanks, ${name.trim()}` : ""}`);
    setModalGift(null);
    setTimeout(() => setToast(null), 3200);
  }

  const magnitude = Math.sqrt(userScore.x * userScore.x + userScore.y * userScore.y);
  const conf = window.GIFT_DATA.confidenceLabel(magnitude);
  const lowConfidence = conf.tier === "low";

  // For the user's dot color on the quadrant — animal accent
  const userDotColor = animal.palette.accent;

  return (
    <div className="screen" style={{ paddingBottom: 100 }}>
      <div className="container" style={{ paddingTop: 30 }}>

        {/* === 3A — Animal personality reveal === */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 40,
            marginBottom: 80,
            paddingBottom: 60,
            borderBottom: "1px solid var(--line)",
            animation: "card-up .8s cubic-bezier(.2,.7,.2,1) both",
          }}
          className="archetype-grid"
        >
          <div style={{ textAlign: "right" }} className="archetype-left">
            <div className="eyebrow" style={{ marginBottom: 14 }}>{name} is</div>
            <h1 className="display" style={{ fontSize: "clamp(56px, 9vw, 128px)" }}>
              <em>{animal.name.toLowerCase()}</em>
            </h1>
            <div className="mono" style={{ marginTop: 14, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)" }}>
              {conf.tier === "high" && "high confidence match"}
              {conf.tier === "mid"  && "moderate confidence"}
              {conf.tier === "low"  && "near the centre — check the chat"}
            </div>
          </div>

          <div
            style={{
              width: 110, height: 110,
              borderRadius: "50%",
              background: animal.palette.bg,
              color: animal.palette.accent,
              border: `1px solid ${animal.palette.accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 56,
              animation: "icon-pop .9s cubic-bezier(.2,1.4,.4,1) .3s both",
              boxShadow: `0 24px 40px -22px ${animal.palette.bg}`,
            }}
            className="archetype-icon-wrap"
          >
            {animal.emoji}
          </div>

          <div style={{ maxWidth: 380 }} className="archetype-right">
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>
              {animal.description}
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="chip">x · {userScore.x.toFixed(1)}</span>
              <span className="chip">y · {userScore.y.toFixed(1)}</span>
              <span className="chip">‖ {magnitude.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* === Low-confidence: surface chat early === */}
        {lowConfidence && (
          <div
            style={{
              background: "var(--cream-2, #EDE3D1)",
              border: "1px solid var(--line)",
              borderRadius: 22,
              padding: "28px 32px",
              marginBottom: 80,
              display: "flex",
              gap: 24,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 6 }}>a note from us</div>
              <h3 className="serif" style={{ fontSize: 26, lineHeight: 1.2, margin: 0 }}>
                <em>{name}</em>'s harder to read than most.
              </h3>
              <p style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.55 }}>
                The match scored close to centre — which means the chat below might be more useful than the list.
              </p>
            </div>
            <a href="#chat-panel" className="btn btn-ghost" style={{ textDecoration: "none" }}>
              Jump to chat ↓
            </a>
          </div>
        )}

        {/* === 3B — Quadrant graph === */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 60,
            alignItems: "center",
            marginBottom: 100,
          }}
          className="graph-grid"
        >
          <div>
            <SectionHeader
              eyebrow="The taste map"
              title={<>Where {name} sits, <em>and what's nearby.</em></>}
            />
            <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 460 }}>
              Each dot is a gift, plotted by personality. The marker is {name}. The
              three closest matches inside your budget are highlighted.
            </p>
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              <Legend swatch="var(--ink-2)" opacity={0.4} label="all curated gifts" />
              <Legend swatch="var(--accent)" label="your top 3 matches" />
              <Legend swatch={userDotColor} ring label={`${name} · ${animal.name.toLowerCase()}`} />
            </div>
          </div>
          <QuadrantGraph
            userScore={userScore}
            matches={matches}
            allGifts={allGifts}
            userDotColor={userDotColor}
            userLabel={`${name} · ${animal.emoji}`}
          />
        </div>

        {/* === 3C — Top 3 matches === */}
        <div style={{ marginBottom: 80 }}>
          <SectionHeader
            eyebrow="Your top three"
            title={<>The closest <em>matches</em> in your budget.</>}
            kicker="ranked by personality distance"
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}
            className="match-grid"
          >
            {matches.map((g, i) => (
              <GiftCard
                key={g.id}
                gift={g}
                rank={i}
                delay={0.15 + i * 0.15}
                claimCount={window.GIFT_DATA.claimCountForGift(g.id, claims)}
                onClaim={openClaim}
              />
            ))}
          </div>
        </div>

        {/* === 3D — Action gifts === */}
        <div style={{ marginBottom: 80 }}>
          <div className="rule" style={{ marginBottom: 36 }} />
          <SectionHeader
            eyebrow="Not shopping?"
            title={<>Try one of <em>these</em> instead.</>}
            kicker="zero dollars · personal"
          />
          <ActionGifts />
        </div>

        {/* === 3E — Chat === */}
        <div id="chat-panel" style={{ marginBottom: 60, scrollMarginTop: 80 }}>
          <SectionHeader
            eyebrow="Have your own idea?"
            title={<>Run it <em>by me.</em></>}
            kicker={`for the ${animal.name.toLowerCase()} who knows him`}
          />
          <ChatPanel animal={animal} userScore={userScore} />
        </div>

        {/* Start over */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
          <button className="btn btn-ghost" onClick={onRestart}>
            ← Start over
          </button>
        </div>
      </div>

      {modalGift && (
        <ClaimModal
          gift={modalGift}
          onClose={() => setModalGift(null)}
          onConfirm={confirmClaim}
        />
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--cream)",
            padding: "14px 22px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 20px 40px -20px rgba(0,0,0,0.4)",
            zIndex: 150,
            animation: "toast-up .3s cubic-bezier(.2,.9,.3,1) both",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}
        >
          <span style={{ color: "var(--accent)" }}>✓</span>
          {toast}
        </div>
      )}

      <style>{`
        .gift-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 50px -30px rgba(26,22,18,0.3);
          border-color: var(--ink) !important;
        }
        .claim-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        @keyframes card-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes icon-pop {
          0%   { opacity: 0; transform: scale(0.4) rotate(-8deg); }
          70%  { opacity: 1; transform: scale(1.1) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes claim-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes toast-up {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 900px) {
          .archetype-grid { grid-template-columns: 1fr !important; text-align: center; }
          .archetype-left, .archetype-right { text-align: center !important; }
          .archetype-icon-wrap { margin: 0 auto; }
          .graph-grid { grid-template-columns: 1fr !important; }
          .match-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Legend({ swatch, ring, opacity = 1, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-2)" }}>
      <span
        style={{
          display: "inline-block",
          width: 14, height: 14,
          borderRadius: "50%",
          background: ring ? "var(--cream)" : swatch,
          border: ring ? `2px solid ${swatch}` : "none",
          opacity,
        }}
      />
      <span>{label}</span>
    </div>
  );
}

window.ResultsScreen = ResultsScreen;
