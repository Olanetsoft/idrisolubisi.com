import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Recognition } from "@/components/Recognition";
import { Speaking } from "@/components/Speaking";
import { WhatIDo } from "@/components/WhatIDo";
import { Writing } from "@/components/Writing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatIDo />
      <Experience />
      <Projects />
      <Speaking />
      <Writing />
      <Recognition />
      <Contact />
    </>
  );
}
