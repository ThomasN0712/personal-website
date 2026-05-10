// App shell — landing → quiz → reveal → results, with claim state

const { useState, useEffect } = React;

function Nav({ screen, step, total }) {
  return (
    <nav className="nav">
      <div className="wordmark">
        gift<span className="dot" />match
      </div>
      <div className="nav-meta">
        {screen === "landing" && <span>v 02 · for thomas</span>}
        {screen === "quiz"    && <span>scene · {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>}
        {screen === "reveal"  && <span>the reveal</span>}
        {screen === "results" && <span>your matches</span>}
        <span style={{ color: "var(--accent)" }}>● live</span>
      </div>
    </nav>
  );
}

function App() {
  const [screen, setScreen] = useState("landing"); // landing | quiz | reveal | results
  const [budget, setBudget] = useState(null);
  const [userScore, setUserScore] = useState({ x: 0, y: 0 });
  const [animal, setAnimal] = useState(null);
  const [quizStep, setQuizStep] = useState(1);

  function handleStart(b) {
    setBudget(b);
    setQuizStep(1);
    setScreen("quiz");
  }

  function handleComplete(answers) {
    const score = window.GIFT_DATA.scoreAnswers(answers);
    const an = window.GIFT_DATA.assignAnimal(score.x, score.y);
    setUserScore(score);
    setAnimal(an);
    setScreen("reveal");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function handleRevealContinue() {
    setScreen("results");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function handleRestart() {
    setScreen("landing");
    setBudget(null);
    setUserScore({ x: 0, y: 0 });
    setAnimal(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const showChrome = screen !== "reveal";

  return (
    <div data-screen-label={
      screen === "landing" ? "01 Landing"
      : screen === "quiz"  ? "02 Quiz"
      : screen === "reveal" ? "03 Reveal"
      : "04 Results"
    }>
      {showChrome && (
        <Nav screen={screen} step={quizStep} total={window.GIFT_DATA.QUESTIONS.length} />
      )}

      <main key={screen}>
        {screen === "landing" && (
          <window.Landing onStart={handleStart} />
        )}
        {screen === "quiz" && (
          <window.QuizScreen
            onComplete={handleComplete}
            onBack={() => setScreen("landing")}
            onStepChange={setQuizStep}
          />
        )}
        {screen === "reveal" && animal && (
          <window.RevealScreen
            animal={animal}
            userScore={userScore}
            onContinue={handleRevealContinue}
          />
        )}
        {screen === "results" && animal && (
          <window.ResultsScreen
            userScore={userScore}
            animal={animal}
            budget={budget}
            onRestart={handleRestart}
          />
        )}
      </main>

      {showChrome && (
        <footer
          style={{
            position: "relative",
            zIndex: 2,
            padding: "30px 48px",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid var(--line)",
            marginTop: 40,
          }}
        >
          <span>gift·match · for one specific person</span>
          <span>made with care · 2026</span>
        </footer>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
