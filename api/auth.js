import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL);

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function normalizeAnswer(answer) {
  return String(answer || "").toLowerCase().replace(/\s+/g, "");
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_auth (
      id INT PRIMARY KEY DEFAULT 1,
      password_hash TEXT NOT NULL,
      answer_hash TEXT NOT NULL,
      session_token TEXT
    );
  `;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await ensureTable();
    const { action } = req.body || {};

    if (action === "status") {
      const rows = await sql`SELECT id FROM admin_auth WHERE id = 1;`;
      res.status(200).json({ configured: rows.length > 0 });
      return;
    }

    if (action === "setup") {
      const { password, securityAnswer } = req.body;
      if (!password || String(password).length < 4) {
        res.status(400).json({ error: "Password must be at least 4 characters." });
        return;
      }
      if (!securityAnswer || !normalizeAnswer(securityAnswer)) {
        res.status(400).json({ error: "Security answer is required." });
        return;
      }
      const existing = await sql`SELECT id FROM admin_auth WHERE id = 1;`;
      if (existing.length > 0) {
        res.status(400).json({ error: "Already set up." });
        return;
      }
      const token = crypto.randomBytes(24).toString("hex");
      await sql`
        INSERT INTO admin_auth (id, password_hash, answer_hash, session_token)
        VALUES (1, ${hash(password)}, ${hash(normalizeAnswer(securityAnswer))}, ${token});
      `;
      res.status(201).json({ token });
      return;
    }

    if (action === "login") {
      const { password } = req.body;
      const rows = await sql`SELECT password_hash FROM admin_auth WHERE id = 1;`;
      if (rows.length === 0) {
        res.status(400).json({ error: "Not set up yet." });
        return;
      }
      if (rows[0].password_hash !== hash(password)) {
        res.status(401).json({ error: "Wrong password." });
        return;
      }
      const token = crypto.randomBytes(24).toString("hex");
      await sql`UPDATE admin_auth SET session_token = ${token} WHERE id = 1;`;
      res.status(200).json({ token });
      return;
    }

    if (action === "reset-password") {
      const { securityAnswer, newPassword } = req.body;
      if (!newPassword || String(newPassword).length < 4) {
        res.status(400).json({ error: "New password must be at least 4 characters." });
        return;
      }
      const rows = await sql`SELECT answer_hash FROM admin_auth WHERE id = 1;`;
      if (rows.length === 0) {
        res.status(400).json({ error: "Not set up yet." });
        return;
      }
      if (rows[0].answer_hash !== hash(normalizeAnswer(securityAnswer))) {
        res.status(401).json({ error: "That answer doesn't match." });
        return;
      }
      const token = crypto.randomBytes(24).toString("hex");
      await sql`UPDATE admin_auth SET password_hash = ${hash(newPassword)}, session_token = ${token} WHERE id = 1;`;
      res.status(200).json({ token });
      return;
    }

    res.status(400).json({ error: "Unknown action." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}