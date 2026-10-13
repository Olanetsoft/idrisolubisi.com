import { HomePage } from "@/components/HomePage";
import { lensMetadata } from "@/lib/lens-metadata";

export const metadata = lensMetadata("fde");

export default function Page() {
  return <HomePage lens="fde" />;
}
