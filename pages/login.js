import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handle = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = "/";
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e0", fontFamily: "'DM Mono', 'Courier New', monospace", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } input:focus { outline: none; }`}</style>
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: "0.5rem" }}>
          <div style={{ width: 32, height: 32, background: "#e8ff00", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, color: "#0a0a0a", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 22, letterSpacing: 3 }}>BOOST CV AI</span>
        </div>
        <p style={{ color: "#555", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>{isSignUp ? "Create your account" : "Welcome back"}</p>
      </div>

      <div style={{ width: "100%", maxWidth: 400, border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "2rem" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 6, padding: "12px 14px", color: "#e8e8e0", fontSize: 13, fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 6, padding: "12px 14px", color: "#e8e8e0", fontSize: 13, fontFamily: "inherit" }} />
          </div>
          {error && <p style={{ color: "#f44336", fontSize: 12, marginBottom: 16 }}>{error}</p>}
          {message && <p style={{ color: "#e8ff00", fontSize: 12, marginBottom: 16 }}>{message}</p>}
          <button onClick={handle} disabled={loading}
            style={{ width: "100%", background: "#e8ff00", color: "#0a0a0a", border: "none", borderRadius: 6, padding: "13px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase" }}>
            {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </div>
        <div style={{ borderTop: "1px solid #1a1a1a", padding: "1rem 2rem", textAlign: "center" }}>
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>
            {isSignUp ? "Already have an account? Sign in" : "No account? Sign up free"}
          </button>
        </div>
      </div>
    </div>
  );
}
