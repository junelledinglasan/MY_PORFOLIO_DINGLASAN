import { neon } from "@neondatabase/serverless";
import { isAuthorized } from "./_lib/auth.js";

const sql = neon(process.env.DATABASE_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY DEFAULT 1,
      email TEXT DEFAULT '',
      github TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      facebook TEXT DEFAULT ''
    );
  `;
}

export default async function handler(req, res) {
  try {
    await ensureTable();

    if (req.method === "GET") {
      const rows = await sql`SELECT email, github, linkedin, facebook FROM site_settings WHERE id = 1;`;
      if (rows.length === 0) {
        res.status(200).json({ email: "", github: "", linkedin: "", facebook: "" });
        return;
      }
      res.status(200).json(rows[0]);
      return;
    }

    if (req.method === "PUT") {
      if (!(await isAuthorized(sql, req))) {
        res.status(401).json({ error: "Not authorized." });
        return;
      }
      const { email, github, linkedin, facebook } = req.body || {};
      await sql`
        INSERT INTO site_settings (id, email, github, linkedin, facebook)
        VALUES (1, ${email || ""}, ${github || ""}, ${linkedin || ""}, ${facebook || ""})
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          github = EXCLUDED.github,
          linkedin = EXCLUDED.linkedin,
          facebook = EXCLUDED.facebook;
      `;
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}