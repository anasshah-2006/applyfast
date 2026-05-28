import { useState } from "react";

export default function Home() {
  const [cv, setCv] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const generate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cv, jobDesc }),
    });
    const data = await res.json();
    setResult(data);
    setStep(2);
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d14", color: "#e8e8f0", fontFamily: "sans-serif", padding: "2rem", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>⚡ ApplyFast</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Paste your CV and a job description. Get a tailored application instantly.</p>

      {step === 0 && (
        <div>
          <label style={{ fontSize: 13, color: "#888" }}>YOUR CV</label>
          <textarea
            value={cv}
            onChange={e => setCv(e.target.value)}
            placeholder="Paste your CV here..."
            style={{ width: "100%", minHeight: 200, background: "#13131f", border: "1px solid #222", borderRadius: 10, padding: 16, color: "#e8e8f0", fontSize: 14, marginTop: 8, marginBottom: 16, display: "block" }}
          />
          <button
            onClick={() => cv.trim() && setStep(1)}
            style={{ background: "#6c63ff", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, cursor: "pointer" }}
          >
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <label style={{ fontSize: 13, color: "#888" }}>JOB DESCRIPTION</label>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            style={{ width: "100%", minHeight: 200, background: "#13131f", border: "1px solid #222", borderRadius: 10, padding: 16, color: "#e8e8f0", fontSize: 14, marginTop: 8, marginBottom: 16, display: "block" }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setStep(0)}
              style={{ background: "transparent", color: "#666", border: "1px solid #333", borderRadius: 10, padding: "12px 20px", fontSize: 14, cursor: "pointer" }}
            >
              Back
            </button>
            <button
              onClick={() => jobDesc.trim() && generate()}
              style={{ background: "#6c63ff", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, cursor: "pointer" }}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div>
          <div style={{ background: "#13131f", border: "1px solid #1e1e30", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#888" }}>TAILORED CV</span>
              <button onClick={() => navigator.clipboard.writeText(result.tailoredCV)} style={{ background: "#1a1a2e", color: "#6c63ff", border: "1px solid #333", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Copy</button>
            </div>
            <pre style={{ fontSize: 12, color: "#999", whiteSpace: "pre-wrap", lineHeight: 1.8, margin: 0 }}>{result.tailoredCV}</pre>
          </div>
          <div style={{ background: "#13131f", border: "1px solid #1e1e30", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#888" }}>COVER LETTER</span>
              <button onClick={() => navigator.clipboard.writeText(result.coverLetter)} style={{ background: "#1a1a2e", color: "#6c63ff", border: "1px solid #333", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>Copy</button>
            </div>
            <pre style={{ fontSize: 12, color: "#999", whiteSpace: "pre-wrap", lineHeight: 1.8, margin: 0 }}>{result.coverLetter}</pre>
          </div>
          <button onClick={() => { setStep(0); setCv(""); setJobDesc(""); setResult(null); }} style={{ background: "transparent", color: "#666", border: "1px solid #333", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>
            Start over
          </button>
        </div>
      )}
    </main>
  );
}
