import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function AuthGate({ colors, children, onUnlock }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("jd_admin_token") || "");
  const [configured, setConfigured] = useState(null);
  const [mode, setMode] = useState("login");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (token) return;
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status" }),
    })
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured);
        setMode(data.configured ? "login" : "setup");
      })
      .catch(() => setConfigured(false));
  }, [token]);

  useEffect(() => {
    if (token && onUnlock) onUnlock(token);
  }, [token]);

  const logout = () => {
    sessionStorage.removeItem("jd_admin_token");
    setToken("");
    setPassword("");
  };

  if (token) {
    return children(token, logout);
  }

  const inputStyle = {
    width: "100%",
    background: colors.bg,
    border: `1px solid ${colors.line}`,
    color: colors.text,
    padding: "10px 12px",
    fontSize: 13,
    fontFamily: "'Space Mono', monospace",
    borderRadius: 2,
    marginTop: 6,
  };
  const labelStyle = { fontSize: 12, color: colors.textMuted };
  const btnStyle = {
    background: colors.lime,
    color: colors.bg,
    border: "none",
    padding: "11px 20px",
    borderRadius: 2,
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    fontWeight: 700,
  };
  const linkBtnStyle = {
    background: "none",
    border: "none",
    color: colors.textMuted,
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
    fontFamily: "'Space Mono', monospace",
    padding: 0,
  };

  const submitSetup = async () => {
    setError("");
    if (!password || password.length < 4) {
      setError("Pick a password at least 4 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!securityAnswer.trim()) {
      setError("Enter your security answer.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup", password, securityAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed.");
      sessionStorage.setItem("jd_admin_token", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitLogin = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Wrong password.");
      sessionStorage.setItem("jd_admin_token", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async () => {
    setError("");
    if (!newPassword || newPassword.length < 4) {
      setError("Pick a new password at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", securityAnswer, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "That answer doesn't match.");
      sessionStorage.setItem("jd_admin_token", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (configured === null) {
    return <p style={{ color: colors.textMuted, fontSize: 12 }}>Checking&hellip;</p>;
  }

  return (
    <div
      style={{
        marginTop: 24,
        border: `1px solid ${colors.line}`,
        padding: "24px 26px",
        background: colors.surface,
        maxWidth: 420,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Lock size={16} color={colors.lime} />
        <p style={{ fontSize: 13, color: colors.amber, margin: 0, fontWeight: 700 }}>
          {mode === "setup" ? "Set up your admin password" : mode === "forgot" ? "Reset password" : "Enter password"}
        </p>
      </div>

      {mode === "setup" && (
        <div style={{ display: "grid", gap: 14 }}>
          <p style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.7, margin: 0 }}>
            One-time setup so only you can add projects. Also set a security
            answer in case you forget your password later.
          </p>
          <label style={labelStyle}>
            Password
            <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label style={labelStyle}>
            Confirm password
            <input type="password" style={inputStyle} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </label>
          <label style={labelStyle}>
            Security answer &mdash; your mother's first name, all lowercase, no spaces
            <input
              style={inputStyle}
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="e.g. maria"
            />
          </label>
          {error && <p style={{ color: "#E24B4A", fontSize: 12, margin: 0 }}>{error}</p>}
          <button type="button" onClick={submitSetup} disabled={busy} className="jd-btn" style={btnStyle}>
            {busy ? "Setting up\u2026" : "Set password"}
          </button>
        </div>
      )}

      {mode === "login" && (
        <div style={{ display: "grid", gap: 14 }}>
          <label style={labelStyle}>
            Password
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitLogin()}
            />
          </label>
          {error && <p style={{ color: "#E24B4A", fontSize: 12, margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button type="button" onClick={submitLogin} disabled={busy} className="jd-btn" style={btnStyle}>
              {busy ? "Checking\u2026" : "Unlock"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
              }}
              style={linkBtnStyle}
            >
              Forgot password?
            </button>
          </div>
        </div>
      )}

      {mode === "forgot" && (
        <div style={{ display: "grid", gap: 14 }}>
          <label style={labelStyle}>
            Security answer &mdash; your mother's first name, all lowercase, no spaces
            <input style={inputStyle} value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} />
          </label>
          <label style={labelStyle}>
            New password
            <input type="password" style={inputStyle} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <label style={labelStyle}>
            Confirm new password
            <input type="password" style={inputStyle} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </label>
          {error && <p style={{ color: "#E24B4A", fontSize: 12, margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button type="button" onClick={submitReset} disabled={busy} className="jd-btn" style={btnStyle}>
              {busy ? "Resetting\u2026" : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              style={linkBtnStyle}
            >
              Back to login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}