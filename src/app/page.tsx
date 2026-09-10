import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { OpenSource } from "@/components/OpenSource";
import { Speaking } from "@/components/Speaking";
import { Work } from "@/components/Work";
import { Writing } from "@/components/Writing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Speaking />
      <Experience />
      <Writing />
      <OpenSource />
      <Contact />
    </>
  );
}
