import React, { useRef, useState } from "react";
import { Upload, Paperclip, X, Check } from "lucide-react";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProjectComposer({ colors, onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setImages((prev) => [...prev, ...dataUrls]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const dataUrl = await fileToDataUrl(f);
    setFile({ name: f.name, dataUrl, size: f.size });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setLink("");
    setImages([]);
    setFile(null);
  };

  const submit = async () => {
    if (!title.trim()) {
      setError("Enter a project title first.");
      return;
    }
    setError("");
    setSubmitting(true);
    setSuccess(false);

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          tags: tagList,
          link: link.trim(),
          fileName: file ? file.name : "",
          fileData: file ? file.dataUrl : "",
          images,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      resetForm();
      setSuccess(true);
      onAdded && onAdded();
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(
        err.message && err.message !== "Failed to fetch"
          ? `Couldn't save that: ${err.message}`
          : "Couldn't reach the server. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: colors.surface,
    border: `1px solid ${colors.line}`,
    color: colors.text,
    padding: "10px 12px",
    fontSize: 13,
    fontFamily: "'Space Mono', monospace",
    borderRadius: 2,
    marginTop: 6,
  };

  const labelStyle = { fontSize: 12, color: colors.textMuted };

  return (
    <div
      style={{
        marginTop: 24,
        border: `1px solid ${colors.line}`,
        padding: "24px 26px",
        background: colors.surface,
      }}
    >
      <p style={{ fontSize: 13, color: colors.amber, margin: "0 0 4px", fontWeight: 700 }}>
        Add a project
      </p>
      <p style={{ fontSize: 12.5, color: colors.textMuted, margin: "0 0 20px", lineHeight: 1.7 }}>
        Fill this in and submit &mdash; it saves straight to the database and
        shows up above right away, for anyone who visits the site.
      </p>

      <div style={{ display: "grid", gap: 16, maxWidth: 520 }}>
        <label style={labelStyle}>
          Title
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekend recipe finder" />
        </label>

        <label style={labelStyle}>
          Description
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does it do, what did you build it with"
          />
        </label>

        <label style={labelStyle}>
          Tags (comma-separated)
          <input style={inputStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="React, Firebase, Tailwind" />
        </label>

        <label style={labelStyle}>
          Link (optional)
          <input style={inputStyle} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
        </label>

        <div>
          <p style={labelStyle}>Images (optional, you can pick several)</p>
          <button
            type="button"
            data-cursor-hover
            onClick={() => imageInputRef.current && imageInputRef.current.click()}
            className="jd-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: colors.text,
              background: "transparent",
              border: `1px solid ${colors.line}`,
              borderRadius: 2,
              padding: "9px 16px",
              marginTop: 6,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <Upload size={13} /> Choose images
          </button>
          <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} />

          {images.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {images.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt="" style={{ width: 64, height: 64, objectFit: "cover", border: `1px solid ${colors.line}` }} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: colors.bg,
                      border: `1px solid ${colors.line}`,
                      color: colors.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p style={labelStyle}>Attach a file (optional &mdash; PDF, doc, etc.)</p>
          <button
            type="button"
            data-cursor-hover
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="jd-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: colors.text,
              background: "transparent",
              border: `1px solid ${colors.line}`,
              borderRadius: 2,
              padding: "9px 16px",
              marginTop: 6,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <Paperclip size={13} /> {file ? file.name : "Choose file"}
          </button>
          <input ref={fileInputRef} type="file" onChange={handleFile} style={{ display: "none" }} />
          {file && file.size > 1500000 && (
            <p style={{ fontSize: 11.5, color: colors.amber, marginTop: 8 }}>
              That file is a bit large ({Math.round(file.size / 1024)} KB) &mdash; it'll
              still upload, just slower.
            </p>
          )}
        </div>
      </div>

      {error && <p style={{ fontSize: 12.5, color: "#E24B4A", marginTop: 16, maxWidth: 480, lineHeight: 1.6 }}>{error}</p>}
      {success && (
        <p style={{ fontSize: 12.5, color: colors.lime, marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={14} /> Added &mdash; it's live above.
        </p>
      )}

      <button
        type="button"
        data-cursor-hover
        onClick={submit}
        disabled={submitting}
        className="jd-btn"
        style={{
          marginTop: 20,
          background: colors.lime,
          color: colors.bg,
          border: "none",
          padding: "11px 20px",
          borderRadius: 2,
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          fontWeight: 700,
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Saving\u2026" : "Add project"}
      </button>
    </div>
  );
}