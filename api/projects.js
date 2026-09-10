import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          tags JSONB DEFAULT '[]',
          link TEXT,
          file_name TEXT,
          file_data TEXT,
          images JSONB DEFAULT '[]',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC;`;
      const projects = rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description || "",
        tags: r.tags || [],
        link: r.link || "",
        fileName: r.file_name || "",
        fileData: r.file_data || "",
        images: r.images || [],
      }));
      res.status(200).json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const authToken = req.headers["x-auth-token"];
      const authRows = await sql`
        SELECT session_token FROM admin_auth WHERE id = 1;
      `.catch(() => []);
      if (!authToken || authRows.length === 0 || authRows[0].session_token !== authToken) {
        res.status(401).json({ error: "Not authorized." });
        return;
      }

      const { title, description, tags, link, fileName, fileData, images } = req.body || {};
      if (!title || !String(title).trim()) {
        res.status(400).json({ error: "Title is required." });
        return;
      }

      await sql`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          tags JSONB DEFAULT '[]',
          link TEXT,
          file_name TEXT,
          file_data TEXT,
          images JSONB DEFAULT '[]',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      const result = await sql`
        INSERT INTO projects (title, description, tags, link, file_name, file_data, images)
        VALUES (
          ${title},
          ${description || ""},
          ${JSON.stringify(tags || [])}::jsonb,
          ${link || ""},
          ${fileName || ""},
          ${fileData || ""},
          ${JSON.stringify(images || [])}::jsonb
        )
        RETURNING id;
      `;

      res.status(201).json({ id: result[0].id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: "Method not allowed" });
}