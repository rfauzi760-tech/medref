import { describe, expect, it } from "vitest";
import { getApiAuthDecision, getPageAuthDecision, normalizeReturnTo } from "@/lib/auth/access-policy";

describe("kebijakan akses sesi", () => {
  it("membiarkan beranda dan halaman login tetap terbuka", () => {
    expect(getPageAuthDecision("/", false)).toEqual({ allowed: true });
    expect(getPageAuthDecision("/login", false)).toEqual({ allowed: true });
  });

  it("mengalihkan modul klinis yang belum terautentikasi dan mempertahankan tujuan", () => {
    expect(getPageAuthDecision("/drugs", false)).toEqual({
      allowed: false,
      redirectTo: "/login?next=%2Fdrugs",
    });
    expect(getPageAuthDecision("/drugs/amoxicillin?mode=anak", false)).toEqual({
      allowed: false,
      redirectTo: "/login?next=%2Fdrugs%2Famoxicillin%3Fmode%3Danak",
    });
  });

  it("mengizinkan halaman terlindungi hanya dengan sesi valid", () => {
    expect(getPageAuthDecision("/drugs", true)).toEqual({ allowed: true });
  });

  it("menolak API klinis tanpa sesi, tetapi membiarkan endpoint autentikasi", () => {
    expect(getApiAuthDecision("/api/search", false)).toEqual({ allowed: false, status: 401 });
    expect(getApiAuthDecision("/api/auth/sign-in/email", false)).toEqual({ allowed: true });
  });

  it("menolak tujuan login eksternal dan path protokol-relatif", () => {
    expect(normalizeReturnTo("https://evil.example/path")).toBe("/");
    expect(normalizeReturnTo("//evil.example/path")).toBe("/");
    expect(normalizeReturnTo("/drugs?mode=anak")).toBe("/drugs?mode=anak");
  });
});
