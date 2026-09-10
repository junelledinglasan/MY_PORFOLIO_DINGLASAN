export async function isAuthorized(sql, req) {
  const authToken = req.headers["x-auth-token"];
  const rows = await sql`SELECT session_token FROM admin_auth WHERE id = 1;`.catch(() => []);
  return Boolean(authToken) && rows.length > 0 && rows[0].session_token === authToken;
}