import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function isAuthorized(req) {
  const authToken = req.headers["x-auth-token"];
  const rows = await sql`SELECT session_token FROM admin_auth WHERE id = 1;`.catch(() => []);
  return Boolean(authToken) && rows.length > 0 && rows[0].session_token === authToken;
}

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
      if (!(await isAuthorized(req))) {
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

  if (req.method === "PUT") {
    try {
      if (!(await isAuthorized(req))) {
        res.status(401).json({ error: "Not authorized." });
        return;
      }
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ error: "Missing project id." });
        return;
      }
      const { title, description, tags, link, fileName, fileData, images } = req.body || {};
      if (!title || !String(title).trim()) {
        res.status(400).json({ error: "Title is required." });
        return;
      }

      await sql`
        UPDATE projects SET
          title = ${title},
          description = ${description || ""},
          tags = ${JSON.stringify(tags || [])}::jsonb,
          link = ${link || ""},
          file_name = ${fileName || ""},
          file_data = ${fileData || ""},
          images = ${JSON.stringify(images || [])}::jsonb
        WHERE id = ${id};
      `;

      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      if (!(await isAuthorized(req))) {
        res.status(401).json({ error: "Not authorized." });
        return;
      }
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ error: "Missing project id." });
        return;
      }
      await sql`DELETE FROM projects WHERE id = ${id};`;
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).json({ error: "Method not allowed" });
}