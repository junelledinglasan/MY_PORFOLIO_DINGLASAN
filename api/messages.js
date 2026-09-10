import { neon } from "@neondatabase/serverless";
import { isAuthorized } from "./_lib/auth.js";

const sql = neon(process.env.DATABASE_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export default async function handler(req, res) {
  try {
    await ensureTable();

    if (req.method === "POST") {
      const { name, email, message } = req.body || {};
      if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
        res.status(400).json({ error: "Name, email, and message are all required." });
        return;
      }
      await sql`
        INSERT INTO contact_messages (name, email, message)
        VALUES (${name.trim()}, ${email.trim()}, ${message.trim()});
      `;
      res.status(201).json({ ok: true });
      return;
    }

    if (req.method === "GET") {
      if (!(await isAuthorized(sql, req))) {
        res.status(401).json({ error: "Not authorized." });
        return;
      }
      const rows = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC;`;
      res.status(200).json(
        rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          message: r.message,
          createdAt: r.created_at,
        }))
      );
      return;
    }

    if (req.method === "DELETE") {
      if (!(await isAuthorized(sql, req))) {
        res.status(401).json({ error: "Not authorized." });
        return;
      }
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ error: "Missing message id." });
        return;
      }
      await sql`DELETE FROM contact_messages WHERE id = ${id};`;
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}