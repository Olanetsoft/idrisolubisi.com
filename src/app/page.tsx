import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Speaking } from "@/components/Speaking";
import { Writing } from "@/components/Writing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Speaking />
      <Writing />
      <Contact />
    </>
  );
}
