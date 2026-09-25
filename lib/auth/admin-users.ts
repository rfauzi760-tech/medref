export type AdminUserSummary = {
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: number;
  providers: string[];
};

export type AdminUsersResult = {
  users: AdminUserSummary[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
};

type AdminUsersOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

type AdminUserRow = {
  name: string;
  email: string;
  emailVerified: number | boolean;
  createdAt: number;
  providers: string | null;
};

export async function listAdminUsers(
  db: D1Database,
  options: AdminUsersOptions = {},
): Promise<AdminUsersResult> {
  const query = (options.query ?? "").trim().slice(0, 100);
  const requestedPage = Number.isSafeInteger(options.page) ? Math.min(1_000_000, Math.max(1, Math.floor(options.page!))) : 1;
  const pageSize = Number.isSafeInteger(options.pageSize)
    ? Math.min(100, Math.max(1, Math.floor(options.pageSize!)))
    : 50;
  const filter = `(? = '' OR instr(lower(u.email), lower(?)) > 0 OR instr(lower(u.name), lower(?)) > 0)`;

  const count = await db.prepare(`
      SELECT COUNT(*) AS total
      FROM user AS u
      WHERE ${filter}
    `).bind(query, query, query).first<{ total: number }>();
  const total = count?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const offset = (page - 1) * pageSize;

  const list = await db.prepare(`
      SELECT u.name, u.email, u.emailVerified, u.createdAt,
             GROUP_CONCAT(DISTINCT a.providerId) AS providers
      FROM user AS u
      LEFT JOIN account AS a ON a.userId = u.id
      WHERE ${filter}
      GROUP BY u.id
      ORDER BY u.createdAt DESC
      LIMIT ? OFFSET ?
    `).bind(query, query, query, pageSize, offset).all<AdminUserRow>();

  return {
    users: (list.results ?? []).map((row) => ({
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified === true || row.emailVerified === 1,
      createdAt: row.createdAt,
      providers: row.providers ? row.providers.split(",").filter(Boolean) : [],
    })),
    total,
    page,
    pageSize,
    query,
  };
}
