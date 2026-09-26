import type { Metadata } from "next";
import { AdminUsersView } from "@/components/admin/admin-users-view";

export const metadata: Metadata = { title: "Admin · Pengguna" };

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
