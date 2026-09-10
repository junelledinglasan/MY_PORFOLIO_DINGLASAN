import React, { useEffect, useState } from "react";
import { Github, Linkedin, Facebook, Mail, Send, Pencil, Check } from "lucide-react";
import AuthGate from "./AuthGate";

function ContactLinks({ colors, settings }) {
  const items = [
    { key: "email", icon: Mail, href: settings.email ? `mailto:${settings.email}` : "", label: settings.email },
    { key: "github", icon: Github, href: settings.github, label: "GitHub" },
    { key: "linkedin", icon: Linkedin, href: settings.linkedin, label: "LinkedIn" },
    { key: "facebook", icon: Facebook, href: settings.facebook, label: "Facebook" },
  ].filter((i) => i.href);

  if (items.length === 0) {
    return <p style={{ color: colors.textMuted, fontSize: 12.5 }}>No links added yet.</p>;
  }

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {items.map(({ key, icon: Icon, href, label }) => (
        <a
          key={key}
          href={href}
          target={key === "email" ? undefined : "_blank"}
          rel="noreferrer"
          data-cursor-hover
          className="jd-chip"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid ${colors.line}`,
            borderRadius: 999,
            padding: "9px 16px",
            fontSize: 12.5,
            color: colors.text,
            textDecoration: "none",
          }}
        >
          <Icon size={14} color={colors.lime} /> {label}
        </a>
      ))}
    </div>
  );
}

function SettingsEditor({ colors, authToken, settings, onSaved, onCancel }) {
  const [email, setEmail] = useState(settings.email || "");
  const [github, setGithub] = useState(settings.github || "");
  const [linkedin, setLinkedin] = useState(settings.linkedin || "");
  const [facebook, setFacebook] = useState(settings.facebook || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

  const save = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": authToken || "" },
        body: JSON.stringify({ email, github, linkedin, facebook }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't save.");
      }
      onSaved({ email, github, linkedin, facebook });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        marginTop: 18,
        border: `1px solid ${colors.line}`,
        padding: "20px 22px",
        background: colors.surface,
        maxWidth: 440,
      }}
    >
      <p style={{ fontSize: 13, color: colors.amber, margin: "0 0 14px", fontWeight: 700 }}>Edit contact links</p>
      <div style={{ display: "grid", gap: 14 }}>
        <label style={labelStyle}>
          Email
          <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </label>
        <label style={labelStyle}>
          GitHub URL
          <input style={inputStyle} value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/yourname" />
        </label>
        <label style={labelStyle}>
          LinkedIn URL
          <input style={inputStyle} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/yourname" />
        </label>
        <label style={labelStyle}>
          Facebook URL
          <input style={inputStyle} value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/yourname" />
        </label>
      </div>
      {error && <p style={{ color: "#E24B4A", fontSize: 12, marginTop: 12 }}>{error}</p>}
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="jd-btn"
          style={{
            background: colors.lime,
            color: colors.bg,
            border: "none",
            padding: "10px 18px",
            borderRadius: 2,
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {busy ? "Saving\u2026" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "transparent",
            color: colors.textMuted,
            border: `1px solid ${colors.line}`,
            padding: "10px 18px",
            borderRadius: 2,
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Contact({ colors, loaded }) {
  const [settings, setSettings] = useState({ email: "", github: "", linkedin: "", facebook: "" });
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem("jd_admin_token") || "");
  const [editingLinks, setEditingLinks] = useState(false);

  const [name, setName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    if (!name.trim() || !fromEmail.trim() || !message.trim()) {
      setFormError("Fill in your name, email, and message.");
      return;
    }
    if (!settings.email) {
      setFormError("No contact email has been set up yet.");
      return;
    }
    setFormError("");
    setSending(true);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(settings.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email: fromEmail,
          message,
          _subject: `New message from ${name} via your portfolio`,
        }),
      });
      if (!res.ok) throw new Error("Send failed.");
      setSent(true);
      setName("");
      setFromEmail("");
      setMessage("");
    } catch (err) {
      setFormError("Couldn't send that. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: colors.surface,
    border: `1px solid ${colors.line}`,
    color: colors.text,
    padding: "11px 14px",
    fontSize: 14,
    fontFamily: "'Space Mono', monospace",
    borderRadius: 2,
    marginTop: 6,
  };
  const labelStyle = { fontSize: 12, color: colors.textMuted };

  return (
    <section id="contact" style={{ padding: "8vh 6vw 14vh" }}>
      <p style={{ color: colors.amber, fontSize: 13, letterSpacing: 0.4, margin: "0 0 14px" }}>
        Contact
      </p>
      <h2
        className="jd-serif"
        style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1.15, margin: "0 0 18px", fontWeight: 480, maxWidth: 600 }}
      >
        Let's talk about work.
      </h2>
      <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.7, maxWidth: 480, margin: "0 0 32px" }}>
        Open to part-time, full-time, and freelance work &mdash; remote. Send
        a message or find me on any of these.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "5vw", alignItems: "start" }}>
        <div>
          <ContactLinks colors={colors} settings={settings} />

          {!editingLinks && (
            <button
              type="button"
              onClick={() => setEditingLinks(true)}
              style={{
                marginTop: 16,
                background: "none",
                border: "none",
                color: colors.textMuted,
                fontSize: 11.5,
                textDecoration: "underline",
                cursor: "pointer",
                fontFamily: "'Space Mono', monospace",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Pencil size={11} /> Edit links (only you should see this)
            </button>
          )}

          {editingLinks && !adminToken && (
            <AuthGate colors={colors} onUnlock={setAdminToken}>
              {() => (
                <SettingsEditor
                  colors={colors}
                  authToken={sessionStorage.getItem("jd_admin_token")}
                  settings={settings}
                  onSaved={(s) => {
                    setSettings(s);
                    setEditingLinks(false);
                  }}
                  onCancel={() => setEditingLinks(false)}
                />
              )}
            </AuthGate>
          )}

          {editingLinks && adminToken && (
            <SettingsEditor
              colors={colors}
              authToken={adminToken}
              settings={settings}
              onSaved={(s) => {
                setSettings(s);
                setEditingLinks(false);
              }}
              onCancel={() => setEditingLinks(false)}
            />
          )}
        </div>

        <form onSubmit={submitForm} style={{ display: "grid", gap: 16, maxWidth: 460 }}>
          <label style={labelStyle}>
            Your name
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label style={labelStyle}>
            Your email
            <input type="email" style={inputStyle} value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
          </label>
          <label style={labelStyle}>
            Message
            <textarea
              style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          {formError && <p style={{ color: "#E24B4A", fontSize: 12.5, margin: 0 }}>{formError}</p>}
          {sent && (
            <p style={{ color: colors.lime, fontSize: 12.5, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <Check size={14} /> Sent! I'll get back to you soon.
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            data-cursor-hover
            className="jd-btn"
            style={{
              background: colors.lime,
              color: colors.bg,
              border: "none",
              padding: "12px 22px",
              borderRadius: 2,
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifySelf: "start",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "Sending\u2026" : "Send message"} <Send size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}