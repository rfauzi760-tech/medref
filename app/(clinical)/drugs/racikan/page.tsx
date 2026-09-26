import { redirect } from "next/navigation";

export default function RacikanPage() {
  redirect("/drugs?tab=racikan");
}
