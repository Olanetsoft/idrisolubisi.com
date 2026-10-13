import type { LensKey } from "@/data/lenses";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { LensProvider } from "./LensProvider";
import { Projects } from "./Projects";
import { Recognition } from "./Recognition";
import { Talks } from "./Talks";
import { WhatIDo } from "./WhatIDo";
import { Writing } from "./Writing";

/** The one-page portfolio, pitched for the given lens. */
export function HomePage({ lens }: { lens: LensKey }) {
  return (
    <LensProvider initial={lens}>
      <Hero />
      <Projects />
      <Talks />
      <Experience />
      <WhatIDo />
      <Writing />
      <Recognition />
      <Contact />
    </LensProvider>
  );
}
