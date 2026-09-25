import { describe, expect, it } from "vitest";
import { isAuthorizedAdmin } from "@/lib/auth/admin-policy";
import { listAdminUsers } from "@/lib/auth/admin-users";

describe("otorisasi administrator RFSmed", () => {
  it("hanya mengizinkan email admin yang cocok dan sudah terverifikasi", () => {
    expect(isAuthorizedAdmin({ email: " RfAuZi760@gmail.com ", emailVerified: true }, "rfauzi760@gmail.com")).toBe(true);
    expect(isAuthorizedAdmin({ email: "rfauzi760@gmail.com", emailVerified: false }, "rfauzi760@gmail.com")).toBe(false);
    expect(isAuthorizedAdmin({ email: "other@example.com", emailVerified: true }, "rfauzi760@gmail.com")).toBe(false);
    expect(isAuthorizedAdmin({ email: "rfauzi760@gmail.com", emailVerified: true }, " ")).toBe(false);
    expect(isAuthorizedAdmin(null, "rfauzi760@gmail.com")).toBe(false);
  });
});

describe("daftar akun admin", () => {
  it("mencari akun dengan parameter, membatasi halaman, dan hanya mengambil kolom aman", async () => {
    const statements: Array<{ sql: string; values: unknown[] }> = [];
    const db = {
      prepare(sql: string) {
        return {
          bind(...values: unknown[]) {
            statements.push({ sql, values });
            return {
              all: async () => ({ results: [{ name: "Rizki", email: "rfauzi760@gmail.com", emailVerified: 1, createdAt: 1_758_000_000_000, providers: "google,credential" }] }),
              first: async () => ({ total: 1 }),
            };
          },
        };
      },
    } as unknown as D1Database;

    const result = await listAdminUsers(db, { query: "  test%' OR 1=1 --  ", page: 0, pageSize: 500 });

    expect(result).toEqual({
      users: [{ name: "Rizki", email: "rfauzi760@gmail.com", emailVerified: true, createdAt: 1_758_000_000_000, providers: ["google", "credential"] }],
      total: 1,
      page: 1,
      pageSize: 100,
      query: "test%' OR 1=1 --",
    });
    expect(statements).toHaveLength(2);
    expect(statements[0].values).toContain("test%' OR 1=1 --");
    for (const { sql } of statements) {
      expect(sql).not.toMatch(/password|accessToken|refreshToken|idToken|verification|session/i);
    }
  });

  it("membatasi teks pencarian dan ukuran halaman", async () => {
    const statements: Array<{ sql: string; values: unknown[] }> = [];
    const db = {
      prepare(sql: string) {
        return {
          bind(...values: unknown[]) {
            statements.push({ sql, values });
            return {
              all: async () => ({ results: [] }),
              first: async () => ({ total: 0 }),
            };
          },
        };
      },
    } as unknown as D1Database;

    const result = await listAdminUsers(db, { query: "x".repeat(150), page: 4, pageSize: 20 });

    expect(result.query).toHaveLength(100);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(statements[0].values).toContain("x".repeat(100));
  });
});
