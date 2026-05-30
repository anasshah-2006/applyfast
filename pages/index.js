import { useState, useEffect } from "react";

const steps = ["Your CV", "Job Details", "Results"];

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "4rem 0" }}>
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #e8ff00", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid #e8ff0044", borderBottomColor: "transparent", animation: "spin 0.7s linear infinite reverse" }} />
      </div>
      <p style={{ color: "#888", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Generating your application</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? "#e8ff0022" : "transparent", border: `1px solid ${copied ? "#e8ff00" : "#333"}`, color: copied ? "#e8ff00" : "#666", borderRadius: 6, padding: "6px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s" }}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [cv, setCv] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth > 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jobDesc: `${jobTitle} at ${company}\n\n${jobDesc}` }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep(2);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e0", fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { resize: none; }
        textarea:focus, input:focus { outline: none; }
        ::selection { background: #e8ff00; color: #0a0a0a; }
        .fade-up { opacity: 0; transform: translateY(20px); animation: fadeUp 0.4s forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .scroll::-webkit-scrollbar { width: 3px; }
        .scroll::-webkit-scrollbar-thumb { background: #e8ff0044; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#e8ff00", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, color: "#0a0a0a", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 22, letterSpacing: 3, color: "#e8e8e0" }}>BOOST CV AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: i < step ? "#e8ff00" : i === step ? "#e8ff0022" : "transparent", border: `1px solid ${i <= step ? "#e8ff00" : "#333"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: i < step ? "#0a0a0a" : i === step ? "#e8ff00" : "#555", fontWeight: 700, transition: "all 0.3s" }}>
                {i < step ? "✓" : i + 1}
              </div>
              {isWide && <span style={{ fontSize: 11, color: i === step ? "#e8e8e0" : "#444", letterSpacing: 1 }}>{s.toUpperCase()}</span>}
              {i < steps.length - 1 && <div style={{ width: 16, height: 1, background: i < step ? "#e8ff00" : "#222", marginLeft: 4 }} />}
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem" }}>

        {/* Step 0 */}
        {step === 0 && (
          <div className="fade-up">
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "inline-block", border: "1px solid #e8ff0044", borderRadius: 4, padding: "4px 12px", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: 11, color: "#e8ff00", letterSpacing: 2, textTransform: "uppercase" }}>AI-Powered — Free to Try</span>
              </div>
              <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 0.95, letterSpacing: 2, marginBottom: "1rem" }}>
                Land the job.<br />
                <span style={{ color: "#e8ff00" }}>Not the bin.</span>
              </h1>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.8, maxWidth: 480 }}>
                Paste your CV. Drop in the job description. We rewrite everything to match — keywords, tone, structure. 30 seconds.
              </p>
            </div>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#e8ff00", letterSpacing: 2, textTransform: "uppercase" }}>Step 01 — Your CV</span>
                <span style={{ fontSize: 11, color: "#333" }}>{cv.length} chars</span>
              </div>
              <textarea value={cv} onChange={e => setCv(e.target.value)}
                placeholder="Paste your full CV here — work experience, education, skills, everything."
                style={{ width: "100%", minHeight: 260, background: "#0d0d0d", border: "none", padding: "1.5rem", color: "#ccc", fontSize: 13, lineHeight: 1.9, fontFamily: "inherit" }} />
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => cv.trim() ? setStep(1) : null}
                  style={{ background: cv.trim() ? "#e8ff00" : "#1a1a1a", color: cv.trim() ? "#0a0a0a" : "#444", border: "none", borderRadius: 6, padding: "12px 32px", fontSize: 12, fontWeight: 700, cursor: cv.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase", transition: "all 0.2s" }}>
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && !loading && (
          <div className="fade-up">
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontSize: 11, color: "#e8ff00", letterSpacing: 2, textTransform: "uppercase" }}>Step 02 — The Job</span>
              </div>
              <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderBottom: "1px solid #1a1a1a" }}>
                <div>
                  <label style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Job Title</label>
                  <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Marketing Manager"
                    style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 6, padding: "10px 14px", color: "#e8e8e0", fontSize: 13, fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Company</label>
                  <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google"
                    style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 6, padding: "10px 14px", color: "#e8e8e0", fontSize: 13, fontFamily: "inherit" }} />
                </div>
              </div>
              <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here — the more detail, the better the output."
                style={{ width: "100%", minHeight: 220, background: "#0d0d0d", border: "none", padding: "1.5rem", color: "#ccc", fontSize: 13, lineHeight: 1.9, fontFamily: "inherit", borderBottom: "1px solid #1a1a1a" }} />
              {error && <div style={{ padding: "0.75rem 1.5rem", background: "#1a0a0a", borderBottom: "1px solid #2a1a1a" }}><span style={{ fontSize: 13, color: "#f44336" }}>{error}</span></div>}
              <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setStep(0)} style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 6, padding: "12px 24px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase" }}>← Back</button>
                <button onClick={() => jobDesc.trim() ? generate() : null}
                  style={{ background: jobDesc.trim() ? "#e8ff00" : "#1a1a1a", color: jobDesc.trim() ? "#0a0a0a" : "#444", border: "none", borderRadius: 6, padding: "12px 32px", fontSize: 12, fontWeight: 700, cursor: jobDesc.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase", transition: "all 0.2s" }}>
                  Generate ✦
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && loading && <Spinner />}

        {/* Step 2 */}
        {step === 2 && result && (
          <div className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e8ff0022", border: "1px solid #e8ff00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✓</div>
              <div>
                <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 24, letterSpacing: 2 }}>Application Ready</h2>
                <p style={{ color: "#555", fontSize: 11, letterSpacing: 1 }}>{jobTitle && company ? `${jobTitle.toUpperCase()} AT ${company.toUpperCase()}` : "TAILORED TO YOUR JOB"}</p>
              </div>
            </div>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#e8ff00", letterSpacing: 2, textTransform: "uppercase" }}>Tailored CV</span>
                <CopyBtn text={result.tailoredCV} />
              </div>
              <div className="scroll" style={{ maxHeight: 280, overflowY: "auto", padding: "1.5rem", background: "#0d0d0d" }}>
                <pre style={{ fontSize: 12, color: "#999", whiteSpace: "pre-wrap", lineHeight: 1.9, fontFamily: "inherit" }}>{result.tailoredCV}</pre>
              </div>
            </div>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#e8ff00", letterSpacing: 2, textTransform: "uppercase" }}>Cover Letter</span>
                <CopyBtn text={result.coverLetter} />
              </div>
              <div className="scroll" style={{ maxHeight: 280, overflowY: "auto", padding: "1.5rem", background: "#0d0d0d" }}>
                <pre style={{ fontSize: 12, color: "#999", whiteSpace: "pre-wrap", lineHeight: 1.9, fontFamily: "inherit" }}>{result.coverLetter}</pre>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep(0); setCv(""); setJobDesc(""); setJobTitle(""); setCompany(""); setResult(null); }}
                style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 6, padding: "12px 24px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase" }}>
                New Application
              </button>
              <button onClick={() => { setStep(1); setResult(null); generate(); }}
                style={{ background: "transparent", color: "#e8ff00", border: "1px solid #e8ff0044", borderRadius: 6, padding: "12px 24px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase" }}>
                Regenerate ↺
              </button>
            </div>
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4rem" }}>
        <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 16, letterSpacing: 3, color: "#333" }}>BOOST CV AI</span>
        <span style={{ fontSize: 11, color: "#333", letterSpacing: 1 }}>YOUR DATA IS NEVER STORED</span>
      </footer>
    </div>
  );
}
