import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { id } = req.body || {};
    if (!id) {
      res.status(400).json({ error: "Missing project id." });
      return;
    }
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;`;
    await sql`UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = ${id};`;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}