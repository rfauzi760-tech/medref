import { redirect } from "next/navigation";

export default function JagamateToolsPage() {
  redirect("/drugs?tab=tools");
}
