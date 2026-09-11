import Icd10PageClient from "@/components/catalog-pages/icd10-page-client";
import { icd10Codes } from "@/lib/data/icd10";

export default function Icd10Page() {
  return <Icd10PageClient items={icd10Codes} />;
}
