import type { MetadataRoute } from "next";
import { getGoogleInspectionRobotsRules } from "@/lib/security/google-inspection";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: getGoogleInspectionRobotsRules(),
  };
}
